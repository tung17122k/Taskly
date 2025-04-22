
const { createCategoryService, getCategoryService, deleteCategoryService } = require("../services/categoryServices")

const createCategory = async (req, res) => {
    const result = await createCategoryService(req.body)
    // console.log("result", result);
    if (result.error) {
        return res.status(400).json({
            message: result.error,
            errorCode: 1,
        })
    } else {
        return res.status(200).json({
            data: result,
            message: "Tạo mới danh mục thành công",
            errorCode: 0,
        })
    }
}

const getCategory = async (req, res) => {
    const result = await getCategoryService();
    if (result.error) {
        return res.status(400).json({
            message: result.error,
            errorCode: 1,
        })
    } else {
        return res.status(200).json({
            data: result,
            message: "Lấy danh sách danh mục thành công",
            errorCode: 0,
        })
    }
}

const deleteCategory = async (req, res) => {
    // console.log("req.params.id", req.query.userId);
    const result = await deleteCategoryService(req.query.id)
    if (result.error) {
        return res.status(400).json({
            message: result.error,
            errorCode: 1,
        })
    } else {
        return res.status(200).json({
            message: "Xóa danh mục thành công",
            errorCode: 0,
        })
    }
}

module.exports = {
    createCategory,
    getCategory,
    deleteCategory
}