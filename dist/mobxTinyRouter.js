(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("mobx"), require("mobx-utils"));
	else if(typeof define === 'function' && define.amd)
		define(["mobx", "mobx-utils"], factory);
	else if(typeof exports === 'object')
		exports["mobxTinyRouter"] = factory(require("mobx"), require("mobx-utils"));
	else
		root["mobxTinyRouter"] = factory(root["mobx"], root["mobx-utils"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_7__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strictUriEncode = __webpack_require__(6);
var objectAssign = __webpack_require__(5);

function encoderForArrayFormat(opts) {
	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, index) {
				return value === null ? [
					encode(key, opts),
					'[',
					index,
					']'
				].join('') : [
					encode(key, opts),
					'[',
					encode(index, opts),
					']=',
					encode(value, opts)
				].join('');
			};

		case 'bracket':
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'[]=',
					encode(value, opts)
				].join('');
			};

		default:
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'=',
					encode(value, opts)
				].join('');
			};
	}
}

function parserForArrayFormat(opts) {
	var result;

	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, accumulator) {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return function (key, value, accumulator) {
				result = /(\[\])$/.exec(key);

				key = key.replace(/\[\]$/, '');

				if (!result || accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		default:
			return function (key, value, accumulator) {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, opts) {
	if (opts.encode) {
		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	} else if (typeof input === 'object') {
		return keysSorter(Object.keys(input)).sort(function (a, b) {
			return Number(a) - Number(b);
		}).map(function (key) {
			return input[key];
		});
	}

	return input;
}

exports.extract = function (str) {
	return str.split('?')[1] || '';
};

exports.parse = function (str, opts) {
	opts = objectAssign({arrayFormat: 'none'}, opts);

	var formatter = parserForArrayFormat(opts);

	// Create an object with no prototype
	// https://github.com/sindresorhus/query-string/issues/47
	var ret = Object.create(null);

	if (typeof str !== 'string') {
		return ret;
	}

	str = str.trim().replace(/^(\?|#|&)/, '');

	if (!str) {
		return ret;
	}

	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val);

		formatter(decodeURIComponent(key), val, ret);
	});

	return Object.keys(ret).sort().reduce(function (result, key) {
		var val = ret[key];
		if (Boolean(val) && typeof val === 'object' && !Array.isArray(val)) {
			// Sort object keys, not values
			result[key] = keysSorter(val);
		} else {
			result[key] = val;
		}

		return result;
	}, Object.create(null));
};

exports.stringify = function (obj, opts) {
	var defaults = {
		encode: true,
		strict: true,
		arrayFormat: 'none'
	};

	opts = objectAssign(defaults, opts);

	var formatter = encoderForArrayFormat(opts);

	return obj ? Object.keys(obj).sort().map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return encode(key, opts);
		}

		if (Array.isArray(val)) {
			var result = [];

			val.slice().forEach(function (val2) {
				if (val2 === undefined) {
					return;
				}

				result.push(formatter(key, val2, result.length));
			});

			return result.join('&');
		}

		return encode(key, opts) + '=' + encode(val, opts);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mobx__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mobx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mobx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_query_string__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_query_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_query_string__);
var _desc, _value, _class, _descriptor, _descriptor2;

function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}





var Route = (_class =

//lifecycle methods
function Route(cfg) {
    _classCallCheck(this, Route);

    _initDefineProp(this, 'component', _descriptor, this);

    _initDefineProp(this, 'path', _descriptor2, this);

    this.compoent = cfg.component;
    this.path = cfg.path;
    this.onEnter = cfg.onEnter;
    this.onExit = cfg.onExit;
    this.beforeEnter = cfg.beforeEnter;
    this.beforeExit = cfg.beforeExit;
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'component', [__WEBPACK_IMPORTED_MODULE_0_mobx__["observable"]], {
    enumerable: true,
    initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'path', [__WEBPACK_IMPORTED_MODULE_0_mobx__["observable"]], {
    enumerable: true,
    initializer: null
})), _class);


/* harmony default export */ __webpack_exports__["a"] = Route;

/*



import {toJS} from 'mobx';
import {getObjectKeys} from './utils';
import {paramRegex, optionalRegex} from './regex';
import {getRegexMatches} from './utils';
import queryString from 'query-string';

class Route {

    //props
    component;
    path;
    rootPath;

    //lifecycle methods
    onEnter;
    onExit;
    beforeEnter;
    beforeExit;

    constructor(props) {
        getObjectKeys(props).forEach((propKey) => this[propKey] = props[propKey]);
        this.originalPath = this.path;

        //if there are optional parameters, replace the path with a regex expression
        this.path = this.path.indexOf('?') === -1 ? this.path : this.path.replace(optionalRegex, "/?([^/]*)?$");
        this.rootPath = this.getRootPath();

        //bind
        this.getRootPath = this.getRootPath.bind(this);
        this.replaceUrlParams = this.replaceUrlParams.bind(this);
        this.getParamsObject = this.getParamsObject.bind(this);
        this.goTo = this.goTo.bind(this);
    }

    /!*
     Sets the root path for the current path, so it's easier to determine if the route entered/exited or just some params changed
     Example: for '/' the root path is '/', for '/profile/:username/:tab' the root path is '/profile'
     *!/
    getRootPath() {
        return `/${this.path.split('/')[1]}`
    };

    /!*
     replaces url params placeholders with params from an object
     Example: if url is /book/:id/page/:pageId and object is {id:100, pageId:200} it will return /book/100/page/200
     *!/
    replaceUrlParams(params, queryParams = {}) {
        params = toJS(params);
        queryParams = toJS(queryParams);

        const queryParamsString = queryString.stringify(queryParams).toString();
        const hasQueryParams = queryParamsString !== '';
        let newPath = this.originalPath;

        getRegexMatches(this.originalPath, paramRegex, ([fullMatch, paramKey, paramKeyWithoutColon]) => {
            const value = params[paramKeyWithoutColon];
            newPath = value ? newPath.replace(paramKey, value) : newPath.replace(`/${paramKey}`, '');
        });

        return `${newPath}${hasQueryParams ? `?${queryParamsString}` : ''}`.toString();
    }

    /!*
     converts an array of params [123, 100] to an object
     Example: if the current this.path is /book/:id/page/:pageId it will return {id:123, pageId:100}
     *!/
    getParamsObject(paramsArray) {

        const params = [];
        getRegexMatches(this.originalPath, paramRegex, ([fullMatch, paramKey, paramKeyWithoutColon]) => {
            params.push(paramKeyWithoutColon);
        });

        const result = paramsArray.reduce((obj, paramValue, index) => {
            obj[params[index]] = paramValue;
            return obj;
        }, {});

        return result;
    }

    goTo(store, paramsArr) {
        const paramsObject = this.getParamsObject(paramsArr);
        const queryParamsObject = queryString.parse(window.location.search);
        store.router.goTo(this, paramsObject, store, queryParamsObject);
    }
}

export default Route;*/

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mobx__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mobx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mobx__);
var _desc, _value, _class, _descriptor;

function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}



var RouterStore = (_class =
//   @observable currentView;


function RouterStore() {
    _classCallCheck(this, RouterStore);

    _initDefineProp(this, 'currentPath', _descriptor, this);
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'currentPath', [__WEBPACK_IMPORTED_MODULE_0_mobx__["observable"]], {
    enumerable: true,
    initializer: function initializer() {
        return 'haha';
    }
})), _class);


/* harmony default export */ __webpack_exports__["a"] = RouterStore;

/*


class RouterStore {

    @observable params = {};
    @observable queryParams = {};
    @observable currentView;

    constructor() {
        this.goTo = this.goTo.bind(this);
    }

    @action goTo(view, paramsObj, store, queryParamsObj) {

        const nextPath = view.replaceUrlParams(paramsObj, queryParamsObj);
        const pathChanged = nextPath !== this.currentPath;

        if (!pathChanged) {
            return;
        }

        const rootViewChanged = !this.currentView || (this.currentView.rootPath !== view.rootPath);
        const currentParams = toJS(this.params);
        const currentQueryParams = toJS(this.queryParams);

        const beforeExitResult = (rootViewChanged && this.currentView && this.currentView.beforeExit) ? this.currentView.beforeExit(this.currentView, currentParams, store, currentQueryParams) : true;
        if (beforeExitResult === false) {
            return;
        }

        const beforeEnterResult = (rootViewChanged && view.beforeEnter) ? view.beforeEnter(view, currentParams, store, currentQueryParams) : true
        if (beforeEnterResult === false) {
            return;
        }

        rootViewChanged && this.currentView && this.currentView.onExit && this.currentView.onExit(this.currentView, currentParams, store, currentQueryParams);

        this.currentView = view;
        this.params = toJS(paramsObj);
        this.queryParams = toJS(queryParamsObj);
        const nextParams = toJS(paramsObj);
        const nextQueryParams = toJS(queryParamsObj);

        rootViewChanged && view.onEnter && view.onEnter(view, nextParams, store, nextQueryParams);
        !rootViewChanged && this.currentView && this.currentView.onParamsChange && this.currentView.onParamsChange(this.currentView, nextParams, store, nextQueryParams);
    }

    @computed get currentPath() {
        return this.currentView ? this.currentView.replaceUrlParams(this.params, this.queryParams) : '';
    }
}

export default RouterStore;*/

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mobx__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mobx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mobx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_mobx_utils__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_mobx_utils___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_mobx_utils__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_query_string__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_query_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_query_string__);
//import {Router} from 'director/build/director';




var startRouter = function startRouter(store, routes, url) {

    console.log(store);

    function cloneLocation() {
        var l = window.location;
        return Object.assign({}, {
            hash: l.hash,
            host: l.host,
            hostname: l.hostname,
            href: l.href,
            origin: l.origin,
            pathname: l.pathname,
            port: l.port,
            protocol: l.protocol,
            search: l.search,
            query: __WEBPACK_IMPORTED_MODULE_2_query_string___default.a.parse(l.search)
        });
    }

    var location = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_mobx__["observable"])(cloneLocation());
    // store.router.location = location;
    window.addEventListener('popstate', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_mobx__["action"])('popstateHandler', function (ev) {
        console.log('location changed');
        store.router.currentPath = Math.random();
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_mobx__["extendObservable"])(location, cloneLocation());
    }));

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_mobx__["autorun"])(function () {
        console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_mobx__["toJS"])(location));
        //   console.log(store.router.location.pathname);

        var currentPath = store.router.currentPath;

        console.log(currentPath);
        if (currentPath !== location.pathname) {

            //  window.history.pushState(null, null, currentPath)
        }
    });
};

/* harmony default export */ __webpack_exports__["a"] = startRouter;

/* let  currentSubscription;
 let locationObs = fromResource(
 (sink) => {
 // sink the current state
 //        const {filter, filteredTodos,clearComplete, todos} = this.props.store;





 sink(cloneLocations());
 // subscribe to the record, invoke the sink callback whenever new data arrives
 currentSubscription = window.addEventListener('popstate',() => {

 sink(cloneLocations())
 })
 },
 () => {
 // the user observable is not in use at the moment, unsubscribe (for now)
 location.unsubscribe(currentSubscription)
 }
 );


 autorun(() => {
 // printed everytime the database updates its records
 console.log(locationObs.current())
 })

 */

/*  autorun(() => {
 const {currentPath} = store.router;
 if (currentPath !== window.location.pathname) {
 window.history.pushState(null, null, currentPath)
 }
 });*/

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__files_route__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__files_routerStore__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__files_startRouter__ = __webpack_require__(4);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Route", function() { return __WEBPACK_IMPORTED_MODULE_0__files_route__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "RouterStore", function() { return __WEBPACK_IMPORTED_MODULE_1__files_routerStore__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "startRouter", function() { return __WEBPACK_IMPORTED_MODULE_2__files_startRouter__["a"]; });




function create() {
    return {
        Route: __WEBPACK_IMPORTED_MODULE_0__files_route__["a" /* default */],
        RouterStore: __WEBPACK_IMPORTED_MODULE_1__files_routerStore__["a" /* default */],
        startRouter: __WEBPACK_IMPORTED_MODULE_2__files_startRouter__["a" /* default */]
    };
}

//components
//import MobxRouter from './src/components/MobxRouter';
//import Link from './src/components/Link';
//module.exports = create();


//export {Route};


/*

import {extendObservable, observable, action} from 'mobx'
import queryString from 'query-string'
import React, { Component } from 'react';

import startRouter from './routerStart';

import router from './routerStore';


startRouter();


const propsToMirror = [
    'hash',
    'host',
    'hostname',
    'href',
    'origin',
    'pathname',
    'port',
    'protocol',
    'search'
]

const createSnapshot = function () {
    const snapshot = propsToMirror.reduce((snapshot, prop) => {
            snapshot[prop] = window.location[prop]
            return snapshot
        }, {})
    snapshot.query = queryString.parse(snapshot.search)
    return snapshot
}
const firstSnapshot = createSnapshot()
const locationObservable = observable(firstSnapshot)

window.addEventListener('popstate', action('popstateHandler', (ev) => {

        extendObservable(locationObservable, createSnapshot())
}))

export default locationObservable*/

/***/ })
/******/ ]);
});
//# sourceMappingURL=mobxTinyRouter.js.map