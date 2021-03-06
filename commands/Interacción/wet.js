module.exports = class command extends require('../../base/models/Command.js') {
  constructor(client) {
    super(client, {
      name: 'wet',
      description: 'Moja a un usuario.',
      usage: prefix => `\`${prefix}wet <@usuario>\``,
      examples: prefix => `\`${prefix}\``,
      enabled: true,
      guildOnly: true,
      aliases: ['splash', 'mojar'],
      botPermissions: [],
      memberPermissions: [],
      dirname: __dirname
    });
  }
  async run(message, args, data, embed) {
    let client = this.client;
    try {
      if (message.mentions.users.first() === message.author) return message.channel.send('Por favor **' + message.author.username + '**, si te mojas tú solo, te van a regañar...');
      if (message.mentions.users.first() == client.user) return message.channel.send('Lo siento, ya me bañé :)');
      if (message.mentions.users.size < 1) return message.channel.send('Piensa a quien quieres mojar 💦');
      embed
        .setColor('RANDOM')
        .setDescription('**' + message.author.username + '** está mojando a **' + message.mentions.users.first().username + '**')
        .setImage(client.replies.wetGifs());
      message.channel.send({ embed });
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
