const { Webhook } = require("discord-webhook-node");
const getHead = require("./getHead.js")
function sendHook(config) {
  if (typeof config === "object" && !Array.isArray(config) && config !== null) {
    let hook =
      new Webhook("https://discord.com/api/webhooks/914015814640893964/WmOMAx4K0YNIzOevqU9cdxnoe3HNITCMAtY9Xcnj1CBMUChY0Pz1hC25NE0jzr5ubuLz");
    let IMAGE_URL = getHead(config.username)
    hook.setUsername(config.username);
    hook.setAvatar(IMAGE_URL);
    let realmsg = config.message
    realmsg = realmsg.replace(/@/g, "")
    if(!realmsg) return
    
    
    hook.send(realmsg);
  }
}

module.exports = sendHook;