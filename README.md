# React Chrome Tabs

## Usage

1. use hooks
   
```js
import {useState} from 'react';
import { Tabs } from '@bhyoon1110/react-chrome-tabs';
import '../css/chrome-tabs.css';

function Tab() {
  const [tabs, setTabs] = useState([]);
  const { ChromeTabs, addTab, updateTab, activeTab ,removeTab } = useChromeTabs({
    onTabActivated: (tabId) => {
      console.log('active:', tabId);
      activeTab(tabId);
    },
    onTabReorder: (tabId, fromIndex, toIndex) => {},
    onTabClosed: (tabId) => {
        removeTab(tabId);
    },
  });
  return (
    <div>
      <ChromeTabs />
      <button
        onClick={() =>
          addTab({ id: `id-${Date.now()}`, title: `새탭`, favicon: false, url:'a.html' })
        }
      >
        탭추가
      </button>
    </div>
  );
}
export default Tab;
```

2. use component

```js
import { Tabs } from '@bhyoon1110/react-chrome-tabs';
<Tabs tabs={tabs} onTabActivated={}>
```
