import { useEffect, useRef } from 'react'

import {
  createChart
} from 'lightweight-charts'

function StockChart({ prices }) {

  const chartContainerRef = useRef()

  useEffect(() => {

    if (!prices || prices.length === 0) return

    const chart = createChart(
      chartContainerRef.current,
      {
        width: 1000,
        height: 500,

        layout: {
          background: {
            color: '#0f172a'
          },

          textColor: '#ffffff'
        },

        grid: {

          vertLines: {
            color: '#1e293b'
          },

          horzLines: {
            color: '#1e293b'
          }
        }
      }
    )

    const lineSeries =
      chart.addLineSeries({

        color: '#00f2ff',

        lineWidth: 3
      })

    const chartData = prices.map(

      (price, index) => ({

        time: index + 1,

        value: price
      })
    )

    lineSeries.setData(chartData)

    chart.timeScale().fitContent()

    return () => chart.remove()

  }, [prices])

  return (

    <div
      ref={chartContainerRef}
      style={{
        marginTop: '40px'
      }}
    />
  )
}

export default StockChart