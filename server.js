require('dotenv').config();
import express from 'express';
import mongoose from 'mongoose';
import Routes from './routes/routes';
import Error from './app/Exceptions/Error';
const app = express();
const mongoDB = process.env.MONGO_URL;
var cors = require('cors');

app.use(express.json());

app.get('/api/check', (req, res) => {
  res.send('Hello World!');
});

// removing the CORS error
app.use(cors());
app.use('/api/users', Routes.AccountApiRouter); ///for user commands
app.use('/api/groups', Routes.GroupApiRouter); ///for group commands
app.use('/api/source', Routes.SourceApiRouter); ////for source commands

app.use((req, res, next) => {
  const error = new Error('Could not find this route.', 404); ///Incase of not having a route
  throw error;
});

app.use((error, req, res, next) => {
  //special 4 term function that lets know error to consider it as error
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({
    message: error.message || 'An unknown error occurred!',
    success: error.success || false,
  });
});

mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((date) => {
    console.log('DB connected');
  })
  .then(() => {
    console.log('listening at port', process.env.PORT || 5001);
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
// mongoose
//   .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then((data) => {
//     console.log('DB connected');
//   });
