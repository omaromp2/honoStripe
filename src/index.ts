import { Hono } from 'hono';
import { ApiController } from './controllers/ApiCtrl';
// import * as crypto from 'node:crypto'; // Use node: prefix

const app = new Hono();

app.get('/', ApiController.getHome);
app.get('/users', ApiController.getUsers);
app.post('/checkout', ApiController.createCheckout);
app.get('/products', ApiController.getProducts);
app.post('/create-checkout-session', ApiController.createCheckoutSession);

export default {
  fetch: app.fetch,
};
