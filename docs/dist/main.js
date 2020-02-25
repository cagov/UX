/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@cagov/accordion/index.js":
/*!************************************************!*\
  !*** ./node_modules/@cagov/accordion/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class CWDSAccordion extends HTMLElement {\n  connectedCallback() {\n    this.expandTarget = this.querySelector('.card-container');\n    this.expandButton = this.querySelector('.card-header');\n    this.expandButton.addEventListener('click', this.listen.bind(this))\n  }\n\n  listen() {\n    if(!this.cardBodyHeight) {\n      this.cardBodyHeight = this.querySelector('.card-body').clientHeight;\n    }\n    if(this.expandTarget.clientHeight > 0) {\n      this.expandTarget.style.height = '0px';\n      this.querySelector('.card-header').classList.remove('accordion-alpha-open');\n      let expando = this.expandTarget;\n      setTimeout(function() {\n        expando.style.display = \"none\";\n      }, 300)\n    } else {\n      this.expandTarget.style.display = \"block\";\n      this.expandTarget.style.height = this.cardBodyHeight+'px';\n      this.querySelector('.card-header').classList.add('accordion-alpha-open');\n    }\n  }\n}\nwindow.customElements.define('cwds-accordion', CWDSAccordion);\n\n\n//# sourceURL=webpack:///./node_modules/@cagov/accordion/index.js?");

/***/ }),

/***/ "./node_modules/@cagov/step-list/index.js":
/*!************************************************!*\
  !*** ./node_modules/@cagov/step-list/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class CWDSStepList extends HTMLElement {\n  connectedCallback() {\n    this.expandTargets = this.querySelectorAll('li');\n    this.expandTargets.forEach( (item) => {\n      item.addEventListener('click', this.listen)\n      /*let detailsEl = item.querySelector('.details');\n      if(detailsEl) {\n        setTimeout(function() {\n          detailsEl.detailsHeight = detailsEl.scrollHeight;\n          detailsEl.style.display = \"none\";\n        }, 30)\n      }*/\n    })\n  }\n\n  listen() { /*\n    let detailsEl = this.querySelector('.details');\n    let detailsHeight = detailsEl.detailsHeight\n    */\n\n    var section = this.querySelector('.details');\n    var isCollapsed = section.getAttribute('data-collapsed') === 'true';\n      \n    if(isCollapsed) {\n      expandSection(section)\n      section.setAttribute('data-collapsed', 'false')\n      this.classList.remove('list-open')\n    } else {\n      collapseSection(section)\n      this.classList.add('list-open')\n    }\n  }\n}\n\nwindow.customElements.define('cwds-step-list', CWDSStepList);\n\nfunction collapseSection(element) {\n  // get the height of the element's inner content, regardless of its actual size\n  var sectionHeight = element.scrollHeight;\n  \n  // temporarily disable all css transitions\n  var elementTransition = element.style.transition;\n  element.style.transition = '';\n  \n  // on the next frame (as soon as the previous style change has taken effect),\n  // explicitly set the element's height to its current pixel height, so we \n  // aren't transitioning out of 'auto'\n  requestAnimationFrame(function() {\n    element.style.height = sectionHeight + 'px';\n    element.style.transition = elementTransition;\n    \n    // on the next frame (as soon as the previous style change has taken effect),\n    // have the element transition to height: 0\n    requestAnimationFrame(function() {\n      element.style.height = 0 + 'px';\n    });\n  });\n  \n  // mark the section as \"currently collapsed\"\n  element.setAttribute('data-collapsed', 'true');\n}\n\nfunction expandSection(element) {\n  // get the height of the element's inner content, regardless of its actual size\n  var sectionHeight = element.scrollHeight;\n  \n  // have the element transition to the height of its inner content\n  element.style.height = sectionHeight + 'px';\n\n  // when the next css transition finishes (which should be the one we just triggered)\n  element.addEventListener('transitionend', function(e) {\n    // remove this event listener so it only gets triggered once\n    element.removeEventListener('transitionend', arguments.callee);\n    \n    // remove \"height\" from the element's inline styles, so it can return to its initial value\n    element.style.height = null;\n  });\n  \n  // mark the section as \"currently not collapsed\"\n  element.setAttribute('data-collapsed', 'false');\n}\n\n//# sourceURL=webpack:///./node_modules/@cagov/step-list/index.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _cagov_accordion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @cagov/accordion */ \"./node_modules/@cagov/accordion/index.js\");\n/* harmony import */ var _cagov_accordion__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_cagov_accordion__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _cagov_step_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @cagov/step-list */ \"./node_modules/@cagov/step-list/index.js\");\n/* harmony import */ var _cagov_step_list__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_cagov_step_list__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });