/**
 * Copyright 2024 The kpt Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import MUITab from '@mui/material/Tab';
import MUITabs from '@mui/material/Tabs';
import { ReactElement, ReactNode, SyntheticEvent, useState } from 'react';
import { css } from '@emotion/css';
import { useTheme } from '@mui/material/styles';

type TabsProps = {
  tabs: readonly {
    readonly label?: string;
    readonly icon?: ReactElement;
    readonly content: ReactNode;
  }[];
};

const useStyles = () => { const theme = useTheme() as any; return ({
  tabs: css({
    backgroundColor: theme.palette.background.paper,
  }),
  tabsIndicator: css({
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: theme.palette.tabbar?.indicator ?? theme.palette.primary.main,
    height: theme.spacing(0.5),
  }),
  tab: css({
    width: '130px',
    minWidth: '130px',
    height: '64px',
    marginLeft: '24px',
    marginRight: '24px',
    fontWeight: 'bold',
    fontSize: theme.typography.pxToRem(13),
    color: theme.palette.textSubtle ?? theme.palette.text.secondary,
  }),
  content: css({
    padding: '24px',
  }),
}); };

export const Tabs = (props: TabsProps) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <MUITabs className={classes.tabs} TabIndicatorProps={{ className: classes.tabsIndicator }} value={value} onChange={handleChange}>
        {props.tabs.map(({ label, icon }, index) => (
          <MUITab key={index} className={classes.tab} label={label ?? ''} icon={icon} />
        ))}
      </MUITabs>
      {props.tabs.map(({ content }, index) => (
        <div className={classes.content} key={index} hidden={value !== index}>
          {content}
        </div>
      ))}
    </div>
  );
};
