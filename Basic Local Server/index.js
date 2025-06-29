const http = require('http');
const fs = require('fs');

const myServer = http.createServer((req, res) => {
    const log = `${Date.now()} ${req.url} ${JSON.stringify(req.headers)} : New Request Received\n`;
    console.log(log);

    fs.appendFile('./log.txt', log, (err) => {
        if (err) {
            console.log("Logging Error:", err);
        }
    })
});

myServer.listen(8000, (err,res)=>{
    if(err)
    {
        console.log(err);
    }
});
