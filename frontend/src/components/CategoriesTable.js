import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function CategoriesTable() {
  useEffect(() => {
    axios.get("http://localhost:9999/categories").then((response) => {
      setCategory(response.data);
    });
  }, []);

  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [res, setRes] = useState({ did: "", name: "" });
  const [file, setFile] = useState(null);
  const [productAdded, setProductAdded] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [editCategory, setEditCategory] = useState(null);
  const [category, setCategory] = useState([]);

  const handleClickOpen = (category) => {
    setEditCategory(category);
    setRes({ did: category.id, name: category.name });
    setOpen(true);
  };

  const handleClose = () => {
    setEditCategory(null);
    setRes({ did: "", name: "" });
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

    handleClose();
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(
        `http://localhost:9999/categories/delete/${categoryId}`
      );
      setCategory((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
      // Handle any error as needed
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileDrop,
    multiple: false,
    accept: "image/jpeg, image/png",
  });

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

  const dialogStyles = {
    maxWidth: "md",
  };

  const paperStyles = {
    width: "500px",
    padding: "20px", // Add padding here
  };

  const textFieldStyles = {
    marginBottom: "16px", // Add margin to create space between fields
  };

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        {category.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card sx={{ maxWidth: 300 }}>
              <CardMedia
                component="img"
                sx={{ height: 140 }}
                src={`/Images/${category.image}`}
                alt={category.name}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {category.name}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <IconButton onClick={() => handleClickOpen(category)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteCategory(category._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={dialogStyles.maxWidth}
      >
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent style={paperStyles}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Category ID"
              name="did"
              value={res.did}
              onChange={handleInputChange}
              style={textFieldStyles}
            />
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={res.name}
              onChange={handleInputChange}
              style={textFieldStyles}
            />
            <div {...getRootProps()} style={dropzoneStyles}>
              <input {...getInputProps()} />
              {imagePreview && <p>Image: {imagePreview}</p>}
              {!imagePreview && <p>Click to select an image</p>}
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
