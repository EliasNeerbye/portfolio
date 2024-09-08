const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Define a route
app.get('/', (req, res) => {
    res.render('index', { title: 'Home Page' });
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Page' });
});

app.get('/projects', (req, res) => {
    res.render('projects', { title: 'Projects Page' });
});

app.get('/view-project/gameDev', (req, res) => {
    res.render('gameDev', { title: 'Game Dev Page' });
});

// Dynamic route to serve directories under /view-project
app.get('/view-project/*', (req, res, next) => {
    // Extract the directory path from the URL
    const dirPath = req.params[0];

    // Set the full path to the directory
    const fullPath = path.join(__dirname, 'public', 'view-project', dirPath);

    // Serve the directory statically, allowing access to all its files
    express.static(fullPath)(req, res, next);
});


// 404 Error handler
app.use((req, res, next) => {
    res.status(404).render('404', { url: req.url });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});