import * as React from 'react';
import { Switch, Popover } from 'antd';
import { EyeInvisibleFilled, EyeOutlined } from '@ant-design/icons';

export interface SecretsEnabledProps {
  enabled: boolean;
  style?: React.CSSProperties;
}

export const SecretsEnabled: React.FunctionComponent<SecretsEnabledProps> = props => {
  let body: JSX.Element = (
    <div style={props.style}>
      Secrets Enabled:
      <Switch checked={props.enabled} checkedChildren={<EyeInvisibleFilled />} unCheckedChildren={<EyeOutlined />} />
    </div>
  );
  if (!props.enabled) {
    const installMessage = (
      <div>
        To Enable "Secret Vars" you must install the
        <a href='https://github.com/callawaycloud/Salesforce-Environment-Vars/blob/master/docs/ENABLE-SECRETS.md'>
          env-vars-encypt package
        </a>
      </div>
    );
    body = <Popover content={installMessage}>{body}</Popover>;
  }

  return body;
};
