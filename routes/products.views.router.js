import { Router } from "express";
import Product from "../models/Products.js";
import Cart from "../models/Carts.js";

const router = Router();

router.get('/start', async (req, res) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res
      .cookie('cid', newCart._id.toString(), {
        maxAge: 1000 * 60 * 60 * 24, // 1 día
        httpOnly: true
      })
      .redirect('/products');

  } catch (error) {
    console.error('Error creando carrito inicial:', error);
    res.status(500).send('Error al crear carrito');
  }
});

router.get('/', async (req, res) => {
 
  let { page = 1, limit = 10, sort, query, cid } = req.query;

  if (!cid && req.cookies.cid) {
  cid = req.cookies.cid;
}
  if (!cid) {
    return res.redirect('/products/start');
  }

  let filter = {};
  if (query) {
    if (query.toLowerCase() === 'true' || query.toLowerCase() === 'false') {
      filter.status = query.toLowerCase() === 'true';
    } else {
      filter.category = query;
    }
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    lean: true
  };

  try {
    const result = await Product.paginate(filter, options);

    const baseUrl = `/products?limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`;

    res.render('products', {
      payload: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      prevLink: result.hasPrevPage ? `${baseUrl}&page=${result.prevPage}&cid=${cid}` : null,
      nextLink: result.hasNextPage ? `${baseUrl}&page=${result.nextPage}&cid=${cid}` : null,
      limit,
      sort,
      query,
      cid
    });

  } catch (error) {
    console.error('Error al cargar productos:', error);
    res.status(500).send('Error al obtener productos');
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const { cid } = req.query;
    const product = await Product.findById(pid).lean();

    if (!product) {
      return res.status(404).render('error', { message: 'Producto no encontrado' });
    }
    res.render('productDetail', { product, cid });
  } catch (error) {
    console.error('Error al obtener producto', error);
    res.status(500).render('error', { message: 'Error al obtener producto' });
  }
});

export default router;
