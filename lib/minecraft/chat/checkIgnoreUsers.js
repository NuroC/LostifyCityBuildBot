const IgnoreUsersArray = require('./ignoreUsers.js');
function checkIgnoreUsers(word) {
  return IgnoreUsersArray().indexOf(word) > -1;
  
}

module.exports = checkIgnoreUsers