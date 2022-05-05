const fs = require("fs");
const { dialog } = require("electron");

import i18n from "../i18n.js";

export function png(imageBase64, titletxt, message, locale) {
  return new Promise(function (resolve, reject) {
    try {
      var options = {
        title: titletxt,
        message: message,
        //nameFieldLabel: "Project Name:"
        // defaultPath:  directory to show (optional)
      };

      let path = dialog.showSaveDialogSync(options);
      i18n.locale = locale;

      if (path) {
        path = path + ".png";

        try {
          fs.writeFile(path, imageBase64, "base64", (err) => {
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
      resolve(path);
    } catch (err) {
      reject(err);
    }
  });
}
