import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  const products = [
    { title: 'Mouse', description: 'Mouse gamer', price: 5000 },
    { title: 'Teclado', description: 'Teclado mecánico', price: 8000 },
    { title: 'Monitor', description: 'Monitor 24"', price: 30000 }
  ];
  res.render('home', {products}); // Esta vista la vamos a crear luego
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts'); // Esta vista también
});

export default router;
