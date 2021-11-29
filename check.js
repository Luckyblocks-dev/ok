const Discord = require("discord.js");
const client = new Discord.Client();
let wait = require('util').promisify(setTimeout)
const fs = require('fs')

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"))
for(const file of commandFiles){
  const command = require(`./commands/${file}`)

  client.commands.set(command.name, command)
}

client.on("ready", () => {
    console.log(`ok`);
    client.user.setActivity('BETA', { type: 'WATCHING' });
  });


client.on("message", async message => {

    const args = message.content.split(" ")

    console.log(args)

    if(message.author.id === '909918176626737174'){return}

    const tolow = message.content.toLowerCase()
    const checkmsg = tolow.split(" ")

    if(checkmsg[0] === '.check'){
      client.commands.get('check').execute(message,args,client)
    }
})

client.login("no");
