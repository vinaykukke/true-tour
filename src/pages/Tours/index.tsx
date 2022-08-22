import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TypographyCore from "@mui/material/Typography";
import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/material/Grid";
import { ref, get } from "firebase/database";
import { db } from "src/firebase";
import "./tours.styles.scss";

const Tours = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);

  const handleClick = (tourId: string) => () =>
    navigate(`/property/${params.id}/${tourId}`);

  useEffect(() => {
    if (!params.id) navigate(-1);

    const fetch = async () => {
      const databaseRef = ref(db, `tours/sobha-developers/${params.id}`);
      const res = await get(databaseRef);

      if (res.exists()) setTours(res.val());
    };
    fetch();
  }, [params, navigate]);

  return (
    <>
      <div className="parallax" />
      <TypographyCore align="center" variant="h1" className="blur">
        Tours
      </TypographyCore>
      <Grid
        container
        className="grid__container"
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {Object.keys(tours).map((key, i) => {
          const tour = tours[key];

          return (
            <Grid item xs={2} sm={4} md={4} key={i}>
              <Card
                variant="outlined"
                className="card__tours"
                onClick={handleClick(key)}
              >
                <CardOverflow>
                  <AspectRatio ratio="2">
                    <img
                      src={`https://picsum.photos/300?random=${i}`}
                      alt={tour.name}
                    />
                  </AspectRatio>
                </CardOverflow>
                <Typography level="h2" className="tour__name_header">
                  {tour.name}
                </Typography>
                <Typography level="body2" sx={{ mt: 0.5, mb: 2 }}>
                  California
                </Typography>
                <CardOverflow
                  variant="soft"
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    py: 1.5,
                    px: "var(--Card-padding)",
                    borderTop: "1px solid",
                    borderColor: "#454545",
                    bgcolor: "#454545",
                  }}
                >
                  <Typography
                    level="body3"
                    sx={{ fontWeight: "md", color: "text.secondary" }}
                  >
                    6.3k views
                  </Typography>
                  <Box sx={{ width: 2, bgcolor: "divider" }} />
                  <Typography
                    level="body3"
                    sx={{ fontWeight: "md", color: "text.secondary" }}
                  >
                    1 hour ago
                  </Typography>
                </CardOverflow>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default Tours;
