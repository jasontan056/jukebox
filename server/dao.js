const fs = require('fs');
const sqlite3 = require('sqlite3');

sqlite3.verbose()

module.exports = class Dao {
    constructor(dbFile) {
        this.db = new sqlite3.Database(dbFile);
        const createRoomTableSql = `
            CREATE TABLE IF NOT EXISTS rooms (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT)`;
        const createSongTableSql = `
            CREATE TABLE IF NOT EXISTS songs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                room_id INTEGER NOT NULL,
                videoId TEXT NOT NULL,
                title TEXT NOT NULL,
                channelTitle TEXT NOT NULL,
                thumbnail TEXT NOT NULL,
                FOREIGN KEY (room_id)
                    REFERENCES rooms (id) 
                        ON UPDATE CASCADE
                        ON DELETE CASCADE)`;

        this.db.serialize(() => {
            if (!fs.existsSync(dbFile)) {
                this.db.run(createRoomTableSql);
                this.db.run(createSongTableSql);
            }
        })

        // !!! Delete these later.
        this.createRoom('asdf');
        this.getRoom('1', (err, rows) => {
            console.log('got this result from getRoom: ' + rows[0].name);
        });
    }

    getRoom(roomId, callback) {
        const sql = `
            SELECT *
            FROM rooms
            WHERE id=${roomId}`;
        this.db.all(sql, [], callback);
    }

    createRoom(name) {
        const sql = `
            INSERT INTO rooms (name)
                VALUES ('${name}');`
        this.db.run(sql);
    }
}