import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import path from 'path';
import viewsRouter from './routes/views.router.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app); //servidor HTTP para socket.io
const io = new Server (httpServer); // servidor WebSocket 

//Middleware para manejar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//para archivos estaticos por ejemplo script del cliente
app.use(express.static(path.join(__dirname, 'public')));

//configurar handlebars como motor de vistas
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set ('views', path.join(__dirname, 'views'));

//rutas para las vistas
app.use('/', viewsRouter);

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

