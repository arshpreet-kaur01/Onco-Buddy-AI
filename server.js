const express = require("express");
const path= require("path");
const cors = require("cors");
require("dotenv").config();

const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static((__dirname)));
app.get("/", (req, res) => {
  console.log("ROOT ROUTE HIT");
  res.sendFile(path.join(__dirname, "index.html"));
});

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("Message:", message);

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      reply: "Sorry! AI is not responding right now.",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});