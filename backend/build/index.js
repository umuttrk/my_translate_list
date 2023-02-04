"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const app = (0, express_1.default)();
app.listen(3000, "0.0.0.0", () => {
    console.log("server is listening on port 3000");
});
app.get('/', (req, res) => {
    return res.send('<h1>hello world</h1>');
});
