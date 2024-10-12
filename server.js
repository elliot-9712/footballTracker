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
        users.username,
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

        db.all(`SELECT id, name FROM teams ORDER BY id`, [], (err, teams) => {
            if (err) {
                return res.status(500).send("An error occurred while fetching teams.");
            }

        console.log("Fetched rows:", rows); // Log the fetched rows for debugging
        // Now rows is defined in this scope
        res.render('users.handlebars', { users: rows, teams: teams });
    });
});
})


app.post('/change-team/:userId', (req, res) => {
    const userId = req.params.userId;
    const newTeamId = req.body.team; // The selected team ID from the dropdown

    // Update the user's team in the database
    db.run(`UPDATE users SET team = ? WHERE id = ?`, [newTeamId, userId], function(err) {
        if (err) {
            return res.status(500).send('An error occurred while updating the team.');
        }

        // Redirect back to the /users page after updating the team
        res.redirect('/users');
    });
});

app.post('/delete-user/:user_id', (req, res) => {
    const userId = req.params.user_id;

    // Delete the user from the database
    db.run(`DELETE FROM users WHERE id = ?`, [userId], function(err) {
        if (err) {
            return res.status(500).send('Server Error');
        }

        // Redirect back to the users list after deleting
        res.redirect('/users');
    });
});


app.get('/profile/:username', (req, res) => {
    const username = req.params.username;
    console.log('Requested username:', username);

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
        
        // Check if user exists
        if (!user) {
            console.log('User not found in the database.'); // Log if user is not found
            
            // If the username is for an admin, create a default admin profile
            if (username === 'admin') { // Replace 'admin' with your actual admin username or condition
                user = {
                    user_id: null,
                    username: 'admin',
                    team_id: null,
                    team_name: null,
                    team_image: null,
                };
            } else {
                return res.status(404).send('User not found');
            }
        }

        // Retrieve all teams for the dropdown or any other purpose
        db.all(`SELECT id, name FROM teams ORDER BY id`, [], (err, teams) => {
            if (err) {
                return res.status(500).send('Server Error');
            }

            const model = {
                user,
                teams  // Pass all teams to the template
            };

            // Render the profile page using the model
            res.render('profile.handlebars', model);
        });
    });
});


app.post('/profile/:username/update', (req, res) => {
    const username = req.params.username;                 // Get the username from the URL
    const newTeamId = req.body.team;                      // Get the selected team ID from the form

    // Update the user's team in the database
    db.run(`UPDATE users SET team = ? WHERE username = ?`, [newTeamId, username], function(err) {
        if (err) {
            return res.status(500).send('Server Error');
        }

        // Redirect back to the user's profile after updating
        res.redirect(`/profile/${username}`);           
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


// Route for individual team pages based on the actual team name
app.get('/teams/:name', (req, res) => {
    const teamName = (req.params.name);

    const teamQuery = "SELECT * FROM teams WHERE name = ?";

    const matchesQuery = `
        SELECT m.*, 
               ht.name AS home_team_name, ht.image AS home_team_image, 
               at.name AS away_team_name, at.image AS away_team_image 
        FROM matches m
        JOIN teams ht ON m.home_team_id = ht.id
        JOIN teams at ON m.away_team_id = at.id
        WHERE ht.name = ? OR at.name = ?
        ORDER BY m.date`;

    // Run both queries in parallel
    db.get(teamQuery, [teamName], (err, teamRow) => {
        if (err || !teamRow) {
            return res.status(500).send("Error retrieving team data.");
        }

        db.all(matchesQuery, [teamName, teamName], (err, matchesRows) => {
            if (err) {
                return res.status(500).send("Error retrieving matches.");
            }

            // Render the team page with both team data and filtered matches
            res.render('team.handlebars', { 
                team: teamRow, 
                matches: matchesRows 
            });
        });
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
        SELECT 
            m.id AS match_id, 
            m.date,
            t1.name AS home_team_name, 
            t1.image AS home_team_image, 
            t2.name AS away_team_name, 
            t2.image AS away_team_image, 
            m.home_team_goals, 
            m.away_team_goals 
        FROM 
            matches m
        JOIN 
            teams t1 ON m.home_team_id = t1.id
        JOIN 
            teams t2 ON m.away_team_id = t2.id
        WHERE 
            m.game_week = ?
        ORDER BY 
            m.date
    `, [selectedGameWeek], (err, matches) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send("An error occurred while fetching matches.");
        }
    
        // Log matches for debugging
        console.log("Fetched matches:", matches);
    
        // Now render the view with the fetched matches data
        res.render('schedule', {
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
