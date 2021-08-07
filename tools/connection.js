let mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

mongoose.connection.once('open', () => {
    console.log("Connected with mongoDB database!");
}).on('error', error => {
    console.log("Oops! database connection error:" + error);
});

module.exports = { mongoose };