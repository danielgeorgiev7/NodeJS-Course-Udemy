const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

function getAllTours(req, res) {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    })
}

function getTour(req, res) {

    const tour = tours.find(el => el.id === (req.params.id * 1));

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });

}

function createTour(req, res) {

    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        });
    });
}

function updateTour(req, res) {
    const tour = tours.find(el => el.id === (req.params.id * 1));

    // Update tour logic here

    res.status(200).json({
        status: 'success',
        data: {
            tour: 'Updated tour here...'
        }
    });
    res.status(404).json({
        status: 'fail',
        data: {
            tour: 'Invalid ID'
        }
    });
}

function deleteTour(req, res) {
    const tour = tours.find(el => el.id === (req.params.id * 1));

    // Delete tour logic here

    res.status(204).json({
        status: 'success',
        data: null
    });

}

function checkId(req, res, next) {
    if (!tours.find(el => el.id === req.params.id * 1))
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    next();
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

module.exports = { getAllTours, createTour, getTour, updateTour, deleteTour, checkId, checkBody };
