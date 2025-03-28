const ERLCClient = require('../src/core/Client');

const client = new ERLCClient('YOUR_API_KEY');

async function main() {
  try {
    const serverInfo = await client.server.getInfo();
    const players = await client.server.getPlayers();
    const bans = await client.server.getBans();
    const modCalls = await client.server.getModCalls();

    console.log('Server Status:', serverInfo.status);
    console.log('Online Players:', players.length);
    console.log('Active Bans:', Object.keys(bans).length);
    console.log('Recent Mod Calls:', modCalls.length);

    await client.commands.send(':h Server restart in 5 minutes!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
