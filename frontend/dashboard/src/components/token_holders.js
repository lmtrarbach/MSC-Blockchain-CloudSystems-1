import React, { useEffect, useState } from 'react';
import fetchEthBurn from '../api/lambdas';
import { Pie } from '@ant-design/plots';
import Web3 from 'web3';

const TokenHolder = () => {
    //const [data, setData] = useState({});
    const web3 = new Web3();
    
    const config = {
      data : [
          {
            type:
              "0x48772",
            value: web3.utils.fromWei(1.660000092E15, 'ether'),
          },
          {
            type:
              "0x6d503",
            value: web3.utils.fromWei(4.4299999984E14, 'ether'),
          },
          {
            type:
              "0x7180d",
            value: web3.utils.fromWei(4.16505675619347E14, 'ether'),
          },
          {
            type:
              "0x2d69c8",
            value: web3.utils.fromWei(3.71332514436438E14, 'ether'),
          },
          {
            type:
              "0x1bfb5",
            value: web3.utils.fromWei(3.5E14, 'ether'),
          },
          {
            type:
              "0x054c5e",
            value: web3.utils.fromWei(3.5E14, 'ether'),
          },
          {
            type:
              "0xe2c4b1",
            value: web3.utils.fromWei(3.5E14, 'ether'),
          },
          {
            type:
              "0x5bbbdf",
            value: web3.utils.fromWei(3.38443766564476E14, 'ether'),
          },
          {
            type:
              "0xbf21d60",
            value: web3.utils.fromWei(3.30188361213888E14, 'ether'),
          },
          {
            type:
              "0x973cbb",
            value: web3.utils.fromWei(3.05258472737106E14, 'ether'),
          },
        ],
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
    
      

    //useEffect(() => {});
    return (
        <Pie {...config} />
    )
}

export default TokenHolder;

