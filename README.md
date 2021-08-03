<p align="center">
<img src="/public/images/logo_rawrr_v_yellow.png" alt="drawing" width="250"/>
<p>

---

To install the packages that will allow you to modify RAWRR or, in the other case, to build the executable, please follow these steps:

1. Select the base directory in which you want to download RAWRR.

   ```Shell
   # Modify the working directory
   cd path/to/working/directory
   ```

---

**Optional**\
If you need to create the directory you can easily run <span style="color:grey">**`mkdir path/to/working/directory`**</span>

---

2. Clone our RAWRR repository.

   ```Shell
   # Cloning base repository
   git clone https://github.com/ConexoLA/RAWRR.git
   ```

3. Install dependencies

Depending on the usage you want to give to RAWRR, you may modify the code using the hot-reload functionality or generate the executable by building the project.

In both cases, you must install all the packages available in `package.json`.

```Shell
# install packages from package.json
npm install
```

![npm install image](/public/images/npm_install.png)

### Fixing vulnerabilites

Sometimes, security vulnerabilities are found and updates are available. Below, we show an example:

![npm install fix image](/public/images/npm_install_fix.png)

In most cases, we encourage the user to run the comman `npm audit fix`

The usual output of this command is as follows:

```Shell
fixed X of Y vulnerabilities in Z scanned packages
Y-X vulnerabilities required manual review and could not be updated
```

Where:

1. X is the number of vulnerabilties solved.
2. Y was the total number of vulnerabilities to be solved.
3. Z is the number of packages that were scanned
4. Y-X is the number of vulnerabilities that should be solved manually.

---

**Information**\
At this point you could:

1. [Modify RAWRR](#modify-rawrr-using-electron) in the case you want to add new functionalities or extend RAWRR. Once you finish your changes, go to step 2.
2. [Generate the executable](#create-the-rawrr-executable) of RAWRR.

---

### Modify RAWRR using electron

If you want to modify RAWRR using the hot reaload option from electron, you can use the following command:

```Shell
npm run electron:serve
```

This command, will start a development server to test your application (as you can see in the image below).

![Serve image](/public/images/serve.png)

After the server is launched, you will realize the application is being tested in development mode because the usual tools for developers are activated:

![Dev mode image](/public/images/dev_mode.png)

### Create the RAWRR executable

If you want to generate the executable of RAWRR, use the following command:

```Shell
npm run electron:build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Feedback

You can submit your feedback via email at rawrr@conexo.org.
