import { useState, useEffect } from 'react'
import axios from 'axios'

import StockChart from './components/StockChart'

function App() {

  const [ticker, setTicker] = useState('')

  const [data, setData] = useState(null)

  // 관심 종목
  const [favorites, setFavorites] = useState([])

  // localStorage 불러오기
  useEffect(() => {

    const savedFavorites =
      localStorage.getItem('favorites')

    if (savedFavorites) {

      setFavorites(
        JSON.parse(savedFavorites)
      )
    }

  }, [])

  // 관심 종목 추가
  const addFavorite = () => {

    if (!data) return

    if (
      favorites.includes(data.display_ticker)
    ) return

    const updatedFavorites = [

      ...favorites,

      data.display_ticker
    ]

    setFavorites(updatedFavorites)

    localStorage.setItem(

      'favorites',

      JSON.stringify(updatedFavorites)
    )
  }

  // 관심 종목 삭제
  const removeFavorite = (stock) => {

    const updatedFavorites =
      favorites.filter(

        (item) => item !== stock
      )

    setFavorites(updatedFavorites)

    localStorage.setItem(

      'favorites',

      JSON.stringify(updatedFavorites)
    )
  }

  // 시장 데이터
  const marketData = [

    {
      name: 'NASDAQ',
      value: '+1.82%',
      color: '#00ff88'
    },

    {
      name: 'KOSPI',
      value: '+0.74%',
      color: '#00ff88'
    },

    {
      name: 'BTC',
      value: '$64,200',
      color: '#00f2ff'
    },

    {
      name: 'USD/KRW',
      value: '₩1,382',
      color: '#ffd700'
    }
  ]

  // 검색
  const searchStock = async () => {

    try {

      const res = await axios.get(

        `http://127.0.0.1:8000/stock/${ticker}`
      )

      console.log(res.data)

      setData(res.data)

    } catch (e) {

      console.error(e)
    }
  }

  return (

    <div
      style={{
        background: '#050816',
        minHeight: '100vh',
        color: 'white',
        padding: '50px',
        fontFamily: 'Arial'
      }}
    >

      {/* 제목 */}

      <h1
        style={{
          color: '#00f2ff',
          fontSize: '60px',
          textAlign: 'center',
          marginBottom: '40px',
          textShadow: '0 0 20px #00f2ff'
        }}
      >
        QuantumVest AI
      </h1>

      {/* 시장 대시보드 */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(4, 1fr)',

          gap: '20px',

          marginBottom: '50px'
        }}
      >

        {
          marketData.map((item, index) => (

            <div
              key={index}
              style={{
                background:
                  'rgba(17, 24, 39, 0.9)',

                padding: '25px',

                borderRadius: '20px',

                textAlign: 'center',

                boxShadow:
                  '0 0 15px rgba(0,242,255,0.15)'
              }}
            >

              <div
                style={{
                  color: '#94a3b8',

                  fontSize: '18px',

                  marginBottom: '10px'
                }}
              >
                {item.name}
              </div>

              <div
                style={{
                  color: item.color,

                  fontSize: '28px',

                  fontWeight: 'bold'
                }}
              >
                {item.value}
              </div>

            </div>

          ))
        }

      </div>

      {/* 검색창 */}

      <div
        style={{
          display: 'flex',

          justifyContent: 'center',

          marginBottom: '50px'
        }}
      >

        <input

          placeholder="
삼성전자 / 엔비디아 / 애플 / AAPL / NVDA
"

          value={ticker}

          onChange={(e) =>
            setTicker(e.target.value)
          }

          onKeyDown={(e) => {

            if (e.key === 'Enter') {

              searchStock()
            }
          }}

          style={{
            padding: '18px',

            width: '420px',

            marginRight: '10px',

            borderRadius: '12px',

            border:
              '2px solid #00f2ff',

            background: '#111827',

            color: 'white',

            fontSize: '18px',

            outline: 'none'
          }}
        />

        <button

          onClick={searchStock}

          style={{
            padding: '18px 25px',

            background: '#00f2ff',

            border: 'none',

            borderRadius: '12px',

            cursor: 'pointer',

            fontWeight: 'bold',

            fontSize: '16px'
          }}
        >
          분석하다
        </button>

      </div>

      {/* 관심 종목 */}

      <div
        style={{
          maxWidth: '1000px',

          margin: '0 auto 50px auto',

          background:
            'rgba(17, 24, 39, 0.9)',

          padding: '30px',

          borderRadius: '20px',

          boxShadow:
            '0 0 20px rgba(255,215,0,0.15)'
        }}
      >

        <div
          style={{
            fontSize: '30px',

            color: '#ffd700',

            marginBottom: '20px',

            fontWeight: 'bold'
          }}
        >
          ⭐ 관심 종목
        </div>

        {
          favorites.length === 0 && (

            <div
              style={{
                color: '#94a3b8'
              }}
            >
              저장된 관심 종목이 없습니다.
            </div>
          )
        }

        {
          favorites.map((stock, index) => (

            <div
              key={index}
              style={{
                display: 'flex',

                justifyContent:
                  'space-between',

                alignItems: 'center',

                background: '#0f172a',

                padding: '15px',

                borderRadius: '12px',

                marginBottom: '10px'
              }}
            >

              <div
                style={{
                  fontSize: '20px'
                }}
              >
                {stock}
              </div>

              <button

                onClick={() =>
                  removeFavorite(stock)
                }

                style={{
                  background: '#ff4d4d',

                  border: 'none',

                  padding: '10px 15px',

                  borderRadius: '10px',

                  color: 'white',

                  cursor: 'pointer'
                }}
              >
                삭제
              </button>

            </div>

          ))
        }

      </div>

      {/* 결과 */}

      {
        data && (

          <div
            style={{
              maxWidth: '1200px',

              margin: '0 auto',

              background:
                'rgba(17, 24, 39, 0.9)',

              padding: '40px',

              borderRadius: '25px',

              boxShadow:
                '0 0 25px rgba(0,242,255,0.3)',

              textAlign: 'center'
            }}
          >

            {/* 종목명 */}

            <h2
              style={{
                fontSize: '46px',

                marginBottom: '20px',

                color: '#00f2ff'
              }}
            >
              {data.display_ticker}
            </h2>

            {/* 관심 종목 버튼 */}

            <button

              onClick={addFavorite}

              style={{
                background: '#ffd700',

                color: '#050816',

                border: 'none',

                padding: '14px 24px',

                borderRadius: '12px',

                fontWeight: 'bold',

                cursor: 'pointer',

                marginBottom: '30px',

                fontSize: '16px'
              }}
            >
              ⭐ 관심 종목 추가
            </button>

            {/* 가격 */}

            <div
              style={{
                fontSize: '26px',

                lineHeight: '2'
              }}
            >

              <p>

                현재 가격:

                <span
                  style={{
                    color: '#00f2ff',

                    fontWeight: 'bold'
                  }}
                >
                  {' '}

                  {data.currency}

                  {data.current_price}
                </span>

              </p>

              <p>

                목표 가격:

                <span
                  style={{
                    color: '#00ff88',

                    fontWeight: 'bold'
                  }}
                >
                  {' '}

                  {data.currency}

                  {data.target_price}
                </span>

              </p>

              <p>

                RSI:

                <span
                  style={{
                    color:
                      data.rsi > 70

                        ? '#ff4d4d'

                        : data.rsi < 30

                          ? '#00ff88'

                          : '#ffd700',

                    fontWeight: 'bold'
                  }}
                >
                  {' '}

                  {data.rsi}
                </span>

              </p>

            </div>

            {/* AI 시그널 */}

            <div
              style={{
                marginTop: '30px',

                fontSize: '38px',

                fontWeight: 'bold',

                color:
                  data.buy_signal
                    === '강력 매수'

                    ? '#00ff88'

                    : data.buy_signal
                      === '매수'

                      ? '#00f2ff'

                      : data.buy_signal
                        === '보유'

                        ? '#ffd700'

                        : '#ff4d4d'
              }}
            >
              {data.buy_signal}
            </div>

            {/* AI 분석 */}

            <div
              style={{
                marginTop: '25px',
                background: '#0f172a',
                padding: '25px',
                borderRadius: '15px',
                color: '#cbd5e1',
                fontSize: '18px',
                lineHeight: '1.8',
                boxShadow:
                  '0 0 15px rgba(0,242,255,0.15)'
              }}
            >
              🤖 AI 분석

              <br /><br />

              {data.ai_comment}
            </div>

            {/* AI 미래 예측 */}

            {
              data.predictions && (

                <div
                  style={{
                    marginTop: '60px',

                    background: '#0f172a',

                    padding: '35px',

                    borderRadius: '20px',

                    boxShadow:
                      '0 0 20px rgba(0,242,255,0.2)'
                  }}
                >

                  <div
                    style={{
                      color: '#00f2ff',

                      fontSize: '32px',

                      marginBottom: '25px',

                      fontWeight: 'bold'
                    }}
                  >
                    🤖 AI 미래 가격 예측
                  </div>

                  <div
                    style={{
                      display: 'grid',

                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(120px, 1fr))',

                      gap: '15px',

                      overflowX: 'auto'
                    }}
                  >

                    {
                      data.predictions?.map(

                        (price, index) => (

                          <div
                            key={index}
                            style={{
                              background: '#111827',

                              padding: '20px',

                              borderRadius: '15px',

                              boxShadow:
                                '0 0 15px rgba(0,255,136,0.15)',

                              minWidth: '120px'
                            }}
                          >

                            <div
                              style={{
                                color: '#94a3b8',

                                marginBottom: '10px'
                              }}
                            >
                              {index + 1}일차
                            </div>

                            <div
                              style={{
                                color: '#00ff88',

                                fontWeight: 'bold',

                                fontSize: '20px'
                              }}
                            >
                              {data.currency}
                              {price}
                            </div>

                          </div>
                        )
                      )
                    }

                  </div>

                </div>
              )
            }

            {/* 차트 */}

            {
              data.history && (

                <StockChart
                  prices={data.history}
                />
              )
            }

          </div>

        )
      }

    </div>
  )
}

export default App