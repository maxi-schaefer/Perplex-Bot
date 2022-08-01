const { Client } = require('discord.js')

/** 
 * @param { Client } client
 */
function loadComponents(client) {
    const ascii = require('ascii-table');
    const fs = require('fs')
    const table = new ascii().setHeading("Components", "Type", "Status")

    const componentFolder = fs.readdirSync(`./src/components`);
    for (const folder of componentFolder) {
        const componentFiles = fs.readdirSync(`./src/components/${folder}`).filter(file => file.endsWith('.js'));

        const { modals, buttons } = client;
        switch (folder) {
            case "buttons": {
                for (const file of componentFiles) {
                    const button = require(`../components/${folder}/${file}`)
                    buttons.set(button.data.name, button);
                    table.addRow(file, "button", "✅");
                }
            }
            break;

            case "modals": {
                for (const file of componentFiles) {
                    const modal = require(`../components/${folder}/${file}`)
                    modals.set(modal.data.name, modal)
                    table.addRow(file, "modal", "✅");
                }
            }
            break;
        
            default:
                break;
        }
        continue;
    }

    return console.log(table.toString(), "\nLoaded Components!");
}

module.exports = { loadComponents }