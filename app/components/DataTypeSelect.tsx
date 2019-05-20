import * as React from 'react';
import { Select } from 'antd';
import { EnvVar } from '@src/types';

const Option = Select.Option;

interface DataTypeSelectProps {
  item: EnvVar;
  onUpdate: (val: string) => void;
}

export const DataTypeSelect: React.FunctionComponent<DataTypeSelectProps> = (props) => {
  return (
    <Select
      placeholder={'Data Type'}
      onChange={props.onUpdate}
      style={{ width: '15%' }}
      value={props.item.dataType}
    >
      <Option key='String'>String</Option>
      <Option key='Integer'>Integer</Option>
      <Option key='Decimal'>Decimal</Option>
      <Option key='Boolean'>Boolean</Option>
      <Option key='String[]'>String[]</Option>
      <Option key='Map<String,String>'>{'Map<String,String>'}</Option>
    </Select>
  );
};
