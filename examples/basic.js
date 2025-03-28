const ERLCClient = require('../src/Client');

async function main() {
  const client = new ERLCClient({
    API_KEY: 'your_api_key_here',
    enableLogging: true
  });

  try {
    await client.connect();
    
    const [info, players] = await Promise.all([
      client.server.getInfo(),
      client.server.getPlayers()
    ]);
    
    console.log(`🚓 Officers Online: ${players.filter(p => p.Team === 'Police').length}`);
    
    await client.commands.send(':h Balance out the teams!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
