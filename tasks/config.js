const path = require('path');

module.exports = {
  "paths": {
      "filesToWatch": ["./tests/**/*.js","./src/select-a11y.scss"]
  },
  "rootDir": path.resolve(__dirname, '../'),
  "servingPort": 8080,
  "filesToWatch": ["./tests/**/*.js","./src/select-a11y.scss"],
  "browser": "last 2 version"
}
