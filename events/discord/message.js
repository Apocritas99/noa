module.exports = class event {
  constructor(client) {
    this.client = client;
  }
  async run(message) {
    let client = this.client,
      cooldowns = client.cooldowns,
      data = {},
      embed = new (require('discord.js')).MessageEmbed(),
      errE = await client.emojis.get('605488260361224208'),
      boostB = await client.emojis.get('669280929704968202'),
      Weez = require('weez'),
      weez = new Weez.WeezAPI(client.config.weezKey);
    try {
      client.demo = {
        error: errE.toString()
      };
      client.weez = weez;
      message.error = e => `${client.demo.error} | **${message.author.username}**, ha ocurrido un error. Por favor repórtalo en mi servidor de soporte <https://noa.wwmon.xyz/support/>\nError:\`\`\`js\n${e.toString()}\`\`\``;
      if (message.author.bot) return;
      data.user = await client.findOrCreateUser({ id: message.author.id });
      if (message.guild) {
        data.guild = await client.findOrCreateGuild({ id: message.guild.id });
        data.member = await client.findOrCreateMember({ id: message.member.user.id, guildID: message.guild.id });
      }
      message.prefix = message.guild ? data.guild.prefix : client.config.prefix;
      if (message.author) {
        if (client.afk.get(message.author.id)) {
          client.afk.delete(message.author.id);
          let msg = await message.channel.send('¡Bienvenido de nuevo **' + message.author.username + '**!');
          msg.delete({ timeout: 10000 });
        }
      }
      //if (message.guild) {}
      //if (message.member) {}
      if (message.mentions.users.first()) {
        let hijo = client.afk.get(message.mentions.users.first().id);
        if (hijo) return message.channel.send('El usuario que has mencionado está afk por: ' + hijo.reason);
      }
      if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
        message.channel.send('¡Hola! Soy ' + client.config.bot + ', para conocer más de mí puedes consultar con `' + message.prefix + 'help`.');
      }
      let prefix = client.functions.getPrefix(message, data);
      if (!prefix) return;
      let args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);
      let cmD = args.shift().toLowerCase();
      let cmd = client.commands.get(cmD) || client.commands.get(client.aliases.get(cmD));
      if (!cmd) return;
      if (!cooldowns.has(cmd.help.name)) {
        cooldowns.set(cmd.help.name, new (require('discord.js')).Collection());
      }
      let now = Date.now(),
        timestamps = cooldowns.get(cmd.help.name),
        cooldownAmount = (cmd.help.cooldown ? cmd.help.cooldown : 2.5) * 1000;
      if (timestamps.has(message.author.id)) {
        let expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
          let timeLeft = (expirationTime - now) / 1000;
          let msg = await message.channel.send(`${client.demo.error} | **${message.author.username}**, por favor espera ${timeLeft.toFixed(1)} segundo(s) antes de seguir utilizando el comando \`${cmd.help.name}\`.`);
          await msg.delete({ timeout: 5000 });
          return;
        }
      }
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      if (data.user.blacklist.bl === true) return message.channel.send(`${client.demo.error} | **${message.author.username}**, tienes acceso denegado.\n\n> **Tipo:** Blacklist\n> **Razón:** ${data.user.blacklist.blreason}\n*Si crees que esto es un error o deseas apelar, dirígete al servidor de soporte.*`);
      if (!cmd.config.botPermissions.includes('SEND_MESSAGES' || 'EMBED_LINKS')) cmd.config.botPermissions.push('SEND_MESSAGES', 'EMBED_LINKS');
      if (!cmd.config.enabled) return message.channel.send(`${client.demo.error} | **${message.author.username}**, este comando no se encuentra habilitado. Por favor intentalo más tarde...`);
      if (cmd.help.category === 'Moderación' && !client.config.owners.includes(message.author.id)) return message.channel.send(`${client.demo.error} | **${message.author.username}**, el módulo de moderación está deshabilitado por el momento.`);
      if (cmd.config.ownerOnly === true && !client.config.owners.includes(message.author.id)) return message.channel.send(`${client.demo.error} | **${message.author.username}**, el comando solo puede ser utilizado por un desarrollador.`);
      if (cmd.config.guildOnly === true && !message.guild) return message.channel.send(`${client.demo.error} | **${message.author.username}**, este comando está destinado para ser utilizado vía servidor.`);
      if (cmd.config.nsfwOnly === true && !message.channel.nsfw) {
        let img = await require('node-superfetch').get('https://nekos.life/api/v2/img/meow'),
          attach = new (require('discord.js')).MessageAttachment(img.body.url, 'meow.png');
        message.channel.send(`${client.demo.error} | **${message.author.username}**, antes de volvernos locos, dirígete a un canal NSFW. Por mientras te dejo un lindo gatito.`, { files: [attach] });
        return;
      }
      if (cmd.config.voteOnly && !(await client.dbl.hasVoted(message.author.id))) return message.channel.send(`${client.demo.error} | **${message.author.username}**, necesitas votar por ${client.config.bot} en Discord Bot List para tener acceso a este comando. <https://noa.wwmon.xyz/vote/>\nSi ya votaste y te sigue saliendo este mensaje, por favor repórtalo en nuestro servidor de soporte <https://noa.wwmon.xyz/support/>`);
      if (message.guild) {
        let a = [];
        cmd.config.memberPermissions.forEach(p => {
          if (!message.channel.permissionsFor(message.member).has(p)) {
            a.push(p);
          }
        });
        if (a.length > 0) return message.channel.send(`${client.demo.error} | **${message.author.username}**, necesitas los siguientes permisos para usar este comando: ${a.map(p => `\`${p}\``).join('`, `')}`);
        a = [];
        cmd.config.botPermissions.forEach(p => {
          if (!message.channel.permissionsFor(message.guild.me).has(p)) {
            a.push(p);
          }
        });

        if (a.length > 0) return message.channel.send(`${client.demo.error} | **${message.author.username}**, necesito los siguientes permisos para usar este comando: ${a.map(p => `\`${p}\``).join('`, `')}`);
      }
      try {
        cmd.run(message, args, data, embed);
        let u = new (require('discord.js')).MessageEmbed()
          .setColor(client.functions.selectColor('lightcolors'))
          .addField('• Comando', `\`${cmd.help.name}\``)
          .addField('• Usuario', `\`[${message.author.tag}]\` \`(${message.author.id})\``)
          .addField('• Servidor', `${message.guild ? `\`[${message.guild.name}]\` \`(${message.guild.id})\`` : '`[Mensajes privados]`'}`);
        client.logs.send(u);
      } catch (e) {
        console.error(e);
      }
    } catch (e) {
      console.error(e);
    }
  }
};
