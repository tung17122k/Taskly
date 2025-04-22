const Category = require("../models/category")

const createCategoryService = async (category) => {
    const { name } = category;
    if (!name) {
        return { error: "Tên danh mục không được để trống" };
    } else {
        const categoryExists = await Category.findOne({ name }).exec();
        if (categoryExists) {
            return { error: "Tên danh mục đã tồn tại" };
        } else {
            try {
                const newCategory = await Category.create(category);
                return newCategory;
            } catch (error) {
                return { error: error };
            }
        }
    }
}

const getCategoryService = async () => {
    try {
        const categories = await Category.find({}).exec();
        // console.log("categories", categories);
        if (!categories) {
            return { error: "Không có danh mục nào" };
        } else {
            return categories;
        }
    } catch (error) {
        return { error: error };
    }
}

const deleteCategoryService = async (id) => {
    console.log("id", id);

    try {
        let result = await Category.deleteById({ _id: id }).exec();
        return result
    } catch (error) {
        return { error: "Đã có lỗi xảy ra, vui lòng thử lại." };
    }
}



module.exports = {
    createCategoryService,
    getCategoryService,
    deleteCategoryService
}