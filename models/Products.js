import mongoose from 'mongoose';
import moongosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    stock: Number,
    category: String,
    thumbnail: String,
});

productSchema.plugin(moongosePaginate);

const Product = mongoose.model('Product', productSchema);
export default Product;