import {useState} from 'react';
import { useChromeTabs } from "../dist/hooks";
import '../css/chrome-tabs.css';

function Tab() {
  const [tabs, setTabs] = useState([]);
  const { ChromeTabs, ChromeTabsPages, addTab, updateTab, activeTab ,removeTab } = useChromeTabs({
    onTabActivated: (tabId) => {
      console.log('active:', tabId);
      activeTab(tabId);
    },
    onTabReorder: (tabId, fromIndex, toIndex) => {},
    onTabClosed: (tabId) => {
        removeTab(tabId);
    },
  });
  const ChromeTabsPagesStyle = {
    height: '50vw'
  };
  return (
    <div>
      <ChromeTabs />
      <ChromeTabsPages style={ChromeTabsPagesStyle} />
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