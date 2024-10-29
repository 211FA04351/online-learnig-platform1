const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/onlineLearningPlatform', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Schema for Registration/Login
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
    res.render('index'); // Render your main EJS file
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new User({ username, password });
        await newUser.save();
        res.redirect('/'); // Redirect after registration
    } catch (err) {
        res.status(500).send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.redirect('/'); // Redirect to home after successful login
        } else {
            res.status(400).send('Invalid login credentials');
        }
    } catch (err) {
        res.status(500).send('Error logging in');
    }
});

// Courses and Contact routes (You can add your database connection here if needed)
app.get('/courses', (req, res) => {
    res.send('Courses content will be here'); // Replace this with actual course data retrieval
});

app.get('/contact', (req, res) => {
    res.send('Contact form will be here'); // Replace this with actual contact functionality
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
