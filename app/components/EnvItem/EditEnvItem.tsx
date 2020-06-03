import * as React from 'react';
import { Form, Tooltip, Switch, Input, Button, Select, Divider, Modal, Col, Row, Spin } from 'antd';
import { DataTypeSelect } from '../DataTypeSelect';
import { Editor } from './Editor';
import { validateType, isJson } from '@src/lib/util';
import { PlusOutlined, EyeOutlined, EyeInvisibleOutlined, UnlockOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { DeleteButton } from './DeleteButton';
import jsonSchemaGenerator from 'json-schema-generator';
import { KeyDisplay } from './KeyDisplay';

export interface EnvVarEditProps {
  original: EnvVar;
  item: EnvVar;
  groups: string[];
  blockUI: boolean;
  onUpdate: (field: string, val: string | boolean) => void;
  onCancel: () => void;
  onSave: () => void;
  onRemove: () => void;
}

export const EnvVarEdit = (props: EnvVarEditProps) => {
  const [newGroup, setNewGroup] = React.useState<string>(null);
  const [jsonSchemaUnLocked, setJsonSchemaUnLocked] = React.useState<boolean>(false);
  const { original, item, groups, onUpdate: updateItem, onSave, onCancel, blockUI } = props;

  const valueValidation = validateType(item);
  const valueValid = valueValidation === true;

  const validationMessage = Array.isArray(valueValidation)
    ? valueValidation.map(i => <div className='error'>{i}</div>)
    : null;

  const editFinished = () => {
    if (
      item.value &&
      (item.dataType === 'Map<String,String>' || item.dataType === 'String[]' || item.dataType === 'ANY')
    ) {
      try {
        const val = JSON.stringify(JSON.parse(item.value), null, 1);
        updateItem('value', val);
      } catch (e) { }
    }
  };
  const keyError = item.key && item.key.indexOf(' ') > -1; // [TODO] Better validation

  const hasChanges = JSON.stringify(original) !== JSON.stringify(item);
  const canSave = item.key && hasChanges && valueValid && !keyError;
  const jsonSchemaEditLocked = !jsonSchemaUnLocked && original?.jsonSchema?.length > 0;

  const footer = (
    <div>
      <Button onClick={onCancel}>Cancel</Button>
      {canSave && (
        <Button type='primary' onClick={onSave}>
          Save
        </Button>
      )}
    </div>
  );

  const header = (
    <Row align='middle' justify='space-between'>
      <Col>{item.key && item.key.length > 2 ? item.key : 'New Env Var'}</Col>
      <Col>
        <DeleteButton item={item} onRemove={props.onRemove} />
      </Col>
    </Row>
  );

  let body = (
    <Form layout='vertical'>
      <Form.Item label='Key' validateStatus={keyError ? 'error' : ''}>
        {item.localOnly ? (
          <Input
            onChange={e => {
              updateItem('key', e.target.value);
            }}
            placeholder='KEY used to access this var.  Once set, cannot be changed'
            value={item.key}
          />
        ) : (
            <KeyDisplay item={item} />
          )}
      </Form.Item>
      <Form.Item label='Group'>
        <Select
          style={{ width: 240 }}
          placeholder='Select Group (optional)'
          value={item.group}
          onSelect={e => updateItem('group', e)}
          dropdownRender={menu => (
            <div>
              {menu}
              <Divider style={{ margin: '4px 0' }} />
              <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                <Input
                  placeholder='add new group'
                  style={{ flex: 'auto' }}
                  value={newGroup}
                  onChange={e => setNewGroup(e.target.value)}
                />
                {newGroup && newGroup.length > 2 && (
                  <a
                    style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                    onClick={() => updateItem('group', newGroup)}
                  >
                    <PlusOutlined /> New Group
                  </a>
                )}
              </div>
            </div>
          )}
        >
          {groups.map(item => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label='Data Type'>
        <DataTypeSelect item={item} onUpdate={e => updateItem('dataType', e)} />
      </Form.Item>
      <Form.Item label='Secret'>
        <Tooltip title='This cannot be changed or viewed after saving.  WARNING: Anyone with Apex permission will be able to view these values'>
          <Switch
            disabled={!item.localOnly}
            checked={item.secret}
            onChange={e => props.onUpdate('secret', e)}
            checkedChildren={<EyeInvisibleOutlined />}
            unCheckedChildren={<EyeOutlined />}
          />
        </Tooltip>
      </Form.Item>
      <Form.Item label='Notes'>
        <Input.TextArea
          placeholder='Where/How it is used, valid input, etc...'
          autoSize={{ minRows: 3, maxRows: 20 }}
          value={item.notes}
          onChange={e => updateItem('notes', e.target.value)}
        />
      </Form.Item>
      <Form.Item label='Value' validateStatus={!valueValid ? 'error' : ''} help={validationMessage}>
        <Editor
          item={item}
          editing={true}
          onUpdate={val => {
            updateItem('value', val);
          }}
          onEditFinished={editFinished}
          onEditStart={() => { }}
        />
      </Form.Item>
      {item.dataType === 'ANY' && (
        <Form.Item label='JSON Schema'>
          <Input.TextArea
            placeholder='Optional Schema to validate input'
            autoSize={{ minRows: 3, maxRows: 10 }}
            value={item.jsonSchema}
            disabled={jsonSchemaEditLocked}
            onChange={e => updateItem('jsonSchema', e.target.value)}
          />
          {isJson(item.value) && !jsonSchemaEditLocked && (
            <Button
              type="link"
              icon={<ThunderboltOutlined />}
              onClick={() => {
                const schemaObj = jsonSchemaGenerator(JSON.parse(item.value));
                updateItem('jsonSchema', JSON.stringify(schemaObj, null, 2));
              }}
            >
              Generate From Current
            </Button>
          )}
          {jsonSchemaEditLocked && <Button type="link" onClick={() => setJsonSchemaUnLocked(true)} icon={<UnlockOutlined />}>Unlock Schema</Button>}
        </Form.Item>
      )}
    </Form>
  )
  if (blockUI) {
    body = <Spin spinning={true} >{body}</Spin>
  }

  return (
    <Modal width={1000} closable={false} title={header} visible={true} onCancel={onCancel} footer={footer}>
      {body}
    </Modal>
  );
};
