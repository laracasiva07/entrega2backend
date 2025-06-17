import { Router } from 'express';
import Cart from '../models/Carts.js';

const router = Router();

router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await Cart.findById(cid).populate('products.product').lean();

    if (!cart) {
      return res.status(404).render('error', { message: 'Carrito no encontrado' });
    }

    res.render('cartDetail', { cart });
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).render('error', { message: 'Error interno del servidor' });
  }
});


export default router;
