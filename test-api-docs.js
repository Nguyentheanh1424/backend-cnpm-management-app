const http = require('http');
const https = require('https');

console.log('Testing endpoints...');
console.log('Waiting for server to start...');

// Function to test an endpoint
function testEndpoint(path, description, followRedirects = true) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: path,
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`\nTesting ${description}:`);
    console.log(`STATUS: ${res.statusCode}`);

    // Handle redirects (301, 302, 307, 308)
    if (followRedirects && (res.statusCode === 301 || res.statusCode === 302 || 
        res.statusCode === 307 || res.statusCode === 308)) {
      const redirectUrl = res.headers.location;
      console.log(`Following redirect to: ${redirectUrl}`);

      // Parse the redirect URL
      let redirectUrlObj;
      try {
        redirectUrlObj = new URL(redirectUrl);
      } catch (e) {
        // Handle relative URLs
        redirectUrlObj = new URL(redirectUrl, `http://localhost:3000`);
      }

      // Create new options for the redirect
      const redirectOptions = {
        hostname: redirectUrlObj.hostname,
        port: redirectUrlObj.port || 3000,
        path: redirectUrlObj.pathname + redirectUrlObj.search,
        method: 'GET'
      };

      console.log(`Redirect options: ${JSON.stringify(redirectOptions)}`);

      // Make a new request to the redirect URL
      const redirectReq = http.request(redirectOptions, (redirectRes) => {
        console.log(`Redirect STATUS: ${redirectRes.statusCode}`);

        let redirectData = '';
        redirectRes.on('data', (chunk) => {
          redirectData += chunk;
        });

        redirectRes.on('end', () => {
          if (redirectRes.statusCode === 200) {
            console.log(`${description} is accessible after redirect!`);
            try {
              // Try to parse as JSON, but don't fail if it's not JSON
              const jsonData = JSON.parse(redirectData);
              console.log('Response:', jsonData);
            } catch (e) {
              console.log('Response is not JSON (HTML or other content)');
            }
          } else {
            console.log(`${description} is not accessible after redirect.`);
          }
        });
      });

      redirectReq.on('error', (e) => {
        console.error(`Problem with redirect request: ${e.message}`);
      });

      redirectReq.end();
      return;
    }

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log(`${description} is accessible!`);
        if (data) {
          try {
            const jsonData = JSON.parse(data);
            console.log('Response:', jsonData);
          } catch (e) {
            console.log('Response is not JSON (HTML or other content)');
          }
        }
      } else {
        console.log(`${description} is not accessible.`);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.end();
}

// Wait for 2 seconds to ensure server is running
setTimeout(() => {
  // Test the root endpoint
  testEndpoint('/', 'Root endpoint');

  // Test the test-api-docs endpoint
  setTimeout(() => {
    testEndpoint('/test-api-docs', 'Test API docs endpoint');

    // Test the api-docs endpoint
    setTimeout(() => {
      testEndpoint('/api-docs', 'API docs endpoint');
    }, 1000);
  }, 1000);
}, 2000);
