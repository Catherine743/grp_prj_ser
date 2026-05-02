const mongoose = require('mongoose')

const connectionString = process.env.connectionString

mongoose.connect(connectionString).then(res => {
    console.log("smartTracker-server successfully connected to MongoDb");
}).catch((error) => {
    console.log("Connection failed...");
    console.log(error);
})