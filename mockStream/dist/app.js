"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stream_1 = require("stream");
const app = (0, express_1.default)();
const port = 3000;
const descriptionToTelematicsProportion = 0.1;
const randomString = (size, spaced = true, numbers = true) => {
    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const numerics = "0123456789";
    const spaces = "            ";
    const alphanum = alpha + (numbers ? numerics : "") + (spaced ? spaces : "");
    return [...Array(size)].reduce((acc) => acc + alphanum[Math.floor(Math.random() * alphanum.length)], '');
};
const randomObj = () => {
    const objectLength = Math.ceil(Math.random() * 10);
    return [...Array(objectLength)].reduce((acc) => {
        acc[randomString(7, false, false)] = randomString(Math.floor(Math.random() * 20));
        return acc;
    }, {});
};
const messageStream = (descriptionProportion = descriptionToTelematicsProportion) => {
    return new stream_1.Readable({
        read() {
            let message = {
                "vehicle_id": Math.ceil(Math.random() * 9999),
            };
            if (Math.random() > descriptionProportion) {
                message = Object.assign(Object.assign({}, message), { "timestamp": new Date().toISOString(), "location": { lat: -90 + Math.random() * 180, lng: -180 + Math.random() * 360 }, "status": randomObj() });
            }
            else {
                message = Object.assign(Object.assign({}, message), { "description": randomString(140) });
            }
            this.push(JSON.stringify(message) + '\n');
        }
    });
};
app.get('/', (req, res) => {
    try {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Transfer-Encoding': 'chunked' });
        const rs = messageStream();
        rs.pipe(res);
    }
    catch (e) {
        res.status(500).send("Service unavailable.");
    }
});
app.listen(port, () => {
    return console.log(`Mock Stream is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map