import { useState } from "react";
import {
  CircularProgress,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  DialogActions,
  Button,
  Alert,
  InputAdornment,
  Box,
  FormControl,
  InputLabel,
  Input,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DataTable from "react-data-table-component";
import SearchIcon from "@mui/icons-material/Search";
import {
  getProductById,
  getProductsByPatialName,
  updateProduct,
  deleteProductById,
} from "../services/api";

const SearchProducts = () => {
  const [list, setList] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState();
  const [open, setOpen] = useState(false);
  const [searchById, setSearchById] = useState("");
  const [searchByPartialName, setSearchByPartialName] = useState("");

  const [productId, setProductId] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const [error, setError] = useState();

  const handleEditClick = (product) => {
    setProductId(product.id);
    setNewProductName(product.product_name);
    setNewCategory(product.category);
    setNewStock(product.stock);
    setNewPrice(product.price);
    setOpen(true);
    setIsEditing(true);
  };

  const handleDeleteClick = (product) => {
    setOpen(true);
    setIsDeleting(product);
    setProductId(product.id);
  };

  const handleNewProductNameChange = (e) => {
    setNewProductName(e.target.value);
  };

  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleNewStockChange = (e) => {
    setNewStock(e.target.value);
  };

  const handleNewPriceChange = (e) => {
    setNewPrice(e.target.value);
  };

  const handleClose = () => {
    setError("");
    setOpen(false);
    setIsEditing(false);
    setIsDeleting(null);
    setProductId("");
    setNewProductName("");
    setNewCategory("");
    setNewStock("");
    setNewPrice("");
    searchById ? fetchDataById() : fetchDataByName();
  };

  const handleSubmit = async () => {
    setLoading(true);
    const response = isEditing
      ? await updateProduct(productId, {
          product_name: newProductName,
          category: newCategory,
          stock: newStock,
          price: Number(newPrice).toFixed(2),
        })
      : await deleteProductById(productId);

    if (response.error) {
      setError(sanitizeErrorMessage(response.error));
    } else {
      setError("");
      handleClose();
    }
    setLoading(false);
    // fetchData();
  };

  function sanitizeErrorMessage(errorMessage) {
    const cleanMessage = errorMessage.replace(/['"\\]/g, "");

    const formattedMessage =
      cleanMessage.charAt(0).toUpperCase() + cleanMessage.slice(1);
    return formattedMessage.endsWith(".")
      ? formattedMessage
      : `${formattedMessage}.`;
  }

  const dataColumns = [
    {
      name: "ID",
      selector: (row) => row.id,
    },
    {
      name: "Produto",
      selector: (row) => row.product_name,
    },
    {
      name: "Categoria",
      selector: (row) => row.category,
    },
    {
      name: "Estoque",
      selector: (row) => row.stock,
    },
    {
      name: "Preço",
      selector: (row) => "R$ " + Number(row.price).toFixed(2),
    },
    {
      name: "Ações",
      selector: (row) => null,
      cell: (row) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => handleEditClick(row)}>
            <EditIcon fontSize="small" color="primary" />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(row)}>
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
      },
    },
  };

  const fetchDataById = async () => {
    setSearchByPartialName("");
    setLoadingData(true);
    const id = Number(searchById);
    if (isNaN(id)) {
      alert("Digite um ID válido.");
      return setLoadingData(false);
    }

    const result = await getProductById(id);
    console.log(result)
    if (result.error) {
      setError(sanitizeErrorMessage(result.error));
      return setLoadingData(false);
    }
    setLoadingData(false);

    setList([result]);
    setError('')
  };

  const fetchDataByName = async () => {
    console.log('cliqued', searchByPartialName)
    setSearchById("");
    setLoadingData(true);

    const result = await getProductsByPatialName(searchByPartialName.trim());
    console.log(result.length)
    if (result.error) {
      setError(sanitizeErrorMessage(result.error));
    }

    if (result.length === 0) {
      setError(`Nenhum produto para a busca '${searchByPartialName.trim()}'`);
      return  setLoadingData(false);
    }
    setLoadingData(false);
    setList(result);
    setError('')
  };

  const clearData = () => {
    setList([]);
    setSearchById("");
    setSearchByPartialName("");
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          mb: 2,
        }}
      >
        <Button variant="contained" onClick={() => clearData()}>
          Limpar resultados
        </Button>
        <FormControl sx={{ m: 1, width: "25ch" }} variant="standard">
          <InputLabel htmlFor="id">Buscar por ID</InputLabel>
          <Input
            id="id"
            size="small"
            value={searchById}
            onChange={(event) => setSearchById(event.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => fetchDataById()}
                  disabled={!searchById || searchById.trim() === ""}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: "25ch" }} variant="standard">
          <InputLabel htmlFor="product_name">Buscar pornome</InputLabel>
          <Input
            id="product_name"
            size="small"
            value={searchByPartialName}
            onChange={(event) => setSearchByPartialName(event.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => fetchDataByName()}
                  disabled={
                    !searchByPartialName || searchByPartialName.trim() === ""
                  }
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>
      <DataTable
        columns={dataColumns}
        data={error ? [] : list}
        progressPending={loadingData}
        progressComponent={<CircularProgress />}
        noDataComponent={
          error !== undefined ? error : "Nenhum produto para mostrar!"
        }
        customStyles={customStyles}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle textAlign={"center"}>
          {isEditing ? "Editar Produto" : "Deletar Produto"}
        </DialogTitle>
        <DialogContent>
          {isDeleting ? (
            <>
              <Typography
                sx={{ width: 400, marginBottom: "1rem" }}
                color="error"
                variant="h6"
              >
                Esta ação é irreversível!
              </Typography>
              <Typography sx={{ width: 400 }}>ID: {isDeleting.id}</Typography>
              <Typography sx={{ width: 400 }}>
                Produto: {isDeleting.product_name}
              </Typography>
              <Typography sx={{ width: 400 }}>
                Category: {isDeleting.category}
              </Typography>
              <Typography sx={{ width: 400 }}>
                Quantidade: {isDeleting.stock}
              </Typography>
              <Typography sx={{ width: 400 }}>
                Preço: {isDeleting.price}
              </Typography>
            </>
          ) : (
            <>
              <TextField
                autoFocus
                margin="dense"
                id="product_name"
                name="product_name"
                label="Produto"
                fullWidth
                variant="standard"
                value={newProductName}
                onChange={handleNewProductNameChange}
                disabled={loading}
              />
              <TextField
                margin="dense"
                id="category"
                name="category"
                label="Categoria"
                fullWidth
                variant="standard"
                value={newCategory}
                onChange={handleNewCategoryChange}
                disabled={loading}
              />
              <TextField
                margin="dense"
                id="stock"
                name="stock"
                label="Estoque"
                fullWidth
                variant="standard"
                value={newStock}
                onChange={handleNewStockChange}
                disabled={loading}
              />
              <TextField
                margin="dense"
                id="price"
                name="price"
                label="Preço"
                fullWidth
                variant="standard"
                value={newPrice}
                onChange={handleNewPriceChange}
                disabled={loading}
              />
            </>
          )}
          {error && (
            <Alert severity="error">
              <Typography fontWeight="bold" sx={{ mb: 1 }}>
                Erro de submissão
              </Typography>
              <Typography fontWeight="bold" sx={{ mb: 1 }}>
                Detalhes do erro:
              </Typography>
              <Typography>{JSON.stringify(error)}</Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          {loading ? (
            <CircularProgress sx={{ mr: 2 }} size={30} />
          ) : (
            <>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color={isDeleting ? "error" : "primary"}
              >
                Confirmar
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SearchProducts;
