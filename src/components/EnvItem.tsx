import * as React from 'react';
import { Input, Select, Button, Popconfirm, Icon } from 'antd';
import { ENVVarmdtFields } from '@src/generated';
import TextArea from 'antd/lib/input/TextArea';
const InputGroup = Input.Group;
const Option = Select.Option;

export type EnvVar = ENVVarmdtFields & { hasChanges?: boolean, localOnly?: boolean, dmlError?: boolean, keyError?: boolean, typeError?: boolean };
export type DataType = 'String' | 'Integer' | 'Decimal' | 'Boolean' | 'String[]';

export interface EnvVarItemProps {
  item: EnvVar;
  index: number;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof ENVVarmdtFields, value: string) => void;
  onSave: (index: number) => void;
}

export class EnvVarItem extends React.Component<EnvVarItemProps, any> {
  public render() {
    let del: any;
    if (this.props.item.localOnly) {
      del = <Button type='danger' icon='close' onClick={() => { this.props.onRemove(this.props.index); }} />;
    } else {
      del = (
        <Popconfirm
          icon={<Icon type='question-circle-o' style={{ color: 'red' }} />}
          title='Are you sure？'
          okType='danger'
          okText='DELETE'
          cancelText='No'
          onConfirm={() => { this.props.onRemove(this.props.index); }} >
          <Button type='danger' icon='delete' />
        </Popconfirm>
      );
    }

    const typeError = !this.validateType(this.props.item.datatype as DataType, this.props.item.value);
    const keyError = this.props.item.developerName && this.props.item.developerName.indexOf(' ') > -1; // [TODO] Better validation

    const keyStyle: React.CSSProperties = { width: '20%' };
    if (keyError) {
      keyStyle.color = 'red';
    }

    const valueStyle: React.CSSProperties = { width: '40%' };
    if (typeError) {
      valueStyle.color = 'red';
    }

    const canSave = this.props.item.developerName && this.props.item.hasChanges && (!typeError && !keyError);
    return (
      <div style={{ marginTop: 5 }}>
        <InputGroup compact={true}>
          <Input
            style={keyStyle}
            onChange={(e) => { this.props.onUpdate(this.props.index, 'developerName', e.target.value); }}
            placeholder={'KEY'}
            disabled={!this.props.item.localOnly}
            value={this.props.item.developerName}
          />
          <Select
            placeholder={'Data Type'}
            onChange={(e) => { this.props.onUpdate(this.props.index, 'datatype', e); }}
            style={{ width: '15%' }}
            value={this.props.item.datatype}
          >
            <Option key='String'>String</Option>
            <Option key='Integer'>Integer</Option>
            <Option key='Decimal'>Decimal</Option>
            <Option key='Boolean'>Boolean</Option>
            <Option key='String[]'>String[]</Option>
          </Select>
          <TextArea
            placeholder='Value'
            style={valueStyle}
            value={this.props.item.value}
            autosize={true}
            onChange={(e) => { this.props.onUpdate(this.props.index, 'value', e.target.value); }}
          />
          {canSave && <Button type='primary' icon='save' onClick={() => { this.props.onSave(this.props.index); }} />}
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
      default:
        return true;
    }
  }
}
