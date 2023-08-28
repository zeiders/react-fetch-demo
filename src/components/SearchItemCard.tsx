import { SearchMatch } from "../apis/videoSearchApi";

export function SearchItemCard(props: { item: SearchMatch }) {
  const { item } = props;
  return (
    <>
      <img
        style={{ width: "144px", aspectRatio: 16 / 9 }}
        src={item.preview_image}
      />
      {item.name} <a href={item.url}>play video</a>
    </>
  );
}
