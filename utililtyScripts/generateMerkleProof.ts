import * as fs from "fs";
import  { StandardMerkleTree } from "@openzeppelin/merkle-tree";

const tree = StandardMerkleTree.load(
  JSON.parse(fs.readFileSync("tree.json", "utf8"))
);


for (const [i, value] of tree.entries()) {

  if (value[0] === "0x90F79bf6EB2c4f870365E785982E1f101E93b906") {
 
    const proof = tree.getProof(i);
    console.log("Value:", value);
    console.log("Proof:", proof);
  }
}