// Much of the code is adapted from:
//https://github.com/Ashung/Automate-Sketch/blob/master/automate-sketch.sketchplugin/Contents/Sketch/Data/Supply_Data.js

const sketch = require('sketch')
const { DataSupplier } = sketch
const UI = require('sketch/ui')

export function onStartup () {
  DataSupplier.registerDataSupplier("public.text", "Text from clipboard", "SupplyTextFromClipboard");  
  DataSupplier.registerDataSupplier("public.text", "Random text from clipboard", "SupplyRandomTextFromClipboard");  

}

export function onShutdown () {
  // Deregister the plugin
  DataSupplier.deregisterDataSuppliers()
}

function shuffleArray(array) {
  for(let i = array.length-1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array

}


export function onSupplyTextFromClipboard (context) {
    supplyOrderedData(context, getPasteBoardData(context));

};

export function onSupplyRandomTextFromClipboard (context) {
        supplyRandomData(context, getPasteBoardData(context));

};

function getPasteBoardData(context) {
  let pasteboard = NSPasteboard.generalPasteboard();
    let supportedPasteboardTypes = [
            "public.rtf",
            "public.string",
            "public.plain-text",
            "public.utf8-plain-text",
            "public.multipleTextSelection",
            "public.html",
            "com.apple.traditional-mac-plain-text",
            "org.mozilla.custom-clipdata",
            "org.chromium.web-custom-data",
            "NSStringPboardType",
            "public.utf16-external-plain-text",
            "public.utf16-plain-text",
            "com.apple.iWork.TSPNativeData",
            "public.text",
            "com.apple.webarchive",
            "com.adobe.pdf",
            "com.microsoft.word.doc",
            "com.microsoft.excel.xls",
            "com.microsoft.powerpoint.ppt"
        ];
    // test wether pasteboard not empty
    if (pasteboard.pasteboardItems().count() > 0) {
      let pasteboardType = pasteboard.pasteboardItems().firstObject().types().firstObject();
        console.log(pasteboardType, supportedPasteboardTypes.indexOf(String(pasteboardType)))

    // test wether content is text
        if (supportedPasteboardTypes.indexOf(String(pasteboardType)) > -1 ) {

          let clipboardString = pasteboard.pasteboardItems().firstObject().stringForType(NSPasteboardTypeString);
          console.log(/\n\n/.test(clipboardString));
          let clipboardArray = clipboardString.replace(/\n+/, "\n").split(/\n/g);
          return clipboardArray
        }
        else {
          UI.message("Content in clipboard is not text")
           console.log(pasteboard.pasteboardItems().firstObject().stringForType(NSPasteboardTypeString))
          return false
      }
    }
    else {
      UI.message("Clipboard is empty")
      return false
    }
}


function supplyOrderedData(context, data) {
   
   if (!data) {
    return
  }

  for (let i = 0; i < context.data.requestedCount; i++) {
      let dataIndex;
      if (context.data.isSymbolInstanceOverride == 1) {
          let selection = NSDocumentController.sharedDocumentController().currentDocument().selectedLayers().layers();
          dataIndex = selection.indexOfObject(context.data.items.objectAtIndex(i).symbolInstance())
      } else {
          dataIndex = i;
      }
      DataSupplier.supplyDataAtIndex(context.data.key, data[dataIndex % data.length], i);
  }
}

function supplyRandomData(context, data) {
  if (!data) {
    return
  }
  let shuffledArray = shuffleArray(data);
  for (let i = 0; i < context.data.requestedCount; i++) {
      let dataIndex;

      if (context.data.isSymbolInstanceOverride == 1) {
          let selection = NSDocumentController.sharedDocumentController().currentDocument().selectedLayers().layers();
          dataIndex = selection.indexOfObject(context.data.items.objectAtIndex(i).symbolInstance())
      } else {
          dataIndex = i;
      }
      DataSupplier.supplyDataAtIndex(context.data.key, shuffledArray[dataIndex % shuffledArray.length], i);    
  }
}