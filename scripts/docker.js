var DockerCmd = require("docker-cmd");
var dockerCmd = new DockerCmd();
var pjson = require('../package.json');
var tag = pjson.dockerRegistry + "/" + pjson.dockerRepo + "/" + pjson.name + ":" + pjson.version;
const TARGET = process.env.npm_lifecycle_event; 


dockerCmd.build({t: tag, 'build-arg': "project_name="+pjson.name, _: '.'}, {}, function(dockerBuildExitCode) {

  if (dockerBuildExitCode === 0) {
      console.log(tag + ' built');
      if ( TARGET === 'build-bamboo' ) { 
          dockerCmd.push({_: tag}, {}, function(dockerRunExitCode) {
              console.log(tag + ' pushed to registry.');
          });
      }
  } else {
      console.error("docker build failed");
  }
});

