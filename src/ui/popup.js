const initialize = async () => {
  $('.ui.dropdown').dropdown();
  $('.ui.checkbox').checkbox();
  $('.ui.accordion').accordion({
    animateChildren: false,
    duration: 0
  });

  try {
    const storage = await browser.storage.local.get();
    if (!storage.preferences || !Object.keys(storage.preferences).length) {
      showPreferencesError();
      return;
    }



    $('#statisticsContainers').html(storage.statistics.containersDeleted);
    $('#statisticsCookies').html(storage.statistics.cookiesDeleted);
    $('#statisticsCache').html(formatBytes(storage.statistics.cacheDeleted, 0));

    preferences = storage.preferences;
    updateIsolationDomains();

    $('#isolationDomainForm').form({
      fields: {
        isolationDomainPattern: 'empty'
      },
      onSuccess: (event) => {
        event.preventDefault();
        isolationDomainAddRule();
      }
    });

    $('#tmpButton').on('click', () => {
      browser.runtime.sendMessage({
        method: 'createTabInTempContainer'
      });
      window.close();
    });

    $('#preferences').on('click', () => {
      browser.tabs.create({
        url: browser.runtime.getURL('ui/options.html')
      });
      window.close();
    });

    const historyPermission = await browser.permissions.contains({permissions: ['history']});
    if (historyPermission) {
      $('#deletesHistoryButton').on('click', () => {
        browser.runtime.sendMessage({
          method: 'createTabInTempContainer',
          payload: {
            deletesHistory: true
          }
        });
        window.close();
      });
      $('#deletesHistoryButton').addClass('item');
      $('#deletesHistoryButton').removeClass('hidden');
    }

    $('.ui.sidebar').sidebar({
      transition: 'overlay'
    });
    $('#menu').on('click', () => {
      $('.ui.sidebar').sidebar('toggle');
    });
    $('#menuHome').on('click', () => {
      $('.ui.sidebar').sidebar('hide');
      $.tab('change tab', 'home');
    });
    $('#menuStatistics').on('click', () => {
      $('.ui.sidebar').sidebar('hide');
      $.tab('change tab', 'statistics');
    });
    $('#menuIsolation').on('click', () => {
      $('.ui.sidebar').sidebar('hide');
      $.tab('change tab', 'isolation');
    });
    $('#menuActions').on('click', () => {
      $('.ui.sidebar').sidebar('hide');
      $.tab('change tab', 'actions');
    });

    $.tab('change tab', 'home');

    const tabs = await browser.tabs.query({currentWindow: true, active: true});
    const activeTab = tabs[0];
    if (!activeTab.url.startsWith('http')) {
      $('#actionNone').removeClass('hidden');
      return;
    }
    const tabParsedUrl = new URL(activeTab.url);
    isolationDomainEditRule(tabParsedUrl.hostname);

    let cookieStoreId = activeTab.cookieStoreId


    let proxies = Object.keys(storage.proxies).sort()
    let selectEl = $("#proxyList")
    selectEl.prepend(`<option value="">Direct</option>`)
    proxies.forEach(proxy => selectEl.append(`<option value="${proxy}">${proxy}</option>`))

    let currentProxyKey = storage.proxiedContainers[cookieStoreId]
    if (currentProxyKey) { selectEl.val(currentProxyKey) }

    selectEl.change(() => {
      const proxyKey = selectEl.val()
      browser.runtime.sendMessage({
        method: 'changeProxy',
        payload: { cookieStoreId, proxyKey }
      });
      window.close();
    })


    $('#actionOpenInTmp').on('click', () => {
      browser.runtime.sendMessage({
        method: 'createTabInTempContainer',
        payload: {
          url: activeTab.url
        }
      });
      window.close();
    });
    $('#actionOpenInTmpDiv').removeClass('hidden');

    if (historyPermission) {
      $('#actionOpenInDeletesHistoryTmp').on('click', () => {
        browser.runtime.sendMessage({
          method: 'createTabInTempContainer',
          payload: {
            url: activeTab.url,
            deletesHistory: true
          }
        });
        window.close();
      });
      $('#actionOpenInDeletesHistoryTmpDiv').removeClass('hidden');
    }

    if (storage.tempContainers[cookieStoreId] &&
        storage.tempContainers[cookieStoreId].deletesHistory) {
      $('#actionConvertToRegular').on('click', () => {
        browser.runtime.sendMessage({
          method: 'convertTempContainerToRegular',
          payload: {
            cookieStoreId: cookieStoreId,
            tabId: activeTab.id,
            url: activeTab.url
          }
        });
        window.close();
      });
      $('#actionConvertToRegularDiv').removeClass('hidden');
    }

    if (storage.tempContainers[cookieStoreId]) {
      $('#actionConvertToPermanent').on('click', async () => {
        await browser.runtime.sendMessage({
          method: 'convertTempContainerToPermanent',
          payload: {
            cookieStoreId: cookieStoreId,
            tabId: activeTab.id,
            name: tabParsedUrl.hostname,
            url: activeTab.url
          }
        });
        window.close();
      });
      $('#actionConvertToPermanentDiv').removeClass('hidden');
    }

    if (cookieStoreId !== 'firefox-default' &&
        !storage.tempContainers[cookieStoreId]) {
      $('#actionConvertToTemporary').on('click', () => {
        browser.runtime.sendMessage({
          method: 'convertPermanentToTempContainer',
          payload: {
            cookieStoreId: cookieStoreId,
            tabId: activeTab.id,
            url: activeTab.url
          }
        });
        window.close();
      });
      $('#actionConvertToTemporaryDiv').removeClass('hidden');
    }


    let container = storage.proxiedContainers[cookieStoreId]
    if (container && container.proxy && container.proxy.email) {
      $('#generateEmailForm').addClass('hidden');
      $('#generatedEmail').value(container.proxy.email)
    } else {
      $('#generatedEmail').addClass('hidden');
      $('#generateEmail').on('click', () => {
        browser.runtime.sendMessage({
          method: 'generateEmail',
          payload: {
            email: $('generateEmailForwardTo').value(),
            cookieStoreId: cookieStoreId
          }
        });
        window.close();
      });
    }
  } catch (error) {
    showPreferencesError(error);
  }
};

document.addEventListener('DOMContentLoaded', initialize);
