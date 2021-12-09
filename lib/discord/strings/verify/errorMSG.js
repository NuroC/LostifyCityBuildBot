function errorMSG(username) {
  return (
    "/msg " +
    username +
    " etwas ist schief gelaufen. Bitte versuche es nochmal."
  );
}

module.exports = errorMSG