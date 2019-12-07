const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('dist'));

app.listen(3000, () => console.log('Listening on port 3000'));