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

//BST HANDLERS

function getTree() {
  const props = PropertiesService.getDocumentProperties();
  const tree = props.getProperty('tree');
  return tree ? JSON.parse(tree) : { root: null };
}

function setTree(tree) {
  const props = PropertiesService.getDocumentProperties();
  props.setProperty('tree', JSON.stringify(tree));
}

function insertNode(value) {
  let tree = getTree();
  tree.root = insertToBST(tree.root, value);
  setTree(tree);
  return `Inserted ${value}.`;
}

function insertToBST(node, value) {
  if (node === null) {
    return { value: value, left: null, right: null };
  }
  if (value < node.value) {
    node.left = insertToBST(node.left, value);
  } else {
    node.right = insertToBST(node.right, value);
  }
  return node;
}

function deleteNode(value) {
  let tree = getTree();
  if (!tree || !tree.root) {
    return 'Tree is empty.';
  }
  tree.root = deleteFromBST(tree.root, value);
  setTree(tree);
  return `Deleted ${value}.`;
}

function deleteFromBST(node, value) {
  if (node === null) return null;
  if (value < node.value) {
    node.left = deleteFromBST(node.left, value);
  } else if (value > node.value) {
    node.right = deleteFromBST(node.right, value);
  } else {
    if (node.left === null) return node.right;
    if (node.right === null) return node.left;
    node.value = minValue(node.right);
    node.right = deleteFromBST(node.right, node.value);
  }
  return node;
}

function deleteTree() {
  const props = PropertiesService.getDocumentProperties();
  props.deleteProperty('tree');
  return 'Deleted Tree.';
}

function showTreeDialog() {
  const html = HtmlService.createHtmlOutputFromFile('bstDialog')
    .setWidth(900)
    .setHeight(700);
  DocumentApp.getUi().showModalDialog(html, 'Preview Dialog');
}


// DIALOG HANDLERS

function insertImageFromDataURL(dataUrl) {
  const blob = Utilities.base64Decode(dataUrl.split(',')[1]);
  const image = Utilities.newBlob(blob, 'image/png', 'stack.png');
  DocumentApp.getActiveDocument().getBody().appendImage(image);
}



//Linked List handlers
function getLinkedList() 
{
  const props = PropertiesService.getDocumentProperties();
  const list = props.getProperty('linkedList');
  return list ? JSON.parse(list) : [];
}

function setLinkedList(list) 
{
  const props = PropertiesService.getDocumentProperties();
  props.setProperty('linkedList', JSON.stringify(list));
}

function handleAddLinkedList(data) 
{
  const [val, , indexStr] = data.split('|');  
  const index = parseInt(indexStr, 10);
  const list = getLinkedList();

  if (isNaN(index) || index < 0 || index > list.length) 
  {
    return 'Invalid index.';
  }

  const newNode = { value: val, next: null };

  // Insert into correct spot, maintaining "next" pointers
  if (list.length === 0 || index === 0) 
  {
    // Insert at head
    if (list[0]) newNode.next = 0;
    list.unshift(newNode);
  } 
  else 
  {
    newNode.next = list[index] ? index : null;
    list.splice(index, 0, newNode);
    // Update previous node's next
    if (index > 0 && list[index - 1]) 
    {
      list[index - 1].next = index;
    }
  }

  setLinkedList(list);
  return `Inserted ${val} at index ${index}.`;
}

function handleRemoveLinkedList(data) 
{
  const [indexStr] = data.split('|');
  const index = parseInt(indexStr, 10);
  const list = getLinkedList();

  if (isNaN(index) || index < 0 || index >= list.length) 
  {
    return 'Invalid index.';
  }

  const removed = list.splice(index, 1)[0];
  if (index > 0 && list[index - 1]) 
  {
    list[index - 1].next = index < list.length ? index : null;
  }

  setLinkedList(list);
  return `Removed ${removed.value} at index ${index}.`;
}

function handleDeleteLinkedList() 
{
  const props = PropertiesService.getDocumentProperties();
  props.deleteProperty('linkedList');
  return 'Linked List deleted.';
}

function showLLDialog() 
{
  const html = HtmlService.createHtmlOutputFromFile('LLdialog')
    .setWidth(900)
    .setHeight(700);
  DocumentApp.getUi().showModalDialog(html, 'Preview Dialog');
}