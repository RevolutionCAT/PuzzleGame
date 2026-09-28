import {ManageVisuals} from "./core.js"

async function Game(){
    const response = await fetch("/api/today_puzzle/"); // await works only in async functions

  //  console.log("chosen algorithm: ", base, " of ", type, "    |    compatible with: ", algorithm.compatibleWith);
    console.log("selected mode: ", response["mode"]);
   // stepsBI:  { i0: ["s1-2", "k3". . .], i1: ["s3-4", "i4-5"] }
}

Game();