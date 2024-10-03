const adminName = 'admin'
//const adminPassword = '123'
const adminPassword='$2a$14$RZMnY0kVoepU8ydg/b9OKuZXXeR42u/j/vA1P/u9diGqyVFPMRFWC'



const express = require('express');
const { engine } = require('express-handlebars');
const sqlite3 = require('sqlite3');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('./models/db'); // Import the database connection
const connectSqlite3 = require('connect-sqlite3');

const SQLiteStore = connectSqlite3(session)

const bcrypt = require('bcryptjs');
const saltRounds = 14

// run this code ONLY ONCE!
// bcrypt.hash(adminPassword, saltRounds, function(err, hash) {
//     if (err) {
//         console.log("---> Error encrypting the password: ", err)
//     } else {
//         console.log("---> Hashed password (Generate only ONCE): ", hash)
//     }
// })


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
    store: new SQLiteStore({db: "session-db.db"}),
    "saveUninitialized": false,
    "resave": false,
    "secret": "This123Is@Another#456GreatSecret678%Sentence",
    // cookie: {
    //     sameSite: 'strict',
    //     httpOnly: true,
    //     secure: true
    // }
}))

// Global middleware for user session
app.use(function (req, res, next) {
    console.log("Session passed to response locals...")
    res.locals.session = req.session;
    next();
})


// Call the function to create tables
require('./models/db'); // This will execute the table creation code

app.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Ensure that admin cannot be registered as a user
    if (username === adminName) {
        return res.status(400).send('Cannot register as admin');
    }

    const hash = await bcrypt.hash(password, saltRounds);

    db.serialize(() => {
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
            if (err) {
                res.status(500).send('Server Error');
                console.log(err);
            } else {
                res.redirect('/login');
            }
        });
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy( (err) => {
        if (err) {
            console.log("Error while destroying the session: ", err)
        } else {
            console.log('Logged out...')
            res.redirect('/')
        }
    })
})

// Login logic
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        const model = { error: "Username and password are required.", message: "", layout: false };
        return res.status(400).render('login.handlebars', model);
    }

    // Check if the user is the admin
    if (username === adminName) {
        // Admin login flow
        bcrypt.compare(password, adminPassword, (err, result) => {
            if (err) {
                const model = { error: "Error while comparing passwords: " + err, message: "", layout: false };
                return res.render('login.handlebars', model);
            }

            if (result) {
                // Admin authenticated successfully
                req.session.isAdmin = true;
                req.session.isLoggedIn = true;
                req.session.name = username;
                console.log("Admin logged in. Session information: " + JSON.stringify(req.session));
                return res.redirect("/"); 
            } else {
                const model = { error: "Sorry, the password is incorrect", message: "", layout: false };
                return res.status(400).render('login.handlebars', model);
            }
        });
    } else {
        // Regular user login flow
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                return res.status(500).send('Server Error');
            }
            if (!row) {
                const model = { error: "Sorry, the username does not exist.", message: "", layout: false };
                return res.status(400).render('login.handlebars', model);
            }

            bcrypt.compare(password, row.password, (err, result) => {
                if (err) {
                    return res.status(500).send('Error while comparing passwords.');
                }

                if (result) {
                    // User authenticated successfully
                    req.session.isLoggedIn = true;
                    req.session.name = username;
                    req.session.isAdmin = false;
                    return res.redirect("/");  // Redirect to the user homepage
                } else {
                    const model = { error: "Sorry, the password is incorrect", message: "", layout: false };
                    return res.status(400).render('login.handlebars', model);
                }
            });
        });
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
app.get('/', function (req, res) {
    const model={
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin
    }
    console.log("---> Home model: "+JSON.stringify(model))
    res.render('home.handlebars', model)
});

app.get('/users', (req, res) => {
    db.all(`
    SELECT 
        users.id AS user_id, 
        users.username,   -- Assuming 'name' is the column you want to display
        teams.name AS team_name,
        teams.image AS team_image 
    FROM 
        users 
    INNER JOIN 
        teams 
    ON 
        users.team = teams.id;
    `, [], (err, rows) => {  // Add the callback function here
        if (err) {
            // Handle the error and send an error response
            return res.status(500).send("An error occurred while fetching users.");
        }

        console.log("Fetched rows:", rows); // Log the fetched rows for debugging
        // Now rows is defined in this scope
        res.render('users.handlebars', { users: rows });
    });
});

app.get('/profile/:username', (req, res) => {
    const username = req.params.username;

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            return res.status(500).send('Server Error');
        }
        if (!user) {
            return res.status(404).send('User not found');
        }

        const model = { 
            user,
            title: `${user.username}'s Profile` // Pass the title to the layout
        };

        res.render('profile', model); // Renders the profile.handlebars using the main layout
    });
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