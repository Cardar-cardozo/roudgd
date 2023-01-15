const mongoose = require('mongoose');
require('dotenv').config()


const connectDB = async () => {
    try {
        mongoose.connect(process.env.DEV_DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('db connected')
    } catch (err) {
        console.log(err);
        process.exit(1);
    }

}



module.exports = connectDB;