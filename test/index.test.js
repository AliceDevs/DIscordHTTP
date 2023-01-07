const { Client } = require(`../dist/index.js`);
const { token, publicKey } = require(`./config.json`); // 🤭

const client = new Client({ port: 3000, token, publicKey });

client.events.once("ready", () => {
  console.log(`Ready!`);
});

client.start();
