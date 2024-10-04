const sqlite3 = require('sqlite3');
const dbFile = 'database.db';
const db = new sqlite3.Database(dbFile);

// Team data array
const teams = [
    { name: 'Manchester City', image: '/images/Manchester_City_FC.png', games: 38, wins: 28, draws: 7, losses: 3, goals_scored: 96, goals_conceded: 34, goal_difference: 62, points: 91 },
    { name: 'Arsenal', image: '/images/arsenal.png', games: 38, wins: 28, draws: 5, losses: 5, goals_scored: 91, goals_conceded: 29, goal_difference: 62, points: 89 },
    { name: 'Liverpool', image: '/images/liverpool.png', games: 38, wins: 24, draws: 10, losses: 4, goals_scored: 86, goals_conceded: 41, goal_difference: 45, points: 82 },
    { name: 'Aston Villa', image: '/images/aston-villa.png', games: 38, wins: 20, draws: 8, losses: 10, goals_scored: 76, goals_conceded: 61, goal_difference: 15, points: 68 },
    { name: 'Tottenham', image: '/images/tottenham.png', games: 38, wins: 20, draws: 6, losses: 12, goals_scored: 74, goals_conceded: 61, goal_difference: 13, points: 66 },
    { name: 'Chelsea', image: '/images/chelsea.png', games: 38, wins: 18, draws: 9, losses: 11, goals_scored: 77, goals_conceded: 63, goal_difference: 14, points: 63 },
    { name: 'Newcastle', image: '/images/newcastle.png', games: 38, wins: 18, draws: 6, losses: 14, goals_scored: 85, goals_conceded: 62, goal_difference: 23, points: 60 },
    { name: 'Manchester United', image: '/images/manchester-united.png', games: 38, wins: 18, draws: 6, losses: 14, goals_scored: 57, goals_conceded: 58, goal_difference: -1, points: 60 },
    { name: 'West Ham', image: '/images/west-ham.png', games: 38, wins: 14, draws: 10, losses: 14, goals_scored: 60, goals_conceded: 74, goal_difference: -14, points: 52 },
    { name: 'Crystal Palace', image: '/images/crystal-palace.png', games: 38, wins: 13, draws: 10, losses: 15, goals_scored: 57, goals_conceded: 58, goal_difference: -1, points: 49 },
    { name: 'Brighton', image: '/images/brighton.png', games: 38, wins: 12, draws: 12, losses: 14, goals_scored: 55, goals_conceded: 62, goal_difference: -7, points: 48 },
    { name: 'Bournemouth', image: '/images/bournemouth.png', games: 38, wins: 13, draws: 9, losses: 16, goals_scored: 54, goals_conceded: 67, goal_difference: -13, points: 48 },
    { name: 'Fulham', image: '/images/fulham.png', games: 38, wins: 13, draws: 8, losses: 17, goals_scored: 55, goals_conceded: 61, goal_difference: -6, points: 47 },
    { name: 'Wolves', image: '/images/wolves.png', games: 38, wins: 13, draws: 7, losses: 18, goals_scored: 50, goals_conceded: 65, goal_difference: -15, points: 46 },
    { name: 'Everton', image: '/images/everton.png', games: 38, wins: 13, draws: 9, losses: 16, goals_scored: 40, goals_conceded: 51, goal_difference: -11, points: 40 },
    { name: 'Brentford', image: '/images/Brentford_FC.png', games: 38, wins: 10, draws: 9, losses: 19, goals_scored: 56, goals_conceded: 65, goal_difference: -9, points: 39 },
    { name: 'Nottingham Forest', image: '/images/nottingham.png', games: 38, wins: 9, draws: 9, losses: 20, goals_scored: 49, goals_conceded: 67, goal_difference: -18, points: 32 },
    { name: 'Luton', image: '/images/luton-town.png', games: 38, wins: 6, draws: 8, losses: 24, goals_scored: 52, goals_conceded: 85, goal_difference: -33, points: 26 },
    { name: 'Burnley', image: '/images/burnley.png', games: 38, wins: 5, draws: 9, losses: 24, goals_scored: 41, goals_conceded: 78, goal_difference: -37, points: 24 },
    { name: 'Sheffield United', image: '/images/sheffield-united.png', games: 38, wins: 3, draws: 7, losses: 28, goals_scored: 35, goals_conceded: 104, goal_difference: -69, points: 16 },
  ];
  
// Matches data array
const matches = [
// Game Week 1
{ game_week: 1, date: '2023-08-11', home_team_id: 19, away_team_id: 1, home_team_goals: 0, away_team_goals: 3 },
{ game_week: 1, date: '2023-08-12', home_team_id: 2, away_team_id: 17, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 1, date: '2023-08-12', home_team_id: 11, away_team_id: 18, home_team_goals: 4, away_team_goals: 1 },
{ game_week: 1, date: '2023-08-12', home_team_id: 15, away_team_id: 13, home_team_goals: 0, away_team_goals: 1 },
{ game_week: 1, date: '2023-08-12', home_team_id: 20, away_team_id: 10, home_team_goals: 0, away_team_goals: 1 },
{ game_week: 1, date: '2023-08-12', home_team_id: 12, away_team_id: 9, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 1, date: '2023-08-12', home_team_id: 7, away_team_id: 4, home_team_goals: 5, away_team_goals: 1 },
{ game_week: 1, date: '2023-08-13', home_team_id: 16, away_team_id: 5, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 1, date: '2023-08-13', home_team_id: 6, away_team_id: 3, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 1, date: '2023-08-14', home_team_id: 8, away_team_id: 14, home_team_goals: 1, away_team_goals: 0 },

// Game Week 2
{ game_week: 2, date: '2023-08-18', home_team_id: 17, away_team_id: 20, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 2, date: '2023-08-19', home_team_id: 13, away_team_id: 16, home_team_goals: 0, away_team_goals: 3 },
{ game_week: 2, date: '2023-08-19', home_team_id: 14, away_team_id: 11, home_team_goals: 1, away_team_goals: 4 },
{ game_week: 2, date: '2023-08-19', home_team_id: 3, away_team_id: 12, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 2, date: '2023-08-19', home_team_id: 5, away_team_id: 8, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 2, date: '2023-08-19', home_team_id: 1, away_team_id: 7, home_team_goals: 1, away_team_goals: 0 },
{ game_week: 2, date: '2023-08-20', home_team_id: 4, away_team_id: 15, home_team_goals: 4, away_team_goals: 0 },
{ game_week: 2, date: '2023-08-20', home_team_id: 9, away_team_id: 6, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 2, date: '2023-08-21', home_team_id: 10, away_team_id: 2, home_team_goals: 0, away_team_goals: 1 },
{ game_week: 2, date: '2023-10-03', home_team_id: 18, away_team_id: 19, home_team_goals: 1, away_team_goals: 2 },

// Game Week 3
{ game_week: 3, date: '2023-08-25', home_team_id: 6, away_team_id: 18, home_team_goals: 3, away_team_goals: 0 },
{ game_week: 3, date: '2023-08-26', home_team_id: 12, away_team_id: 5, home_team_goals: 0, away_team_goals: 2 },
{ game_week: 3, date: '2023-08-26', home_team_id: 15, away_team_id: 14, home_team_goals: 0, away_team_goals: 1 },
{ game_week: 3, date: '2023-08-26', home_team_id: 8, away_team_id: 17, home_team_goals: 3, away_team_goals: 2 },
{ game_week: 3, date: '2023-08-26', home_team_id: 2, away_team_id: 13, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 3, date: '2023-08-26', home_team_id: 16, away_team_id: 10, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 3, date: '2023-08-26', home_team_id: 11, away_team_id: 9, home_team_goals: 1, away_team_goals: 3 },
{ game_week: 3, date: '2023-08-27', home_team_id: 19, away_team_id: 4, home_team_goals: 1, away_team_goals: 3 },
{ game_week: 3, date: '2023-08-27', home_team_id: 20, away_team_id: 1, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 3, date: '2023-08-27', home_team_id: 7, away_team_id: 3, home_team_goals: 1, away_team_goals: 2 },

// Game Week 4
{ game_week: 4, date: '2023-09-01', home_team_id: 18, away_team_id: 9, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 4, date: '2023-09-02', home_team_id: 20, away_team_id: 15, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 4, date: '2023-09-02', home_team_id: 1, away_team_id: 13, home_team_goals: 5, away_team_goals: 1 },
{ game_week: 4, date: '2023-09-02', home_team_id: 19, away_team_id: 5, home_team_goals: 2, away_team_goals: 5 },
{ game_week: 4, date: '2023-09-02', home_team_id: 6, away_team_id: 17, home_team_goals: 0, away_team_goals: 1 },
{ game_week: 4, date: '2023-09-02', home_team_id: 16, away_team_id: 12, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 4, date: '2023-09-02', home_team_id: 11, away_team_id: 7, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 4, date: '2023-09-03', home_team_id: 10, away_team_id: 14, home_team_goals: 3, away_team_goals: 2 },
{ game_week: 4, date: '2023-09-03', home_team_id: 3, away_team_id: 4, home_team_goals: 3, away_team_goals: 0 },
{ game_week: 4, date: '2023-09-03', home_team_id: 2, away_team_id: 8, home_team_goals: 3, away_team_goals: 1 },

// Game Week 5
{ game_week: 5, date: '2023-09-16', home_team_id: 14, away_team_id: 3, home_team_goals: 1, away_team_goals: 3 },
{ game_week: 5, date: '2023-09-16', home_team_id: 5, away_team_id: 20, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 5, date: '2023-09-16', home_team_id: 17, away_team_id: 10, home_team_goals: 1, away_team_goals: 0 },
{ game_week: 5, date: '2023-09-16', home_team_id: 7, away_team_id: 2, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 5, date: '2023-09-16', home_team_id: 12, away_team_id: 19, home_team_goals: 0, away_team_goals: 1 },
{ game_week: 5, date: '2023-09-17', home_team_id: 8, away_team_id: 16, home_team_goals: 1, away_team_goals: 3 },
{ game_week: 5, date: '2023-09-17', home_team_id: 13, away_team_id: 6, home_team_goals: 0, away_team_goals: 2 },
{ game_week: 5, date: '2023-09-17', home_team_id: 9, away_team_id: 11, home_team_goals: 1, away_team_goals: 3 },
{ game_week: 5, date: '2023-09-17', home_team_id: 4, away_team_id: 1, home_team_goals: 1, away_team_goals: 3 },
{ game_week: 5, date: '2023-09-18', home_team_id: 15, away_team_id: 18, home_team_goals: 1, away_team_goals: 3 },

// Game Week 6
{ game_week: 6, date: '2023-09-23', home_team_id: 18, away_team_id: 14, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 6, date: '2023-09-23', home_team_id: 1, away_team_id: 17, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 6, date: '2023-09-23', home_team_id: 10, away_team_id: 13, home_team_goals: 0, away_team_goals: 0 },
{ game_week: 6, date: '2023-09-23', home_team_id: 16, away_team_id: 15, home_team_goals: 1, away_team_goals: 3 },
{ game_week: 6, date: '2023-09-23', home_team_id: 19, away_team_id: 8, home_team_goals: 0, away_team_goals: 1 },
{ game_week: 6, date: '2023-09-24', home_team_id: 3, away_team_id: 9, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 6, date: '2023-09-24', home_team_id: 2, away_team_id: 5, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 6, date: '2023-09-24', home_team_id: 6, away_team_id: 4, home_team_goals: 0, away_team_goals: 1 },
{ game_week: 6, date: '2023-09-24', home_team_id: 11, away_team_id: 12, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 6, date: '2023-09-24', home_team_id: 20, away_team_id: 7, home_team_goals: 0, away_team_goals: 8 },

// Game Week 7
{ game_week: 7, date: '2023-09-30', home_team_id: 4, away_team_id: 11, home_team_goals: 6, away_team_goals: 1 },
{ game_week: 7, date: '2023-09-30', home_team_id: 12, away_team_id: 2, home_team_goals: 0, away_team_goals: 4 },
{ game_week: 7, date: '2023-09-30', home_team_id: 8, away_team_id: 10, home_team_goals: 0, away_team_goals: 1 },
{ game_week: 7, date: '2023-09-30', home_team_id: 9, away_team_id: 20, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 7, date: '2023-09-30', home_team_id: 15, away_team_id: 18, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 7, date: '2023-09-30', home_team_id: 14, away_team_id: 1, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 7, date: '2023-09-30', home_team_id: 7, away_team_id: 19, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 7, date: '2023-09-30', home_team_id: 5, away_team_id: 3, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 7, date: '2023-10-01', home_team_id: 17, away_team_id: 16, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 7, date: '2023-10-02', home_team_id: 13, away_team_id: 6, home_team_goals: 0, away_team_goals: 2 },

// Game Week 8
{ game_week: 8, date: '2023-10-07', home_team_id: 18, away_team_id: 5, home_team_goals: 0, away_team_goals: 1 },
{ game_week: 8, date: '2023-10-07', home_team_id: 13, away_team_id: 20, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 8, date: '2023-10-07', home_team_id: 19, away_team_id: 6, home_team_goals: 1, away_team_goals: 4 },
{ game_week: 8, date: '2023-10-07', home_team_id: 8, away_team_id: 16, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 8, date: '2023-10-07', home_team_id: 15, away_team_id: 12, home_team_goals: 3, away_team_goals: 0 },
{ game_week: 8, date: '2023-10-07', home_team_id: 10, away_team_id: 17, home_team_goals: 0, away_team_goals: 0 },
{ game_week: 8, date: '2023-10-08', home_team_id: 14, away_team_id: 4, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 8, date: '2023-10-08', home_team_id: 11, away_team_id: 3, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 8, date: '2023-10-08', home_team_id: 9, away_team_id: 7, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 8, date: '2023-10-08', home_team_id: 2, away_team_id: 1, home_team_goals: 1, away_team_goals: 0 },

// Game Week 9
{ game_week: 9, date: '2023-10-21', home_team_id: 3, away_team_id: 15, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 9, date: '2023-10-21', home_team_id: 7, away_team_id: 10, home_team_goals: 4, away_team_goals: 0 },
{ game_week: 9, date: '2023-10-21', home_team_id: 12, away_team_id: 14, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 9, date: '2023-10-21', home_team_id: 17, away_team_id: 18, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 9, date: '2023-10-21', home_team_id: 1, away_team_id: 11, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 9, date: '2023-10-21', home_team_id: 16, away_team_id: 19, home_team_goals: 3, away_team_goals: 0 },
{ game_week: 9, date: '2023-10-21', home_team_id: 6, away_team_id: 2, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 9, date: '2023-10-21', home_team_id: 20, away_team_id: 8, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 9, date: '2023-10-22', home_team_id: 4, away_team_id: 9, home_team_goals: 4, away_team_goals: 1 },
{ game_week: 9, date: '2023-10-23', home_team_id: 5, away_team_id: 13, home_team_goals: 2, away_team_goals: 0 },

// Game Week 10
{ game_week: 10, date: '2023-10-27', home_team_id: 10, away_team_id: 5, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 10, date: '2023-10-28', home_team_id: 6, away_team_id: 16, home_team_goals: 0, away_team_goals: 2 },
{ game_week: 10, date: '2023-10-28', home_team_id: 12, away_team_id: 19, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 10, date: '2023-10-28', home_team_id: 2, away_team_id: 20, home_team_goals: 5, away_team_goals: 0 },
{ game_week: 10, date: '2023-10-28', home_team_id: 14, away_team_id: 7, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 10, date: '2023-10-29', home_team_id: 9, away_team_id: 15, home_team_goals: 0, away_team_goals: 1 },
{ game_week: 10, date: '2023-10-29', home_team_id: 3, away_team_id: 17, home_team_goals: 3, away_team_goals: 0 },
{ game_week: 10, date: '2023-10-29', home_team_id: 11, away_team_id: 13, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 10, date: '2023-10-29', home_team_id: 4, away_team_id: 18, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 10, date: '2023-10-29', home_team_id: 8, away_team_id: 1, home_team_goals: 0, away_team_goals: 3 },

// Game Week 11
{ game_week: 11, date: '2023-11-04', home_team_id: 13, away_team_id: 8, home_team_goals: 0, away_team_goals: 1 },
{ game_week: 11, date: '2023-11-04', home_team_id: 19, away_team_id: 10, home_team_goals: 0, away_team_goals: 2 },
{ game_week: 11, date: '2023-11-04', home_team_id: 20, away_team_id: 14, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 11, date: '2023-11-04', home_team_id: 1, away_team_id: 12, home_team_goals: 6, away_team_goals: 1 },
{ game_week: 11, date: '2023-11-04', home_team_id: 15, away_team_id: 11, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 11, date: '2023-11-04', home_team_id: 16, away_team_id: 9, home_team_goals: 3, away_team_goals: 2 },
{ game_week: 11, date: '2023-11-04', home_team_id: 7, away_team_id: 2, home_team_goals: 1, away_team_goals: 0 },
{ game_week: 11, date: '2023-11-05', home_team_id: 17, away_team_id: 4, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 11, date: '2023-11-05', home_team_id: 18, away_team_id: 3, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 11, date: '2023-11-06', home_team_id: 5, away_team_id: 6, home_team_goals: 1, away_team_goals: 4 },

// Game Week 12
{ game_week: 12, date: '2023-11-11', home_team_id: 14, away_team_id: 5, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 12, date: '2023-11-11', home_team_id: 8, away_team_id: 18, home_team_goals: 1, away_team_goals: 0 },
{ game_week: 12, date: '2023-11-11', home_team_id: 2, away_team_id: 19, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 12, date: '2023-11-11', home_team_id: 10, away_team_id: 15, home_team_goals: 2, away_team_goals: 3 },
{ game_week: 12, date: '2023-11-11', home_team_id: 12, away_team_id: 7, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 12, date: '2023-11-12', home_team_id: 3, away_team_id: 16, home_team_goals: 3, away_team_goals: 0 },
{ game_week: 12, date: '2023-11-12', home_team_id: 11, away_team_id: 20, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 12, date: '2023-11-12', home_team_id: 9, away_team_id: 17, home_team_goals: 3, away_team_goals: 2 },
{ game_week: 12, date: '2023-11-12', home_team_id: 4, away_team_id: 13, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 12, date: '2023-11-12', home_team_id: 6, away_team_id: 1, home_team_goals: 4, away_team_goals: 4 },

// Game Week 13
{ game_week: 13, date: '2023-11-25', home_team_id: 1, away_team_id: 3, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 13, date: '2023-11-25', home_team_id: 7, away_team_id: 6, home_team_goals: 4, away_team_goals: 1 },
{ game_week: 13, date: '2023-11-25', home_team_id: 17, away_team_id: 11, home_team_goals: 2, away_team_goals: 3 },
{ game_week: 13, date: '2023-11-25', home_team_id: 18, away_team_id: 10, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 13, date: '2023-11-25', home_team_id: 19, away_team_id: 9, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 13, date: '2023-11-25', home_team_id: 20, away_team_id: 12, home_team_goals: 1, away_team_goals: 3 },
{ game_week: 13, date: '2023-11-25', home_team_id: 16, away_team_id: 2, home_team_goals: 0, away_team_goals: 1 },
{ game_week: 13, date: '2023-11-26', home_team_id: 5, away_team_id: 4, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 13, date: '2023-11-26', home_team_id: 15, away_team_id: 8, home_team_goals: 0, away_team_goals: 3 },
{ game_week: 13, date: '2023-11-27', home_team_id: 13, away_team_id: 14, home_team_goals: 3, away_team_goals: 2 },

// Game Week 14
{ game_week: 14, date: '2023-12-02', home_team_id: 19, away_team_id: 20, home_team_goals: 5, away_team_goals: 0 },
{ game_week: 14, date: '2023-12-02', home_team_id: 2, away_team_id: 14, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 14, date: '2023-12-02', home_team_id: 16, away_team_id: 18, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 14, date: '2023-12-02', home_team_id: 17, away_team_id: 15, home_team_goals: 0, away_team_goals: 1 },
{ game_week: 14, date: '2023-12-02', home_team_id: 7, away_team_id: 8, home_team_goals: 1, away_team_goals: 0 },
{ game_week: 14, date: '2023-12-03', home_team_id: 12, away_team_id: 4, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 14, date: '2023-12-03', home_team_id: 6, away_team_id: 11, home_team_goals: 3, away_team_goals: 2 },
{ game_week: 14, date: '2023-12-03', home_team_id: 3, away_team_id: 13, home_team_goals: 4, away_team_goals: 3 },
{ game_week: 14, date: '2023-12-03', home_team_id: 9, away_team_id: 10, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 14, date: '2023-12-03', home_team_id: 1, away_team_id: 5, home_team_goals: 3, away_team_goals: 3 },

// Game Week 15
{ game_week: 15, date: '2023-12-05', home_team_id: 14, away_team_id: 19, home_team_goals: 1, away_team_goals: 0 },
{ game_week: 15, date: '2023-12-05', home_team_id: 18, away_team_id: 2, home_team_goals: 3, away_team_goals: 4 },
{ game_week: 15, date: '2023-12-06', home_team_id: 13, away_team_id: 17, home_team_goals: 5, away_team_goals: 0 },
{ game_week: 15, date: '2023-12-06', home_team_id: 11, away_team_id: 16, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 15, date: '2023-12-06', home_team_id: 10, away_team_id: 12, home_team_goals: 0, away_team_goals: 2 },
{ game_week: 15, date: '2023-12-06', home_team_id: 20, away_team_id: 3, home_team_goals: 0, away_team_goals: 2 },
{ game_week: 15, date: '2023-12-06', home_team_id: 4, away_team_id: 1, home_team_goals: 1, away_team_goals: 0 },
{ game_week: 15, date: '2023-12-06', home_team_id: 8, away_team_id: 6, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 15, date: '2023-12-07', home_team_id: 15, away_team_id: 7, home_team_goals: 3, away_team_goals: 0 },
{ game_week: 15, date: '2023-12-07', home_team_id: 5, away_team_id: 9, home_team_goals: 1, away_team_goals: 2 },

// Game Week 16
{ game_week: 16, date: '2023-12-09', home_team_id: 10, away_team_id: 3, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 16, date: '2023-12-09', home_team_id: 20, away_team_id: 16, home_team_goals: 1, away_team_goals: 0 },
{ game_week: 16, date: '2023-12-09', home_team_id: 11, away_team_id: 19, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 16, date: '2023-12-09', home_team_id: 14, away_team_id: 17, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 16, date: '2023-12-09', home_team_id: 8, away_team_id: 12, home_team_goals: 0, away_team_goals: 3 },
{ game_week: 16, date: '2023-12-09', home_team_id: 4, away_team_id: 2, home_team_goals: 1, away_team_goals: 0 },
{ game_week: 16, date: '2023-12-10', home_team_id: 13, away_team_id: 9, home_team_goals: 5, away_team_goals: 0 },
{ game_week: 16, date: '2023-12-10', home_team_id: 18, away_team_id: 1, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 16, date: '2023-12-10', home_team_id: 15, away_team_id: 6, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 16, date: '2023-12-10', home_team_id: 5, away_team_id: 7, home_team_goals: 4, away_team_goals: 1 },

// Game Week 17
{ game_week: 17, date: '2023-12-15', home_team_id: 17, away_team_id: 5, home_team_goals: 0, away_team_goals: 2 },
{ game_week: 17, date: '2023-12-16', home_team_id: 1, away_team_id: 10, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 17, date: '2023-12-16', home_team_id: 7, away_team_id: 13, home_team_goals: 3, away_team_goals: 0 },
{ game_week: 17, date: '2023-12-16', home_team_id: 6, away_team_id: 20, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 17, date: '2023-12-16', home_team_id: 19, away_team_id: 15, home_team_goals: 0, away_team_goals: 2 },
{ game_week: 17, date: '2023-12-17', home_team_id: 2, away_team_id: 11, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 17, date: '2023-12-17', home_team_id: 16, away_team_id: 4, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 17, date: '2023-12-17', home_team_id: 9, away_team_id: 14, home_team_goals: 3, away_team_goals: 0 },
{ game_week: 17, date: '2023-12-17', home_team_id: 3, away_team_id: 8, home_team_goals: 0, away_team_goals: 0 },
{ game_week: 17, date: '2024-03-13', home_team_id: 12, away_team_id: 18, home_team_goals: 4, away_team_goals: 3 },

// Game Week 18
{ game_week: 18, date: '2023-12-21', home_team_id: 10, away_team_id: 11, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 18, date: '2023-12-22', home_team_id: 4, away_team_id: 20, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 18, date: '2023-12-23', home_team_id: 9, away_team_id: 8, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 18, date: '2023-12-23', home_team_id: 13, away_team_id: 19, home_team_goals: 0, away_team_goals: 2 },
{ game_week: 18, date: '2023-12-23', home_team_id: 17, away_team_id: 12, home_team_goals: 2, away_team_goals: 3 },
{ game_week: 18, date: '2023-12-23', home_team_id: 5, away_team_id: 15, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 18, date: '2023-12-23', home_team_id: 18, away_team_id: 7, home_team_goals: 1, away_team_goals: 0 },
{ game_week: 18, date: '2023-12-23', home_team_id: 3, away_team_id: 2, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 18, date: '2023-12-24', home_team_id: 14, away_team_id: 6, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 18, date: '2023-12-24', home_team_id: 1, away_team_id: 16, home_team_goals: 1, away_team_goals: 0 },

// Game Week 19
{ game_week: 19, date: '2023-12-26', home_team_id: 7, away_team_id: 17, home_team_goals: 1, away_team_goals: 3 },
{ game_week: 19, date: '2023-12-26', home_team_id: 20, away_team_id: 18, home_team_goals: 2, away_team_goals: 3 },
{ game_week: 19, date: '2023-12-26', home_team_id: 12, away_team_id: 13, home_team_goals: 3, away_team_goals: 0 },
{ game_week: 19, date: '2023-12-26', home_team_id: 19, away_team_id: 3, home_team_goals: 0, away_team_goals: 2 },
{ game_week: 19, date: '2023-12-26', home_team_id: 8, away_team_id: 4, home_team_goals: 3, away_team_goals: 2 },
{ game_week: 19, date: '2023-12-27', home_team_id: 6, away_team_id: 10, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 19, date: '2023-12-27', home_team_id: 16, away_team_id: 14, home_team_goals: 1, away_team_goals: 4 },
{ game_week: 19, date: '2023-12-27', home_team_id: 15, away_team_id: 1, home_team_goals: 1, away_team_goals: 3 },
{ game_week: 19, date: '2023-12-28', home_team_id: 11, away_team_id: 5, home_team_goals: 4, away_team_goals: 2 },
{ game_week: 19, date: '2023-12-28', home_team_id: 2, away_team_id: 9, home_team_goals: 0, away_team_goals: 2 },

// Game Week 20
{ game_week: 20, date: '2023-12-30', home_team_id: 18, away_team_id: 6, home_team_goals: 2, away_team_goals: 3 },
{ game_week: 20, date: '2023-12-30', home_team_id: 4, away_team_id: 19, home_team_goals: 3, away_team_goals: 2 },
{ game_week: 20, date: '2023-12-30', home_team_id: 10, away_team_id: 16, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 20, date: '2023-12-30', home_team_id: 1, away_team_id: 20, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 20, date: '2023-12-30', home_team_id: 14, away_team_id: 15, home_team_goals: 3, away_team_goals: 0 },
{ game_week: 20, date: '2023-12-30', home_team_id: 17, away_team_id: 8, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 20, date: '2023-12-31', home_team_id: 5, away_team_id: 12, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 20, date: '2023-12-31', home_team_id: 13, away_team_id: 2, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 20, date: '2024-01-01', home_team_id: 3, away_team_id: 7, home_team_goals: 4, away_team_goals: 2 },
{ game_week: 20, date: '2024-01-02', home_team_id: 9, away_team_id: 11, home_team_goals: 0, away_team_goals: 0 },

// Game Week 21
{ game_week: 21, date: '2024-01-12', home_team_id: 19, away_team_id: 18, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 21, date: '2024-01-13', home_team_id: 6, away_team_id: 13, home_team_goals: 1, away_team_goals: 0 },
{ game_week: 21, date: '2024-01-13', home_team_id: 7, away_team_id: 1, home_team_goals: 2, away_team_goals: 3 },
{ game_week: 21, date: '2024-01-14', home_team_id: 15, away_team_id: 4, home_team_goals: 0, away_team_goals: 0 },
{ game_week: 21, date: '2024-01-14', home_team_id: 8, away_team_id: 5, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 21, date: '2024-01-20', home_team_id: 2, away_team_id: 10, home_team_goals: 5, away_team_goals: 0 },
{ game_week: 21, date: '2024-01-20', home_team_id: 16, away_team_id: 17, home_team_goals: 3, away_team_goals: 2 },
{ game_week: 21, date: '2024-01-21', home_team_id: 20, away_team_id: 9, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 21, date: '2024-01-21', home_team_id: 12, away_team_id: 3, home_team_goals: 0, away_team_goals: 4 },
{ game_week: 21, date: '2024-01-22', home_team_id: 11, away_team_id: 14, home_team_goals: 0, away_team_goals: 0 },

// Game Week 22
{ game_week: 22, date: '2024-01-30', home_team_id: 17, away_team_id: 2, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 22, date: '2024-01-30', home_team_id: 18, away_team_id: 11, home_team_goals: 4, away_team_goals: 0 },
{ game_week: 22, date: '2024-01-30', home_team_id: 13, away_team_id: 15, home_team_goals: 0, away_team_goals: 0 },
{ game_week: 22, date: '2024-01-30', home_team_id: 10, away_team_id: 20, home_team_goals: 3, away_team_goals: 2 },
{ game_week: 22, date: '2024-01-30', home_team_id: 4, away_team_id: 7, home_team_goals: 1, away_team_goals: 3 },
{ game_week: 22, date: '2024-01-31', home_team_id: 1, away_team_id: 19, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 22, date: '2024-01-31', home_team_id: 5, away_team_id: 16, home_team_goals: 3, away_team_goals: 2 },
{ game_week: 22, date: '2024-01-31', home_team_id: 3, away_team_id: 6, home_team_goals: 4, away_team_goals: 1 },
{ game_week: 22, date: '2024-02-01', home_team_id: 9, away_team_id: 12, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 22, date: '2024-02-01', home_team_id: 14, away_team_id: 8, home_team_goals: 3, away_team_goals: 4 },

// Game Week 23
{ game_week: 23, date: '2024-02-03', home_team_id: 15, away_team_id: 5, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 23, date: '2024-02-03', home_team_id: 19, away_team_id: 13, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 23, date: '2024-02-03', home_team_id: 7, away_team_id: 18, home_team_goals: 4, away_team_goals: 4 },
{ game_week: 23, date: '2024-02-03', home_team_id: 11, away_team_id: 10, home_team_goals: 4, away_team_goals: 1 },
{ game_week: 23, date: '2024-02-03', home_team_id: 20, away_team_id: 4, home_team_goals: 0, away_team_goals: 5 },
{ game_week: 23, date: '2024-02-04', home_team_id: 8, away_team_id: 9, home_team_goals: 3, away_team_goals: 0 },
{ game_week: 23, date: '2024-02-04', home_team_id: 6, away_team_id: 14, home_team_goals: 2, away_team_goals: 4 },
{ game_week: 23, date: '2024-02-04', home_team_id: 12, away_team_id: 17, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 23, date: '2024-02-04', home_team_id: 2, away_team_id: 3, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 23, date: '2024-02-05', home_team_id: 16, away_team_id: 1, home_team_goals: 1, away_team_goals: 3 },

// Game Week 24
{ game_week: 24, date: '2024-02-10', home_team_id: 1, away_team_id: 15, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 24, date: '2024-02-10', home_team_id: 5, away_team_id: 11, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 24, date: '2024-02-10', home_team_id: 18, away_team_id: 20, home_team_goals: 1, away_team_goals: 3 },
{ game_week: 24, date: '2024-02-10', home_team_id: 13, away_team_id: 12, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 24, date: '2024-02-10', home_team_id: 14, away_team_id: 16, home_team_goals: 0, away_team_goals: 2 },
{ game_week: 24, date: '2024-02-10', home_team_id: 3, away_team_id: 19, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 24, date: '2024-02-10', home_team_id: 17, away_team_id: 7, home_team_goals: 2, away_team_goals: 3 },
{ game_week: 24, date: '2024-02-11', home_team_id: 9, away_team_id: 2, home_team_goals: 0, away_team_goals: 6 },
{ game_week: 24, date: '2024-02-11', home_team_id: 4, away_team_id: 8, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 24, date: '2024-02-12', home_team_id: 10, away_team_id: 6, home_team_goals: 1, away_team_goals: 3 },

// Game Week 25
{ game_week: 25, date: '2024-02-17', home_team_id: 16, away_team_id: 3, home_team_goals: 1, away_team_goals: 4 },
{ game_week: 25, date: '2024-02-17', home_team_id: 7, away_team_id: 12, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 25, date: '2024-02-17', home_team_id: 13, away_team_id: 4, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 25, date: '2024-02-17', home_team_id: 17, away_team_id: 9, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 25, date: '2024-02-17', home_team_id: 19, away_team_id: 2, home_team_goals: 0, away_team_goals: 5 },
{ game_week: 25, date: '2024-02-17', home_team_id: 5, away_team_id: 14, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 25, date: '2024-02-17', home_team_id: 1, away_team_id: 6, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 25, date: '2024-02-18', home_team_id: 20, away_team_id: 11, home_team_goals: 0, away_team_goals: 5 },
{ game_week: 25, date: '2024-02-18', home_team_id: 18, away_team_id: 8, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 25, date: '2024-02-19', home_team_id: 15, away_team_id: 10, home_team_goals: 1, away_team_goals: 1 },

// Game Week 26
{ game_week: 26, date: '2024-02-21', home_team_id: 3, away_team_id: 18, home_team_goals: 4, away_team_goals: 1 },
{ game_week: 26, date: '2024-02-24', home_team_id: 11, away_team_id: 15, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 26, date: '2024-02-24', home_team_id: 8, away_team_id: 13, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 26, date: '2024-02-24', home_team_id: 10, away_team_id: 19, home_team_goals: 3, away_team_goals: 0 },
{ game_week: 26, date: '2024-02-24', home_team_id: 4, away_team_id: 17, home_team_goals: 4, away_team_goals: 2 },
{ game_week: 26, date: '2024-02-24', home_team_id: 12, away_team_id: 1, home_team_goals: 0, away_team_goals: 1 },
{ game_week: 26, date: '2024-02-24', home_team_id: 2, away_team_id: 7, home_team_goals: 4, away_team_goals: 1 },
{ game_week: 26, date: '2024-02-25', home_team_id: 14, away_team_id: 20, home_team_goals: 1, away_team_goals: 0 },
{ game_week: 26, date: '2024-02-26', home_team_id: 9, away_team_id: 16, home_team_goals: 4, away_team_goals: 2 },
{ game_week: 26, date: '2024-05-02', home_team_id: 6, away_team_id: 5, home_team_goals: 2, away_team_goals: 0 },

// Game Week 27
{ game_week: 27, date: '2024-03-02', home_team_id: 15, away_team_id: 9, home_team_goals: 1, away_team_goals: 3 },
{ game_week: 27, date: '2024-03-02', home_team_id: 5, away_team_id: 10, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 27, date: '2024-03-02', home_team_id: 7, away_team_id: 14, home_team_goals: 3, away_team_goals: 0 },
{ game_week: 27, date: '2024-03-02', home_team_id: 13, away_team_id: 11, home_team_goals: 3, away_team_goals: 0 },
{ game_week: 27, date: '2024-03-02', home_team_id: 16, away_team_id: 6, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 27, date: '2024-03-02', home_team_id: 17, away_team_id: 3, home_team_goals: 0, away_team_goals: 1 },
{ game_week: 27, date: '2024-03-02', home_team_id: 18, away_team_id: 4, home_team_goals: 2, away_team_goals: 3 },
{ game_week: 27, date: '2024-03-03', home_team_id: 19, away_team_id: 12, home_team_goals: 0, away_team_goals: 2 },
{ game_week: 27, date: '2024-03-03', home_team_id: 1, away_team_id: 8, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 27, date: '2024-03-04', home_team_id: 20, away_team_id: 2, home_team_goals: 0, away_team_goals: 6 },

// Game Week 28
{ game_week: 28, date: '2024-03-09', home_team_id: 8, away_team_id: 15, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 28, date: '2024-03-09', home_team_id: 10, away_team_id: 18, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 28, date: '2024-03-09', home_team_id: 14, away_team_id: 13, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 28, date: '2024-03-09', home_team_id: 12, away_team_id: 20, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 28, date: '2024-03-09', home_team_id: 2, away_team_id: 16, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 28, date: '2024-03-10', home_team_id: 4, away_team_id: 5, home_team_goals: 0, away_team_goals: 4 },
{ game_week: 28, date: '2024-03-10', home_team_id: 9, away_team_id: 19, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 28, date: '2024-03-10', home_team_id: 11, away_team_id: 17, home_team_goals: 1, away_team_goals: 0 },
{ game_week: 28, date: '2024-03-10', home_team_id: 3, away_team_id: 1, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 28, date: '2024-03-11', home_team_id: 6, away_team_id: 7, home_team_goals: 3, away_team_goals: 2 },

// Game Week 29
{ game_week: 29, date: '2024-03-16', home_team_id: 18, away_team_id: 17, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 29, date: '2024-03-16', home_team_id: 19, away_team_id: 16, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 29, date: '2024-03-16', home_team_id: 13, away_team_id: 5, home_team_goals: 3, away_team_goals: 0 },
{ game_week: 29, date: '2024-03-17', home_team_id: 9, away_team_id: 4, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 29, date: '2024-04-23', home_team_id: 2, away_team_id: 6, home_team_goals: 5, away_team_goals: 0 },
{ game_week: 29, date: '2024-04-24', home_team_id: 14, away_team_id: 12, home_team_goals: 0, away_team_goals: 1 },
{ game_week: 29, date: '2024-04-24', home_team_id: 10, away_team_id: 7, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 29, date: '2024-04-24', home_team_id: 8, away_team_id: 20, home_team_goals: 4, away_team_goals: 2 },
{ game_week: 29, date: '2024-04-24', home_team_id: 15, away_team_id: 3, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 29, date: '2024-04-25', home_team_id: 11, away_team_id: 1, home_team_goals: 0, away_team_goals: 4 },

// Game Week 30
{ game_week: 30, date: '2024-03-30', home_team_id: 7, away_team_id: 9, home_team_goals: 4, away_team_goals: 3 },
{ game_week: 30, date: '2024-03-30', home_team_id: 17, away_team_id: 10, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 30, date: '2024-03-30', home_team_id: 20, away_team_id: 13, home_team_goals: 3, away_team_goals: 3 },
{ game_week: 30, date: '2024-03-30', home_team_id: 5, away_team_id: 18, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 30, date: '2024-03-30', home_team_id: 6, away_team_id: 19, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 30, date: '2024-03-30', home_team_id: 12, away_team_id: 15, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 30, date: '2024-03-30', home_team_id: 147, away_team_id: 14, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 30, date: '2024-03-30', home_team_id: 16, away_team_id: 8, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 30, date: '2024-03-31', home_team_id: 3, away_team_id: 11, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 30, date: '2024-03-31', home_team_id: 1, away_team_id: 2, home_team_goals: 0, away_team_goals: 0 },

// Game Week 31
{ game_week: 31, date: '2024-04-02', home_team_id: 7, away_team_id: 15, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 31, date: '2024-04-02', home_team_id: 17, away_team_id: 13, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 31, date: '2024-04-02', home_team_id: 19, away_team_id: 14, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 31, date: '2024-04-02', home_team_id: 12, away_team_id: 10, home_team_goals: 1, away_team_goals: 0 },
{ game_week: 31, date: '2024-04-02', home_team_id: 9, away_team_id: 5, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 31, date: '2024-04-03', home_team_id: 16, away_team_id: 11, home_team_goals: 0, away_team_goals: 0 },
{ game_week: 31, date: '2024-04-03', home_team_id: 2, away_team_id: 18, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 31, date: '2024-04-03', home_team_id: 1, away_team_id: 4, home_team_goals: 4, away_team_goals: 1 },
{ game_week: 31, date: '2024-04-04', home_team_id: 3, away_team_id: 20, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 31, date: '2024-04-04', home_team_id: 6, away_team_id: 8, home_team_goals: 4, away_team_goals: 3 },

// Game Week 32
{ game_week: 32, date: '2024-04-06', home_team_id: 10, away_team_id: 1, home_team_goals: 2, away_team_goals: 4 },
{ game_week: 32, date: '2024-04-06', home_team_id: 15, away_team_id: 19, home_team_goals: 1, away_team_goals: 0 },
{ game_week: 32, date: '2024-04-06', home_team_id: 4, away_team_id: 16, home_team_goals: 3, away_team_goals: 3 },
{ game_week: 32, date: '2024-04-06', home_team_id: 13, away_team_id: 7, home_team_goals: 0, away_team_goals: 1 },
{ game_week: 32, date: '2024-04-06', home_team_id: 18, away_team_id: 12, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 32, date: '2024-04-06', home_team_id: 14, away_team_id: 9, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 32, date: '2024-04-06', home_team_id: 11, away_team_id: 2, home_team_goals: 0, away_team_goals: 3 },
{ game_week: 32, date: '2024-04-07', home_team_id: 8, away_team_id: 3, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 32, date: '2024-04-07', home_team_id: 20, away_team_id: 6, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 32, date: '2024-04-07', home_team_id: 5, away_team_id: 17, home_team_goals: 3, away_team_goals: 1 },

// Game Week 33
{ game_week: 33, date: '2024-04-13', home_team_id: 7, away_team_id: 5, home_team_goals: 4, away_team_goals: 0 },
{ game_week: 33, date: '2024-04-13', home_team_id: 1, away_team_id: 18, home_team_goals: 5, away_team_goals: 1 },
{ game_week: 33, date: '2024-04-13', home_team_id: 19, away_team_id: 11, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 33, date: '2024-04-13', home_team_id: 17, away_team_id: 14, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 33, date: '2024-04-13', home_team_id: 16, away_team_id: 20, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 33, date: '2024-04-13', home_team_id: 12, away_team_id: 8, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 33, date: '2024-04-14', home_team_id: 3, away_team_id: 10, home_team_goals: 0, away_team_goals: 1 },
{ game_week: 33, date: '2024-04-14', home_team_id: 9, away_team_id: 13, home_team_goals: 0, away_team_goals: 2 },
{ game_week: 33, date: '2024-04-14', home_team_id: 2, away_team_id: 4, home_team_goals: 0, away_team_goals: 2 },
{ game_week: 33, date: '2024-04-15', home_team_id: 6, away_team_id: 15, home_team_goals: 6, away_team_goals: 0 },

// Game Week 34
{ game_week: 34, date: '2024-04-20', home_team_id: 20, away_team_id: 19, home_team_goals: 1, away_team_goals: 4 },
{ game_week: 34, date: '2024-04-20', home_team_id: 18, away_team_id: 16, home_team_goals: 1, away_team_goals: 5 },
{ game_week: 34, date: '2024-04-20', home_team_id: 14, away_team_id: 2, home_team_goals: 0, away_team_goals: 2 },
{ game_week: 34, date: '2024-04-21', home_team_id: 15, away_team_id: 17, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 34, date: '2024-04-21', home_team_id: 4, away_team_id: 12, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 34, date: '2024-04-21', home_team_id: 10, away_team_id: 9, home_team_goals: 5, away_team_goals: 2 },
{ game_week: 34, date: '2024-04-21', home_team_id: 13, away_team_id: 3, home_team_goals: 1, away_team_goals: 3 },
{ game_week: 34, date: '2024-05-14', home_team_id: 5, away_team_id: 1, home_team_goals: 0, away_team_goals: 2 },
{ game_week: 34, date: '2024-05-15', home_team_id: 11, away_team_id: 6, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 34, date: '2024-05-15', home_team_id: 8, away_team_id: 7, home_team_goals: 3, away_team_goals: 2 },

// Game Week 35
{ game_week: 35, date: '2024-04-27', home_team_id: 9, away_team_id: 3, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 35, date: '2024-04-27', home_team_id: 7, away_team_id: 20, home_team_goals: 5, away_team_goals: 1 },
{ game_week: 35, date: '2024-04-27', home_team_id: 14, away_team_id: 18, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 35, date: '2024-04-27', home_team_id: 13, away_team_id: 10, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 35, date: '2024-04-27', home_team_id: 8, away_team_id: 19, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 35, date: '2024-04-27', home_team_id: 15, away_team_id: 16, home_team_goals: 1, away_team_goals: 0 },
{ game_week: 35, date: '2024-04-27', home_team_id: 4, away_team_id: 6, home_team_goals: 2, away_team_goals: 2 },
{ game_week: 35, date: '2024-04-28', home_team_id: 12, away_team_id: 11, home_team_goals: 3, away_team_goals: 0 },
{ game_week: 35, date: '2024-04-28', home_team_id: 5, away_team_id: 2, home_team_goals: 2, away_team_goals: 3 },
{ game_week: 35, date: '2024-04-28', home_team_id: 17, away_team_id: 1, home_team_goals: 0, away_team_goals: 2 },

// Game Week 36
{ game_week: 36, date: '2024-05-03', home_team_id: 18, away_team_id: 15, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 36, date: '2024-05-04', home_team_id: 2, away_team_id: 12, home_team_goals: 3, away_team_goals: 0 },
{ game_week: 36, date: '2024-05-04', home_team_id: 16, away_team_id: 13, home_team_goals: 0, away_team_goals: 0 },
{ game_week: 36, date: '2024-05-04', home_team_id: 20, away_team_id: 17, home_team_goals: 1, away_team_goals: 3 },
{ game_week: 36, date: '2024-05-04', home_team_id: 19, away_team_id: 7, home_team_goals: 1, away_team_goals: 4 },
{ game_week: 36, date: '2024-05-04', home_team_id: 1, away_team_id: 14, home_team_goals: 5, away_team_goals: 1 },
{ game_week: 36, date: '2024-05-05', home_team_id: 6, away_team_id: 9, home_team_goals: 5, away_team_goals: 0 },
{ game_week: 36, date: '2024-05-05', home_team_id: 11, away_team_id: 4, home_team_goals: 1, away_team_goals: 0 },
{ game_week: 36, date: '2024-05-05', home_team_id: 3, away_team_id: 5, home_team_goals: 4, away_team_goals: 2 },
{ game_week: 36, date: '2024-05-06', home_team_id: 10, away_team_id: 8, home_team_goals: 4, away_team_goals: 0 },

// Game Week 37
{ game_week: 37, date: '2024-05-11', home_team_id: 13, away_team_id: 1, home_team_goals: 0, away_team_goals: 4 },
{ game_week: 37, date: '2024-05-11', home_team_id: 9, away_team_id: 18, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 37, date: '2024-05-11', home_team_id: 7, away_team_id: 11, home_team_goals: 1, away_team_goals: 1 },
{ game_week: 37, date: '2024-05-11', home_team_id: 15, away_team_id: 20, home_team_goals: 1, away_team_goals: 0 },
{ game_week: 37, date: '2024-05-11', home_team_id: 14, away_team_id: 10, home_team_goals: 1, away_team_goals: 3 },
{ game_week: 37, date: '2024-05-11', home_team_id: 12, away_team_id: 16, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 37, date: '2024-05-11', home_team_id: 5, away_team_id: 19, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 37, date: '2024-05-11', home_team_id: 17, away_team_id: 6, home_team_goals: 2, away_team_goals: 3 },
{ game_week: 37, date: '2024-05-12', home_team_id: 8, away_team_id: 2, home_team_goals: 0, away_team_goals: 1 },
{ game_week: 37, date: '2024-05-13', home_team_id: 4, away_team_id: 3, home_team_goals: 3, away_team_goals: 3 },

// Game Week 38
{ game_week: 38, date: '2024-05-19', home_team_id: 3, away_team_id: 14, home_team_goals: 2, away_team_goals: 0 },
{ game_week: 38, date: '2024-05-19', home_team_id: 19, away_team_id: 17, home_team_goals: 1, away_team_goals: 2 },
{ game_week: 38, date: '2024-05-19', home_team_id: 2, away_team_id: 15, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 38, date: '2024-05-19', home_team_id: 18, away_team_id: 13, home_team_goals: 2, away_team_goals: 4 },
{ game_week: 38, date: '2024-05-19', home_team_id: 6, away_team_id: 12, home_team_goals: 2, away_team_goals: 1 },
{ game_week: 38, date: '2024-05-19', home_team_id: 16, away_team_id: 7, home_team_goals: 2, away_team_goals: 4 },
{ game_week: 38, date: '2024-05-19', home_team_id: 1, away_team_id: 9, home_team_goals: 3, away_team_goals: 1 },
{ game_week: 38, date: '2024-05-19', home_team_id: 10, away_team_id: 4, home_team_goals: 5, away_team_goals: 0 },
{ game_week: 38, date: '2024-05-19', home_team_id: 11, away_team_id: 8, home_team_goals: 0, away_team_goals: 2 },
{ game_week: 38, date: '2024-05-19', home_team_id: 20, away_team_id: 5, home_team_goals: 0, away_team_goals: 3 },
]

  db.serialize(() => {
      // Teams Table
      db.run(`
          CREATE TABLE IF NOT EXISTS teams (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL UNIQUE,
              image TEXT NOT NULL,
              games INTEGER DEFAULT 0,
              wins INTEGER DEFAULT 0,
              draws INTEGER DEFAULT 0,
              losses INTEGER DEFAULT 0,
              goals_scored INTEGER DEFAULT 0,
              goals_conceded INTEGER DEFAULT 0,
              goal_difference INTEGER DEFAULT 0,
              points INTEGER DEFAULT 0
          )
      `);
  
      // Matches Table
      db.run(`
          CREATE TABLE IF NOT EXISTS matches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            game_week INTEGER NOT NULL,
            date TEXT NOT NULL,
            home_team_id INTEGER,
            away_team_id INTEGER,
            home_team_goals INTEGER,
            away_team_goals INTEGER,
            FOREIGN KEY(home_team_id) REFERENCES teams(id),
            FOREIGN KEY(away_team_id) REFERENCES teams(id),
            UNIQUE(game_week, home_team_id, away_team_id)
          )
      `);
  
      // Users Table
      db.run(`
          CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT NOT NULL UNIQUE,
              password TEXT NOT NULL,
              team INTEGER,
              FOREIGN KEY(team) REFERENCES teams(id)
          )
      `);

    //   // Insert match data
    // matches.forEach((match) => {
    //     db.run(
    //         `INSERT OR IGNORE INTO matches (game_week, date, home_team_id, away_team_id, home_team_goals, away_team_goals) 
    //          VALUES (?, ?, ?, ?, ?, ?)`,
    //         [
    //             match.game_week,
    //             match.date,
    //             match.home_team_id,
    //             match.away_team_id,
    //             match.home_team_goals,
    //             match.away_team_goals
    //         ],
    //         (err) => {
    //             if (err) {
    //                 console.error(`Error inserting match on ${match.date}:`, err.message);
    //             } else {
    //             }
    //         }
    //     );
    // });
  
    //   // Insert initial team data
    //   teams.forEach((team) => {
    //       db.run(
    //           `INSERT OR IGNORE INTO teams (name, image, games, wins, draws, losses, goals_scored, goals_conceded, goal_difference, points) 
    //           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    //           [
    //               team.name,
    //               team.image,
    //               team.games,
    //               team.wins,
    //               team.draws,
    //               team.losses,
    //               team.goals_scored,
    //               team.goals_conceded,
    //               team.goal_difference,
    //               team.points
    //           ],
    //           (err) => {
    //               if (err) {
    //                   console.error(`Error inserting team ${team.name}:`, err.message);
    //               } else {
    //               }
    //           }
    //       );
    //   });
  });
  
  module.exports = db;