import * as React from 'react';
import { Popconfirm, Button } from 'antd';
import { QuestionCircleOutlined, DeleteOutlined } from '@ant-design/icons';

interface DeleteButtonProps {
  item: EnvVar;
  onRemove: () => void;
}

export const DeleteButton: React.FunctionComponent<DeleteButtonProps> = props => {
  if (!props.item.localOnly) {
    const del = (
      <Popconfirm
        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        title='Are you sure？This Cannot be undone!!!'
        okButtonProps={{ danger: true }}
        okText='DELETE'
        cancelText='No'
        onConfirm={() => {
          props.onRemove();
        }}
      >
        <Button size='small' danger={true} icon={<DeleteOutlined />}>
          Delete
        </Button>
      </Popconfirm>
    );
    return del;
  }
  return null;
};
