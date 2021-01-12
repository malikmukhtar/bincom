const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql');
const bodyParser = require('body-parser'); // body-parser middleware

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bincom',
});

// Test SQL connection
connection.connect((err, res) => {
  if (err) throw err;
  console.log('db server connected');
});

//Result for Individual polling unit
app.get('/pu/:id', (req, res) => {
  connection.query(
    `select * from announced_pu_results where polling_unit_uniqueid = ${req.params.id}`,
    (err, resp) => {
      res.send(resp);
    }
  );
});

//Store Result for new polling unit
app.post('/new', (req, res) => {
  connection.query(
    `insert into new_polling_unit (polling_unit_name,result) values('${req.body.name}','${req.body.result}')`,
    (err, resp) => {
      if (err) return res.status(400).send(err);
      res.send('New polling unit result inserted');
    }
  );
});

// Listen on port
const port = process.env.PORT || 3000; // set port
app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = app;
