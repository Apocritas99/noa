module.exports = class command extends require('../../base/models/Command.js') {
  constructor(client) {
    super(client, {
      name: 'dance',
      description: 'Demuestra tus verdaderas hábilidades en el baile y deja boquiabierto a los demás.',
      usage: prefix => `\`${prefix}dance\``,
      examples: prefix => `\`${prefix}dance\``,
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
        .setImage(client.replies.danceGifs());
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