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
  //start timer
    var hrStart = process.hrtime.bigint()
    context.log(mySbMsg);
    const ans = calculatePrimes(mySbMsg.question);
  //end timer
    var hrEnd = process.hrtime.bigint();
    const payload = 
    {
        answer: ans,
        time_taken: Math.round(Number(hrEnd - hrStart) / 1000000)
    }
    context.log(payload);
    const options = {
        hostname: process.env.RECIEVER_HOST_NAME,
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
