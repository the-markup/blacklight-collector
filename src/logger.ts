import path from "path";
import tmp from "tmp";
tmp.setGracefulCleanup();

// https://stackoverflow.com/a/45211015/1407622
const { createLogger, format, transports } = require("winston");

export const getLogger = ({ outDir = "", quiet = false }) => {
  let log_transports = [];
  let filename;

  log_transports.push(
    new transports.Console({
      level: "info",
      silent: quiet
    })
  );
  if (outDir) {
    filename = path.join(outDir, "inspection-log.ndjson");
  } else {
    filename = tmp.tmpNameSync({ postfix: "-log.ndjson" });
  }

  log_transports.push(
    new transports.File({
      filename: filename,
      level: "silly", // log everything to file
      options: { flags: "w" } // overwrite instead of append, see https://github.com/winstonjs/winston/issues/1271
    })
  );

  return createLogger({
    // https://stackoverflow.com/a/48573091/1407622
    format: format.combine(format.timestamp(), format.json()),
    transports: log_transports
  });
};
