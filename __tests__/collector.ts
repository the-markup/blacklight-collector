import { collector } from "../src/collector";
import { Global } from "../src/types";
import { join } from "path";
import fs from "fs";
import generate from "@babel/generator";
import { clearDir } from "../src/utils";
declare var global: Global;
jest.setTimeout(80000);

describe("collector", () => {
  it("can run", async () => {
    const TEST_URL = `${global.__DEV_SERVER__}/session_recorder.html`;
    const TEST_DIR = join(__dirname, "test-data", "collector-test");
    await collector({
      headless: true,
      inUrl: TEST_URL,
      outDir: TEST_DIR,
      captureHar: false
    });
    clearDir(TEST_DIR);
  });
});
