const API_URL = `http://localhost:3000/api/products/`;

export const getProducts = async () => {
  const response = await fetch(`${API_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  if (response.error) {
    return response;
  }

  return response.data;
};

export const getProductById = async (id) => {
  return await fetch(`${API_URL}${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};

export const getProductsByPatialName = async (product_name) => {
  return await fetch(`${API_URL + "search?product_name=" + product_name}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};

export const createProduct = async (product) => {
  const price = Number(product.price).toFixed(2)
  const sanitized = {...product, price}
  console.log('Price: ', sanitized)
  return await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...sanitized }),
  }).then((res) => res.json());
};

export const updateProduct = async (id, product) => {
  return await fetch(`${API_URL}${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...product }),
  }).then((res) => res.json());
};


export const deleteProductById = async (id) => {
  return await fetch(`${API_URL}${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};
