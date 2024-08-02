import { test, expect } from "@playwright/test";

test.describe("Hono API", () => {
  test("GET /", async ({ request }) => {
    const response = await request.get("/");
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toEqual({ message: "Hello Hono!" });
  });

  test("GET /users", async ({ request }) => {
    const response = await request.get("/users");
    console.log(response);
    // expect(response.ok()).toBeTruthy();
    // const users = await response.json();
    // expect(Array.isArray(users)).toBeTruthy();
  });

  // test("POST /checkout", async ({ request }) => {
  //   const response = await request.post("/checkout", {
  //     data: {
  //       email: "test@example.com",
  //       amount: 1000,
  //     },
  //   });
  //   expect(response.ok()).toBeTruthy();
  //   const body = await response.json();
  //   expect(body).toHaveProperty("clientSecret");
  // });
});
