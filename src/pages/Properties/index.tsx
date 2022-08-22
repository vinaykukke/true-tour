import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import TypographyCore from "@mui/material/Typography";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { db } from "src/firebase";
import "./properties.styles.scss";

const Properties = () => {
  const navigate = useNavigate();
  const [properties, setproperties] = useState([]);
  const handleClick = (propertyName: string) => () =>
    navigate(`/property/${propertyName}`);

  useEffect(() => {
    const databaseRef = ref(db, "properties/sobha-developers");
    const fetch = async () => {
      const res = await get(databaseRef);
      if (res.exists()) setproperties(res.val());
    };
    fetch();
  }, []);

  return (
    <>
      <div className="parallax" />
      <TypographyCore align="center" variant="h1" className="blur">
        Properties
      </TypographyCore>
      <div className="card__container">
        <ImageList cols={4}>
          {Object.keys(properties).map((key, i) => {
            const property = properties[key];
            return (
              <ImageListItem
                className="card"
                key={i}
                onClick={handleClick(key)}
              >
                <Card sx={{ minHeight: 280, minWidth: 320 }}>
                  <CardCover>
                    <img
                      src={`${property.thumbnail}?w=500&h=500&fit=crop&auto=format`}
                      srcSet={`${property.thumbnail}?w=500&h=500&fit=crop&auto=format&dpr=2 2x`}
                      alt={property.name}
                      loading="lazy"
                    />
                  </CardCover>
                  <CardCover className="gradient" />
                  <CardContent sx={{ justifyContent: "flex-end" }}>
                    <Typography
                      level="h2"
                      fontSize="lg"
                      textColor="#fff"
                      mb={1}
                    >
                      {property.name}
                    </Typography>
                    <Typography
                      startDecorator={
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          style={{ marginRight: "7px" }}
                        />
                      }
                      textColor="neutral.300"
                    >
                      California, USA
                    </Typography>
                  </CardContent>
                </Card>
              </ImageListItem>
            );
          })}
        </ImageList>
      </div>
    </>
  );
};

export default Properties;
