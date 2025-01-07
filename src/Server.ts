import express, { Express, Request, Response } from "express";
import { config } from "dotenv";
import path from "path";
import router from "./routes/Routes";

class Server {
  private app: Express;
  private port: number | null = null;

  constructor() {
    this.app = express();
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
  
  public start(): void{
    this.configEnvironment();
    this.configMiddlewares();
    this.app.use('/api', router);

    this.configStaticFiles();

    this.app.listen(this.port, () => {
        console.log(`Server running on http://localhost:${this.port}`);
    });
  }
}

export default Server;
