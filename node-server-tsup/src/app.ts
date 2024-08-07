import cors from "cors";
import express from "express";
import morgan from "morgan";
import * as routes from "~/routes";

export const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

routes.installRoutes(app);
