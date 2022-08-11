import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { FullMetadata } from "firebase/storage";
import { useThree, useUpdate } from "src/context/ThreejsContext";
import "./styles.scss";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface IProps {
  scenes: IUploadedImage[];
}

interface IUploadedImage {
  metaData: FullMetadata;
  url: string;
}

const SceneList = (props: IProps) => {
  const { targetScene, selectedObj } = useThree();
  const { setTargetScene } = useUpdate();
  const noScenes = props.scenes.length === 0;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetScene((event.target as HTMLInputElement).value);
    selectedObj.userData.targetScene = event.target.value;
    selectedObj.userData.sceneId = event.target.parentElement.dataset.id;
    selectedObj.userData.sceneName = event.target.parentElement.dataset.name;
  };

  return (
    <FormControl>
      <FormLabel className="form__label" id="select__target_scene">
        {noScenes ? "Upload a scene from the toolbar" : "Select Target Scene"}
      </FormLabel>
      <RadioGroup
        aria-labelledby="select__target_scene"
        value={targetScene}
        onChange={handleChange}
        name="radio-buttons-group"
      >
        {props.scenes.map((scene, i) => (
          <FormControlLabel
            sx={{ color: "white" }}
            key={i}
            value={scene.url}
            control={
              <Radio
                className="radio__button"
                data-id={scene.metaData.customMetadata.uuid}
                data-name={scene.metaData.customMetadata.name}
              />
            }
            label={scene.metaData.customMetadata.name}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default SceneList;
