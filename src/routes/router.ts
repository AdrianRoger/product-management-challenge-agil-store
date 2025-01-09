import { Router } from "express";
import RequestValidator from "../middlewares/requestValidator";
import ProductController from "../controllers/productController";

const router: Router = Router();
const productController = new ProductController();

router.get(
  "/products",
  productController.getAllProducts.bind(productController)
);

router.get(
  "/products/search",
  RequestValidator.validate,
  productController.getProductsByPartialName.bind(productController)
);

router.get(
  "/products/:id",
  RequestValidator.validate,
  productController.getProductById.bind(productController)
);

router.post(
  "/products",
  RequestValidator.validate,
  productController.createProduct.bind(productController)
);

router.put(
  "/products/:id",
  RequestValidator.validate,
  productController.updateProduct.bind(productController)
);

router.delete(
  "/products/:id",
  RequestValidator.validate,
  productController.deleteProduct.bind(productController)
);

export default router;
