import { AzureFunction, Context } from "@azure/functions"
import { ServiceBusClient } from "@azure/service-bus";
const MAX_NUMBER = parseInt(process.env?.PRIME_MAX) ?? 1000000;
const CONNECTION_STRING = process.env.seng4400a2_SERVICEBUS;
const TOPIC_NAME = process.env.seng4400a2_TOPIC_NAME;

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    context.log('max prime: ', MAX_NUMBER);
    let RngMax = MAX_NUMBER;
    if(isNaN(MAX_NUMBER)) {
        context.log('Invalid max input, reverting to default');
        RngMax = 1000000
    }
    const sbClient = new ServiceBusClient(CONNECTION_STRING);
    const sender = sbClient.createSender(TOPIC_NAME);
    interface MessageFormat {
        question: string;
    }
    const number = Math.floor(Math.random() * RngMax) + 1;
    const payload: MessageFormat = {question: number.toString()}
    context.log(`Publishing number ${number} to topic ${TOPIC_NAME}`);
    await sender.sendMessages({ body: payload });
    await sbClient.close();
};

export default timerTrigger;
