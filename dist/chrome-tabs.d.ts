import Draggabilly from "draggabilly";
declare const defaultTapProperties: {
    title: string;
    favicon: boolean;
    url: string;
};
export declare type TabProperties = typeof defaultTapProperties & {
    id: string;
    active?: boolean;
    favicon?: boolean | string;
};
declare class ChromeTabs {
    el: HTMLElement;
    styleEl: HTMLStyleElement;
    instanceId?: number;
    draggabillies: Draggabilly[];
    isDragging: any;
    draggabillyDragging: any;
    constructor();
    init(el: HTMLElement): void;
    emit(eventName: string, data: any): void;
    setupCustomProperties(): void;
    setupStyleEl(): void;
    setupEvents(): void;
    get tabEls(): any[];
    get tabContentEl(): Element;
    get tabContentWidths(): number[];
    get tabContentPositions(): number[];
    get tabPositions(): number[];
    layoutTabs(): void;
    createNewTabEl(): Element | null;
    addTab(tabProperties?: TabProperties, { animate, background }?: {
        animate?: boolean | undefined;
        background?: boolean | undefined;
    }): HTMLElement;
    setTabCloseEventListener(tabEl: HTMLElement): void;
    get activeTabEl(): Element | null;
    hasActiveTab(): boolean;
    setCurrentTab(tabEl: HTMLElement): void;
    removeTab(tabEl: HTMLElement): void;
    updateTab(tabEl: HTMLElement, tabProperties: TabProperties): void;
    cleanUpPreviouslyDraggedTabs(): void;
    setupDraggabilly(): void;
    animateTabMove(tabEl: HTMLElement, originIndex: number, destinationIndex: number): void;
}
export default ChromeTabs;
