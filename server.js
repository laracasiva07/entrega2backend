import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import exphbs from 'express-handlebars';
import {allowInsecurePrototypeAccess} from '@handlebars/allow-prototype-access';
import Handlebars from 'handlebars';
import path from 'path';
import viewsRouter from './routes/views.router.js';
import productApiRouter from './routes/api/products.router.js';
import productViewsRouter from './routes/products.views.router.js';
import cartsRouter from './routes/api/carts.router.js';
import cartsViewsRouter from './routes/carts.views.router.js';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error al conectar:', err));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app); //servidor HTTP para socket.io
const io = new Server (httpServer); // servidor WebSocket 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//para archivos estaticos por ejemplo script del cliente
app.use(express.static(path.join(__dirname, 'public')));

//configurar handlebars como motor de vistas
const hbs = exphbs.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
    eq: (a, b) => a === b, 
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    gt: (a, b) => a > b
  }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set ('views', path.join(__dirname, 'views'));

app.use(cookieParser());
app.use(methodOverride('_method'));
//rutas para las vistas
app.use('/', viewsRouter);
app.use('/api/products', productApiRouter);
app.use('/products', productViewsRouter);
app.use('/api/carts', cartsRouter);
app.use('/carts', cartsViewsRouter);

//SOCKET.IO
let products = []; //arreglo de productos en memoria 

io.on('connection', socket => {
    console.log('Cliente conectado con Websocket');

    //enviar lista actual de productos
    socket.emit('productsList', products);

    //agregar un producto
    socket.on('addProduct', product => {
        product.id = Date.now();
        products.push(product);
        io.emit('productsList', products);
    });
    //eliminar producto
    socket.on('deleteProduct', id => {
        products = products.filter(p => p.id !== id);
        io.emit('productsList', products);
    });
});

//levantar el servidor 
const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`Servidor funcionando en: ${PORT}`);
});

