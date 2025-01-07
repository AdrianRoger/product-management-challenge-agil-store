import Database, { RunResult } from "better-sqlite3";
import { IProduct } from "../interfaces/Interfaces";
import { config } from "dotenv";
import { getDatabasePath } from "../config/configDatabase";

export default class Db {
  private db;

  constructor() {
    config();
    this.db = new Database(getDatabasePath(), { verbose: console.log });
  }

  /** Initialize table */
  public initTables() {
    const createProductTable = `
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT NOT NULL,
            category TEXT NOT NULL,
            stock INTEGER NOT NULL,
            price REAL NOT NULL
        );`;

    const params: IProduct = {
      product_name: 'smart TV 55"',
      category: "eletronico",
      stock: 32,
      price: 2165.99,
    };

    this.db.prepare(createProductTable).run();
    if (process.env.NODE_ENV === "dev") {
      this.clearTable();
      this.createProduct(params);
      console.log("Database cleared and seeded for development.");
    } else {
      console.log(`Table 'products' checked/created.`);
    }
  }

  public getProductById(id: number): IProduct | null {
    const sql = `SELECT * FROM products WHERE id = ?`;
    const row = this.db.prepare(sql).get(id);
    if(!row){
      return null
    }
    
    return row as IProduct
  }

  public getAllProducts(): IProduct[] {
    const sql = `SELECT * FROM products`;
    const rows = this.db.prepare(sql).all();

    return rows as IProduct[];
  }

  public createProduct(data: IProduct): IProduct | null {
    const sql = `INSERT INTO products (product_name, category, stock, price) VALUES (?, ?, ?, ?)`;
    const result: RunResult = this.db
      .prepare(sql)
      .run([data.product_name, data.category, data.stock, data.price]);

    return this.getProductById(Number(result.lastInsertRowid));
  }

  public updateProduct(data: IProduct): IProduct | null {
    const sql = `UPDATE products 
        SET product_name = ?, 
        category = ?, 
        stock = ?, 
        price = ? 
        WHERE id = ?`;

    const result = this.db.prepare(sql).run(Object.values(data));
    
    if(result.changes === 0){
      return null
    }

    return data;
  }

  public deleteById(id: number): string | null {
    const sql = `DELETE FROM products WHERE id = ?`;
    const result = this.db.prepare(sql).run(id);
    if(result.changes === 0){
      return null
    }

    return `Product with ID ${id} deleted successfully.`;
  }

  public clearTable(): void {
    const sql = `DELETE FROM products`;
    this.db.prepare(sql).run();
  }
}
