import Db from "../database/Db";
import CustomError from "../helpers/customError";
import { IProduct } from "../interfaces/interface";

export default class ProductService {
  private database: Db;

  constructor() {
    this.database = new Db();
  }

  public getAllProductsService(): IProduct[] {
    return this.database.getAllProducts();
  }

  public getProductByIdService(id: number): IProduct {
    const product = this.database.getProductById(id);
    if (!product)
      throw new CustomError(404, `Product with ID ${id} not found.`);

    return product;
  }

  public getProductsByPartialNameService(partialName: string): IProduct[] {
    const products = this.database.getProductsByPartialName(partialName);

    return products;
  }

  public createProductService(product: IProduct): IProduct {
    const created = this.database.createProduct(product);
    if (!created) throw new CustomError(500, "Internal server Error");

    return created;
  }

  public updateProductService(product: IProduct): IProduct {
    const prodctToUpdate = this.database.getProductById(product.id as number);
    if (!prodctToUpdate)
      throw new CustomError(404, `Product with ID ${product.id} not found.`);

    const updated = this.database.updateProduct(product);
    if (!updated) throw new CustomError(500, "Internal server error.");

    return updated;
  }

  public deteleProductService(id: number): object {
    const result = this.database.deleteById(id);
    if (!result) throw new CustomError(404, `Product with ID ${id} not found.`);

    return result;
  }
}
