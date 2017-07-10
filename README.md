# Babel Project Template
Template for build compatible babel based projects

## How to use this template
1. Copy contents of this project to another directory except for the ".git" directory
1. Rename key "name" in package.json, 
1. Modify sections of package.json as needed, except those that are related to build process. 
1. The assumption is that `npm run compile` will produce all distribution files (including node_modules) needed in the "dist" directory and your application will be invoked by `npm run start`.
1. If your application has a node module that will requires compilation on the destination machine do not include node_modules in the "dist" directory instead copy your package.json inside the "dist" directory. The build phase(docker) will invoke again `npm install` if package.json is found, do not inlude otherwise as this will lengthen the build uneccessarily. 

## Conventions
* Internal backend url's like mssql, memcache and mongodb are all the same on each environment.
 ex. mysql-1-zone-1.internal
* Username to internal backend services are also the same.
* Password are not to be hardcoded to the project nor should supply defaults, the application is expected to fail upon startup. This will be loaded during deploy phase and can be retrieve by reading it in the envinronment variables e.c. process.env.MONGODB_PASS

