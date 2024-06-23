// Import mongoose
const mongoose = require('mongoose');

// MongoDB connection string
const mongoURL = 'mongodb://localhost:27017/mydatabase'; // Replace 'mydatabase' with your database name

// Options for the mongoose connection

// Connect to MongoDB
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;


db.on('connected',() => {
    console.log('Connected to MongoDB server');
});
db.on('error',(err)=> {
    console.log('MongoDB connection error',err);
});
db.on('disconnected',()=> {
    console.log(' MongoDB server disconnected');
});

// Export the mongoose connection
module.exports = db;
