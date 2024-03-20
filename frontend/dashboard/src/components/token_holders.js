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
                console.log(element.total_holdings);
                
                
                const num = new BigNumber(element.total_holdings);
                
                
                return {
                  type: shortenedString,
                  value: parseInt(convertENotationToNumber(element.total_holdings).toString().substring(1,10))
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
      <div className="flex-1">
        <Pie {...config} />
      </div>
    )
}

export default TokenHolder;

