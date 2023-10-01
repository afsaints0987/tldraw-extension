console.log("This is TLDraw Extension updated version");

let created: boolean = false
let windowFrame: ext.windows.Window | null = null;
let tab: ext.tabs.Tab | null = null;
let webview: ext.webviews.Webview | null = null;
let websession: ext.websessions.Websession | undefined = undefined;
let webviewProperties: ext.webviews.WebviewProperties | null = null

async function checkPermissionForSession(){
  const permissions = await ext.runtime.getPermissions();
  const platFormInfo = await ext.runtime.getPlatformInfo();
  console.log("Permission Granted", permissions)
  console.log("Platform info:", platFormInfo)

  return permissions
}

async function createWindowAndTab(){

  try {
    
      // Create tab
      tab = await ext.tabs.create({
        icon: "assets/icon-1024.png",
        icon_dark: "assets/icon-128-dark.png",
        closable: true,
      });

      // When Tab is created
      if (tab) {
        ext.tabs.update(tab.id, {
          text: `TLDraw - #${parseInt(tab?.id) + 1}`,
        });
      }

      // Create a window
      windowFrame = await ext.windows.create({
        icon: "assets/icon-1024.png",
        fullscreenable: true,
        frame: true,
      });

      if(windowFrame){
        ext.windows.update(windowFrame.id, {
          title: `TLDraw - #${parseInt(windowFrame.id) + 1}`
        })
      }

      // Create a websession
      websession = await ext.websessions.create({
        partition: `TLDrawExtensionSession - #${windowFrame.id}`,
        global: false,
        persistent: true,
        cache: true,
      });

      const windowSize = await ext.windows.getContentSize(windowFrame.id);
      webview = await ext.webviews.create({
        window: windowFrame,
        websession: websession,
        bounds: {
          x: 0,
          y: 0,
          width: windowSize.width,
          height: windowSize.height,
        },
        autoResize: { width: true, height: true },
      });


      await ext.webviews.loadFile(webview.id, "index.html");
      await ext.webviews.attach(webview.id, windowFrame.id);

      created = true;
    
  } catch (error){
    console.log(error)
  }
}

ext.runtime.onEnable.addListener( async () => {
  checkPermissionForSession()
  console.log("Extension Enabled");
});


ext.runtime.onExtensionClick.addListener(async () => {
  console.log('Extension Clicked')
  
  console.log(webview)
  await createWindowAndTab()

});

// When tab is clicked

ext.tabs.onClicked.addListener(async(event) => {
  
  let windowInfo = await ext.windows.get(event.id)
  try {

    if(windowInfo && windowInfo.id){
      await ext.windows.restore(windowInfo.id)
      await ext.windows.focus(windowInfo.id)
    }
  } catch (err) {
    console.log("ext.tabs.onClicked", err)
  }
})

// When tab is closed

ext.tabs.onClickedClose.addListener(async (event) => {

  let tabInfo = await ext.tabs.get(event.id)
  let windowInfo = await ext.tabs.get(event.id)
  
  try {
    // Remove the tab and its associated window and webview
    if (tabInfo && tabInfo.id) {
      if (tabInfo?.id) await ext.tabs.remove(tabInfo.id);
      if (windowInfo?.id) await ext.windows.remove(windowInfo.id);
      if (webview?.id) await ext.webviews.remove(webview.id);
      
    }
  } catch (err) {
    console.log("ext.tabs.onClickedClose", JSON.stringify(err));
  }
})

// When window is closed

ext.windows.onClosed.addListener(async (event) => {

  let tabInfo = await ext.tabs.get(event.id)
  
  try {
    // Remove the tab and its associated webview when the window is closed
    if (tabInfo && tabInfo.id) {
      if(tabInfo?.id) await ext.tabs.remove(tabInfo.id);
      if(webview?.id) await ext.webviews.remove(webview.id);
      
    }
  } catch (err) {
    console.log("ext.windows.onClosed", JSON.stringify(err));
  }
})

