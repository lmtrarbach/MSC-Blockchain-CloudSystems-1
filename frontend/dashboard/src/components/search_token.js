import React, { useState } from 'react';
import tokenContractList from '../data/listofcontracts';
import fetch from 'node-fetch';


const SearchToken = ({onTokenSearch, onTokenSelected}) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=';
    const options = {method: 'GET', headers: {'x-cg-demo-api-key': '	CG-zC1nSkZM65CecqYtWXGVJ2jq'}};

    // Instead of using a mutable `ref`, use `event.target.value` to get the input value.
    const handleInputChange = (event) => {
        const userInput = event.target.value;
        setQuery(userInput);
        if (userInput.length > 0) {
        const filteredSuggestions = tokenContractList.filter(token =>
            token.name.toLowerCase().includes(userInput.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
        //setQuery(event.target.value);
    };

    const handleSuggestionClick = (token) => {
        setQuery(token.name);
        setSuggestions([]);
        // Execute the request using the token's contract address
        // Assuming Ethereum platform here, adjust as needed
        onTokenSelected(token.address);
        // fetchEthBurn(query).then(...); // Example API call.
        fetch(url+token.symbol, options)
        .then(res =>  res.json())
        .then(json => { 
            console.log(json)
            onTokenSearch(json[0])
        })
        .catch(err => console.error('error:' + err));
      };
    

    //useEffect(() => {});
    return (
        <div className="flex flex-col items-center justify-center p-4">
            <form className="w-1/2 mx-8">
                <input
                    type="search"
                    className="w-full bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    placeholder="Search for token..."
                    value={query}
                    onChange={handleInputChange}
                />
                {suggestions.length > 0 && (
                    <ul className="absolute z-10 w-52 bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                    {suggestions.map((token) => (
                        <li
                        key={token.id}
                        onClick={() => handleSuggestionClick(token)}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                        {token.name} ({token.symbol})
                        </li>
                    ))}
                    </ul>
                )}
            </form>
        </div>
        
    )
}

export default SearchToken;

