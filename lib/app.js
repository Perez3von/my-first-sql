const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/people', async(req, res) => {
  try {
    const data = await client.query(`SELECT
    people.id, 
    name,
    cool_factor,
    loves_music,
    color
    FROM people
    INNER JOIN colors
      ON people.shirt_color = colors.id
    ORDER BY people.id
      
      `);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


app.get('/colors', async(req, res) => {
  try {
    const data = await client.query(`SELECT
    *
    FROM colors

      `);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});





app.get('/people/:id', async(req, res) => {
  try {
    const data = await client.query(
      `SELECT
    people.id, 
    name,
    cool_factor,
    loves_music,
    color
    FROM people
    INNER JOIN colors
      ON people.shirt_color = colors.id
    ORDER BY people.id
      `
    );
    
    const urlParam = Number(req.params.id);
   
    const person = data.rows.find((persono)=>(persono.id === urlParam));
   
    res.json(person);

  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});




app.post('/people', async(req, res) => {
  try {
    console.log(req.body);
    const data = await client.query(`
    INSERT INTO people(
      name,
      cool_factor,
      loves_music,
      shirt_color
    ) VALUES ($1, $2, $3, $4) 
    RETURNING *;`, [
      req.body.name,
      req.body.cool_factor,
      req.body.loves_music,
      req.body.shirt_color
    ]);

    res.json(data.rows[0]);

  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});






app.put('/people/:id', async(req, res)=>{
  try {
    const data = await client.query(`
      UPDATE people
      SET 
        name=$2,
        cool_factor=$3,
        loves_music=$4,
        shirt_color=$5
      WHERE id = $1
      RETURNING *;
    `, [
      req.params.id,
      req.body.name,
      req.body.cool_factor,
      req.body.loves_music,
      req.body.shirt_color
     
    ]);
    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

















app.use(require('./middleware/error'));

module.exports = app;
