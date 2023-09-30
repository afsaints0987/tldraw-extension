console.log("This is TLDraw Extension updated version");

ext.runtime.onEnable.addListener(() => {
  console.log('Extension Enabled')
})

let created = false;
let windowFrame: ext.windows.Window | null = null;
let tab: ext.tabs.Tab | null = null;
let webview = null;
let websession = null;

ext.runtime.onExtensionClick.addListener(async () => {
  console.log('Extension Clicked')

  try {
    // Create tab
    if (tab) return;
    tab = await ext.tabs.create({
      text: "TLDraw",
      icon: "assets/icon-1024.png",
      icon_dark: "assets/icon-128-dark.png",
      closable: true,
    });

    // Create a window
    windowFrame = await ext.windows.create({
      title: "TLDraw",
      icon: "assets/icon-1024.png",
      fullscreenable: true,
      frame: true
    });

    // Create a Websession
    // websession = await ext.websessions.create({
    //   partition: "TLDraw Extension",
    //   persistent: true,
    //   global: false,
    //   cache: true,
    // });

    const windowSize = await ext.windows.getContentSize(windowFrame.id);
    webview = await ext.webviews.create({
      window: windowFrame,
      // websession,
      bounds: {
        x: 0,
        y: 0,
        width: windowSize.width,
        height: windowSize.height,
      },
      autoResize: { width: true, height: true },
    });
    await ext.webviews.loadFile(webview.id, "index.html");
    await ext.webviews.attach(webview.id, windowFrame.id)

    created = true;
  } catch(err){
    console.error('ext.runtime.onExtensionClick', JSON.stringify(err))
  }
  console.log(tab?.id)
});

// When Tab is clicked
ext.tabs.onClicked.addListener(async (event) => {
  console.log(tab)
  try {
    if(event.id === tab?.id && windowFrame !== null){
      await ext.windows.restore(windowFrame.id)
      await ext.windows.focus(windowFrame.id)
    }
  } catch (error){
    console.log('ext.tabs.onClicked', error)
  }
});

// When Tab is close
ext.tabs.onClickedClose.addListener(async (event) => {
  console.log(event.id)
  try {
    if(event.id === tab?.id){
      await ext.tabs.remove(tab.id)
    }
    if(event.id === windowFrame?.id){
      await ext.tabs.remove(windowFrame.id)
    }
  } catch(error){
    console.log('ext.tabs.onClickedClose', error)
  }
});

// When Window is close
ext.windows.onClosed.addListener(async (event) => {
  console.log(event.id)
  try {
    if(!windowFrame) return
  
    if(event.id === windowFrame.id){
      await ext.windows.remove(windowFrame.id)
      windowFrame = null
    }
  } catch(error) {
    console.log('ext.windows.onClosed', error)
  }
});

