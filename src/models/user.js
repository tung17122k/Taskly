const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'customer', 'shipper'],
        default: 'customer'
    },
});

userSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const User = mongoose.model('user', userSchema);

module.exports = User;
