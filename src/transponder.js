/* eslint-disable no-console */
import { ipcMain } from "electron";

import * as config from "./db/00_config";
import * as init from "./db/00_initdb";
import * as asset_categories from "./db/assets/01_asset_categories";
import * as assets from "./db/assets/02_assets";
import * as assessment_activities from "./db/assessment activities/03_assessment_activities";
import * as assessment_activity_asset_associations from "./db/assessment activities/04_assessment_activity_asset_associations";
import * as threat_types from "./db/threats/05_threat_types";
import * as threats from "./db/threats/06_threats";
import * as threats_audits from "./db/threats/07_threats_audits";
import * as vulnerabilities from "./db/vulnerabilities/08_vulnerabilities";
import * as vulnerability_threat_associations from "./db/vulnerabilities/09_vulnerability_threat_associations";
import * as recommendations from "./db/recommendations/10_recommendations";
import * as recommendation_vulnerability_associations from "./db/recommendations/11_recommendation_vulnerability_associations";
import * as export_report from "./exportReport/file_extensions";
import * as export_image from "./exportImage/file_extensions";
import * as database_management from "./db/fs_management";

export function setIPCMainListeners() {
  //data is sent as arg from a synchronous call made in whichever file is contained in the views folder.
  //PARAMETERS:
  //  arg is an array with the following structure: ["table_name", {row}].
  //    table_name is the keyword identifying a database table
  //    row is an object containing all necesary atributes to insert said row into a table
  //      there's aditional information regarding these atributes in the db folder for each table
  //EXPECTED OUTPUT:
  //  Returns an array containing the inserted row or an empty array.
  ipcMain.on("insert", (event, arg) => {
    let arr = [];
    switch (arg[0]) {
      case "asset_categories":
        try {
          arr = [arg[1].name, arg[1].description];
          asset_categories.insert(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "assets":
        try {
          arr = [arg[1].name, arg[1].asset_category_id, arg[1].description];
          assets.insert(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "assessment_activities":
        try {
          arr = [arg[1].name, arg[1].description];
          assessment_activities.insert(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "assessment_activity_asset_associations":
        try {
          arr = [arg[1].assessment_activity_id, arg[1].asset_id];
          assessment_activity_asset_associations.insert(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "threat_types":
        try {
          arr = [arg[1].name, arg[1].description, arg[1].color];
          threat_types.insert(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "threats":
        try {
          arr = [
            arg[1].threat_type_id,
            arg[1].name,
            arg[1].description,
            arg[1].asset_id,
            arg[1].impact,
            arg[1].likelihood,
          ];
          threats.insert(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "threats_audits":
        try {
          console.log(arg)
          arr = [
            arg[1].threat_id,
            arg[1].changed_fields
            //arg[1].description,
          ];
          threats_audits.insert(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;        
      case "vulnerabilities":
        try {
          arr = [
            arg[1].name,
            arg[1].description,
            arg[1].assessment_activity_id,
            arg[1].asset_id,
          ];
          vulnerabilities.insert(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "vulnerability_threat_associations":
        try {
          arr = [arg[1].vulnerability_id, arg[1].threat_id];
          vulnerability_threat_associations.insert(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "recommendations":
        try {
          arr = [
            arg[1].name,
            arg[1].description,
            arg[1].implementation_cost,
            arg[1].implementation_time,
          ];
          recommendations.insert(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "recommendation_vulnerability_associations":
        try {
          arr = [arg[1].recommendation_id, arg[1].vulnerability_id];
          recommendation_vulnerability_associations.insert(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      default:
        console.log(arg[0], " does not have a valid insert method.");
        event.returnValue = [];
    }
  });

  //data is sent as arg from a synchronous call made in whichever file is contained in the views folder.
  //PARAMETERS:
  //  arg is an array with the following structure: ["table_name"].
  //    table_name is the keyword identifying a database table
  //EXPECTED OUTPUT:
  //  Returns an array containing all rows inside a table,
  //          a SQLite error code,
  //          or an empty array if the table does not exist.
  ipcMain.on("queryAll", (event, arg) => {
    switch (arg[0]) {
      case "config":
        try {
          config.queryAll().then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = err.errno;
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "asset_categories":
        try {
          asset_categories.queryAll().then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = err.errno;
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "assets":
        try {
          assets.queryAll().then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = err.errno;
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "assessment_activities":
        try {
          assessment_activities.queryAll().then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = err.errno;
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "assessment_activity_asset_associations":
        try {
          assessment_activity_asset_associations.queryAll().then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = err.errno;
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "threat_types":
        try {
          threat_types.queryAll().then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = err.errno;
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "threats":
        try {
          threats.queryAll().then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = err.errno;
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "threats_audits":
        try {
          threats_audits.queryAll().then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = err.errno;
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;        
      case "vulnerabilities":
        try {
          vulnerabilities.queryAll().then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = err.errno;
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "vulnerability_threat_associations":
        try {
          vulnerability_threat_associations.queryAll().then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = err.errno;
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "recommendations":
        try {
          recommendations.queryAll().then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = err.errno;
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "recommendation_vulnerability_associations":
        try {
          recommendation_vulnerability_associations.queryAll().then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = err.errno;
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      default:
        console.log(arg[0], " does not have a valid query all method.");
        event.returnValue = [];
    }
  });

  //data is sent as arg from a synchronous call made in whichever file is contained in the views folder.
  //PARAMETERS:
  //  arg is an array with the following structure: ["table_name", "data", "id"].
  //    table_name is the keyword identifying a database table
  //    row is an array containing all atributes to update a row from a table
  //    id is the primary key of the row to update
  //      there's aditional information regarding these atributes in the db folder for each table
  //EXPECTED OUTPUT:
  //  Returns an array containing row or an empty one.
  ipcMain.on("update", (event, arg) => {
    let arr = [];
    switch (arg[0]) {
      case "config":
        try {
          arr = [arg[1][0], arg[1][1]];
          config.update(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "asset_categories":
        try {
          arr = [arg[1].name, arg[1].description, arg[1].id];
          asset_categories.update(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "assets":
        try {
          arr = [
            arg[1].name,
            arg[1].asset_category_id,
            arg[1].description,
            arg[1].id,
          ];
          assets.update(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "assessment_activities":
        try {
          arr = [arg[1].name, arg[1].description, arg[1].id];
          assessment_activities.update(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "threat_types":
        try {
          arr = [arg[1].name, arg[1].description, arg[1].color, arg[1].id];
          threat_types.update(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "threats":
        try {
          arr = [
            arg[1].threat_type_id,
            arg[1].name,
            arg[1].description,
            arg[1].asset_id,
            arg[1].impact,
            arg[1].likelihood,
            arg[1].id,
          ];
          threats.update(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "vulnerabilities":
        try {
          arr = [
            arg[1].name,
            arg[1].description,
            arg[1].assessment_activity_id,
            arg[1].asset_id,
            arg[1].id,
          ];
          vulnerabilities.update(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "recommendations":
        try {
          arr = [
            arg[1].name,
            arg[1].description,
            arg[1].implementation_cost,
            arg[1].implementation_time,
            arg[1].id,
          ];
          recommendations.update(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      default:
        console.log(arg[0], " does not have a valid update method.");
        event.returnValue = [];
    }
  });

  //data is sent as arg from a synchronous call made in whichever file is contained in the views folder.
  //PARAMETERS:
  //  arg is an array with the following structure: ["table_name", {row}].
  //    table_name is the keyword identifying a database table
  //    row is an object containing all necesary atributes to remove said row from a table
  //      there's aditional information regarding these atributes in the db folder for each table
  //EXPECTED OUTPUT:
  //  Returns an array containing row or an empty one.
  ipcMain.on("remove", (event, arg) => {
    let arr = [];
    switch (arg[0]) {
      case "asset_categories":
        try {
          arr = [arg[1].id];
          asset_categories.remove(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "assets":
        try {
          arr = [arg[1].id];
          assets.remove(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "assessment_activities":
        try {
          arr = [arg[1].id];
          assessment_activities.remove(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "assessment_activity_asset_associations":
        try {
          arr = [arg[1].assessment_activity_id, arg[1].asset_id];
          assessment_activity_asset_associations.remove(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "threat_types":
        try {
          arr = [arg[1].id];
          threat_types.remove(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "threats":
        try {
          arr = [arg[1].id];
          threats.remove(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "vulnerabilities":
        try {
          arr = [arg[1].id];
          vulnerabilities.remove(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "vulnerability_threat_associations":
        try {
          arr = [arg[1].vulnerability_id, arg[1].threat_id];
          vulnerability_threat_associations.remove(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "recommendations":
        try {
          arr = [arg[1].id];
          recommendations.remove(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "recommendation_vulnerability_associations":
        try {
          arr = [arg[1].recommendation_id, arg[1].vulnerability_id];
          recommendation_vulnerability_associations.remove(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      default:
        console.log(arg[0], " does not have a valid remove method.");
        event.returnValue = [];
    }
  });

  //data is sent as arg from a synchronous call made in whichever file is contained in the views folder.
  //PARAMETERS:
  //  arg is an array with the following structure: ["table_name"].
  //    table_name is the keyword identifying a database table
  //EXPECTED OUTPUT:
  //  Returns an object containing all rows inside a table,
  //          a SQLite error code,
  //          or an empty array if the table does not exist.
  ipcMain.on("getOne", (event, arg) => {
    let arr = [];
    switch (arg[0]) {
      case "asset_categories":
        break;
      case "assets":
        try {
          arr = arg[1].asset_id;
          assets.getOne(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "assessment_activities":
        break;
      case "assessment_activity_asset_associations":
        break;
      case "threat_types":
        try {
          arr = arg[1].threat_type_id;
          threat_types.getOne(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "threats":
        try {
          arr = arg[1].id;
          threats.getOne(arr).then(
            function (data) {
              //resolve
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "vulnerabilities":
        break;
      case "vulnerability_threat_associations":
        break;
      case "recommendations":
        break;
      case "recommendation_vulnerability_associations":
        break;
      default:
        console.log(arg[0], " does not have a valid remove method.");
        event.returnValue = [];
    }
  });

  //data is sent as arg from a synchronous call made in whichever file is contained in the views folder.
  //PARAMETERS:
  //  arg is an array with the following structure: ["table_name"].
  //    table_name is the keyword identifying a database table
  //EXPECTED OUTPUT:
  //  Returns an array containing all rows inside a table,
  //          a SQLite error code,
  //          or an empty array if the table does not exist.
  ipcMain.on("allAudits", (event, arg) => {
    let arr = [];
    switch (arg[0]) {
      case "asset_categories":
        break;
      case "assets":
        break;
      case "assessment_activities":
        break;
      case "assessment_activity_asset_associations":
        break;
      case "threat_types":
        break;
      case "threats":
        break;
      case "threats_audits":
        try {
          arr = arg[1].id;
          threats_audits.allAudits(arr).then(
            function (data) {
              //resolve
              console.log(data)
              event.returnValue = data;
            },
            function (err) {
              //reject
              console.log(err);
              event.returnValue = [];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = [];
        }
        break;
      case "vulnerabilities":
        break;
      case "vulnerability_threat_associations":
        break;
      case "recommendations":
        break;
      case "recommendation_vulnerability_associations":
        break;
      default:
        console.log(arg[0], " does not have a valid remove method.");
        event.returnValue = [];
    }
  });
  
  ipcMain.on("import", (event, arg) => {
    console.log(arg[0]);
    switch (arg[0]) {
      case "db":
        try {
          database_management
            .import_database(
              arg[1], // Title
              arg[2], // Message
              arg[3] // backup file or not
            )
            .then(
              function (data) {
                event.returnValue = ["resolve", data];
              },
              function (err) {
                console.log(err);
                if (err == "no path selected") {
                  event.returnValue = ["ignore", err];
                } else {
                  event.returnValue = ["reject", err];
                }
              }
            );
        } catch (error) {
          console.log(error);
          event.returnValue = ["error", error];
        }
        break;
      default:
        console.log(arg[0], " does not have a valid import method.");
        event.returnValue = ["error", ""];
    }
  });

  ipcMain.on("export", (event, arg) => {
    console.log(arg[0]);
    switch (arg[0]) {
      case "db":
        try {
          database_management.export_database(arg[1], arg[2]).then(
            function (data) {
              event.returnValue = ["resolve", data];
            },
            function (err) {
              console.log(err);
              event.returnValue = ["reject", err];
            }
          );
        } catch (error) {
          console.log(error);
          event.returnValue = ["error", error];
        }
        break;
      case "txt":
        try {
          export_report
            .txt(
              arg[1],
              arg[2],
              arg[3],
              arg[4],
              arg[5],
              arg[6],
              arg[7],
              arg[8],
              arg[9],
              arg[10],
              arg[11]
            )
            .then(
              function (data) {
                event.returnValue = ["resolve", data];
              },
              function (err) {
                console.log(err);
                event.returnValue = ["reject", err];
              }
            );
        } catch (error) {
          console.log(error);
          event.returnValue = ["error", error];
        }
        break;
      case "md":
        try {
          export_report
            .md(
              arg[1],
              arg[2],
              arg[3],
              arg[4],
              arg[5],
              arg[6],
              arg[7],
              arg[8],
              arg[9],
              arg[10],
              arg[11]
            )
            .then(
              function (data) {
                event.returnValue = ["resolve", data];
              },
              function (err) {
                console.log(err);
                event.returnValue = ["reject", err];
              }
            );
        } catch (error) {
          console.log(error);
          event.returnValue = ["error", error];
        }
        break;
      case "json":
        try {
          export_report
            .json(
              arg[1],
              arg[2],
              arg[3],
              arg[4],
              arg[5],
              arg[6],
              arg[7],
              arg[8],
              arg[9],
              arg[10],
              arg[11]
            )
            .then(
              function (data) {
                event.returnValue = ["resolve", data];
              },
              function (err) {
                console.log(err);
                event.returnValue = ["reject", err];
              }
            );
        } catch (error) {
          console.log(error);
          event.returnValue = ["error", error];
        }
        break;
      case "docx":
        try {
          export_report
            .docx(
              arg[1],
              arg[2],
              arg[3],
              arg[4],
              arg[5],
              arg[6],
              arg[7],
              arg[8],
              arg[9],
              arg[10],
              arg[11]
            )
            .then(
              function (data) {
                event.returnValue = ["resolve", data];
              },
              function (err) {
                console.log(err);
                event.returnValue = ["reject", err];
              }
            );
        } catch (error) {
          console.log(error);
          event.returnValue = ["error", error];
        }
        break;
      case "png":
          try {
            export_image.png(arg[1], arg[2], arg[3], arg[4]).then(
                function (data) {
                  event.returnValue = ["resolve", data];
                },
                function (err) {
                  console.log(err);
                  event.returnValue = ["reject", err];
                }
              );
          } catch (error) {
            console.log(error);
            event.returnValue = ["error", error];
          }
          break;
      default:
        console.log(arg[0], " does not have a valid export method.");
        event.returnValue = ["error", ""];
    }
  });

  ipcMain.on("backupDatabase", (event, arg) => {
    try {
      database_management.backup_database().then(
        function (data) {
          event.returnValue = ["resolve", data];
        },
        function (err) {
          console.log(err);
          event.returnValue = ["reject", err];
        }
      );
    } catch (error) {
      console.log(error);
      event.returnValue = ["error", error];
    }
  });

  ipcMain.on("loadTestValues", (event, arg) => {
    try {
      init.loadTestValues().then(
        function (data) {
          event.returnValue = ["resolve", data];
        },
        function (err) {
          console.log(err);
          event.returnValue = ["reject", err];
        }
      );
    } catch (error) {
      console.log(error);
      event.returnValue = ["error", error];
    }
  });

  ipcMain.on("deleteDatabase", (event, arg) => {
    try {
      init.deleteDatabase().then(
        function (data) {
          event.returnValue = ["resolve", data];
        },
        function (err) {
          console.log(err);
          event.returnValue = ["reject", err];
        }
      );
    } catch (error) {
      console.log(error);
      event.returnValue = ["error", error];
    }
  });
}
