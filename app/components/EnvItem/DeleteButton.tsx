import * as React from 'react';
import { EnvVar } from "@src/types";
import { Popconfirm, Icon, Button } from "antd";

interface DeleteButtonProps {
  item: EnvVar;
  onRemove: (item: EnvVar) => void;
}

export const DeleteButton: React.FunctionComponent<DeleteButtonProps> = (props) => {
  if (!props.item.localOnly) {
    const del = (
      <Popconfirm
        icon={<Icon type='question-circle-o' style={{ color: 'red' }} />}
        title='Are you sure？'
        okType='danger'
        okText='DELETE'
        cancelText='No'
        onConfirm={() => { props.onRemove(props.item); }} >
        <Button type='danger' icon='delete' >Delete</Button>
      </Popconfirm>
    );
    return del;
  }
  return null;
}
