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

const updateOne = Model => catchAsync(async (req, res, next) => {
    const docModel = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!docModel || typeof docModel === 'undefined') {
        return next(new AppError('No document was founded with that ID', 404))
    } else  {
        res.status(200).json({
            status: 'success',
            message: 'Updated',
            data: {
                docModel
            }
        })
    }
});

module.exports = {
    deleteOne,
    updateOne
}