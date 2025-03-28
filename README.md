# ERLC API Client 🚔

[![npm version](https://img.shields.io/npm/v/erlc-api-client)](https://www.npmjs.com/package/erlc-api-client)
[![License](https://img.shields.io/badge/License-MIT%20with%20Restrictions-blue)](LICENSE.md)

Enterprise-grade Node.js client for the Emergency Response: Liberty City API with built-in rate limiting, command validation, and real-time monitoring.

## Installation

```bash
npm install erlc-api-client
```
## Basic Usage
```js
const ERLCClient = require('erlc-api-client');

// Initialize client
const client = new ERLCClient({
  API_KEY: 'your_server_key_here'
});

// Connect and verify API key
client.connect()
  .then(serverInfo => {
    console.log(`Connected to ${serverInfo.Name}`);
  })
  .catch(err => {
    console.error('Connection failed:', err.message);
  });
```
## Features
- Automatic API key validation
- Built-in rate limiting
- Complete endpoint coverage
- Command validation system
- TypeScript support
- Event-driven architecture

## API Endpoints
All server endpoints return promises:
```js
// Get server information
const info = await client.server.getInfo();

// Get online players
const players = await client.server.getPlayers(); 

// Get ban list
const bans = await client.server.getBans();

// Full endpoint list:
// - getQueue()
// - getJoinLogs() 
// - getKillLogs()
// - getCommandLogs()
// - getModCalls()
// - getVehicles()
```

## Command System
Pre-validated command execution:
```js
// Send server message
await client.commands.send(':h Server shutdown soon');

// Change weather
await client.commands.send(':weather rain');

// Manage players
await client.commands.send(':ban RuleBreaker123');
```

## Supported Commands

| Command               | Parameters                     | Description                          | Example                     |
|-----------------------|--------------------------------|--------------------------------------|-----------------------------|
| `:h`, `:hint`        | `<message>`                   | Server-wide hint message             | `:h Server restarting soon` |
| `:m`, `:message`     | `<message>`                   | Server-wide message                  | `:m Important update`       |
| `:pm`                | `<player> <message>`          | Private message to player            | `:pm Player1 Hello!`        |
| `:weather`           | `clear/rain/fog/snow/thunderstorm` | Change weather                  | `:weather snow`             |
| `:time`              | `0-24`                        | Set time of day (0=midnight)         | `:time 18`                  |
| `:ban`               | `<player>`                    | Ban player                           | `:ban RuleBreaker`          |
| `:unban`             | `<player>`                    | Unban player                         | `:unban ReformedPlayer`     |
| `:jail`, `:arrest`   | `<player>`                    | Jail player                          | `:jail Suspect`             |
| `:unjail`            | `<player>`                    | Release from jail                    | `:unjail Player`            |
| `:wanted`            | `<player>`                    | Mark as wanted                       | `:wanted Criminal`          |
| `:unwanted`          | `<player>`                    | Remove wanted status                 | `:unwanted Player`          |
| `:admin`             | `<player>`                    | Grant admin                          | `:admin TrustedPlayer`      |
| `:unadmin`           | `<player>`                    | Revoke admin                         | `:unadmin Player`           |
| `:mod`               | `<player>`                    | Grant moderator                      | `:mod ResponsiblePlayer`    |
| `:unmod`             | `<player>`                    | Revoke moderator                     | `:unmod Player`             |
| `:helper`            | `<player>`                    | Grant helper                         | `:helper NewPlayer`         |
| `:unhelper`          | `<player>`                    | Revoke helper                        | `:unhelper Player`          |
| `:kill`              | `<player>`                    | Kill player                          | `:kill Player`              |
| `:heal`              | `<player>`                    | Heal player                          | `:heal InjuredPlayer`       |
| `:respawn`           | `<player>`                    | Respawn player                       | `:respawn Player`           |
| `:load`              | `<player>`                    | Load player character                | `:load Player`              |
| `:tp`, `:teleport`   | `<player1> <player2>`         | Teleport player to player            | `:tp Player1 Player2`       |
| `:to`                | -                             | Teleport to admin position           | `:to`                       |
| `:startfire`         | `house/brush/building`        | Start fire at location               | `:startfire house`          |
| `:stopfire`          | -                             | Extinguish all fires                 | `:stopfire`                 |
| `:prty`, `:priority` | `<seconds>`                   | Set priority timer                   | `:prty 300`                 |
| `:pt`, `:peacetimer` | `<seconds>`                   | Set peace timer                      | `:pt 600`                   |

**Notes:**
1. All player parameters accept either `PlayerName` or `PlayerName:ID` format
2. Time accepts 0-24 (where both 0 and 24 represent midnight)
3. Weather options are case-insensitive

## Error Handling
```js
try {
  await client.commands.send(':invalid-command');
} catch (err) {
  console.error(err.message); 
  // "Invalid command: :invalid-command"
}
```
## TypeScript Support
```ts
import ERLCClient from 'erlc-api-client';

const client = new ERLCClient({ API_KEY: 'key' });
// Full type checking available
```
