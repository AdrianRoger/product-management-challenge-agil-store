import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import PersistentDrawerLeft from "./components/persistentDrawertLeft";
import ProductList from "./components/productList";
import { getProducts } from "./services/api";

import "./App.css";

function App() {

  return (
    <PersistentDrawerLeft>
      <Routes>
        <Route index path="/" element={<ProductList />} />
      </Routes>
    </PersistentDrawerLeft>
  );
}

export default App;
