const init = require("../00_initdb.js");

//PARAMETERS:
//  threats_audit is an array with the following structure: ["threat_id", "changed_fields", "observation"].
//    threat_id is a Foreign Key. can NOT be null.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing threats_audit.
//    Reject: empty array or an error.
export function insert(threats_audit) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql =
            "INSERT INTO threats_audits (threat_id, changed_fields, observation, type) VALUES (?, ?, ?, ?)";
          db.run(sql, threats_audit, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(threats_audit);
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
//    Resolve: array containing all threats_audits.
//    Reject: empty array or an error.
export function queryAll() {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      let threats_audits = [];
      if (db) {
        db.serialize(function () {
          let sql =
            "SELECT id, threat_id, changed_fields, observation, type, created FROM threats_audits ORDER BY threat_id DESC, created DESC";
          db.all(sql, [], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              rows.forEach((row) => {
                threats_audits.push(row);
              });
              resolve(threats_audits);
            }
          });
        });
      } else {
        reject(threats_audits);
      }
    } catch (err) {
      reject(err);
    }
  });
}

//PARAMETERS:
//  threats_audit is an array with the following structure: ["threat_id"]
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing all threats audits given the threat id.
//    Reject: empty array or an error.
export function allAudits(threat) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      let threats_audits = [];
      if (db) {
        db.serialize(function () {
          let sql =
            "SELECT id, threat_id, changed_fields, observation, type, created FROM threats_audits WHERE threat_id = ? ORDER BY created DESC";
          db.all(sql, threat, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              rows.forEach((row) => {
                threats_audits.push(row);
              });
              resolve(threats_audits);
            }
          });
        });
      } else {
        reject(threats_audits);
      }
    } catch (err) {
      reject(err);
    }
  });
}
