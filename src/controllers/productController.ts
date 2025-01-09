import { Request, Response } from "express";
import ProductService from "../services/productService";
import { IProduct } from "../interfaces/interface";

export default class ProductController {
    private productService: ProductService;

    constructor(){
        this.productService = new ProductService();
    }

    public getAllProducts(req: Request, res: Response): void {
        const data = this.productService.getAllProductsService();
        res.status(200).json({ status: 200, data });
    }
    
    public getProductById(req: Request, res: Response): void {
        const data = this.productService.getProductByIdService(Number(req.params.id));
        res.status(200).json({ status: 200, data });
    }
    
    public getProductsByPartialName(req: Request, res: Response): void {
        const { product_name } = req.query;
        const data = this.productService.getProductsByPartialNameService(product_name as string);
        
        res.status(200).json({ status: 200, data });
    }
    
    public createProduct(req: Request, res: Response): void {
        const { product_name, category, stock, price } = req.body;
        const created = this.productService.createProductService({ product_name, category, stock, price });
        
        res.status(201).json({ status: 201, data: created });
    }
    
    public updateProduct(req: Request, res: Response): void {
        const id = Number(req.params.id);
        const data: IProduct = req.body;

        const productToUpdate: IProduct = { id, ...data };

        const updated = this.productService.updateProductService(productToUpdate);

        res.status(200).json({ status: 200, data: updated });
    }
    
    public deleteProduct(req: Request, res: Response): void {
        const id = Number(req.params.id);
        const result = this.productService.deteleProductService(id);
        
        res.status(200).json({ status: 200, ...result });
    }
}