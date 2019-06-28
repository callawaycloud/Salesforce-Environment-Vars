import * as React from 'react';
import { Switch, Popover, Icon } from 'antd';

export interface SecretsEnabledProps {
  enabled: boolean;
  style?: React.CSSProperties
}

export const SecretsEnabled: React.FunctionComponent<SecretsEnabledProps>  = (props) => {
  let body: JSX.Element = (
    <div style={props.style}>
          Secrets Enabled:
          <Switch
            checked={props.enabled}
            checkedChildren={<Icon type="eye-invisible" />}
            unCheckedChildren={<Icon type="eye" />}
          />
    </div>
  )
  if(!props.enabled){
    const installMessage = (
      <div>To Enable "Secret Vars" you must install the <a href={'/'}>env-vars-encypt package</a></div>
    )
    body = (
      <Popover
       content={installMessage}
      >
        {body}
     </Popover>
    )
  }

  return body;
}
