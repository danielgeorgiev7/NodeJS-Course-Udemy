const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

function aliasTopTours(req, res, next) {
    req.query.limit = 5;
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

async function getAllTours(req, res) {
    try {
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const tours = await features.query;

        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            results: tours.length,
            data: {
                tours
            }
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err?.message || err
        });
    }
}

async function getTour(req, res) {
    try {
        const tour = await Tour.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err?.message || err
        });
    }
}

async function createTour(req, res) {
    try {

        const tour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour,
            },
        });
    }
    catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err?.message || err,
        })
    }
}

async function updateTour(req, res) {
    try {

        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });

    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err?.message || err
        })
    }
}

async function deleteTour(req, res) {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err?.message || err
        })
    }

}

function checkBody(req, res, next) {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price',
        });
    }
    next();
}

async function getTourStats(req, res) {
    try {
        const stats = await Tour.aggregate([
            {
                $match: {
                    ratingsAverage: { $gte: 4.5 }
                },
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                }
            },
            {
                $sort: {
                    avgPrice: 1,
                }
            },
        ]);
        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err?.message || err
        })
    }
}

async function getMonthlyPlan(req, res) {
    try {
        const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name' },
                }
            },
            {
                $addFields: { month: '$_id' },
            },
            {
                $project: {
                    _id: 0,
                }
            },
            {
                $sort: {
                    numTourStarts: -1
                }
            },
            {
                $limit: 12
            }
        ]);
        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err?.message || err
        })
    }
}

module.exports = { getAllTours, createTour, getTour, updateTour, deleteTour, checkBody, aliasTopTours, getTourStats, getMonthlyPlan };
