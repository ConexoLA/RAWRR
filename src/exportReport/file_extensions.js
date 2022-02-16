const fs = require("fs");
const { dialog } = require("electron");
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  TableOfContents,
  SectionType,
} from "docx";
import i18n from "../i18n.js";

export function txt(
  secciones_report,
  getMain,
  assets,
  activities,
  threats,
  vulnerabilities,
  recommentations,
  titletxt,
  message,
  locale
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
      i18n.locale = locale;

      if (path) {
        path = path + ".txt";

        var fileContents = [];

        let keys = Object.keys(secciones_report);
        fileContents.push(i18n.t("header.report") + "\n");
        keys.forEach((key) => {
          let item = secciones_report[key];
          const n = getMain[item.interest][0].tasks.length;
          let wrote = 0;
          for (var i = 0; i < n; i++) {
            wrote += 1;
            if (i == 0) {
              fileContents.push(item.title + "\n");
            }
            let description = getMain[item.interest][0].tasks[i].description;
            if (description === null) {
              description = "";
            }
            let title = getMain[item.interest][0].tasks[i].title;
            const j = i + 1;
            fileContents.push(
              "  " + j + ") " + i18n.t("global.name") + ": " + title + "\n"
            );
            fileContents.push(
              "     " + i18n.t("global.description") + ": " + description + "\n"
            );

            switch (item.name) {
              case "Assets":
                for (var k = 0; k < assets.length; k++) {
                  if (
                    assets[k].id ==
                    getMain[item.interest][0].tasks[i].identifier
                  ) {
                    if (assets[k].asset_category_name === undefined) {
                      assets[k].asset_category_name = i18n.t("global.none");
                    }
                    fileContents.push(
                      "     " +
                        i18n.t("global.asset_category") +
                        ": " +
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
                            fileContents.push(
                              "     " + i18n.t("global.assets") + ":\n"
                            );
                          }
                          fileContents.push(
                            "       - " + activities[k].asset_name[z] + "\n"
                          );
                        }
                      }
                    }

                    if (related_assets == 0) {
                      fileContents.push(
                        "     " +
                          i18n.t("global.assets") +
                          ": " +
                          i18n.t("global.none") +
                          "\n"
                      );
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
                      threats[k].threat_type_name = i18n.t("global.none");
                    }
                    fileContents.push(
                      "     " +
                        i18n.t("global.threat_type") +
                        ": " +
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
                          "     " +
                            i18n.t("global.asset") +
                            ": " +
                            threats[k].asset_name +
                            "\n"
                        );
                      }
                    }

                    if (related_asset == 0) {
                      fileContents.push(
                        "     " +
                          i18n.t("global.asset") +
                          ": " +
                          i18n.t("global.none") +
                          "\n"
                      );
                    }
                    fileContents.push(
                      "     " +
                        i18n.t("global.impact") +
                        ": " +
                        threats[k].impact +
                        "\n"
                    );
                    fileContents.push(
                      "     " +
                        i18n.t("global.likelihood") +
                        ": " +
                        threats[k].likelihood +
                        "\n"
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
                          "     " +
                            i18n.t("global.assessment_activity") +
                            ": " +
                            vulnerabilities[k].assessment_activity_name +
                            "\n"
                        );
                      }
                    }
                    if (related_activity == 0) {
                      fileContents.push(
                        "     " +
                          i18n.t("global.assessment_activity") +
                          ": " +
                          i18n.t("global.none") +
                          "\n"
                      );
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
                          "     " +
                            i18n.t("global.asset") +
                            ": " +
                            vulnerabilities[k].asset_name +
                            "\n"
                        );
                      }
                    }

                    if (related_asset == 0) {
                      fileContents.push(
                        "     " +
                          i18n.t("global.asset") +
                          ": " +
                          i18n.t("global.none") +
                          "\n"
                      );
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
                            fileContents.push(
                              "     " + i18n.t("global.threats") + ":\n"
                            );
                          }
                          fileContents.push(
                            "       - " + reportThreatName[z] + "\n"
                          );
                        }
                      }
                    }

                    if (related_threats == 0) {
                      fileContents.push(
                        "     " +
                          i18n.t("global.threats") +
                          ": " +
                          i18n.t("global.none") +
                          "\n"
                      );
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
                      "     " +
                        i18n.t("global.implementation_cost") +
                        ": " +
                        recommentations[k].implementation_cost +
                        "\n"
                    );
                    fileContents.push(
                      "     " +
                        i18n.t("global.implementation_time") +
                        ": " +
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
                              "     " + i18n.t("global.vulnerabilities") + ":\n"
                            );
                          }
                          fileContents.push(
                            "       - " + reportVulnerabilityName[z] + "\n"
                          );
                        }
                      }
                    }

                    if (related_vulnerabilities == 0) {
                      fileContents.push(
                        "     " +
                          i18n.t("global.vulnerabilities") +
                          ": " +
                          i18n.t("global.none") +
                          "\n"
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
  message,
  locale
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
      i18n.locale = locale;

      if (path) {
        path = path + ".md";

        var title = "# " + i18n.t("header.report") + "\n\n";
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
              fileContents.push("## " + item.title + "\n\n");
              toc.push(
                "- [" +
                  item.title +
                  "](#" +
                  item.title.toLowerCase().split(" ").join("-") +
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
            fileContents.push(
              "\t * **" +
                i18n.t("global.description") +
                ":** " +
                description +
                "\n"
            );

            switch (item.name) {
              case "Assets":
                for (var k = 0; k < assets.length; k++) {
                  if (
                    assets[k].id ==
                    getMain[item.interest][0].tasks[i].identifier
                  ) {
                    if (assets[k].asset_category_name === undefined) {
                      assets[k].asset_category_name = i18n.t("global.none");
                    }
                    fileContents.push(
                      "\t * **" +
                        i18n.t("global.asset_category") +
                        ":** " +
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
                            fileContents.push(
                              "\t * **" + i18n.t("global.assets") + ":**\n"
                            );
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
                      fileContents.push(
                        "\t * **" +
                          i18n.t("global.assets") +
                          ":** " +
                          i18n.t("global.none") +
                          "\n"
                      );
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
                      threats[k].threat_type_name = i18n.t("global.none");
                    }
                    fileContents.push(
                      "\t * **" +
                        i18n.t("global.threat_type") +
                        ":** " +
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
                          "\t * **" +
                            i18n.t("global.asset") +
                            ":** " +
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
                      fileContents.push(
                        "\t * **" +
                          i18n.t("global.asset") +
                          ":** " +
                          i18n.t("global.none") +
                          "\n"
                      );
                    }

                    fileContents.push(
                      "\t * **" +
                        i18n.t("global.impact") +
                        ":** " +
                        threats[k].impact +
                        "\n"
                    );
                    fileContents.push(
                      "\t * **" +
                        i18n.t("global.likelihood") +
                        ":** " +
                        threats[k].likelihood +
                        "\n"
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
                          "\t * **" +
                            i18n.t("global.assessment_activity") +
                            ":** [" +
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
                      fileContents.push(
                        "\t * **" +
                          i18n.t("global.assessment_activity") +
                          ":**  " +
                          i18n.t("global.none") +
                          "\n"
                      );
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
                          "\t * **" +
                            i18n.t("global.asset") +
                            ":** [" +
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
                      fileContents.push(
                        "\t * **" +
                          i18n.t("global.asset") +
                          ":** " +
                          i18n.t("global.none") +
                          "\n"
                      );
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
                            fileContents.push(
                              "\t * **" + i18n.t("global.threats") + ":**\n"
                            );
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
                      fileContents.push(
                        "\t * **" +
                          i18n.t("global.threats") +
                          ":** " +
                          i18n.t("global.none") +
                          "\n"
                      );
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
                      "\t * **" +
                        i18n.t("global.implementation_cost") +
                        ":** " +
                        recommentations[k].implementation_cost +
                        "\n"
                    );
                    fileContents.push(
                      "\t * **" +
                        i18n.t("global.implementation_time") +
                        ":** " +
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
                              "\t * **" +
                                i18n.t("global.vulnerabilities") +
                                ":**\n"
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
                        "\t * **" +
                          i18n.t("global.vulnerabilities") +
                          ":** " +
                          i18n.t("global.none") +
                          "\n"
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
  message,
  locale
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
      i18n.locale = locale;

      if (path) {
        path = path + ".json";

        var reportJson = {
          reportTitle: "",
          sections: [],
        };

        reportJson["reportTitle"] = i18n.t("header.report");
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
              jsonSection["sectionName"] = item.title;
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
                      assets[k].asset_category_name = i18n.t("global.none");
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
                            fileContents.push(
                              "\t * **" + i18n.t("global.assets") + ":**\n"
                            );
                            jsonEntry["relatedAssets"] = [];
                          }
                          jsonEntry["relatedAssets"].push({
                            assetName: activities[k].asset_name[z],
                          });
                        }
                      }
                    }

                    if (related_assets == 0) {
                      jsonEntry["relatedAssets"] = i18n.t("global.none");
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
                      threats[k].threat_type_name = i18n.t("global.none");
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
                      jsonEntry["relatedAsset"] = i18n.t("global.none");
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
                      jsonEntry["relatedAcivity"] = i18n.t("global.none");
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
                      jsonEntry["relatedAsset"] = i18n.t("global.none");
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
                      jsonEntry["relatedThreats"] = i18n.t("global.none");
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
                      jsonEntry["relatedVulnerabilities"] =
                        i18n.t("global.none");
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

export function docx(
  secciones_report,
  getMain,
  assets,
  activities,
  threats,
  vulnerabilities,
  recommentations,
  titletxt,
  message,
  locale
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
      i18n.locale = locale;

      if (path) {
        path = path + ".docx";

        var fileContents = [];
        var docxChildren = [];

        docxChildren.push(
          new Paragraph({
            text: i18n.t("header.report"),
            heading: HeadingLevel.TITLE,
          })
        );

        docxChildren.push(
          new TableOfContents("Summary", {
            hyperlink: true,
            headingStyleRange: "1-5",
          })
        );

        let keys = Object.keys(secciones_report);

        keys.forEach((key) => {
          let item = secciones_report[key];
          const n = getMain[item.interest][0].tasks.length;
          let wrote = 0;
          for (var i = 0; i < n; i++) {
            wrote += 1;
            if (i == 0) {
              docxChildren.push(
                new Paragraph({
                  text: item.title,
                  heading: HeadingLevel.HEADING_1,
                  pageBreakBefore: true,
                  numbering: {
                    reference: "rawrr-numbering",
                    level: 0,
                  },
                })
              );
            }
            let description = getMain[item.interest][0].tasks[i].description;
            if (description === null) {
              description = "";
            }
            let title = getMain[item.interest][0].tasks[i].title;
            const j = i + 1;
            docxChildren.push(
              new Paragraph({
                text: title,
                heading: HeadingLevel.HEADING_2,
                numbering: {
                  reference: "rawrr-numbering",
                  level: 1,
                },
              })
            );
            docxChildren.push(
              new Paragraph({
                text: i18n.t("global.description") + ": " + description,
                numbering: {
                  reference: "rawrr-numbering",
                  level: 2,
                },
              })
            );

            switch (item.name) {
              case "Assets":
                for (var k = 0; k < assets.length; k++) {
                  if (
                    assets[k].id ==
                    getMain[item.interest][0].tasks[i].identifier
                  ) {
                    if (assets[k].asset_category_name === undefined) {
                      assets[k].asset_category_name = i18n.t("global.none");
                    }
                    docxChildren.push(
                      new Paragraph({
                        text:
                          i18n.t("global.asset_category") +
                          ": " +
                          assets[k].asset_category_name,
                        numbering: {
                          reference: "rawrr-numbering",
                          level: 2,
                        },
                      })
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
                            docxChildren.push(
                              new Paragraph({
                                text: i18n.t("global.assets") + ":",
                                numbering: {
                                  reference: "rawrr-numbering",
                                  level: 2,
                                },
                              })
                            );
                          }

                          docxChildren.push(
                            new Paragraph({
                              text: activities[k].asset_name[z],
                              numbering: {
                                reference: "rawrr-numbering",
                                level: 3,
                              },
                            })
                          );
                        }
                      }
                    }

                    if (related_assets == 0) {
                      docxChildren.push(
                        new Paragraph({
                          text:
                            i18n.t("global.assets") +
                            ": " +
                            i18n.t("global.none"),
                          numbering: {
                            reference: "rawrr-numbering",
                            level: 2,
                          },
                        })
                      );
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
                      threats[k].threat_type_name = i18n.t("global.none");
                    }
                    docxChildren.push(
                      new Paragraph({
                        text:
                          i18n.t("global.threat_type") +
                          ": " +
                          threats[k].threat_type_name,
                        numbering: {
                          reference: "rawrr-numbering",
                          level: 2,
                        },
                      })
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
                        docxChildren.push(
                          new Paragraph({
                            text:
                              i18n.t("global.asset") +
                              ": " +
                              threats[k].asset_name,
                            numbering: {
                              reference: "rawrr-numbering",
                              level: 2,
                            },
                          })
                        );
                      }
                    }

                    if (related_asset == 0) {
                      docxChildren.push(
                        new Paragraph({
                          text:
                            i18n.t("global.asset") +
                            ": " +
                            i18n.t("global.none"),
                          numbering: {
                            reference: "rawrr-numbering",
                            level: 2,
                          },
                        })
                      );
                    }

                    docxChildren.push(
                      new Paragraph({
                        text:
                          i18n.t("global.impact") + ": " + threats[k].impact,
                        numbering: {
                          reference: "rawrr-numbering",
                          level: 2,
                        },
                      })
                    );

                    docxChildren.push(
                      new Paragraph({
                        text:
                          i18n.t("global.likelihood") +
                          ": " +
                          threats[k].likelihood,
                        numbering: {
                          reference: "rawrr-numbering",
                          level: 2,
                        },
                      })
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

                        docxChildren.push(
                          new Paragraph({
                            text:
                              i18n.t("global.assessment_activity") +
                              ": " +
                              vulnerabilities[k].assessment_activity_name,
                            numbering: {
                              reference: "rawrr-numbering",
                              level: 2,
                            },
                          })
                        );
                      }
                    }

                    if (related_activity == 0) {
                      docxChildren.push(
                        new Paragraph({
                          text:
                            i18n.t("global.likelihood") +
                            ": " +
                            threats[k].likelihood,
                          numbering: {
                            reference: "rawrr-numbering",
                            level: 2,
                          },
                        })
                      );
                      fileContents.push(
                        "     " +
                          i18n.t("global.assessment_activity") +
                          ": " +
                          i18n.t("global.none") +
                          "\n"
                      );
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
                        docxChildren.push(
                          new Paragraph({
                            text:
                              i18n.t("global.asset") +
                              ": " +
                              vulnerabilities[k].asset_name,
                            numbering: {
                              reference: "rawrr-numbering",
                              level: 2,
                            },
                          })
                        );
                      }
                    }

                    if (related_asset == 0) {
                      docxChildren.push(
                        new Paragraph({
                          text:
                            i18n.t("global.asset") +
                            ": " +
                            i18n.t("global.none"),
                          numbering: {
                            reference: "rawrr-numbering",
                            level: 2,
                          },
                        })
                      );
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
                            docxChildren.push(
                              new Paragraph({
                                text: i18n.t("global.threats") + ":",
                                numbering: {
                                  reference: "rawrr-numbering",
                                  level: 2,
                                },
                              })
                            );
                          }
                          docxChildren.push(
                            new Paragraph({
                              text: reportThreatName[z],
                              numbering: {
                                reference: "rawrr-numbering",
                                level: 3,
                              },
                            })
                          );
                        }
                      }
                    }

                    if (related_threats == 0) {
                      docxChildren.push(
                        new Paragraph({
                          text:
                            i18n.t("global.threats") +
                            ": " +
                            i18n.t("global.none"),
                          numbering: {
                            reference: "rawrr-numbering",
                            level: 2,
                          },
                        })
                      );
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
                    docxChildren.push(
                      new Paragraph({
                        text:
                          i18n.t("global.implementation_cost") +
                          ": " +
                          recommentations[k].implementation_cost,
                        numbering: {
                          reference: "rawrr-numbering",
                          level: 2,
                        },
                      })
                    );
                    docxChildren.push(
                      new Paragraph({
                        text:
                          i18n.t("global.implementation_time") +
                          ": " +
                          recommentations[k].implementation_time,
                        numbering: {
                          reference: "rawrr-numbering",
                          level: 2,
                        },
                      })
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
                            docxChildren.push(
                              new Paragraph({
                                text: i18n.t("global.vulnerabilities") + ":",
                                numbering: {
                                  reference: "rawrr-numbering",
                                  level: 2,
                                },
                              })
                            );
                          }
                          docxChildren.push(
                            new Paragraph({
                              text: reportVulnerabilityName[z],
                              numbering: {
                                reference: "rawrr-numbering",
                                level: 3,
                              },
                            })
                          );
                        }
                      }
                    }

                    if (related_vulnerabilities == 0) {
                      docxChildren.push(
                        new Paragraph({
                          text:
                            i18n.t("global.vulnerabilities") +
                            ": " +
                            i18n.t("global.none"),
                          numbering: {
                            reference: "rawrr-numbering",
                            level: 2,
                          },
                        })
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
          const doc = new Document({
            numbering: {
              config: [
                {
                  reference: "rawrr-numbering",
                  levels: [
                    {
                      level: 0,
                      format: "upperRoman",
                      text: "%1",
                      alignment: AlignmentType.START,
                      style: {
                        paragraph: {
                          indent: { left: 260, hanging: 260 },
                        },
                      },
                    },
                    {
                      level: 1,
                      format: "decimal",
                      text: "%2.",
                      alignment: AlignmentType.DISTRIBUTE,
                      style: {
                        paragraph: {
                          indent: { left: 520, hanging: 260 },
                        },
                      },
                    },
                    {
                      level: 2,
                      format: "lowerLetter",
                      text: "%3)",
                      alignment: AlignmentType.DISTRIBUTE,
                      style: {
                        paragraph: {
                          indent: { left: 780, hanging: 260 },
                        },
                      },
                    },
                    {
                      level: 3,
                      format: "upperLetter",
                      text: "%4)",
                      alignment: AlignmentType.START,
                      style: {
                        paragraph: {
                          indent: { left: 1050, hanging: 260 },
                        },
                      },
                    },
                  ],
                },
              ],
            },
            features: {
              updateFields: true,
            },
            sections: [
              {
                children: docxChildren,
              },
            ],
          });
          // Used to export the file into a .docx file
          Packer.toBuffer(doc).then((buffer) => {
            fs.writeFileSync(path, buffer);
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
