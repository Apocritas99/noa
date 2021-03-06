module.exports = class command extends require('../../base/models/Command.js') {
  constructor(client) {
    super(client, {
      name: 'banghead',
      description: 'Estampa tu cabeza con alguien o algo.',
      usage: prefix => `\`${prefix}banghead\``,
      examples: prefix => `\`${prefix}banghead\``,
      enabled: true,
      cooldown: 3,
      aliases: [],
      botPermissions: [],
      memberPermissions: [],
      dirname: __dirname
    });
  }
  async run(message, args, data, embed) {
    let client = this.client;
    try {
      embed
        .setDescription(client.replies.reply(this.help.name, message))
        .setColor('RANDOM')
        .setImage(client.replies.bangheadGifs());
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