import chokidar from "chokidar";
import path from "path";
import fs_extra from "fs-extra";

let source = path.resolve("./common");
let destinations = [
  //
  path.resolve("../link_spotter/common"),
  path.resolve("../swift_quote/common"),
  path.resolve("../embank_ai/common"),
  path.resolve("../patch_tagger/common"),
  path.resolve("../icebreaker/common"),
  path.resolve("../busmask/common"),
  path.resolve("../iann_app/common"),
  path.resolve("../bloom/common"),
  path.resolve("../chromane_extension/common"),
  path.resolve("../incubator/common"),
];

console.log(source);
console.log(destinations);

let chokidar_watcher = chokidar.watch(
  //
  [source],
  {
    ignoreInitial: false,
    ignored: /^\./,
    persistent: true,
  }
);

function copy() {
  console.log("copy");
  for (let destination of destinations) {
    console.log("copy");
    console.log(source);
    console.log(destination);
    console.log("---");
    fs_extra.copySync(
      //
      path.resolve(source),
      path.resolve(destination)
    );
  }
}
chokidar_watcher.on("change", async (event, event_path) => {
  console.log("change");
  console.log("---");
  copy();
  console.log("---");
});
copy();
