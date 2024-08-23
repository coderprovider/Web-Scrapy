import express, { Request, Response } from "express";
import dotenv from "dotenv";

var cors = require('cors')

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Node.js!");
});

app.listen(port, () => {
  console.log(`Server is running on ${port} port`);
});
