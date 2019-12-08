// Much of the code is adapter from:
//https://github.com/Ashung/Automate-Sketch/blob/master/automate-sketch.sketchplugin/Contents/Sketch/Data/Supply_Data.js

const sketch = require('sketch')
const { DataSupplier } = sketch
const util = require('util')

export function onStartup () {
  // To register the plugin, uncomment the relevant type:
  //DataSupplier.registerDataSupplier('public.text', 'data-from-clipboard', 'SupplyData')
  // DataSupplier.registerDataSupplier('public.image', 'data-from-clipboard', 'SupplyData')
  DataSupplier.registerDataSupplier("public.text", "Text From Clipboard", "SupplyTextFromClipboard");  
}

export function onShutdown () {
  // Deregister the plugin
  DataSupplier.deregisterDataSuppliers()
}




export function onSupplyTextFromClipboard (context) {
   // var texts = System.textsFromChooseFile();
    var pasteboard = NSPasteboard.generalPasteboard();
     var supportedPasteboardTypes = [
            "public.rtf",
            "public.multipleTextSelection",
            "public.pdf"
        ];
    if (pasteboard.pasteboardItems().count() > 0) {
      var pasteboardType = pasteboard.pasteboardItems().firstObject().types().firstObject();
      //console.log(pasteboardType )
        if (supportedPasteboardTypes.indexOf(String(pasteboardType))) {
          let clipboardString = pasteboard.pasteboardItems().firstObject().stringForType(NSPasteboardTypeString);

          let clipboardArray = clipboardString.split(/\n/g);
          console.log(clipboardString, clipboardArray)
          supplyOrderedData(context, clipboardArray);

        }
    }


};

function supplyOrderedData(context, data) {
    for (var i = 0; i < context.data.requestedCount; i++) {
        var dataIndex;
        if (context.data.isSymbolInstanceOverride == 1) {
            var selection = NSDocumentController.sharedDocumentController().currentDocument().selectedLayers().layers();
            dataIndex = selection.indexOfObject(context.data.items.objectAtIndex(i).symbolInstance())
        } else {
            dataIndex = i;
        }
        DataSupplier.supplyDataAtIndex(context.data.key, data[dataIndex % data.length], i);
    }
}