import { Fragment } from 'react'
import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import './input.css'
import EthBurn from './components/eth_burn';
import TokenHolder from './components/token_holders';
import SearchToken from './components/search_token';
import TokenDetail from './components/token_details';
import TokenTransfer from './components/token_transfers';





function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function App() {
  const [tokenData, setTokenData] = useState(null);
  const [tokenAddress, setTokenAddress] = useState(null);

  const handleTokenData = (data) => {
    setTokenData(data); // This function updates the state with API response data
  };

  const handleTokenAddress = (data) => {
    setTokenAddress(data);
  };

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div className="min-h-fit">
        <div className="bg-gray-800">
          {/* ADD search token details component */}
          <SearchToken onTokenSearch={handleTokenData} onTokenSelected={handleTokenAddress} />
        </div>

        
        <main>
            <div className='columns-1'>
              <TokenDetail token={tokenData}/>
            </div>
            <br/>
            <div className='columns-3'>
              <TokenTransfer tokenAddress={tokenAddress} />
              <TokenHolder tokenAddress={tokenAddress} />
            </div>
        </main>
      </div>
    </>
  );
}

export default App;
