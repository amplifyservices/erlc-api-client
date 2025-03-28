const ERLCClient = require('../src/core/Client');

const client = new ERLCClient('YOUR_API_KEY');

async function main() {
  try {
    const serverInfo = await client.server.getInfo();
    console.log('Server Status:', serverInfo.status);
    
    const bans = await client.players.getBans();
    console.log('Active Bans:', bans);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
