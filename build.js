// Build script to replace API key
const fs = require('fs');
const path = require('path');

// Read the API key from environment variable or config
const API_KEY = process.env.OPENWEATHER_API_KEY || '9ec4e92eb2e5d18c9508faf625263e9d';

// Read the index.js file
let indexJs = fs.readFileSync('index.js', 'utf8');

// Replace the placeholder with the actual API key
indexJs = indexJs.replace('YOUR_API_KEY_HERE', API_KEY);

// Write the updated file
fs.writeFileSync('index.js', indexJs);

console.log('✅ API key has been injected into index.js');
console.log('🚀 Ready for deployment to GitHub Pages!');
