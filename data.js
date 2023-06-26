const express = require('express');
const cors = require('cors');
const Datasore = require('nedb');
const { request } = require('http');
const app = express();

app.use(cors()); // Use CORS middleware
app.use(express.json()); // Middleware to parse JSON bodies

// app.get('/', (req, res) => {
//   res.send('Server is working');
// });

const database = new Datasore('database.db');
database.loadDatabase();

app.get('/data', (req, res) => {
    database.find({}, {_id: 0}, (err, data) => {
        if (err) {
            res.end();
            return;
        }
        data.sort((a, b) => Number(a['Time Stamp']) - Number(b['Time Stamp']))
        res.json(data);
    })
}
);

app.post('/data', (request, response) => {
  const savedData = request.body.savedData;
  // Now you can do whatever you need with the savedData...
  database.insert(savedData);
  response.json({
    savedData
  })
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});






