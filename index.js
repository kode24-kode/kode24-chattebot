import express from "express";
import httpHandler from "http";
import socketIO from "socket.io";
import path from "path";

const io = socketIO(http);
const app = express();
const http = httpHandler.Server(app);

app.use(express.static(path.join(__dirname, "client"))); // gjør statiske filer som stilarket tilgjengelig

app.get("*", (req, res) => {
  // gjør index.html tilgjengelig på alt av server-urler
  res.sendFile(path.join(__dirname + "/client/index.html"));
});

// verdens dummeste "AI"
function parseQuestion(question) {
  if (question.indexOf("beste by") > -1) {
    return "Porsgrunn er Norges beste by";
  }
  if (question.indexOf("er du") > -1) {
    return "Jeg er en chattebot";
  }
  if (question.indexOf("vits") > -1) {
    return "Hva får du hvis du kloner en sjørøver? Svar: En piratkopi";
  }
  if (question.indexOf("addresse") > -1) {
    return "kode24.no, seffern";
  }
  return "Aner ikke..";
}
// alle brukere kobler til og får en egen socket id og objekt
io.on("connection", socket => {
  // lytt etter beskjeden "chat message"
  socket.on("chat message", message => {
    setTimeout(() => {
      var reply = parseQuestion(message);

      //send ut en beskjed til brukeren
      socket.emit("chat reply", reply);
    }, 1000); // lat som vi bruker et sekund på å svare
  });
});

http.listen(process.env.PORT || 3000, () => {
  console.log("listening on port 3000");
});
