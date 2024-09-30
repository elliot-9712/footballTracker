const adminName = 'admin'
const adminPassword = '123'

//$2a$14$r6ZPpA9w5mKeQdcEP0lC4.DNPG/uYw8T2a6Igwpi0Dknx.fBvUIiq


const express = require('express');
const { engine } = require('express-handlebars');
const sqlite3 = require('sqlite3');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('./models/db'); // Import the database connection
const bcrypt = require('bcryptjs');

// Create the server app
const app = express();

// Define the port 
const port = 3030;

// Configure body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// HANDLEBARS
app.engine('handlebars', engine({
    helpers: {
        eq(a, b) { return a == b; }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');


// Define the directory public as a static directory
app.use(express.static('public'));

// Configure express-session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Global middleware for user session
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Call the function to create tables
require('./models/db'); // This will execute the table creation code

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 14);

    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
        if (err) {
            res.status(500).send('Server Error');
        } else {
            res.redirect('/login');
        }
    });
});

// Login logic
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        model={ error: "Username and password are required.", message: ""}
        return res.status(400).render('login.handlebars', model)
    }
    if (username==adminName) {
        console.log('The username is the admin one!')
        if (password==adminPassword) {
            const model={ error: "", message: "You are the admin. Welcome home!" }
            res.render('login.handlebars', model)
        } else {
            res.send(`<div>Sorry, the password is not correct...<br />
            Please, try again: <a href="login">Login</a></div>`)
        }
    } else {
        res.send(`<div>Sorry, the username ${username} is not correct... <br />
            Please, try again: <a href="/login">Login</a><div>`)
    }
});
        
    // db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    //     if (err) {
    //         res.status(500).send('Server error');
    //     } else if (!user) {
    //         res.status(401).send('User not found');
    //     } else {
    //         const result = await bcrypt.compare(password, user.password);
    //         if (result) {
    //             req.session.user = user; // Store the user in the session
    //             res.redirect('/home'); // Redirect to the home page
    //         } else {
    //             res.status(401).send('Wrong password');
    //         }
    //     }
    // });

app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
    }
    next();
})

// Define routes
app.get('/', (req, res) => {
    res.render('login.handlebars', { layout: false });
});

app.get('/home', (req, res) => {
    res.render('home.handlebars', { user: req.session.user });
});

app.get('/table', (req, res) => {
    // Query the teams table
    const query = "SELECT * FROM teams";

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).send("Error retrieving data from database.");
        }
        // Pass the rows (teams data) to Handlebars template
        res.render('table.handlebars', { teams: rows });
    });
});

app.get('/schedule', (req, res) => {
    // Fetch all available game weeks to populate the dropdown
    db.all(`SELECT DISTINCT game_week FROM matches ORDER BY game_week`, (err, gameWeeks) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal server error');
        }

        // Get the selected game week from query parameter or default to the first available game week
        const selectedGameWeek = req.query.game_week || (gameWeeks.length > 0 ? gameWeeks[0].game_week : 1);

        // Fetch matches for the selected game week
        db.all(`
            SELECT m.*, 
                   t1.name AS home_team_name, 
                   t2.name AS away_team_name 
            FROM matches m
            JOIN teams t1 ON m.home_team_id = t1.id
            JOIN teams t2 ON m.away_team_id = t2.id
            WHERE m.game_week = ?
            ORDER BY m.date
        `, [selectedGameWeek], (err, matches) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Internal server error');
            }

            // Render the calendar view with game week options and matches
            res.render('schedule', {
                gameWeeks: gameWeeks,         // List of game weeks for dropdown
                matches: matches,             // Matches for the selected game week
                selectedGameWeek: selectedGameWeek // Track the current game week
            });
        });
    });
});



app.get('/about', (req, res) => {
    res.render('about.handlebars');
});

app.get('/contact', (req, res) => {
    res.render('contact.handlebars');
});

app.get('/register', (req, res) => {
    res.render('register.handlebars', { layout: false });
});

app.get('/login', (req, res) => {
    res.render('login.handlebars', { layout: false });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Could not log out');
        }
        res.redirect('/');
    });
});

// Listen to the port
app.listen(port, function () {
    console.log(`Server up and running, listening on Port ${port}`);
});
