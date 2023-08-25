export type SearchResult<T = unknown> = {
  results: Array<T>;
  meta: { type: string; q: string; count: number };
};

export type SearchMatch = {
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

export const fetchSearchResults = async (
  term: string,
  signal: AbortSignal
): Promise<SearchResult<SearchMatch>> => {
  const apiUrl = `http://list.ly/api/v4/search/video?q=${term}`;
  const response = await fetch(apiUrl, { signal });
  const data = await response.json();
  return data;
};
