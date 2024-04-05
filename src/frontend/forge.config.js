module.exports = {
  packagerConfig: {
    asar: true,
    icon: "icon.ico",
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        authors: "FieldbookDevs",
        description: "Ein digitales Feldbuch zur Dokumentation von archäologischen Ausgrabungen",
        iconURL: __dirname + "/icon.ico",
        setupIcon: "icon.ico",
      },
    },
    {
      name: "@electron-forge/maker-wix",
      config: {
        description: "Ein digitales Feldbuch zur Dokumentation von archaeologischen Ausgrabungen",
        manufacturer: "FieldbookDevs",
        programFilesFolderName: "Digital3DFieldbook",
        languages: "1031",
        icon: "icon.ico",
        setupIcon: "icon.ico",
      },
    },
    {
      name: "@electron-forge/maker-zip",
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "TMink",
          name: "Digitales-3D-Feldbuch-Projekt-3-",
        },
        prerelease: false,
      },
    },
  ],
};
