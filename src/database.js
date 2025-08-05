import { openDatabase } from 'react-native-sqlite-storage';

const database_name = 'PhotoJournal.db';
const database_version = '1.0';
const database_displayname = 'Photo Journal Database';
const database_size = 200000;

export const getDB = () => {
  return openDatabase(
    {
      name: database_name,
      location: 'default',
    },
    () => {},
    error => {
      console.log('DB Error:', error);
    }
  );
};

export const createTable = () => {
  const db = getDB();
  db.transaction(txn => {
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS entries(id INTEGER PRIMARY KEY AUTOINCREMENT, uri TEXT, title TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)',
      [],
      () => {
        console.log('Table created successfully');
      },
      error => {
        console.log('Error creating table:', error);
      }
    );
  });
};

export const addEntry = (uri, title) => {
  const db = getDB();
  return new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        'INSERT INTO entries (uri, title) VALUES (?, ?)',
        [uri, title],
        (txn, results) => {
          if (results.rowsAffected > 0) {
            resolve('Entry added successfully');
          } else {
            reject('Failed to add entry');
          }
        },
        error => {
          reject(error);
        }
      );
    });
  });
};

export const getEntries = () => {
  const db = getDB();
  return new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM entries ORDER BY timestamp DESC',
        [],
        (txn, results) => {
          let entries = [];
          for (let i = 0; i < results.rows.length; ++i) {
            entries.push(results.rows.item(i));
          }
          resolve(entries);
        },
        error => {
          reject(error);
        }
      );
    });
  });
};

export const deleteEntry = (id) => {
  const db = getDB();
  return new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        'DELETE FROM entries WHERE id = ?',
        [id],
        (txn, results) => {
          if (results.rowsAffected > 0) {
            resolve('Entry deleted successfully');
          } else {
            reject('Failed to delete entry');
          }
        },
        error => {
          reject(error);
        }
      );
    });
  });
};

export const initDB = () => {
  createTable();
};


