// const fs = require('fs');
const os = require('os');

// Gather system info
const info = `
System Info:
-------------
Platform: ${os.platform()}
Architecture: ${os.arch()}
CPU Cores: ${os.cpus().length}
Total Memory: ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB
Free Memory: ${(os.freemem() / 1024 / 1024).toFixed(2)} MB
Uptime: ${os.uptime()} seconds
`;

// Display it
console.log(info);

