import { Route, Routes } from "react-router-dom";
import PersistentDrawerLeft from "./components/persistentDrawertLeft";
import ProductList from "./components/productList";
import SearchProducts from "./components/searchProducts";

import "./App.css";

function App() {

  return (
    <PersistentDrawerLeft>
      <Routes>
        <Route index path="/" element={<ProductList />} />
        <Route index path="/search" element={<SearchProducts />} />
      </Routes>
    </PersistentDrawerLeft>
  );
}

export default App;
