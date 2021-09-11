"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChromeTabs = void 0;
var react_1 = __importStar(require("react"));
var chrome_tabs_1 = __importDefault(require("./chrome-tabs"));
var ChromeTabsWrapper = react_1.forwardRef(function (props, ref) {
    return (
        react_1.default.createElement(
            "div", 
            { ref: ref, className: "chrome-tabs", style: { "--tab-content-margin": "9px" } },
            react_1.default.createElement("div", { className: "chrome-tabs-content" })
        )
    );
});
var ChromeTabsPageWrapper = react_1.forwardRef(function (props, ref) {
    return (
        react_1.default.createElement(
            "div", 
            { className: "chrome-tabs-pages", style: { "--tab-content-margin": "9px" } },
            react_1.default.createElement("div", { className: "chrome-tabs-content-pages" })
        )
    );
});
function useChromeTabs(listeners) {
    var ref = react_1.useRef(null);
    var chromeTabsRef = react_1.useRef(null);
    react_1.useEffect(function () {
        var chromeTabs = new chrome_tabs_1.default();
        chromeTabsRef.current = chromeTabs;
        chromeTabs.init(ref.current);
    }, []);
    // activated
    react_1.useEffect(function () {
        var _a;
        var listener = function (_a) {
            var _b;
            var detail = _a.detail;
            var tabEle = detail.tabEl;
            var tabId = tabEle.getAttribute("data-tab-id");
            (_b = listeners.onTabActivated) === null || _b === void 0 ? void 0 : _b.call(listeners, tabId);
        };
        var ele = (_a = chromeTabsRef.current) === null || _a === void 0 ? void 0 : _a.el;
        ele === null || ele === void 0 ? void 0 : ele.addEventListener("tabClick", listener);
        return function () {
            ele === null || ele === void 0 ? void 0 : ele.removeEventListener("tabClick", listener);
        };
    }, [listeners.onTabActivated]);
    react_1.useEffect(function () {
        var _a;
        var ele = (_a = chromeTabsRef.current) === null || _a === void 0 ? void 0 : _a.el;
        var listener = function (_a) {
            var _b;
            var detail = _a.detail;
            var tabEle = detail.tabEl, originIndex = detail.originIndex, destinationIndex = detail.destinationIndex;
            var tabId = tabEle.getAttribute("data-tab-id");
            (_b = listeners.onTabReorder) === null || _b === void 0 ? void 0 : _b.call(listeners, tabId, originIndex, destinationIndex);
        };
        ele === null || ele === void 0 ? void 0 : ele.addEventListener("tabReorder", listener);
        return function () {
            ele === null || ele === void 0 ? void 0 : ele.removeEventListener("tabReorder", listener);
        };
    }, [listeners.onTabReorder]);
    react_1.useEffect(function () {
        var _a;
        var ele = (_a = chromeTabsRef.current) === null || _a === void 0 ? void 0 : _a.el;
        var listener = function (_a) {
            var _b;
            var detail = _a.detail;
            var tabEle = detail.tabEl;
            var tabId = tabEle.getAttribute("data-tab-id");
            (_b = listeners.onTabClosed) === null || _b === void 0 ? void 0 : _b.call(listeners, tabId);
        };
        ele === null || ele === void 0 ? void 0 : ele.addEventListener("tabClose", listener);
        return function () {
            ele === null || ele === void 0 ? void 0 : ele.removeEventListener("tabClose", listener);
        };
    }, [listeners.onTabClosed]);
    react_1.useEffect(function () {
        var _a;
        var listener = function () {
            var _a;
            (_a = listeners.onDragBegin) === null || _a === void 0 ? void 0 : _a.call(listeners);
        };
        var ele = (_a = chromeTabsRef.current) === null || _a === void 0 ? void 0 : _a.el;
        ele === null || ele === void 0 ? void 0 : ele.addEventListener("dragBegin", listener);
        return function () {
            ele === null || ele === void 0 ? void 0 : ele.removeEventListener("dragBegin", listener);
        };
    }, [listeners.onDragBegin]);
    react_1.useEffect(function () {
        var _a;
        var ele = (_a = chromeTabsRef.current) === null || _a === void 0 ? void 0 : _a.el;
        var listener = function (_a) {
            var _b;
            var detail = _a.detail;
            var tabEle = detail.tabEl;
            var tabId = tabEle.getAttribute("data-tab-id");
            (_b = listeners.onContextMenu) === null || _b === void 0 ? void 0 : _b.call(listeners, tabId, detail.event);
        };
        ele === null || ele === void 0 ? void 0 : ele.addEventListener("tab-contextmenu", listener);
        return function () {
            ele === null || ele === void 0 ? void 0 : ele.removeEventListener("tab-contextmenu", listener);
        };
    }, [listeners.onContextMenu]);
    react_1.useEffect(function () {
        var _a;
        var listener = function () {
            var _a;
            (_a = listeners.onDragEnd) === null || _a === void 0 ? void 0 : _a.call(listeners);
        };
        var ele = (_a = chromeTabsRef.current) === null || _a === void 0 ? void 0 : _a.el;
        ele === null || ele === void 0 ? void 0 : ele.addEventListener("dragEnd", listener);
        return function () {
            ele === null || ele === void 0 ? void 0 : ele.removeEventListener("dragEnd", listener);
        };
    }, [listeners.onDragEnd]);
    var addTab = react_1.useCallback(function (tab) {
        var _a;
        (_a = chromeTabsRef.current) === null || _a === void 0 ? void 0 : _a.addTab(tab);
    }, []);
    var removeTab = react_1.useCallback(function (tabId) {
        var _a, _b;
        var ele = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.querySelector("[data-tab-id=\"" + tabId + "\"]");
        if (ele) {
            (_b = chromeTabsRef.current) === null || _b === void 0 ? void 0 : _b.removeTab(ele);
        }
    }, []);
    var activeTab = react_1.useCallback(function (tabId) {
        var _a, _b, _c;
        var ele = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.querySelector("[data-tab-id=\"" + tabId + "\"]");
        if (ele !== ((_b = chromeTabsRef.current) === null || _b === void 0 ? void 0 : _b.activeTabEl)) {
            (_c = chromeTabsRef.current) === null || _c === void 0 ? void 0 : _c.setCurrentTab(ele);
        }
    }, []);
    var updateTab = react_1.useCallback(function (tabId, tab) {
        var _a, _b, _c;
        var ele = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.querySelector("[data-tab-id=\"" + tabId + "\"]");
        if (ele) {
            (_b = chromeTabsRef.current) === null || _b === void 0 ? void 0 : _b.updateTab(ele, __assign({}, tab));
        }
        else {
            (_c = chromeTabsRef.current) === null || _c === void 0 ? void 0 : _c.addTab(tab);
        }
    }, []);
    var ChromeTabs = react_1.useCallback(function () {
        return react_1.default.createElement(ChromeTabsWrapper, { ref: ref });
    }, []);
    var ChromeTabsPages = react_1.useCallback(function () {
        return react_1.default.createElement(ChromeTabsPageWrapper, { ref: ref });
    }, []);
    return {
        ChromeTabs: ChromeTabs,
        ChromeTabsPages: ChromeTabsPages,
        ref: chromeTabsRef,
        addTab: addTab,
        updateTab: updateTab,
        removeTab: removeTab,
        activeTab: activeTab,
    };
}
exports.useChromeTabs = useChromeTabs;
