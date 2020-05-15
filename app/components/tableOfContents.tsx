import * as React from 'react';
import { Tooltip, Button, Modal, Typography, Tag, List } from 'antd';
import { ReadOutlined } from '@ant-design/icons';

export interface TableOfContentsProps {
  vars: EnvVar[];
  onTitleClick: (key: string) => void;
}

export interface TableOfContentsState {
  visible: boolean;
}

export class TableOfContents extends React.Component<TableOfContentsProps, TableOfContentsState> {
  constructor(props: TableOfContentsProps) {
    super(props);
    this.state = {
      visible: false
    };
  }

  private openModal = () => {
    this.setState({ visible: true });
  };

  private closeModal = () => {
    this.setState({ visible: false });
  };

  private handleTitleClick = (item: EnvVar) => {
    this.setState({ visible: false });
    this.props.onTitleClick(item.key);
  };

  public render() {
    const itemsByGroup = this.props.vars.reduce<{ [key: string]: EnvVar[] }>((ret, item) => {
      if (ret[item.group]) {
        ret[item.group].push(item);
      } else {
        ret[item.group] = [item];
      }
      return ret;
    }, {});

    const groupItems = Object.keys(itemsByGroup)
      .sort()
      .map(key => {
        const items = itemsByGroup[key]
          .sort((a, b) => (a.key || '').localeCompare(b.key || ''))
          .map(item => {
            return (
              <div key={key}>
                <Typography.Title level={4} copyable={true}>
                  <span style={{ cursor: 'pointer' }} onClick={() => this.handleTitleClick(item)}>
                    {item.key}
                  </span>
                </Typography.Title>
                <Tag>{item.dataType}</Tag> - {item.notes}
              </div>
            );
          });
        return (
          <div key={key} style={{ marginTop: 15 }}>
            <List
              header={
                <Typography.Title underline={true} level={2}>
                  {key}
                </Typography.Title>
              }
              bordered={true}
              dataSource={items}
              renderItem={(item: JSX.Element) => <List.Item>{item}</List.Item>}
            />
          </div>
        );
      });

    return (
      <div>
        <Tooltip title='Click to see a summary of all settings' placement='bottomLeft'>
          <Button icon={<ReadOutlined />} onClick={this.openModal}>
            Table of Contents
          </Button>
        </Tooltip>
        <Modal
          width='85%'
          style={{ width: '85%' }}
          visible={this.state.visible}
          maskClosable={true}
          footer={null}
          onCancel={this.closeModal}
        >
          {groupItems}
        </Modal>
      </div>
    );
  }
}
