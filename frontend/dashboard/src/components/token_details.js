
const TokenDetail = ({ token }) => {
    if(!token)
    {
        return <div>No token selected</div>
    }

    return (
        
                    <div className="bg-gray-800 text-white p-8">
                       <div className="ml-10">
                            <div className="flex items-center space-x-4 mt-4">
                                {token.image ? <img src={token.image} alt="Crypto Logo" className="h-8 w-8" /> : <div></div>}
                                
                                <h2 className="text-xl font-semibold">{token.name}</h2>
                                <span className="text-green-400"> {token.current_price} </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                <div>
                                    <div className="text-sm">24H VOLUME</div>
                                    <div>{token.total_volume}</div>
                                    <div className="text-sm text-red-400">{token.market_cap_change_percentage_24h}</div>
                                </div>
                                <div>
                                <div className="text-sm">ATH</div>
                                    <div>{token.ath}</div>
                                    <div className="text-sm text-red-400">({token.ath_change_percentage}%)</div>
                                </div>
                                <div>
                                    <div className="text-sm">CURRENT SUPPLY</div>
                                    <div>{token.circulating_supply}</div>
                                </div>
                                <div>
                                    <div className="text-sm">MARKET CAP</div>
                                    <div>{token.total_supply}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                <div>
                                <div className="text-sm">7D</div>
                                <div className="text-sm text-red-400">-0.16%</div>
                                </div>
                                <div>
                                <div className="text-sm">ATL</div>
                                <div>$0.878</div>
                                <div className="text-sm text-green-400">(+13.76%)</div>
                                </div>
                                <div>
                                <div className="text-sm">MAX SUPPLY</div>
                                <div>30,844,077,326.843</div>
                                </div>
                                <div>
                                <div className="text-sm">FULLY DILUTED MARKET CAP</div>
                                <div>$30,793,894,013.032</div>
                                </div>
                            </div>    
                        </div>
                        
                    </div>
     )
}

export default TokenDetail;