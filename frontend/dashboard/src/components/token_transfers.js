import React, { useEffect, useState } from 'react';
import fetchEthBurn from '../api/lambdas';
import { Line } from '@ant-design/charts';

const TokenTransfer = () => {
    //const [data, setData] = useState({});

    const data = [
        {"num_of_transactions": "74130", "total_value": "7.03596163904997E15", "received_most_value": "0x00000000000000000000000055fe002aeff02f77364de339a1292923a15844b8", "sent_most_value": "0x000000000000000000000000a9d1e08c7793af67e9d92fe308d5697fb81d3e43"}
      ];
    
      const config = {
        data,
        height: 400,
        xField: 'year',
        yField: 'value',
      };

    //useEffect(() => {});
    return (
        <Line {...config} />
    )
}

export default TokenTransfer;