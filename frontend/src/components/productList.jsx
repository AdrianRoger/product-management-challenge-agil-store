import { useEffect, useState } from "react";
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
  Autocomplete,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DataTable from "react-data-table-component";
import {
  createProduct,
  deleteProductById,
  getProducts,
  updateProduct,
} from "../services/api";

const ProductList = () => {
  const [list, setList] = useState();
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState();
  const [open, setOpen] = useState(false);

  const [productId, setProductId] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const [error, setError] = useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleEditClick = (product) => {
    setProductId(product.id);
    setNewProductName(product.product_name);
    setNewCategory(product.category);
    setNewStock(product.stock);
    setNewPrice(product.price);
    setOpen(true);
    setIsEditing(true);
    console.log(product);
  };

  const handleDeleteClick = (product) => {
    setOpen(true);
    setIsDeleting(product);
    setProductId(product.id);
  };

  const handleNewProductChange = (e) => {
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
      : isDeleting
      ? await deleteProductById(productId)
      : await createProduct({
          product_name: newProductName,
          category: newCategory,
          stock: newStock,
          price: Number(newPrice).toFixed(2),
        });

    if (response.error) {
      setError(sanitizeErrorMessage(response.error));
    } else {
      setError("");
      handleClose();
    }
    setLoading(false);
    fetchData();
  };

  function sanitizeErrorMessage(errorMessage) {
    const cleanMessage = errorMessage.replace(/['"\\]/g, "");

    const formattedMessage =
      cleanMessage.charAt(0).toUpperCase() + cleanMessage.slice(1);
    return formattedMessage.endsWith(".")
      ? formattedMessage
      : `${formattedMessage}.`;
  }

  const handleFilterCategory = (category) => {
    if(!category){
        setFiltered([])
    }else{
        setFiltered(list.filter((item) => item.category === category))
    }
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

  const fetchData = async () => {
    setLoadingData(true);
    const result = await getProducts();
    setLoadingData(false);
    setList(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Button sx={{ mr: 1 }} variant="contained" onClick={handleClickOpen}>
          <AddIcon fontSize="medium" sx={{ mr: 1 }} />
          cadastrar produto
        </Button>
        {list && (
          <Autocomplete
            freeSolo
            sx={{ display: "inline-block", width: '300px' }}
            id="categoria"
            onInputChange={(e, value) => handleFilterCategory(value)}
            size="small"
            disableClearable
            options={[...new Set(list.map((option) => option.category))]} 
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filtrar categoria"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    type: "search",
                  },
                }}
              />
            )}
          />
        )}
      </Box>
      <DataTable
        columns={dataColumns}
        data={filtered.length !== 0 ? filtered : list}
        progressPending={loadingData}
        progressComponent={<CircularProgress />}
        noDataComponent={!list && "Nenhum produto para mostrar!"}
        customStyles={customStyles}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle textAlign={"center"}>
          {isEditing
            ? "Editar Produto"
            : isDeleting
            ? "Deletar Produto"
            : "Novo Produto"}
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
                onChange={handleNewProductChange}
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

export default ProductList;
