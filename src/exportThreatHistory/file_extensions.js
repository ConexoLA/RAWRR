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
  SectionType
} from "docx";
import i18n from "../i18n.js";

export function md(
  secciones_report,
  getMain,
  threats,
  threat_history,
  titlemd,
  message,
  locale
) {
  return new Promise(function(resolve, reject) {
    try {
      var options = {
        title: titlemd,
        message: message
        //nameFieldLabel: "Project Name:"
        // defaultPath:  directory to show (optional)
      };

      let path = dialog.showSaveDialogSync(options);
      i18n.locale = locale;

      if (path) {
        path = path + ".md";

        let keys = Object.keys(secciones_report);
        console.log(keys);

        var title = "# " + i18n.t("header.threats_history") + "\n\n";
        var separator = "---\n";
        var fileContents = [];
        var toc = [];

        keys.forEach(key => {
          let item = secciones_report[key];
          if (item.name == "Threats") {
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
                    item.title
                      .toLowerCase()
                      .split(" ")
                      .join("-") +
                    ")\n"
                );
              }
              let description = getMain[item.interest][0].tasks[i].description;
              if (description === null) {
                description = "";
              }
              let title = getMain[item.interest][0].tasks[i].title;
              fileContents.push("1. #### " + title + "\n");
              toc.push(
                "  * [" +
                  title +
                  "](#" +
                  title
                    .toLowerCase()
                    .split(" ")
                    .join("-") +
                  ")\n"
              );

              fileContents.push(
                "\t * **" +
                  i18n.t("threats.current_threats_values") +
                  ":** " +
                  "\n"
              );

              // Adding Identifier of the threat
              fileContents.push(
                "\t\t * **" +
                  i18n.t("threats.threat_history.identifier") +
                  ":** " +
                  getMain[item.interest][0].tasks[i].identifier +
                  "\n"
              );

              // Adding description of the threat
              fileContents.push(
                "\t\t * **" +
                  i18n.t("global.description") +
                  ":** " +
                  description +
                  "\n"
              );

              // Getting related asset, impact and likelihood
              switch (item.name) {
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
                        "\t\t * **" +
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
                            "\t\t * **" +
                              i18n.t("global.asset") +
                              ":** " +
                              threats[k].asset_name +
                              "\n"
                          );
                        }
                      }

                      if (related_asset == 0) {
                        fileContents.push(
                          "\t\t * **" +
                            i18n.t("global.asset") +
                            ":** " +
                            i18n.t("global.none") +
                            "\n"
                        );
                      }

                      fileContents.push(
                        "\t\t * **" +
                          i18n.t("global.impact") +
                          ":** " +
                          threats[k].impact +
                          "\n"
                      );
                      fileContents.push(
                        "\t\t * **" +
                          i18n.t("global.likelihood") +
                          ":** " +
                          threats[k].likelihood +
                          "\n"
                      );
                    }
                  }
                  break;
                default:
              }

              // Adding audits

              let specific_changes = threat_history.filter(
                threat =>
                  threat.threat_id ==
                  getMain[item.interest][0].tasks[i].identifier
              );

              const n_changes = specific_changes.length;

              if (n_changes > 0) {
                fileContents.push(
                  "\t * **" + i18n.t("threats.threat_history.name") + "** \n"
                );
                for (var k = 0; k < n_changes; k++) {
                  let identifier_change = n_changes - k;
                  fileContents.push(
                    "\t\t * **" +
                      i18n.t("threats.threat_history.change_number") +
                      identifier_change.toString() +
                      "**" +
                      "\n"
                  );

                  fileContents.push(
                    "\t\t\t 1. **" +
                      i18n.t("threats.threat_history.creation_date") +
                      "** " +
                      specific_changes[k].created +
                      "\n"
                  );

                  if (specific_changes[k].observation !== null) {
                    fileContents.push(
                      "\t\t\t 1. **" +
                        i18n.t("threats.threat_history.observation") +
                        "** " +
                        specific_changes[k].observation +
                        "\n"
                    );
                  }

                  // Name
                  if (specific_changes[k].name_old !== undefined) {
                    fileContents.push(
                      "\t\t\t 1. **" +
                        i18n.t("threats.threat_history.name_change") +
                        "**" +
                        "\n"
                    );
                    fileContents.push(
                      "\t\t\t\t - **" +
                        i18n.t("threats.threat_history.new") +
                        "** " +
                        specific_changes[k].name_new +
                        "\n"
                    );
                    fileContents.push(
                      "\t\t\t\t - **" +
                        i18n.t("threats.threat_history.old") +
                        "** ~~" +
                        specific_changes[k].name_old +
                        "~~\n"
                    );
                  }

                  // Description
                  if (specific_changes[k].description_old !== undefined) {
                    fileContents.push(
                      "\t\t\t 1. **" +
                        i18n.t("threats.threat_history.description") +
                        "**" +
                        "\n"
                    );
                    fileContents.push(
                      "\t\t\t\t - **" +
                        i18n.t("threats.threat_history.new") +
                        "** " +
                        specific_changes[k].description_new +
                        "\n"
                    );
                    fileContents.push(
                      "\t\t\t\t - **" +
                        i18n.t("threats.threat_history.old") +
                        "** ~~" +
                        specific_changes[k].description_old +
                        "~~\n"
                    );
                  }

                  // Impact
                  if (specific_changes[k].impact_old !== undefined) {
                    fileContents.push(
                      "\t\t\t 1. **" +
                        i18n.t("threats.threat_history.impact") +
                        "**" +
                        "\n"
                    );
                    fileContents.push(
                      "\t\t\t\t - **" +
                        i18n.t("threats.threat_history.new") +
                        "** " +
                        specific_changes[k].impact_new +
                        "\n"
                    );
                    fileContents.push(
                      "\t\t\t\t - **" +
                        i18n.t("threats.threat_history.old") +
                        "** ~~" +
                        specific_changes[k].impact_old +
                        "~~\n"
                    );
                  }

                  // Likelihood
                  if (specific_changes[k].likelihood_old !== undefined) {
                    fileContents.push(
                      "\t\t\t 1. **" +
                        i18n.t("threats.threat_history.likelihood") +
                        "**" +
                        "\n"
                    );
                    fileContents.push(
                      "\t\t\t\t - **" +
                        i18n.t("threats.threat_history.new") +
                        "** " +
                        specific_changes[k].likelihood_new +
                        "\n"
                    );
                    fileContents.push(
                      "\t\t\t\t - **" +
                        i18n.t("threats.threat_history.old") +
                        "** ~~" +
                        specific_changes[k].likelihood_old +
                        "~~\n"
                    );
                  }

                  // Threat type name
                  if (specific_changes[k].threat_type_name_old !== undefined) {
                    fileContents.push(
                      "\t\t\t 1. **" +
                        i18n.t("threats.threat_history.threat_type_name") +
                        "**" +
                        "\n"
                    );
                    fileContents.push(
                      "\t\t\t\t - **" +
                        i18n.t("threats.threat_history.new") +
                        "** " +
                        specific_changes[k].threat_type_name_new +
                        "\n"
                    );
                    fileContents.push(
                      "\t\t\t\t - **" +
                        i18n.t("threats.threat_history.old") +
                        "** ~~" +
                        specific_changes[k].threat_type_name_old +
                        "~~\n"
                    );
                  }

                  // Asset name
                  if (specific_changes[k].asset_name_old !== undefined) {
                    fileContents.push(
                      "\t\t\t 1. **" +
                        i18n.t("threats.threat_history.asset_name") +
                        "**" +
                        "\n"
                    );
                    fileContents.push(
                      "\t\t\t\t - **" +
                        i18n.t("threats.threat_history.new") +
                        "** " +
                        specific_changes[k].asset_name_new +
                        "\n"
                    );
                    fileContents.push(
                      "\t\t\t\t - **" +
                        i18n.t("threats.threat_history.old") +
                        "** ~~" +
                        specific_changes[k].asset_name_old +
                        "~~\n"
                    );
                  }

                  console.log(specific_changes[k]);
                }
              } else {
                fileContents.push(
                  "\t * **" +
                    i18n.t("threats.threat_history.name") +
                    ":** " +
                    i18n.t("threats.threat_history.changes_history_empty") +
                    "\n"
                );
              }

              if (i != n - 1) {
                fileContents.push("\n");
              }
            }
            if (wrote > 0) {
              fileContents.push("\n");
            }
          }
        });

        try {
          fs.writeFile(
            path,
            title.concat(
              toc.join("").concat(separator.concat(fileContents.join("")))
            ),
            "utf-8",
            err => {
              if (err) {
                // eslint-disable no-console
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
