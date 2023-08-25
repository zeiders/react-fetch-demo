import { useState } from "react";
import "./App.css";

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
  const [fetchState, setFetchState] = useState<"READY" | "LOADING" | "ERROR">(
    "READY"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] =
    useState<SearchResult<SearchMatch> | null>(null);

  const handleSearch = async () => {
    if (searchTerm) {
      try {
        setFetchState("LOADING");
        const results = await fetchSearchResults(searchTerm);
        setSearchResults(results);
        setFetchState("READY");
      } catch (error) {
        console.error("An error occurred:", error);
        setFetchState("ERROR");
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

      {fetchState == "LOADING" && <div>Executing Search...</div>}

      {fetchState == "READY" && (
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

      {fetchState == "ERROR" && <div>An error occurred</div>}
    </div>
  );
}

export default App;
