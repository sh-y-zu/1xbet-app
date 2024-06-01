const puppeteer = require("puppeteer-extra");
const launch = require("./launch");
const fs = require('fs');
const WebSocket = require('ws');
require('dotenv').config()
const wait = (ms) => new Promise(res => setTimeout(res, ms));

//get WsEndpoint
async function getWsEndpoint() {
  let wsEndpoint = await launch();
  return wsEndpoint;
}
let start
let end
let crash
var timestampLog = '[' + Date.now() + '] ';

const data = []


const ws = new WebSocket(process.env.WS_SERVER);

(async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: await getWsEndpoint(),
    defaultViewport: null,
  });

  let page = await browser.newPage();
  await page.goto(process.env.CRASH_APP, { timeout: 300000 });
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
  let bet = false
  const client = await page.target().createCDPSession()

  await client.send('Network.enable')
  

  client.on('Network.webTransportClosed', ({ requestId, timestamp, response }) => { console.log('web scoket closed')})
  
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
        if(!bet){
          ws.send(['BET'].toString())
          console.log(timestampLog, ' OnBets Event triggered.')
          bet = true
        }
       

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
        bet =false
        // fs.appendFile('data.txt', payload, (err) => {
        //   if (err) throw err;
        // });
        const { f, ts } = payload.arguments[0];
        crash = f
        end = ts
        console.log(`${timestampLog} ${f}, ${start}, ${ts}`);
        const csvData = `${f},${start},${ts}\n`;
        ws.send(['CRASH',f].toString())

        // fs.appendFile('data.csv', csvData, (err) => {
        //   if (err) throw err;
        // });
      }
     
    } catch (error) {
      console.error(timestampLog, 'Error processing WebSocket frame:', error);
    }
  });

  
  
})();







