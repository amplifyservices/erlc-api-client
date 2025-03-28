# ERLC API Client

[![npm version](https://img.shields.io/npm/v/erlc-api-client)](https://www.npmjs.com/package/erlc-api-client)
[![License](https://img.shields.io/badge/License-GPL--3.0%20with%20Restrictions-blue)](LICENSE.md)

An enterprise-grade Node.js client for the Emergency Response: Liberty City (ER:LC) API, featuring:
- **Built-in rate limiting**
- **Command validation**
- **Real-time monitoring**

## Installation

```bash
npm install erlc-api-client
```

## Authentication

```javascript
const ERLCClient = require('erlc-api-client');

const client = new ERLCClient({
  SERVER_KEY: 'your_server_key', // Required
  GLOBAL_KEY: 'optional_global_key' // For increased rate limits
});
```

## Rate Limits
The API enforces strict rate limits:
- **Standard:** 35 requests/minute *(with SERVER_KEY only)*
- **Increased:** Higher limits apply if you are part of the program *(with GLOBAL_KEY)*

Always respect the `x-ratelimit-*` headers when making API requests.

```javascript
client.connect()
  .then(info => console.log(`Connected to ${info.Name}.`))
  .catch(err => console.error('Connection failed:', err.message));
```

## Basic Usage
```javascript
const client = new ERLCClient({ API_KEY: 'your_server_key_here' });

client.connect()
  .then(serverInfo => console.log(`Connected to ${serverInfo.Name}`))
  .catch(err => console.error('Connection failed:', err.message));
```

## Features
- **Automatic API key validation**
- **Complete endpoint coverage**
- **Event-driven architecture**
- **TypeScript support**

## API Endpoints
All API methods return Promises:
```javascript
// Get server information
const info = await client.server.getInfo();

// Get online players
const players = await client.server.getPlayers();

// Get ban list
const bans = await client.server.getBans();
```

## Command System
Execute pre-validated commands directly from the client:
```javascript
// Send server-wide message
await client.commands.send(':h Server shutting down soon');

// Change weather
await client.commands.send(':weather rain');

// Ban a player
await client.commands.send(':ban RuleBreaker123');
```

## Supported Commands

| Command       | Parameters | Description |
|--------------|------------|-------------|
| `:h` / `:hint` | `<message>` | Server-wide hint message |
| `:m` / `:message` | `<message>` | Server-wide message |
| `:pm` | `<player> <message>` | Private message to player |
| `:weather` | `clear/rain/fog/snow/thunderstorm` | Change weather |
| `:time` | `0-24` | Set time of day |
| `:ban` | `<player>` | Ban player |
| `:unban` | `<player>` | Unban player |
| `:jail` | `<player>` | Jail player |
| `:unjail` | `<player>` | Release from jail |
| `:wanted` | `<player>` | Mark as wanted |
| `:unwanted` | `<player>` | Remove wanted status |
| `:admin` | `<player>` | Grant admin |
| `:unadmin` | `<player>` | Revoke admin |
| `:mod` | `<player>` | Grant moderator |
| `:unmod` | `<player>` | Revoke moderator |
| `:helper` | `<player>` | Grant helper |
| `:unhelper` | `<player>` | Revoke helper |
| `:kill` | `<player>` | Kill player |
| `:heal` | `<player>` | Heal player |
| `:respawn` | `<player>` | Respawn player |
| `:tp` | `<player1> <player2>` | Teleport player |
| `:startfire` | `house/brush/building` | Start fire |
| `:stopfire` | `-` | Extinguish all fires |
| `:priority` | `<seconds>` | Set priority timer |

### Notes
1. Player parameters accept either `PlayerName` or `PlayerName:ID` format.
2. Time uses a 24-hour format (0 = midnight).
3. Weather options are case-insensitive.

## Error Handling
```javascript
try {
  await client.commands.send(':invalid-command');
} catch (err) {
  console.error(err.message);  // "Invalid command: :invalid-command"
}
```

## TypeScript Support
```typescript
import ERLCClient from 'erlc-api-client';
const client = new ERLCClient({ API_KEY: 'your_key' });
```

## License
This project is licensed under the [ERLC API Client License](LICENSE.md) (GPL-3.0 with additional restrictions). By using this software, you agree to:
- Not publicly redistribute modified versions
- Comply with Roblox and PRC Terms of Service
- Provide proper attribution

