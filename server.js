const express = require("express");
const cors = require("cors");
require("dotenv").config();

const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

app.get("/", (req, res) => {
  res.send("✅ Onco-Buddy AI Backend is Running...");
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