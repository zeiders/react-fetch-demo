import { useState } from "react";
import "./App.css";
import {
  SearchMatch,
  SearchResult,
  fetchSearchResults,
} from "./apis/videoSearchApi";

enum FetchState {
  Idle,
  Loading,
  Success,
  Error,
}

function App() {
  const [fetchState, setFetchState] = useState<FetchState>(FetchState.Idle);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] =
    useState<SearchResult<SearchMatch> | null>(null);

  const handleSearch = async () => {
    if (searchTerm) {
      try {
        setFetchState(FetchState.Loading);
        const results = await fetchSearchResults(searchTerm);
        setSearchResults(results);
        setFetchState(FetchState.Success);
      } catch (error) {
        console.error("An error occurred:", error);
        setFetchState(FetchState.Error);
      }
    }
  };

  return (
    <div className="App">
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter your search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {fetchState === FetchState.Loading && <div>Executing Search...</div>}

      {fetchState === FetchState.Success && (
        <div className="results-container" style={{ borderTop: "1px" }}>
          {searchResults?.results.length === 0 ? (
            <p>No results found.</p>
          ) : (
            <ul>
              {searchResults?.results.map((result, index) => (
                <li key={index}>{result.name}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {fetchState === FetchState.Error && <div>An error occurred</div>}
    </div>
  );
}

export default App;
