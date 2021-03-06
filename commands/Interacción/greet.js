module.exports = class command extends require('../../base/models/Command.js') {
  constructor(client) {
    super(client, {
      name: 'greet',
      description: 'Saluda a uno de tus compas, como buen amigo que eres.',
      usage: prefix => `\`${prefix}greet <@usuario>\``,
      examples: prefix => `\`${prefix}\``,
      enabled: true,
      ownerOnly: false,
      guildOnly: false,
      cooldown: 3,
      aliases: ['wave', 'saludar'],
      botPermissions: [],
      memberPermissions: [],
      dirname: __dirname
    });
  }
  async run(message, args, data, embed) {
    let client = this.client;
    try {
      if (message.mentions.users.first() === message.author) return message.channel.send('Si solamente quieres saludar utiliza `' + message.prefix + 'hello` ^^');
      if (message.mentions.users.first() === client.user) return message.channel.send('¿En serio me quieres dar un saludo? u.u');
      if (message.mentions.users.size < 1) return message.channel.send('¡Vamos, decide a quién deseas dar un delicioso saludo!');
      embed
        .setColor('RANDOM')
        .setDescription('**' + message.author.username + '** saluda a **' + message.mentions.users.first().username + '**')
        .setImage(client.replies.greetGifs());
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
