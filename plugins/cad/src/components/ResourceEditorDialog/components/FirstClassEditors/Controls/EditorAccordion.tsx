/**
 * Copyright 2022 Google LLC
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

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useEffect, useMemo, useRef } from 'react';
import { css } from '@emotion/css';
import { useTheme } from '@mui/material/styles';

export type AccordionState = [string | undefined, Dispatch<SetStateAction<string | undefined>>];

type EditorAccordionProps = {
  id: string;
  title: string;
  description?: string;
  state: AccordionState;
  children: ReactNode;
};

const useStyles = () => {
  const theme = useTheme();
  return {
    title: css({
      fontSize: theme.typography.pxToRem(15),
      width: '30%',
      flexShrink: 0,
    }),
    description: css({
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    }),
    accordionDetails: css({
      display: 'block',
      width: '100%',
      '& > *:not(:last-child)': {
        marginBottom: '12px',
      },
    }),
  };
};

export const EditorAccordion = ({ id, title, description, state, children, ...otherProps }: EditorAccordionProps) => {
  const classes = useStyles();
  const detailsRef = useRef<HTMLDivElement>(null);

  const [activeAccordion, setActiveAccordion] = state;
  const expanded = useMemo(() => activeAccordion === id, [activeAccordion, id]);

  const onChange = (_: ChangeEvent<{}>, newExpanded: boolean) => setActiveAccordion(newExpanded ? id : undefined);

  useEffect(() => {
    if (expanded && detailsRef.current) {
      setTimeout(
        () =>
          detailsRef.current?.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
          }),
        100,
      );
    }
  }, [expanded]);

  return (
    <Accordion {...otherProps} expanded={expanded} onChange={onChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.title}>{title}</Typography>
        <Typography className={classes.description}>{description}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className={classes.accordionDetails} ref={detailsRef}>
          {children}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
