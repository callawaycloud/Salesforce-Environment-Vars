import * as React from 'react';
import { EnvVar } from '@src/types';
import { Button, Modal, Input, Tooltip } from 'antd';

export interface NotesModalProps {
  item: EnvVar;
  onSaveNotes: (notes: string) => void;
}

export interface NotesModalState {
  visible: boolean;
  notes: string;
}

export class NotesModal extends React.Component<NotesModalProps, NotesModalState> {
  constructor(props: NotesModalProps) {
    super(props);
    console.log(props);
    this.state = {
      visible: false,
      notes: props.item.notes,
    };
  }

  private handleOk = () => {
    this.props.onSaveNotes(this.state.notes);
    this.setState({ visible: false });
  }

  private handleCancel = () => {
    this.setState({ visible: false });
  }

  public render() {
    return (
      <span>
        <Button
          title='Info'
          icon='info'
          onClick={() => this.setState({ visible: true })}
        >
          Edit Notes
        </Button>
        <Modal
          title={`${this.props.item.key} Notes`}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          zIndex={10000}
        >
          <Input.TextArea
            placeholder='Where/How it is used, valid input, etc...'
            autosize={{ minRows: 3, maxRows: 20 }}
            value={this.state.notes}
            onChange={(e) => this.setState({ notes: e.target.value })}
          />
        </Modal>
      </span>
    );
  }
}
