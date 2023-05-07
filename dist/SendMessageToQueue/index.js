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
Object.defineProperty(exports, "__esModule", { value: true });
const service_bus_1 = require("@azure/service-bus");
const timerTrigger = function (context, myTimer) {
    return __awaiter(this, void 0, void 0, function* () {
        const CONNECTION_STRING = "Endpoint=sb://seng4400-a2.servicebus.windows.net/;SharedAccessKeyName=rng-queue-sender;SharedAccessKey=nnvDpd5EHrrSGRO5niW9gntTrT0pXrfPr+ASbP48h4A=;EntityPath=rng-queue";
        const TOPIC_NAME = "rng-queue";
        const MAX_NUMBER = 1000000;
        const sbClient = new service_bus_1.ServiceBusClient(CONNECTION_STRING);
        const sender = sbClient.createSender(TOPIC_NAME);
        const number = Math.floor(Math.random() * MAX_NUMBER) + 1;
        const payload = { question: number.toString() };
        context.log(`Publishing number ${number} to topic ${TOPIC_NAME}`);
        yield sender.sendMessages({ body: payload });
        yield sbClient.close();
    });
};
exports.default = timerTrigger;
//# sourceMappingURL=index.js.map