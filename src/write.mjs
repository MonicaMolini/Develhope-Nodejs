import { writeFile } from "fs";
import { Buffer } from "buffer";

const data = new Uint8Array(Buffer.from("Hello there!"));
writeFile("file.txt", data, (err) => {
  if (err) throw err;
  console.log("Your file has been saved!");
});