const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.options('*', cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const polygonsRouter = require('./routes/polygons');
app.use('/api/polygons', polygonsRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});