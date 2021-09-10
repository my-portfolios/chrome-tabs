"use strict";
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
exports.Tabs = void 0;
var react_1 = __importStar(require("react"));
var hooks_1 = require("./hooks");
var lodash_isequal_1 = __importDefault(require("lodash.isequal"));
function Tabs(_a) {
    var tabs = _a.tabs, onTabActivated = _a.onTabActivated, onTabClosed = _a.onTabClosed, onTabReorder = _a.onTabReorder, onContextMenu = _a.onContextMenu;
    var tabsRef = react_1.useRef([]);
    var moveIndex = react_1.useRef({ tabId: "", fromIndex: -1, toIndex: -1 });
    var handleTabReorder = react_1.useCallback(function (tabId, fromIndex, toIndex) {
        var dest = tabsRef.current.splice(fromIndex, 1)[0];
        tabsRef.current.splice(toIndex, 0, dest);
        var beforeFromIndex = moveIndex.current.fromIndex;
        moveIndex.current = {
            tabId: tabId,
            fromIndex: beforeFromIndex > -1 ? beforeFromIndex : fromIndex,
            toIndex: toIndex,
        };
    }, []);
    var handleDragEnd = react_1.useCallback(function () {
        var _a = moveIndex.current, tabId = _a.tabId, fromIndex = _a.fromIndex, toIndex = _a.toIndex;
        if (fromIndex > -1) {
            onTabReorder === null || onTabReorder === void 0 ? void 0 : onTabReorder(tabId, fromIndex, toIndex);
        }
        moveIndex.current = {
            tabId: "",
            fromIndex: -1,
            toIndex: -1,
        };
    }, [onTabReorder]);
    var _b = hooks_1.useChromeTabs({
        onTabClosed: onTabClosed,
        onTabActivated: onTabActivated,
        onContextMenu: onContextMenu,
        onDragEnd: handleDragEnd,
        onTabReorder: handleTabReorder,
    }), ChromeTabs = _b.ChromeTabs, addTab = _b.addTab, activeTab = _b.activeTab, removeTab = _b.removeTab, updateTab = _b.updateTab, ref = _b.ref;
    react_1.useEffect(function () {
        var _a;
        if (!lodash_isequal_1.default(tabsRef.current, tabs)) {
            var retainTabs = tabsRef.current.slice(tabs.length);
            retainTabs.forEach(function (tab) {
                removeTab(tab.id);
            });
            var elements_1 = ((_a = ref.current) === null || _a === void 0 ? void 0 : _a.tabEls) || [];
            tabs.forEach(function (tab, index) {
                var _a;
                var currentTab = tabsRef.current[index];
                if (!currentTab) {
                    addTab(tab);
                }
                else {
                    if (!lodash_isequal_1.default(tab, currentTab)) {
                        var ele = elements_1[index];
                        (_a = ref.current) === null || _a === void 0 ? void 0 : _a.updateTab(ele, tab);
                    }
                }
            });
            tabs.forEach(function (tab) {
                if (tab.active) {
                    activeTab(tab.id);
                }
            });
        }
        tabsRef.current = tabs;
    }, [tabs]);
    return react_1.default.createElement(ChromeTabs, null);
}
exports.Tabs = Tabs;
