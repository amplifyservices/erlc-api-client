# ERLC API Client

[![npm version](https://img.shields.io/npm/v/erlc-api-client)](https://www.npmjs.com/package/erlc-api-client) [![License](https://img.shields.io/badge/License-GPL--3.0%20with%20Restrictions-blue)](LICENSE.md)

**ERLC API Client** is an enterprise-grade Node.js client for the Emergency Response: Liberty City (ER:LC) API. It offers:

- Built-in rate limiting with an easy-to-use wrapper.
- Comprehensive command validation.
- Real-time monitoring.

---

## Installation

Install the package using npm:

```bash
npm install erlc-api-client
```

---

## Authentication

Initialize the client by providing your API key. Optionally, you can include a global key for increased rate limits:

```javascript
const ERLCClient = require("erlc-api-client");

const client = new ERLCClient({
  SERVER_KEY: "your_api_key", // Required for server access
  GLOBAL_KEY: "optional_global_key", // For increased rate limits (available to global key program participants)
});
```

---

## Rate Limits

The API enforces strict rate limits:

- **Standard:** 35 requests per minute (subject to change per application and server; applicable with SERVER_KEY only).
- **Increased:** Higher limits are available if you are part of the global key program (using GLOBAL_KEY).

Always monitor and respect the `x-ratelimit-*` headers included in API responses.

For detailed information on rate limits, please refer to the [PRC Rate Limits Documentation](https://apidocs.policeroleplay.community/for-developers/rate-limits).

---

## Basic Usage

When connecting to the API, the response is returned in JSON format. For example, connecting to the server yields a response like:

```json
{
  "Name": "API Test",
  "OwnerId": 1,
  "CoOwnerIds": [1],
  "CurrentPlayers": 1,
  "MaxPlayers": 1,
  "JoinKey": "APIServer",
  "AccVerifiedReq": "Disabled / Email / Phone/ID",
  "TeamBalance": true
}
```

Example code to connect and log the server name:

```javascript
client
  .connect()
  .then((serverInfo) => console.log(`Connected to ${serverInfo.Name}`))
  .catch((err) => console.error("Connection failed:", err.message));
```

---

## API Endpoints

All API methods return Promises with JSON responses. Here are some examples:

### Get Server Information

```javascript
const info = await client.server.getInfo();
```

Example response:

```json
{
  "Name": "API Test",
  "OwnerId": 1,
  "CoOwnerIds": [1],
  "CurrentPlayers": 1,
  "MaxPlayers": 1,
  "JoinKey": "APIServer",
  "AccVerifiedReq": "Disabled / Email / Phone/ID",
  "TeamBalance": true
}
```

### Get Online Players

```javascript
const players = await client.server.getPlayers();
```

Example response:

```json
[
  {
    "Player": "PlayerName:Id",
    "Permission": "Normal / Server Administrator / Server Owner / Server Moderator",
    "Callsign": "The player's callsign",
    "Team": "The player's team"
  }
]
```

### Get Join Logs

```javascript
const joinLogs = await client.server.getJoinLogs();
```

Example response:

```json
[
  {
    "Join": true,
    "Timestamp": 1704614400,
    "Player": "PlayerName:Id"
  }
]
```

### Additional Endpoints

The API also supports:

- **Players in Queue:** `/server/queue` – Returns an array of Roblox IDs.
- **Kill Logs:** `/server/killlogs` – Returns an array of kill log objects.
- **Command Logs:** `/server/commandlogs` – Returns an array of command log objects.
- **Moderator Call Logs:** `/server/modcalls` – Returns moderator call logs.
- **Bans:** `/server/bans` – Returns ban details.
- **Spawned Vehicles:** `/server/vehicles` – Returns details of vehicles spawned on the server.

For more information on these endpoints and their JSON response formats, see the [API Reference Documentation](https://apidocs.policeroleplay.community/for-developers/api-reference).

---

## Command System

The client includes a built-in command system that executes pre-validated commands directly on the server.

Example commands:

```javascript
// Send a server-wide message
await client.commands.send(":h Server shutting down soon");

// Change weather to rain
await client.commands.send(":weather rain");

// Ban a player
await client.commands.send(":ban RuleBreaker123");
```

### Supported Commands

| Command           | Parameters                         | Description                          |
| ----------------- | ---------------------------------- | ------------------------------------ |
| `:h` / `:hint`    | `<message>`                        | Display a server-wide hint message   |
| `:m` / `:message` | `<message>`                        | Display a server-wide message        |
| `:pm`             | `<player> <message>`               | Send a private message to a player   |
| `:weather`        | `clear/rain/fog/snow/thunderstorm` | Change the server weather            |
| `:time`           | `0-24`                             | Set the time of day (24-hour format) |
| `:ban`            | `<player>`                         | Ban a player from the server         |
| `:unban`          | `<player>`                         | Unban a player                       |
| `:jail`           | `<player>`                         | Jail a player                        |
| `:unjail`         | `<player>`                         | Release a player from jail           |
| `:wanted`         | `<player>`                         | Mark a player as wanted              |
| `:unwanted`       | `<player>`                         | Remove a player's wanted status      |
| `:admin`          | `<player>`                         | Grant admin privileges               |
| `:unadmin`        | `<player>`                         | Revoke admin privileges              |
| `:mod`            | `<player>`                         | Grant moderator privileges           |
| `:unmod`          | `<player>`                         | Revoke moderator privileges          |
| `:helper`         | `<player>`                         | Grant helper privileges              |
| `:unhelper`       | `<player>`                         | Revoke helper privileges             |
| `:kill`           | `<player>`                         | Kill a player                        |
| `:heal`           | `<player>`                         | Heal a player                        |
| `:respawn`        | `<player>`                         | Respawn a player                     |
| `:tp`             | `<player1> <player2>`              | Teleport one player to another       |
| `:startfire`      | `house/brush/building`             | Start a fire                         |
| `:stopfire`       | `-`                                | Extinguish all fires                 |
| `:priority`       | `<seconds>`                        | Set a priority timer                 |

**Notes:**

- Player identifiers can be specified as either `PlayerName` or `PlayerName:ID`.
- Time values are in 24-hour format (e.g., 0 = midnight).
- Weather options are case-insensitive.

---

## Error Handling

It is recommended to handle errors using try/catch blocks:

```javascript
try {
  await client.commands.send(":invalid-command");
} catch (err) {
  console.error(err.message); // "Invalid command: :invalid-command"
}
```

---

## TypeScript Support

The client supports TypeScript out-of-the-box:

```typescript
import ERLCClient from "erlc-api-client";
const client = new ERLCClient({ API_KEY: "your_api_key" });
```

---

## License

This project is licensed under the [ERLC API Client License](LICENSE.md) (GPL-3.0 with additional restrictions). By using this software, you agree to:

- Not publicly redistribute modified versions.
- Comply with Roblox and PRC Terms of Service.
- Provide proper attribution.

---

Feel free to explore the [API Reference Documentation](https://apidocs.policeroleplay.community/for-developers/api-reference) for more detailed information on endpoints and response formats.
