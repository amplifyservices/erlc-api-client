const ERLCClient = require('../src/core/Client');

const client = new ERLCClient('YOUR_API_KEY_HERE');

async function main() {
  try {
    const serverInfo = await client.server.getInfo();
    console.log('📡 Server Status:');
    console.log(`- Name: ${serverInfo.Name}`);
    console.log(`- Players: ${serverInfo.CurrentPlayers}/${serverInfo.MaxPlayers}`);
    console.log(`- Verified Required: ${serverInfo.AccVerifiedReq}`);

    const players = await client.server.getPlayers();
    console.log('\n🎮 Online Players:');
    players.forEach(player => {
      console.log(`- ${player.Player} (${player.Team})`);
    });

    await client.commands.send(':h This is an automated message!');
    console.log('\n📢 Sent server notification');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
