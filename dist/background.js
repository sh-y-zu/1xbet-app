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
    // console.log(request)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOztVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05BO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxpQ0FBaUM7QUFDakUsNEJBQTRCLHNEQUFzRDtBQUNsRjtBQUNBLHNEQUFzRCxxQkFBcUI7QUFDM0U7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLG1DQUFtQztBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLDREQUE0RDtBQUMzRjtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLGlCQUFpQixlQUFlO0FBQ2hDO0FBQ0EsTUFBTTtBQUNOLElBQUk7QUFDSjtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsdUJBQXVCLDZCQUE2QixvQkFBb0IiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8xeGJldC1hdXRvLWJvdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8xeGJldC1hdXRvLWJvdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vMXhiZXQtYXV0by1ib3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8xeGJldC1hdXRvLWJvdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLzF4YmV0LWF1dG8tYm90Ly4vYmFja2dyb3VuZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgcmVxdWlyZSBzY29wZVxudmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzb2NrZXQ7XHJcbmV4cG9ydCBmdW5jdGlvbiBjb25uZWN0V2ViU29ja2V0KCkge1xyXG4gICAgc29ja2V0ID0gbmV3IFdlYlNvY2tldCgnd3M6Ly81LjEwNC44MS4xOTQ6NTAwMCcpO1xyXG4gICAgc29ja2V0Lm9ub3BlbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnV2ViU29ja2V0IGNvbm5lY3Rpb24gb3BlbmVkJyk7XHJcbiAgICB9O1xyXG4gICAgc29ja2V0Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdNZXNzYWdlIGZyb20gc2VydmVyOicsIGV2ZW50LmRhdGEpO1xyXG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKGV2ZW50LmRhdGEpO1xyXG4gICAgICAgIGNocm9tZS5hY3Rpb24uc2V0SWNvbih7IHBhdGg6ICdpY29ucy9zb2NrZXQtYWN0aXZlLnBuZycgfSk7XHJcbiAgICAgICAgY2hyb21lLnRhYnMucXVlcnkoeyB1cmw6ICdodHRwczovLzF4YmV0LmNvbS9lbi9hbGxnYW1lc2VudHJhbmNlL2NyYXNoLyonIH0sIGZ1bmN0aW9uICh0YWJzKSB7XHJcbiAgICAgICAgICAgIGlmICh0YWJzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQsIHsgbWVzc2FnZTogZXZlbnQuZGF0YSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHNvY2tldC5vbmNsb3NlID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1dlYlNvY2tldCBjb25uZWN0aW9uIGNsb3NlZDonLCBldmVudCk7XHJcbiAgICAgICAgY2hyb21lLmFjdGlvbi5zZXRJY29uKHsgcGF0aDogJ2ljb25zL3NvY2tldC1pbmFjdGl2ZS5wbmcnIH0pO1xyXG4gICAgICAgIHNldFRpbWVvdXQoY29ubmVjdFdlYlNvY2tldCwgMTAwMCk7XHJcbiAgICB9O1xyXG4gICAgc29ja2V0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdXZWJTb2NrZXQgZXJyb3I6JywgZXJyb3IpO1xyXG4gICAgfTtcclxufVxyXG5jb25uZWN0V2ViU29ja2V0KCk7XHJcbi8vIGNocm9tZS5zY3JpcHRpbmdcclxuLy8gICAucmVnaXN0ZXJDb250ZW50U2NyaXB0cyhbe1xyXG4vLyAgICAgaWQ6IFwic2Vzc2lvbi1zY3JpcHRcIixcclxuLy8gICAgIGpzOiBbXCJjb250ZW50LmpzXCJdLFxyXG4vLyAgICAgcGVyc2lzdEFjcm9zc1Nlc3Npb25zOiBmYWxzZSxcclxuLy8gICAgIG1hdGNoZXM6IFtcIjxhbGxfdXJscz5cIl0sXHJcbi8vICAgICBydW5BdDogXCJkb2N1bWVudF9zdGFydFwiLFxyXG4vLyAgIH1dKVxyXG4vLyAgIC50aGVuKCgpID0+IGNvbnNvbGUubG9nKFwicmVnaXN0cmF0aW9uIGNvbXBsZXRlXCIpKVxyXG4vLyAgIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLndhcm4oXCJ1bmV4cGVjdGVkIGVycm9yXCIsIGVycikpXHJcbmNocm9tZS5zY3JpcHRpbmdcclxuICAgIC5nZXRSZWdpc3RlcmVkQ29udGVudFNjcmlwdHMoKVxyXG4gICAgLnRoZW4oZnVuY3Rpb24gKHNjcmlwdHMpIHsgcmV0dXJuIGNvbnNvbGUubG9nKFwicmVnaXN0ZXJlZCBjb250ZW50IHNjcmlwdHNcIiwgc2NyaXB0cyk7IH0pO1xyXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhyZXF1ZXN0KVxyXG4gICAgc29ja2V0LnNlbmQocmVxdWVzdCk7XHJcbn0pO1xyXG4vLyBjaHJvbWUuYWN0aW9uLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcigodGFiOmFueSkgPT4ge1xyXG4vLyAgIGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XHJcbi8vICAgICB0YXJnZXQ6IHsgdGFiSWQ6IHRhYi5pZCB9LFxyXG4vLyAgICAgZmlsZXM6IFtcImNvbnRlbnQuanNcIl1cclxuLy8gICB9KTtcclxuLy8gfSk7XHJcbi8vIGZ1bmN0aW9uIGdldEN1cnJlbnRUYWIoY2FsbGJhY2s6YW55KSB7XHJcbi8vICAgbGV0IHF1ZXJ5T3B0aW9ucyA9IHsgYWN0aXZlOiB0cnVlLCBsYXN0Rm9jdXNlZFdpbmRvdzogdHJ1ZSB9O1xyXG4vLyAgIGNocm9tZS50YWJzLnF1ZXJ5KHF1ZXJ5T3B0aW9ucywgKFt0YWJdKSA9PiB7XHJcbi8vICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKVxyXG4vLyAgICAgY29uc29sZS5lcnJvcihjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpO1xyXG4vLyAgICAgLy8gYHRhYmAgd2lsbCBlaXRoZXIgYmUgYSBgdGFicy5UYWJgIGluc3RhbmNlIG9yIGB1bmRlZmluZWRgLlxyXG4vLyAgICAgY2FsbGJhY2sodGFiKTtcclxuLy8gICB9KTtcclxuLy8gfVxyXG4vLyBjaHJvbWUudGFicy5xdWVyeSh7IHVybDogJ2h0dHBzOi8vZ2l0aHViLmNvbS8qJyB9LCBmdW5jdGlvbih0YWJzKSB7IH0pO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=