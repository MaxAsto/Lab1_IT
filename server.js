const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = "8247872155:AAHR9fQDPMsD21niq6fejCMb_t4PQJ6IX-Y";
const CHAT_ID = "1108430521"; // твій chat_id

app.post('/sentry/webhook', async (req, res) => {
  const alertText = `Sentry Alert: ${JSON.stringify(req.body)}`;
  await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text: alertText
  });
  res.sendStatus(200);
});

app.listen(3000, () => console.log("Webhook server running on port 3000"));
