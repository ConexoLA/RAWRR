const fs = require("fs");
const { dialog } = require("electron");

export function export_database(title_save, message_save) {
  return new Promise(function (resolve, reject) {
    try {
      var pathlib = require("path");
      const isBuild = process.env.NODE_ENV === "production";

      if (process.platform === "darwin") {
        var dbPath = pathlib.join(
          // eslint-disable-next-line no-undef
          isBuild ? __dirname : __static,
          isBuild ? "../../" : "",
          "../rawrr.db"
        );
      }

      if (process.platform === "win32") {
        if (isBuild) {
          var dbPath = pathlib.join(
            process.env.PORTABLE_EXECUTABLE_DIR,
            "/rawrr.db"
          );
        } else {
          var dbPath = pathlib.join(
            // eslint-disable-next-line no-undef
            isBuild ? __dirname : __static,
            isBuild ? "../../" : "",
            "../rawrr.db"
          );
        }
      }

      if (process.platform === "linux") {
        var dbPath = pathlib.resolve(".", "rawrr.db");
      }

      var options_save = {
        title: title_save,
        message: message_save,
        filters: [{ name: "Databases", extensions: ["db"] }],
        defaultPath: dbPath,
      };

      let path_original = dbPath;
      if (path_original) {
        let path = dialog.showSaveDialogSync(options_save);

        if (path) {
          try {
            fs.copyFile(path_original, path, (err) => {
              if (err) {
                /* eslint-disable no-console */
                console.log(err);
                reject(err);
              }
            });
          } catch (e) {
            console.log(err);
            reject(err);
          }
        } else {
          resolve();
        }
      } else {
        resolve();
      }
      resolve(path_original);
    } catch (err) {
      reject(err);
    }
  });
}

export function import_database(title_open, message_open, backup = false) {
  return new Promise(function (resolve, reject) {
    try {
      var pathlib = require("path");
      const isBuild = process.env.NODE_ENV === "production";

      if (process.platform === "darwin") {
        var dbPath = pathlib.join(
          // eslint-disable-next-line no-undef
          isBuild ? __dirname : __static,
          isBuild ? "../../" : "",
          "../rawrr.db"
        );
      }

      if (process.platform === "win32") {
        if (isBuild) {
          var dbPath = pathlib.join(
            process.env.PORTABLE_EXECUTABLE_DIR,
            "/rawrr.db"
          );
        } else {
          var dbPath = pathlib.join(
            // eslint-disable-next-line no-undef
            isBuild ? __dirname : __static,
            isBuild ? "../../" : "",
            "../rawrr.db"
          );
        }
      }

      if (process.platform === "linux") {
        var dbPath = pathlib.resolve(".", "rawrr.db");
      }

      var options_open = {
        title: title_open,
        message: message_open,
        filters: [{ name: "Databases", extensions: ["db"] }],
      };

      let path_original;
      if (backup) {
        if (process.platform === "darwin") {
          path_original = pathlib.join(
            // eslint-disable-next-line no-undef
            isBuild ? __dirname : __static,
            isBuild ? "../../" : "",
            "../backup.db"
          );
        }

        if (process.platform === "win32") {
          if (isBuild) {
            path_original = pathlib.join(
              process.env.PORTABLE_EXECUTABLE_DIR,
              "/backup.db"
            );
          } else {
            path_original = pathlib.join(
              // eslint-disable-next-line no-undef
              isBuild ? __dirname : __static,
              isBuild ? "../../" : "",
              "../backup.db"
            );
          }
        }

        if (process.platform === "linux") {
          path_original = pathlib.resolve(".", "backup.db");
        }
      } else {
        path_original = dialog.showOpenDialogSync(options_open);
      }
      if (path_original) {
        let path = dbPath;

        if (path) {
          if (!backup) {
            path_original = path_original[0];
          }

          try {
            fs.copyFile(path_original, path, (err) => {
              if (err) {
                /* eslint-disable no-console */
                console.log(err);
                reject(err);
              }
            });
          } catch (e) {
            console.log(err);
            reject(err);
          }
        } else {
          reject("no path");
        }
      } else {
        reject("no path selected");
      }
      resolve(path_original);
    } catch (err) {
      reject(err);
    }
  });
}

export function backup_database() {
  return new Promise(function (resolve, reject) {
    try {
      var pathlib = require("path");
      const isBuild = process.env.NODE_ENV === "production";

      if (process.platform === "darwin") {
        var dbPath = pathlib.join(
          // eslint-disable-next-line no-undef
          isBuild ? __dirname : __static,
          isBuild ? "../../" : "",
          "../rawrr.db"
        );
        var dbBackupPath = pathlib.join(
          // eslint-disable-next-line no-undef
          isBuild ? __dirname : __static,
          isBuild ? "../../" : "",
          "../backup.db"
        );
      }

      if (process.platform === "win32") {
        if (isBuild) {
          var dbPath = pathlib.join(
            process.env.PORTABLE_EXECUTABLE_DIR,
            "/rawrr.db"
          );
          var dbBackupPath = ppathlib.join(
            process.env.PORTABLE_EXECUTABLE_DIR,
            "/backup.db"
          );
        } else {
          var dbPath = pathlib.join(
            // eslint-disable-next-line no-undef
            isBuild ? __dirname : __static,
            isBuild ? "../../" : "",
            "../rawrr.db"
          );
          var dbBackupPath = pathlib.join(
            // eslint-disable-next-line no-undef
            isBuild ? __dirname : __static,
            isBuild ? "../../" : "",
            "../backup.db"
          );
        }
      }

      if (process.platform === "linux") {
        var dbPath = pathlib.resolve(".", "rawrr.db");
        var dbBackupPath = pathlib.resolve(".", "backup.db");
      }

      if (dbBackupPath) {
        let path = dbPath;

        if (path) {
          try {
            fs.copyFile(path, dbBackupPath, (err) => {
              if (err) {
                /* eslint-disable no-console */
                console.log(err);
                reject(err);
              }
            });
          } catch (e) {
            console.log(err);
            reject(err);
          }
        } else {
          resolve();
        }
      } else {
        resolve();
      }
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
