import React, { useEffect, useState } from 'react';
import fetchTokenTransfer from '../api/fetchTokenTransfer';
import { Bar, Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import BigNumber from 'bignumber.js';



const TokenTransfer = ({tokenAddress}) => {
    const [labelTransfer, setLabelTransfer] = useState([]);
    const [dataTransfer, setDataTransfer] = useState([]);
    const [labelTransferValue, setLabelTransferValue] = useState([]);
    const [dataTransferValue, setDataTransferValue] = useState([]);

    const convertENotationToNumber = (num) => {
      const str = num.toString()
      const match = str.match(/^(\d+)(\.(\d+))?[eE]([-\+]?\d+)$/)
      if (!match) return str //number was not e notation or toString converted
      // we parse the e notation as (integer).(tail)e(exponent)
      const [, integer,, tail, exponentStr ] = match
      const exponent = Number(exponentStr)
      const realInteger = integer + (tail || '')
      if(exponent > 0) {
          const realExponent = Math.abs(exponent + integer.length)
          return realInteger.padEnd(realExponent, '0')
      } else {
          const realExponent = Math.abs(exponent - (tail?.length || 0))
          return '0.'+ realInteger.padStart(realExponent, '0')
      }
    }

    const lineData = {
      labels: labelTransferValue,
      datasets: [
        {
          label: 'Amount transacted per day',
          data:  dataTransferValue,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };

    console.log(labelTransferValue);
    console.log(dataTransferValue);

    // Define the chart data and configuration
    const dataDDD = {
      labels: labelTransfer,
      datasets: [
          {
              label: '# of Transactions',
              data: dataTransfer,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }
      ]
    };

    const commonOptions = {
      maintainAspectRatio: false,
      responsive: true,
    };

      useEffect(() => {
        let isSubscribed = true;
        
        const fetchData = async () => {
          let labelTransferArray = [];
          let dataTransferArray = [];
          let labelTransferValueArray =[];
          let dataTransferValueArray = [];

          const rawData = await fetchTokenTransfer(tokenAddress);
          
          if(isSubscribed)
          {
            
            const processedData = rawData.map((element, index, array) => {
              return {
                type:  element.date,
                value: element.num_of_transactions
              }
            });

            const processedDataAddress = rawData.map((element, index, array) => {
              const num = new BigNumber(element.total_value);
              console.log(convertENotationToNumber(element.total_value));
              
              return {
                type:  element.date,
                value: convertENotationToNumber(element.total_value)
              }
            });

            processedData.forEach(element => {
              labelTransferArray.push(element.type);
              dataTransferArray.push(element.value);
            });

            processedDataAddress.forEach(element => {
              labelTransferValueArray.push(element.type);
              dataTransferValueArray.push(element.value);
            });

            
                        
            setLabelTransfer(labelTransferArray);
            setDataTransfer(dataTransferArray);
            setLabelTransferValue(labelTransferValueArray);
            setDataTransferValue(dataTransferValueArray);
          }
        }
        
        if(tokenAddress)
          fetchData();
  
        return () => {
          isSubscribed = false;
        };
      }, [tokenAddress]);
    
      if(!tokenAddress)
      {
          return <></>
      }
    
    
      return (
        <>
          <div className="flex-1">
            <Line data={lineData} options={commonOptions} />
          </div>
          <div className="flex-1">
            {/* <Column {...configValueTranfer}/> */}
            <Bar data={dataDDD} options={commonOptions} />
          </div>
        </> 
        
        
        
    )
}

export default TokenTransfer;