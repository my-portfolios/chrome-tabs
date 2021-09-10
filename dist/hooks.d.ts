import React from "react";
import ChromeTabsClz, { TabProperties } from "./chrome-tabs";
export declare type Listeners = {
    onTabActivated?: (tabId: string) => void;
    onTabClosed?: (tabId: string) => void;
    onTabReorder?: (tabId: string, fromIdex: number, toIndex: number) => void;
    onDragBegin?: () => void;
    onDragEnd?: () => void;
    onContextMenu?: (tabId: string, event: MouseEvent) => void;
};
export declare function useChromeTabs(listeners: Listeners): {
    ChromeTabs: () => JSX.Element;
    ref: React.MutableRefObject<ChromeTabsClz | null>;
    addTab: (tab: TabProperties) => void;
    updateTab: (tabId: string, tab: TabProperties) => void;
    removeTab: (tabId: string) => void;
    activeTab: (tabId: string) => void;
};
