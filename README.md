# LostifyCityBuildBot
Open source Lostify City Build casino bot.
Use the bot to pay coins in / out. (more explaination below this)
I haven't finished this project and probably will never finish it. This is all I got and I'm uploading it because im bored.

# Setup

go to create a .env file and include all of these variables:
```
email=email
password=password
host=host
discordToken=token
WHURL=discord webhook url
```

replace email for the email of your minecraft account
replace password with the password of your minecraft account
replace host with the server ip you want the bot to connect to (should be lostify.net)
replace token with the Discord bot token you want the discord bot to be logged in
replace discord webhook url with the webhook you want to send ingame chat messages to
(implemented anti bot messages)

#usage



> Discord commands

| Command | Output |
| ------ | ------ |
| l!withdraw amount | makes the bot give the verified user his ingame coins, which he probably paid in.  |
| l!play game amount | this is this command to play with your coins. you can easily create new games. |
| l!balance  | this checks your coins, which are on the casino bank right now. (only yours, you cant see others coins) |
| l!chat message | makes the bot say stuff ingame, this is not secured and can cause damage, so better secure that if you want to use this project |
| l!clearcache | deletes the entire database including all generated tokens, verified users and their coins. |
| l!loginfo | logs bot information into the console (i used this to log global minecraft functions) |
| l!verify | sends the user, which activated the command a message with a token, with which you can verify your account on the minecraft server. |



> Ingame commands

| Command | Output |
| ------ | ------ |
| /verify token ign | makes you verify with your token |
| /play game | I havent added this command yet but im pretty sure this could work out |

to everyone who actually thinks about using this: why?

feel free to create issues, pull requests or anything like that.

