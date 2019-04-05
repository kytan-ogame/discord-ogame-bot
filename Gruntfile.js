module.exports = function (grunt)
{
  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json','changelog.md'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        regExp: false
      }
    },
    conventionalChangelog: {
      options: {
        changelogOpts: {
          // conventional-changelog options go here
          preset: 'angular'
        },
        context: {
          // context goes here
        },
        gitRawCommitsOpts: {
          // git-raw-commits options go here
        },
        parserOpts: {
          // conventional-commits-parser options go here
        },
        writerOpts: {
          // conventional-changelog-writer options go here
        }
      },
      release: {
        src: 'CHANGELOG.md'
      }
    },
  });
  // release tasks
  grunt.registerTask('_release-patch', ['bump-only:patch', 'conventionalChangelog']);
  grunt.registerTask('_release-minor', ['bump-only:minor', 'conventionalChangelog']);
  grunt.registerTask('_release-major', ['bump-only:major', 'conventionalChangelog']);
};
