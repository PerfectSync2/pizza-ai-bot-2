const express = require("express");
const bodyParser = require("body-parser");
const voiceRoute = require("./routes/voice");
const transcriptionRoute = require("./routes/transcription");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/voice", voiceRoute);
app.use("/transcription", transcriptionRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Pizza AI server running on port ${PORT}`);
});