const spawn = require('child_process').spawn;




let pcall = new Promise((resolve, reject) => {
  let pargs = "hamlet";
  const pythonProcess = spawn('python', ["test.py" + pargs]);
  console.log('spawned python!');
  console.log(pargs);
  pythonProcess.stdout.on('data', (data) => {
    if (data) {
      let tweets = JSON.parse(data.toString());
      console.log('tweets received!');
      console.log(tweets);
      resolve(tweets);
    }

  });
})
