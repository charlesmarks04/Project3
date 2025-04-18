function onOpen() {
  // gets google docs ui
  const ui = DocumentApp.getUi();

  // creates top-level menu button for InStruct with sub-button to open sidebar
  ui.createMenu('InStruct')
    .addItem('Open Sidebar', 'showSidebar')
    .addToUi();
}

function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('mainSidebar')
    .setTitle('InStruct')
    .setWidth(300);

  DocumentApp.getUi().showSidebar(html);
}


function showDialog() {
  const html = HtmlService.createHtmlOutputFromFile('dialog')
    .setWidth(400)
    .setHeight(300);
  DocumentApp.getUi().showModalDialog(html, 'Preview Dialog');
}

function getHtmlFromFile(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// STACK HANDLERS

function getStack() {
  const props = PropertiesService.getDocumentProperties();
  const stack = props.getProperty('stack');
  return stack ? JSON.parse(stack) : [];
}

function setStack(stack) {
  const props = PropertiesService.getDocumentProperties();
  props.setProperty('stack', JSON.stringify(stack));
}

function handlePushStack(val) {
  Logger.log('Pushing to stack: ' + val);
  const stack = getStack();
  stack.push(val);
  setStack(stack);
  return `Pushed ${val}. Stack: [${stack.join(', ')}]`;
}

function handlePopStack() {
  const stack = getStack();
  const popped = stack.pop();
  setStack(stack);
  return popped !== undefined
    ? `Popped ${popped}. Stack: [${stack.join(', ')}]`
    : 'Stack is empty.';
}

function deleteStack() {
  const props = PropertiesService.getDocumentProperties();
  props.deleteProperty('stack');
  return 'Deleted Stack.';
}

function showStackDialog() {
  const html = HtmlService.createHtmlOutputFromFile('stackDialog')
    .setWidth(400)
    .setHeight(300);
  DocumentApp.getUi().showModalDialog(html, 'Preview Dialog');
}

// DIALOG HANDLERS

function insertImageFromDataURL(dataUrl) {
  const blob = Utilities.base64Decode(dataUrl.split(',')[1]);
  const image = Utilities.newBlob(blob, 'image/png', 'stack.png');
  DocumentApp.getActiveDocument().getBody().appendImage(image);
}