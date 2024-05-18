import express, { Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { FileRoute } from "./routes";

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/files", express.static(path.join(__dirname, "files")));

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the markdown note taking app");
});

app.use("/api/v1/files", FileRoute);

app.get("*", (req: Request, res: Response) => {
  res.send("Route does not exist");
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
