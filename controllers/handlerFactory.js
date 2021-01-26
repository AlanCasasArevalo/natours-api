const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const deleteOne = Model => catchAsync(async (req, res, next) => {
    const docModel = await Model.findByIdAndRemove(req.params.id);

    if (!docModel || typeof docModel === 'undefined') {
        return next(new AppError('No document was founded with that ID', 404))
    } else  {
        res.status(204).json({
            status: 'success',
            message: 'Removed',
            data: {
                docModel
            }
        })
    }
})

module.exports = {
    deleteOne
}