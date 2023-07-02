const mongoose = require('mongoose');
const dotenv = require("dotenv");
const appServer = require('./app');
dotenv.config();



mongoose.connect(process.env.DATABASE_URL).then(con => {
  // console.log(con.connection);
  console.log("Connected to database succefully");
}).catch(err => {
  console.log("Error while connecting to DB", err);
})


const port = process.env.PORT || 3001;
const server = appServer.listen(port, () => {
  console.log("Listening on port ",port);
});

