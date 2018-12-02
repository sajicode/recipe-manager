const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cons = require('consolidate');
const dust = require('dustjs-helpers');
const {
  Pool,
  Client
} = require('pg');

const app = express();

// DB connect string
const connectionString = 'postgres://sajicode:kamikaze@localhost/recipebookdb';

// Assign dust engine to .dust files
app.engine('dust', cons.dust);

// set default extension to dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// body parser middleware
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.get('/', function (req, res) {
  // const pool = new Pool({
  // 	connectionString: connectionString
  // });

  // pool.query('SELECT * FROM recipes', (err, res) => {
  // 	if (err) {
  // 		return console.error('Pool error', err);
  // 	} else {
  // 		console.log('Pool response', res.fields);
  // 		pool.end();
  // 	}
  // });

  const client = new Client({
    connectionString: connectionString
  });
  client.connect();

  client.query('SELECT * FROM recipes', (err, result) => {
    if (err) {
      return console.error('Client error', err);
    } else {
      // console.log('Client response', result.rows);
      res.render('index', {
        recipes: result.rows
      });
      client.end();
    }
  });
});

app.post('/add', function (req, res) {
  const client = new Client({
    connectionString: connectionString
  });
  client.connect();

  client.query('INSERT INTO recipes(name, ingredients, directions) VALUES($1, $2, $3)', [
    req.body.name,
    req.body.ingredients,
    req.body.directions
  ]);

  res.redirect('/');
  // done();

});

app.delete('/delete/:id', function (req, res) {
  const client = new Client({
    connectionString: connectionString
  });
  client.connect();

  client.query('DELETE FROM recipes WHERE id = $1', [
    req.params.id
  ]);

  // done();
  res.sendStatus(200)
  // res.redirect('/');
});

app.post('/edit', function (req, res) {
  const client = new Client({
    connectionString: connectionString
  });
  client.connect();

  client.query('UPDATE recipes SET name=$1, ingredients=$2, directions=$3 WHERE id=$4', [
    req.body.name,
    req.body.ingredients,
    req.body.directions,
    req.body.id
  ]);

  // done();
  res.redirect('/');
});

// server
app.listen(3000, function () {
  console.log('server started on port 3000');
});