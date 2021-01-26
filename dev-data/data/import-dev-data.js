const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');

const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});
let DB = process.env.DATABASE.replace(
    '<DATABASE_PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then((connection) => {
        // console.log('Mongoose connection', connection.connections );
        console.log('DB connection SUCCESSFUL!!');
    });

//Read Json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// Import all backup data base
const importData = async () => {
    try {
        await Tour.create(tours)
        await User.create(users, { validateBeforeSave: false})
        await Review.create(reviews)
        console.log('Data backup was loaded');
        process.exit();
    } catch (error) {
        console.log('Error 💥', error);
    }
};

// Delete all data from collection
const deleteData = async () => {
  try {
      await Tour.deleteMany();
      await User.deleteMany();
      await Review.deleteMany();
      console.log('Data was deleted');
      process.exit();
  }  catch (error) {
      console.log('Error 💥', error);
  }
};
if (process.argv[2] === '--import') {
    importData()
        .then(success => console.log(`Operacion Realizada correctamente`))
        .catch(error => console.log(`Error al realizar la operacion`))
} else if (process.argv[2] === '--delete') {
    deleteData()
        .then(success => console.log(`Operacion Realizada correctamente`))
        .catch(error => console.log(`Error al realizar la operacion`))
}




