import * as React from 'react';
import { Select } from 'antd';

const Option = Select.Option;

interface DataTypeSelectProps {
  item: EnvVar;
  onUpdate: (val: string) => void;
}

export const DataTypeSelect: React.FunctionComponent<DataTypeSelectProps> = props => {
  return (
    <Select placeholder={'Data Type'} onChange={props.onUpdate} style={{ width: 250 }} value={props.item.dataType}>
      <Option key='String' value='String'>
        String
      </Option>
      <Option key='Integer' value='Integer'>
        Integer
      </Option>
      <Option key='Decimal' value='Decimal'>
        Decimal
      </Option>
      <Option key='Boolean' value='Boolean'>
        Boolean
      </Option>
      <Option key='String[]' value='String[]'>
        String[]
      </Option>
      <Option key='Map<String,String>' value='Map<String,String>'>
        {'Map<String,String>'}
      </Option>
      <Option key='ANY' value='ANY'>
        {'ANY'}
      </Option>
    </Select>
  );
};
