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
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      },
      data: {
        productId: 'prod_QaHLTLx2K6fqzd', // Example product ID
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
      },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('id');

    console.log(body);

  });

  test('POST /create-transaction should create a transaction', async ({ request }) => {
    const response = await request.post('/create-transaction', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      },
      data: {
        amount: 2000, // Amount in cents
        currency: 'usd',
        payment_method: 'pm_card_visa', // Test payment method provided by Stripe
        receipt_email: 'test@example.com',
        return_url: 'https://example.com/return', // Include return_url
      },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('success', true);
    expect(body).toHaveProperty('paymentIntent');
    expect(body.paymentIntent).toHaveProperty('id');
  });

  test('POST /create-transaction for pizza product', async ({ request }) => {
    const productId = 'prod_QaHLTLx2K6fqzd'; // Use the ID of the "pizza" product
    const productResponse = await request.get(`/product?productId=${productId}`);
    expect(productResponse.ok()).toBeTruthy();
    const product = await productResponse.json();
    expect(product).toHaveProperty('id', productId);
    expect(product).toHaveProperty('name', 'pizza');

    const response = await request.post('/create-transaction', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      },
      data: {
        amount: 2000, // Amount in cents for pizza
        currency: 'usd',
        payment_method: 'pm_card_visa', // Test payment method provided by Stripe
        receipt_email: 'test@example.com',
        return_url: 'https://example.com/return', // Include return_url
      },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('success', true);
    expect(body).toHaveProperty('paymentIntent');
    expect(body.paymentIntent).toHaveProperty('id');
  });

  test('POST /create-pizza-transaction should create a pizza transaction', async ({ request }) => {
    const response = await request.post('/create-pizza-transaction', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      },
      data: {
        receipt_email: 'test@example.com',
      },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('success', true);
    expect(body).toHaveProperty('paymentIntent');
    expect(body.paymentIntent).toHaveProperty('id');
  });

});
