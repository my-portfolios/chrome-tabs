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
  