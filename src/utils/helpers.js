const validCommands = {
  tp: { 
    aliases: ['teleport'], 
    params: 2,
    description: 'Teleport player to another player',
    example: ':tp Player1 Player2'
  },
  
  weather: { 
    params: 1, 
    options: ['clear', 'thunderstorm', 'rain', 'fog', 'snow'],
    description: 'Change weather conditions',
    example: ':weather snow'
  },
  time: {
    params: 1,
    validator: (value) => {
      const hour = parseInt(value);
      return !isNaN(hour) && hour >= 0 && hour <= 24;
    },
    description: 'Set time of day (0-24)',
    example: ':time 18'
  },

  jail: {
    aliases: ['arrest'],
    params: 1,
    description: 'Jail a player',
    example: ':jail SuspectPlayer'
  },
  unjail: {
    params: 1,
    description: 'Release player from jail',
    example: ':unjail Player'
  },
  ban: {
    params: 1,
    description: 'Ban a player',
    example: ':ban RuleBreaker'
  },
  unban: {
    params: 1,
    description: 'Unban a player',
    example: ':unban ReformedPlayer'
  },
  wanted: {
    params: 1,
    description: 'Mark player as wanted',
    example: ':wanted Suspect'
  },
  unwanted: {
    params: 1,
    description: 'Remove wanted status',
    example: ':unwanted Player'
  },

  admin: {
    params: 1,
    description: 'Grant admin privileges',
    example: ':admin TrustedPlayer'
  },
  unadmin: {
    params: 1,
    description: 'Revoke admin privileges',
    example: ':unadmin Player'
  },
  mod: {
    params: 1,
    description: 'Grant moderator privileges',
    example: ':mod ResponsiblePlayer'
  },
  unmod: {
    params: 1,
    description: 'Revoke moderator privileges',
    example: ':unmod Player'
  },
  helper: {
    params: 1,
    description: 'Grant helper privileges',
    example: ':helper NewPlayer'
  },
  unhelper: {
    params: 1,
    description: 'Revoke helper privileges',
    example: ':unhelper Player'
  },

  h: {
    aliases: ['hint'],
    params: 1,
    description: 'Server-wide hint message',
    example: ':h Server restarting soon'
  },
  m: {
    aliases: ['message'],
    params: 1,
    description: 'Server-wide message',
    example: ':m Important announcement!'
  },
  pm: {
    aliases: ['privatemessage'],
    params: 2,
    description: 'Private message to player',
    example: ':pm Player Hello there!'
  },

  kill: {
    params: 1,
    description: 'Kill a player',
    example: ':kill Player'
  },
  heal: {
    params: 1,
    description: 'Heal a player',
    example: ':heal InjuredPlayer'
  },
  respawn: {
    params: 1,
    description: 'Respawn a player',
    example: ':respawn Player'
  },
  load: {
    params: 1,
    description: 'Load player character',
    example: ':load Player'
  },

  startfire: {
    params: 1,
    options: ['house', 'brush', 'building'],
    description: 'Start a fire at location',
    example: ':startfire house'
  },
  stopfire: {
    params: 0,
    description: 'Stop all fires',
    example: ':stopfire'
  },

  prty: {
    aliases: ['priority'],
    params: 1,
    validator: (value) => !isNaN(parseInt(value)),
    description: 'Set priority timer (seconds)',
    example: ':prty 300'
  },
  pt: {
    aliases: ['peacetimer'],
    params: 1,
    validator: (value) => !isNaN(parseInt(value)),
    description: 'Set peace timer (seconds)',
    example: ':pt 600'
  }
};

const blockedCommands = [
  'bring', 'bans', 'admins', 'mods', 'helpers', 
  'killlogs', 'kl', 'logs', 'commands', 'cmds', 'to'
];

function validateCommand(rawCommand) {
  if (!rawCommand.startsWith(':')) {
    throw new Error('Commands must start with a colon (e.g. ":h Hello")');
  }

  const [base, ...params] = rawCommand.slice(1).split(' ');
  const command = Object.keys(validCommands).find(cmd => 
    cmd === base || validCommands[cmd].aliases?.includes(base)
  );

  if (!command) {
    if (blockedCommands.includes(base)) {
      throw new Error(`Command :${base} is blocked by the API`);
    }
    throw new Error(`Invalid command: :${base}`);
  }

  const config = validCommands[command];
  if (params.length < config.params) {
    throw new Error(`:${command} requires ${config.params} parameter(s)`);
  }

  if (config.options && !config.options.includes(params[0].toLowerCase())) {
    throw new Error(`Invalid option for :${command}. Valid options: ${config.options.join(', ')}`);
  }

  return `:${[command, ...params].join(' ')}`;
}

module.exports = { validateCommand };
