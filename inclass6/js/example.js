let list = document.getElementsByTagName('ul')[0];

// ADD NEW ITEM TO END OF LIST
// Create new element and append to end
let endNode = document.createElement('li');
let endNodeText = document.createTextNode('cream');
endNode.appendChild(endNodeText);
list.appendChild(endNode);

// ADD NEW ITEM START OF LIST
// Create new element and insert before first existing element
let startNode = document.createElement('li');
let startNodeText = document.createTextNode('kale');
startNode.appendChild(startNodeText);
list.childNodes[0].before(startNode);

// ADD A CLASS OF COOL TO ALL LIST ITEMS
// loop through each child node in list element and add the class
for (let child of list.children) {
    child.classList.add('cool');
}

// ADD NUMBER OF ITEMS IN THE LIST TO THE HEADING
// Create new node and append to h2 element
let h2El = document.getElementsByTagName('h2')[0];
let childCount = list.children.length;
let header = document.createElement('h2');
let badge = document.createElement('span');
badge.classList.add('badge');
badge.appendChild(document.createTextNode(childCount));
h2El.appendChild(badge);
