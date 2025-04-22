const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

// const CATEGORY_NAMES = ['Món chính', 'Nước uống', 'Món phụ'];


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    order: Number,
}, { timestamps: true });

categorySchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Category = mongoose.model('category', categorySchema);

module.exports = Category;
