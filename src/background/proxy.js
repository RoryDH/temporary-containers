const timeoutableFetch = (url, options = {}) => {
  let { timeout = 5000, ...rest } = options;
  if (rest.signal) throw new Error("Signal not supported in timeoutable fetch");
  const controller = new AbortController();
  const { signal } = controller;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Timeout for Promise"));
      controller.abort();
    }, timeout);
    fetch(url, { signal, ...rest })
      .finally(() => clearTimeout(timer))
      .then(resolve, reject);
  });
};

const lastPerformanceEntry = (url) => {
  let entries = performance.getEntriesByType("resource")
  for (var i = entries.length - 1; i >= 0; i--) {
    if (entries[i].name === url) {
      return entries[i]
    }
  }
}

const ttfb = ({ connectStart, responseStart }) => responseStart - connectStart

// const banks = [["Abhyudaya Co-op Bank","http://www.abhyudaya.com"],["Abu Dhabi Commercial Bank","http://www.adcb.com"],["Ahmedabad Mercantile Co-op Bank","http://www.amco-bank.com"],["Akola District Central Co-op Bank","http://akoladcc.com"],["Akola Janata Commercial Co-op Bank","http://www.akolajanatabank.com"],["Allahabad Bank","http://www.allahabadbank.com"],["Almora Urban Co-op Bank","http://almoraurbanbank.com"],["Andhra Bank","http://www.andhrabank.in"],["Andhra pradesh State Co-Op Bank","http://www.apcob.org"],["Andhra Pragathi Grameena Bank","http://www.apgb.co.in"],["Apna Sahakari Bank","http://www.apnabank.co.in"],["Australia and New Zealand Banking Group","http://www.anz.com"],["Axis Bank","http://www.axisbank.com"],["Bank of America","http://www.bankofamerica.com"],["Bank of Bahrain and Kuwait","http://www.bbkonline.com"],["Bank of Baroda","http://www.bankofbaroda.com"],["Bank of Ceylon","http://www.boc.lk"],["Bank of India","http://www.bankofindia.com"],["Bank of Maharashtra","http://www.bankofmaharashtra.in"],["Bank of Nova Scotia","http://www.scotiabank.com"],["Bank of Tokyo Mitsubishi UFJ","http://www.bk.mufg.jp/global/globalnetwork/asiaoceania/#India"],["Barclays Bank","http://www.barclays.in"],["Bassein Catholic Co-op Bank","http://www.bccb.co.in"],["Bharat Co-op Bank (Mumbai)","http://www.bharatbank.com"],["BNP Paribas","http://www.bnpparibas.com"],["Canara Bank","http://www.canarabank.com"],["Capital Local Area Bank","http://www.capitalbank.co.in"],["Catholic Syrian Bank","http://www.csb.co.in"],["Central Bank of India","http://www.centralbankofindia.co.in"],["China Trust Commercial Bank","http://www.chinatrustindia.com"],["Citi Bank","http://www.citibank.com"],["Citizen Credit Co-op Bank","http://www.citizencreditbank.com"],["City Union Bank","http://www.cityunionbank.com"],["Commonwealth Bank of Australia","http://www.commbank.co.in"],["Corporation Bank","http://www.corpbank.com"],["Cosmos Co-op Bank","http://www.cosmosbank.com"],["Credit Agricole Corporate and Investment Bank","http://www.ca-cib.com"],["Credit Suisse","http://www.credit-suisse.com"],["Delhi State Co-op Bank","http://plus.google.com/107903992827578686784/about?hl=en"],["Dena Bank","http://www.denabank.com"],["Deposit Insurance and Credit Guarantee Corporation","http://www.dicgc.org.in"],["Deutsche Bank","http://www.db.com"],["Development Bank of Singapore (DBS)","http://www.dbs.com"],["Development Credit Bank (DCB)","http://www.dcbbank.com"],["Dhanlaxmi Bank","http://www.dhanbank.com"],["Dombivli Nagari Sahakari Bank","http://www.dnsb.co.in"],["Federal Bank","http://www.federalbank.co.in"],["Firstrand Bank","http://firstrand.co.in"],["Gadchiroli District Central Co-op Bank","http://www.gdccbank.com"],["Gopinath Patil Parsik Janata Sahakari Bank","http://www.gpparsikbank.com"],["Greater Bombay Co-op Bank","http://www.greaterbank.com"],["Gujarat State Co-op Bank","http://www.gscbank.co.in"],["Gurgaon Gramin Bank","http://plus.google.com/115047032409973911708/about?hl=en"],["HDFC Bank","http://www.hdfcbank.com"],["HSBC","http://www.hsbc.co.in"],["ICICI Bank","http://www.icicibank.com"],["IDBI Bank","http://www.idbi.com"],["Indian Bank","http://www.indianbank.in"],["Indian Overseas Bank (IOB)","http://www.iob.in"],["Indonesia International Bank","http://www.bankbii.co.in"],["Indusind Bank","http://www.indusind.com"],["Industrial and Commercial Bank of China","http://www.icbc-ltd.com/icbcltd/en/"],["ING Vysya Bank","http://www.ingvysyabank.com"],["Jalgaon Janata Sahkari Bank (JJSB) Ltd","http://www.jjsbl.com"],["Jalgaon Peoples Co-op Bank","http://www.jpcbank.com"],["Jammu and Kashmir Bank","http://www.jkbank.net"],["Janakalyan Sahakari Bank Ltd","http://www.jksbl.com"],["Janaseva Sahakari Bank (Borivali)","http://janasevabank.in"],["Janaseva Sahakari Bank (Pune)","http://janasevabankpune.net"],["JP Morgan Chase Bank","http://www.jpmorgan.com"],["Kallappanna Awade Ichalkaranji Janata Sahakari (KAIJS) Bank","http://www.ijsbank.com"],["Kalupur Commercial Co-op Bank","http://www.kalupurbank.com"],["Kalyan Janata Sahakari Bank","http://kalyanjanata.in"],["Kangra Central Co-op Bank","http://www.kccb.in"],["Kapole Co-op Bank","http://www.kapolbank.com"],["Karad Urban Co-op Bank","http://www.karadurbanbank.com"],["Karnataka Bank","http://www.karnatakabank.com"],["Karnataka State Co-op Apex Bank","http://www.karnatakaapex.com"],["Karnataka Vikas Grameena Bank","http://www.kvgbank.com"],["Karur Vysya Bank (KVB)","http://www.kvb.co.in"],["Kotak Mahindra Bank","http://www.kotak.com"],["Kurmanchal Nagar Sahkari Bank","http://www.kurmanchalbank.com"],["Lakshmi Vilas Bank (LVB)","http://www.lvbank.com"],["Mahanagar Co-op Bank","http://www.mahanagarbank.com"],["Maharashtra State Co-op Bank","http://www.mscbank.com"],["Malabar Gramin Bank","http://keralagbank.com"],["Mashreq Bank","http://www.mashreqbank.com"],["Mizuho Co-op Bank","http://www.mizuhobank.com"],["Mumbai District Central Co-op Bank","http://www.mumbaidistrictbank.com"],["Municipal Co-op Bank (Mumbai)","http://www.municipalbankmumbai.com"],["Nagar Urban Co-op Bank","http://plus.google.com/118254408225094337228/about?gl=in&amp;hl=en"],["Nagpur Nagrik Sahakari Bank","http://www.nnsbank.co.in"],["Nainital Bank","http://www.nainitalbank.co.in"],["Nasik Merchants Co-op Bank","http://www.nasikonline.com"],["National Australia Bank","http://nabasia.in"],["New India Co-op Bank","http://www.newindiabank.in"],["North Kanara GSB (NKGSB) Co-op Bank","http://www.nkgsb-bank.com"],["Nutan Nagarik Sahakari Bank","http://www.nutanbank.com"],["Oman International Bank","http://www.oib.co.om"],["Oriental Bank of Commerce","http://www.obcindia.co.in"],["Prathama Bank","http://www.prathamabank.org"],["Prime Co-op Bank","http://primebankindia.com"],["Punjab and Maharashtra Co-op Bank","http://www.pmcbank.com"],["Punjab and Sind Bank","http://www.psbindia.com"],["Punjab National Bank","http://www.pnbindia.in"],["RABO Bank International","http://www.rabobank.com"],["Rajaguru nagar Sahakari Bank","http://rajgurunagarbank.com"],["Rajasthan State Co-op Bank","http://www.rscb.org.in"],["Rajkot Nagarik Sahakari Bank","http://www.rnsbindia.com"],["Ratnakar Bank","http://ratnakarbank.co.in"],["Reserve Bank of India","http://www.rbi.org.in"],["Royal Bank of Scotland","http://www.rbs.in"],["Sahebrao Deshmukh Co-op Bank","http://sdcbankct.in"],["Saraswat Co-op Bank","http://www.saraswatbank.com"],["Sberbank of Russia","http://sberbank.ru"],["Seva Vikas Co-op Bank","http://www.sevavikasbank.com"],["Shamrao Vithal Co-op Bank","http://www.svcbank.com"],["Shinhan Bank","http://www.shinhanbankindia.com"],["Shri Chhatrapathi Rajarshi Shahu Urban Co-op Bank","http://www.shahubank.com"],["Societe Generale","http://www.sgcib.com"],["Solapur Janata Sahkari Bank","http://sjsbbank.com"],["South Indian Bank","http://www.southindianbank.com"],["Standard Chartered Bank","http://www.standardchartered.co.in"],["State Bank of Bikaner and Jaipur","http://www.sbbjbank.com"],["State Bank of Hyderabad","http://www.sbhyd.com"],["State Bank of India (SBI)","http://www.sbi.co.in"],["State Bank of Mauritius","http://www.sbmgroup.mu"],["State Bank of Mysore","http://www.statebankofmysore.co.in"],["State Bank of Patiala","http://www.sbp.co.in"],["State Bank of Travancore (SBT)","http://www.statebankoftravancore.com"],["Sumitomo Mitsui Banking Corporation","http://www.smbc.co.jp/global"],["Surat District Co-op Bank","http://www.sudicobank.com"],["Surat Peoples Co-op Bank","http://www.spcbl.in"],["Sutex Co-op Bank","http://www.sutexbank.in"],["Syndicate Bank","http://www.syndicatebank.in"],["Tamilnad Mercantile Bank (TMB)","http://www.tmb.in"],["Tamilnadu State Apex Co-op Bank","http://www.tnscbank.com"],["Thane Bharat Sahakari Bank","http://www.thanebharatbank.com"],["Thane District Central Co-op Bank","http://thanedistrictbank.com"],["Thane Janata Sahakari Bank (TJSB)","http://www.thanejanata.co.in"],["Tumkur Grain Merchants Co-op Bank","http://tgmcbank.com"],["UCO Bank","http://www.ucobank.com"],["Union Bank of India","http://www.unionbankofindia.co.in"],["United Bank of India","http://www.unitedbankofindia.com"],["United Overseas Bank","http://www.uobgroup.com/in"],["Varachha Co-op Bank","http://www.varachhabank.com"],["Vasai Vikas Sahakari Bank","http://vasaivikasbank.com"],["Vijaya Bank","http://www.vijayabank.com"],["Vishweshwar Sahakari Bank","http://vishweshwarbank.com"],["West Bengal State Co-op Bank","http://www.wbscb.com"],["Westpac Banking Corporation","http://http://www.westpac.com.au/about-westpac/global-locations/westpac-in-asia/india-website/"],["Woori Bank","http://in.wooribank.com"],["Yes Bank","http://www.yesbank.in"],["Zila Sahkari Bank (Ghaziabad)","http://plus.google.com/115014569969060454496/about?gl=in&amp;hl=en"]]
const banks = [["https://www.adcb.com/?AspxAutoDetectCookieSupport=1","Abu Dhabi Commercial Bank"],["https://www.amcobank.com/","Ahmedabad Mercantile Co-op Bank"],["https://www.akoladccbank.com/","Akola District Central Co-op Bank"],["http://www.akolajanatabank.com/","Akola Janata Commercial Co-op Bank"],["http://almoraurbanbank.com/","Almora Urban Co-op Bank"],["https://www.andhrabank.in/","Andhra Bank"],["https://www.apcob.org/","Andhra pradesh State Co-Op Bank"],["http://www.apnabank.co.in/","Apna Sahakari Bank"],["https://www.anz.com.au/personal/","Australia and New Zealand Banking Group"],["https://www.axisbank.com/","Axis Bank"],["https://www.bankofamerica.com/","Bank of America"],["https://www.bbkonline.com/Pages/default.aspx","Bank of Bahrain and Kuwait"],["https://www.bankofbaroda.com/","Bank of Baroda"],["http://www.boc.lk/","Bank of Ceylon"],["https://www.bankofindia.co.in/","Bank of India"],["https://www.bankofmaharashtra.in/","Bank of Maharashtra"],["https://www.scotiabank.com/global/en/global-site.html","Bank of Nova Scotia"],["https://www.bk.mufg.jp/global/globalnetwork/asiaoceania/","Bank of Tokyo Mitsubishi UFJ"],["https://www.barclays.in/","Barclays Bank"],["http://www.bccb.co.in/","Bassein Catholic Co-op Bank"],["https://www.bharatbank.com/","Bharat Co-op Bank (Mumbai)"],["https://group.bnpparibas/","BNP Paribas"],["http://www.canarabank.com/english/","Canara Bank"],["https://www.capitalbank.co.in/","Capital Local Area Bank"],["https://www.csb.co.in/","Catholic Syrian Bank"],["https://www.centralbankofindia.co.in/english/home.aspx","Central Bank of India"],["https://www.chinatrustindia.com/","China Trust Commercial Bank"],["https://online.citi.com/US/login.do","Citi Bank"],["https://www.citizencreditbank.com/","Citizen Credit Co-op Bank"],["https://www.cosmosbank.com/","Cosmos Co-op Bank"],["https://www.ca-cib.com/","Credit Agricole Corporate and Investment Bank"],["https://www.credit-suisse.com/se/en.html","Credit Suisse"],["https://www.denabank.com/","Dena Bank"],["https://www.dicgc.org.in/","Deposit Insurance and Credit Guarantee Corporation"],["https://www.db.com/company/index.htm","Deutsche Bank"],["https://www.dbs.com/default.page","Development Bank of Singapore (DBS)"],["https://www.dcbbank.com/","Development Credit Bank (DCB)"],["https://www.dhanbank.com/","Dhanlaxmi Bank"],["http://www.dnsb.co.in/","Dombivli Nagari Sahakari Bank"],["https://www.federalbank.co.in/","Federal Bank"],["https://www.firstrand.co.in/","Firstrand Bank"],["http://www.gdccbank.com/","Gadchiroli District Central Co-op Bank"],["https://gpparsikbank.com/","Gopinath Patil Parsik Janata Sahakari Bank"],["https://www.greaterbank.com/","Greater Bombay Co-op Bank"],["https://www.hsbc.co.in/","HSBC"],["https://www.icicibank.com/","ICICI Bank"],["https://www.idbi.com/index.asp","IDBI Bank"],["https://www.indianbank.in/","Indian Bank"],["https://www.iob.in/","Indian Overseas Bank (IOB)"],["https://www.indusind.com/","Indusind Bank"],["http://www.icbc-ltd.com/icbcltd/en/","Industrial and Commercial Bank of China"],["http://www.jjsbl.com/","Jalgaon Janata Sahkari Bank (JJSB) Ltd"],["https://www.jpcbank.com/","Jalgaon Peoples Co-op Bank"],["https://www.jkbank.com/","Jammu and Kashmir Bank"],["https://www.jksbl.com/","Janakalyan Sahakari Bank Ltd"],["http://janasevabank.in/","Janaseva Sahakari Bank (Borivali)"],["https://janasevabankpune.net/","Janaseva Sahakari Bank (Pune)"],["https://www.jpmorgan.com/","JP Morgan Chase Bank"],["https://www.ijsbank.com/index.php","Kallappanna Awade Ichalkaranji Janata Sahakari (KAIJS) Bank"],["https://www.kalupurbank.com/","Kalupur Commercial Co-op Bank"],["http://kalyanjanata.in/","Kalyan Janata Sahakari Bank"],["https://www.kccb.in/","Kangra Central Co-op Bank"],["http://www.kapolbank.com/","Kapole Co-op Bank"],["https://www.karadurbanbank.com/","Karad Urban Co-op Bank"],["https://karnatakabank.com/","Karnataka Bank"],["http://www.karnatakaapex.com/new/index.php/en/","Karnataka State Co-op Apex Bank"],["http://www.kvgbank.com/","Karnataka Vikas Grameena Bank"],["https://www.kvb.co.in/","Karur Vysya Bank (KVB)"],["https://www.kotak.com/en.html","Kotak Mahindra Bank"],["http://kurmanchalbank.com/","Kurmanchal Nagar Sahkari Bank"],["http://www.lvbank.com/","Lakshmi Vilas Bank (LVB)"],["https://www.mscbank.com/","Maharashtra State Co-op Bank"],["https://www.keralagbank.com/","Malabar Gramin Bank"],["https://www.mashreqbank.com/uae/en/personal/home","Mashreq Bank"],["https://www.mizuhobank.com/index.html","Mizuho Co-op Bank"],["http://www.municipalbankmumbai.com/","Municipal Co-op Bank (Mumbai)"],["http://www.nnsbank.co.in/","Nagpur Nagrik Sahakari Bank"],["http://www.nainitalbank.co.in/","Nainital Bank"],["https://www.nasikonline.com/","Nasik Merchants Co-op Bank"],["https://www.nab.com.au/corporate/global-relationships/global-opportunities-and-local-expertise","National Australia Bank"],["https://www.newindiabank.in/","New India Co-op Bank"],["https://www.nkgsb-bank.com/","North Kanara GSB (NKGSB) Co-op Bank"],["http://www.nutanbank.com/","Nutan Nagarik Sahakari Bank"],["https://www.primebankindia.com/","Prime Co-op Bank"],["https://www.pmcbank.com/","Punjab and Maharashtra Co-op Bank"],["https://www.psbindia.com/","Punjab and Sind Bank"],["https://www.pnbindia.in/","Punjab National Bank"],["https://www.rabobank.com/en/home/index.html","RABO Bank International"],["http://rajgurunagarbank.com/","Rajaguru nagar Sahakari Bank"],["http://www.rscb.org.in/","Rajasthan State Co-op Bank"],["https://rnsbindia.com/aspl/index.aspx","Rajkot Nagarik Sahakari Bank"],["https://www.rblbank.com/","Ratnakar Bank"],["https://www.rbi.org.in/","Reserve Bank of India"],["https://www.rbs.in/","Royal Bank of Scotland"],["https://www.saraswatbank.com/","Saraswat Co-op Bank"],["https://www.sberbank.ru/en/individualclients","Sberbank of Russia"],["https://www.svcbank.com/","Shamrao Vithal Co-op Bank"],["http://www.shahubank.com/","Shri Chhatrapathi Rajarshi Shahu Urban Co-op Bank"],["https://wholesale.banking.societegenerale.com/en/","Societe Generale"],["http://sjsbbank.com/index.php?parent=91","Solapur Janata Sahkari Bank"],["https://www.southindianbank.com/","South Indian Bank"],["https://www.sc.com/in/","Standard Chartered Bank"],["http://www.sbi.co.in/","State Bank of India (SBI)"],["https://www.sbmgroup.mu/","State Bank of Mauritius"],["https://www.smbc.co.jp/global/","Sumitomo Mitsui Banking Corporation"],["https://www.sudicobank.com/","Surat District Co-op Bank"],["http://www.spcbl.in/","Surat Peoples Co-op Bank"],["http://www.sutexbank.in/","Sutex Co-op Bank"],["https://www.syndicatebank.in/english/home.aspx","Syndicate Bank"],["http://www.tmb.in/","Tamilnad Mercantile Bank (TMB)"],["https://www.tnscbank.com/","Tamilnadu State Apex Co-op Bank"],["http://tbsbl.com/","Thane Bharat Sahakari Bank"],["http://thanedistrictbank.com/","Thane District Central Co-op Bank"],["https://www.tjsbbank.co.in/","Thane Janata Sahakari Bank (TJSB)"],["http://tgmcbank.com/","Tumkur Grain Merchants Co-op Bank"],["http://www.ucobank.com/","UCO Bank"],["https://www.unionbankofindia.co.in/","Union Bank of India"],["http://www.unitedbankofindia.com/","United Bank of India"],["https://www.uobgroup.com/in/","United Overseas Bank"],["https://www.varachhabank.com/","Varachha Co-op Bank"],["http://vasaivikasbank.com/","Vasai Vikas Sahakari Bank"],["http://vishweshwarbank.com/index.php?parent=91","Vishweshwar Sahakari Bank"],["http://www.wbscb.com/","West Bengal State Co-op Bank"],["https://go.wooribank.com/","Woori Bank"],["https://www.yesbank.in/","Yes Bank"]]
const bankUrls = banks.map(b => b[0])

const formatTestResults = resultObjects => bankUrls.map(url => {
  const resultsForUrl = resultObjects.map(obj => obj[url] && obj[url].performance && ttfb(obj[url].performance))
  if (resultsForUrl.every(r => r)) {
    return `${url}, ${resultsForUrl.join(",")}`
  }
}).join("\n")

class Proxy {
  constructor(background) {
    this.background = background
    this.nonTabUrlToProxy = {}
  }

  initialize() {
    this.storage = this.background.storage;
    browser.proxy.onRequest.addListener(
      this.handleProxyRequest.bind(this),
      { urls: ["<all_urls>"] },
      ["requestHeaders"],
    );
  }

  defaultProxy() {
    return this.storage.local.proxies["nl3-wg.socks5.mullvad.net:1080"] || { type: "direct" }
  }

  // pickProxyIndex(containerId) {
  //   let tempContainer = this.storage.local.tempContainers[containerId]
  //   if (tempContainer) {
  //     return tempContainer.number % proxies.length
  //   } else {
  //     return Math.floor(Math.random() * proxies.length)
  //   }
  // }

  forContainer(cookieStoreId) {
    if (cookieStoreId === 'firefox-default') { return }
    const proxyKey = this.storage.local.proxiedContainers[cookieStoreId]
    const proxy = this.storage.local.proxies[proxyKey]
    if (proxy) { return proxy } // TODO notify user if proxy is no longer available

    // const proxyIndex = this.pickProxyIndex(cookieStoreId)
    // const proxy = proxies[proxyIndex]
    // console.log("NEW PROXY", proxyIndex, proxy)
    // proxiedContainers[cookieStoreId] = { proxy }

    // return { type: "direct" }
  }

  forCountryCode(code) {
    let { proxies } = this.storage.local

    for (const proxyKey in proxies) {
      let proxy = proxies[proxyKey]
      if (proxy.countryCode === code) { return proxy }
    }
  }

  // undefined means there is no specific proxy for this request
  async findProxyForDomain(hostname) {
    try {
      // let hostname = request.requestHeaders.find(h => h.name === "Host").value

      let dnsLookup = await browser.dns.resolve(hostname)
      let ip = dnsLookup && dnsLookup.addresses.length && dnsLookup.addresses[0]
      if (!ip) { return }

      let response = await this.getIpInformation(ip)
      let code = this.countryCodeFromMaxMind(response)
      if (!code) { throw("could not get country code for ip") }

      // console.log(`${code}`)
      let proxy = this.forCountryCode(code.toLowerCase())

      if (proxy) {
        // console.log("using", proxy, "given", response)
        return proxy
      } else {
        console.log(`no mullvad proxy for ${code}`)
      }
    } catch (error) {
      console.error("error finding proxy for domain ", hostname, error)
    }

  }

  async handleProxyRequest(request) {

    const { tabId, frameId, url, ip } = request

    if (ip) {
      // actually got an ip from request
      debugger
    }


    // browser.contextualIdentities.get()
    if (url.indexOf("http://localhost") === 0) {
      return { type: "direct" }
    }

    console.log("HANDLE PROXY REQUEST", request)

    if (tabId === -1) {
      let proxy = this.nonTabUrlToProxy[url]
      if (proxy) {
        console.log("using nonTabUrlToProxy", proxy)
        return proxy
      } else {
        console.log("Using default proxy for non tab")
        return this.defaultProxy()
      }
    }

    try {
      const { cookieStoreId } = await browser.tabs.get(tabId)
      return this.forContainer(cookieStoreId) || this.defaultProxy()
    } catch (error) { // TODO notify user if proxy is no longer available
      console.error(error)
    }
    return this.defaultProxy()
  }



  // request using gb2, get timing
  // request using closest, get timing
  async teste(urls, forceProxy) {

    this.nonTabUrlToProxy = {}
    let results = {}
    performance.clearResourceTimings()

    for (const url of urls) {
      let hostname = (new URL(url)).hostname
      console.log(hostname)

      let proxy
      if (forceProxy) {
        proxy = forceProxy
      } else {
        proxy = await this.findProxyForDomain(hostname)
      }
      if (!proxy) { continue }

      this.nonTabUrlToProxy[url] = proxy

      // this.useNearestProxy = true
      try {
        let response = await fetch(url, { cache: "no-store", redirect: "manual" })
        if (response.redirected) { console.log("WUT WUT redirect") }
        results[url] = { response, proxy }
      } catch(error) {
        console.log(error)
      }


      // res.
    }


    setTimeout(() => {
      for (const url in results) {
        let performance = lastPerformanceEntry(url)
        results[url].performance = performance
        if (performance) { results[url].ttfb = ttfb(performance) }
      }
    }, 2000)

    return results
  }


  async populateProxies() {
    let res = await fetch("https://api.mullvad.net/public/relays/wireguard/v1").then(res => res.json())

    let proxies = {}

    for (const country of res.countries) {
      for (const city of country.cities) {
        for (const relay of city.relays) {
          let host = relay.hostname.split("-")[0] + "-wg.socks5.mullvad.net"
          this.storage.local.proxies[host + ":1080"] = {
            host,
            type: "socks",
            port: 1080,

            countryCode: country.code,
            cityCode: city.code,
            wireguardIp: relay.ipv4_addr_in,
          }
        }
      }
    }

    await this.storage.persist()
  }

  async getIpInformation(ip) {
    let data = await fetch(`http://localhost:3123/lookup/${ip}`).then(res => res.json())
    return data
  }

  countryCodeFromMaxMind(data) {
    let code = data && data.country && data.country.iso_code
    return code
  }

  async compareCountryOfProxies() {
    let { proxies } = this.storage.local
    for (const proxyKey in proxies) {
      let proxy = proxies[proxyKey]
      // console.log(proxy)

      let response = await this.getIpInformation(proxy.wireguardIp)
      let code = this.countryCodeFromMaxMind(response)

      console.log(proxy.countryCode, code)
      if (proxy.countryCode !== code) {
        console.log(response, proxy)
      }

    }
  }


  async nubanks() {
    let nu = []
    // get redirected urls
    for (const bank of banks) {
      try {
        let originalUrl = bank[0]

        let controller = new AbortController
        let signal = controller.signal

        let res = await timeoutableFetch(originalUrl)

        if (originalUrl !== res.url) {
          console.log(`${originalUrl} => ${res.url}`)
        }
        if (res.status === 200) {
          nu.push([res.url, bank[1]])
        } else {
          console.log(res)
        }
      } catch(e) {
        console.log(e)
      }
    }
    return nu
  }




}


window.Proxy = Proxy
