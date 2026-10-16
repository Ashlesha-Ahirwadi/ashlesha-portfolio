// Prints every line Kiki can say as JSON {id: text}. Used by make_voice.py.
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'brain.js'), 'utf8');
global.window = {};
require(path.join(__dirname, '..', 'brain.js'));
const intents = eval(src.match(/var I = (\[[\s\S]*?\n  \]);/)[1].replace(/LINKS/g, '{}'));
const lines = Object.assign({ welcome: window.KikiBrain.welcome.say }, window.KikiBrain.lines);
intents.forEach(i => { lines[i.id] = i.say; });
lines.fallback = src.match(/FALLBACK = \{[\s\S]*?say: "([^"]+)"/)[1];
console.log(JSON.stringify(lines));
