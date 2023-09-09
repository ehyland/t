import express from "express";
import supertest from "supertest";
import { register } from "~/routes";
import { describe, it, expect } from "vitest";

const app = express();
register(app);
const client = supertest(app);

describe("index route", () => {
  it("returns duration information", async () => {
    const response = await client.get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      "5 mins as seconds": 300,
    });
  });
});
