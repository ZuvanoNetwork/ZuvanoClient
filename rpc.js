const RPC = require('discord-rpc');

const clientId = '1455951945834561556';

RPC.register(clientId);

const rpc = new RPC.Client({
  transport: 'ipc'
});

async function setActivity() {
  if (!rpc) return;

  rpc.setActivity({
    details: 'Browsing Zuvano',
    state: 'Desktop Client',
    startTimestamp: new Date(),
    largeImageKey: 'logo',
    largeImageText: 'Zuvano',
    buttons: [
      {
        label: 'Open Zuvano',
        url: 'https://zuvano.eu'
      }
    ]
  });
}

rpc.on('ready', async () => {
  console.log('Discord RPC verbunden');
  setActivity();

  setInterval(() => {
    setActivity();
  }, 15000);
});

rpc.login({ clientId }).catch(console.error);