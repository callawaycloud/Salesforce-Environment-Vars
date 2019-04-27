import * as React from 'react';
import { Divider, Input, Button } from 'antd';

export interface EnvGroupProps {
  group?: string;
  items: JSX.Element[];
  onGroupNameSubmit: (oldName: string, newName: string) => void;
  onDragOverEmptyGroup: (groupName: string) => void;
  onCancel: () => void;
}

export interface EnvGroupState {
  edit: boolean;
  name: string;
}

export class EnvGroup extends React.Component<EnvGroupProps, EnvGroupState> {

  constructor(props: EnvGroupProps) {
    super(props);
    this.state = {
      name: props.group,
      edit: false,
    };
  }

  private onChangeName = () => {
    if (this.state.name && this.state.name.length > 0) {
      this.props.onGroupNameSubmit(this.props.group, this.state.name);
      this.setState({edit: false});
    }
  }

  public render() {

    console.log(this.props.group);
    let name: JSX.Element;

    const btns: JSX.Element[] = [];

    if (this.state.name !== this.props.group) {
      if (this.state.name && this.state.name.length) {
        btns.push(<Button key='save' onClick={this.onChangeName} type='primary' icon='save' />);
      }
      if (this.props.group !== undefined) {
        btns.push(<Button key='undo' onClick={() => this.setState({edit: false})} type='dashed' icon='undo' />);
      }
    }

    if (this.props.group === undefined) {
      btns.push(<Button key='close' onClick={this.props.onCancel} type='default' icon='close' />);
    }

    if (this.state.edit || this.props.group === undefined) {
      name = (
      <Input.Group compact={true}>
        <Input
          style={{width: 300}}
          autoFocus={true}
          placeholder='Update Name'
          value={this.state.name}
          onChange={(e) => this.setState({name: e.target.value})}
        />
          {btns}
      </Input.Group>
      );
    } else {
      name = (
        <div style={{cursor: 'pointer'}} onClick={() => this.setState({edit: true})}>{this.props.group.length ? this.props.group : 'No Group'}</div>
      );
    }
    if (!this.props.items.length) {
      return (
        <div
          onDragOver={(e) => this.props.onDragOverEmptyGroup(this.props.group)}
        >
          <Divider >{name}</Divider>
        </div>
      );
    }
    return (
      <div>
        <Divider>{name}</Divider> {this.props.items}
      </div>
    );
  }
}
