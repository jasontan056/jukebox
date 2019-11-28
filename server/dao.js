const fs = require("fs");
const sqlite3 = require("sqlite3");

sqlite3.verbose();

module.exports = class Dao {
  constructor(dbFile) {
    this.db = new sqlite3.Database(dbFile);
    const createRoomTableSql = `
            CREATE TABLE IF NOT EXISTS rooms (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                currentSongId INTEGER,
                playing INTEGER DEFAULT 0,
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
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          console.log("Error running sql " + sql);
          console.log(err);
          reject(err);
        } else {
          resolve({ lastId: this.lastID });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          console.log("Error running sql: " + sql);
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, results) => {
        if (err) {
          console.log("Error running sql: " + sql);
          console.log(err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
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
                VALUES ('${name}');`;
    return this.run(sql);
  }

  updateRoomPlaying(roomId, playing) {
    const sql = `
            UPDATE rooms
            SET playing = ${playing ? 1 : 0}
            WHERE id = ${roomId};
        `;
    return this.run(sql);
  }

  updateRoomCurrentSongId(roomId, currentSongId) {
    const sql = `
            UPDATE rooms
            SET currentSongId = ${currentSongId}
            WHERE id = ${roomId};
        `;
    return this.run(sql);
  }

  getSongsByRoomId(roomId) {
    const sql = `
            SELECT *
            FROM songs
            WHERE roomId=${roomId}`;
    return this.all(sql, []);
  }

  addSong(song, roomId) {
    const { videoId, title, channelTitle, thumbnail } = song;
    const sql = `
            INSERT INTO songs (roomId, videoId, title, channelTitle, thumbnail)
                VALUES ('${roomId}', '${videoId}', '${title}', '${channelTitle}', '${thumbnail}');`;
    return this.run(sql);
  }
};
