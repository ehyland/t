import supertest from "supertest";
import { app } from "~/app";

export const client = supertest(app);
