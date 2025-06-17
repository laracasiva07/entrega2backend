import { Router } from 'express';
import ProductModel from '../models/Products.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const products = await ProductModel.find().lean(); // Trae los productos como objetos simples
    res.render('home', { products });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send('Error al obtener productos');
  }
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts'); 
});

export default router;
