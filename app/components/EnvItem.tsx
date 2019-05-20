import * as React from 'react';
import { Input, Select, Button, Popconfirm, Icon, Tooltip, Popover, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { EnvVar, DataType } from '@src/types';
import { NotesModal } from './NotesModal';
const InputGroup = Input.Group;
const Option = Select.Option;

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

  private copyAction = (method: (item: EnvVar)=>string) => {
    navigator.clipboard.writeText(method(this.props.item));
    message.success('copied to clipboard');
    this.setState({actionsVisible: false})
  };

  private onNotesSave = (notes: string) => {
    this.props.onUpdate(this.props.item, 'notes', notes);
    this.setState({actionsVisible: false});
  }

  private editFinished = () => {
    let item = this.props.item;
    let val = item.value;
    if(this.validateType(item.dataType, item.value) && item.value &&
      (item.dataType === 'Map<String,String>' || item.dataType === 'String[]')){
        val = JSON.stringify(JSON.parse(val), null, 1)
        this.props.onUpdate(item, 'value', val);
    }
    this.setState({editing: false});
  }

  public render() {
    let { item } = this.props;

    const typeError = !this.validateType(item.dataType, item.value);
    const keyError = item.key && item.key.indexOf(' ') > -1; // [TODO] Better validation

    const keyStyle: React.CSSProperties = { width: '20%' };
    if (keyError) {
      keyStyle.color = 'red';
    }

    const valueStyle: React.CSSProperties = { width: '40%' };
    if (typeError) {
      valueStyle.color = 'red';
    }

    let tip: string | JSX.Element = item.notes;
    let moreActions = (
      <MoreActions onVisibleChange={(v)=>{this.setState({actionsVisible: v})}} visible={this.state.actionsVisible}>
        <NotesModal
        item={item}
        onSaveNotes={this.onNotesSave}
        />
        <Button icon='code' onClick={() => this.copyAction(getApex)}>Copy Apex</Button>
        <Button icon='number' onClick={() => this.copyAction(getFormula)}>Copy Formula</Button>
        <DeleteButton item={item} onRemove={this.props.onRemove} />
      </MoreActions>
    )

    if (item.value.length > 255) {
      tip = (
        <div>
          {tip}
          <div >
            <Icon style={{ color: 'red' }} type='warning' /> Length Exceeds 255 characters!  The entire value cannot be used in a formula.
          </div>
        </div>
      );
    }

    const canSave = item.key && item.hasChanges && (!typeError && !keyError);

    const editor = this.state.editing ? (
      <TextArea
        autosize={true}
        autoFocus={true}
        placeholder='Value'
        style={valueStyle}
        value={item.value}
        onBlur={this.editFinished}
        onChange={(e) => { this.props.onUpdate(item, 'value', e.target.value); }}
      />
    ) :
    <Input
      style={valueStyle}
      value={item.value}
      placeholder='Value'
      onFocus={() => this.setState({ editing: true })}
    />

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

          <Select
            placeholder={'Data Type'}
            onChange={(e) => { this.props.onUpdate(item, 'dataType', e); }}
            style={{ width: '15%' }}
            value={item.dataType}
          >
            <Option key='String'>String</Option>
            <Option key='Integer'>Integer</Option>
            <Option key='Decimal'>Decimal</Option>
            <Option key='Boolean'>Boolean</Option>
            <Option key='String[]'>String[]</Option>
            <Option key='Map<String,String>'>{'Map<String,String>'}</Option>
          </Select>
          <Tooltip overlayStyle={{ width: 300 }} title={tip}>
            {editor}
          </Tooltip>
          {canSave && <Button type='primary' icon='save' onClick={() => { this.props.onSave(item); }} />}
          {item.localOnly && <Button type='danger' icon='close' onClick={() => { this.props.onRemove(item); }} />}
        </InputGroup>

      </div>
    );
  }

  private validateType = (dataType: DataType, value: string): Boolean => {
    if (!value) {
      return true;
    }
    switch (dataType) {
      case 'Integer':
        return Number.isInteger(parseInt(value));
      case 'Decimal':
        return !Number.isNaN(parseFloat(value));
      case 'Boolean':
        const b = value.toLowerCase();
        return b === 'true' || b === 'false';
      case 'String[]':
        try {
          const arr = JSON.parse(value);
          return Array.isArray(arr);
        } catch (e) {
          return false;
        }
      case 'Map<String,String>':
        try {
          const map = JSON.parse(value);
          // tslint:disable-next-line: forin
          for (const key of Object.keys(map)) {
            if (typeof key !== 'string') {
              return false;
            }
            if (typeof map[key] !== 'string') {
              return false;
            }
          }
          return true;
        } catch (e) {
          return false;
        }
      default:
        return true;
    }
  }
}

interface MoreActionsProps {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void
}

const MoreActions: React.FunctionComponent<MoreActionsProps> = (props) => {

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

interface DeleteButtonProps {
  item: EnvVar;
  onRemove: (item: EnvVar) => void;
}

const DeleteButton: React.FunctionComponent<DeleteButtonProps> = (props) => {
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

const getApex = (item: EnvVar) => {
  return `(${item.dataType}) ENV.get('${item.key}');`;
};

const getFormula = (item: EnvVar) => {
  return `$CustomMetadata.ENV_Var__mdt.${item.key}.Val__c`;
};


