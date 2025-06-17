import { Router } from "express";
import Cart from '../../models/Carts.js';
import Product from "../../models/Products.js";

const router = Router();

router.post('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid });
    }

    await cart.save();

    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
});


router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await Cart.findById(cid);
    if (!cart)
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    cart.products = cart.products.filter(p => p.product.toString() !== pid);

    await cart.save();

    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error('Error al eliminar producto del carrito', error);
    res.status(404).json({ status: 'error', message: 'Error interno del servidor' });
  }
});

router.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = products;
    await cart.save();

    res.json({ status: 'success', message: 'Carrito actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar carrito:', error);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' })
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = parseInt(req.body.quantity);
  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex === -1) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    res.json({ status: 'success', message: 'Cantidad actualizada correctamente', cart });
  } catch (error) {
    console.error('Error al actualizar cantidad del producto:', error);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
});

router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = [];
    await cart.save();

    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error('Error al vaciar carrito:', error);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
});

export default router;