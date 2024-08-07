import { Hono } from 'hono';
import { ApiController } from './controllers/ApiCtrl';
// import * as crypto from 'node:crypto'; // Use node: prefix

const app = new Hono();

app.get('/', ApiController.getHome);
app.get('/users', ApiController.getUsers);
app.post('/checkout', ApiController.createCheckout);
app.get('/products', ApiController.getProducts);
app.get('/product', ApiController.getProduct);
app.post('/create-checkout-session', ApiController.createCheckoutSession);  
app.post('/create-transaction', ApiController.createTransaction);   
app.post('/create-pizza-transaction', ApiController.createPizzaTransaction); 

export default {
  fetch: app.fetch,
};
