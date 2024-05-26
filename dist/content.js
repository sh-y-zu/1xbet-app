
window.onload = () => {


  

  const betStats = {
    thread: 'NOT',
    status: 'NOT'
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    let message = JSON.parse(request.message)

    if(message[0] == 'POP_OPENED'){
      if(document.querySelector("#curLoginForm")){
        chrome.runtime.sendMessage(['NOT_LOGGED_IN'])
      }else{
        chrome.runtime.sendMessage(['LOGGED_IN'])
      }
    }

    var clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });

    const iframe = document.querySelector("#maincontent > div.xgames > div > div > iframe")
    const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    const waitConnection = innerDoc.querySelector("#app > div.waiting-connection")
    const betButton = innerDoc.querySelector("#games_page > div.crash.games-container__game > div > div > div.crash__wrap.crash__wrap--main > div.crash__wrap.crash__wrap--bottom > div.crash__bet.crash-bet > form:nth-child(2) > button.crash-btn.crash-bet__btn.crash-bet__btn--play")
    const inputField = innerDoc.querySelector("#crash-bet")
    const cashout = innerDoc.querySelector("#games_page > div.crash.games-container__game > div > div > div.crash__wrap.crash__wrap--main > div.crash__wrap.crash__wrap--bottom > div.crash__bet.crash-bet > form:nth-child(2) > button.crash-btn.crash-bet__btn.crash-bet__btn--stop")

    cashout.disabled = false

    
    let inputClickDelay = Math.random() * (2000 - 100) + 100
    let inputDelay = (Math.random() * (2000 - 100) + 100) + inputClickDelay
    let betDelay = (Math.random() * (2000 - 100) + 100) + inputDelay


    if (message[0] == 'BET') {
      if (!waitConnection) {
        setTimeout(function () {
          inputField.dispatchEvent(clickEvent);
        }, inputClickDelay);

        setTimeout(function () {
          inputField.value = message[2]
        }, inputDelay);

        setTimeout(function () {
          betButton.dispatchEvent(clickEvent);
        }, betDelay);

        betStats.thread = message[1]
      } else {
        chrome.runtime.sendMessage(['NOT_BET'])
      }




    } else if (message[0] == 'STREAM') {
      console.log('Message from background script:', message);
    } else if (message[0] == 'CRASH') {
      if (betStats.thread !== 'NOT') {
        if (betStats.status == 'NOT') {
          betStats.status = parseFloat(message[1]) >= 1.01 ? 'win' : 'lost'
        }

        console.log(betStats)
        chrome.runtime.sendMessage(['RESULT', betStats.thread, betStats.status, message[1]], (response) => {
          betStats.thread = 'NOT'
          betStats.status = 'NOT'
        })


      } else {
        console.log('♦ ♣ ♠ ♥')
      }
    }






    if (!waitConnection) {
      const crashTimer = setInterval(() => {
        let crash = innerDoc.querySelector(" #games_page > div.crash.games-container__game > div > div > div.crash__wrap.crash__wrap--main > div.crash__game.crash-game > div.crash-game__timeline > svg > g:nth-child(5) > text")
        let crashPoint = parseFloat(crash?.textContent?.trim().slice(0, -1))

        if (crashPoint >= 1.01 && message[0] == 'BET') {
          cashout.dispatchEvent(clickEvent);

        }

        if (crashPoint >= 1.02) {
          betStats.status = 'win'
          clearInterval(crashTimer)
        }
      }, 10)
    } else {
      chrome.runtime.sendMessage(['DISCONNECTED'])
    }



    cashout.addEventListener('click', function (e) {
      console.log('Mouse click event detected on window:', e);
      // e.preventDefault(); // Uncomment this line to test event canceling
    });
  
    betButton.addEventListener('click', function (e) {
      console.log('Mouse click event detected on window:', e);
      // e.preventDefault(); // Uncomment this line to test event canceling
    });


  });



}


setInterval(() => {

  const iframe = document.querySelector("#maincontent > div.xgames > div > div > iframe")
  const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
  const waitConnection = innerDoc.querySelector("#app > div.waiting-connection")

  if (!waitConnection) {
    chrome.runtime.sendMessage(['LIVE'])
  } else {
    chrome.runtime.sendMessage(['DISCONNECTED'])
  }

}, 1000)