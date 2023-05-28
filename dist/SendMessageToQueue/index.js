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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const service_bus_1 = require("@azure/service-bus");
const MAX_NUMBER = (_b = parseInt((_a = process.env) === null || _a === void 0 ? void 0 : _a.PRIME_MAX)) !== null && _b !== void 0 ? _b : 1000000;
const CONNECTION_STRING = process.env.seng4400a2_SERVICEBUS;
const TOPIC_NAME = process.env.seng4400a2_TOPIC_NAME;
const timerTrigger = function (context, myTimer) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('max prime: ', MAX_NUMBER);
        let RngMax = MAX_NUMBER;
        context.log(myTimer);
        if (isNaN(MAX_NUMBER)) {
            context.log('Invalid max input, reverting to default');
            RngMax = 1000000;
        }
        const sbClient = new service_bus_1.ServiceBusClient(CONNECTION_STRING);
        const sender = sbClient.createSender(TOPIC_NAME);
        const number = Math.floor(Math.random() * RngMax) + 1;
        const payload = { question: number.toString() };
        context.log(`Publishing number ${number} to topic ${TOPIC_NAME}`);
        yield sender.sendMessages({ body: payload });
        yield sbClient.close();
    });
};
exports.default = timerTrigger;
//# sourceMappingURL=index.js.map