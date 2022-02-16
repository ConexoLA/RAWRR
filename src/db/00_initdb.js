/* eslint-disable no-console */
let db = null;
import i18n from "../i18n.js";

import { app } from "electron";

export function open() {
  var sqlite3 = require("sqlite3").verbose();
  var path = require("path");
  const isBuild = process.env.NODE_ENV === "production";
  if (process.platform === "darwin") {
    var dbPath = path.join(
      // eslint-disable-next-line no-undef
      isBuild ? __dirname : __static,
      isBuild ? "../../" : "",
      "../rawrr.db"
    );
  }

  if (process.platform === "win32") {
    if (isBuild) {
      var dbPath = path.join(process.env.PORTABLE_EXECUTABLE_DIR, "/rawrr.db");
    } else {
      var dbPath = path.join(
        // eslint-disable-next-line no-undef
        isBuild ? __dirname : __static,
        isBuild ? "../../" : "",
        "../rawrr.db"
      );
    }
  }

  if (process.platform === "linux") {
    var dbPath = path.resolve(".", "rawrr.db");
  }

  if (!db) {
    try {
      db = new sqlite3.Database(dbPath);
      db.serialize(function () {
        db.get("PRAGMA foreign_keys = OFF");
        db.run(
          "CREATE TABLE IF NOT EXISTS config (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, data TEXT NOT NULL UNIQUE)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS asset_categories (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL UNIQUE, description TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS assets (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL UNIQUE, asset_category_id INTEGER, description TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY (asset_category_id) REFERENCES asset_categories(id) ON DELETE SET NULL)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS assessment_activities (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL UNIQUE, description TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS assessment_activity_asset_associations (assessment_activity_id INTEGER NOT NULL, asset_id INTEGER NOT NULL, PRIMARY KEY (assessment_activity_id, asset_id), FOREIGN KEY (assessment_activity_id) REFERENCES assessment_activities(id) ON DELETE CASCADE, FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS threat_types (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL UNIQUE, description TEXT, color TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS threats (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, threat_type_id INTEGER, name TEXT NOT NULL UNIQUE, description TEXT, asset_id INTEGER, impact INTEGER, likelihood INTEGER, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY (threat_type_id) REFERENCES threat_types(id) ON DELETE SET NULL, FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE SET NULL, CHECK(impact BETWEEN 0 AND 10), CHECK(likelihood BETWEEN 0 AND 10))"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS vulnerabilities (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL UNIQUE, description TEXT, assessment_activity_id INTEGER, asset_id INTEGER, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY (assessment_activity_id) REFERENCES assessment_activities(id) ON DELETE SET NULL, FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE SET NULL)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS vulnerability_threat_associations (threat_id INTEGER NOT NULL, vulnerability_id INTEGER NOT NULL, PRIMARY KEY (threat_id, vulnerability_id), FOREIGN KEY (threat_id) REFERENCES threats(id) ON DELETE CASCADE, FOREIGN KEY (vulnerability_id) REFERENCES vulnerabilities(id) ON DELETE CASCADE)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS recommendations (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL UNIQUE, description TEXT, implementation_cost TEXT, implementation_time, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS recommendation_vulnerability_associations (recommendation_id INTEGER NOT NULL, vulnerability_id INTEGER NOT NULL, PRIMARY KEY (recommendation_id, vulnerability_id), FOREIGN KEY (recommendation_id) REFERENCES recommendations(id) ON DELETE CASCADE, FOREIGN KEY (vulnerability_id) REFERENCES vulnerabilities(id) ON DELETE CASCADE)"
        );
        db.run("INSERT OR IGNORE INTO config (data) VALUES (?)", [
          '{"lang": "en"}',
        ]);
        db.run(
          "INSERT OR IGNORE INTO asset_categories (name, description) VALUES (?, ?)",
          [
            '{"en": "User equipment", "es": "Equipos particulares", "pt-br": "Equipamentos de usuário"}',
            "",
          ]
        );
        db.run(
          "INSERT OR IGNORE INTO asset_categories (name, description) VALUES (?, ?)",
          [
            '{"en": "Organization equipment and services", "es": "Equipos y servicios organizacionales", "pt-br": "Equipamentos e serviços da organização"}',
            "",
          ]
        );
        db.run(
          "INSERT OR IGNORE INTO asset_categories (name, description) VALUES (?, ?)",
          [
            '{"en": "Organization members", "es": "Personal de la organización", "pt-br": "Membros da organização"}',
            "",
          ]
        );
        db.run(
          "INSERT OR IGNORE INTO asset_categories (name, description) VALUES (?, ?)",
          [
            '{"en": "Beneficiaries", "es": "Beneficiarios", "pt-br": "Beneficiários"}',
            "",
          ]
        );
        db.run(
          "INSERT OR IGNORE INTO asset_categories (name, description) VALUES (?, ?)",
          [
            '{"en": "Reputational", "es": "Reputacional", "pt-br": "Reputacional"}',
            "",
          ]
        );
        db.run(
          "INSERT OR IGNORE INTO asset_categories (name, description) VALUES (?, ?)",
          ['{"en": "Financial", "es": "Financiero", "pt-br": "Financeiro"}', ""]
        );
        db.run(
          "INSERT OR IGNORE INTO asset_categories (name, description) VALUES (?, ?)",
          [
            '{"en": "Digital assets", "es": "Activos digitales", "pt-br": "Recursos digitais"}',
            "",
          ]
        );
        db.run(
          "INSERT OR IGNORE INTO asset_categories (name, description) VALUES (?, ?)",
          [
            '{"en": "Physical assets", "es": "Activos físicos", "pt-br": "Recursos físicos"}',
            "",
          ]
        );
        db.run(
          "INSERT OR IGNORE INTO threat_types (name, description) VALUES (?, ?)",
          ['{"en": "Physical", "es": "Física", "pt-br": "Física"}', ""]
        );
        db.run(
          "INSERT OR IGNORE INTO threat_types (name, description) VALUES (?, ?)",
          [
            '{"en": "Digital-Information", "es": "Digital-Información", "pt-br": "Digital-Informação"}',
            "",
          ]
        );
        db.run(
          "INSERT OR IGNORE INTO threat_types (name, description) VALUES (?, ?)",
          [
            '{"en": "Psychosocial", "es": "Psicosocial", "pt-br": "Psicossocial"}',
            "",
          ]
        );
        db.run(
          "INSERT OR IGNORE INTO threat_types (name, description) VALUES (?, ?)",
          ['{"en": "Financial", "es": "Financiera", "pt-br": "Financeira"}', ""]
        );
        db.run(
          "INSERT OR IGNORE INTO threat_types (name, description) VALUES (?, ?)",
          [
            '{"en": "Administrative-Legal", "es": "Administrativa-Legal", "pt-br": "Administrativa-Legal"}',
            "",
          ]
        );
        db.run(
          "INSERT OR IGNORE INTO threat_types (name, description) VALUES (?, ?)",
          ['{"en": "Judicial", "es": "Judicial", "pt-br": "Judicial"}', ""]
        );
        db.run(
          "INSERT OR IGNORE INTO threat_types (name, description) VALUES (?, ?)",
          [
            '{"en": "Reputational", "es": "Reputacional", "pt-br": "Reputacional"}',
            "",
          ]
        );
        db.get("PRAGMA foreign_keys = ON");
      });
    } catch (err) {
      console.log(err);
    }
  }

  return db;
}

export function close() {
  db.serialize(function () {
    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
    });
  });
}

export function loadTestValues() {
  return new Promise(function (resolve, reject) {
    try {
      db = open();
      db.serialize(function () {
        db.get("PRAGMA foreign_keys = OFF");
        db.run("DROP TABLE IF EXISTS assets");
        db.run("DROP TABLE IF EXISTS assessment_activities");
        db.run("DROP TABLE IF EXISTS assessment_activity_asset_associations");
        db.run("DROP TABLE IF EXISTS threats");
        db.run("DROP TABLE IF EXISTS vulnerabilities");
        db.run("DROP TABLE IF EXISTS vulnerability_threat_associations");
        db.run("DROP TABLE IF EXISTS recommendations");
        db.run(
          "DROP TABLE IF EXISTS recommendation_vulnerability_associations"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS assets (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL UNIQUE, asset_category_id INTEGER, description TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY (asset_category_id) REFERENCES asset_categories(id) ON DELETE SET NULL)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS assessment_activities (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL UNIQUE, description TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS assessment_activity_asset_associations (assessment_activity_id INTEGER NOT NULL, asset_id INTEGER NOT NULL, PRIMARY KEY (assessment_activity_id, asset_id), FOREIGN KEY (assessment_activity_id) REFERENCES assessment_activities(id) ON DELETE CASCADE, FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS threats (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, threat_type_id INTEGER, name TEXT NOT NULL UNIQUE, description TEXT, asset_id INTEGER, impact INTEGER, likelihood INTEGER, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY (threat_type_id) REFERENCES threat_types(id) ON DELETE SET NULL, FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE SET NULL, CHECK(impact BETWEEN 0 AND 10), CHECK(likelihood BETWEEN 0 AND 10))"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS vulnerabilities (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL UNIQUE, description TEXT, assessment_activity_id INTEGER, asset_id INTEGER, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY (assessment_activity_id) REFERENCES assessment_activities(id) ON DELETE SET NULL, FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE SET NULL)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS vulnerability_threat_associations (threat_id INTEGER NOT NULL, vulnerability_id INTEGER NOT NULL, PRIMARY KEY (threat_id, vulnerability_id), FOREIGN KEY (threat_id) REFERENCES threats(id) ON DELETE CASCADE, FOREIGN KEY (vulnerability_id) REFERENCES vulnerabilities(id) ON DELETE CASCADE)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS recommendations (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL UNIQUE, description TEXT, implementation_cost TEXT, implementation_time, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS recommendation_vulnerability_associations (recommendation_id INTEGER NOT NULL, vulnerability_id INTEGER NOT NULL, PRIMARY KEY (recommendation_id, vulnerability_id), FOREIGN KEY (recommendation_id) REFERENCES recommendations(id) ON DELETE CASCADE, FOREIGN KEY (vulnerability_id) REFERENCES vulnerabilities(id) ON DELETE CASCADE)"
        );
        db.run(
          "INSERT INTO assets (name, asset_category_id, description) VALUES (?, ?, ?)",
          ["Web server", "2", "Server hosting example.com and example.org"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assets (name, asset_category_id, description) VALUES (?, ?, ?)",
          [
            "Office computers",
            "2",
            "Desktop available for all to use in the organization premises",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assets (name, asset_category_id, description) VALUES (?, ?, ?)",
          [
            "BYOD computers",
            "1",
            "Staff Laptops where organization work is done.",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assets (name, asset_category_id, description) VALUES (?, ?, ?)",
          ["Directors and board members", "3", "High ranked staff"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assets (name, asset_category_id, description) VALUES (?, ?, ?)",
          ["Sources", "4", "People providing sensitive material for research"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assets (name, asset_category_id, description) VALUES (?, ?, ?)",
          [
            "Office network",
            "2",
            "LAN including Wifi networks available in office",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assets (name, asset_category_id, description) VALUES (?, ?, ?)",
          [
            "Money funds",
            "6",
            "Current funds and money coming from future funding",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assets (name, asset_category_id, description) VALUES (?, ?, ?)",
          [
            "Organization public position",
            "5",
            "Credibility and reference in the field",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assets (name, asset_category_id, description) VALUES (?, ?, ?)",
          [
            "Social network accounts",
            "7",
            "Institutional accounts (projects and organization accounts)",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assets (name, asset_category_id, description) VALUES (?, ?, ?)",
          [
            "Email accounts",
            "7",
            "Institutional accounts (projects and organization accounts)",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assets (name, asset_category_id, description) VALUES (?, ?, ?)",
          ["General staff", "3", "Any staff member"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assets (name, asset_category_id, description) VALUES (?, ?, ?)",
          [
            "Office space",
            "8",
            "The physical space where daily operations are executed.",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO threats (threat_type_id, name, description, asset_id, impact, likelihood) VALUES (?, ?, ?, ?, ?, ?)",
          [
            "2",
            "A hacker takes control of the website",
            "With the possibility of losing the information",
            "1",
            "2",
            "1",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO threats (threat_type_id, name, description, asset_id, impact, likelihood) VALUES (?, ?, ?, ?, ?, ?)",
          [
            "6",
            "Arrest of directors",
            "Because of the work they do in the organization",
            "4",
            "6",
            "4",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO threats (threat_type_id, name, description, asset_id, impact, likelihood) VALUES (?, ?, ?, ?, ?, ?)",
          [
            "2",
            "Device seizure and targeted theft",
            "Looking for sensitive information inside it",
            "3",
            "2",
            "3",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO threats (threat_type_id, name, description, asset_id, impact, likelihood) VALUES (?, ?, ?, ?, ?, ?)",
          [
            "4",
            "Loss of funding sources",
            "Funding becomes scarce or nonexistent because of a change in the political/legal landscape or funder priorities",
            null,
            "4",
            "0",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO threats (threat_type_id, name, description, asset_id, impact, likelihood) VALUES (?, ?, ?, ?, ?, ?)",
          [
            "3",
            "Anonymous death threats to the sources",
            "Putting some of them in high levels of stress affecting their willingness to collaborate with the organization",
            "5",
            "3",
            "5",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO threats (threat_type_id, name, description, asset_id, impact, likelihood) VALUES (?, ?, ?, ?, ?, ?)",
          [
            "1",
            "Police raid the office violently",
            "Potentially seizing the organizational equipment",
            "2",
            "1",
            "2",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO threats (threat_type_id, name, description, asset_id, impact, likelihood) VALUES (?, ?, ?, ?, ?, ?)",
          [
            "7",
            "Smear campaign",
            "Affecting the credibility of the organization",
            "8",
            "7",
            "8",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO threats (threat_type_id, name, description, asset_id, impact, likelihood) VALUES (?, ?, ?, ?, ?, ?)",
          [
            "2",
            "Personal information of the sources leaked",
            "Putting them in risk of retaliation",
            "5",
            "2",
            "5",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO threats (threat_type_id, name, description, asset_id, impact, likelihood) VALUES (?, ?, ?, ?, ?, ?)",
          [
            "2",
            "Office router is damaged",
            "Bringing down the office network",
            "6",
            "2",
            "6",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO threats (threat_type_id, name, description, asset_id, impact, likelihood) VALUES (?, ?, ?, ?, ?, ?)",
          [
            "5",
            "The work the organization does is criminalized",
            "Putting in jeopardy the public functioning of the organization",
            null,
            "5",
            "0",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO threats (threat_type_id, name, description, asset_id, impact, likelihood) VALUES (?, ?, ?, ?, ?, ?)",
          [
            "1",
            "Staff leave the organization because of personal security concerns",
            "Putting at risk the operations of the organization in terms of installed capacity and the ability of filling positions.",
            "11",
            "1",
            "10",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO threats (threat_type_id, name, description, asset_id, impact, likelihood) VALUES (?, ?, ?, ?, ?, ?)",
          ["2", "Social media accounts hacked", "", "9", "2", "9"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO threats (threat_type_id, name, description, asset_id, impact, likelihood) VALUES (?, ?, ?, ?, ?, ?)",
          ["2", "Email accounts hacked", "", "10", "2", "10"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO threats (threat_type_id, name, description, asset_id, impact, likelihood) VALUES (?, ?, ?, ?, ?, ?)",
          [
            "1",
            "Physical assault to staff",
            "Causing considerable physical harm",
            "11",
            "1",
            "10",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO threats (threat_type_id, name, description, asset_id, impact, likelihood) VALUES (?, ?, ?, ?, ?, ?)",
          [
            "4",
            "Organization funds freezed by government",
            "Temporal lack of funds availability",
            "7",
            "4",
            "7",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activities (name, description) VALUES (?, ?)",
          ["Network mapping", "Using pings, Zenmap and other LAN tools"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activities (name, description) VALUES (?, ?)",
          ["Context research", "Country, adversaries, news, etc."],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activities (name, description) VALUES (?, ?)",
          [
            "User Device assessment",
            "Looking for configurations, software and user habits on user owned devices.",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activities (name, description) VALUES (?, ?)",
          [
            "Office device assessment",
            "Looking for configurations, software, policies and user habits on organization-owned devices.",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activities (name, description) VALUES (?, ?)",
          [
            "Vulnerability scanning",
            "On critical assets of the organization with specialized tools",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activities (name, description) VALUES (?, ?)",
          [
            "Staff interviews",
            "About daily operations, processes and security concerns.",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activities (name, description) VALUES (?, ?)",
          [
            "Physical security assessment",
            "Focusing on access control and security measures against unauthorized incursions.",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)",
          ["1", "6"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)",
          ["2", "1"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)",
          ["2", "4"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)",
          ["2", "5"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)",
          ["3", "3"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)",
          ["4", "1"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)",
          ["4", "2"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)",
          ["4", "6"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)",
          ["5", "2"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)",
          ["5", "3"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)",
          ["6", "2"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)",
          ["6", "3"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)",
          ["6", "5"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)",
          ["6", "9"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)",
          ["6", "10"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)",
          ["6", "11"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)",
          ["7", "2"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)",
          ["7", "6"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)",
          ["7", "4"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)",
          ["7", "11"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO assessment_activity_asset_associations (assessment_activity_id, asset_id) VALUES (?, ?)",
          ["7", "12"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerabilities (name, description, assessment_activity_id, asset_id) VALUES (?, ?, ?, ?)",
          [
            "The website doesn't redirect to HTTPS version",
            "This makes users using the domain without 'https://' to be vulnerable to having their traffic intercepted by any third party on the local network or at the ISP level. In the case of the website users accessing the administrative interface without HTTPS, the usernames and password can also be intercepted. This also have a negative impact on search engine positioning, given that Google is penalizing not using HTTPS as the only standard to access websites.",
            "2",
            "1",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerabilities (name, description, assessment_activity_id, asset_id) VALUES (?, ?, ?, ?)",
          [
            "The website uses an outdated CMS with known vulnerabilities",
            "Some of these vulnerabilities can lead to service downtime or content modification, we detected Joomla in version 3.6.4. More information can be found in the attached reports of the tools OpenVAS and Sucuri.",
            "5",
            "1",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerabilities (name, description, assessment_activity_id, asset_id) VALUES (?, ?, ?, ?)",
          [
            "There are precedents of phone and other surveillance to similar organizations",
            "And the staff suspects that this same actor could be monitoring their communications as well.",
            "2",
            "11",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerabilities (name, description, assessment_activity_id, asset_id) VALUES (?, ?, ?, ?)",
          [
            "The security controls protecting the access to the office can be easily bypassed",
            "Allowing anyone with the ability to hit the door hard enough to enter the office even in non-working hours.",
            "7",
            "12",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerabilities (name, description, assessment_activity_id, asset_id) VALUES (?, ?, ?, ?)",
          [
            "The inbox of institutional email addresses have weak passwords",
            "Product of email provision policies that are enforced to configure national identity numbers as passwords and making it difficult to change them to anything else.",
            "6",
            "10",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerabilities (name, description, assessment_activity_id, asset_id) VALUES (?, ?, ?, ?)",
          [
            "Many office computer don't have screen passwords",
            "Making possible for anyone to use the devices and manipulate the files inside them.",
            "4",
            "2",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerabilities (name, description, assessment_activity_id, asset_id) VALUES (?, ?, ?, ?)",
          [
            "People currently not working on the organization have access to institutional social network accounts",
            "Making possible for these people to post on behalf of the organization and take control of the accounts among others.",
            "6",
            "9",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerabilities (name, description, assessment_activity_id, asset_id) VALUES (?, ?, ?, ?)",
          [
            "There are recent physical threats to staff members",
            "Including death threats to staff members and their relatives because of their work with the organization.",
            "6",
            "11",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerabilities (name, description, assessment_activity_id, asset_id) VALUES (?, ?, ?, ?)",
          [
            "Frequent revision of devices in travel checkpoints",
            "Making possible for law enforcement to manipulate the devices and extracting/implanting data in those devices.",
            "6",
            "2",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerabilities (name, description, assessment_activity_id, asset_id) VALUES (?, ?, ?, ?)",
          [
            "There is an active smear campaign against the organization",
            "Suggesting that is receiving funds from illegal sources.",
            "2",
            "8",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["1", "1"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["8", "1"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["1", "2"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["8", "2"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["2", "3"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["7", "3"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["5", "3"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["8", "3"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["10", "3"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["14", "3"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["3", "4"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["6", "4"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["13", "4"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["12", "5"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["8", "5"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["1", "6"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["8", "6"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["10", "6"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["7", "7"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["8", "7"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["10", "7"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["14", "8"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["11", "8"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["3", "9"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["8", "9"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["7", "10"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["10", "10"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO vulnerability_threat_associations (threat_id, vulnerability_id) VALUES (?, ?)",
          ["15", "10"],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendations (name, description, implementation_cost, implementation_time) VALUES (?, ?, ?, ?)",
          [
            "Implement a redirection in the website to HTTPS protocol",
            "This can be achieved in many ways, some of those are: \
          - .htaccess redirection: being the easiest way to make the redirection is including a file with specific content in the root directory of the website. Reference: https://www.freecodecamp.org/news/how-to-redirect-http-to-https-using-htaccess/  \
          - Joomla configuration: Joomla offers some options to make redirections through its configuration. Reference: https://forum.joomla.org/viewtopic.php?t=946966 \
          ",
            "Included in IT workload",
            "Short term",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendations (name, description, implementation_cost, implementation_time) VALUES (?, ?, ?, ?)",
          [
            "Implement a new mail server",
            "That allows better authentication security, especially the use and change of strong passwords. It's also desirable that the service allows two-factor authentication. Some options can include G-Suite, Fastmail or self hosting with different technologies (less recommended because it requires considerable time for ongoing administration and the organization currently doesn’t have dedicated staff available for this)",
            "Depends on the selected solution",
            "Mid term",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendations (name, description, implementation_cost, implementation_time) VALUES (?, ?, ?, ?)",
          [
            "Implement access control and encryption in every computer used in the organization",
            "Requiring that passwords or other authentication methods are unique per user, non available in physical form in the office (post-its, boards, etc.), at least 14 characters long, non related to the user personal data and unknown to anyone else. Full disk encryption is also recommended.",
            "N/A",
            "Short term",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendations (name, description, implementation_cost, implementation_time) VALUES (?, ?, ?, ?)",
          [
            "Implement and apply a password policy for institutional accounts",
            "Including onboarding and offboarding processes to ensure that just the intended people have access to the institutional accounts when a new staff member enters or leaves the organization. Also this policy must include password generation, change and sharing processes, basic security configuration by each kind of service and steps to document security incidents.",
            "N/A",
            "Short term",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendations (name, description, implementation_cost, implementation_time) VALUES (?, ?, ?, ?)",
          [
            "Implement and apply procedures to address threats",
            "Including documentation for potential criminal case filing, information disclosure and self care considerations.",
            "N/A",
            "Mid term",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendations (name, description, implementation_cost, implementation_time) VALUES (?, ?, ?, ?)",
          [
            "Assess the possibility of starting a psychology counseling program",
            "Aimed to help the staff regarding the risks of daily operations and specific emergency situations.",
            "N/A",
            "Mid term",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendations (name, description, implementation_cost, implementation_time) VALUES (?, ?, ?, ?)",
          [
            "Encrypt devices storing sensitive information and used to travel",
            "So is more difficult for law enforcement to access to sensitive files during checkpoint controls, this applies to computers and cell phones.",
            "Windows Pro license for each PCs to encrypt",
            "Mid term",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendations (name, description, implementation_cost, implementation_time) VALUES (?, ?, ?, ?)",
          [
            "Develop a strategy of public image and communications addressing smear campaigns",
            "It can include the collaboration of allied organizations, transparency and publishing of fund sources.",
            "N/A",
            "Short term",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendations (name, description, implementation_cost, implementation_time) VALUES (?, ?, ?, ?)",
          [
            "Update the version of the CMS used in the website",
            "To a version with not known vulnerabilities, it’s recommended to keep the version to the latest every time.",
            "N/A",
            "Short term",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendations (name, description, implementation_cost, implementation_time) VALUES (?, ?, ?, ?)",
          [
            "Avoid traditional phone calls in favor of internet services",
            "So frequently used surveillance techniques are useless to intercept calls made with these services. It's recommended that the selected services support security features like encryption in transit, end to end encryption, etc. Some examples are Signal and Whatsapp.",
            "N/A",
            "Ongoing",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendations (name, description, implementation_cost, implementation_time) VALUES (?, ?, ?, ?)",
          [
            "Install better locks on the office",
            "That makes more difficult to break in hitting the door, other controls can include a security door and a video camera recording people trying to enter the office as a deterrent (previous assessment of potential new vulnerabilities led by documenting visitors/sources/beneficiaries).",
            "N/A",
            "Ongoing",
          ],
          function (err) {
            if (err) {
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendation_vulnerability_associations (recommendation_id, vulnerability_id) VALUES (?, ?)",
          ["1", "7"],
          function (err) {
            if (err) {
              console.log(err);
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendation_vulnerability_associations (recommendation_id, vulnerability_id) VALUES (?, ?)",
          ["2", "3"],
          function (err) {
            if (err) {
              console.log(err);
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendation_vulnerability_associations (recommendation_id, vulnerability_id) VALUES (?, ?)",
          ["3", "4"],
          function (err) {
            if (err) {
              console.log(err);
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendation_vulnerability_associations (recommendation_id, vulnerability_id) VALUES (?, ?)",
          ["3", "8"],
          function (err) {
            if (err) {
              console.log(err);
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendation_vulnerability_associations (recommendation_id, vulnerability_id) VALUES (?, ?)",
          ["4", "5"],
          function (err) {
            if (err) {
              console.log(err);
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendation_vulnerability_associations (recommendation_id, vulnerability_id) VALUES (?, ?)",
          ["5", "6"],
          function (err) {
            if (err) {
              console.log(err);
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendation_vulnerability_associations (recommendation_id, vulnerability_id) VALUES (?, ?)",
          ["6", "6"],
          function (err) {
            if (err) {
              console.log(err);
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendation_vulnerability_associations (recommendation_id, vulnerability_id) VALUES (?, ?)",
          ["7", "8"],
          function (err) {
            if (err) {
              console.log(err);
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendation_vulnerability_associations (recommendation_id, vulnerability_id) VALUES (?, ?)",
          ["8", "9"],
          function (err) {
            if (err) {
              console.log(err);
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendation_vulnerability_associations (recommendation_id, vulnerability_id) VALUES (?, ?)",
          ["9", "10"],
          function (err) {
            if (err) {
              console.log(err);
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendation_vulnerability_associations (recommendation_id, vulnerability_id) VALUES (?, ?)",
          ["10", "1"],
          function (err) {
            if (err) {
              console.log(err);
              reject(err.message);
            }
          }
        );
        db.run(
          "INSERT INTO recommendation_vulnerability_associations (recommendation_id, vulnerability_id) VALUES (?, ?)",
          ["11", "2"],
          function (err) {
            if (err) {
              console.log(err);
              reject(err.message);
            }
          }
        );
        db.get("PRAGMA foreign_keys = ON");
      });
      resolve("Fixtures successfully inserted");
    } catch (err) {
      reject(err.message);
    }
  });
}

export function deleteDatabase() {
  return new Promise(function (resolve, reject) {
    try {
      db = open();
      db.serialize(function () {
        db.get("PRAGMA foreign_keys = OFF");
        db.run("DROP TABLE IF EXISTS asset_categories");
        db.run("DROP TABLE IF EXISTS assets");
        db.run("DROP TABLE IF EXISTS assessment_activities");
        db.run("DROP TABLE IF EXISTS assessment_activity_asset_associations");
        db.run("DROP TABLE IF EXISTS threat_types");
        db.run("DROP TABLE IF EXISTS threats");
        db.run("DROP TABLE IF EXISTS vulnerabilities");
        db.run("DROP TABLE IF EXISTS vulnerability_threat_associations");
        db.run("DROP TABLE IF EXISTS recommendations");
        db.run(
          "DROP TABLE IF EXISTS recommendation_vulnerability_associations"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS asset_categories (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL UNIQUE, description TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS assets (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL UNIQUE, asset_category_id INTEGER, description TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY (asset_category_id) REFERENCES asset_categories(id) ON DELETE SET NULL)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS assessment_activities (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL UNIQUE, description TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS assessment_activity_asset_associations (assessment_activity_id INTEGER NOT NULL, asset_id INTEGER NOT NULL, PRIMARY KEY (assessment_activity_id, asset_id), FOREIGN KEY (assessment_activity_id) REFERENCES assessment_activities(id) ON DELETE CASCADE, FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS threat_types (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL UNIQUE, description TEXT, color TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS threats (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, threat_type_id INTEGER, name TEXT NOT NULL UNIQUE, description TEXT, asset_id INTEGER, impact INTEGER, likelihood INTEGER, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY (threat_type_id) REFERENCES threat_types(id) ON DELETE SET NULL, FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE SET NULL, CHECK(impact BETWEEN 0 AND 10), CHECK(likelihood BETWEEN 0 AND 10))"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS vulnerabilities (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL UNIQUE, description TEXT, assessment_activity_id INTEGER, asset_id INTEGER, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY (assessment_activity_id) REFERENCES assessment_activities(id) ON DELETE SET NULL, FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE SET NULL)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS vulnerability_threat_associations (threat_id INTEGER NOT NULL, vulnerability_id INTEGER NOT NULL, PRIMARY KEY (threat_id, vulnerability_id), FOREIGN KEY (threat_id) REFERENCES threats(id) ON DELETE CASCADE, FOREIGN KEY (vulnerability_id) REFERENCES vulnerabilities(id) ON DELETE CASCADE)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS recommendations (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL UNIQUE, description TEXT, implementation_cost TEXT, implementation_time, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)"
        );
        db.run(
          "CREATE TABLE IF NOT EXISTS recommendation_vulnerability_associations (recommendation_id INTEGER NOT NULL, vulnerability_id INTEGER NOT NULL, PRIMARY KEY (recommendation_id, vulnerability_id), FOREIGN KEY (recommendation_id) REFERENCES recommendations(id) ON DELETE CASCADE, FOREIGN KEY (vulnerability_id) REFERENCES vulnerabilities(id) ON DELETE CASCADE)"
        );
        db.run(
          "INSERT OR IGNORE INTO asset_categories (name, description) VALUES (?, ?)",
          [
            '{"en": "User equipment", "es": "Equipos particulares", "pt-br": "Equipamentos de usuário"}',
            "",
          ]
        );
        db.run(
          "INSERT OR IGNORE INTO asset_categories (name, description) VALUES (?, ?)",
          [
            '{"en": "Organization equipment and services", "es": "Equipos y servicios organizacionales", "pt-br": "Equipamentos e serviços da organização"}',
            "",
          ]
        );
        db.run(
          "INSERT OR IGNORE INTO asset_categories (name, description) VALUES (?, ?)",
          [
            '{"en": "Organization members", "es": "Personal de la organización", "pt-br": "Membros da organização"}',
            "",
          ]
        );
        db.run(
          "INSERT OR IGNORE INTO asset_categories (name, description) VALUES (?, ?)",
          [
            '{"en": "Beneficiaries", "es": "Beneficiarios", "pt-br": "Beneficiários"}',
            "",
          ]
        );
        db.run(
          "INSERT OR IGNORE INTO asset_categories (name, description) VALUES (?, ?)",
          [
            '{"en": "Reputational", "es": "Reputacional", "pt-br": "Reputacional"}',
            "",
          ]
        );
        db.run(
          "INSERT OR IGNORE INTO asset_categories (name, description) VALUES (?, ?)",
          ['{"en": "Financial", "es": "Financiero", "pt-br": "Financeiro"}', ""]
        );
        db.run(
          "INSERT OR IGNORE INTO asset_categories (name, description) VALUES (?, ?)",
          [
            '{"en": "Digital assets", "es": "Activos digitales", "pt-br": "Recursos digitais"}',
            "",
          ]
        );
        db.run(
          "INSERT OR IGNORE INTO asset_categories (name, description) VALUES (?, ?)",
          [
            '{"en": "Physical assets", "es": "Activos físicos", "pt-br": "Recursos físicos"}',
            "",
          ]
        );
        db.run(
          "INSERT OR IGNORE INTO threat_types (name, description) VALUES (?, ?)",
          ['{"en": "Physical", "es": "Física", "pt-br": "Física"}', ""]
        );
        db.run(
          "INSERT OR IGNORE INTO threat_types (name, description) VALUES (?, ?)",
          [
            '{"en": "Digital-Information", "es": "Digital-Información", "pt-br": "Digital-Informação"}',
            "",
          ]
        );
        db.run(
          "INSERT OR IGNORE INTO threat_types (name, description) VALUES (?, ?)",
          [
            '{"en": "Psychosocial", "es": "Psicosocial", "pt-br": "Psicossocial"}',
            "",
          ]
        );
        db.run(
          "INSERT OR IGNORE INTO threat_types (name, description) VALUES (?, ?)",
          ['{"en": "Financial", "es": "Financiera", "pt-br": "Financeira"}', ""]
        );
        db.run(
          "INSERT OR IGNORE INTO threat_types (name, description) VALUES (?, ?)",
          [
            '{"en": "Administrative-Legal", "es": "Administrativa-Legal", "pt-br": "Administrativa-Legal"}',
            "",
          ]
        );
        db.run(
          "INSERT OR IGNORE INTO threat_types (name, description) VALUES (?, ?)",
          ['{"en": "Judicial", "es": "Judicial", "pt-br": "Judicial"}', ""]
        );
        db.run(
          "INSERT OR IGNORE INTO threat_types (name, description) VALUES (?, ?)",
          [
            '{"en": "Reputational", "es": "Reputacional", "pt-br": "Reputacional"}',
            "",
          ]
        );
        db.get("PRAGMA foreign_keys = ON");
      });
      resolve("Database successfully deleted");
    } catch (err) {
      reject(err.message);
    }
  });
}
