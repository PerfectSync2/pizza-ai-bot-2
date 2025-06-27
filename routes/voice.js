const express = require("express");
const { VoiceResponse } = require("twilio").twiml;
const router = express.Router();

router.post("/", (req, res) => {
  const response = new VoiceResponse();
  const now = new Date().toLocaleTimeString("en-US", { hour12: true });

  response.say(`Hello, and thank you for calling 900 Degrees Woodfired Pizza. This is your AI assistant. Please tell me your order or ask a question.`);

  response.record({
    timeout: 5,
    transcribe: false,
    maxLength: 30,
    playBeep: true,
    recordingStatusCallback: "/transcription"
  });

  res.type("text/xml");
  res.send(response.toString());
});

module.exports = router;