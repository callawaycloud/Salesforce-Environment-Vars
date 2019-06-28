import * as React from 'react';
import { Button, Popover, Icon } from 'antd';
import { EnvVar } from '@src/types';

interface MoreActionsProps {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void
}

export const MoreActions: React.FunctionComponent<MoreActionsProps> = (props) => {

  const actions = (
    <Button.Group>
      {props.children}
    </Button.Group>
  );
  return (
    <Popover
      visible={props.visible}
      onVisibleChange={props.onVisibleChange}
      content={actions}
      trigger='click'
      title='Actions'
    >
      <Icon type='tool' onClick={()=>props.onVisibleChange(true)} />
    </Popover>
  );
};

interface CopyCodeProps {
  item: EnvVar;
  onCopy: () => void;
  codeFunc: (item: EnvVar) => string;
  icon: 'code' | 'number'
  text: string
  disabled?: boolean;
}

export const CopyCode: React.FunctionComponent<CopyCodeProps> = (props) => {
  const copy = () => {
    let apex = props.codeFunc(props.item);
    navigator.clipboard.writeText(apex);
    props.onCopy();
  }
  return <Button disabled={props.disabled} icon={props.icon} onClick={copy}>{props.text}</Button>
}


