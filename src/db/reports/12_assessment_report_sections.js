const init = require("../00_initdb.js");

//PARAMETERS:
//  Assessment_report_section is an array with the following structure: ["name", "description"].
//    name can NOT be null.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing assessment_report_section.
//    Reject: empty array or an error.
export function insert(assessment_report_section) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql =
            "INSERT INTO assessment_report_sections (name, description) VALUES (?, ?)";
          db.run(sql, assessment_report_section, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(assessment_report_section);
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
//    Resolve: array containing all assessment_report_sections.
//    Reject: empty array or an error.
export function queryAll() {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      let assessment_report_sections = [];
      if (db) {
        db.serialize(function () {
          let sql =
            "SELECT id, name, description, created, last_modified FROM assessment_report_sections ORDER BY last_modified DESC";
          db.all(sql, [], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              rows.forEach((row) => {
                assessment_report_sections.push(row);
              });
              resolve(assessment_report_sections);
            }
          });
        });
      } else {
        reject(assessment_report_sections);
      }
    } catch (err) {
      reject(err);
    }
  });
}

//PARAMETERS:
//  Assessment_report_section is an array with the following structure: ["name", "description", "id"].
//    name can NOT be null.
//    id is the table's Primary Key.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing assessment_report_section.
//    Reject: empty array or an error.
export function update(assessment_report_section) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql =
            "UPDATE assessment_report_sections SET name = ?, description = ?, last_modified = CURRENT_TIMESTAMP WHERE id = ?";
          db.run(sql, assessment_report_section, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(assessment_report_section);
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
//  Assessment_report_section is an array with the following structure: ["id"].
//    id is the table's Primary Key.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing assessment_report_section.
//    Reject: empty array or an error.
export function remove(assessment_report_section) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql = "DELETE FROM assessment_report_sections WHERE id = ?";
          db.run(sql, assessment_report_section, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(assessment_report_section);
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
