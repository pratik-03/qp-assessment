import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import { connectDB } from './config/database';

import route from './routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb', parameterLimit: 1000000 }));

app.use(express.json());

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

startServer();


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api/v1", route);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});