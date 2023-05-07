import { AzureFunction, Context } from "@azure/functions"
import https from "https";

function calculatePrimes(max): number[] {
    if(max > 1000000) {
        return [];
    }
    const boolArr: boolean[] = Array.from({ length: max + 1 }, () => true);
    const primes: number[] = [];

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
  

const serviceBusQueueTrigger: AzureFunction = async function(context: Context, mySbMsg: any): Promise<void> {
    var hrstart = process.hrtime()
    context.log(mySbMsg);
    const ans = calculatePrimes(mySbMsg.question);
    var hrend = process.hrtime(hrstart);
    const payload = 
    {
        answer: ans,
        time_taken: Math.floor(hrend[1] / 1000000)
    }
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
      }
      const response = await new Promise<string>((resolve, reject) => {
        const req = https.request(options, resp => {
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
    }


export default serviceBusQueueTrigger;
