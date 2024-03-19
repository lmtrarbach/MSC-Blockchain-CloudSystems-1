import React, { useEffect, useState } from 'react';
import fetchTokenHolders from '../api/fetchTokenHolders';
import { Pie } from '@ant-design/plots';
import Web3 from 'web3';
import bigInt from 'big-integer';
import BigNumber from 'bignumber.js';


const TokenHolder = ({tokenAddress}) => {
    const [data, setData] = useState({});
    const [address, setAddress] = useState(tokenAddress);
    const web3 = new Web3();
    
    useEffect(() => {
      let isSubscribed = true;
      
      const fetchData = async () => {
        const rawData = await fetchTokenHolders(tokenAddress);
        
        if(isSubscribed)
        {
          const processedData = rawData.map((element, index, array)=> {
                // Remove leading zeros after "0x"
                const trimmedString = element.address.replace(/^0x0+/, '0x');
                // For example, to get "0x4da27a545", which is 10 characters long including "0x"
                const desiredLength = 10; // Including "0x"
                const shortenedString = trimmedString.length > desiredLength ? '0x' + trimmedString.substring(2, desiredLength - 2 + 2) : trimmedString;
                const num = new BigNumber(element.total_holdings);
                
                return {
                  type: shortenedString,
                  value: num.c[0]
                };
            });

          setData(processedData);
        }
      }
      
      if(tokenAddress)
        fetchData();

      return () => {
        isSubscribed = false;
      };
    }, [tokenAddress]);

    const config = {
      data : data,
        angleField: 'value',
        colorField: 'type',
        paddingRight: 80,
        label: {
          text: 'value',
          position: 'outside',
        },
        legend: {
          color: {
            title: false,
            position: 'right',
            rowPadding: 5,
          },
        },
    };
    
    if(!tokenAddress)
      {
          return <></>
      }
      

    //useEffect(() => {});
    return (
        <Pie {...config} />
    )
}

export default TokenHolder;

