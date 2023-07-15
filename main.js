require('dotenv').config();
const {Client, Events, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, ActivityType} = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function command(i) {
    switch (i.commandName) {
        case 'ping':
            i.reply('Pong');
            break;
        case 'nap':
            if(i.member.voice.channel) {
                let time = i.options._hoistedOptions[0].value;
                if(isNaN(time)) { i.reply('`time` must be a number!'); return; }
                let unit = i.options._hoistedOptions[1].value;
                i.member.voice.setDeaf(true);
                i.member.voice.setMute(true);
    
                let unitTime = 0;
                if(unit == 'seconds') { unitTime = 1; }
                else if(unit == 'minutes') { unitTime = 60; }
                else if(unit == 'hours') { unitTime = 3600; }
                else { i.reply('`unit` must be: `seconds`, `minutes`, or `hours`!'); return; }
                let milliseconds = 1000 * parseFloat(time) * unitTime;
    
                const embed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle(`**Goodnight ${i.member.user.username}!**`)
                    .setDescription(`Putting ${i.member} to sleep for **${time} ${unit}**...`)
                    .setThumbnail(i.member.user.avatarURL())
                    .setTimestamp();
                i.reply({embeds: [embed]});
                setTimeout(function(){ 
                    i.member.voice.setDeaf(false);
                    i.member.voice.setMute(false);
                }, milliseconds);
                break;
            } else { i.reply('you must be in a voice channel!'); return; }
    }
}

client.once(Events.ClientReady, c =>{
    console.log(`Logged in as ${c.user.tag}`);

    client.user.setActivity("you sleep", {
        type: ActivityType.Watching,
    });

    const ping = new SlashCommandBuilder()
        .setName('ping')
        .setDescription('hi')

    const nap = new SlashCommandBuilder()
        .setName('nap')
        .setDescription('Take a nap!')
        .addStringOption((option) => option.setName('time').setDescription('How long do you want to sleep?').setRequired(true))
        .addStringOption((option) => option.setName('unit').setDescription('Choose a time unit.').setRequired(true).setChoices(
            {
                name: 'hours',
                value: 'hours'
            },
            {
                name: 'minutes',
                value: 'minutes'
            },
            {
                name: 'seconds',
                value: 'seconds'
            }
        ));    

    client.application.commands.create(ping);
    client.application.commands.create(nap);
});

client.on(Events.InteractionCreate, interaction => {
    if(!interaction.isChatInputCommand()) return;
    command(interaction);
});

client.login(process.env.TOKEN);

const express = require('express')
const app = express();
const port = 3000;
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})