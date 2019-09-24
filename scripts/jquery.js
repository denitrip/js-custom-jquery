window.$ = (function(){
  function Elements(collection) {
    this.collection = collection
  };

  Elements.prototype.changeClass = function(previousClass, newClass) {
    Array.prototype.forEach.call(this.collection, (e => {
          e.classList.remove(previousClass);
          e.classList.add(newClass);
        }
      ))
    return this
  }
  
  Elements.prototype.removeClass = function(className) {
    Array.prototype.forEach.call(this.collection, (e => {
          e.classList.remove(className);
        }
      ))
    return this
  }
  
  Elements.prototype.addClass = function(className) {
    Array.prototype.forEach.call(this.collection, (e => {
          e.classList.add(className);
        }
      ))
    return this
  }
  
  Elements.prototype.appendNode = function(content) {
	Array.prototype.forEach.call(this.collection, (e => e.append(content)))
    return this
  }
  
  Elements.prototype.removeChildNode = function(content) {
	Array.prototype.forEach.call(this.collection, (e => e.removeChild(content)))
    return this
  }

  function dollar(selector) {
    return new Elements(document.querySelectorAll(selector))
  }

  dollar.on = function(element, event, callback) {
       Array.prototype.forEach.call(element.collection, (e => e.addEventListener(event, callback)
     ))
  }
  
  dollar.changeClass = function(el, previousClass, newClass) {
	el.classList.remove(previousClass);
	el.classList.add(newClass);
  }
  
  dollar.list = function(mountElement, isVerticalMenu) {

	const classNames = {
		fullRow: isVerticalMenu ? 'full-width-row--vertical' : 'full-width-row--horizontal',
		listContainer: isVerticalMenu ? "container__list container__list--vertical" : "container__list container__list--horizontal",
		listItem: isVerticalMenu ? "container__list-item container__list-item--vertical" : "container__list-item container__list-item--horizontal",
		menuButtonOrientation: isVerticalMenu ? "container__button--vertical" : "container__button--horizontal",
		menuButton: "container__button",
		menuButtonClicked: "container__button--clicked",
		hidden: "hidden",
		hiddenOverflow: "overflow-hidden",
		mainRow: "main-row",
		subRow: "sub-row"
	};
	const visibleItemsList = document.getElementsByClassName(`${classNames.listItem} ${classNames.mainRow}`);
	const hiddenItemsList = document.getElementsByClassName(`${classNames.listItem} ${classNames.subRow}`);
	const params = {
		resizeParamName: isVerticalMenu ? 'innerHeight' : 'innerWidth',
		resizeParamValue: '',
		offsetParamName: isVerticalMenu ? 'offsetLeft' : 'offsetTop',
		minOffsetParamValue: 0
	};
	let menuElement = '';
	let listContainerElement = '';
	let isMenuOpen = false;

	//initial mount;
	initialize();

	function hideItemFromList() {
		const minWidthItem = Array.prototype.reduce.call(visibleItemsList, ((a,b) => a.clientWidth < b.clientWidth ? a : b));
		$.changeClass(minWidthItem, classNames.mainRow, classNames.subRow);
		minWidthItem.classList.add(classNames.hidden);
		menuElement.removeClass(classNames.hidden);
	}

	function showItemInList(el) {
		$.changeClass(el, classNames.subRow, classNames.mainRow);
		el.classList.remove(classNames.hidden);
		if (!hiddenItemsList.length) {
			menuElement.addClass(classNames.hidden);
		}
	}

	function addMenuElement(container) {
		//adding menu button;
		let btn = document.createElement('div');
		btn.className = `${classNames.menuButton} ${classNames.menuButtonOrientation} ${classNames.hidden}`;
		btn.textContent = "menu";
		btn.addEventListener('click', changeMenuState);
		container.appendChild(btn);
	}

	function changeMenuState() {
		if (!isMenuOpen) {
			//open menu = remove overflow from the container list + add full row class to sub-row items;
			Array.prototype.forEach.call(hiddenItemsList, (e => $.changeClass(e, classNames.hidden, classNames.fullRow)));
			listContainerElement.classList.remove(classNames.hiddenOverflow);
			menuElement.addClass(classNames.menuButtonClicked);
			isMenuOpen = true;
		}
		else {
			//open menu = add overflow from the container list + remove full row class from sub-row items;
			listContainerElement.classList.add(classNames.hiddenOverflow);
			Array.prototype.forEach.call(hiddenItemsList, (e => $.changeClass(e, classNames.fullRow, classNames.hidden)));
			menuElement.removeClass(classNames.menuButtonClicked);
			isMenuOpen = false;
		}	
	}

	function resizeEventListener() {
		if (isMenuOpen) {
			//close menu during window resize;
			changeMenuState();
		}
		if (window[params.resizeParamName] < params.resizeParamValue || !params.resizeParamValue) {
			//if window shrinks - hide elements;
			Array.prototype.forEach.call(visibleItemsList, (e => {
				if (e[params.offsetParamName] > params.minOffsetParamValue) {
					hideItemFromList(e);
				}
			}));
		} else {
			//if window grows - show elements;
			Array.prototype.forEach.call(hiddenItemsList, (e => {
				if (e[params.offsetParamName] <= params.minOffsetParamValue) {
					showItemInList(e);
				}
			}));
		}
		params.resizeParamValue = window[params.resizeParamName];
	}

	function initialize() {
		//create document fragment for future list;
		let fragment = document.createDocumentFragment();
		//create container <div id="list-container"></div>;
		let listContainer = document.createElement('div');
		listContainer.className = `${classNames.listContainer} ${classNames.hiddenOverflow}`;
		listContainer.id = "list-container";
		//transform JSON data to the list of divs and add them to the list container element;
		listData.forEach(e => {
			let li = document.createElement('div');
			li.className = `${classNames.listItem} ${classNames.mainRow}`;
			li.textContent = e.name;
			listContainer.appendChild(li);
		})
		addMenuElement(listContainer);
		//mount created list to the DOM element;
		mountElement.appendNode(listContainer);
		//set default state of the list;
		setDefaults();
		//start listening resize event;
		window.addEventListener('resize', resizeEventListener);
	}
	
	function setDefaults() {
		listContainerElement = document.getElementById('list-container');
		params.minOffsetParamValue = listContainerElement[params.offsetParamName];
		menuElement = $(`.${classNames.menuButton}`);
		//hide wraped elements;
		while (Array.prototype.find.call(visibleItemsList, (e => e[params.offsetParamName] > params.minOffsetParamValue))) {
			hideItemFromList();
		}
	}
	
  }
  
   return dollar
})()