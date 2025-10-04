const express = require("express");
const app = express();
const fs = require("fs");
const { on } = require("process");

// IMPORTANT!!!
// If you want your messages to be remembered across server sessions,
// set this to false.
const CLEAR_MESSAGES_ON_RESET = true;

app.use(express.json());

let messages = [];

// Initialise messages file
if (fs.existsSync("messages.json")) {
  try {
    messages = JSON.parse(fs.readFileSync("messages.json"));
  } catch (error) {
    console.error("Error parsing messages.json:", error);
  }
} else {
  fs.writeFileSync("messages.json", JSON.stringify(messages));
}

function newMessage(message) {
  console.log("New message: " + message);
  messages.push(message);
  fs.writeFileSync("messages.json", JSON.stringify(messages));
}

function loadMessages() {
  try {
    messages = JSON.parse(fs.readFileSync("messages.json"));
  } catch (error) {
    console.error("Error parsing messages.json:", error);
  }
  return messages;
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/messages", (req, res) => {
  res.json(loadMessages());
});

app.post("/message", (req, res) => {
  const message = req.body.message;
  newMessage(message);
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("listening on port *:3000");
});

// On ^C
process.on("SIGINT", () => {
  if (CLEAR_MESSAGES_ON_RESET) {
    // Delete messages from file
    console.log("\nDeleting messages from JSON...");
    fs.writeFileSync("messages.json", JSON.stringify([]));
  } else {
    console.log("Messages are saved in 'messages.json'.");
  }

  // Shutdown server
  console.log("Shutting down...");
  process.exit(0);
});
