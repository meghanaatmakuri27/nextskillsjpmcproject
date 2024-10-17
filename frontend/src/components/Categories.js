import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import CategoriesTable from "./CategoriesTable";
import Sidebar from "./Sidebar";

const Categories = () => {
  const [res, setRes] = useState({
    did: "",
    name: "",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRes({ ...res, [name]: value });
  };

  const handleFileDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setImagePreview(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("pid", res.did);
    formData.append("name", res.name);

    try {
      const response = await axios.post(
        "http://localhost:9999/categories/add",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        console.log("Category added successfully");
        setError("");
        setImagePreview("");
        setRes({ did: "", name: "" });
        setFile(null);
        handleClose();
      } else {
        setError("Category could not be added");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Category could not be added");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileDrop,
    multiple: false,
    accept: "image/jpeg, image/png",
  });

  return (
    <div>
      <Container maxWidth="lg">
        <Box
          position="fixed"
          width="250px"
          top="0"
          left="0"
          height="100%"
          bgcolor="white"
        >
          <Sidebar/>
        </Box>
        <Box ml="270px">
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            style={{ position: "absolute", top: 50, left: 1200 }}
          >
            Add Category
          </Button>
         
        </Box>
        <Box ml="270px" marginTop={"100px"}>
        <CategoriesTable />
        </Box>
      </Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Category ID"
                  name="did"
                  value={res.did}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={res.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <div {...getRootProps()} style={dropzoneStyles}>
                  <input {...getInputProps()} />
                  {imagePreview && <p>Image: {imagePreview}</p>}
                  {!imagePreview && <p>Click to select an image</p>}
                  {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const dropzoneStyles = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  cursor: "pointer",
  textAlign: "center",
};

export default Categories;
