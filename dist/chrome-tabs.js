"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var draggabilly_1 = __importDefault(require("draggabilly"));
var TAB_CONTENT_MARGIN = 9;
var TAB_CONTENT_OVERLAP_DISTANCE = 1;
var TAB_OVERLAP_DISTANCE = TAB_CONTENT_MARGIN * 2 + TAB_CONTENT_OVERLAP_DISTANCE;
var TAB_CONTENT_MIN_WIDTH = 24;
var TAB_CONTENT_MAX_WIDTH = 240;
var TAB_SIZE_SMALL = 84;
var TAB_SIZE_SMALLER = 60;
var TAB_SIZE_MINI = 48;
var noop = function (_) { };
var closest = function (value, array) {
    var closest = Infinity;
    var closestIndex = -1;
    array.forEach(function (v, i) {
        if (Math.abs(value - v) < closest) {
            closest = Math.abs(value - v);
            closestIndex = i;
        }
    });
    return closestIndex;
};
var tabTemplate = "\n      <div class=\"chrome-tab\">\n        <div class=\"chrome-tab-dividers\"></div>\n        <div class=\"chrome-tab-background\">\n          <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><defs><symbol id=\"chrome-tab-geometry-left\" viewBox=\"0 0 214 36\"><path d=\"M17 0h197v36H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z\"/></symbol><symbol id=\"chrome-tab-geometry-right\" viewBox=\"0 0 214 36\"><use xlink:href=\"#chrome-tab-geometry-left\"/></symbol><clipPath id=\"crop\"><rect class=\"mask\" width=\"100%\" height=\"100%\" x=\"0\"/></clipPath></defs><svg width=\"52%\" height=\"100%\"><use xlink:href=\"#chrome-tab-geometry-left\" width=\"214\" height=\"36\" class=\"chrome-tab-geometry\"/></svg><g transform=\"scale(-1, 1)\"><svg width=\"52%\" height=\"100%\" x=\"-100%\" y=\"0\"><use xlink:href=\"#chrome-tab-geometry-right\" width=\"214\" height=\"36\" class=\"chrome-tab-geometry\"/></svg></g></svg>\n        </div>\n        <div class=\"chrome-tab-content\">\n          <div class=\"chrome-tab-favicon\"></div>\n          <div class=\"chrome-tab-title\"></div>\n     <div class=\"chrome-tab-url\"></div>\n     <div class=\"chrome-tab-drag-handle\"></div>\n          <div class=\"chrome-tab-close\"></div>\n        </div>\n      </div>\n    ";
var tabContentPageTemplate = "<div class=\"chrome-tabs-content-page\"><iframe frameborder=\"0\"></iframe></div>";

var defaultTapProperties = {
    title: "New tab",
    favicon: false,
    url: ''
};
var instanceId = 0;
var ChromeTabs = /** @class */ (function () {
    function ChromeTabs() {
        this.draggabillies = [];
    }
    ChromeTabs.prototype.init = function (el) {
        this.el = el;
        this.instanceId = instanceId;
        this.el.setAttribute("data-chrome-tabs-instance-id", this.instanceId + "");
        instanceId += 1;
        this.setupCustomProperties();
        this.setupStyleEl();
        this.setupEvents();
        this.layoutTabs();
        this.setupDraggabilly();
    };
    ChromeTabs.prototype.emit = function (eventName, data) {
        this.el.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    };
    ChromeTabs.prototype.setupCustomProperties = function () {
        this.el.style.setProperty("--tab-content-margin", TAB_CONTENT_MARGIN + "px");
    };
    ChromeTabs.prototype.setupStyleEl = function () {
        this.styleEl = document.createElement("style");
        this.el.appendChild(this.styleEl);
    };
    ChromeTabs.prototype.setupEvents = function () {
        var _this = this;
        window.addEventListener("resize", function (_) {
            _this.cleanUpPreviouslyDraggedTabs();
            _this.layoutTabs();
        });
        // this.el.addEventListener("dblclick", (event) => {
        //   if ([this.el, this.tabContentEl].includes(event.target as HTMLElement))
        //     this.addTab();
        // });
        this.tabEls.forEach(function (tabEl) { return _this.setTabCloseEventListener(tabEl); });
    };

    ChromeTabs.prototype.getTabElCttFromtabEl = function (tabEl) {
        // console.log('this.getIdFromEl(tabEl) : ',this.getIdFromEl(tabEl));
        var tabElCtt = document.querySelector('.chrome-tabs-content-page[data-tab-id="'+this.getIdFromEl(tabEl)+'"]')
        // console.log('get tabElCtt: ',tabElCtt);
        return tabElCtt;
    }

    ChromeTabs.prototype.getTabElFromtabElCtt = function (tabElCtt) {
        var tabEl = document.querySelector('.chrome-tab[data-tab-id="'+this.getIdFromEl(tabElCtt)+'"]')
        // console.log('get tabEl: ',tabEl);
        return tabEl;
    }

    ChromeTabs.prototype.getIdFromEl = function (El) {
        var tId = El.getAttribute('data-tab-id');
    return tId;
    }

    ChromeTabs.prototype.addIdTabElFromtabEl = function (tabElCtt, tabEl) {
        tabElCtt.setAttribute('data-tab-id',this.getIdFromEl(tabEl));
    }

    Object.defineProperty(ChromeTabs.prototype, "tabEls", {
        get: function () {
            return Array.prototype.slice.call(this.el.querySelectorAll(".chrome-tab"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeTabs.prototype, "tabContentEl", {
        get: function () {
            return this.el.querySelector(".chrome-tabs-content");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeTabs.prototype, "tabContentElCtt", {
        get: function () {
            return document.querySelector(".chrome-tabs-content-pages");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeTabs.prototype, "tabContentWidths", {
        get: function () {
            var numberOfTabs = this.tabEls.length;
            var tabsContentWidth = this.tabContentEl.clientWidth;
            var tabsCumulativeOverlappedWidth = (numberOfTabs - 1) * TAB_CONTENT_OVERLAP_DISTANCE;
            var targetWidth = (tabsContentWidth -
                2 * TAB_CONTENT_MARGIN +
                tabsCumulativeOverlappedWidth) /
                numberOfTabs;
            var clampedTargetWidth = Math.max(TAB_CONTENT_MIN_WIDTH, Math.min(TAB_CONTENT_MAX_WIDTH, targetWidth));
            var flooredClampedTargetWidth = Math.floor(clampedTargetWidth);
            var totalTabsWidthUsingTarget = flooredClampedTargetWidth * numberOfTabs +
                2 * TAB_CONTENT_MARGIN -
                tabsCumulativeOverlappedWidth;
            var totalExtraWidthDueToFlooring = tabsContentWidth - totalTabsWidthUsingTarget;
            // TODO - Support tabs with different widths / e.g. "pinned" tabs
            var widths = [];
            var extraWidthRemaining = totalExtraWidthDueToFlooring;
            for (var i = 0; i < numberOfTabs; i += 1) {
                var extraWidth = flooredClampedTargetWidth < TAB_CONTENT_MAX_WIDTH &&
                    extraWidthRemaining > 0
                    ? 1
                    : 0;
                widths.push(flooredClampedTargetWidth + extraWidth);
                if (extraWidthRemaining > 0)
                    extraWidthRemaining -= 1;
            }
            return widths;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeTabs.prototype, "tabContentPositions", {
        get: function () {
            var positions = [];
            var tabContentWidths = this.tabContentWidths;
            var position = TAB_CONTENT_MARGIN;
            tabContentWidths.forEach(function (width, i) {
                var offset = i * TAB_CONTENT_OVERLAP_DISTANCE;
                positions.push(position - offset);
                position += width;
            });
            return positions;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeTabs.prototype, "tabPositions", {
        get: function () {
            var positions = [];
            this.tabContentPositions.forEach(function (contentPosition) {
                positions.push(contentPosition - TAB_CONTENT_MARGIN);
            });
            return positions;
        },
        enumerable: false,
        configurable: true
    });
    ChromeTabs.prototype.layoutTabs = function () {
        var _this = this;
        var tabContentWidths = this.tabContentWidths;
        this.tabEls.forEach(function (tabEl, i) {
            var contentWidth = tabContentWidths[i];
            var width = contentWidth + 2 * TAB_CONTENT_MARGIN;
            tabEl.style.width = width + "px";
            tabEl.removeAttribute("is-small");
            tabEl.removeAttribute("is-smaller");
            tabEl.removeAttribute("is-mini");
            if (contentWidth < TAB_SIZE_SMALL)
                tabEl.setAttribute("is-small", "");
            if (contentWidth < TAB_SIZE_SMALLER)
                tabEl.setAttribute("is-smaller", "");
            if (contentWidth < TAB_SIZE_MINI)
                tabEl.setAttribute("is-mini", "");
        });
        var styleHTML = "";
        this.tabPositions.forEach(function (position, i) {
            styleHTML += "\n            .chrome-tabs[data-chrome-tabs-instance-id=\"" + _this.instanceId + "\"] .chrome-tab:nth-child(" + (i + 1) + ") {\n              transform: translate3d(" + position + "px, 0, 0)\n            }\n          ";
        });
        this.styleEl.innerHTML = styleHTML;
    };
    ChromeTabs.prototype.createNewTabEl = function () {
        var div = document.createElement("div");
        div.innerHTML = tabTemplate;
        return div.firstElementChild;
    };
    ChromeTabs.prototype.createNewTabElCtt = function () {
        var div = document.createElement("div");
        div.innerHTML = tabContentPageTemplate;
        return div.firstElementChild;
    };
    ChromeTabs.prototype.addTab = function (tabProperties, _a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, _c = _b.animate, animate = _c === void 0 ? true : _c, _d = _b.background, background = _d === void 0 ? false : _d;
        var tabEl = this.createNewTabEl();
        var tabElCtt = this.createNewTabElCtt();

        tabEl.oncontextmenu = function (event) {
            _this.emit("tab-contextmenu", { tabEl: tabEl, event: event });
        };
        if (animate) {
            tabEl.classList.add("chrome-tab-was-just-added");
            setTimeout(function () { return tabEl.classList.remove("chrome-tab-was-just-added"); }, 500);
        }
        tabProperties = Object.assign({}, defaultTapProperties, tabProperties);
        this.tabContentEl.appendChild(tabEl);
        this.updateTab(tabEl, tabProperties);
        this.tabContentElCtt.appendChild(tabElCtt);
        this.addIdTabElFromtabEl(tabElCtt, tabEl);
        this.setTabCloseEventListener(tabEl);
        this.emit("tabAdd", { tabEl: tabEl });
        if (!background)
            this.setCurrentTab(tabEl);
        this.cleanUpPreviouslyDraggedTabs();
        this.layoutTabs();
        this.setupDraggabilly();
        tabElCtt.querySelector('iframe').setAttribute('src',tabProperties.url);

        return tabEl;
    };
    ChromeTabs.prototype.setTabCloseEventListener = function (tabEl) {
        var _this = this;
        tabEl.querySelector(".chrome-tab-close").addEventListener("click", function (_) {
            _.stopImmediatePropagation();
            // this.removeTab(tabEl);
            _this.emit("tabClose", { tabEl: tabEl });
        });
    };
    Object.defineProperty(ChromeTabs.prototype, "activeTabEl", {
        get: function () {
            return this.el.querySelector(".chrome-tab[active]");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChromeTabs.prototype, "activeTabElCtt", {
        get: function () {
            return document.querySelector(".chrome-tabs-content-page[active]");
        },
        enumerable: false,
        configurable: true
    });
    ChromeTabs.prototype.hasActiveTab = function () {
        return !!this.activeTabEl;
    };
    ChromeTabs.prototype.setCurrentTab = function (tabEl) {
        var activeTabEl = this.activeTabEl;
        var activeTabElCtt = this.activeTabElCtt;
        var tabElCtt = this.getTabElCttFromtabEl(tabEl);
        if (activeTabEl === tabEl) return;
        if (activeTabEl) activeTabEl.removeAttribute("active");
        if (activeTabElCtt) activeTabElCtt.removeAttribute('active');
        tabEl.setAttribute("active", "");
        if(tabElCtt != null) tabElCtt.setAttribute('active', '');
        this.emit("activeTabChange", { tabEl: tabEl });
        this.emit('activeTabChange', { tabElCtt: tabElCtt });
    };
    ChromeTabs.prototype.removeTab = function (tabEl) {
        var tabElCtt = this.getTabElCttFromtabEl(tabEl);
        // if (tabEl === this.activeTabEl) {
        //   if (tabEl.nextElementSibling) {
        //     this.setCurrentTab(tabEl.nextElementSibling as HTMLElement);
        //   } else if (tabEl.previousElementSibling) {
        //     this.setCurrentTab(tabEl.previousElementSibling as HTMLElement);
        //   }
        // }
        tabEl.parentNode.removeChild(tabEl);
        tabElCtt.parentNode.removeChild(tabElCtt);
        this.emit("tabRemove", { tabEl: tabEl });
        this.cleanUpPreviouslyDraggedTabs();
        this.layoutTabs();
        this.setupDraggabilly();
    };
    ChromeTabs.prototype.updateTab = function (tabEl, tabProperties) {
        tabEl.querySelector(".chrome-tab-title").textContent = tabProperties.title;
        tabEl.querySelector('.chrome-tab-url').textContent = tabProperties.url;

        var faviconEl = tabEl.querySelector(".chrome-tab-favicon");
        if (tabProperties.favicon) {
            faviconEl.style.backgroundImage = "url('" + tabProperties.favicon + "')";
            faviconEl === null || faviconEl === void 0 ? void 0 : faviconEl.removeAttribute("hidden");
        }
        else {
            faviconEl === null || faviconEl === void 0 ? void 0 : faviconEl.setAttribute("hidden", "");
            faviconEl === null || faviconEl === void 0 ? void 0 : faviconEl.removeAttribute("style");
        }
        if (tabProperties.id) {
            tabEl.setAttribute("data-tab-id", tabProperties.id);
        }
        if (tabProperties.url) {
            tabEl.setAttribute('data-tab-url', tabProperties.url);
        }

        var urlEl = tabEl.querySelector('.chrome-tab-url');
        urlEl.setAttribute('hidden', '');
        
    };
    ChromeTabs.prototype.cleanUpPreviouslyDraggedTabs = function () {
        this.tabEls.forEach(function (tabEl) {
            return tabEl.classList.remove("chrome-tab-was-just-dragged");
        });
    };
    ChromeTabs.prototype.setupDraggabilly = function () {
        var _this = this;
        var tabEls = this.tabEls;
        var tabPositions = this.tabPositions;
        if (this.isDragging) {
            this.isDragging = false;
            this.el.classList.remove("chrome-tabs-is-sorting");
            this.draggabillyDragging.element.classList.remove("chrome-tab-is-dragging");
            this.draggabillyDragging.element.style.transform = "";
            this.draggabillyDragging.dragEnd();
            this.draggabillyDragging.isDragging = false;
            this.draggabillyDragging.positionDrag = noop; // Prevent Draggabilly from updating tabEl.style.transform in later frames
            this.draggabillyDragging.destroy();
            this.draggabillyDragging = null;
        }
        this.draggabillies.forEach(function (d) { return d.destroy(); });
        tabEls.forEach(function (tabEl, originalIndex) {
            var originalTabPositionX = tabPositions[originalIndex];
            var draggabilly = new draggabilly_1.default(tabEl, {
                axis: "x",
                handle: ".chrome-tab-drag-handle",
                containment: _this.tabContentEl,
            });
            _this.draggabillies.push(draggabilly);
            draggabilly.on("pointerDown", function (_) {
                _this.emit("tabClick", { tabEl: tabEl });
                // this.setCurrentTab(tabEl);
            });
            draggabilly.on("dragStart", function (_) {
                _this.isDragging = true;
                _this.draggabillyDragging = draggabilly;
                tabEl.classList.add("chrome-tab-is-dragging");
                _this.el.classList.add("chrome-tabs-is-sorting");
                _this.emit("dragStart", {});
            });
            draggabilly.on("dragEnd", function (_) {
                _this.isDragging = false;
                var finalTranslateX = parseFloat(tabEl.style.left);
                tabEl.style.transform = "translate3d(0, 0, 0)";
                _this.emit("dragEnd", {});
                // Animate dragged tab back into its place
                requestAnimationFrame(function (_) {
                    tabEl.style.left = "0";
                    tabEl.style.transform = "translate3d(" + finalTranslateX + "px, 0, 0)";
                    requestAnimationFrame(function (_) {
                        tabEl.classList.remove("chrome-tab-is-dragging");
                        _this.el.classList.remove("chrome-tabs-is-sorting");
                        tabEl.classList.add("chrome-tab-was-just-dragged");
                        requestAnimationFrame(function (_) {
                            tabEl.style.transform = "";
                            _this.layoutTabs();
                            _this.setupDraggabilly();
                        });
                    });
                });
            });
            draggabilly.on("dragMove", function (event, pointer, moveVector) {
                // Current index be computed within the event since it can change during the dragMove
                var tabEls = _this.tabEls;
                var currentIndex = tabEls.indexOf(tabEl);
                var currentTabPositionX = originalTabPositionX + moveVector.x;
                var destinationIndexTarget = closest(currentTabPositionX, tabPositions);
                var destinationIndex = Math.max(0, Math.min(tabEls.length, destinationIndexTarget));
                if (currentIndex !== destinationIndex) {
                    _this.animateTabMove(tabEl, currentIndex, destinationIndex);
                }
            });
        });
    };
    ChromeTabs.prototype.animateTabMove = function (tabEl, originIndex, destinationIndex) {
        if (destinationIndex < originIndex) {
            tabEl.parentNode.insertBefore(tabEl, this.tabEls[destinationIndex]);
        }
        else {
            tabEl.parentNode.insertBefore(tabEl, this.tabEls[destinationIndex + 1]);
        }
        this.emit("tabReorder", { tabEl: tabEl, originIndex: originIndex, destinationIndex: destinationIndex });
        this.layoutTabs();
    };
    return ChromeTabs;
}());
exports.default = ChromeTabs;
