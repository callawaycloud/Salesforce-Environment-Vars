import * as React from 'react';
import { EnvVar } from '@src/types';
import TextArea from 'antd/lib/input/TextArea';
import { Input, Tooltip, Icon } from 'antd';

interface EditorProps {
  editing: boolean;
  item: EnvVar;
  onUpdate: (val: string) => void;
  valueError: boolean;
  onEditFinished: () => void
  onEditStart: () => void
}

export const Editor: React.FunctionComponent<EditorProps> = (props) => {
  let tip: string | JSX.Element = props.item.notes;
  if (props.item.value.length > 255) {
    tip = (
      <div>
        {tip}
        <div >
          <Icon style={{ color: 'red' }} type='warning' /> Length Exceeds 255 characters!  The entire value cannot be used in a formula.
        </div>
      </div>
    );
  }

  const valueStyle: React.CSSProperties = { width: '40%' };
  if (props.valueError) {
    valueStyle.color = 'red';
  }
  const editor = props.editing ? (
    <TextArea
      autosize={true}
      autoFocus={true}
      placeholder='Value'
      style={valueStyle}
      value={props.item.value}
      onBlur={props.onEditFinished}
      onChange={(e)=>props.onUpdate(e.target.value)}
      // onChange={(e) => { props.onUpdate(item, 'value', e.target.value); }}
    />
  ) :
  <Input
    style={valueStyle}
    value={props.item.value}
    placeholder='Value'
    onFocus={props.onEditStart}
  />
  return (
    <Tooltip overlayStyle={{ width: 300 }} title={tip}>
      {editor}
    </Tooltip>
  )
}
