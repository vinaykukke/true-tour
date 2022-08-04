import { getStorage, ref, deleteObject, FullMetadata } from "firebase/storage";
import ImageList from "@mui/material/ImageList";
import ListSubheader from "@mui/material/ListSubheader";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./styles.scss";

interface IProps {
  images: IUploadedImage[];
  setUploadedImages: React.Dispatch<React.SetStateAction<IUploadedImage[]>>;
}
interface IUploadedImage {
  metaData: FullMetadata;
  url: string;
}

const ImageRack = (props: IProps) => {
  const storage = getStorage();
  const renderImages = (
    item: { url: string; metaData: FullMetadata },
    i: number
  ) => {
    const {
      name,
      customMetadata: { title = "Hotel", name: metaName = "Demo Images" },
    } = item.metaData;
    const deleteItem = async () => {
      const deleteRef = ref(storage, item.metaData.fullPath);
      props.setUploadedImages((prev) =>
        prev.filter((i) => i.metaData.name !== name)
      );

      // Delete the file
      await deleteObject(deleteRef);
    };

    return (
      <ImageListItem key={i}>
        <img
          src={`${item.url}?w=248&fit=crop&auto=format`}
          srcSet={`${item.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
          alt={`panorama ${i}`}
          loading="lazy"
        />
        <ImageListItemBar
          title={title}
          subtitle={metaName}
          actionIcon={
            <FontAwesomeIcon
              icon={faTrash}
              color="white"
              style={{ padding: "0 15px", cursor: "pointer" }}
              onClick={deleteItem}
            />
          }
        />
      </ImageListItem>
    );
  };

  return (
    <div className="image__rack">
      <ImageList sx={{ maxHeight: 450 }}>
        <ImageListItem key="Subheader" cols={2}>
          <ListSubheader component="div">Uploaded Images</ListSubheader>
        </ImageListItem>
        {props.images.map(renderImages)}
      </ImageList>
    </div>
  );
};

export default ImageRack;
