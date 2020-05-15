import * as React from 'react';
import { Button, message, Tooltip } from 'antd';
import { CodeOutlined, FunctionOutlined } from '@ant-design/icons';
import { copy } from '@src/lib/util';

interface CopyCodeProps {
  item: EnvVar;
  onCopy: () => void;
  codeFunc: (item: EnvVar) => string;
  icon: 'code' | 'number';
  text: string;
  disabled?: boolean;
}

export const CopyCode: React.FunctionComponent<CopyCodeProps> = props => {
  const handleCopy = () => {
    let apex = props.codeFunc(props.item);
    copy(apex, 'copied to clipboard');
  };
  const icon = props.icon == 'code' ? <CodeOutlined /> : <FunctionOutlined />;
  return (
    <Tooltip title={props.icon === 'code' ? 'copy apex' : 'copy formula'}>
      <Button disabled={props.disabled} icon={icon} onClick={handleCopy}>
        {props.text}
      </Button>
    </Tooltip>
  );
};
