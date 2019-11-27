const fs = require('fs');
const sqlite3 = require('sqlite3');

sqlite3.verbose()

module.exports = class Dao {
    constructor(dbFile) {
        this.db = new sqlite3.Database(dbFile);
        const createRoomTableSql = `
            CREATE TABLE IF NOT EXISTS rooms (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                currentSongId INTEGER,
                FOREIGN KEY (currentSongId)
                    REFERENCES songs (id) )`;
        const createSongTableSql = `
            CREATE TABLE IF NOT EXISTS songs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                roomId INTEGER NOT NULL,
                videoId TEXT NOT NULL,
                title TEXT NOT NULL,
                channelTitle TEXT NOT NULL,
                thumbnail TEXT NOT NULL,
                FOREIGN KEY (roomId)
                    REFERENCES rooms (id) 
                        ON UPDATE CASCADE
                        ON DELETE CASCADE)`;

        this.db.serialize(() => {
            if (!fs.existsSync(dbFile)) {
                this.db.run(createRoomTableSql);
                this.db.run(createSongTableSql);
            }
        });

       /* this.createRoom('asdf')
            .then((data) => {
                console.log(data);
            });
            
        this.getRoomById(1).then((row) => console.log(row));*/

    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    console.log('Error running sql ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve({ id: this.lastID })
                }
            })
        })
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }

    getRoomById(roomId) {
        const sql = `
            SELECT *
            FROM rooms
            WHERE id=${roomId}`;
        return this.get(sql, []);
    }

    createRoom(name) {
        const sql = `
            INSERT INTO rooms (name)
                VALUES ('${name}');`
        return this.run(sql);
    }
}