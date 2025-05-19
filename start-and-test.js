const { spawn } = require('child_process');
const path = require('h');

console.log('Starting server...');

// Start the server
const server = spawn('node', [path.join(__dirname, 'index.js')], {
  stdio: 'inherit'
});

// Wait for the server to start
setTimeout(() => {
  console.log('Server should be started, running tests...');
  
  // Run the test script
  const test = spawn('node', [path.join(__dirname, 'test-api-docs.js')], {
    stdio: 'inherit'
  });
  
  test.on('close', (code) => {
    console.log(`Test script exited with code ${code}`);
    
    // Kill the server
    server.kill();
    process.exit(0);
  });
}, 5000); // Wait 5 seconds for the server to start

// Handle server exit
server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
});