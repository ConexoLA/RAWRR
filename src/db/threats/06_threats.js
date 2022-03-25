const init = require("../00_initdb.js");

//PARAMETERS:
//  threat is an array with the following structure: ["threat_type_id", "name", "description", "asset_id", "impact", "likelihood"].
//    threat_type_id is a Foreign Key. Can be null.
//    asset_id is a Foreign Key. Can be null.
//    impact is an Integer between 0 and 10
//    likelihood is an Integer between 0 and 10
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing threat.
//    Reject: empty array or an error.
export function insert(threat) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql =
            "INSERT INTO threats (threat_type_id, name, description, asset_id, impact, likelihood) VALUES (?, ?, ?, ?, ?, ?)";
          db.run(sql, threat, function (err) {
            if (err) {
              reject(err);
            } else {
              threat.push(this.lastID);
              resolve(threat);
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
//    Resolve: array containing all threats.
//    Reject: empty array or an error.
export function queryAll() {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      let threats = [];
      if (db) {
        db.serialize(function () {
          let sql =
            "SELECT id, threat_type_id, name, description, asset_id, impact, likelihood, created, last_modified FROM threats ORDER BY last_modified DESC";
          db.all(sql, [], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              rows.forEach((row) => {
                threats.push(row);
              });
              resolve(threats);
            }
          });
        });
      } else {
        reject(threats);
      }
    } catch (err) {
      reject(err);
    }
  });
}

//PARAMETERS:
//  Threat is an array with the following structure: ["threat_type_id", "name", "description", "asset_id", "impact", "likelihood", "id"].
//    threat_type_id is a Foreign Key. Can be null.
//    asset_id is a Foreign Key. Can be null.
//    id is the table's Primary Key.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing threat.
//    Reject: empty array or an error.
export function update(threat) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql =
            "UPDATE threats SET threat_type_id = ?, name = ?, description = ?, asset_id = ?, impact = ?, likelihood = ?, last_modified = CURRENT_TIMESTAMP WHERE id = ?";
          db.run(sql, threat, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(threat);
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
//  Threat is an array with the following structure: ["id"].
//    id is the table's Primary Key.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing threat.
//    Reject: empty array or an error.
export function remove(threat) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql = "DELETE FROM threats WHERE id = ?";
          db.run(sql, threat, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(threat);
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
//  Threat_id is the id of the current threat trying to return
//    id is the table's Primary Key.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing threat.
//    Reject: empty array or an error.
export function getOne(threat) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      let threats = [];
      if (db) {
        db.serialize(function () {
          let sql =
            "SELECT * FROM threats WHERE id = ?";
          db.all(sql, threat, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              rows.forEach((row) => {
                threats.push(row);
              });
              resolve(threats[0]);
            }
          });
        });
      } else {
        reject(threats);
      }
    } catch (err) {
      reject(err);
    }
  });
}
