class TemporaryContainers {
  constructor() {
    this.initialized = false;

    this.storage = new window.Storage;
    this.utils = new window.Utils(this);
    this.runtime = new window.Runtime(this);
    this.management = new window.Management(this);
    this.request = new window.Request(this);
    this.container = new window.Container(this);
    this.mouseclick = new window.MouseClick(this);
    this.tabs = new window.Tabs(this);
    this.commands = new window.Commands(this);
    this.browseraction = new window.BrowserAction(this);
    this.pageaction = new window.PageAction(this);
    this.contextmenu = new window.ContextMenu(this);
    this.cookies = new window.Cookies(this);
    this.isolation = new window.Isolation(this);
    this.statistics = new window.Statistics(this);
    this.mac = new window.MultiAccountContainers(this);
    this.migration = new window.Migration(this);
    this.proxy = new window.Proxy(this);
  }


  async initialize() {
    // register message listener
    browser.runtime.onMessage.addListener(this.runtime.onMessage.bind(this));

    // TODO cache permissions in storage based on firefox version >=60.0b1
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1402850
    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/getBrowserInfo
    this.permissions = {
      history: await browser.permissions.contains({permissions: ['history']}),
      notifications: await browser.permissions.contains({permissions: ['notifications']})
    };

    await this.storage.load();

    this.request.initialize();
    this.runtime.initialize();
    this.container.initialize();
    this.mouseclick.initialize();
    this.commands.initialize();
    this.browseraction.initialize();
    this.pageaction.initialize();
    this.contextmenu.initialize();
    this.cookies.initialize();
    this.statistics.initialize();
    this.mac.initialize();
    this.proxy.initialize();

    await this.management.initialize();
    await this.tabs.initialize();

//     function getProxyInfo(proxy) {
//       return {
//         type: "socks",
//         host: proxy.host_prefix + ".mullvad.net",
//         port: 1080
//       }
//     }
// 
//     function handleProxyRequest({ tabId }) {
//       // if (shouldProxyRequest(requestInfo)) {
//       //   console.log(`Proxying: ${requestInfo.url}`);
//       //   return {type: "http", host: "127.0.0.1", port: 65535};
//       // }
// 
//       let that = window.tmp
// 
//       if (!tabId || tabId === -1) {
//         return { type: "direct" };
//       }
// 
//       console.log("HANDLE")
//       console.log(tabId)
//       console.log(that.storage.local.tempContainers)
//       console.log(that.container.tabContainerMap)
//       console.log("Done")
// 
//       let container = that.storage.local.tempContainers[that.container.tabContainerMap[tabId]]
// 
//       console.log(container)
// 
//       if (container.proxy) {
//         let proxyInfo = getProxyInfo(container.proxy)
//         console.log("Using proxy", proxyInfo)
//         return proxyInfo
//       } else {
//         console.log("Not using proxy")
//         return { type: "direct" }
//       }
//     }
//     browser.proxy.onRequest.addListener(handleProxyRequest, {urls: ["<all_urls>"]});

    this.initialized = true;
  }
}

window.TemporaryContainers = TemporaryContainers;
window.tmp = new TemporaryContainers();

browser.runtime.onInstalled.addListener(tmp.runtime.onInstalled.bind(tmp));
browser.runtime.onStartup.addListener(tmp.runtime.onStartup.bind(tmp));

// console.log("window", window, tmp.storage)
// window.l = tmp.storage.local

/* istanbul ignore next */
if (!browser._mochaTest) {
  tmp.initialize();
}
