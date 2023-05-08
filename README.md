# seng4400-azure-functions
Azure Functions for SENG4400 A2 

Part 1 - The Server (3 marks)

- Messages are sent via the SendMessageToQueue Azure Function, and they are sent to an Azure Service Bus (ASB) Queue. 
- The maximum number for RNG generation is user-configurable via the environment variable "PRIME_MAX"
    - Environmnents variables are configured locally via local.settings.json and passed in as env variables via node.js 
- The function is utilizing Azure's 'Timer Triggers' to run every second via a CRON job. This is configurable via the function.json file within the SendMessageToQueue folder.
- Code for this portion is found within SendMessageToQueue/index.ts 

Part 2 - The Client (3 marks)
- Messages are recieved via the ASB Queue using an Azure Functions trigger which listens for new messages on the service bus. 
- The REST endpoint is configurable via the environment variable "RECIEVER_HOST_NAME".
    - Environmnents variables are configured locally via local.settings.json and passed in as env variables via node.js 
- Code for this portion is found within RecieveMessageFromQueue/index.ts 

RUNNING AZURE FUNCTIONS LOCALLY: 
1. run npm install
2. This solution requires ASB for the pub/sub queue, and there is no officially supported emulator for ASB. For this reason this solution cannot be truely 'local'. The connection string is defined in the local.settings.json under seng4400a2_SERVICEBUS and seng4400a2_TOPIC_NAME. You are welcome to use the existing service bus, or create your own and replace these parameters. 

3. Fortunately/Unfortunately Azure functions have great integration with Visual Studio Code, and not much else. Download the Azure extension in VSCode. The extension should automatically detect that you are trying to run an Azure function. Simply press F5 on either of the index.ts files and both the Reciever and Sender functions will start. You may prompted to setup a storage solution, in which just select the local emulator. You should be able to see the output in the terminal that opens. Alternatively you can run the command 'func start' in the console. 

There is also a JetBrains plugin, but I haven't tested it, your mileage may vary 

