const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Change to your frontend origin
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend API running');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
