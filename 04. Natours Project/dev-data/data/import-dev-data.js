const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const Tour = require('../../models/tourModel');
const Review = require('../../models/reviewModel');
const User = require('../../models/userModel');


dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})
    .then(() => console.log('DB connection established'))

// READ JSON FILE

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf8'));


// IMPORT DATA INTO DB

const importData = async () => {
    try {
        await Tour.create(tours, { validateBeforeSave: false });
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews, { validateBeforeSave: false });
        console.log('Data successfully loaded!');
        process.exit();
    }
    catch (err) {
        console.log(err);
    }
}

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data successfully deleted!');
        process.exit();
    }
    catch (err) {
        console.log(err);
    }
}

if (process.argv[2] === '--import') importData();
else if (process.argv[2] === '--delete') deleteData();
