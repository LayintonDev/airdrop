
import * as fs from "fs";

const values = [
  ["0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", "0", "70000000000000000000"],
  ["0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f", "1", "80000000000000000000"],
  ["0xa0Ee7A142d267C1f36714E4a8F75612F20a79720", "2", "40000000000000000000"],
  ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8", "3", "10000000000000000000"],
  ["0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", "4", "20000000000000000000"],
  ["0x90F79bf6EB2c4f870365E785982E1f101E93b906", "5", "30000000000000000000"],
];


let csvContent = "address,index,amount\n"; 
values.forEach((row) => {
  csvContent += row.join(",") + "\n"; 
});


fs.writeFileSync("addresses.csv", csvContent, "utf8");

console.log("CSV file created: addresses.csv");