# mevn-stack

## Project setup

Run this in both the root folder and dev-server

```
npm install
```

### Compiles and hot-reloads for development

In root folder run this to start-up the client

```
npm run serve
```
In dev-server folder run this to start-up the server

```
npm start
```
### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files

I have disabled lint for now.

```
npm run lint
```

# DB and MSSQL server setup

- In MS Studio go to the server instance and go to security.
- Create the user eg. admin and give password eg admin.
- Go to 'user mappings' and map to the AIFMRM_ERS db.

- Go to Server instance and right click, then click properties.
- Then go to security and select 'SQL server' authentication.

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
