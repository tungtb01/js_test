//Add keydown listenner
document.body.onkeydown = (e) => {
	selectItemByKeyboard(e);
};

var SELECTED_ITEM;
//Init history from localStorage
function initHistory() {
	let history = null;
	try {
		history = localStorage.getItem('selectedHistory');
	} catch (e) { }
	SELECTED_ITEM = history ? JSON.parse(history) : [];
	printSelectedItem();
}

initHistory();

//Init list data from TABLE_DATA
function initData() {
	let ul = document.createElement("ul"), li, img, tx, currentItem;
	ul.className = 'listApp';
	for (let i = 0; i < TABLE_DATA.length; i++) {
		currentItem = TABLE_DATA[i];
		li = document.createElement("li");
		li.className = 'itemDetail' + currentItem.id;
		li.style.display = 'block';
		li.setAttribute('item-name', currentItem.name);
		img = document.createElement("img");
		img.src = currentItem.thumbnailUrl;
		tx = document.createElement("span");
		tx.textContent = currentItem.name;
		li.appendChild(img);
		li.appendChild(tx);
		//Add click event listener
		li.addEventListener("click", (event) => {
			itemClick(event.srcElement);
			addSelectedItem(event.srcElement);
		});
		ul.appendChild(li);
	}
	let contentObj = document.getElementsByClassName('contents')[0];
	contentObj.appendChild(ul);
}

function addListener(element, eventName, handler) {
	if (element.addEventListener) {
		element.addEventListener(eventName, handler, false);
	}
	else if (element.attachEvent) {
		element.attachEvent('on' + eventName, handler);
	}
	else {
		element['on' + eventName] = handler;
	}
}

//Reset all class of Li tags
function resetListClass() {
	let tmpItem;
	for (let i = 0; i < TABLE_DATA.length; i++) {
		currentItem = TABLE_DATA[i];
		tmpItem = document.getElementsByClassName('itemDetail' + currentItem.id)[0];
		tmpItem.className = 'itemDetail' + currentItem.id;
	}
}

function showContent() {
	document.getElementById("inputServiceName").focus();
}

function onInputFocus() {
	displaySuggest();
}

//Process when user click
function itemClick(eventElement) {
	resetListClass();
	let itemClass = '';
	if (eventElement.className !== '') {
		itemClass = eventElement.className;
	} else {
		itemClass = eventElement.parentElement.className;
	}
	let itemObj = document.getElementsByClassName(itemClass)[0];
	let inputObj = document.getElementById('inputServiceName');
	inputObj.value = itemObj.innerText;
	itemObj.className += ' selected';
}

//Add selected item to variable and localStorage
function addSelectedItem(eventElement) {
	let itemClass = '';
	if (eventElement.className !== '') {
		itemClass = eventElement.className;
	} else {
		itemClass = eventElement.parentElement.className;
	}
	let itemObj = document.getElementsByClassName(itemClass)[0];
	let inputObj = document.getElementById('inputServiceName');
	inputObj.value = '';
	let isExist = SELECTED_ITEM.indexOf(itemObj.innerText) < 0 ? true : false;
	if (isExist) {
		SELECTED_ITEM.push(itemObj.innerText);
		//Add to localStorage
		localStorage.setItem('selectedHistory', JSON.stringify(SELECTED_ITEM));
		printSelectedItem();
	}
}

//Print list selected item
function printSelectedItem() {
	let showDelete = document.getElementById('textIcon');
	if (SELECTED_ITEM && SELECTED_ITEM.length > 0) {
		showDelete.style.display = 'block';
	} else {
		showDelete.style.display = 'none';
	}
	let selectedItemObj = document.getElementById('selectedItem');
	let selectedInfo = SELECTED_ITEM.join();
	selectedItemObj.innerText = '';
	selectedItemObj.innerText = selectedInfo;
	selectedItemObj.setAttribute('title', selectedInfo);
}

//Process delete list selected item
function deleteSelected() {
	SELECTED_ITEM = [];
	localStorage.setItem('selectedHistory', JSON.stringify(SELECTED_ITEM));
	let selectedItemObj = document.getElementById('selectedItem');
	selectedItemObj.innerText = '';
	let showDelete = document.getElementById('textIcon');
	showDelete.style.display = 'none';
}

//Process list item when input onkeydown
function updateList(e) {
	let inputValue = document.getElementById('inputServiceName').value;
	inputValue = inputValue.trim();
	inputValue = inputValue.toLowerCase();
	let currentItem, itemName, tmpItem;
	if (e.keyCode != 38 && e.keyCode != 40) {
		for (let i = 0; i < TABLE_DATA.length; i++) {
			currentItem = TABLE_DATA[i];
			itemName = currentItem.name;
			itemName = itemName.toLowerCase();
			tmpItem = document.getElementsByClassName('itemDetail' + currentItem.id)[0];
			if (tmpItem) {
				if (itemName.indexOf(inputValue) == -1) {
					tmpItem.style.display = 'none';
				} else {
					tmpItem.style.display = 'block';
				}
			}
		}
	}
}

//Process keydown event
function selectItemByKeyboard(e) {
	var isHidden = document.getElementsByClassName("contents")[0].style.display == "none";
	if (isHidden) {
		return;
	}
	let selectedObj, nextObj, preObj;
	if (e.keyCode == 13) { // enter
		e.preventDefault();
		selectedObj = document.getElementsByClassName('selected')[0];
		if (selectedObj) {
			addSelectedItem(selectedObj);
		}
	}
	if (e.keyCode == 38) { // up
		selectedObj = document.getElementsByClassName('selected')[0];
		if (selectedObj) {
			preObj = getPreElement(selectedObj);
			if (preObj) {
				itemClick(preObj);
			}
		}
	}
	if (e.keyCode == 40) { // down
		selectedObj = document.getElementsByClassName('selected')[0];
		if (selectedObj) {
			nextObj = getNextElement(selectedObj);
		} else {
			nextObj = document.getElementsByClassName('listApp')[0].firstElementChild;
		}
		if (nextObj) {
			itemClick(nextObj);
		}


	}
	if (e.keyCode == 46) { // delete

	}
}

function getNextElement(elementObj) {
	while (elementObj != null) {
		if (elementObj.nextSibling && elementObj.nextSibling.style &&
			elementObj.nextSibling.style.display === 'block') {
			return elementObj.nextSibling;
		}
		elementObj = elementObj.nextSibling;
	}
	return elementObj;

}

function getPreElement(elementObj) {
	while (elementObj != null) {
		if (elementObj.previousSibling && elementObj.previousSibling.style &&
			elementObj.previousSibling.style.display === 'block') {
			return elementObj.previousSibling;
		}
		elementObj = elementObj.previousSibling;
	}
	return elementObj;
}

function displaySuggest() {
	console.log("Suggest was displayed !");
	let contentObj = document.getElementsByClassName('contents')[0];
	contentObj.style.display = 'block';
}

function hideSuggest() {
	console.log("Suggest was hided !");
	let contentObj = document.getElementsByClassName('contents')[0];
	contentObj.style.display = 'none';
}

function bodyClick(event) {
	let contentObj = document.getElementsByClassName('contents')[0];
	if (isNotDescendant(contentObj, event.srcElement) && event.srcElement.className !== 'showContent') {
		hideSuggest();
	}
}

//Check parent of a child
function isNotDescendant(parent, child) {
	if (!child) {
		return false;
	}
	let node = child.parentNode;
	while (node != null) {
		if (node == parent) {
			return false;
		}
		node = node.parentNode;
	}
	return true;
}
