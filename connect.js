const mongoose = require("mongoose");

async function mongodb(url){
    return mongoose.connect(url);
}

module.exports = mongodb;