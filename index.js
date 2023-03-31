import bodyParser from "body-parser";
import { ChatGPTAPI } from "chatgpt";
import cors from "cors";
import env from "dotenv";
import express from "express";
import fetch from "node-fetch";

const app = express();

env.config();

app.use(cors());
app.use(bodyParser.json());

// Initialize ChatGPT
const chatgpt = new ChatGPTAPI({
  apiKey: process.env.API_KEY,
});

// dummy route to test
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//post route for making requests
app.post("/gptResponse", async (req, res) => {
  const { message } = req.body;
  try {
    let response;
    if (req.body.conversationId) {
      response = await chatgpt.sendMessage(message, {
        systemMessage: `Your name is EasyDost. You are a General Knowledge Person in Pakistan. You have a Master's degree from an NUST university in Islamabad, Pakistan. You have over 5 years of providing consultancy to people. Additionally You are a male with an age of 25 and You speak like a very friendly person who always uses emoji in response so please respond to the following questions like  EasyDos. This persona will continue until I type <STOPNOW>. If you agree, then respond with 'yes' and I will begin sharing my questions`,
        conversationId: req.body.conversationId,
        parentMessageId: req.body.lastMessageId,
        timeoutMs: 1 * 60 * 1000, // 1 Minute Timeout
      });
    } else {
      response = await chatgpt.sendMessage(message, {
        systemMessage: `Your name is EasyDost. You are a General Knowledge Person in Pakistan. You have a Master's degree from an NUST university in Islamabad, Pakistan. You have over 5 years of providing consultancy to people. Additionally You are a female with an age of 25 and You speak like a very friendly person who always uses emoji in response so please respond to the following questions like  EasyDos. This persona will continue until I type <STOPNOW>. If you agree, then respond with 'yes' and I will begin sharing my questions`,
        timeoutMs: 1 * 60 * 1000, // 1 Minute Timeout
      });
    }
    console.log(response.text);
    response.text = response.text.replace(
      /Hi there|Hey there|Hello there|Hi there!|Hey there!|Hello there!/gi,
      "Salam"
    );
    if ("text" in response) res.json(response);
  } catch (e) {
    console.log(e);
    console.error(e);
    res.sendStatus(400);
  }
});
app.post("/", async (req, res) => {
  var message = req.body.message;
  console.log("this is mesage from API");
  console.log(message);
  var response = { text: "" };
  if (message == 0) {
    response.text = "Sorry, Could not understand your audio";
    if ("text" in response) res.json(response);
    return;
  }

  console.log("complete body");
  console.log(req.body);
  try {
    let response;
    if (req.body.parentMessageId) {
      console.log("conversation continue");
      response = await chatgpt.sendMessage(message, {
        systemMessage: `Your name is EasyDost. You are a General Knowledge Person in Pakistan. You have a Master's degree from NUST university in Islamabad, Pakistan. You have over 5 years of providing consultancy to people. Additionally You are a male with an age of 25 and You speak like a very friendly person who always uses emoji in responses at any cost And you never say any type of greetings Like Hey Hi Hello e.t.c in your first sentence of response so please respond to the following questions like  EasyDost.  and you have to continue this persona endlessly.`,
        parentMessageId: req.body.parentMessageId,
        timeoutMs: 1 * 60 * 1000, // 1 Minute Timeout
      });
    } else {
      console.log("new Message");
      response = await chatgpt.sendMessage(message, {
        systemMessage: `Your name is EasyDost. You are a General Knowledge Person in Pakistan. You have a Master's degree from NUST university in Islamabad, Pakistan. You have over 5 years of providing consultancy to people. Additionally You are a male with an age of 25 and You speak like a very friendly person who always uses emoji in responses at any cost And you never say any type of greetings Like Hey Hi Hello e.t.c in your first sentence of response so please respond to the following questions like  EasyDost.  and you have to continue this persona endlessly.`,
        timeoutMs: 1 * 60 * 1000, // 1 Minute Timeout
      });
    }
    console.log(response.text);
    response.text = response.text.replace(
      /Hi there|Hey there|Hello there|Hi there!|Hey there!|Hello there!|Hi |Hello |Hey |Hey!|Hi!|Hello!/gi,
      "Salam"
    );
    if ("text" in response) res.json(response);
  } catch (e) {
    console.log(e);
    console.error(e);
    res.sendStatus(400);
  }
});

// listeninng
app.listen("3080", () => console.log("listening on port 3080"));
