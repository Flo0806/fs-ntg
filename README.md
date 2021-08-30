# fs-ntg
A node template generator to create a backend structure easily.
## Easy to use template generator
### How to install it
`(sudo) npm install -g fs-ntg`
If fs-ntg is installed globally, the command can be executed anywhere (recommended).
### How to use it
In your terminal: `fs-ntg` and press enter. Thats all. You can then choose which packages should be installed, what the project should be called and on which port the HTTP server should run.
The standard packages are:
* Express
* JsonWebToken
* Multer
* bcryptJS
* Nodemailer

If you need other packages you can write a **ntg.json** file include the base directory where you call fs-ntg which looks like that:
```Json
{
  "choices": {
    "showDefault": true,
    "customChoices": [
      { "name": "react-markdown ImageSize", "npm": "fs-imagesize" }
    ]
  }
}
```
## Folder structure
```
.
├── ProjectName
├── helper                  # Folder for your helper code
├── middleware              # Folder for your middleware
    └── check-auth.js       # Only JsonWebTokens is checked
├── routes                  # Folder for your routes
├── app.js                  # HTTP Server logic (only Express is checked)
└── index.js                # index.js
```

*So i hope you like and rate the project!*
