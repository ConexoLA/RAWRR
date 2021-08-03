const init = require("../00_initdb.js");

//PARAMETERS:
//  Vulnerability is an array with the following structure: ["name", "description", "assessment_activity_id", "asset_id"].
//    name can NOT be null
//    assessment_activity_id is a Foreign Key. Can be null.
//    asset_id is a Foreign Key. Can be null.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing vulnerability.
//    Reject: empty array or an error.
export function insert(vulnerability) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql =
            "INSERT INTO vulnerabilities (name, description, assessment_activity_id, asset_id) VALUES (?, ?, ?, ?)";
          db.run(sql, vulnerability, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(vulnerability);
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

//PARAMETERS:
//  None.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing all vulnerabilities.
//    Reject: empty array or an error.
export function queryAll() {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      let vulnerabilities = [];
      if (db) {
        db.serialize(function () {
          let sql =
            "SELECT id, name, description, assessment_activity_id, asset_id, created, last_modified FROM vulnerabilities ORDER BY last_modified DESC";
          db.all(sql, [], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              rows.forEach((row) => {
                vulnerabilities.push(row);
              });
              resolve(vulnerabilities);
            }
          });
        });
      } else {
        reject(vulnerabilities);
      }
    } catch (err) {
      reject(err);
    }
  });
}

//PARAMETERS:
//  Vulnerability is an array with the following structure: ["name", "description", "assessment_activity_id", "asset_id", "id"].
//    name can NOT be null.
//    assessment_activity_id is a Foreign Key. Can be null.
//    asset_id is a Foreign Key. Can be null.
//    id is the table's Primary Key.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing vulnerability.
//    Reject: empty array or an error.
export function update(vulnerability) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql =
            "UPDATE vulnerabilities SET name = ?, description = ?, assessment_activity_id = ?, asset_id = ?, last_modified = CURRENT_TIMESTAMP WHERE id = ?";
          db.run(sql, vulnerability, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(vulnerability);
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

//PARAMETERS:
//  Vulnerability is an array with the following structure: ["id"].
//    id is the table's Primary Key.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing vulnerability.
//    Reject: empty array or an error.
export function remove(vulnerability) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql = "DELETE FROM vulnerabilities WHERE id = ?";
          db.run(sql, vulnerability, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(vulnerability);
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
