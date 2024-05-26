const WebSocket = require('ws');
const db = require('./database.js')
// const capture = require('./capture.js')

const getPeriod = (rounds = 1500, days = 30, hours = 24) => {
  return (60 / ((rounds / days) / hours)) * 60 * 1000
}

const wss = new WebSocket.Server({ port: 8080 });

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

const MainTimer = (duration, task) => {
  let startTime = Math.floor(Date.now() / 1000);

  const timerId = setInterval(() => {
    const currentTime = Math.floor(Date.now() / 1000);
    const seconds = currentTime - startTime;

    console.log(startTime, currentTime, seconds);

    if (seconds >= duration) {
      task();
      startTime = Math.floor(Date.now() / 1000); // Restart the timer by resetting startTime
    
    }
    
  }, 1000);

  return timerId
};

// // Example usage
// const task = () => {
//   console.log("Task executed");
// };

// const duration = 5; // Duration in seconds
// const timerId = MainTimer(duration, task);

// console.log('Timer ID:', timerId);


wss.on('connection', async (ws) => {
  console.log('Client connected');
  clients.push(ws);
  let query = 'SELECT * FROM data ORDER BY id DESC limit 10'
  let params = []
  await db.all(query, params, async (err, data) => {
    if (err) throw console.err(err)
    // console.log(JSON.stringify(data))
    let query = 'SELECT * FROM bets'
    let params = []
    await db.all(query, params, (err, bets) => {
      if (err) throw console.err(err)
      // console.log(JSON.stringify(data))
      ws.send(JSON.stringify(['INITIAL_BETS', bets]))
    })
    ws.send(JSON.stringify(['INITIAL_CRASH', data]))
  })

  query = 'SELECT * FROM threads'
  params = []
  await db.all(query, params, (err, data) => {
    if (err) throw console.err(err)
    // console.log(JSON.stringify(data))
    // console.log(data)
    threadInfo = data

  })
  console.log(threadInfo)
  // [message, crashPoint, rounds, days, hours  ]

  ws.on('message', (data) => {
    // event data to array
    dataString = data.toString().split(',')
    console.log(dataString)

    if (dataString[0] == 'TIMER_START') {

      console.log('Incoming Data :', dataString)
      // set config data
      crashPoint = dataString[1]
      rounds = dataString[2]
      days = dataString[3]
      hours = dataString[4]

      // Register the Timer

     Timer =  MainTimer(60*2, ()=>{
        console.log('Refreshing ...')
        console.log('Threads : ', threads)
        for (let i of threads) {
          i.bet = true
          i.status = 'ready'
        }
      })
      // Timer = setInterval(() => {
      //   console.log('Refreshing ...')
      //   console.log('Threads : ', threads)
      //   for (let i of threads) {
      //     i.bet = true
      //     i.status = 'ready'
      //   }
      // }, 2*60*1000)
      console.log('Timer has started...')

    } else if (dataString[0] == 'BET') {
      for (let i of threads) {
        if(i.status == 'pending'){
          break
        }
        if (i.bet && (i.status != 'pending')) {
          i.status = 'pending'
          // ws.send(['BET', i.thread])
          let query = `SELECT * FROM threads WHERE thread = '${i.thread}' `
          db.all(query, [], (err, data) => {
            if (err) throw console.error(err)
            console.log(data)
            clients.forEach(function (client) {
              client.send(JSON.stringify(['BET', i.thread, data[0].value]));
            });
          })

          break
        }

      }
      console.log('Sent Data : ', threads)
    } else if (dataString[0] == 'RESULT') {
      console.log('Incoming results : ', dataString)
      // ['RESULT', 'thread_1', 'win']
      if (dataString[2] == 'lost') {
        let lostThreadIndex
        for (let i of threads){
          if(i.thread == dataString[1]){
            lostThreadIndex = threads.indexOf(i)

          }


        }
        threads.splice(lostThreadIndex, 1)
        let query = `UPDATE threads SET status = false WHERE thread = '${dataString[1]}' `
        db.run(query, (err) => {
          if (err) throw console.log(err)
           
        })
        console.log(threads)

      } else if (dataString[2] == 'win') {
        let query = `SELECT * FROM threads WHERE thread = '${dataString[1]}' `
        db.all(query, [], (err, data) => {
          if (err) throw console.error(err)
          console.log(data)
          let query = `UPDATE threads SET value = ${data[0].value * 1.01} , rounds = ${data[0].rounds + 1} WHERE thread = '${dataString[1]}' `
          db.run(query, (err) => {
            if (err) throw console.log(err)
              for (let i of threads){
                if(i.thread == dataString[1]){
                  i.bet = false
                  i.status = 'betted'
      
                }
      
      
              }
          })

        });
      }
      let query = `SELECT * FROM threads WHERE thread = '${dataString[1]}' `
      db.all(query, [], (err, data) => {
        if (err) throw console.error(err)
      let query = `INSERT INTO bets(win, crash_point, acual_crash_point, thread, rounds, value) VALUES(${dataString[2] == 'win' ? 'true' : 'false'}, 1.01, ${dataString[3]}, '${dataString[1]}', ${data[0].rounds}, ${data[0].value} )`
    db.run(query, (err)=>{
      if(err) throw console.log(err)
    })
      })


    } else if (dataString[0] == 'TIMER_END') {
      // stop the timer
      console.log('Timer has stopped...')
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
      console.log(params, dataString, totalrecords, lossRecords, risk)
      db.run(query, params, (err) => {
        if (err) throw console.log(err)
      })



      pre_crash_point = dataString[3]
      const record = [...dataString, risk]

      clients.forEach(function (client) {
        client.send(JSON.stringify(['STREAM', record]));
      });
    }else  if (dataString[0] == 'CRASH'){
      console.log('crashed!')
      clients.forEach(function (client) {
        client.send(JSON.stringify(dataString));
      });
    }

  })



  ws.on('close', () => {
    console.log('Client disconnected');

  });
});