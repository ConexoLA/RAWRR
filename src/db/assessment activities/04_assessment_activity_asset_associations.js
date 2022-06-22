const init = require("../00_initdb.js");

//PARAMETERS:
//  Association is an array with the following structure: ["assessment_activity_id", "asset_id"]
//    Assessment_activity_id and Asset_id are both Foreign Keys and Primary Keys. They can NOT be null.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing association.
//    Reject: empty array or an error.
export function insert(association) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql =
            "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)";
          db.run(sql, association, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(association);
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
//    Resolve: array containing all associations.
//    Reject: empty array or an error.
export function queryAll() {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      let associations = [];
      if (db) {
        db.serialize(function () {
          let sql =
            "SELECT assessment_activity_id, asset_id FROM assessment_activity_asset_associations";
          db.all(sql, [], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              rows.forEach((row) => {
                associations.push(row);
              });
              resolve(associations);
            }
          });
        });
      } else {
        reject(associations);
      }
    } catch (err) {
      reject(err);
    }
  });
}

//PARAMETERS:
//  Association is an array with the following structure: ["assessment_activity_id", "asset_id"]
//    Assessment_activity_id and Asset_id are both Foreign Keys and Primary Keys. They can NOT be null.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing association.
//    Reject: empty array or an error.
export function remove(association) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql =
            "DELETE FROM assessment_activity_asset_associations WHERE assessment_activity_id = ? AND asset_id = ?";
          db.run(sql, association, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(association);
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
