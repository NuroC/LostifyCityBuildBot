function getToken(token) {
  return (
    "Das ist DEIN token. GEBE ES AUF KEINEN FALL AN JEMAND ANDEREN WEITER! ```" +
    token +
    "``` in Minecraft einfach `/msg qlre /verify <token> <dein ingame name>` (token mit deinem token ersetzen und ohne <>, das gleiche mit dem ingame namen) und schon bist du bereit!\n Ich werde dich anschreiben, wenn die verifizierung erfolgreich war.\n Beispiel:```/msg qlre /verify wJI9PiKKFxIkDlPO9NLp47ktD6Nbul5HynOg38W9PdermAGJ7f Qlei```"
  );
}

module.exports = getToken
