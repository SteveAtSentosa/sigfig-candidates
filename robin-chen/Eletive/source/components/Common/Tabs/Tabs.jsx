import React from 'react';
import styled from 'styled-components';

import * as Own from './Tabs.Components';

const Tabs = ({ className, tabs, onChange, selectedTabId, actions }) => (
  <Own.Container className={className}>
    {tabs.map(tab => (
      <Own.Tab
        key={tab.id}
        selected={tab.id === selectedTabId}
        data-tab-id={tab.id}
        onClick={() => onChange(tab.id)}
      >
        { tab.icon && <Own.Icon source={tab.icon} /> }
        <span>{tab.title}</span>
      </Own.Tab>
    ))}
    {actions &&
    <Own.ActionContainer>
      {actions}
    </Own.ActionContainer>
    }
  </Own.Container>
);

const StyledTabs = styled(Tabs)``;

export { StyledTabs as Tabs };
