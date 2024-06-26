#!/usr/bin/env node
import builder from "../builder/builder.js";
import path from "path";

let [arg_1, arg_2, arg_3] = process.argv.slice(2);
let prj_root = path.resolve("./");

import dirnames from "./dirnames.js";
dirnames.init(prj_root);

// todo: react to changes in manifest.json and trigger an update in /temp_ext_install
if (arg_1 === "dev") {
  builder.common.build_versions();
  builder.backend.watch();
  builder.frontend.watch();
  builder.extension.watch();
  // builder.firebase.serve();
} else if (arg_1 === "init") {
  builder.common.init();
} else if (arg_1 === "build") {
  builder.common.build_versions();
  builder.backend.build();
  builder.frontend.build();
  builder.extension.build();
} else if (arg_1 === "test") {
  // builder.firebase.test();
} else if (arg_1 === "deploy") {
  builder.firebase.deploy();
}
