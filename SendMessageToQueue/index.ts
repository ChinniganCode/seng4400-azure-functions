import { AzureFunction, Context } from "@azure/functions"
import { ServiceBusClient } from "@azure/service-bus";

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {

    const CONNECTION_STRING = "Endpoint=sb://seng4400-a2.servicebus.windows.net/;SharedAccessKeyName=rng-queue-sender;SharedAccessKey=nnvDpd5EHrrSGRO5niW9gntTrT0pXrfPr+ASbP48h4A=;EntityPath=rng-queue"
    const TOPIC_NAME = "rng-queue"

    const MAX_NUMBER = 1000000;
    const sbClient = new ServiceBusClient(CONNECTION_STRING);
    const sender = sbClient.createSender(TOPIC_NAME);
    interface MessageFormat {
        question: string;
    }
    const number = Math.floor(Math.random() * MAX_NUMBER) + 1;
    const payload: MessageFormat = {question: number.toString()}
    context.log(`Publishing number ${number} to topic ${TOPIC_NAME}`);
    await sender.sendMessages({ body: payload });
    await sbClient.close();
};

export default timerTrigger;
