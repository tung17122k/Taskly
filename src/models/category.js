const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const CATEGORY_NAMES = ['Món chính', 'Nước uống', 'Món phụ'];


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: CATEGORY_NAMES,  // ← giới hạn chỉ 3 lựa chọn
    },
    description: String,
    order: Number,
}, { timestamps: true });

categorySchemaSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Category = mongoose.model('category', categorySchema);

module.exports = Category;
