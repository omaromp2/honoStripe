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
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

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
          // 'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY!}`,
            // 'Authorization': `Bearer sk_test_51Pj5vrKnmkTtnse15vvE0RPGoipfEjdQcENXaL2Ak4meOd5CrbO7olyA306ZI0p5Dr1gOa4YpC9VC16FXc4iIn3U008icJlhEo`,
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

  static async createCheckoutSession(c: Context) {
      const {
          productId,
          successUrl,
          cancelUrl
      } = await c.req.json();

      try {
          const session = await stripe.checkout.sessions.create({
              payment_method_types: ['card'],
              line_items: [{
                  price_data: {
                      currency: 'usd',
                      product: productId,
                      unit_amount: 2000, // Update with the correct amount
                  },
                  quantity: 1,
              }, ],
              mode: 'payment',
              success_url: successUrl,
              cancel_url: cancelUrl,
          });

          return c.json({
              id: session.id
          });
      } catch (error) {
          console.error(error);
          return c.json({
              error: 'Failed to create checkout session'
          }, 500);
      }
  }

}
