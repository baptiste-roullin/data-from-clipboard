// Much of the code is adapted from:
//https://github.com/Ashung/Automate-Sketch/blob/master/automate-sketch.sketchplugin/Contents/Sketch/Data/Supply_Data.js

const sketch = require('sketch')
const { DataSupplier } = sketch
const UI = require('sketch/ui')

export function onStartup () {
  DataSupplier.registerDataSupplier("public.text", "Text from clipboard", "SupplyTextFromClipboard");  
}

export function onShutdown () {
  // Deregister the plugin
  DataSupplier.deregisterDataSuppliers()
}


export function onSupplyTextFromClipboard (context) {
    let pasteboard = NSPasteboard.generalPasteboard();
     let supportedPasteboardTypes = [
            "public.rtf",
            "public.multipleTextSelection",
            "public.string",
            "public.utf8-plain-text",
            "public.html",
            "com.apple.traditional-mac-plain-text"
        ];
    if (pasteboard.pasteboardItems().count() > 0) {
      let pasteboardType = pasteboard.pasteboardItems().firstObject().types().firstObject();

        if (supportedPasteboardTypes.indexOf(String(pasteboardType)) > -1 ) {

          let clipboardString = pasteboard.pasteboardItems().firstObject().stringForType(NSPasteboardTypeString);

          let clipboardArray = clipboardString.split(/\n/g);
          console.log(String(pasteboardType), supportedPasteboardTypes.indexOf(String(pasteboardType)))
          supplyOrderedData(context, clipboardArray);

        }
        else {
          UI.message("Content in clipboard is not text")

    }
    }
    else {
      UI.message("Clipboard is empty")
    }
};

function supplyOrderedData(context, data) {
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