import { createInterface } from "readline";

export function readline() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = prompt => {
    return new Promise(resolve => {
      rl.question(`${prompt}: `, input => resolve(input.trim()));
    });
  };
  const close = () => rl.close();

  return { question, close };
}
