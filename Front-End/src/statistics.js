import React, { useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Router, Link } from "@reach/router";

export function Statistics() {
  const data = [
    {
      "id": "Fruits",
      "color": "rgb(97, 205, 187)",
      "data": [
        {
          "x": "12-DEC",
          "y": 12
        },
        {
          "x": "14-DEC",
          "y": 25
        },
        {
          "x": "16-DEC",
          "y": 36
        },
        {
          "x": "18-DEC",
          "y": 20
        },
        {
          "x": "20-DEC",
          "y": 56
        },
        {
          "x": "22-DEC",
          "y": 68
        },
        {
          "x": "24-DEC",
          "y": 87
        },
        {
          "x": "26-DEC",
          "y": 99
        },
        {
          "x": "28-DEC",
          "y": 98
        },
        {
          "x": "30-DEC",
          "y": 87
        },
        {
          "x": "02-JAN",
          "y": 79
        },
        {
          "x": "04-JAN",
          "y": 99
        }
      ]
    },

    {
      "id": "Animals",
      "color": " #eb8404",
      "data": [
        {
          "x": "12-DEC",
          "y": 2
        },
        {
          "x": "14-DEC",
          "y": 17
        },
        {
          "x": "16-DEC",
          "y": 11
        },
        {
          "x": "18-DEC",
          "y": 43
        },
        {
          "x": "20-DEC",
          "y": 35
        },
        {
          "x": "22-DEC",
          "y": 57
        },
        {
          "x": "24-DEC",
          "y": 45
        },
        {
          "x": "26-DEC",
          "y": 65
        },
        {
          "x": "28-DEC",
          "y": 75
        },
        {
          "x": "30-DEC",
          "y": 68
        },
        {
          "x": "02-JAN",
          "y": 56
        },
        {
          "x": "04-JAN",
          "y": 89
        }
      ]
    }
  ];

  // install (please make sure versions match peerDependencies)
  // yarn add @nivo/core @nivo/line

  // make sure parent container have a defined height when using
  // responsive component, otherwise height will be 0 and
  // no chart will be rendered.
  // website examples showcase many properties,
  // you'll often use just a few of them.
  const MyResponsiveLine = ({ data /* see data tab */ }) => (
      <ResponsiveLine
          data={data}
          colors={d => d.color}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
              orient: 'bottom',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Date',
              legendOffset: 36,
              legendPosition: 'middle'
          }}
          axisLeft={{
              orient: 'left',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Score',
              legendOffset: -40,
              legendPosition: 'middle'
          }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
              {
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: 'circle',
                  symbolBorderColor: 'rgba(0, 0, 0, .5)',
                  effects: [
                      {
                          on: 'hover',
                          style: {
                              itemBackground: 'rgba(0, 0, 0, .03)',
                              itemOpacity: 1
                          }
                      }
                  ]
              }
          ]}
      />
  )




  return (
    <div>
      <Link to="/">Home</Link>
      <div style={{height:"500px"}}>
        <MyResponsiveLine data={data} />
      </div>
    </div>
  );
}