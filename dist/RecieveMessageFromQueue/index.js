"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
function calculatePrimes(max) {
    if (max > 1000000) {
        return [];
    }
    const boolArr = Array.from({ length: max + 1 }, () => true);
    const primes = [];
    for (let i = 2; i <= max; i++) {
        if (boolArr[i]) {
            primes.push(i);
            for (let j = i + i; j <= max; j += i) {
                boolArr[j] = false;
            }
        }
    }
    return primes;
}
const serviceBusQueueTrigger = function (context, mySbMsg) {
    return __awaiter(this, void 0, void 0, function* () {
        var hrstart = process.hrtime();
        context.log(mySbMsg);
        const ans = calculatePrimes(mySbMsg.question);
        var hrend = process.hrtime(hrstart);
        const payload = {
            answer: ans,
            time_taken: Math.floor(hrend[1] / 1000000)
        };
        context.log(payload);
        const options = {
            hostname: 'seng4400dashboard.azurewebsites.net',
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(payload)),
                'Authorization': 'Basic d3JpdGVyQXBwOmFkbWluUGFzc3cwcmQh'
            },
            data: JSON.stringify(payload)
        };
        const response = yield new Promise((resolve, reject) => {
            const req = https_1.default.request(options, resp => {
                let data = '';
                resp.on('data', chunk => {
                    data += chunk;
                });
                resp.on('end', () => {
                    resolve(data);
                });
            });
            req.on("error", err => {
                reject(err);
            });
            req.write(JSON.stringify(payload));
            req.end();
        });
        context.log('ServiceBus queue trigger function processed message', mySbMsg);
    });
};
exports.default = serviceBusQueueTrigger;
//# sourceMappingURL=index.js.map