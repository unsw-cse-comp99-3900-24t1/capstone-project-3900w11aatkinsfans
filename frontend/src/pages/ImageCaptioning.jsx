import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import QuestionButton from "../components/QuestionButton";
import { COLOUR_PALETTE } from "../assets/constants";

export default function ImageCaptioning() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [ImageCaption, setImageCaption] = useState("");

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
          console.log(data);
          setImageCaption(data.caption);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      marginTop={"50px"}
      p={2}
    >
      <Box display="flex" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Image captioning
        </Typography>
        <QuestionButton
          title="How To Use"
          text={
            <>
              This tool allows you to caption any image. <br />
              Upload an image to produce a caption that describes the image,
              which can be used for meme search or for meme prediction.
            </>
          }
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
      {selectedImage && (
        <Box mt={4}>
          <img
            src={selectedImage}
            alt="Uploaded"
            style={{ maxWidth: "100%", maxHeight: "500px" }}
          />
        </Box>
      )}
      <Typography variant="h4">{ImageCaption}</Typography>
    </Box>
  );
}
