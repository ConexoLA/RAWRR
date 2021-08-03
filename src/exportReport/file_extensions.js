const fs = require("fs");
const { dialog } = require("electron");

export function txt(
  secciones_report,
  getMain,
  assets,
  activities,
  threats,
  vulnerabilities,
  recommentations,
  titletxt,
  message
) {
  return new Promise(function (resolve, reject) {
    try {
      var options = {
        title: titletxt,
        message: message,
        //nameFieldLabel: "Project Name:"
        // defaultPath:  directory to show (optional)
      };

      let path = dialog.showSaveDialogSync(options);

      if (path) {
        path = path + ".txt";

        var fileContents = [];

        let keys = Object.keys(secciones_report);
        fileContents.push("Report");
        fileContents.push("\n");
        keys.forEach((key) => {
          let item = secciones_report[key];
          const n = getMain[item.interest][0].tasks.length;
          let wrote = 0;
          for (var i = 0; i < n; i++) {
            wrote += 1;
            if (i == 0) {
              fileContents.push(item.name);
              fileContents.push("\n");
            }
            let description = getMain[item.interest][0].tasks[i].description;
            if (description === null) {
              description = "";
            }
            let title = getMain[item.interest][0].tasks[i].title;
            const j = i + 1;
            fileContents.push("  " + j + ") Title: " + title);
            fileContents.push("\n");
            fileContents.push("     Description: " + description);
            fileContents.push("\n");

            switch (item.name) {
              case "Assets":
                for (var k = 0; k < assets.length; k++) {
                  if (
                    assets[k].id ==
                    getMain[item.interest][0].tasks[i].identifier
                  ) {
                    if (assets[k].asset_category_name === undefined) {
                      assets[k].asset_category_name = "None";
                    }
                    fileContents.push(
                      "     Asset category name: " +
                        assets[k].asset_category_name
                    );
                    fileContents.push("\n");
                  }
                }
                break;
              case "Activities":
                for (var k = 0; k < activities.length; k++) {
                  if (
                    activities[k].id ==
                    getMain[item.interest][0].tasks[i].identifier
                  ) {
                    if (activities[k].asset_name === undefined) {
                      activities[k].asset_name = [];
                    }

                    var related_assets = 0;
                    for (var z = 0; z < activities[k].asset_name.length; z++) {
                      for (
                        var p = 0;
                        p < getMain.report_assets[0].tasks.length;
                        p++
                      ) {
                        if (
                          getMain.report_assets[0].tasks[p].title ==
                          activities[k].asset_name[z]
                        ) {
                          related_assets += 1;
                          if (related_assets == 1) {
                            fileContents.push("     Related assets:\n");
                          }
                          fileContents.push(
                            "       - " + activities[k].asset_name[z] + "\n"
                          );
                        }
                      }
                    }

                    if (related_assets == 0) {
                      fileContents.push("     Related assets: None\n");
                    }
                  }
                }
                break;
              case "Threats":
                for (var k = 0; k < threats.length; k++) {
                  if (
                    threats[k].id ==
                    getMain[item.interest][0].tasks[i].identifier
                  ) {
                    if (threats[k].threat_type_name === undefined) {
                      threats[k].threat_type_name = "None";
                    }
                    fileContents.push(
                      "     Threat type: " + threats[k].threat_type_name
                    );
                    fileContents.push("\n");
                    var related_asset = 0;
                    for (
                      var p = 0;
                      p < getMain.report_assets[0].tasks.length;
                      p++
                    ) {
                      if (
                        getMain.report_assets[0].tasks[p].title ==
                        threats[k].asset_name
                      ) {
                        related_asset = 1;
                        fileContents.push(
                          "     Asset: " + threats[k].asset_name + "\n"
                        );
                      }
                    }

                    if (related_asset == 0) {
                      fileContents.push("     Asset: None\n");
                    }
                    fileContents.push("     Impact: " + threats[k].impact);
                    fileContents.push("\n");
                    fileContents.push(
                      "     Likelihood: " + threats[k].likelihood
                    );
                    fileContents.push("\n");
                  }
                }
                break;
              case "Vulnerabilities":
                let reportAct = getMain.report_activities[0].tasks;

                for (var k = 0; k < vulnerabilities.length; k++) {
                  if (
                    vulnerabilities[k].id ==
                    getMain[item.interest][0].tasks[i].identifier
                  ) {
                    // Adding related activity
                    var related_activity = 0;
                    if (reportAct === undefined) {
                      reportAct = [];
                    }
                    for (var p = 0; p < reportAct.length; p++) {
                      if (
                        reportAct[p].title ==
                        vulnerabilities[k].assessment_activity_name
                      ) {
                        related_activity = 1;
                        fileContents.push(
                          "     Activity: " +
                            vulnerabilities[k].assessment_activity_name +
                            "\n"
                        );
                      }
                    }

                    if (related_activity == 0) {
                      fileContents.push("     Activity: None\n");
                    }

                    // Adding related asset
                    let reportAssets = getMain.report_assets[0].tasks;
                    var related_asset = 0;
                    if (reportAssets === undefined) {
                      reportAssets = [];
                    }
                    for (var p = 0; p < reportAssets.length; p++) {
                      if (
                        reportAssets[p].title == vulnerabilities[k].asset_name
                      ) {
                        related_asset = 1;
                        fileContents.push(
                          "     Asset: " + vulnerabilities[k].asset_name + "\n"
                        );
                      }
                    }

                    if (related_asset == 0) {
                      fileContents.push("     Asset: None\n");
                    }

                    // Adding related threats
                    let reportThreats = getMain.report_threats[0].tasks;
                    let reportThreatName = vulnerabilities[k].threat_name;
                    var related_threats = 0;
                    if (reportThreats === undefined) {
                      reportThreats = [];
                    }
                    if (reportThreatName === undefined) {
                      reportThreatName = [];
                    }
                    for (var z = 0; z < reportThreatName.length; z++) {
                      for (var p = 0; p < reportThreats.length; p++) {
                        if (reportThreats[p].title == reportThreatName[z]) {
                          related_threats += 1;
                          if (related_threats == 1) {
                            fileContents.push("     Related threats:\n");
                          }
                          fileContents.push(
                            "       - " + reportThreatName[z] + "\n"
                          );
                        }
                      }
                    }

                    if (related_threats == 0) {
                      fileContents.push("     Related threats: None\n");
                    }
                  }
                }
                break;
              case "Recommendations":
                for (var k = 0; k < recommentations.length; k++) {
                  if (
                    recommentations[k].id ==
                    getMain[item.interest][0].tasks[i].identifier
                  ) {
                    if (recommentations[k].implementation_cost === null) {
                      recommentations[k].implementation_cost = "";
                    }
                    if (recommentations[k].implementation_time === null) {
                      recommentations[k].implementation_time = "";
                    }
                    fileContents.push(
                      "     Implementation cost: " +
                        recommentations[k].implementation_cost
                    );
                    fileContents.push("\n");
                    fileContents.push(
                      "     Implementation time: " +
                        recommentations[k].implementation_time
                    );
                    fileContents.push("\n");

                    let reportVulnerabilityName =
                      recommentations[k].vulnerability_name;
                    let reportVulnerabilitiesTasks =
                      getMain.report_vulnerabilities[0].tasks;
                    var related_vulnerabilities = 0;
                    if (reportVulnerabilityName === undefined) {
                      reportVulnerabilityName = [];
                    }
                    if (reportVulnerabilitiesTasks === undefined) {
                      reportVulnerabilitiesTasks = [];
                    }
                    for (var z = 0; z < reportVulnerabilityName.length; z++) {
                      for (
                        var p = 0;
                        p < reportVulnerabilitiesTasks.length;
                        p++
                      ) {
                        if (
                          reportVulnerabilitiesTasks[p].title ==
                          reportVulnerabilityName[z]
                        ) {
                          related_vulnerabilities += 1;
                          if (related_vulnerabilities == 1) {
                            fileContents.push(
                              "     Related vulnerabilities:\n"
                            );
                          }
                          fileContents.push(
                            "       - " + reportVulnerabilityName[z] + "\n"
                          );
                        }
                      }
                    }

                    if (related_vulnerabilities == 0) {
                      fileContents.push("     Related vulnerabilities: None\n");
                    }
                  }
                }
                break;
              default:
            }

            if (i != n - 1) {
              fileContents.push("\n");
            }
          }
          if (wrote > 0) {
            fileContents.push("\n");
          }
        });

        try {
          fs.writeFile(path, fileContents.join(""), "utf-8", (err) => {
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

export function md(
  secciones_report,
  getMain,
  assets,
  activities,
  threats,
  vulnerabilities,
  recommentations,
  titlemd,
  message
) {
  return new Promise(function (resolve, reject) {
    try {
      var options = {
        title: titlemd,
        message: message,
        //nameFieldLabel: "Project Name:"
        // defaultPath:  directory to show (optional)
      };

      let path = dialog.showSaveDialogSync(options);

      if (path) {
        path = path + ".md";

        var title = "# Report" + "\n\n";
        var separator = "---\n";
        var fileContents = [];
        var toc = [];

        let keys = Object.keys(secciones_report);

        keys.forEach((key) => {
          let item = secciones_report[key];
          const n = getMain[item.interest][0].tasks.length;
          let wrote = 0;
          for (var i = 0; i < n; i++) {
            wrote += 1;
            if (i == 0) {
              fileContents.push("## " + item.name + "\n\n");
              toc.push(
                "- [" +
                  item.name +
                  "](#" +
                  item.name.toLowerCase().split(" ").join("-") +
                  ")\n"
              );
            }
            let description = getMain[item.interest][0].tasks[i].description;
            if (description === null) {
              description = "";
            }
            let title = getMain[item.interest][0].tasks[i].title;
            const j = i + 1;
            fileContents.push("1. #### " + title + "\n");
            toc.push(
              "  * [" +
                title +
                "](#" +
                title.toLowerCase().split(" ").join("-") +
                ")\n"
            );
            fileContents.push("\t * **Description:** " + description + "\n");

            switch (item.name) {
              case "Assets":
                for (var k = 0; k < assets.length; k++) {
                  if (
                    assets[k].id ==
                    getMain[item.interest][0].tasks[i].identifier
                  ) {
                    if (assets[k].asset_category_name === undefined) {
                      assets[k].asset_category_name = "None";
                    }
                    fileContents.push(
                      "\t * **Asset category name:** " +
                        assets[k].asset_category_name +
                        "\n"
                    );
                  }
                }
                break;
              case "Activities":
                for (var k = 0; k < activities.length; k++) {
                  if (
                    activities[k].id ==
                    getMain[item.interest][0].tasks[i].identifier
                  ) {
                    if (activities[k].asset_name === undefined) {
                      activities[k].asset_name = [];
                    }

                    var related_assets = 0;
                    for (var z = 0; z < activities[k].asset_name.length; z++) {
                      for (
                        var p = 0;
                        p < getMain.report_assets[0].tasks.length;
                        p++
                      ) {
                        if (
                          getMain.report_assets[0].tasks[p].title ==
                          activities[k].asset_name[z]
                        ) {
                          related_assets += 1;
                          if (related_assets == 1) {
                            fileContents.push("\t * **Related assets:**\n");
                          }
                          fileContents.push(
                            "\t   - [" +
                              activities[k].asset_name[z] +
                              "](#" +
                              activities[k].asset_name[z]
                                .toLowerCase()
                                .split(" ")
                                .join("-") +
                              ")\n"
                          );
                        }
                      }
                    }

                    if (related_assets == 0) {
                      fileContents.push("\t * **Related assets:** None\n");
                    }
                  }
                }
                break;
              case "Threats":
                for (var k = 0; k < threats.length; k++) {
                  if (
                    threats[k].id ==
                    getMain[item.interest][0].tasks[i].identifier
                  ) {
                    if (threats[k].threat_type_name === undefined) {
                      threats[k].threat_type_name = "None";
                    }
                    fileContents.push(
                      "\t * **Threat type:** " +
                        threats[k].threat_type_name +
                        "\n"
                    );

                    var related_asset = 0;
                    for (
                      var p = 0;
                      p < getMain.report_assets[0].tasks.length;
                      p++
                    ) {
                      if (
                        getMain.report_assets[0].tasks[p].title ==
                        threats[k].asset_name
                      ) {
                        related_asset = 1;
                        fileContents.push(
                          "\t * **Asset:** " +
                            "[" +
                            threats[k].asset_name +
                            "](#" +
                            threats[k].asset_name
                              .toLowerCase()
                              .split(" ")
                              .join("-") +
                            ")\n"
                        );
                      }
                    }

                    if (related_asset == 0) {
                      fileContents.push("\t * **Asset:** None\n");
                    }

                    fileContents.push(
                      "\t * **Impact:** " + threats[k].impact + "\n"
                    );
                    fileContents.push(
                      "\t * **Likelihood:** " + threats[k].likelihood + "\n"
                    );
                  }
                }
                break;
              case "Vulnerabilities":
                let reportAct = getMain.report_activities[0].tasks;
                for (var k = 0; k < vulnerabilities.length; k++) {
                  if (
                    vulnerabilities[k].id ==
                    getMain[item.interest][0].tasks[i].identifier
                  ) {
                    // Adding related activity
                    var related_activity = 0;
                    if (reportAct === undefined) {
                      reportAct = [];
                    }
                    for (var p = 0; p < reportAct.length; p++) {
                      if (
                        reportAct[p].title ==
                        vulnerabilities[k].assessment_activity_name
                      ) {
                        related_activity = 1;
                        fileContents.push(
                          "\t * **Activity:** [" +
                            vulnerabilities[k].assessment_activity_name +
                            "](#" +
                            vulnerabilities[k].assessment_activity_name
                              .toLowerCase()
                              .split(" ")
                              .join("-") +
                            ")\n"
                        );
                      }
                    }

                    if (related_activity == 0) {
                      fileContents.push("\t * **Activity:**  None\n");
                    }

                    // Adding related asset
                    let reportAssets = getMain.report_assets[0].tasks;
                    var related_asset = 0;
                    if (reportAssets === undefined) {
                      reportAssets = [];
                    }
                    for (var p = 0; p < reportAssets.length; p++) {
                      if (
                        reportAssets[p].title == vulnerabilities[k].asset_name
                      ) {
                        related_asset = 1;
                        fileContents.push(
                          "\t * **Asset:** [" +
                            vulnerabilities[k].asset_name +
                            "](#" +
                            vulnerabilities[k].asset_name
                              .toLowerCase()
                              .split(" ")
                              .join("-") +
                            ")\n"
                        );
                      }
                    }

                    if (related_asset == 0) {
                      fileContents.push("\t * **Asset:** None\n");
                    }

                    let reportThreats = getMain.report_threats[0].tasks;
                    let reportThreatName = vulnerabilities[k].threat_name;
                    var related_threats = 0;

                    if (reportThreats === undefined) {
                      reportThreats = [];
                    }
                    if (reportThreatName === undefined) {
                      reportThreatName = [];
                    }
                    for (var z = 0; z < reportThreatName.length; z++) {
                      for (var p = 0; p < reportThreats.length; p++) {
                        if (reportThreats[p].title == reportThreatName[z]) {
                          related_threats += 1;
                          if (related_threats == 1) {
                            fileContents.push("\t * **Related threats:**\n");
                          }
                          fileContents.push(
                            "\t   - [" +
                              reportThreatName[z] +
                              "](#" +
                              reportThreatName[z]
                                .toLowerCase()
                                .split(" ")
                                .join("-") +
                              ")\n"
                          );
                        }
                      }
                    }

                    if (related_threats == 0) {
                      fileContents.push("\t * **Related threats:** None\n");
                    }
                  }
                }
                break;
              case "Recommendations":
                for (var k = 0; k < recommentations.length; k++) {
                  if (
                    recommentations[k].id ==
                    getMain[item.interest][0].tasks[i].identifier
                  ) {
                    if (recommentations[k].implementation_cost === null) {
                      recommentations[k].implementation_cost = "";
                    }
                    if (recommentations[k].implementation_time === null) {
                      recommentations[k].implementation_time = "";
                    }
                    fileContents.push(
                      "\t * **Implementation cost:** " +
                        recommentations[k].implementation_cost +
                        "\n"
                    );
                    fileContents.push(
                      "\t * **Implementation time:** " +
                        recommentations[k].implementation_time +
                        "\n"
                    );

                    let reportVulnerabilityName =
                      recommentations[k].vulnerability_name;
                    let reportVulnerabilitiesTasks =
                      getMain.report_vulnerabilities[0].tasks;
                    var related_vulnerabilities = 0;

                    if (reportVulnerabilityName === undefined) {
                      reportVulnerabilityName = [];
                    }
                    if (reportVulnerabilitiesTasks === undefined) {
                      reportVulnerabilitiesTasks = [];
                    }
                    for (var z = 0; z < reportVulnerabilityName.length; z++) {
                      for (
                        var p = 0;
                        p < reportVulnerabilitiesTasks.length;
                        p++
                      ) {
                        if (
                          reportVulnerabilitiesTasks[p].title ==
                          reportVulnerabilityName[z]
                        ) {
                          related_vulnerabilities += 1;
                          if (related_vulnerabilities == 1) {
                            fileContents.push(
                              "\t * **Related vulnerabilities:**\n"
                            );
                          }
                          fileContents.push(
                            "\t   - [" +
                              reportVulnerabilityName[z] +
                              "](#" +
                              reportVulnerabilityName[z]
                                .toLowerCase()
                                .split(" ")
                                .join("-") +
                              ")\n"
                          );
                        }
                      }
                    }

                    if (related_vulnerabilities == 0) {
                      fileContents.push(
                        "\t * **Related vulnerabilities:** None\n"
                      );
                    }
                  }
                }
                break;
              default:
            }

            if (i != n - 1) {
              fileContents.push("\n");
            }
          }
          if (wrote > 0) {
            fileContents.push("\n");
          }
        });

        try {
          fs.writeFile(
            path,
            title.concat(
              toc.join("").concat(separator.concat(fileContents.join("")))
            ),
            "utf-8",
            (err) => {
              if (err) {
                /* eslint-disable no-console */
                console.log(err);
                reject(err);
              }
            }
          );
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

export function json(
  secciones_report,
  getMain,
  assets,
  activities,
  threats,
  vulnerabilities,
  recommentations,
  titlejson,
  message
) {
  return new Promise(function (resolve, reject) {
    try {
      var options = {
        title: titlejson,
        message: message,
        //nameFieldLabel: "Project Name:"
        // defaultPath:  directory to show (optional)
      };

      let path = dialog.showSaveDialogSync(options);

      if (path) {
        path = path + ".json";

        var reportJson = {
          reportTitle: "",
          sections: [],
        };

        reportJson["reportTitle"] = "Report";
        var fileContents = [];
        var toc = [];

        let keys = Object.keys(secciones_report);

        var sectionsFlag = 0;

        keys.forEach((key) => {
          let item = secciones_report[key];
          const n = getMain[item.interest][0].tasks.length;
          let wrote = 0;

          var jsonSection = {
            sectionName: "",
            entries: [],
          };

          for (var i = 0; i < n; i++) {
            var jsonEntry = {};
            wrote += 1;
            sectionsFlag += 1;
            if (sectionsFlag == 1) {
              reportJson["sections"] = [];
            }
            if (i == 0) {
              jsonSection["sectionName"] = item.name;
            }
            let description = getMain[item.interest][0].tasks[i].description;
            if (description === null) {
              description = "";
            }
            jsonEntry["description"] = description;
            jsonEntry["title"] = getMain[item.interest][0].tasks[i].title;
            const j = i + 1;

            switch (item.name) {
              case "Assets":
                for (var k = 0; k < assets.length; k++) {
                  if (
                    assets[k].id ==
                    getMain[item.interest][0].tasks[i].identifier
                  ) {
                    if (assets[k].asset_category_name === undefined) {
                      assets[k].asset_category_name = "None";
                    }
                    jsonEntry["assetCategoryName"] =
                      assets[k].asset_category_name;
                  }
                }
                break;
              case "Activities":
                for (var k = 0; k < activities.length; k++) {
                  if (
                    activities[k].id ==
                    getMain[item.interest][0].tasks[i].identifier
                  ) {
                    var related_assets = 0;
                    if (activities[k].asset_name === undefined) {
                      activities[k].asset_name = [];
                    }
                    for (var z = 0; z < activities[k].asset_name.length; z++) {
                      for (
                        var p = 0;
                        p < getMain.report_assets[0].tasks.length;
                        p++
                      ) {
                        if (
                          getMain.report_assets[0].tasks[p].title ==
                          activities[k].asset_name[z]
                        ) {
                          related_assets += 1;
                          if (related_assets == 1) {
                            fileContents.push("\t * **Related assets:**\n");
                            jsonEntry["relatedAssets"] = [];
                          }
                          jsonEntry["relatedAssets"].push({
                            assetName: activities[k].asset_name[z],
                          });
                        }
                      }
                    }

                    if (related_assets == 0) {
                      jsonEntry["relatedAssets"] = "None";
                    }
                  }
                }
                break;
              case "Threats":
                for (var k = 0; k < threats.length; k++) {
                  if (
                    threats[k].id ==
                    getMain[item.interest][0].tasks[i].identifier
                  ) {
                    if (threats[k].threat_type_name === undefined) {
                      threats[k].threat_type_name = "None";
                    }
                    jsonEntry["threadType"] = threats[k].threat_type_name;

                    var related_asset = 0;
                    for (
                      var p = 0;
                      p < getMain.report_assets[0].tasks.length;
                      p++
                    ) {
                      if (
                        getMain.report_assets[0].tasks[p].title ==
                        threats[k].asset_name
                      ) {
                        related_asset = 1;
                        jsonEntry["relatedAsset"] = threats[k].asset_name;
                      }
                    }

                    if (related_asset == 0) {
                      jsonEntry["relatedAsset"] = "None";
                    }

                    jsonEntry["impact"] = threats[k].impact;
                    jsonEntry["likelihood"] = threats[k].likelihood;
                  }
                }
                break;
              case "Vulnerabilities":
                let reportAct = getMain.report_activities[0].tasks;
                for (var k = 0; k < vulnerabilities.length; k++) {
                  if (
                    vulnerabilities[k].id ==
                    getMain[item.interest][0].tasks[i].identifier
                  ) {
                    // Adding related activity
                    var related_activity = 0;
                    if (reportAct === undefined) {
                      reportAct = [];
                    }
                    for (var p = 0; p < reportAct.length; p++) {
                      if (
                        reportAct[p].title ==
                        vulnerabilities[k].assessment_activity_name
                      ) {
                        related_activity = 1;
                        jsonEntry["relatedAcivity"] =
                          vulnerabilities[k].assessment_activity_name;
                      }
                    }

                    if (related_activity == 0) {
                      jsonEntry["relatedAcivity"] = "None";
                    }

                    // Adding related asset
                    let reportAssets = getMain.report_assets[0].tasks;
                    var related_asset = 0;
                    if (reportAssets === undefined) {
                      reportAssets = [];
                    }
                    for (var p = 0; p < reportAssets.length; p++) {
                      if (
                        reportAssets[p].title == vulnerabilities[k].asset_name
                      ) {
                        related_asset = 1;
                        jsonEntry["relatedAsset"] =
                          vulnerabilities[k].asset_name;
                      }
                    }

                    if (related_asset == 0) {
                      jsonEntry["relatedAsset"] = "None";
                    }

                    let reportThreats = getMain.report_threats[0].tasks;
                    let reportThreatName = vulnerabilities[k].threat_name;
                    var related_threats = 0;

                    if (reportThreats === undefined) {
                      reportThreats = [];
                    }
                    if (reportThreatName === undefined) {
                      reportThreatName = [];
                    }
                    for (var z = 0; z < reportThreatName.length; z++) {
                      for (var p = 0; p < reportThreats.length; p++) {
                        if (reportThreats[p].title == reportThreatName[z]) {
                          related_threats += 1;
                          if (related_threats == 1) {
                            jsonEntry["relatedThreats"] = [];
                          }
                          jsonEntry["relatedThreats"].push({
                            threatName: reportThreatName[z],
                          });
                        }
                      }
                    }

                    if (related_threats == 0) {
                      jsonEntry["relatedThreats"] = "None";
                    }
                  }
                }
                break;
              case "Recommendations":
                for (var k = 0; k < recommentations.length; k++) {
                  if (
                    recommentations[k].id ==
                    getMain[item.interest][0].tasks[i].identifier
                  ) {
                    if (recommentations[k].implementation_cost === null) {
                      recommentations[k].implementation_cost = "";
                    }
                    if (recommentations[k].implementation_time === null) {
                      recommentations[k].implementation_time = "";
                    }
                    jsonEntry["implementationCost"] =
                      recommentations[k].implementation_cost;
                    jsonEntry["implementationTime"] =
                      recommentations[k].implementation_time;

                    let reportVulnerabilityName =
                      recommentations[k].vulnerability_name;
                    let reportVulnerabilitiesTasks =
                      getMain.report_vulnerabilities[0].tasks;
                    var related_vulnerabilities = 0;

                    if (reportVulnerabilityName === undefined) {
                      reportVulnerabilityName = [];
                    }
                    if (reportVulnerabilitiesTasks === undefined) {
                      reportVulnerabilitiesTasks = [];
                    }
                    for (var z = 0; z < reportVulnerabilityName.length; z++) {
                      for (
                        var p = 0;
                        p < reportVulnerabilitiesTasks.length;
                        p++
                      ) {
                        if (
                          reportVulnerabilitiesTasks[p].title ==
                          reportVulnerabilityName[z]
                        ) {
                          related_vulnerabilities += 1;
                          if (related_vulnerabilities == 1) {
                            jsonEntry["relatedVulnerabilities"] = [];
                          }
                          jsonEntry["relatedVulnerabilities"].push({
                            vulnerabilityName: reportVulnerabilityName[z],
                          });
                        }
                      }
                    }

                    if (related_vulnerabilities == 0) {
                      jsonEntry["relatedVulnerabilities"] = "None";
                    }
                  }
                }
                break;
              default:
            }

            jsonSection["entries"].push(jsonEntry);
          }
          reportJson["sections"].push(jsonSection);
        });

        const data = JSON.stringify(reportJson);

        try {
          fs.writeFile(path, data, "utf-8", (err) => {
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
