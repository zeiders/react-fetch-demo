import { useState } from "react";
import "./App.css";

enum FetchState {
  Idle,
  Loading,
  Success,
  Error,
}

type SearchResult<T = unknown> = {
  results: Array<T>;
  meta: { type: string; q: string; count: number };
};
type SearchMatch = {
  media_type: string;
  media_source: string;
  media_id: string;
  name: string;
  description: string;
  image: string;
  preview_image: string;
  tags: Array<string>;
  url: string;
};

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

  const fetchSearchResults = async (
    term: string
  ): Promise<SearchResult<SearchMatch>> => {
    const apiUrl = `http://list.ly/api/v4/search/video?q=${term}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
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
