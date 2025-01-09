import express, { Express, Request, Response } from "express";
import { config } from "dotenv";
import path from "path";
import Db from "./database/Db";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import router from "./routes/router";

export default class Server {
  private app: Express;
  private port: number | null = null;
  private database: Db;

  constructor() {
    this.app = express();
    this.database = new Db();
  }

  private initialize(): void {
    this.configEnvironment();
    this.configDatabase();
    this.configMiddlewares();
    this.configRoutes();
    this.app.use(errorMiddleware as express.ErrorRequestHandler);
  }

  private configDatabase(): void{
    try {
      this.database.initTables();
    } catch (error) {
      console.error("Error initializing database:", error);
      process.exit(1);
    }
  }

  private configEnvironment(): void {
    config();
    this.port = Number(process.env.PORT) || 3001;
  }

  private configMiddlewares(): void {
    this.app.use(express.json());
  }
  
  private configRoutes(): void {
    this.app.use('/api', router);

    const buildPath = path.join(__dirname, "../build");
    this.app.use(express.static(buildPath));
    
    this.app.get(/.*/, (req: Request, res: Response) => {
      res.sendFile(path.resolve(buildPath, "index.html"));
    });
  }
  
  public start(): void{
    this.initialize();

    this.app.listen(this.port, () => {
        console.log(`Server running on http://localhost:${this.port}`);
    });
  }
}

