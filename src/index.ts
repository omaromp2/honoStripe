import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import { config } from "dotenv";
import * as crypto from "node:crypto"; // Use node: prefix

config();

console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY);

const app = new Hono();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

app.get("/", (c) => c.json({ message: "Hello Hono!" }));

app.get("/users", async (c) => {
  // const users = await prisma.user.findMany();
  const users = await prisma.user.count();
  console.log(users);
  // return c.json(users);
  return c.json({
    count: users,
  });
});

app.post("/checkout", async (c) => {
  const { email, amount } = await c.req.json();

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    receipt_email: email,
  });

  return c.json({ clientSecret: paymentIntent.client_secret });
});

// New endpoint to get products from Stripe
app.get('/products', async (c) => {
  try {
    const products = await stripe.products.list();
    return c.json(products);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to fetch products from Stripe' }, 500);
  }
});

export default {
  fetch: app.fetch,
};
