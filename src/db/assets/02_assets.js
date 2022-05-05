const init = require("../00_initdb.js");

//PARAMETERS:
//  Asset is an array with the following structure: ["name", "asset_category_id", "description"].
//    asset_category_id is a Foreign Key. Can be null.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing asset.
//    Reject: empty array or an error.
export function insert(asset) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql =
            "INSERT INTO assets (name, asset_category_id, description) VALUES (?, ?, ?)";
          db.run(sql, asset, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(asset);
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
//    Resolve: array containing all assets.
//    Reject: empty array or an error.
export function queryAll() {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      let assets = [];
      if (db) {
        db.serialize(function () {
          let sql =
            "SELECT id, name, asset_category_id, description, created, last_modified FROM assets ORDER BY last_modified DESC";
          db.all(sql, [], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              rows.forEach((row) => {
                assets.push(row);
              });
              resolve(assets);
            }
          });
        });
      } else {
        reject(assets);
      }
    } catch (err) {
      reject(err);
    }
  });
}

//PARAMETERS:
//  Asset is an array with the following structure: ["name", "asset_category_id", "description", "id"].
//    asset_category_id is a Foreign Key. Can be null.
//    id is the table's Primary Key.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing asset.
//    Reject: empty array or an error.
export function update(asset) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql =
            "UPDATE assets SET name = ?, asset_category_id = ?, description = ?, last_modified = CURRENT_TIMESTAMP WHERE id = ?";
          db.run(sql, asset, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(asset);
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
//    Resolve: array containing asset.
//    Reject: empty array or an error.
export function remove(asset) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql = "DELETE FROM assets WHERE id = ?";
          db.run(sql, asset, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(asset);
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
//    Resolve: an object containing the asset info.
//    Reject: empty array or an error.
export function getOne(asset) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      let assets = [];
      if (db) {
        db.serialize(function () {
          let sql = "SELECT * FROM assets WHERE id = ?";
          db.all(sql, asset, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              rows.forEach((row) => {
                assets.push(row);
              });
              resolve(assets[0]);
            }
          });
        });
      } else {
        reject(assets);
      }
    } catch (err) {
      reject(err);
    }
  });
}
