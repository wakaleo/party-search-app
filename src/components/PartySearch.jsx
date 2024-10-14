import React, { useState } from 'react';
import axios from 'axios';

const PartySearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [parties, setParties] = useState([]);
  const [error, setError] = useState(false);  // New state to track if there's an error

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    setError(false);  // Reset error state before new search

    if (query.trim().length > 0) {
      try {
        const response = await axios.get(`/party/search?q=${query}`);
        setParties(response.data);  // Set the party data if API is successful
      } catch (error) {
        console.error('Error fetching parties:', error);
        setError(true);  // Set error state if API fails
        setParties([]);  // Clear the parties list in case of an error
      } 
    } else {
      setParties([]);
    }
  };

  return (
    <div>
      <h1>Party Search</h1>
      <input
        name="search"
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search by name or ID"
      />
      
      {/* Display error message if API fails */}
      {error && <div role="alert">An error occurred while fetching the results. Please try again later.</div>}
      
      {/* Render list of parties only if there are results */}
      {parties.length > 0 && (
        <ul>
          {parties.map((party) => (
            <li role="listitem" key={party.partyId}>{party.partyName}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PartySearch;
