import React, { useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import QuestionButton from "../components/QuestionButton";
import { COLOUR_PALETTE } from "../assets/constants";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";

const StyledTitle = styled("h2")(() => ({
  textAlign: "center",
  color: COLOUR_PALETTE[0],
  marginTop: "40px",
}));

export default function ImageCaptioning() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [ImageCaption, setImageCaption] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Prepare form data
      const formData = new FormData();
      formData.append("image", file);

      fetch(
        (process.env.REACT_APP_BACKEND_URL || "http://localhost:5000") +
          "/imagecaptioning",
        {
          method: "POST",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setImageCaption(data.caption);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  // when the meme search button is clicked
  const onMemeSearch = () => {
    if (!loading) {
      setLoading(true);
      fetch(
        (process.env.REACT_APP_BACKEND_URL || "http://localhost:5000") +
          "/memesearch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ searchText: ImageCaption }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          let test_result = [];
          for (let cluster of data) {
            test_result.push(cluster.clusterID);
          }
          navigate("/memesearchresult", { state: { test_result } });
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error:", error);
        });
    }
  };

  // when the meme predict button is clicked
  const onMemePredict = () => {
    if (!loading) {
      setLoading(true);
      fetch(
        (process.env.REACT_APP_BACKEND_URL || "http://localhost:5000") +
          "/memepredict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ searchText: ImageCaption }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          navigate("/memepredictionresult", { state: { data } });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          gap: "20px",
        }}
      >
        <StyledTitle>Image captioning</StyledTitle>
        <QuestionButton
          title="How To Use"
          text={
            <>
              This tool allows you to caption any image. <br />
              Upload an image to produce a caption that describes the image,
              which can be used for meme search or for meme prediction.
            </>
          }
          style={{ margin: "20px 0 0 -20px" }}
        />
      </Box>
      <Button
        variant="contained"
        component="label"
        style={{ backgroundColor: COLOUR_PALETTE[1] }}
      >
        Upload Image
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          hidden
        />
      </Button>
      {selectedImage ? (
        <>
          <Box mt={4}>
            <img
              src={selectedImage}
              alt="Uploaded"
              style={{ maxWidth: "100%", maxHeight: "500px" }}
            />
          </Box>
          {ImageCaption ? (
            <>
              <Typography variant="h4" marginTop={"20px"}>
                Your image has been captioned as:
              </Typography>
              <Typography variant="h6" marginTop={"20px"}>
                "{ImageCaption}"
              </Typography>
              <Box
                display="flex"
                flexDirection="row"
                margin={"30px"}
                gap={"30px"}
              >
                <Button
                  variant="contained"
                  component="label"
                  style={{ backgroundColor: COLOUR_PALETTE[7] }}
                  onClick={onMemeSearch}
                >
                  Search this caption
                </Button>
                <Button
                  variant="contained"
                  component="label"
                  style={{ backgroundColor: COLOUR_PALETTE[7] }}
                  onClick={onMemePredict}
                >
                  Predict Meme Growth
                </Button>
              </Box>
              {loading && (
                <>
                  <CircularProgress style={{ margin: "10px" }} />
                  <div>Processing Caption...</div>
                </>
              )}
            </>
          ) : (
            <>
              <CircularProgress /> &nbsp; Processing Image...
            </>
          )}
        </>
      ) : (
        <></>
      )}
    </Box>
  );
}
