import React, { useEffect, useState } from 'react';
import fetchTokenTransfer from '../api/fetchTokenTransfer';
import { Column, Line } from '@ant-design/charts';
import BigNumber from 'bignumber.js';


const TokenTransfer = ({tokenAddress}) => {
    const [data, setData] = useState([]);
    const [dataLine, setDataLine] = useState([]);

    

    const configValueTranfer = {
      data: dataLine,
      height: 400,
      xField: 'date',
      yField: 'value',
    };
    
    const config = {
      data,
      xField: 'type',
      yField: 'value',
      legend: false,
    };

      useEffect(() => {
        let isSubscribed = true;
        
        const fetchData = async () => {
          const rawData = await fetchTokenTransfer(tokenAddress);
          console.log(rawData);
          if(isSubscribed)
          {
            
            const processedData = rawData.sort(function(a,b){
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(b.date) - new Date(a.date);
            }).map((element, index, array) => {
              return {
                type:  element.date,
                value: element.num_of_transactions
              }
            });

            const processedDataAddress = rawData.sort(function(a,b){
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(b.date) - new Date(a.date);
            }).map((element, index, array) => {
              const num = new BigNumber(element.total_value);
              
              return {
                date:  element.date,
                value: num.c[0]
              }
            });

            

            setData(processedData);
            setDataLine(processedDataAddress);
            
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
          <Column {...config} />
          <Line {...configValueTranfer}/>
        </> 
        
        
        
    )
}

export default TokenTransfer;