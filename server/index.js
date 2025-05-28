const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;

const newsRoutes = require('./routes/news');
const authRoutes = require('./routes/auth');
const playerOfMonthRoutes = require('./routes/playerOfMonth');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/cyber-esports', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

app.use('/api/news', newsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/player-of-month', playerOfMonthRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
