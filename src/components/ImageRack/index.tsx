import ImageList from "@mui/material/ImageList";
import ListSubheader from "@mui/material/ListSubheader";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import "./styles.scss";

const ImageRack = (props) => {
  const renderImages = (item: string, i: number) => {
    return (
      <ImageListItem key={i}>
        <img
          src={`${item}?w=248&fit=crop&auto=format`}
          srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
          alt={`panorama ${i}`}
          loading="lazy"
        />
        <ImageListItemBar title="picture" subtitle="Demo Images" />
      </ImageListItem>
    );
  };

  return (
    <div className="image__rack">
      <ImageList sx={{ height: 450 }}>
        <ImageListItem key="Subheader" cols={2}>
          <ListSubheader component="div">Uploaded Images</ListSubheader>
        </ImageListItem>
        {props.images.map(renderImages)}
      </ImageList>
    </div>
  );
};

export default ImageRack;
