/*
 * SidebarJS
 * Version 4.1.0
 * https://github.com/SidebarJS/sidebarjs#readme
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.SidebarJS = {})));
}(this, (function (exports) { 'use strict';

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var sidebarElement = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
var SIDEBARJS = 'sidebarjs';
var IS_VISIBLE = SIDEBARJS + "--is-visible";
var IS_MOVING = SIDEBARJS + "--is-moving";
var LEFT_POSITION = 'left';
var RIGHT_POSITION = 'right';
var TRANSITION_DURATION = 400;
var POSITIONS = [LEFT_POSITION, RIGHT_POSITION];
var SidebarElement = /** @class */ (function () {
    function SidebarElement(config) {
        if (config === void 0) { config = {}; }
        var component = config.component, container = config.container, backdrop = config.backdrop, _a = config.documentMinSwipeX, documentMinSwipeX = _a === void 0 ? 10 : _a, _b = config.documentSwipeRange, documentSwipeRange = _b === void 0 ? 40 : _b, nativeSwipe = config.nativeSwipe, nativeSwipeOpen = config.nativeSwipeOpen, _c = config.position, position = _c === void 0 ? 'left' : _c, _d = config.backdropOpacity, backdropOpacity = _d === void 0 ? 0.3 : _d;
        this.component = component || document.querySelector("[" + SIDEBARJS + "]");
        this.container = container || SidebarElement.create(SIDEBARJS + "-container");
        this.backdrop = backdrop || SidebarElement.create(SIDEBARJS + "-backdrop");
        this.documentMinSwipeX = documentMinSwipeX;
        this.documentSwipeRange = documentSwipeRange;
        this.nativeSwipe = nativeSwipe !== false;
        this.nativeSwipeOpen = nativeSwipeOpen !== false;
        this.backdropOpacity = backdropOpacity;
        this.backdropOpacityRatio = 1 / backdropOpacity;
        var hasAllConfigDOMElements = component && container && backdrop;
        if (!hasAllConfigDOMElements) {
            try {
                this.transcludeContent();
            }
            catch (e) {
                throw new Error('You must define an element with [sidebarjs] attribute');
            }
        }
        if (this.nativeSwipe) {
            this.addNativeGestures();
            if (this.nativeSwipeOpen) {
                this.addNativeOpenGestures();
            }
        }
        this.setPosition(position);
        this.addAttrsEventsListeners(this.component.getAttribute(SIDEBARJS));
        this.backdrop.addEventListener('click', this.close.bind(this), { passive: true });
    }
    SidebarElement.prototype.toggle = function () {
        this.isVisible() ? this.close() : this.open();
    };
    SidebarElement.prototype.open = function () {
        this.component.classList.add(IS_VISIBLE);
        this.setBackdropOpacity(this.backdropOpacity);
    };
    SidebarElement.prototype.close = function () {
        this.component.classList.remove(IS_VISIBLE);
        this.backdrop.removeAttribute('style');
    };
    SidebarElement.prototype.isVisible = function () {
        return this.component.classList.contains(IS_VISIBLE);
    };
    SidebarElement.prototype.setPosition = function (position) {
        var _this = this;
        this.component.classList.add(IS_MOVING);
        this.position = POSITIONS.indexOf(position) >= 0 ? position : LEFT_POSITION;
        for (var i = 0; i < POSITIONS.length; i++) {
            this.component.classList.remove(SIDEBARJS + "--" + POSITIONS[i]);
        }
        this.component.classList.add(SIDEBARJS + "--" + (this.hasRightPosition() ? RIGHT_POSITION : LEFT_POSITION));
        setTimeout(function () { return _this.component.classList.remove(IS_MOVING); }, TRANSITION_DURATION);
    };
    SidebarElement.prototype.addAttrsEventsListeners = function (sidebarName) {
        var actions = ['toggle', 'open', 'close'];
        for (var i = 0; i < actions.length; i++) {
            var elements = document.querySelectorAll("[" + SIDEBARJS + "-" + actions[i] + "=\"" + sidebarName + "\"]");
            for (var j = 0; j < elements.length; j++) {
                if (!SidebarElement.elemHasListener(elements[j])) {
                    elements[j].addEventListener('click', this[actions[i]].bind(this), { passive: true });
                    SidebarElement.elemHasListener(elements[j], true);
                }
            }
        }
    };
    SidebarElement.prototype.hasLeftPosition = function () {
        return this.position === LEFT_POSITION;
    };
    SidebarElement.prototype.hasRightPosition = function () {
        return this.position === RIGHT_POSITION;
    };
    SidebarElement.prototype.transcludeContent = function () {
        this.container.innerHTML = this.component.innerHTML;
        this.component.innerHTML = '';
        this.component.appendChild(this.container);
        this.component.appendChild(this.backdrop);
    };
    SidebarElement.prototype.addNativeGestures = function () {
        this.component.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
        this.component.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });
        this.component.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: true });
    };
    SidebarElement.prototype.addNativeOpenGestures = function () {
        document.addEventListener('touchstart', this.onSwipeOpenStart.bind(this), { passive: true });
        document.addEventListener('touchmove', this.onSwipeOpenMove.bind(this), { passive: true });
        document.addEventListener('touchend', this.onSwipeOpenEnd.bind(this), { passive: true });
    };
    SidebarElement.prototype.onTouchStart = function (e) {
        this.initialTouch = e.touches[0].pageX;
    };
    SidebarElement.prototype.onTouchMove = function (e) {
        var documentSwiped = this.initialTouch - e.touches[0].clientX;
        var sidebarMovement = this.getSidebarPosition(documentSwiped);
        this.touchMoveSidebar = -documentSwiped;
        if (sidebarMovement <= this.container.clientWidth) {
            this.moveSidebar(this.touchMoveSidebar);
        }
    };
    SidebarElement.prototype.onTouchEnd = function () {
        this.component.classList.remove(IS_MOVING);
        this.container.removeAttribute('style');
        this.backdrop.removeAttribute('style');
        Math.abs(this.touchMoveSidebar) > (this.container.clientWidth / 3.5) ? this.close() : this.open();
        this.initialTouch = null;
        this.touchMoveSidebar = null;
    };
    SidebarElement.prototype.moveSidebar = function (movement) {
        this.component.classList.add(IS_MOVING);
        SidebarElement.vendorify(this.container, 'transform', "translate(" + movement + "px, 0)");
        this.updateBackdropOpacity(movement);
    };
    SidebarElement.prototype.updateBackdropOpacity = function (movement) {
        var swipeProgress = 1 - (Math.abs(movement) / this.container.clientWidth);
        var opacity = swipeProgress / this.backdropOpacityRatio;
        this.setBackdropOpacity(opacity);
    };
    SidebarElement.prototype.setBackdropOpacity = function (opacity) {
        this.backdrop.style.opacity = opacity.toString();
    };
    SidebarElement.prototype.onSwipeOpenStart = function (e) {
        if (this.targetElementIsBackdrop(e)) {
            return;
        }
        var clientWidth = document.body.clientWidth;
        var touchPositionX = e.touches[0].clientX;
        var documentTouch = this.hasLeftPosition() ? touchPositionX : clientWidth - touchPositionX;
        if (documentTouch < this.documentSwipeRange) {
            this.onTouchStart(e);
        }
    };
    SidebarElement.prototype.onSwipeOpenMove = function (e) {
        if (!this.targetElementIsBackdrop(e) && this.initialTouch && !this.isVisible()) {
            var documentSwiped = e.touches[0].clientX - this.initialTouch;
            var sidebarMovement = this.getSidebarPosition(documentSwiped);
            if (sidebarMovement > 0) {
                SidebarElement.vendorify(this.component, 'transform', 'translate(0, 0)');
                SidebarElement.vendorify(this.component, 'transition', 'none');
                this.openMovement = sidebarMovement * (this.hasLeftPosition() ? -1 : 1);
                this.moveSidebar(this.openMovement);
            }
        }
    };
    SidebarElement.prototype.onSwipeOpenEnd = function () {
        if (this.openMovement) {
            this.openMovement = null;
            this.component.removeAttribute('style');
            this.onTouchEnd();
        }
    };
    SidebarElement.prototype.getSidebarPosition = function (swiped) {
        return (this.container.clientWidth - (this.hasLeftPosition() ? swiped : -swiped));
    };
    SidebarElement.prototype.targetElementIsBackdrop = function (e) {
        return e.target.hasAttribute(SIDEBARJS + "-backdrop");
    };
    SidebarElement.create = function (element) {
        var el = document.createElement('div');
        el.setAttribute(element, '');
        return el;
    };
    SidebarElement.vendorify = function (el, prop, val) {
        var Prop = prop.charAt(0).toUpperCase() + prop.slice(1);
        var prefs = ['Moz', 'Webkit', 'O', 'ms'];
        el.style[prop] = val;
        for (var i = 0; i < prefs.length; i++) {
            el.style[prefs[i] + Prop] = val;
        }
        return el;
    };
    SidebarElement.elemHasListener = function (elem, value) {
        return elem && typeof value === 'boolean' ? elem.sidebarjsListener = value : !!elem.sidebarjsListener;
    };
    return SidebarElement;
}());
exports.SidebarElement = SidebarElement;

});

unwrapExports(sidebarElement);
var sidebarElement_1 = sidebarElement.SidebarElement;

var sidebarService = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

var SidebarService = /** @class */ (function () {
    function SidebarService() {
        this.instances = {};
    }
    SidebarService.prototype.create = function (options) {
        if (options === void 0) { options = {}; }
        var name = options.component && options.component.getAttribute('sidebarjs') || '';
        this.instances[name] = new sidebarElement.SidebarElement(options);
        return this.instances[name];
    };
    SidebarService.prototype.open = function (sidebarName) {
        if (sidebarName === void 0) { sidebarName = ''; }
        if (this.instances[sidebarName]) {
            this.instances[sidebarName].open();
        }
    };
    SidebarService.prototype.close = function (sidebarName) {
        if (sidebarName === void 0) { sidebarName = ''; }
        if (this.instances[sidebarName]) {
            this.instances[sidebarName].close();
        }
    };
    SidebarService.prototype.toggle = function (sidebarName) {
        if (sidebarName === void 0) { sidebarName = ''; }
        if (this.instances[sidebarName]) {
            this.instances[sidebarName].toggle();
        }
    };
    SidebarService.prototype.isVisible = function (sidebarName) {
        if (sidebarName === void 0) { sidebarName = ''; }
        return !!this.instances[sidebarName] && this.instances[sidebarName].isVisible();
    };
    SidebarService.prototype.setPosition = function (position, sidebarName) {
        if (sidebarName === void 0) { sidebarName = ''; }
        if (this.instances[sidebarName]) {
            this.instances[sidebarName].setPosition(position);
        }
    };
    SidebarService.prototype.elemHasListener = function (elem, value) {
        return sidebarElement.SidebarElement.elemHasListener(elem, value);
    };
    SidebarService.prototype.destroy = function (sidebarName) {
        if (sidebarName === void 0) { sidebarName = ''; }
        if (this.instances[sidebarName]) {
            delete this.instances[sidebarName];
        }
    };
    return SidebarService;
}());
exports.SidebarService = SidebarService;

});

unwrapExports(sidebarService);
var sidebarService_1 = sidebarService.SidebarService;

var src = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

exports.SidebarElement = sidebarElement.SidebarElement;

exports.SidebarService = sidebarService.SidebarService;

});

var index = unwrapExports(src);
var src_1 = src.SidebarElement;
var src_2 = src.SidebarService;

exports['default'] = index;
exports.SidebarElement = src_1;
exports.SidebarService = src_2;

Object.defineProperty(exports, '__esModule', { value: true });

})));
