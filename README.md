# seng4400-azure-functions
Azure Functions for SENG4400 A2 

Part 1 - The Server (3 marks)

- Messages are sent via the SendMessageToQueue Azure Function, and they are sent to an Azure Service Bus (ASB) Queue. 
- The maximum number for RNG generation is user-configurable via the environment variable "PRIME_MAX"
    - Environmnents variables are configured locally via local.settings.json and passed in as env variables via node.js 
- The function is utilizing Azure's 'Timer Triggers' to run every second via a CRON job. This is configurable via the environment setting "CRON_SCHEDULE".
- Code for this portion is found within SendMessageToQueue/index.ts 

Part 2 - The Client (3 marks)
- Messages are recieved via the ASB Queue using an Azure Functions trigger which listens for new messages on the service bus. 
- The REST endpoint is configurable via the environment variable "RECIEVER_HOST_NAME".
    - Environmnents variables are configured locally via local.settings.json and passed in as env variables via node.js 
- Code for this portion is found within RecieveMessageFromQueue/index.ts 

RUNNING AZURE FUNCTIONS LOCALLY: 
1. This solution requires ASB for the pub/sub queue, and there is no officially supported emulator for ASB. For this reason this solution cannot be truely 'local'. The connection string is defined in the local.settings.json under seng4400a2_SERVICEBUS and seng4400a2_TOPIC_NAME. You are welcome to use the existing service bus, or create your own and replace these parameters. 
2. Fortunately/Unfortunately Azure functions have great integration with Visual Studio Code, and not much else. Download the Azure extension in VSCode. The extension should automatically detect that you are trying to run an Azure function. 
3. Install Azure Functions Core Tools v 2.x or later. VSCode should prompt you to download it, if it not it is available here: https://github.com/Azure/azure-functions-core-tools
4. run npm install
5. There is a chance you will be prompted to setup a storage solution, in which just select the local emulator.
6. Simply press F5 on either of the index.ts files and both the Reciever and Sender functions will start.  You should be able to see the output in the terminal that opens. Alternatively you can run the command 'func start' in the console. 

You should then see the output of the two functions in the console. 


There is also a JetBrains plugin, but I haven't tested it, your mileage may vary. 


Deploying to Azure: 

By far the easiest way to deploy this code is by the VSCode Azure plugin, whereby you just go into Azure sidetab, go to workspace, select 'Deploy to Function App' and enter the Function App you created in the Azure Portal. Azure should then handle the rest. With that being said, there are a few more options: 


- The code for both sections was deployed via an Azure Functions App. I deployed them via VSCode, alternatively you could chose another CI/CD deployment solution such as Github Actions or DevOps. 
- I ran the service on Node.js 18 LTS on a Windows Machine, with the Serverless hosting option 

- Enable public access in the configuration. 

Deployment via a ZIP file.

Option 1 (Azure CLI):
- To deploy this project without CI/CD, you could instead ZIP this file and run the following command using the Azure CLI 

$ az webapp deployment user set --user-name <username> --password <password>

$ az functionapp deployment source config-zip -g <resource_group> -n \
<app_name> --src <zip_file_path>

Replacing resource_group and app_name with your Functions Apps. And replaceing the zip_file_path with the path to the zipped version of this project. 

Option 2 (Azure REST API):
Alternatively, you can send a POST request via
curl -X POST -u <deployment_user> --data-binary @"<zip_file_path>" https://<app_name>.scm.azurewebsites.net/api/zipdeploy
.zip in the message body. You must also include any deployment credentials via HTTP BASIC Authentication. 

You can then view the status of your deployment via 

curl -u <deployment_user> https://<app_name>.scm.azurewebsites.net/api/deployments

Where <deployment_user> is your azure username. Authentication credentials can be found via a few different methods: 
- https://learn.microsoft.com/en-us/azure/app-service/deploy-configure-credentials?tabs=portal#userscope


By far the easiest way to deploy this code is by the VSCode Azure plugin, whereby you just go into Azure sidetab, go to workspace, select 'Deploy to Function App' and enter the Function App you created in the Azure Portal. Azure should then handle the rest.