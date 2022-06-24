const init = require("../00_initdb.js");

//PARAMETERS:
//  asset_categories is an array with the following structure: ["name", "description"].
//    name can NOT be null.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing asset_category.
//    Reject: empty array or an error.
export function insert(asset_category) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql =
            "INSERT INTO asset_categories (name, description) VALUES (?, ?)";
          db.run(sql, asset_category, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(asset_category);
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
//    Resolve: array containing all asset_categories.
//    Reject: empty array or an error.
export function queryAll() {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      let asset_categories = [];
      if (db) {
        db.serialize(function () {
          let sql =
            "SELECT id, name, description, created, last_modified FROM asset_categories ORDER BY last_modified DESC";
          db.all(sql, [], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              rows.forEach((row) => {
                asset_categories.push(row);
              });
              resolve(asset_categories);
            }
          });
        });
      } else {
        reject(asset_categories);
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
//    Resolve: array containing all asset_categories.
//    Reject: empty array or an error.
export function queryAllById() {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      let asset_categories = [];
      if (db) {
        db.serialize(function () {
          let sql =
            "SELECT id, name, description, created, last_modified FROM asset_categories ORDER BY id DESC";
          db.all(sql, [], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              rows.forEach((row) => {
                asset_categories.push(row);
              });
              resolve(asset_categories);
            }
          });
        });
      } else {
        reject(asset_categories);
      }
    } catch (err) {
      reject(err);
    }
  });
}

//PARAMETERS:
//  Asset_category is an array with the following structure: ["name", "description", "id"].
//    name can NOT be null.
//    id is the table's Primary Key.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing asset_category.
//    Reject: empty array or an error.
export function update(asset_category) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql =
            "UPDATE asset_categories SET name = ?, description = ?, last_modified = CURRENT_TIMESTAMP WHERE id = ?";
          db.run(sql, asset_category, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(asset_category);
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
//  Asset_category is an array with the following structure: ["id"].
//    id is the table's Primary Key.
//EXPECTED OUTPUT:
//  Returns a promise.
//    Resolve: array containing asset_category.
//    Reject: empty array or an error.
export function remove(asset_category) {
  return new Promise(function (resolve, reject) {
    try {
      let db = init.open();
      if (db) {
        db.serialize(function () {
          let sql = "DELETE FROM asset_categories WHERE id = ?";
          db.run(sql, asset_category, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(asset_category);
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
