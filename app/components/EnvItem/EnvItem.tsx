import * as React from 'react';
import { Input, Button, Icon, Tooltip, Popover, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { EnvVar, DataType } from '@src/types';
import { NotesModal } from './NotesModal';
import { DataTypeSelect } from '../DataTypeSelect';
import { DeleteButton } from './DeleteButton';
import { MoreActions, CopyCode } from './MoreActions';
import { Editor } from './Editor';
import { validateType, getApex, getFormula } from '@src/lib/util';
const InputGroup = Input.Group;

export interface EnvVarItemProps {
  item: EnvVar;
  onRemove: (item: EnvVar) => void;
  onUpdate: (item: EnvVar, field: keyof EnvVar, value: string) => void;
  onSave: (item: EnvVar) => void;
  onDragStart: (e: any, item: EnvVar) => void;
  onDragOver: (draggedOver: EnvVar) => void;
  onDragEnd: () => void;
}

export interface EnvVarItemState {
  editing: boolean;
  actionsVisible: boolean;
}

export class EnvVarItem extends React.Component<EnvVarItemProps, EnvVarItemState> {

  constructor(props: EnvVarItemProps) {
    super(props);
    this.state = {
      editing: false,
      actionsVisible: false,
    };
  }

  private copySuccess = () => {
    message.success('copied to clipboard');
    this.setState({ actionsVisible: false })
  };

  private onNotesSave = (notes: string) => {
    this.props.onUpdate(this.props.item, 'notes', notes);
    this.setState({ actionsVisible: false });
  }

  private editFinished = () => {
    let item = this.props.item;
    let val = item.value;
    if (validateType(item.dataType, item.value) && item.value &&
      (item.dataType === 'Map<String,String>' || item.dataType === 'String[]')) {
      val = JSON.stringify(JSON.parse(val), null, 1)
      this.props.onUpdate(item, 'value', val);
    }
    this.setState({ editing: false });
  }

  public render() {
    let { item } = this.props;

    const typeError = !validateType(item.dataType, item.value);
    const keyError = item.key && item.key.indexOf(' ') > -1; // [TODO] Better validation

    const keyStyle: React.CSSProperties = { width: '20%' };
    if (keyError) {
      keyStyle.color = 'red';
    }

    let moreActions = (
      <MoreActions
        onVisibleChange={(v) => { this.setState({ actionsVisible: v }) }}
        visible={this.state.actionsVisible}
      >
        <NotesModal
          item={item}
          onSaveNotes={this.onNotesSave}
        />
        <CopyCode
          text="Copy Apex"
          icon='code'
          onCopy={this.copySuccess}
          codeFunc={getApex}
          item={item}
        />
        <CopyCode
          text="Copy Formula"
          icon='number'
          onCopy={this.copySuccess}
          codeFunc={getFormula}
          item={item}
        />
        <DeleteButton item={item} onRemove={this.props.onRemove} />
      </MoreActions>
    )

    const canSave = item.key && item.hasChanges && (!typeError && !keyError);

    return (
      <div style={{ marginTop: 5 }} onDragOver={() => this.props.onDragOver(item)}>
        <InputGroup compact={true}>
          <Tooltip title='Drag -> Drop to change grouping'>
            <Button
              draggable={true}
              onDragStart={(e: any) => this.props.onDragStart(e, item)}
              onDragEnd={this.props.onDragEnd}
              icon='drag'
            />
          </Tooltip>

          <Input
            style={keyStyle}
            onChange={(e) => { this.props.onUpdate(item, 'key', e.target.value); }}
            placeholder='KEY used to access this var.  Once set, cannot be changed'
            disabled={!item.localOnly}
            value={item.key}
            addonAfter={moreActions}
          />
          <DataTypeSelect
            item={item}
            onUpdate={(e) => this.props.onUpdate(item, 'dataType', e)}
          />

          <Editor
            item={item}
            valueError={typeError}
            editing={this.state.editing}
            onUpdate={(val) => { this.props.onUpdate(item, 'value', val); }}
            onEditFinished={this.editFinished}
            onEditStart={() => { this.setState({ editing: true }) }}
          />

          {canSave && <Button type='primary' icon='save' onClick={() => { this.props.onSave(item); }} />}
          {item.localOnly && <Button type='danger' icon='close' onClick={() => { this.props.onRemove(item); }} />}
        </InputGroup>

      </div>
    );
  }
}


