import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import ProductTable from "./ProductTable";
import Sidebar from "./Sidebar";

const Products = () => {
  const [product, setProduct] = useState({
    id: "",
    name: "",
    price: "",
    category: "", // Ensure category is initialized correctly
    description: "",
  });
  const [file, setFile] = useState(null);
  const [productAdded, setProductAdded] = useState(false);
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
    setProduct({ ...product, [name]: value });
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
    formData.append("pid", product.id);
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("category", product.category); // Include category
    formData.append("description", product.description);

    try {
      const response = await axios.post(
        "http://localhost:9999/product/add",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        console.log("Product added successfully");
        setProductAdded(true);
        setError("");
        setImagePreview("");
        setProduct({ id: "", name: "", price: "", category: "", description: "" });
        setFile(null);
        handleClose();
      } else {
        setError("Product could not be added");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Product could not be added");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileDrop,
    multiple: false,
    accept: "image/jpeg, image/png",
  });

  return (
    <div>
      <Container maxWidth="sm">
        <Sidebar />
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          style={{ position: "absolute", top: 50, right: 600 }}
        >
          Add Product
        </Button>
        <ProductTable />
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Product</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Product ID"
                    name="id"
                    value={product.id}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Product Price"
                    name="price"
                    value={product.price}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Product Category"
                    name="category"
                    value={product.category}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Product Description"
                    name="description"
                    value={product.description}
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
      </Container>
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

export default Products;
