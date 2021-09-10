/// <reference types="react" />
import { Listeners } from "./hooks";
import { TabProperties } from "./chrome-tabs";
export declare type TabsProps = Listeners & {
    tabs: TabProperties[];
};
export declare function Tabs({ tabs, onTabActivated, onTabClosed, onTabReorder, onContextMenu, }: TabsProps): JSX.Element;
