import React, { useState, useEffect } from "react";
import "./App.css";
const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
function App() {
  const [cryptoData, setCryptoData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMarketCapSortedAsc, setIsMarketCapSortedAsc] = useState(false);
  const [isPercentageSortedAsc, setIsPercentageSortedAsc] = useState(false);
  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setCryptoData(data);
        setFilteredData(data);
      } catch (error) {
        console.error("Error with async/await fetch:", error);
      }
    };
    fetchDataAsync();
  }, []);
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const results = cryptoData.filter(coin => 
      coin.name.toLowerCase().includes(query) || 
      coin.symbol.toLowerCase().includes(query)
    );
    setFilteredData(results);
  };
  const sortByMarketCap = () => {
    const nextSortAsc = !isMarketCapSortedAsc;
    setIsMarketCapSortedAsc(nextSortAsc);
    const sorted = [...filteredData].sort((a, b) => {
      return nextSortAsc ? a.market_cap - b.market_cap : b.market_cap - a.market_cap;
    });
    setFilteredData(sorted);
  };
  const sortByPercentage = () => {
    const nextSortAsc = !isPercentageSortedAsc;
    setIsPercentageSortedAsc(nextSortAsc);
    const sorted = [...filteredData].sort((a, b) => {
      const changeA = a.price_change_percentage_24h || 0;
      const changeB = b.price_change_percentage_24h || 0;
      return nextSortAsc ? changeA - changeB : changeB - changeA;
    });
    setFilteredData(sorted);
  };
  return (
    <div className="container">
      <h1>Crypto Market Dashboard</h1>
      <div className="controls">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search by name or symbol..." 
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="sort-buttons">
          <button onClick={sortByMarketCap}>
            Sort by Mkt Cap {isMarketCapSortedAsc ? "(Asc)" : ""}
          </button>
          <button onClick={sortByPercentage}>
            Sort by % Change {isPercentageSortedAsc ? "(Asc)" : ""}
          </button>
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Logo</th>
              <th>Name</th>
              <th>Symbol</th>
              <th>Price (USD)</th>
              <th>Total Volume</th>
              <th>24h Change</th>
              <th>Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((coin) => {
                const isPositive = coin.price_change_percentage_24h >= 0;
                return (
                  <tr key={coin.id}>
                    <td><img src={coin.image} alt={coin.name} className="crypto-logo" /></td>
                    <td>{coin.name}</td>
                    <td>{coin.symbol.toUpperCase()}</td>
                    <td>${coin.current_price.toLocaleString()}</td>
                    <td>${coin.total_volume.toLocaleString()}</td>
                    <td className={isPositive ? "positive" : "negative"}>
                      {coin.price_change_percentage_24h ? coin.price_change_percentage_24h.toFixed(2) + '%' : '0.00%'}
                    </td>
                    <td>${coin.market_cap.toLocaleString()}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>No cryptocurrencies found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default App;