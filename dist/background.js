/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!***********************!*\
  !*** ./background.ts ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   connectWebSocket: () => (/* binding */ connectWebSocket)
/* harmony export */ });
var socket;
function connectWebSocket() {
    socket = new WebSocket('ws://5.104.81.194:5000');
    socket.onopen = function () {
        console.log('WebSocket connection opened');
    };
    socket.onmessage = function (event) {
        // console.log('Message from server:', event.data);
        chrome.runtime.sendMessage(event.data);
        chrome.action.setIcon({ path: 'icons/socket-active.png' });
        chrome.tabs.query({ url: 'https://1xbet.com/en/allgamesentrance/crash/*' }, function (tabs) {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, { message: event.data });
            }
        });
    };
    socket.onclose = function (event) {
        console.log('WebSocket connection closed:', event);
        chrome.action.setIcon({ path: 'icons/socket-inactive.png' });
        setTimeout(connectWebSocket, 1000);
    };
    socket.onerror = function (error) {
        console.error('WebSocket error:', error);
    };
}
connectWebSocket();
// chrome.scripting
//   .registerContentScripts([{
//     id: "session-script",
//     js: ["content.js"],
//     persistAcrossSessions: false,
//     matches: ["<all_urls>"],
//     runAt: "document_start",
//   }])
//   .then(() => console.log("registration complete"))
//   .catch((err) => console.warn("unexpected error", err))
chrome.scripting
    .getRegisteredContentScripts()
    .then(function (scripts) { return console.log("registered content scripts", scripts); });
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    socket.send(request);
});
// chrome.action.onClicked.addListener((tab:any) => {
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     files: ["content.js"]
//   });
// });
// function getCurrentTab(callback:any) {
//   let queryOptions = { active: true, lastFocusedWindow: true };
//   chrome.tabs.query(queryOptions, ([tab]) => {
//     if (chrome.runtime.lastError)
//     console.error(chrome.runtime.lastError);
//     // `tab` will either be a `tabs.Tab` instance or `undefined`.
//     callback(tab);
//   });
// }
// chrome.tabs.query({ url: 'https://github.com/*' }, function(tabs) { });

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOztVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05BO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxpQ0FBaUM7QUFDakUsNEJBQTRCLHNEQUFzRDtBQUNsRjtBQUNBLHNEQUFzRCxxQkFBcUI7QUFDM0U7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLG1DQUFtQztBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLDREQUE0RDtBQUMzRjtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxpQkFBaUIsZUFBZTtBQUNoQztBQUNBLE1BQU07QUFDTixJQUFJO0FBQ0o7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLHVCQUF1Qiw2QkFBNkIsb0JBQW9CIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vMXhiZXQtYXV0by1ib3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vMXhiZXQtYXV0by1ib3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLzF4YmV0LWF1dG8tYm90L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vMXhiZXQtYXV0by1ib3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8xeGJldC1hdXRvLWJvdC8uL2JhY2tncm91bmQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc29ja2V0O1xyXG5leHBvcnQgZnVuY3Rpb24gY29ubmVjdFdlYlNvY2tldCgpIHtcclxuICAgIHNvY2tldCA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vNS4xMDQuODEuMTk0OjUwMDAnKTtcclxuICAgIHNvY2tldC5vbm9wZW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1dlYlNvY2tldCBjb25uZWN0aW9uIG9wZW5lZCcpO1xyXG4gICAgfTtcclxuICAgIHNvY2tldC5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnTWVzc2FnZSBmcm9tIHNlcnZlcjonLCBldmVudC5kYXRhKTtcclxuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShldmVudC5kYXRhKTtcclxuICAgICAgICBjaHJvbWUuYWN0aW9uLnNldEljb24oeyBwYXRoOiAnaWNvbnMvc29ja2V0LWFjdGl2ZS5wbmcnIH0pO1xyXG4gICAgICAgIGNocm9tZS50YWJzLnF1ZXJ5KHsgdXJsOiAnaHR0cHM6Ly8xeGJldC5jb20vZW4vYWxsZ2FtZXNlbnRyYW5jZS9jcmFzaC8qJyB9LCBmdW5jdGlvbiAodGFicykge1xyXG4gICAgICAgICAgICBpZiAodGFicy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJzWzBdLmlkLCB7IG1lc3NhZ2U6IGV2ZW50LmRhdGEgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBzb2NrZXQub25jbG9zZSA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdXZWJTb2NrZXQgY29ubmVjdGlvbiBjbG9zZWQ6JywgZXZlbnQpO1xyXG4gICAgICAgIGNocm9tZS5hY3Rpb24uc2V0SWNvbih7IHBhdGg6ICdpY29ucy9zb2NrZXQtaW5hY3RpdmUucG5nJyB9KTtcclxuICAgICAgICBzZXRUaW1lb3V0KGNvbm5lY3RXZWJTb2NrZXQsIDEwMDApO1xyXG4gICAgfTtcclxuICAgIHNvY2tldC5vbmVycm9yID0gZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignV2ViU29ja2V0IGVycm9yOicsIGVycm9yKTtcclxuICAgIH07XHJcbn1cclxuY29ubmVjdFdlYlNvY2tldCgpO1xyXG4vLyBjaHJvbWUuc2NyaXB0aW5nXHJcbi8vICAgLnJlZ2lzdGVyQ29udGVudFNjcmlwdHMoW3tcclxuLy8gICAgIGlkOiBcInNlc3Npb24tc2NyaXB0XCIsXHJcbi8vICAgICBqczogW1wiY29udGVudC5qc1wiXSxcclxuLy8gICAgIHBlcnNpc3RBY3Jvc3NTZXNzaW9uczogZmFsc2UsXHJcbi8vICAgICBtYXRjaGVzOiBbXCI8YWxsX3VybHM+XCJdLFxyXG4vLyAgICAgcnVuQXQ6IFwiZG9jdW1lbnRfc3RhcnRcIixcclxuLy8gICB9XSlcclxuLy8gICAudGhlbigoKSA9PiBjb25zb2xlLmxvZyhcInJlZ2lzdHJhdGlvbiBjb21wbGV0ZVwiKSlcclxuLy8gICAuY2F0Y2goKGVycikgPT4gY29uc29sZS53YXJuKFwidW5leHBlY3RlZCBlcnJvclwiLCBlcnIpKVxyXG5jaHJvbWUuc2NyaXB0aW5nXHJcbiAgICAuZ2V0UmVnaXN0ZXJlZENvbnRlbnRTY3JpcHRzKClcclxuICAgIC50aGVuKGZ1bmN0aW9uIChzY3JpcHRzKSB7IHJldHVybiBjb25zb2xlLmxvZyhcInJlZ2lzdGVyZWQgY29udGVudCBzY3JpcHRzXCIsIHNjcmlwdHMpOyB9KTtcclxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uIChyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xyXG4gICAgc29ja2V0LnNlbmQocmVxdWVzdCk7XHJcbn0pO1xyXG4vLyBjaHJvbWUuYWN0aW9uLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcigodGFiOmFueSkgPT4ge1xyXG4vLyAgIGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XHJcbi8vICAgICB0YXJnZXQ6IHsgdGFiSWQ6IHRhYi5pZCB9LFxyXG4vLyAgICAgZmlsZXM6IFtcImNvbnRlbnQuanNcIl1cclxuLy8gICB9KTtcclxuLy8gfSk7XHJcbi8vIGZ1bmN0aW9uIGdldEN1cnJlbnRUYWIoY2FsbGJhY2s6YW55KSB7XHJcbi8vICAgbGV0IHF1ZXJ5T3B0aW9ucyA9IHsgYWN0aXZlOiB0cnVlLCBsYXN0Rm9jdXNlZFdpbmRvdzogdHJ1ZSB9O1xyXG4vLyAgIGNocm9tZS50YWJzLnF1ZXJ5KHF1ZXJ5T3B0aW9ucywgKFt0YWJdKSA9PiB7XHJcbi8vICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKVxyXG4vLyAgICAgY29uc29sZS5lcnJvcihjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpO1xyXG4vLyAgICAgLy8gYHRhYmAgd2lsbCBlaXRoZXIgYmUgYSBgdGFicy5UYWJgIGluc3RhbmNlIG9yIGB1bmRlZmluZWRgLlxyXG4vLyAgICAgY2FsbGJhY2sodGFiKTtcclxuLy8gICB9KTtcclxuLy8gfVxyXG4vLyBjaHJvbWUudGFicy5xdWVyeSh7IHVybDogJ2h0dHBzOi8vZ2l0aHViLmNvbS8qJyB9LCBmdW5jdGlvbih0YWJzKSB7IH0pO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=