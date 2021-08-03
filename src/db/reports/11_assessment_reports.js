const init = require("../00_initdb.js");

//PARAMETERS:
//  Assessment_report is an array with the following structure: ["name", "description", "threat_order", "assessment_activities_order", "assessment_activity_results_order", "vulnerabilities_order", "recommendation_order", "assets_order"].
//    name can NOT be null.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing assessment_report.
//    Reject: empty array or an error.
export function insert(assessment_report) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql =
            "INSERT INTO assessment_reports (name, description, threat_order, assessment_activities_order, assessment_activity_results_order, vulnerabilities_order, recommendation_order, assets_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
          db.run(sql, assessment_report, function (err) {
            if (err) {
              reject(err);
            } else {
              //console.log replicate later
              resolve(this.lastID);
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
//    Resolve: array containing all assessment_reports.
//    Reject: empty array or an error.
export function queryAll() {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      let assessment_reports = [];
      if (db) {
        db.serialize(function () {
          let sql =
            "SELECT id, name, description, threat_order, assessment_activities_order, assessment_activity_results_order, vulnerabilities_order, recommendation_order, assets_order, created, last_modified FROM assessment_reports ORDER BY last_modified DESC";
          db.all(sql, [], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              rows.forEach((row) => {
                assessment_reports.push(row);
              });
              resolve(assessment_reports);
            }
          });
        });
      } else {
        reject(assessment_reports);
      }
    } catch (err) {
      reject(err);
    }
  });
}

//PARAMETERS:
//  Id.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing a report row.
//    Reject: An error.
export function queryById(id) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      let assessment_reports = [];
      if (db) {
        db.serialize(function () {
          let sql =
            "SELECT id, name, description, threat_order, assessment_activities_order, assessment_activity_results_order, vulnerabilities_order, recommendation_order, assets_order, created, last_modified FROM assessment_reports WHERE id = ?";
          db.get(sql, [id], (err, row) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(row);
            }
          });
        });
      } else {
        reject(assessment_reports);
      }
    } catch (err) {
      reject(err);
    }
  });
}

//PARAMETERS:
//  Assessment_report is an array with the following structure: ["name", "description", "threat_order", "assessment_activities_order", "assessment_activity_results_order", "vulnerabilities_order", "recommendation_order", "assets_order", "id"].
//    name can NOT be null.
//    id is the table's Primary Key.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing assessment_report.
//    Reject: empty array or an error.
export function update(assessment_report) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql =
            "UPDATE assessment_reports SET name = ?, description = ?, threat_order = ?, assessment_activities_order = ?, assessment_activity_results_order = ?, vulnerabilities_order = ?, recommendation_order = ?, assets_order = ?, last_modified = CURRENT_TIMESTAMP WHERE id = ?";
          db.run(sql, assessment_report, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(assessment_report);
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
//  Assessment_report is an array with the following structure: ["id"].
//    id is the table's Primary Key.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing assessment_report.
//    Reject: empty array or an error.
export function remove(assessment_report) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql = "DELETE FROM assessment_reports WHERE id = ?";
          db.run(sql, assessment_report, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(assessment_report);
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
