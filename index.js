var express = require("express");
var app = express();
var path = require("path");
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static(path.join(__dirname, "client")));

app.get("*", (req, res) => {
  console.log(path.join(__dirname + "/client/index.html"));
  res.sendFile(path.join(__dirname + "/client/index.html"));
});

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

io.on("connection", function(socket) {
  console.log("a user connected");

  socket.on("chat message", function(message) {
    setTimeout(() => {
      var reply = parseQuestion(message);
      socket.emit("chat reply", reply);
    }, 1000); // lat som vi bruker et sekund på å svare
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
