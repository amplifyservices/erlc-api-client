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

// Initialize with your API key
const client = new ERLCClient('YOUR_API_KEY_HERE');

async function monitorServer() {
  try {
    // Get server information
    const serverInfo = await client.server.getInfo();
    console.log(`Server Name: ${serverInfo.Name}`);
    console.log(`Players Online: ${serverInfo.CurrentPlayers}`);

    // Send server message
    await client.commands.send(':h Session shutdown in 10 minutes');
    console.log('Sent server notification');

  } catch (error) {
    console.error('Operation failed:', error.message);
  }
}

monitorServer();
```
## Advanced Usage
```js
const ERLCClient = require('erlc-api-client');

// Configure with custom settings
const client = new ERLCClient(process.env.ERLC_API_KEY, {
  globalRateDelay: 1500,
  baseBackoffTime: 3000
});

// Event listeners for monitoring
client.on('rateLimit', ({ bucket, retryAfter }) => {
  console.warn(`Rate limited in ${bucket} bucket. Retrying in ${retryAfter}ms`);
});

client.on('request', ({ endpoint, method }) => {
  analytics.trackRequest(method, endpoint);
});

async function fullServerManagement() {
  try {
    // Batch requests
    const [players, vehicles] = await Promise.all([
      client.server.getPlayers(),
      client.server.getVehicles()
    ]);

    // Command sequence with validation
    if (players.length > 0) {
      await client.commands.send(':weather clear');
      await client.commands.send(':time 12');
      console.log('Reset environment settings');
    }

    // Automated player management
    const bannedPlayers = await client.server.getBans();
    console.log(`Active bans: ${Object.keys(bannedPlayers).length}`);

  } catch (error) {
    console.error('Management error:', error);
  }
}

fullServerManagement();
```
## API Endpoints

| Endpoint                | Method | Implemented | Example Usage                     |
|-------------------------|--------|-------------|-----------------------------------|
| `/server`               | GET    | ✅          | `client.server.getInfo()`         |
| `/server/players`       | GET    | ✅          | `client.server.getPlayers()`      |
| `/server/bans`          | GET    | ✅          | `client.server.getBans()`         |
| `/server/vehicles`      | GET    | ✅          | `client.server.getVehicles()`     |
| `/server/command`       | POST   | ✅          | `client.commands.send()`          |
| `/server/joinlogs`      | GET    | ✅          | `client.server.getJoinLogs()`     |
| `/server/killlogs`      | GET    | ✅          | `client.server.getKillLogs()`     |
| `/server/commandlogs`   | GET    | ✅          | `client.server.getCommandLogs()`  |
| `/server/modcalls`      | GET    | ✅          | `client.server.getModCalls()`     |
| `/server/queue`         | GET    | ✅          | `client.server.getQueue()`        |

## Command Reference

| Command           | Parameters                   | Valid Example                   |
|-------------------|------------------------------|---------------------------------|
| `:h`/:hint       | Message                      | `:h Server restarting`         |
| `:weather`        | [clear/rain/fog/snow]        | `:weather snow`                |
| `:time`           | 0-24                         | `:time 18`                     |
| `:jail`/:arrest   | Player                       | `:jail Player123`              |
| `:ban`            | Player                       | `:ban RuleBreaker456`          |
| `:heal`           | Player                       | `:heal InjuredPlayer`          |
| `:admin`          | Player                       | `:admin TrustedUser`           |
| `:mod`            | Player                       | `:mod ResponsiblePlayer`       |
| `:wanted`         | Player                       | `:wanted SuspectPlayer`        |
| `:unjail`         | Player                       | `:unjail ReleasedPlayer`       |

```js
// Example command sequence
async function handleAction() {
  try {
    await client.commands.send(':h Defaulting weather and time.');
    await client.commands.send(':weather clear');
    await client.commands.send(':time 12');
    console.log('The weather and time are now at a "default" setting.');
  } catch (error) {
    console.error('Failed action sequence:', error.message);
  }
}
```
