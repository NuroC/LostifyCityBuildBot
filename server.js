const Discord = require("discord.js");
const express = require("express");
const db = require("quick.db");
const mineflayer = require("mineflayer");
const navigatePlugin = require("mineflayer-navigate")(mineflayer);
const vec3 = require("vec3").Vec3;
const discorddice = require("discorddice");
const randomNumber = require("./lib/globals/functions/randomNumber.js"); //
const generate_token = require("./lib/globals/functions/generateToken.js");
const roundToTwo = require("./lib/globals/functions/roundToTwo.js");
const randomNumProbability1 = require("./lib/globals/functions/randomNumProbability1.js");
const probabGen = require("./lib/discord/casino/limbo/randomNumberGen.js");
const getToken = require("./lib/discord/secret/getToken.js");
const getWHToken = require("./lib/discord/secret/getWHdata.js");
const Vec3 = require("./lib/minecraft/api/Vec3.js");
const verifyErrorMSG = require("./lib/discord/strings/verify/errorMSG.js");
const verifysuccMSG = require("./lib/discord/strings/verify/succMSG.js");
const ignoreUsersArray = require("./lib/minecraft/chat/ignoreUsers.js");
const checkIgnoreUsers = require("./lib/minecraft/chat/checkIgnoreUsers.js");
const sendToWebhook = require("./lib/minecraft/api/webhook-node.js");
const minecraftBot = {
  host: require("./lib/minecraft/bot/host.js"),
  email: require("./lib/minecraft/bot/email.js"),
  password: require("./lib/minecraft/bot/password.js"),
  version: require("./lib/minecraft/bot/version.js"),
  auth: require("./lib/minecraft/bot/auth.js")
};
const discordStrings = { getTokenReply: require("./lib/discord/strings/auth/getToken.js") };

var discordToken = getToken();
const app = express();
const client = new Discord.Client();

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const bot = mineflayer.createBot({
  host: minecraftBot.host(),
  username: minecraftBot.email(),
  password: minecraftBot.password(),
  version: minecraftBot.version(),
  auth: minecraftBot.auth()
});



navigatePlugin(bot);
console.log(db.get("storage"));
var lastrecievedMoney = 0;
var lastrecievedAuthor = "";
bot.on("chat", async (username, message) => {
  console.log(username, message);
  if (username == "dir") {
    let msgelements = message.split(" ");
    let cmd = msgelements[0];

    switch (cmd) {
      case "/verify": {
        let author = msgelements[2];

        if (!msgelements[1]) return;
        if (db.get("storage.tokens." + msgelements[1] + ".tag")) {
          if (!bot.onlinePlayers.includes(author)) {
            bot.chat("/r du hast keinen richtigen namen eingegeben.");
          } else {
            if(db.GET('storage.users.' + author)) return
            db.set("storage.users." + author, {
              coins: 500,
              verified: true,
              tag: db.get("storage.tokens." + msgelements[1] + ".tag"),
              ign: author
            });
            const user = await client.users
              .fetch(db.get("storage.tokens." + msgelements[1] + ".id"))
              .catch(() => null);

            if (!user) return bot.chat(verifyErrorMSG(username));
            await user.send(verifysuccMSG()).catch(() => {
              bot.chat(
                "/r " +
                  " bitte stell sicher dass wir im gleichen server sind / dass deine DMS offen sind."
              );
            });
            db.set("storage.tokens." + msgelements[1], "");
            console.log(db.get("storage"));
          }
        } else {
          bot.chat("/r Falsches token. ");
        }
      }
    }
  } else if (username == "System") {
    let tempmsg1 = message.split(" ");
    if (tempmsg1[8] == "erhalten.") {
      var coinamountpos = 0;
      var coinauthorpos = 0;
      for (let i in tempmsg1) {
        if (tempmsg1[i] == "Coins") {
          coinamountpos = i - 1;
          coinauthorpos = i - 2;
          console.log(db.get("storage.users." + tempmsg1[coinauthorpos]));
          if (db.get("storage.users." + tempmsg1[coinauthorpos])) {
            let coinsToAdd =
              parseInt(
                db.get("storage.users." + tempmsg1[coinauthorpos] + ".coins")
              ) + parseInt(tempmsg1[coinamountpos]);
            db.set(
              "storage.users." + tempmsg1[coinauthorpos] + ".coins",
              coinsToAdd
            );
            console.log(db.get("storage.users"));
          }
        }
      }
    }
  }

  if (checkIgnoreUsers(username)) return;
  sendToWebhook({
    username: username,
    message: message
  });
});

client.on("message", message => {
  var msgelements = message.content.split(" ");
  var guytowithdraw = "Noone:)";
  let moneytowithdraw = 0;
  let peepstofetch = db.get("storage.users");
  if (message.author.id == client.user.id) return;
  if (message.channel.type == "dm") return message.reply("nicht hier!");

  if (message.content.startsWith("l!")) {
    let cmd = message.content.split(" ")[0].slice(2);

    switch (cmd) {
      case "chat":
        console.log(message.content.slice(7));
        bot.chat(message.content.slice(7));
        break;
      case "loginfo":
        bot.chat(bot.onlinePlayers.toString());
        break;
      case "verify":
        let token = generate_token(50);
        db.set("storage.tokens." + token, {
          tag: message.author.tag,
          id: message.author.id
        });
        message.author.send(discordStrings.getTokenReply(token));
        break;
      case "clearcache":
        console.log(db.get("storage"));
        db.set("storage", {});
        message.channel.send("Cache cleared!");
        break;
      case "balance":
        let usertofetch = db.get("storage.users");
        for (let i in usertofetch) {
          1;
          if (usertofetch[i].tag == message.author.tag) {
            message.reply({
              embed: {
                title: "balance",
                description: usertofetch[i].coins
              }
            });
          }
        }
        break;
      case "withdraw":
        for (let i in peepstofetch) {
          if (peepstofetch[i].tag == message.author.tag) {
            guytowithdraw = peepstofetch[i].ign;
          }
        }
        if (!isNaN(parseInt(msgelements[1]))) {
          if (!peepstofetch[guytowithdraw])
            return message.channel.send("user nicht gefunden.");
          if (peepstofetch[guytowithdraw].coins + 1 > msgelements[1]) {
            moneytowithdraw = msgelements[1];
            bot.chat("/pay " + guytowithdraw + " " + moneytowithdraw);

            db.set(
              "storage.users." + guytowithdraw + ".coins",
              peepstofetch[guytowithdraw].coins - moneytowithdraw
            );
            message.channel.send(
              "erfolgreich " + moneytowithdraw + " ausgezahlt"
            );
          } else {
            message.reply("du hast nicht genug coins!");
          }
        }

      case "play":
        var game = msgelements[1];
        var amount = msgelements[2];
        switch (game) {
          case "classic":
            if (amount < 5001) {
              let peepstofetch = db.get("storage.users");
              for (let i in peepstofetch) {
                console.log(peepstofetch[i].tag);
                if (peepstofetch[i].tag == message.author.tag) {
                  guytowithdraw = peepstofetch[i].ign;
                }
              }
              let rannum = randomNumber(1, 3);
              console.log(
                db.get("storage.users." + guytowithdraw + ".coins") + 1,
                msgelements[2]
              );
              if (
                db.get("storage.users." + guytowithdraw + ".coins") + 1 >
                msgelements[2]
              ) {
                if (rannum == 1) {
                  db.set(
                    "storage.users." + guytowithdraw + ".coins",
                    parseInt(
                      db.get("storage.users." + guytowithdraw + ".coins")
                    ) + parseInt(amount)
                  );
                  message.channel.send(
                    "Du hast gewonnen! \nDein gewinn: **" +
                      parseInt(amount) * 2 +
                      " Coins!**\nDeine coins: **" +
                      db.get("storage.users." + guytowithdraw + ".coins") +
                      "**"
                  );
                } else {
                  message.channel.send("du hast leider verloren.");
                  db.set(
                    "storage.users." + guytowithdraw + ".coins",
                    db.get("storage.users." + guytowithdraw + ".coins") - amount
                  );
                }
              } else {
                message.channel.send("du hast zu wenig coins!");
              }
            } else {
              message.reply(
                "du kannst in diesem spiel maximal mit 5k coins spielen! Falls du mehr infos willst, schreib Nuro#2005 an!"
              );
            }

            var autor = message.author.tag;

            for (let i = 0; i < 10; i++) {
              var a = randomNumProbability1(1, 2);
            }
            break;
          case "dice":
            
        }
    }
  }

  if (message.channel.id == "914307865139875910") {
    message.delete();
  }
});

bot.once("spawn", () => {
  console.log(mineflayer.Vec3);
  setInterval(() => {
    bot.onlinePlayers = [];
    for (const prop in bot.players) {
      bot.onlinePlayers.push(bot.players[prop].username);
    }
  }, 1000); // 0,69.-24

  console.log("spawned");
  bot.chat("/friend jump Qlei");
  setTimeout(() => {
    bot.chat("/p h qlei");
  }, 2000);
  setTimeout(() => {
    bot.chat("/p middle");
  }, 5000);
  setTimeout(() => {
    // bot.navigate.to(new vec3(1,69,-24));
  }, 1000);
  setInterval(() => {
    bot.chat(
      "Spiele auf discord mit deinen ingame coins casino! /p h qlei: 500 coins GESCHENKT!" +
        randomNumber(1, 10)
    );
  }, 1.8e6);
});
// Log errors and kick reasons:
bot.on("kicked", console.log);
bot.on("error", console.log);

client.login(discordToken);

bot.navigate.on("pathFound", function(path) {
  console.log("found path. I can get there in " + path.length + " moves.");
});

bot.navigate.on("arrived", function() {
  var entitytoattack = "idk";
  setTimeout(() => {
    bot.clickWindow("Normal", 0, 0);
    bot.nearestEntity(entity => {
      if (entity.mobType == "Armor Stand") {
        if (entity.metadata[2] == "§7Server: §aCityBuild") {
          console.log("starting to join  cb...");
        }
      }
    });
  }, 1000);
  console.log("Success!");
});
bot.navigate.on("interrupted", function() {
  console.error("something went wrong: path not correct");
});
