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

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import MaterialRadioGroup from '@mui/material/RadioGroup';
import { snakeCase } from 'lodash';
import { Fragment } from 'react';
import { css } from '@emotion/css';

export type RadioOption = {
  label: string;
  value: string;
  description?: string;
};

type RadioGroupProps = {
  label: string;
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
  helperText?: string;
};

const useStyles = () => ({
  optionDescription: css({
    marginBottom: '14px',
    marginLeft: '32px',
    marginTop: '0',
  }),
});

export const RadioGroup = ({ label, value, options, onChange, helperText }: RadioGroupProps) => {
  const classes = useStyles();

  const labelId = `label-${snakeCase(label)}`;

  return (
    <FormControl>
      <FormLabel id={labelId}>{label}</FormLabel>
      <FormHelperText>{helperText}</FormHelperText>
      <MaterialRadioGroup
        aria-labelledby={labelId}
        value={value}
        onChange={e => onChange((e.target as HTMLInputElement).value)}
      >
        {options.map(option => (
          <Fragment key={option.value}>
            <FormControlLabel value={option.value} control={<Radio color="primary" />} label={option.label} />

            {option.description && (
              <FormHelperText className={classes.optionDescription}>{option.description}</FormHelperText>
            )}
          </Fragment>
        ))}
      </MaterialRadioGroup>
    </FormControl>
  );
};
