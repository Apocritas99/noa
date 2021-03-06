module.exports = class command extends require('../../base/models/Command.js') {
  constructor(client) {
    super(client, {
      name: 'cat',
      description: 'Lindos gatitos para todos. 🐱',
      usage: prefix => `\`${prefix}cat\``,
      examples: prefix => `\`${prefix}cat\``,
      enabled: true,
      aliases: ['kitty', 'gato'],
      botPermissions: [],
      memberPermissions: [],
      dirname: __dirname
    });
  }
  async run(message, args, data, embed) {
    let client = this.client;
    try {
      let img = await require('node-superfetch').get('https://nekos.life/api/v2/img/meow'),
        msg = await message.channel.send(new (require('discord.js')).MessageEmbed().setColor(client.functions.selectColor('lightcolors')).setDescription(client.replies.generatingSomething(message)));
      embed
        .setColor(client.functions.selectColor('lightcolors'))
        .setAuthor('¡Meow! ฅ^•ﻌ•^ฅ', 'https://i.imgur.com/mor5NWd.png')
        .setImage(img.body.url);
      msg.edit({ embed });
    } catch (e) {
      message.channel.send(message.error(e));
      client.err({
        type: 'command',
        name: this.help.name,
        error: e
      });
    }
  }
};
