const { Client } = require(`../dist/index.js`);
const { token, publicKey } = require(`./config.json`); // 🤭

const client = new Client({ port: 3000, token, publicKey });

client.events.once("ready", () => {
  console.log(`Ready!`);
});

client.events.on("command", async (interaction) => {
  await interaction.reply({ content: "abc", ephemeral: true });

  const followUp = await interaction.followUp.create({
    content: "ada",
    ephemeral: true,
  });

  setTimeout(async () => {
    const res = await interaction.followUp.edit({
      content: `edited!`,
    });
  }, 5000);
});

client.start();
