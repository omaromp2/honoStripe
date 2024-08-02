import { Hono } from 'hono';
import { ApiController } from './controllers/ApiCtrl';
import * as crypto from 'node:crypto'; // Use node: prefix

console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY); // Debug line to check if the key is loaded

const app = new Hono();

app.get('/', ApiController.getHome);
app.get('/users', ApiController.getUsers);
app.post('/checkout', ApiController.createCheckout);
app.get('/products', ApiController.getProducts);
app.post('/create-checkout-session', ApiController.createCheckoutSession);

export default {
  fetch: app.fetch,
};
