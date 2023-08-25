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
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const handleSearch = async () => {
    if (searchTerm) {
      if (abortController) {
        // Abort the ongoing request if there is one
        abortController.abort();
      }

      const newAbortController = new AbortController();
      setAbortController(newAbortController);
      setFetchState(FetchState.Loading);

      try {
        const results = await fetchSearchResults(
          searchTerm,
          newAbortController.signal
        );
        setSearchResults(results);
        setFetchState(FetchState.Success);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.name === "AbortError") {
          // The fetch request was aborted, ignore the error
          console.info("A fetch was aborted:", error);
        } else {
          console.error("An error occurred:", error);
          setFetchState(FetchState.Error);
        }
      } finally {
        setAbortController(null);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Tab" || event.key === "Enter") {
      handleSearch();
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
          onKeyDown={handleKeyDown}
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
