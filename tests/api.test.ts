import {
  test,
  expect
} from "@playwright/test";

test.describe("Hono API", () => {
  test("GET /", async ({
    request
  }) => {
    const response = await request.get("/");
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toEqual({
      message: "Hello Hono!"
    });
  });

  test("GET /users", async ({
    request
  }) => {
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

  test("GET /products", async ({
    request
  }) => {
    const response = await request.get("/products");
    expect(response.ok()).toBeTruthy();
    const products = await response.json();
    expect(products).toHaveProperty("data");
    expect(Array.isArray(products.data)).toBeTruthy();
  });

  test("POST /create-checkout-session", async ({
    request
  }) => {
    const response = await request.post('/create-checkout-session', {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Authorization': 'Bearer sk_test_51Pj5vrKnmkTtnse15vvE0RPGoipfEjdQcENXaL2Ak4meOd5CrbO7olyA306ZI0p5Dr1gOa4YpC9VC16FXc4iIn3U008icJlhEo',
      },
      data: {
        productId: 'prod_QaHLTLx2K6fqzd', // Example product ID
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
      },
    });
    // expect(response.ok()).toBeTruthy();
    const body = await response.json();
    // expect(body).toHaveProperty('id');

    console.log(body);

  });

});
