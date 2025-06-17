import { Router } from "express";
import Product from "../../models/Products.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, sort, query} = req.query;

        const filter = query
            ? {
                $or: [
                    { category: query }, { status: query === true }]
            }
            : {};

        const sortOptions = sort ? { price: sort === 'asc' ? 1 : -1 } : {};

        const result = await Product.paginate(filter, {
            page,
            limit,
            sort: sortOptions,
            lean: true
        });

        const { docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } = result;

        res.json({
            status: 'success',
            payload: docs,
            totalPages,
            prevPage,
            nextPage,
            page: Number(page),
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `/api/products?page=${prevPage}` : null,
            nextLink: hasNextPage ? `/api/products?page=${nextPage}` : null
        });

    } catch (err) {
        console.error('❌ Error al paginar productos:', err);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

export default router;

