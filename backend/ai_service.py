from transformers import pipeline
sentiment_pipeline = pipeline(
    "sentiment-analysis"
)


# 뉴스 감성 분석

def analyze_news_sentiment(news_list):

    positive = 0
    negative = 0

    for news in news_list:

        result = sentiment_pipeline(news)[0]

        if result['label'] == 'POSITIVE':
            positive += 1
        else:
            negative += 1

    total = positive + negative

    if total == 0:
        return {
            "positive": 50,
            "negative": 50
        }

    return {
        "positive": round((positive / total) * 100, 1),
        "negative": round((negative / total) * 100, 1)
    }


# AI 투자 리포트 생성

def generate_ai_report(data):

    rsi = data['rsi']

    signal = data['buy_signal']

    if signal == 'STRONG BUY':

        report = f"""
현재 RSI는 {rsi}로 저평가 구간에 위치해 있습니다.

AI 분석 결과 매수 가능성이 높으며,
단기 반등 확률이 높다고 판단됩니다.

현재는 분할 매수 전략이 유효할 수 있습니다.
        """

    elif signal == 'SELL':

        report = f"""
현재 RSI는 {rsi}로 과매수 상태입니다.

단기 조정 가능성이 존재하며,
보수적인 접근이 필요합니다.

일부 차익 실현 전략이 유효할 수 있습니다.
        """

    else:

        report = f"""
현재 RSI는 {rsi} 수준입니다.

뚜렷한 과매수/과매도 신호는 없으며,
추세 확인이 필요한 구간입니다.

추가 거래량 및 뉴스 흐름 확인이 필요합니다.
        """

    return report.strip()