import yfinance as yf
import pandas as pd
import numpy as np
import json

from sklearn.linear_model import LinearRegression

from ai_service import analyze_news_sentiment
from ai_service import generate_ai_report


# stocks.json 불러오기
with open(
    'stocks.json',
    'r',
    encoding='utf-8'
) as f:

    stock_db = json.load(f)


# 별칭
alias_map = {

    # 미국
    "애플": "AAPL",

    "엔비디아": "NVDA",

    "테슬라": "TSLA",

    "마이크로소프트": "MSFT",

    "구글": "GOOGL",

    "아마존": "AMZN",

    # 한국
    "삼성전자": "005930.KS",

    "sk하이닉스": "000660.KS",

    "카카오": "035720.KS",

    "네이버": "035420.KS",

    "현대차": "005380.KS",

    "lg에너지솔루션": "373220.KS"
}


# RSI 계산
def calculate_rsi(data, period=14):

    delta = data['Close'].diff()

    gain = delta.clip(lower=0)

    loss = -1 * delta.clip(upper=0)

    avg_gain = gain.rolling(window=period).mean()

    avg_loss = loss.rolling(window=period).mean()

    rs = avg_gain / avg_loss

    rsi = 100 - (100 / (1 + rs))

    return round(rsi.iloc[-1], 2)


# AI 미래 가격 예측
def predict_future_prices(prices, days=7):

    y = np.array(prices)

    X = np.array(
        range(len(y))
    ).reshape(-1, 1)

    model = LinearRegression()

    model.fit(X, y)

    future_x = np.array(
        range(len(y), len(y) + days)
    ).reshape(-1, 1)

    predictions = model.predict(future_x)

    return [

        round(float(p), 2)

        for p in predictions
    ]


# 메인 함수
def get_stock_data(ticker):

    ticker = ticker.strip()

    ticker_lower = ticker.lower()

    stock_info = None

    # 별칭 처리
    if ticker_lower in alias_map:

        ticker = alias_map[ticker_lower]

    # 한국 숫자 코드 처리
    if ticker.isdigit():

        ticker = f"{ticker}.KS"

    # 직접 티커 입력 처리
    if (
        '.KS' in ticker
        or ticker.isupper()
    ):

        stock_info = {

            "ticker": ticker,

            "tv_symbol":

                f"KRX:{ticker.replace('.KS', '')}"

                if '.KS' in ticker

                else f"NASDAQ:{ticker}"
        }

    # stocks.json 검색
    elif ticker in stock_db:

        stock_info = stock_db[ticker]

    else:

        return {

            "error":
                "종목을 찾을 수 없습니다."
        }

    ticker_symbol = stock_info["ticker"]

    tv_symbol = stock_info["tv_symbol"]

    try:

        stock = yf.Ticker(ticker_symbol)

        hist = stock.history(period="6mo")

        # 데이터 없는 경우
        if hist.empty:

            return {

                "ticker": ticker,

                "error":
                    "종목 데이터를 찾을 수 없습니다."
            }

        current_price = round(

            hist['Close'].iloc[-1],

            2
        )

        target_price = round(

            current_price * 1.15,

            2
        )

        rsi = calculate_rsi(hist)

        # 한국 주식 여부
        is_korean = ".KS" in ticker_symbol

        # AI 시그널
        if rsi < 30:

            buy_signal = "강력 매수"

        elif rsi < 45:

            buy_signal = "매수"

        elif rsi < 70:

            buy_signal = "보유"

        else:

            buy_signal = "매도"

        # AI 코멘트 생성
        if buy_signal == "강력 매수":

            ai_comment = (
                "현재 주가는 저평가 구간으로 분석됩니다. "
                "반등 가능성이 높아 장기 투자 관점에서 긍정적입니다."
            )

        elif buy_signal == "매수":

            ai_comment = (
                "최근 흐름이 안정적이며 상승 가능성이 있습니다. "
                "분할 매수 전략이 유효할 수 있습니다."
            )

        elif buy_signal == "보유":

            ai_comment = (
                "현재 주가는 안정적인 흐름을 보이고 있습니다. "
                "추가 매수보다는 보유 관점이 적절해 보입니다."
            )

        else:

            ai_comment = (
                "현재 RSI가 과열 구간에 진입했습니다. "
                "단기 하락 가능성이 있어 주의가 필요합니다."
            )

        # 뉴스 감성 분석
        news_sentiment = analyze_news_sentiment([

            "Strong earnings growth expected",

            "Institutional investors increasing positions",

            "Technology sector momentum continues",

            "Market volatility remains moderate"
        ])

        # AI 리포트
        ai_report = generate_ai_report({

            "rsi": rsi,

            "buy_signal": buy_signal
        })

        # 과거 가격
        history_prices = [

            round(float(price), 2)

            for price in hist['Close'].tolist()
        ]

        # 미래 예측
        predicted_prices = predict_future_prices(

            history_prices[-30:],

            7
        )

        return {

            # 사용자가 입력한 값
            "ticker": ticker,

            # 실제 티커
            "display_ticker": ticker_symbol,

            # TradingView 심볼
            "tv_symbol": tv_symbol,

            # 통화 표시
            "currency": (

                "₩"

                if is_korean

                else "$"
            ),

            "current_price": current_price,

            "target_price": target_price,

            "rsi": rsi,

            # AI 시그널
            "buy_signal": buy_signal,

            # AI 코멘트
            "ai_comment": ai_comment,

            # 과거 가격
            "history": history_prices,

            # 미래 예측
            "predictions": predicted_prices,

            # 뉴스 감성 분석
            "news_sentiment": news_sentiment,

            # AI 리포트
            "ai_report": ai_report
        }

    except Exception as e:

        return {

            "ticker": ticker,

            "error": str(e)
        }