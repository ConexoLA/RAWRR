module.exports = {
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true,
    },
    electronBuilder: {
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        extraResources: ["rawrr.db"],
        icon: "icon.png",
        linux: {
          target: [
            {
              target: "appImage",
            },
          ],
          category: "Utility",
        },
        mac: {
          target: [
            {
              target: "dmg",
            },
          ],
        },
        win: {
          icon: "icon.png",
          target: [
            {
              target: "portable",
              arch: ["x64", "ia32"],
            },
          ],
        },
      },
    },
  },
};
