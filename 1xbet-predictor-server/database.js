var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE data (
            id INTEGER PRIMARY KEY  AUTOINCREMENT,
            timestamp DATETIME,  -- Assuming this is a datetime for recording time
            crash_point FLOAT,
            pre_crash_point FLOAT,
            predict_crash_point FLOAT DEFAULT 0.0,  -- Default value should not be quoted
            risk_at FLOAT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Use CURRENT_TIMESTAMP for MySQL
        );`,
        (err) => { 
            if (err) {
                // Table already created
                console.log(err.message)
            }else{
                db.run(`INSERT INTO data(id, timestamp, crash_point, pre_crash_point, predict_crash_point, risk_at) VALUES(1,'-',0,0,0,0)`, 
                (err) => { 
                    if (err) {
                        // Table already created
                        console.log(err.message)
                    }
                })
            }

        });  
        db.run(`CREATE TABLE bets (
            id INTEGER PRIMARY KEY  AUTOINCREMENT,
            win BOOLEAN,
            crash_point FLOAT,
            acual_crash_point FLOAT,
            thread INTEGER,
            rounds INTEGER,
            value FLOAT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Use CURRENT_TIMESTAMP for MySQL
        );`,
        (err) => { 
            if (err) {
                // Table already created
                console.log(err.message)
            }else{
                db.run(`INSERT INTO bets(id, win, crash_point, acual_crash_point, thread, rounds, value) VALUES(1,'false',0,0,0,0,0)`, 
                (err) => { 
                    if (err) {
                        // Table already created
                        console.log(err.message)
                    }
                })
            }

        });  

        db.run(`CREATE TABLE threads(
            id INTEGER PRIMARY KEY  AUTOINCREMENT,
            thread STRING,
            rounds INTEGER,
            value FLOAT,
            status BOOLEAN,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Use CURRENT_TIMESTAMP for MySQL
        );`,
        (err) => { 
            if (err) {
                // Table already created
                console.log(err.message)
            }else{
                db.run(`INSERT INTO threads(id, thread, rounds, value, status) VALUES(1,'thread_1',0, 100, True), (2,'thread_2',0, 100, True), (3,'thread_3',0, 100, True)`, 
                (err) => { 
                    if (err) {
                        // Table already created
                        console.log(err.message)
                    }
                })
            }

        }); 
      
    }
});


module.exports = db