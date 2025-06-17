import mongoose from "mongoose";
import dotenv from 'dotenv';
import Product from "./models/Products.js";

dotenv.config();

const products = [
    { title: 'Mouse Gamer', description: 'Mouse RGB', price: 5500, stock: 20, category: 'perifericos', thumbnail: 'mouse.jpg' },
    { title: 'Teclado Mecánico', description: 'Teclado RGB blue switches', price: 8500, stock: 15, category: 'perifericos', thumbnail: 'teclado.jpg' },
    { title: 'Monitor 24"', description: 'Monitor Full HD 24 pulgadas', price: 30000, stock: 10, category: 'pantallas', thumbnail: 'monitor.jpg' },
    { title: 'Notebook', description: 'Notebook Intel i5', price: 150000, stock: 5, category: 'computadoras', thumbnail: 'notebook.jpg' },
    { title: 'Auriculares', description: 'Auriculares gamer con micrófono', price: 7000, stock: 25, category: 'perifericos', thumbnail: 'auris.jpg' },
    { title: 'Silla Gamer', description: 'Silla ergonómica roja', price: 50000, stock: 8, category: 'accesorios', thumbnail: 'silla.jpg' },
    { title: 'Webcam', description: 'Webcam Full HD', price: 9000, stock: 18, category: 'accesorios', thumbnail: 'webcam.jpg' },
    { title: 'Router', description: 'Router WiFi doble banda', price: 12000, stock: 12, category: 'networking', thumbnail: 'router.jpg' },
    { title: 'Disco SSD', description: 'SSD 480GB', price: 18000, stock: 30, category: 'almacenamiento', thumbnail: 'ssd.jpg' },
    { title: 'Disco HDD', description: 'HDD 1TB', price: 14000, stock: 25, category: 'almacenamiento', thumbnail: 'hdd.jpg' },
    { title: 'Procesador Ryzen 5', description: 'CPU AMD Ryzen 5', price: 60000, stock: 7, category: 'componentes', thumbnail: 'ryzen.jpg' },
    { title: 'Placa madre', description: 'Motherboard B450', price: 25000, stock: 10, category: 'componentes', thumbnail: 'mother.jpg' },
    { title: 'Gabinete', description: 'Gabinete ATX con RGB', price: 20000, stock: 10, category: 'componentes', thumbnail: 'gabinete.jpg' },
    { title: 'Fuente 650W', description: 'Fuente certificada 80+', price: 18000, stock: 10, category: 'componentes', thumbnail: 'fuente.jpg' },
    { title: 'Cooler CPU', description: 'Refrigeración líquida', price: 22000, stock: 5, category: 'componentes', thumbnail: 'cooler.jpg' }
];

const runSeeder = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB');
        
        await Product.deleteMany();
        await Product.insertMany(products);

        console.log('Productos agregados correctamente');
        process.exit();
    }catch(error){
        console.error('Error al agregar productos', error);
        process.exit(1);
    }
};

runSeeder();