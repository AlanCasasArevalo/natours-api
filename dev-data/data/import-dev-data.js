const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel');
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});
let DB = process.env.DATABASE.replace(
    '<PASSWORD>',
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

// Import all backup data base
const importData = async () => {
    try {
        await Tour.create(tours)
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
      console.log('Data was deleted');
      process.exit();
  }  catch (error) {
      console.log('Error 💥', error);
  }
};
if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    deleteData()
}




