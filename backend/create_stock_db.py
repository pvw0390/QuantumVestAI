import FinanceDataReader as fdr
import json


stock_db = {}


# 한국 주식
krx = fdr.StockListing('KRX')

for _, row in krx.iterrows():

    try:

        name = str(row['Name']).strip()

        # 우선주 / 보통주 제거
        if "보통주" in name:
            continue

        if "우선주" in name:
            continue

        # 스팩 제거
        if "스팩" in name:
            continue

        # ETF 제거
        if "ETF" in name:
            continue

        # ETN 제거
        if "ETN" in name:
            continue

        # 리츠 제거
        if "리츠" in name:
            continue

        code = str(row['Code']).strip()

        stock_db[name] = {

            "ticker": f"{code}.KS",

            "tv_symbol": f"KRX:{code}"
        }

    except:
        pass


# 미국 NASDAQ
nasdaq = fdr.StockListing('NASDAQ')

for _, row in nasdaq.iterrows():

    try:

        name = str(row['Name']).strip()

        symbol = str(row['Symbol']).strip()

        stock_db[name] = {

            "ticker": symbol,

            "tv_symbol": f"NASDAQ:{symbol}"
        }

    except:
        pass


# 미국 NYSE
nyse = fdr.StockListing('NYSE')

for _, row in nyse.iterrows():

    try:

        name = str(row['Name']).strip()

        symbol = str(row['Symbol']).strip()

        stock_db[name] = {

            "ticker": symbol,

            "tv_symbol": f"NYSE:{symbol}"
        }

    except:
        pass


# 저장
with open(
    'stocks.json',
    'w',
    encoding='utf-8'
) as f:

    json.dump(
        stock_db,
        f,
        ensure_ascii=False,
        indent=4
    )

print('✅ stocks.json 생성 완료')