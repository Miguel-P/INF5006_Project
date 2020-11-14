# INF5006 Dashboard project

## DB and MSSQL server setup

### Setting up MSSQL server
- In MS Studio go to the server instance and go to security.
- Create the user eg. admin and give password eg admin.
- Go to `user mappings` and map to the AIFMRM_ERS db.

- Go to Server instance and right click, then click properties.
- Then go to security and select `SQL server` authentication.

### Adding tables to the MSSQL server
Assuming you've correctly opened the given AIFMRM_ERS database file, you will now want to add the additional synthetic tables to the AIFMRM_ERS db. You will require the following csv files: 
* industry_portfolio_metrics.csv
* portfolio_metrics.csv
* shares_metrics.csv.
These can be found in the Ballon D'ashboard MSTeams group.

To import the csv files as tables, open MS SQL Server Management Studio and do the following:
1. Right-click on main database `AIFRMR_ERS`
2. Go to `Tasks` option
3. Select 'Import flat file'
4. Follow the instructions, choose all default options and most importantly, DO NOT CHANGE the name of the table. Use the default name suggested based on the csv file.

After doing this for each of the synthetic table (and the tool tip table once those have been added), you should now be able to run the following test queries from MS SQL Server Management Studio:
```
select * from AIFMRM_ERS.dbo.industry_portfolio_metrics
```
```
select * from AIFMRM_ERS.dbo.shares_metrics
```
```
select * from AIFMRM_ERS.dbo.portfolio_metrics
```

If the queries execute as expected, then congratulations, you have successfully set up the databases.


## Project setup

### Installing Dependencies
To setup and install the necessary packages and modules required to run the dashboard, run the command below in both the root directory of the project and the folder `dev-server`.
```
npm install
```

### Compiling and serving the dashboard
From the terminal, navigate to the root folder of the project and run the following command to serve the frontend of the project:
```
    npm run serve
```
Then, in a new terminal, navigate to the dev-server folder and run the following command to create the web server:
```
    npm run start
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
(Linting is currently disabled.)
```
npm run lint
```

## Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
