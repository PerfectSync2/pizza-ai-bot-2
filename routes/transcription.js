const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const { generateAIResponse } = require("../utils/aiLogic");
const { sendDebugEmail } = require("../utils/emailer");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const recordingUrl = req.body.RecordingUrl;
    const audioPath = path.join(__dirname, "../audio.mp3");

    const writer = fs.createWriteStream(audioPath);
    const audioResponse = await axios({
      url: `${recordingUrl}.mp3`,
      method: "GET",
      responseType: "stream"
    });

    audioResponse.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    const formData = new FormData();
    formData.append("file", fs.createReadStream(audioPath));
    formData.append("model", "whisper-1");

    const whisper = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    const userText = whisper.data.text;
    const aiReply = await generateAIResponse(userText);

    await sendDebugEmail(userText, aiReply);

    const twiml = new require("twilio").twiml.VoiceResponse();
    twiml.say(aiReply);
    twiml.hangup();

    res.type("text/xml");
    res.send(twiml.toString());

  } catch (error) {
    console.error("❌ Transcription error:", error.message);
    res.status(500).send("Error handling transcription.");
  }
});

module.exports = router;