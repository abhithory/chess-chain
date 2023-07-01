const mongoose = require('mongoose');
const dotenv = require("dotenv");
const appServer = require('./app');
dotenv.config();



const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(process.env.DATABASE_URL).then(con => {
  // console.log(con.connection);
  console.log("Connected succefully");
}).catch(err => {
  console.log("Error while connecting to DB", err);
})


const port = process.env.PORT || 3001;
const server = appServer.listen(port, () => {
  console.log("Listening on port 3000");
});

