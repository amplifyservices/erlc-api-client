class Commands {
  constructor(requestHandler) {
    this.request = requestHandler;
    this.validCommands = {
      tp: { aliases: ['teleport'], params: 2 },
      to: { params: 0 },
      weather: { params: 1, options: ['clear', 'thunderstorm', 'rain', 'fog', 'snow'] },
      kill: { params: 1 },
      helper: { params: 1 },
      unhelper: { params: 1 },
      mod: { params: 1 },
      unmod: { params: 1 },
      admin: { params: 1 },
      unadmin: { params: 1 },
      h: { aliases: ['hint'], params: 1 },
      m: { aliases: ['message'], params: 1 },
      pm: { aliases: ['privatemessage'], params: 2 },
      ban: { params: 1 },
      unban: { params: 1 },
      prty: { aliases: ['priority'], params: 1 },
      pt: { aliases: ['peacetimer'], params: 1 },
      wanted: { params: 1 },
      unwanted: { params: 1 },
      startfire: { params: 1, options: ['house', 'brush', 'building'] },
      stopfire: { params: 0 },
      heal: { params: 1 },
      jail: { aliases: ['arrest'], params: 1 },
      unjail: { params: 1 },
      load: { params: 1 },
      respawn: { params: 1 },
      time: { params: 1, validator: (value) => {
        const hour = parseInt(value);
        return !isNaN(hour) && hour >= 0 && hour <= 24;
      }},
    };

    this.blockedCommands = [
      'view', 'tocar', 'bring', 'bans', 'admins', 'mods', 'helpers',
      'killlogs', 'kl', 'logs', 'commands', 'cmds', 'startnearfire', 'toatv'
    ];
  }

  validateCommand(rawCommand) {
    const [base, ...params] = rawCommand.slice(1).split(' ');
    const command = Object.keys(this.validCommands).find(cmd => 
      cmd === base || this.validCommands[cmd].aliases?.includes(base)
    );

    if (!command) {
      if (this.blockedCommands.includes(base)) {
        throw new Error(`Command :${base} is not supported by the API`);
      }
      throw new Error(`Invalid command: :${base}`);
    }

    const config = this.validCommands[command];
    if (params.length < config.params) {
      throw new Error(`Command :${command} requires ${config.params} parameters`);
    }

    if (config.options && !config.options.includes(params[0])) {
      throw new Error(`Invalid option for :${command}. Valid options: ${config.options.join(', ')}`);
    }

    if (config.validator && !config.validator(params[0])) {
      throw new Error(`Invalid parameter for :${command}`);
    }

    return `:${[command, ...params].join(' ')}`;
  }

  async send(rawCommand) {
    const validatedCommand = this.validateCommand(rawCommand);
    const response = await this.request.execute('/server/command', 'POST', { 
      command: validatedCommand 
    });

    if (response.status === 422) {
      throw new Error('Cannot execute command - no players in server');
    }

    return response.data;
  }
}

module.exports = Commands;
