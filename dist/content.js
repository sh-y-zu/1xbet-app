
window.onload = () => {




  const betStats = [{
    thread: 'thread_1',
    status: 'NOT'
  },
  {
    thread: 'thread_2',
    status: 'NOT'
  },
  {
    thread: 'thread_3',
    status: 'NOT'
  }
  ]

  const round = { rounds: 0, status: false }


  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    let message = JSON.parse(request.message)

    if (message[0] == 'POP_OPENED') {
      if (document.querySelector("#curLoginForm")) {
        chrome.runtime.sendMessage(['NOT_LOGGED_IN'])
      } else {
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
    const autobetSelect = innerDoc.querySelector("#games_page > div.crash.games-container__game > div > div > div.crash__wrap.crash__wrap--main > div.crash__wrap.crash__wrap--bottom > div.crash__bet.crash-bet > div > button:nth-child(2)")
    const baseStakeInput = innerDoc.querySelector("#crash-bet-base")
    const maxStakeInput = innerDoc.querySelector("#crash-bet-limit")
    const autoOdd = innerDoc.querySelector("#crash-bet-cashout")
    const startAuto = innerDoc.querySelector("#games_page > div.crash.games-container__game > div > div > div.crash__wrap.crash__wrap--main > div.crash__wrap.crash__wrap--bottom > div.crash__bet.crash-bet > form:nth-child(3) > button:nth-child(2)")
    const stopAuto = innerDoc.querySelector("#games_page > div.crash.games-container__game > div > div > div.crash__wrap.crash__wrap--main > div.crash__wrap.crash__wrap--bottom > div.crash__bet.crash-bet > form:nth-child(3) > button:nth-child(3)")

    cashout.disabled = false


    let ClickDelay = (Math.random() * (1000 - 100) + 100)
    let inputDelay = (Math.random() * (1000 - 100) + 100) + ClickDelay
    let betDelay = (Math.random() * (1000 - 100) + 100) + inputDelay


    if (message[0] == 'BET' && round.rounds == 0) {
    
        setTimeout(function () {
          autobetSelect.dispatchEvent(clickEvent);
          baseStakeInput.autocomplete = 'on'
          maxStakeInput.autocomplete = 'on'
          autoOdd.autocomplete = 'on'
        }, ClickDelay);

        setTimeout(function () {
          baseStakeInput.value = Math.round(parseInt(message[2]) * 100) / 100
          maxStakeInput.value = (Math.round(parseInt(message[2]) * 100) / 100) + 1
          autoOdd.value = 1.01
        }, inputDelay);

        setTimeout(function () {
          startAuto.dispatchEvent(clickEvent);
        }, betDelay);

        // betStats.thread = message[1]
        round.status = true


    




    } else if (message[0] == 'STREAM') {
      console.log('Message from background script:', message);
    } else if (message[0] == 'BET' && round.rounds > 3) {
      stopAuto.dispatchEvent(clickEvent);

    } else if (message[0] == 'CRASH') {

      if (round.status) {
        betStats[round.rounds].status = parseFloat(message[1]) >= 1.01 ? 'win' : 'lost'
        chrome.runtime.sendMessage(['RESULT', betStats[round.rounds].thread, betStats[round.rounds].status, message[1]], (response) => {
          betStats[round.rounds].status = 'NOT'
          round.rounds = round.rounds + 1 
        })
      }

    

      } else {
        console.log('♦ ♣ ♠ ♥')
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


  const callback = (mutationsList, observer) => {
    var clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    const iframe = document.querySelector("#maincontent > div.xgames > div > div > iframe")
    const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    const cashout = innerDoc.querySelector("#games_page > div.crash.games-container__game > div > div > div.crash__wrap.crash__wrap--main > div.crash__wrap.crash__wrap--bottom > div.crash__bet.crash-bet > form:nth-child(2) > button.crash-btn.crash-bet__btn.crash-bet__btn--stop")

    for (let mutation of mutationsList) {

      if (mutation.target.parentElement == innerDoc.querySelector("#games_page > div.crash.games-container__game > div > div > div.crash__wrap.crash__wrap--main > div.crash__game.crash-game > div:nth-child(5)") || mutation.target.parentElement == document.querySelector("#games_page > div.crash.games-container__game > div > div > div.crash__wrap.crash__wrap--main > div.crash__game.crash-game > div.crash-game__info.crash-game__info--results.crash-game-info")) {
        // console.log(mutation)
      }

      if (mutation.type === 'characterData' && mutation.target.nodeName == "#text" && mutation.target.parentElement == innerDoc.querySelector("#games_page > div.crash.games-container__game > div > div > div.crash__wrap.crash__wrap--main > div.crash__game.crash-game > div.crash-game__timeline > svg > g:nth-child(5) > text")) {

        let crashPoint = mutation.target.textContent.trim().slice(0, -1)
        // console.log(crashPoint );
        if (crashPoint == 1.01) {
          // console.log('win')
          cashout.dispatchEvent(clickEvent);
        }





      }
      else if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            console.log('New text content added:', node);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Recursively observe new elements for text content changes
            observeTextContent(node);
          }
        });
      }


    }
  };

  // Options for the observer (which mutations to observe)
  const config = {
    characterData: true,
    childList: true,
    subtree: true
  };

  // Function to start observing an element for text content changes
  const observeTextContent = (targetNode) => {
    // Create an instance of MutationObserver with the callback
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
  };

  // Select the element you want to observe

  const iframe = document.querySelector("#maincontent > div.xgames > div > div > iframe")
  const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
  const targetElement = innerDoc.querySelector("body")


  if (targetElement) {

    observeTextContent(targetElement);
  } else {
    console.log('not ', targetElement)
  }


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

}, 3000)

