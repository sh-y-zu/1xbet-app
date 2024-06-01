const WebSocket = require('ws');
const db = require('./database.js')
// const capture = require('./capture.js')

const getPeriod = (rounds = 1500, days = 30, hours = 24) => {
  return (60 / ((rounds / days) / hours)) * 60 * 1000
}

const wss = new WebSocket.Server({ port: 5000 });

let dataString
const clients = []
let pre_crash_point = 0
let totalrecords = 0
let lossRecords = 0
let crashPoint = 1.01
let rounds = 1
let days = 1
let hours = 1
const threads = [{ thread: 'thread_1', bet: false, status: 'initial' }, { thread: 'thread_2', bet: false, status: 'initial', }, { thread: 'thread_3', bet: false, status: 'initial', }]
let threadInfo
let Timer
var timestampLog = '[' + Date.now() + '] ';

const MainTimer = (duration, task) => {
  let startTime = Math.floor(Date.now() / 1000);

  const timerId = setInterval(() => {
    const currentTime = Math.floor(Date.now() / 1000);
    const seconds = currentTime - startTime;

    if (seconds >= duration) {
      task();
      startTime = Math.floor(Date.now() / 1000); // Restart the timer by resetting startTime

    }

  }, 1000);

  return timerId
};

wss.on('connection', async (ws) => {
  console.log(timestampLog, ' Client connected. Ip Address ==> ', ws._socket.remoteAddress);
  clients.push(ws);
  let query = 'SELECT * FROM data ORDER BY id DESC limit 10'
  let params = []
  await db.all(query, params, async (err, data) => {
    if (err) throw console.err(err)
    let query = 'SELECT * FROM bets'
    let params = []
    await db.all(query, params, (err, bets) => {
      if (err) throw console.err(err)
      ws.send(JSON.stringify(['INITIAL_BETS', bets]))
    })
    ws.send(JSON.stringify(['INITIAL_CRASH', data]))
  })

  query = 'SELECT * FROM threads'
  params = []
  await db.all(query, params, (err, data) => {
    if (err) throw console.err(err)
    threadInfo = data

  })
  console.log(timestampLog, ' ', threadInfo.toString())

  ws.on('message', (data) => {
    // event data to array
    dataString = data.toString().split(',')
    console.log(timestampLog, ' Incoming Data : ', dataString.toString())
    if (dataString[0] == 'TIMER_START') {
console.log(timestampLog, ' Betting Timer Started.')

      // set config data
      crashPoint = dataString[1]
      rounds = dataString[2]
      days = dataString[3]
      hours = dataString[4]

      // Register the Timer

      Timer = MainTimer(60 * 28, () => {
        console.log(timestampLog, ' Refreshing the status of threads.')
        for (let i of threads) {
          i.bet = true
          i.status = 'ready'
        }
      })

    } else if (dataString[0] == 'BET') {
      console.log(timestampLog, ' Bet event detected. Ip address ==> ',  ws._socket.remoteAddress)
      for (let i of threads) {
        if (i.status == 'pending') {
          break
        }
        if (i.bet && (i.status != 'pending')) {
          i.status = 'pending'
          // ws.send(['BET', i.thread])
          let query = `SELECT * FROM threads WHERE thread = '${i.thread}' `
          db.all(query, [], (err, data) => {
            if (err) throw console.error(err)
            console.log(timestampLog, ' Sending Data : ', threads.toString())
            clients.forEach(function (client) {
              client.send(JSON.stringify(['BET', i.thread, data[0].value]));

            });
          })

          break
        }

      }
      
    } else if (dataString[0] == 'RESULT') {
      console.log(timestampLog, ' Incoming betting results : ', dataString.toString())
      // ['RESULT', 'thread_1', 'win']
      if (dataString[2] == 'lost') {
        console.log(timestampLog, ` The ${dataString[1]} was lost.`)
        let lostThreadIndex
        for (let i of threads) {
          if (i.thread == dataString[1]) {
            lostThreadIndex = threads.indexOf(i)

          }


        }
        threads.splice(lostThreadIndex, 1)
        let query = `UPDATE threads SET status = false WHERE thread = '${dataString[1]}' `
        db.run(query, (err) => {
          if (err) throw console.log(timestampLog, 'Error: ', err)
          console.log(timestampLog, ' The data of the lost thread is updated on the database.')
        })

      } else if (dataString[2] == 'win') {
        let query = `SELECT * FROM threads WHERE thread = '${dataString[1]}' `
        db.all(query, [], (err, data) => {
          if (err) throw console.error(err)
          let query = `UPDATE threads SET value = ${data[0].value * 1.01} , rounds = ${data[0].rounds + 1} WHERE thread = '${dataString[1]}' `
          db.run(query, (err) => {
            if (err) throw console.log(timestampLog, 'Error: ', err)
            for (let i of threads) {
              if (i.thread == dataString[1]) {
                i.bet = false
                i.status = 'betted'
                console.log(timestampLog, ' The data of the win thread is updated.')
              }


            }
          })

        });
      }
      let query = `SELECT * FROM threads WHERE thread = '${dataString[1]}' `
      db.all(query, [], (err, data) => {
        if (err) throw console.error(err)
        let query = `INSERT INTO bets(win, crash_point, acual_crash_point, thread, rounds, value) VALUES(${dataString[2] == 'win' ? 'true' : 'false'}, 1.01, ${dataString[3]}, '${dataString[1]}', ${data[0].rounds}, ${data[0].value} )`
        db.run(query, (err) => {
          if (err) throw console.log(timestampLog, 'Error: ', err)
        })
      })


    } else if (dataString[0] == 'TIMER_END') {
      // stop the timer
      console.log(timestampLog, ' Timer has stopped.')
      clearInterval(Timer == undefined ? null : Timer)
    } else if (dataString[0] == 'DATA') {

      // ws.send(data)
      totalrecords++
      if (dataString[3] <= 1.02) {
        lossRecords++
      }
      let risk = lossRecords != 0 ? lossRecords / totalrecords * 100 : 0
      let query = 'INSERT INTO data(timestamp, crash_point, pre_crash_point, predict_crash_point, risk_at) VALUES(?,?,?,?,?)'
      let params = [dataString[1], dataString[3], pre_crash_point, 0.0, risk]
      db.run(query, params, (err) => {
        if (err) throw console.log(timestampLog, 'Error: ', err)
      })



      pre_crash_point = dataString[3]
      const record = [...dataString, risk]

      clients.forEach(function (client) {
        client.send(JSON.stringify(['STREAM', record]));
      });
    } else if (dataString[0] == 'CRASH') {
      console.log(timestampLog, ' Crash event triggerd.')
      clients.forEach(function (client) {
        client.send(JSON.stringify(dataString));
      });
    }

  })



  ws.on('close', () => {
    console.log(timestampLog, ' Client disconnected. Ip address ==> ', ws._socket.remoteAddress);

  });
});