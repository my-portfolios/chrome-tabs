# React Chrome Tabs

## Install

```shell
npm i @bhyoon1110/react-chrome-tabs
```

## Usage

1. use hooks
   
```js
function Tab() {
  const [tabs, setTabs] = useState([]);
  const { ChromeTabs, ChromeTabsPages, addTab, updateTab, activeTab ,removeTab } = useChromeTabs({
    onTabActivated: (tabId) => {
      activeTab(tabId);
    },
    onTabReorder: (tabId, fromIndex, toIndex) => {},
    onTabClosed: (tabId) => {
        removeTab(tabId);
    },
  });
  const ChromeTabsPagesStyle = {
    height: '30vw'
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
```

2. use component

```js
import { Tabs } from '@bhyoon1110/react-chrome-tabs';
<Tabs tabs={tabs} onTabActivated={}>
```

3. make .storybook folder on root and add two files below

.storybook/main.js
```js
module.exports = {
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app"
  ]
}
```

.storybook/preview.js
```js
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
```

4. make stoies folder and add two files below

stories/Test.tsx
```js
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
```

stories/Test.stories.tsx
```js
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Tab from './Test';

export default {
    title: 'Example/Tab',
    component: Tab,
} as ComponentMeta<typeof Tab>;
  
const Template: ComponentStory<typeof Tab> = (args) => <Tab />;
  
export const Basic = Template.bind({});
Basic.args = {
    
};
```

5. make public folder and add a.html file

public/a.html
```html
this is a.html file
```

6. modify package.json

add content
```json
"devDependencies": {
    "@babel/core": "^7.14.3",
    "@storybook/addon-actions": "^6.2.9",
    "@storybook/addon-essentials": "^6.2.9",
    "@storybook/addon-links": "^6.2.9",
    "@storybook/react": "^6.2.9",
    "@types/draggabilly": "^2.1.2",
    "@types/lodash.isequal": "^4.5.5",
    "@types/react": "^17.0.8",
    "babel-loader": "^8.2.2",
    "react": "17.0.2",
    "react-dom": "17.0.2"
  }

  "scripts": {
    "storybook": "start-storybook -s ./public -p 6006",
    "build-storybook": "build-storybook"
  }
  ```

7. yarn

8. yarn storybook