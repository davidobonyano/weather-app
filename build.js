// Build script to replace API key
const fs = require('fs');
const path = require('path');

// Read the API key from environment variable
const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
  console.error('❌ Error: OPENWEATHER_API_KEY environment variable is not set');
  console.log('Please set your API key:');
  console.log('Windows: set OPENWEATHER_API_KEY=your_api_key_here');
  console.log('Mac/Linux: export OPENWEATHER_API_KEY=your_api_key_here');
  process.exit(1);
}

// Read the index.js file
let indexJs = fs.readFileSync('index.js', 'utf8');

// Replace the placeholder with the actual API key
indexJs = indexJs.replace('YOUR_API_KEY_HERE', API_KEY);

// Write the updated file
fs.writeFileSync('index.js', indexJs);

console.log('✅ API key has been injected into index.js');
console.log('🚀 Ready for deployment to GitHub Pages!');
