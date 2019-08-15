"use strict";const config={networkUrl:{main:"https://service.goldmint.io/sumus/mainnet/v1",test:"https://service.goldmint.io/sumus/testnet/v1"},checkTxUrl:"/tx/",addTxUrl:"/tx",blockChainStatus:"/status",successTxStatus:"approved",staleTxStatus:"stale",checkTxTime:3e4};let isFirefox="undefined"!=typeof InstallTrigger,brows=isFirefox?browser:chrome,xhr=new XMLHttpRequest;function actions(e,t){e.identify&&login(e),e.logout&&logout(),e.checkLoginStatus&&sendMessage("loginStatus",!!window.sessionStorage.getItem("identify")),e.sendTransaction&&createConfirmWindow(e.sendTransaction,t.tab.id),e.hasOwnProperty("sendTxResult")&&brows.tabs.query({active:!0,currentWindow:!0},t=>{brows.tabs.sendMessage(+e.sendTxResult.tabId,{sendTxResultContent:e.sendTxResult})}),e.signMessage&&createSignMessageWindow(e.signMessage,t.tab.id),e.hasOwnProperty("sendSignResult")&&brows.tabs.query({active:!0,currentWindow:!0},t=>{brows.tabs.sendMessage(+e.sendSignResult.tabId,{sendSignResultContent:e.sendSignResult})}),e.getIdentifier&&sendMessage("identifier",window.sessionStorage.getItem("identify")),e.openSendTokenPage&&openSendTokenPage()}function login(e){window.sessionStorage.setItem("identify",e.identify),sendMessage("login",!0)}function logout(){window.sessionStorage.removeItem("identify"),sendMessage("login",!1)}function sendMessage(e,t){brows.tabs.query({active:!0,currentWindow:!0},s=>{brows.tabs.sendMessage(s[0].id,{[e]:t})})}function watchTransactionStatus(){brows.storage.local.get(null,e=>{let t=e.wallets,s=!0,n={main:0,test:0},o=!1;if(t&&t.forEach(e=>{e.tx&&e.tx.length&&(s=!1)}),s)return;const i=http("GET",config.networkUrl.main+config.blockChainStatus),a=http("GET",config.networkUrl.test+config.blockChainStatus);Promise.all([i,a]).then(e=>{e&&e.forEach((e,t)=>{e&&e.res&&e.res.blockchain_state&&e.res.blockchain_state.block_count?n[Object.keys(n)[t]]=+e.res.blockchain_state.block_count-1:o=!0})}),!o&&t&&t.forEach(e=>{e.tx&&e.tx.forEach(e=>{setTimeout(()=>{checkTransactionStatus(e.hash,e.endTime,e.network,e.data,e.blockId,n[e.network])},200)})})})}function checkTransactionStatus(e,t,s,n,o,i){(new Date).getTime()<t?http("GET",config.networkUrl[s]+config.checkTxUrl+e).then(t=>{t&&t.res&&(t.res.status==config.successTxStatus?(finishTx(e),successTxNotification(e)):+o!=+i&&http("POST",config.networkUrl[s]+config.addTxUrl,{name:n.name,data:n.data}).then(()=>{brows.storage.local.get(null,t=>{let s=t.wallets;s=s.map(t=>(t.tx&&t.tx.hash===e&&(t.tx.blockId=i),t)),brows.storage.local.set({wallets:s},()=>{})})}).catch(t=>{let s=!1;t.res&&(t.res.code?42!=t.res.code&&43!=t.res.code&&(s=!0):s=!0),s||(finishTx(e),failedTxNotification(e))}))}):(finishTx(e),failedTxNotification(e))}function clearMessagesForSign(){brows.storage.local.set({messagesForSign:[]},()=>{})}function http(e,t,s=""){let n=new XMLHttpRequest,o="GET"===e.toUpperCase()?t+s:t;return n.open(e.toUpperCase(),o,!0),n.setRequestHeader("Content-Type","application/json"),"GET"===e.toUpperCase()?n.send():n.send(JSON.stringify(s)),new Promise((e,t)=>{n.onload=(()=>{if(n.status>=200&&n.status<300)try{e(JSON.parse(n.responseText))}catch(t){e(null)}else try{t(JSON.parse(n.responseText))}catch(t){e(null)}})})}function finishTx(e){brows.storage.local.get(null,t=>{let s=t.wallets;s&&(s=s.map(t=>(t.tx&&t.tx.length&&(t.tx=t.tx.filter(t=>t.hash!=e)),t)),brows.storage.local.set({wallets:s},()=>{}))})}function successTxNotification(e){new Notification("Goldmint Lite Wallet",{icon:"assets/icon.png",body:`Transaction ${e} is confirmed`})}function failedTxNotification(e){new Notification("Goldmint Lite Wallet",{icon:"assets/icon.png",body:`Transaction ${e} is failed`})}function createConfirmWindow(e,t){brows.windows.create({url:`confirm-tx.html?id=${e}&tabId=${t}`,type:"popup",width:300,height:520},e=>{})}function createSignMessageWindow(e,t){brows.windows.create({url:`sign-message.html?id=${e}&tabId=${t}`,type:"popup",width:300,height:520},e=>{})}function openSendTokenPage(){brows.tabs.create({active:!0,url:"index.html"},null)}isFirefox?brows.runtime.onMessage.addListener((e,t,s)=>{actions(e,t)}):brows.extension.onMessage.addListener((e,t,s)=>{actions(e,t)}),clearMessagesForSign(),watchTransactionStatus(),setInterval(()=>{watchTransactionStatus()},config.checkTxTime);
