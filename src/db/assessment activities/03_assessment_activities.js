const init = require("../00_initdb.js");

//PARAMETERS:
//  Assessment_activity is an array with the following structure: ["name", "description"].
//    name can NOT be null.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing assessment_activity.
//    Reject: empty array or an error.
export function insert(assessment_activity) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql =
            "INSERT INTO assessment_activities (name, description) VALUES (?, ?)";
          db.run(sql, assessment_activity, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(assessment_activity);
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
//    Resolve: array containing all assessment_activities.
//    Reject: empty array or an error.
export function queryAll() {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      let assessment_activities = [];
      if (db) {
        db.serialize(function () {
          let sql =
            "SELECT id, name, description, created, last_modified FROM assessment_activities ORDER BY last_modified DESC";
          db.all(sql, [], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              rows.forEach((row) => {
                assessment_activities.push(row);
              });
              resolve(assessment_activities);
            }
          });
        });
      } else {
        reject(assessment_activities);
      }
    } catch (err) {
      reject(err);
    }
  });
}

//PARAMETERS:
//  Assessment_activity is an array with the following structure: ["name", "description", "id"].
//    name can NOT be null.
//    id is the table's Primary Key.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing assessment_activity.
//    Reject: empty array or an error.
export function update(assessment_activity) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql =
            "UPDATE assessment_activities SET name = ?, description = ?, last_modified = CURRENT_TIMESTAMP WHERE id = ?";
          db.run(sql, assessment_activity, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(assessment_activity);
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
//  Assessment_activity is an array with the following structure: ["id"].
//    id is the table's Primary Key.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing assessment_activity.
//    Reject: empty array or an error.
export function remove(assessment_activity) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql = "DELETE FROM assessment_activities WHERE id = ?";
          db.run(sql, assessment_activity, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(assessment_activity);
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
