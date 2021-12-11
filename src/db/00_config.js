const init = require("./00_initdb");

//PARAMETERS:
//  None.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing config.
//    Reject: empty array or an error.
export function queryAll() {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      let config = [];
      if (db) {
        db.serialize(function () {
          let sql = "SELECT id, data FROM config";
          db.all(sql, [], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              rows.forEach((row) => {
                config.push(row);
              });
              resolve(config);
            }
          });
        });
      } else {
        reject(config);
      }
    } catch (err) {
      reject(err);
    }
  });
}

//PARAMETERS:
//  Config is an array with the following structure: ["data", "id"].
//    data can NOT be null.
//    id is the table's Primary Key.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing config.
//    Reject: empty array or an error.
export function update(config) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql = "UPDATE config SET data = ? WHERE id = ?";
          db.run(sql, config, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(config);
            }
          });
        });
      } else {
        reject([]);
      }
    } catch (err) {
      reject(err);
    }
  });
}
