const express = require('express');
const morgan = require('morgan');

const { getSeats,
  updateSeat } = require('./handlers');


const PORT = 5678;

var app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(require('./routes'));

app.get('/seats/allSeats', getSeats)
app.put('/seats/allSeats/:_id', updateSeat)

app.use((req, res) => res.status(404).type('txt').send('🤷‍♂️'))

const server = app.listen(PORT, function () {
  console.info('🌍 Listening on port ' + server.address().port);
});
