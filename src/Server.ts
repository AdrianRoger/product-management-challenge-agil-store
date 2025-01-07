import express, { Express, Request, Response } from "express";
import { config } from "dotenv";
import path from "path";
// import Database from "./database/Database";
import Db from "./database/Db";
import router from "./routes/Routes";

export default class Server {
  private app: Express;
  private port: number | null = null;
  private database: Db;

  constructor() {
    this.app = express();
    this.database = new Db();
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
  
  private configStaticFiles(): void {
    const buildPath = path.join(__dirname, "../build");
    this.app.use(express.static(buildPath));
    
    this.app.get(/.*/, (req: Request, res: Response) => {
      res.sendFile(path.resolve(buildPath, "index.html"));
    });
  }
  
  public async start(): Promise<void>{
    this.configEnvironment();
    this.configMiddlewares();
    await this.configDatabase();

    this.app.use('/api', router);

    this.configStaticFiles();

    this.app.listen(this.port, () => {
        console.log(`Server running on http://localhost:${this.port}`);
    });
  }
}

