var express = require("express");
var app = express();
var path = require("path");
app.use(express.static(path.join(__dirname, "..", "__tests__/test-pages")));
app.listen(8125);
