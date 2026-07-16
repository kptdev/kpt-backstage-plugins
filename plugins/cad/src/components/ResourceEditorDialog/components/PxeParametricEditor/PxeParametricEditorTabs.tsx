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

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { FC, SyntheticEvent, useState } from 'react';
import { PxeConfigurationTab } from './types/PxeConfiguration.types';
import { PxeParametricEditorNodeList } from './PxeParametricEditorNodeList';
import { PXE_COLOR_ACCENT, PXE_COLOR_RAIL } from './PxeSharedStyles';
import { css } from '@emotion/css';
import { useTheme } from '@mui/material/styles';

type PxeParametricEditorTabsProps = {
  readonly tabs: readonly PxeConfigurationTab[];
};

export const PxeParametricEditorTabs: FC<PxeParametricEditorTabsProps> = ({ tabs }) => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const classes = useStyles();
  return (
    <div>
      <Tabs
        className={classes.tabs}
        value={value}
        onChange={handleChange}
        TabIndicatorProps={{ className: classes.indicator }}
      >
        {tabs.map(({ name }, index) => (
          <Tab className={`${classes.tab} ${value === index ? classes.tabSelected : ''}`} key={index} label={name} />
        ))}
      </Tabs>
      {tabs.map(({ entries }, index) => (
        <div key={index} hidden={value !== index}>
          <PxeParametricEditorNodeList entries={entries} isInRosterItem={false} />
        </div>
      ))}
    </div>
  );
};

const useStyles = () => {
  const theme = useTheme();
  return {
    tabs: css({
      marginBottom: '24px',
    }),
    indicator: css({
      backgroundColor: PXE_COLOR_ACCENT,
    }),
    tab: css({
      borderBottom: `solid 1px ${PXE_COLOR_RAIL}`,
      fontWeight: 600,
      letterSpacing: '0.5px',
      color: theme.palette.text.primary,
      opacity: 1,
    }),
    tabSelected: css({
      color: PXE_COLOR_ACCENT,
    }),
  };
};
