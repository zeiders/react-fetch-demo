import { SearchMatch, SearchResult } from "../apis/videoSearchApi";
import { SearchItemCard } from "./SearchItemCard";

export function SearchItemList(props: {
  items: SearchResult<SearchMatch> | null;
}) {
  const { items } = props;
  return (
    <ul className="searchItemList">
      {items?.results.map((item, index) => (
        <li key={index}>
          <SearchItemCard item={item} />
        </li>
      ))}
    </ul>
  );
}
