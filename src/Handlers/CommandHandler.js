const { Client } = require('discord.js')

/**
 * @param {Client} client 
 */
function loadCommands(client) {
    const ascii = require('ascii-table')
    const fs = require('fs')
    const table = new ascii().setHeading("Commands", "Type", "Status")

    let commandsArray = [];
    let developerArray = [];

    const commandsFolder = fs.readdirSync("./src/commands");
    for(const folder of commandsFolder) {
        const commandFiles = fs.readdirSync(`./src/commands/${folder}/`)
        .filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
            const commandFile = require(`../commands/${folder}/${file}`)

            client.commands.set(commandFile.data.name, commandFile)

            if(commandFile.developer) developerArray.push(commandFile.data.toJSON())
            else commandsArray.push(commandFile.data.toJSON());

            table.addRow(file, folder, "✅");
            continue;
        }
    }

    client.application.commands.set(commandsArray)

    const developerGuild = client.guilds.cache.get(client.config.developerGuild)

    developerGuild.commands.set(developerArray);

    return console.log(table.toString(), "\nLoaded Commands!")
}

module.exports = { loadCommands }