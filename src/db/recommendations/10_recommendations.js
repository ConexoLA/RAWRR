const init = require("../00_initdb.js");

//PARAMETERS:
//  Recommendation is an array with the following structure: ["name", "description", "implementation_cost", "implementation_time"].
//    name can NOT be null.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing recommendation.
//    Reject: empty array or an error.
export function insert(recommendation) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql =
            "INSERT INTO recommendations (name, description, implementation_cost, implementation_time) VALUES (?, ?, ?, ?)";
          db.run(sql, recommendation, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(recommendation);
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
//    Resolve: array containing all recommendations.
//    Reject: empty array or an error.
export function queryAll() {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      let recommendations = [];
      if (db) {
        db.serialize(function () {
          let sql =
            "SELECT id, name, description, implementation_cost, implementation_time, created, last_modified FROM recommendations ORDER BY last_modified DESC";
          db.all(sql, [], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              rows.forEach((row) => {
                recommendations.push(row);
              });
              resolve(recommendations);
            }
          });
        });
      } else {
        reject(recommendations);
      }
    } catch (err) {
      reject(err);
    }
  });
}

//PARAMETERS:
//  Recommendation is an array with the following structure: ["name", "description", "implementation_cost", "implementation_time", "id"].
//    name can NOT be null.
//    id is the table's Primary Key.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing recommendation.
//    Reject: empty array or an error.
export function update(recommendation) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql =
            "UPDATE recommendations SET name = ?, description = ?, implementation_cost = ?, implementation_time = ?, last_modified = CURRENT_TIMESTAMP WHERE id = ?";
          db.run(sql, recommendation, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(recommendation);
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
//  Recommendation is an array with the following structure: ["id"].
//    id is the table's Primary Key.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing recommendation.
//    Reject: empty array or an error.
export function remove(recommendation) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql = "DELETE FROM recommendations WHERE id = ?";
          db.run(sql, recommendation, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(recommendation);
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
