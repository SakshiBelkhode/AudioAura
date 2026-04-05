const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');




const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://audioaura-b.onrender.com'
  ],
  credentials: true
}));
app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);


module.exports = app;