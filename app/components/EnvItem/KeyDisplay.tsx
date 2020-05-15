import * as React from 'react';
import { Tag } from 'antd';
import { copy } from '@src/lib/util';

interface KeyDisplayProps {
  item: EnvVar;
}

export const KeyDisplay: React.FunctionComponent<KeyDisplayProps> = props => {
  return (
    <Tag style={{ fontSize: 16 }} color='blue' onClick={() => copy(`${window.location}?key=${props.item.key}`, 'Key Link copied to clipboard')}>
      {props.item.key}
    </Tag>
  );
};
