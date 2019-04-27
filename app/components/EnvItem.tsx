import * as React from 'react';
import { Input, Select, Button, Popconfirm, Icon, Tooltip } from 'antd';
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
  rows: number;
}

export class EnvVarItem extends React.Component<EnvVarItemProps, EnvVarItemState> {

  constructor(props: EnvVarItemProps) {
    super(props);
    this.state = {
      rows: 1,
    };
  }

  public render() {
    let del: any;
    if (this.props.item.localOnly) {
      del = <Button type='danger' icon='close' onClick={() => { this.props.onRemove(this.props.item); }} />;
    } else {
      del = (
        <Popconfirm
          icon={<Icon type='question-circle-o' style={{ color: 'red' }} />}
          title='Are you sure？'
          okType='danger'
          okText='DELETE'
          cancelText='No'
          onConfirm={() => { this.props.onRemove(this.props.item); }} >
          <Button type='danger' icon='delete' />
        </Popconfirm>
      );
    }

    const typeError = !this.validateType(this.props.item.dataType, this.props.item.value);
    const keyError = this.props.item.key && this.props.item.key.indexOf(' ') > -1; // [TODO] Better validation

    const keyStyle: React.CSSProperties = { width: '20%' };
    if (keyError) {
      keyStyle.color = 'red';
    }

    const valueStyle: React.CSSProperties = { width: '40%' };
    if (typeError) {
      valueStyle.color = 'red';
    }

    const canSave = this.props.item.key && this.props.item.hasChanges && (!typeError && !keyError);
    return (
      <div style={{ marginTop: 5 }} onDragOver={() => this.props.onDragOver(this.props.item)}>
        <InputGroup compact={true}>
          <Tooltip title='Drag -> Drop to change grouping'>
            <Button
              draggable={true}
              onDragStart={(e: any) => this.props.onDragStart(e, this.props.item)}
              onDragEnd={this.props.onDragEnd}
              icon='drag'
            />
          </Tooltip>
          <Input
            style={keyStyle}
            onChange={(e) => { this.props.onUpdate(this.props.item, 'key', e.target.value); }}
            placeholder='KEY used to access this var.  Once set, cannot be changed'
            disabled={!this.props.item.localOnly}
            value={this.props.item.key}
          />
          <NotesModal item={this.props.item} onSaveNotes={(notes) => this.props.onUpdate(this.props.item, 'notes', notes)} />
          <Select
            placeholder={'Data Type'}
            onChange={(e) => { this.props.onUpdate(this.props.item, 'dataType', e); }}
            style={{ width: '15%' }}
            value={this.props.item.dataType}
          >
            <Option key='String'>String</Option>
            <Option key='Integer'>Integer</Option>
            <Option key='Decimal'>Decimal</Option>
            <Option key='Boolean'>Boolean</Option>
            <Option key='String[]'>String[]</Option>
            <Option key='Map<String,String>'>{'Map<String,String>'}</Option>
          </Select>
          <Tooltip title={this.props.item.notes}>
            <TextArea
              placeholder='Value'
              style={valueStyle}
              value={this.props.item.value}
              rows={this.state.rows}
              onFocus={() => this.setState({rows: 10})}
              onBlur={() => this.setState({rows: 1})}
              onChange={(e) => { this.props.onUpdate(this.props.item, 'value', e.target.value); }}
            />
          </Tooltip>
          {canSave && <Button type='primary' icon='save' onClick={() => { this.props.onSave(this.props.item); }} />}
          {del}
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
