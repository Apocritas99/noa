module.exports = class command extends require('../../base/models/Command.js') {
  constructor(client) {
    super(client, {
      name: 'boobs',
      description: 'Mira cosas inapropiadas e.e',
      usage: prefix => `\`${prefix}boobs\``,
      examples: prefix => `\`${prefix}\``,
      enabled: true,
      nsfwOnly: true,
      voteOnly: true,
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
      let msg = await message.channel.send(client.replies.generatingSomething(message)),
        img = await require('node-superfetch').get('https://nekos.life/api/v2/img/boobs');
      embed
        .setColor('RANDOM')
        .setDescription('...')
        .setImage(img.body.url);
      message.channel.send({ embed });
      msg.delete();
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
