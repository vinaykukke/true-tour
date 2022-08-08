import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { FullMetadata } from "firebase/storage";
import { useThree, useUpdate } from "src/context";
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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetScene((event.target as HTMLInputElement).value);
    selectedObj.userData.targetScene = event.target.value;
  };

  return (
    <FormControl>
      <FormLabel className="form__label" id="select__target_scene">
        Select Target Scene
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
            control={<Radio className="radio__button" />}
            label={scene.metaData.customMetadata.name}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default SceneList;
