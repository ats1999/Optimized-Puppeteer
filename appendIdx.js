const fs = require("fs");

let json = fs.readFileSync("./log.json", { encoding: "utf-8" });

let idx = 0;
json = JSON.parse(json).map((data) => {
  idx++;
  return {
    idx,
    ...data,
  };
});

fs.writeFileSync("./logWithIndex.json", JSON.stringify(json));
