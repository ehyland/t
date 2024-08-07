import { describe, expect, it } from "vitest";
import { client } from "./client";

describe("main integration test", () => {
  it("works", async () => {
    const response = await client.get("/");

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      message: "hello",
    });
  });
});
