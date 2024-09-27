
import * as readline from 'node:readline';

function prompt() {
  let url = "";
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(`what's url?`, name => {
    console.log(`Hi ${name}!`);
    url = name;
    rl.close();
  });
}

function main() {
  let url = prompt();
  console.log(url);
}

// main();
