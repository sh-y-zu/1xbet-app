const puppeteer = require("puppeteer-extra");
const launch = require("./launch");
const fs = require('fs');
const WebSocket = require('ws');
const wait = (ms) => new Promise(res => setTimeout(res, ms));

//get WsEndpoint
async function getWsEndpoint() {
  let wsEndpoint = await launch();
  return wsEndpoint;
}
let start
let end
let crash

const data = []


const ws = new WebSocket('ws://localhost:8080');

(async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: await getWsEndpoint(),
    defaultViewport: null,
  });

  let page = await browser.newPage();
  await page.goto("https://1xbet.com/en/allgamesentrance/crash", { timeout: 300000 });
  await page.setViewport({
    width: 1280,
    height: 1024,
    isMobile: false,
    isLandscape: true,
    hasTouch: false,
    deviceScaleFactor: 1
  })
  let preCrash = false
  let prePayload = []
  let bids = []
  const client = await page.target().createCDPSession()

  await client.send('Network.enable')

  client.on('Network.webSocketFrameReceived', ({ requestId, timestamp, response }) => {
    let payloadString = response.payloadData.toString('utf8');
   

    try {
      payloadString = payloadString.replace(/[^\x20-\x7E]/g, '');
      const payload = JSON.parse(payloadString);
      // console.log(payload)

      if(payloadString.includes('"target":"OnCashouts"')){
        
        prePayload.push(payload)
      }
      if(payloadString.includes('"target":"OnBets"')){
        // console.log(bids)
        bids.push(payload)
        ws.send(['BET'])

      }

      if(payloadString.includes('"target":"OnStage"')){
        // console.log( prePayload[prePayload.length-1].arguments, bids[bids.length - 1].arguments, crash,start,end)
        // console.log(`Start time: ${start} `)
        // console.log(`End time: ${end} `)
        // console.log(`No Of Players: ${prePayload[prePayload.length-1]?.arguments[0]?.n} `)
        // console.log(`Total Winnings: ${prePayload[prePayload.length-1]?.arguments[0]?.won}`)
        // console.log(`Total Bids: ${bids[bids.length - 1]?.arguments[0]?.bid}`)
        // console.log(`Crash Point: ${crash}`)
        const game_data = `${start},${end},${prePayload[prePayload.length-1]?.arguments[0]?.n},${prePayload[prePayload.length-1]?.arguments[0]?.won},${bids[bids.length - 1]?.arguments[0]?.bid},${crash}\n`
        //  fs.appendFile('./public/crash_game_data.csv', game_data, (err) => {
        //   if (err) throw err;
        // });
        data.push([start,end,crash])
        ws.send(['DATA',start,end,crash].toString())
        bids = []
        
      }
     
      if (payloadString.includes('"target":"OnStart"')) {
        // fs.appendFile('data.txt', payload, (err) => {
        //   if (err) throw err;
        // });
        prePayload = []
        const { ts } = payload.arguments[0];
        start = ts
      }
      if (payloadString.includes('"type":1,"target":"OnCrash"')) {
        preCrash = true
        // fs.appendFile('data.txt', payload, (err) => {
        //   if (err) throw err;
        // });
        const { f, ts } = payload.arguments[0];
        crash = f
        end = ts
        console.log(`${timestamp} >> ${f}, ${start}, ${ts}`);
        const csvData = `${f},${start},${ts}\n`;

        // fs.appendFile('data.csv', csvData, (err) => {
        //   if (err) throw err;
        // });
      }
     
    } catch (error) {
      console.error('Error processing WebSocket frame:', error);
    }
  });

  
  
})();







