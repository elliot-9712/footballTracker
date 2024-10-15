// All comments made by ChatGPT
// https://chatgpt.com/share/670e42ca-a3f0-8010-8b23-4f4c55beb9ad

// Define the admin credentials
const adminName = 'admin';
// The password in plaintext is commented out for security purposes
// const adminPassword = '123'
// Store the admin's hashed password securely (bcrypt hashed value)
const adminPassword = '$2a$14$RZMnY0kVoepU8ydg/b9OKuZXXeR42u/j/vA1P/u9diGqyVFPMRFWC'

// Import necessary dependencies
const express = require('express');  // Web framework for building server-side applications
const { engine } = require('express-handlebars');  // Template engine for rendering HTML views
const sqlite3 = require('sqlite3');  // SQLite3 for database operations
const session = require('express-session');  // Session management middleware
const bodyParser = require('body-parser');  // Middleware to parse incoming request bodies
const db = require('./models/db');  // Custom module for handling database connection
const connectSqlite3 = require('connect-sqlite3');  // Middleware to store sessions in SQLite

// Initialize the SQLite session store
const SQLiteStore = connectSqlite3(session);

// Import bcryptjs for hashing passwords securely
const bcrypt = require('bcryptjs');
const saltRounds = 14;  // Set the cost factor for bcrypt (how secure the hashing is)

// Run the following code only once to generate the hashed password (for initial setup)
// The result of this hash should replace the plain adminPassword above
/*
bcrypt.hash(adminPassword, saltRounds, function(err, hash) {
    if (err) {
        console.log("---> Error encrypting the password: ", err)
    } else {
        console.log("---> Hashed password (Generate only ONCE): ", hash)
    }
});
*/

// Create an Express server instance
const app = express();

// Define the server's port
const port = 3030;

// Configure bodyParser middleware to handle URL-encoded and JSON request bodies
app.use(bodyParser.urlencoded({ extended: false }));  // Parse form data
app.use(bodyParser.json());  // Parse JSON data

// Set up Handlebars as the template engine
app.engine('handlebars', engine({
    // Define custom helpers for Handlebars templates
    helpers: {
        eq(a, b) { return a == b; }  // 'eq' helper to compare two values
    }
}));
app.set('view engine', 'handlebars');  // Use Handlebars as the view engine
app.set('views', './views');  // Specify the views directory for template files

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Configure session management using express-session and SQLite as the session store
app.use(session({
    store: new SQLiteStore({ db: "session-db.db" }),  // Use SQLite database to store session data
    saveUninitialized: false,  // Do not create sessions for unauthenticated users
    resave: false,  // Prevent resaving unchanged sessions
    secret: "This123Is@Another#456GreatSecret678%Sentence",  // Secret key for signing the session ID cookie
}));

// Global middleware for handling user sessions
app.use(function (req, res, next) {
    console.log("Session passed to response locals...");
    res.locals.session = req.session;  // Attach the session data to the response locals for use in templates
    next();  // Call the next middleware or route handler
});

// Import and execute the table creation script from the database models
require('./models/db');  // This will create tables (if not existing) when the server starts

// Route to handle user registration
app.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Ensure the admin username cannot be registered by regular users
    if (username === adminName) {
        return res.status(400).send('Cannot register as admin');
    }

    // Hash the user's password before storing it in the database for security
    const hash = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    db.serialize(() => {
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
            if (err) {
                res.status(500).send('Server Error');  // Send an error response if something goes wrong
                console.log(err);  // Log the error for debugging
            } else {
                res.redirect('/login');  // Redirect to the login page after successful registration
            }
        });
    });
});

// Route to handle user logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {  // Destroy the session
        if (err) {
            console.log("Error while destroying the session: ", err);
        } else {
            console.log('Logged out...');
            res.redirect('/');  // Redirect to the homepage after logging out
        }
    });
});

// Route to handle login
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (!username || !password) {
        const model = { error: "Username and password are required.", message: "", layout: false };
        return res.status(400).render('login.handlebars', model);  // Render the login page with an error
    }

    // Admin login flow
    if (username === adminName) {
        bcrypt.compare(password, adminPassword, (err, result) => {
            if (err) {
                const model = { error: "Error while comparing passwords: " + err, message: "", layout: false };
                return res.render('login.handlebars', model);
            }

            if (result) {
                // If password matches, set the session for the admin
                req.session.isAdmin = true;
                req.session.isLoggedIn = true;
                req.session.name = username;
                console.log("Admin logged in. Session information: " + JSON.stringify(req.session));
                return res.redirect("/");  // Redirect to the homepage after successful admin login
            } else {
                const model = { error: "Sorry, the password is incorrect", message: "", layout: false };
                return res.status(400).render('login.handlebars', model);  // Render the login page with an error
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
                return res.status(400).render('login.handlebars', model);  // User does not exist
            }

            // Compare the provided password with the hashed password from the database
            bcrypt.compare(password, row.password, (err, result) => {
                if (err) {
                    return res.status(500).send('Error while comparing passwords.');
                }

                if (result) {
                    // If the password is correct, set session for the user
                    req.session.isLoggedIn = true;
                    req.session.name = username;
                    req.session.isAdmin = false;
                    return res.redirect("/");  // Redirect to the homepage after successful login
                } else {
                    const model = { error: "Sorry, the password is incorrect", message: "", layout: false };
                    return res.status(400).render('login.handlebars', model);  // Incorrect password
                }
            });
        });
    }
});

// Middleware to pass the user session to the response locals for use in templates
app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
    }
    next();
});

// Route for the homepage
app.get('/', function (req, res) {
    const model = {
        isLoggedIn: req.session.isLoggedIn,  // Check if the user is logged in
        name: req.session.name,  // The logged-in user's name
        isAdmin: req.session.isAdmin  // Check if the user is an admin
    };
    console.log("---> Home model: " + JSON.stringify(model));  // Log the model for debugging
    res.render('home.handlebars', model);  // Render the home page with the user model
});

// Route to display all users and their associated teams
app.get('/users', (req, res) => {
    db.all(`
        SELECT 
            users.id AS user_id, 
            users.username,
            teams.name AS team_name,
            teams.image AS team_image 
        FROM 
            users 
        INNER JOIN 
            teams 
        ON 
            users.team = teams.id;
    `, [], (err, rows) => {
        if (err) {
            return res.status(500).send("An error occurred while fetching users.");
        }

        // Fetch teams for selection (dropdown)
        db.all(`SELECT id, name FROM teams ORDER BY id`, [], (err, teams) => {
            if (err) {
                return res.status(500).send("An error occurred while fetching teams.");
            }

            console.log("Fetched rows:", rows);  // Log the users for debugging
            res.render('users.handlebars', { users: rows, teams: teams });  // Render the users page
        });
    });
});

// Route to handle team change for a user
app.post('/change-team/:userId', (req, res) => {
    const userId = req.params.userId;
    const newTeamId = req.body.team;  // The selected team from the dropdown

    // Update the user's team in the database
    db.run(`UPDATE users SET team = ? WHERE id = ?`, [newTeamId, userId], function(err) {
        if (err) {
            return res.status(500).send('An error occurred while updating the team.');
        }

        // Redirect back to the users page after successful update
        res.redirect('/users');
    });
});

// Route to handle user deletion
app.post('/delete-user/:user_id', (req, res) => {
    const userId = req.params.user_id;

    // Delete the user from the database
    db.run(`DELETE FROM users WHERE id = ?`, [userId], function(err) {
        if (err) {
            return res.status(500).send('Server Error');
        }

        // Redirect back to the users page after deletion
        res.redirect('/users');
    });
});

// Route to display a user's profile
app.get('/profile/:username', (req, res) => {
    const username = req.params.username;
    console.log('Requested username:', username);

    // Fetch the user and their associated team from the database
    db.get(`
        SELECT 
            users.id AS user_id, 
            users.username,
            users.team AS team_id,
            teams.name AS team_name, 
            teams.image AS team_image 
        FROM 
            users 
        LEFT JOIN 
            teams 
        ON 
            users.team = teams.id 
        WHERE 
            users.username = ?`, [username], (err, user) => {
        
        if (err) {
            return res.status(500).send('Server Error');
        }

        // If the user does not exist, create a default admin profile if the username is 'admin'
        if (!user && username === 'admin') {
            user = {
                user_id: null,
                username: 'admin',
                team_id: null,
                team_name: null,
                team_image: null,
            };
        } else if (!user) {
            return res.status(404).send('User not found');
        }

        // Fetch all teams for the dropdown in the profile page
        db.all(`SELECT id, name FROM teams ORDER BY id`, [], (err, teams) => {
            if (err) {
                return res.status(500).send('Server Error');
            }

            const model = { user, teams };  // Create a model for the profile view
            res.render('profile.handlebars', model);  // Render the profile page
        });
    });
});

// Route to handle profile updates (e.g., changing the team)
app.post('/profile/:username/update', (req, res) => {
    const username = req.params.username;
    const newTeamId = req.body.team;  // The new team selected in the profile form

    // Update the user's team in the database
    db.run(`UPDATE users SET team = ? WHERE username = ?`, [newTeamId, username], function(err) {
        if (err) {
            return res.status(500).send('An error occurred while updating the profile.');
        }

        // Redirect back to the profile page after successful update
        res.redirect(`/profile/${username}`);
    });
});

// Route to display all teams from the database
app.get('/table', (req, res) => {
    // SQL query to retrieve all teams
    const query = "SELECT * FROM teams";

    // Execute the query and handle the result
    db.all(query, [], (err, rows) => {
        if (err) {
            // If there's an error, return a 500 status and an error message
            return res.status(500).send("Error retrieving data from database.");
        }
        // Render the 'table' template with the list of teams
        res.render('table.handlebars', { teams: rows });
    });
});

// Route to display an individual team's page by name
app.get('/teams/:name', (req, res) => {
    const teamName = req.params.name;  // Extract the team name from the URL parameter

    // SQL query to retrieve the team's data
    const teamQuery = "SELECT * FROM teams WHERE name = ?";

    // SQL query to retrieve all matches involving the team (either as home or away team)
    const matchesQuery = `
        SELECT m.*, 
               ht.name AS home_team_name, ht.image AS home_team_image, 
               at.name AS away_team_name, at.image AS away_team_image 
        FROM matches m
        JOIN teams ht ON m.home_team_id = ht.id
        JOIN teams at ON m.away_team_id = at.id
        WHERE ht.name = ? OR at.name = ?
        ORDER BY m.date`;

    // Run the team query
    db.get(teamQuery, [teamName], (err, teamRow) => {
        if (err || !teamRow) {
            // If there's an error or no team was found, return a 500 status
            return res.status(500).send("Error retrieving team data.");
        }

        // Run the matches query with the team name (both as home and away team)
        db.all(matchesQuery, [teamName, teamName], (err, matchesRows) => {
            if (err) {
                return res.status(500).send("Error retrieving matches.");
            }

            // Render the 'team' template with the team's data and its matches
            res.render('team.handlebars', { 
                team: teamRow, 
                matches: matchesRows 
            });
        });
    });
});

// Route to display the match schedule for a specific game week
app.get('/schedule', (req, res) => {
    // Query to fetch all distinct game weeks from the 'matches' table
    db.all(`SELECT DISTINCT game_week FROM matches ORDER BY game_week`, (err, gameWeeks) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal server error');
        }

        // If no game week is selected, default to the first available game week
        const selectedGameWeek = req.query.game_week || (gameWeeks.length > 0 ? gameWeeks[0].game_week : 1);

        // SQL query to fetch all matches for the selected game week
        db.all(`
        SELECT 
            m.id AS match_id, 
            m.date,
            teamOne.name AS home_team_name, 
            teamOne.image AS home_team_image, 
            teamTwo.name AS away_team_name, 
            teamTwo.image AS away_team_image, 
            m.home_team_goals, 
            m.away_team_goals 
        FROM 
            matches m
        INNER JOIN 
            teams teamOne ON m.home_team_id = teamOne.id
        INNER JOIN 
            teams teamTwo ON m.away_team_id = teamTwo.id
        WHERE 
            m.game_week = ?
        ORDER BY 
            m.date
    `, [selectedGameWeek], (err, matches) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send("An error occurred while fetching matches.");
        }

        // Log the fetched matches for debugging purposes
        console.log("Fetched matches:", matches);

        // Render the 'schedule' template with the match data for the selected game week
        res.render('schedule', {
            matches: matches,             // Pass matches for the selected game week
            selectedGameWeek: selectedGameWeek // Track the current game week for display
        });
    });
    });
});

// Route to display the 'About' page
app.get('/about', (req, res) => {
    res.render('about.handlebars');  // Render the 'about' page template
});

// Route to display the 'Contact' page
app.get('/contact', (req, res) => {
    res.render('contact.handlebars');  // Render the 'contact' page template
});

// Route to display the registration form
app.get('/register', (req, res) => {
    res.render('register.handlebars', { layout: false });  // Render the 'register' page without layout
});

// Route to display the login form
app.get('/login', (req, res) => {
    res.render('login.handlebars', { layout: false });  // Render the 'login' page without layout
});

// Route to log the user out
app.get('/logout', (req, res) => {
    // Destroy the current session to log out the user
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Could not log out');
        }
        res.redirect('/');  // Redirect to the home page after logging out
    });
});

// Start the server and listen on the specified port
app.listen(port, function () {
    console.log(`Server up and running, listening on Port ${port}`);  // Log a message when the server starts
});
