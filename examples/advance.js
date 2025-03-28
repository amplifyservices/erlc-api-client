const ERLCClient = require('../src/core/Client');

const client = new ERLCClient('YOUR_API_KEY_HERE', {
  globalRateDelay: 1500,
  baseBackoffTime: 3000
});

client.on('rateLimit', (data) => {
  console.warn(`⚠️ Rate limited in ${data.bucket} bucket. Retrying in ${data.retryAfter}ms`);
});

client.on('backoff', (waitTime) => {
  console.warn(`⏳ Backing off for ${waitTime}ms due to errors`);
});

async function fullServerDiagnostics() {
  try {
    console.log('🚀 Starting comprehensive server analysis...');

    const [info, bans, modCalls, vehicles] = await Promise.all([
      client.server.getInfo(),
      client.server.getBans(),
      client.server.getModCalls(),
      client.server.getVehicles()
    ]);

    console.log('\n🔒 Security Status:');
    console.log(`- Active Bans: ${Object.keys(bans).length}`);
    console.log(`- Pending Mod Calls: ${modCalls.length}`);

    console.log('\n🚗 Vehicle Report:');
    vehicles.forEach(vehicle => {
      console.log(`- ${vehicle.Name} (Owner: ${vehicle.Owner})`);
    });

    if (info.CurrentPlayers > 0) {
      console.log('\n⚙️ Performing maintenance commands:');
      await client.commands.send(':weather clear');
      await client.commands.send(':time 12');
      console.log('✅ Reset weather and time');
    }

    setInterval(async () => {
      const players = await client.server.getPlayers();
      console.log(`\n👥 Current players (${players.length}):`, 
        players.map(p => p.Player.split(':')[0]));
    }, 60000);

  } catch (error) {
    console.error('💥 Critical Error:', error);
    process.exit(1);
  }
}

async function handleEmergency() {
  try {
    console.log('\n🚨 Initiating emergency protocol!');
    
    const players = await client.server.getPlayers();
    await Promise.all(players.map(player => 
      client.commands.send(`:respawn ${player.Player.split(':')[0]}`)
    ));
    
    await client.commands.send(':pt 300');
    console.log('✅ All players respawned, peace timer activated');

  } catch (error) {
    console.error('Emergency protocol failed:', error.message);
  }
}

fullServerDiagnostics().then(() => {
  setTimeout(handleEmergency, 120000);
});
