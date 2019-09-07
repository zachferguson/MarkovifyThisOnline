const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const spawn = require("child_process").spawn;

app.use("/assets", express.static("assets"));
app.set("view engine", "ejs");

let urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get("/markovifyThis", function(req, res) {
  res.sendFile(__dirname + "/markovifyThis.html");
});

app.post("/markovifyThis", urlencodedParser, function(req, res) {
  let pcall = new Promise((resolve, reject) => {
    let pargs = "books/" + Object.values(req.body) + ".txt";
	console.log(`Calling python script for ${pargs}`);
    const pythonProcess = spawn("python", ["markovifyThisOnline.py", pargs]);
    pythonProcess.stdout.on("data", data => {
      if (data) {
		console.log(JSON.parse(data.toString()));
        let tweets = JSON.parse(data.toString());
        resolve(tweets);
      }
    });
  });

  pcall.then(tweets => {
    let message = {
      tweeta: tweets["0"],
      tweetb: tweets["1"],
      tweetc: tweets["2"],
      tweetd: tweets["3"],
      tweete: tweets["4"]
    };
    res.render("markovifyThis", { message });
  });
});

app.listen(3000);
