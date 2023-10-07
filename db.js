const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// connection to the database

const db = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`Mongo is connected: ${con.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = db;