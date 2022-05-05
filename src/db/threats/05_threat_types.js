const init = require("../00_initdb.js");

//PARAMETERS:
//  Threat_type is an array with the following structure: ["name", "description", "color"].
//    name can NOT be null.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing threat_type.
//    Reject: empty array or an error.
export function insert(threat_type) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql =
            "INSERT INTO threat_types (name, description, color) VALUES (?, ?, ?)";
          db.run(sql, threat_type, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(threat_type);
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
//    Resolve: array containing all threat_types.
//    Reject: empty array or an error.
export function queryAll() {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      let threat_types = [];
      if (db) {
        db.serialize(function () {
          let sql =
            "SELECT id, name, description, color, created, last_modified FROM threat_types ORDER BY last_modified DESC";
          db.all(sql, [], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              rows.forEach((row) => {
                threat_types.push(row);
              });
              resolve(threat_types);
            }
          });
        });
      } else {
        reject(threat_types);
      }
    } catch (err) {
      reject(err);
    }
  });
}

//PARAMETERS:
//  Threat_type is an array with the following structure: ["name", "description", "color", "id"].
//    name can NOT be null.
//    id is the table's Primary Key.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing threat_type.
//    Reject: empty array or an error.
export function update(threat_type) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql =
            "UPDATE threat_types SET name = ?, description = ?, color = ?, last_modified = CURRENT_TIMESTAMP WHERE id = ?";
          db.run(sql, threat_type, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(threat_type);
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
//  Threat_type is an array with the following structure: ["id"].
//    id is the table's Primary Key.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing threat_type.
//    Reject: empty array or an error.
export function remove(threat_type) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql = "DELETE FROM threat_types WHERE id = ?";
          db.run(sql, threat_type, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(threat_type);
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
//  Asset is an array with the following structure: ["id"].
//    id is the table's Primary Key.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: an object containing the threat type info.
//    Reject: empty array or an error.
export function getOne(threat_type) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      let threat_types = [];
      if (db) {
        db.serialize(function () {
          let sql = "SELECT * FROM threat_types WHERE id = ?";
          db.all(sql, threat_type, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              rows.forEach((row) => {
                threat_types.push(row);
              });
              resolve(threat_types[0]);
            }
          });
        });
      } else {
        reject(threat_types);
      }
    } catch (err) {
      reject(err);
    }
  });
}
