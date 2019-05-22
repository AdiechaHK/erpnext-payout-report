# ERPNext Reports Extension

This project is an extension to the ERP Next Project to generate a custom report in text format.

---

## Good to know before use

This code will only help when you have your script report created in the ERP Next.

Here, also provided a sample script report files to create your script report. you need to follow the instructions given in the official [documentation](https://frappe.io/docs/user/en/guides/reports-and-printing/how-to-make-script-reports.html) of Script report generation in ERP Next.



## How to use

Here I assume that you already have your script report. and then proceding to generate specific format generation.

### Clone reppo 
Clone the project from git

```
git clone https://github.com/AdiechaHK/erpnext-payout-report.git
```

Then make a script report in ERP Next. however you want.
Here an example report is given

### Basic installation and configuraiton

To install node dependancies use command

```
npm install
```

then copy `.env.example` to `.env`

```
cp .env.example .env
```

Also setup `DEBUG` variable to `true` in evirionment file. so you will get all logs to debug the things.

### ERP Next Configurations

Setup `ERPNEXT_HOST` in the `.env` file. this host will consider to make all api calls to your ERP Next project.

Report name you can specify in the `.env` file with variable `ERPNEXT_REPORT` or if you wish to deal with multiple report, then you can also mention the report name at the time of execute the command.

You don't need to bother about credentials, as this api call requires to be accessible to `Administrator` user, so until and unless you didn't change that user's credentials this will work seemlessly.

### File format

Here as a configuration you can give the file format name in `.env` file. or you can specify them while executing the command, same as erpnext report.

**Note:** Make sure if you provide the file format name, you must need to be create more specifictions inside the `formats` folder

You need to follow these steps for format creation.

* Create a directory inside `formats` directory same name as you wish to use it for config.
* Copy default files into it `cp file/default/* formats/<YOUR_FROMAT_NAME>/`
* Customise your format has a separate topic below


### Customize your format
	
* `config.js` to configure file name, I would recommand to just change environment variable name there, and specify your format in the `.env` file.
*  `data-converter.js` in this file you can write your custom code to make modification in the data collected from the report api call.
*  `format.txt` this will be format of final report text to be generated, converted data (from the `data-converter.js`) will be pass to this file

