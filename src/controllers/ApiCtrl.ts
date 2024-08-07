import { Context } from 'hono';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
// import { config } from 'dotenv';

// config();

export type Env = {
  STRIPE_SECRET_KEY: string;
  RANDVAR: string;
}

const prisma = new PrismaClient();

export class ApiController {
  static async getHome(c: Context) {
    // console.log('Stripe Secret Key:', st); // Debug line to check if the key is loaded

    return c.json({ message: `Hello Hono!, ${c.env.RANDVAR}` });
  }

  static async getUsers(c: Context) {
    const userCount = await prisma.user.count();
    console.log(userCount);
    return c.json({ count: userCount });
  }

  static async createCheckout(c: Context) {
    const { email, amount } = await c.req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      receipt_email: email,
    });

    return c.json({ clientSecret: paymentIntent.client_secret });
  }

  static async getProducts(c: Context) {
    try {
      const response = await fetch('https://api.stripe.com/v1/products', {
        headers: {
            'Authorization': `Bearer ${c.env.STRIPE_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Stripe API request failed with status ${response.status}`);
      }

      const products = await response.json();
      return c.json(products);
    } catch (error) {
      console.error(error);
      return c.json({ error: 'Failed to fetch products from Stripe' }, 500);
    }
  }

  static async getProduct(c: Context) {
    const { productId } = c.req.query();

    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });

    try {
      const product = await stripe.products.retrieve(productId);
      return c.json(product);
    } catch (error) {
      console.error(error);
      return c.json({ error: 'Failed to fetch product from Stripe' }, 500);
    }
  }

  static async createCheckoutSession(c: Context) {
    const { productId, successUrl, cancelUrl } = await c.req.json();

    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product: productId,
              unit_amount: 2000, // Update with the correct amount
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      return c.json({ id: session.id });
    } catch (error) {
      console.error(error);
      return c.json({ error: 'Failed to create checkout session' }, 500);
    }
  }

  static async createTransaction(c: Context) {
    const { amount, currency, payment_method, receipt_email, return_url } = await c.req.json();

    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method,
        receipt_email,
        confirmation_method: 'automatic',
        confirm: true,
        return_url, // Include the return_url
      });

      return c.json({ success: true, paymentIntent });
    } catch (error) {
      console.error(error);
      return c.json({ success: false, error: error.message }, 500);
    }
  }

  static async createPizzaTransaction(c: Context) {
    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });

    try {
      // Assuming the pizza product has a fixed price, retrieve the product and price ID
      const productId = 'prod_QaHLTLx2K6fqzd'; // Replace with actual product ID for pizza
      const priceId = 'price_1Pj6mXKnmkTtnse1hAzS8Cj6'; // Replace with actual price ID for pizza

      const paymentIntent = await stripe.paymentIntents.create({
        amount: 200, // Amount in cents for pizza
        currency: 'usd',
        payment_method_types: ['card'],
        receipt_email: 'test@example.com', // Replace with actual receipt email
        description: 'Purchase of pizza product',
        metadata: { product_id: productId },
      });

      return c.json({ success: true, paymentIntent });
    } catch (error) {
      console.error(error);
      return c.json({ success: false, error: error.message }, 500);
    }
  }

}
