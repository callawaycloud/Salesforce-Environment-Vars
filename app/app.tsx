import { Button, Card, Divider, Input, message, Spin, Switch, Affix } from 'antd';
import { hot } from 'react-hot-loader'; // needs to be before react!
import * as React from 'react';
import { EnvGroup } from './components/EnvGroup';
import { EnvVarItem } from './components/EnvItem/EnvItem';
import { TableOfContents } from './components/tableOfContents';
import { MetadataService } from './lib/metadataService';
import { EnvVar } from './types';
import { SecretsEnabled } from './components/secrets';
import { getSecretsEnabled } from './lib/secretService';

interface AppState {
  vars: EnvVar[];
  groups: string[];
  filter?: string;
  loading: boolean;
  secretsEnabled: boolean;
}

class App extends React.Component<{}, AppState> {
  private newRef = React.createRef<EnvVarItem>();
  private mdapi: MetadataService;
  private draggedItem: EnvVar;
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      vars: [],
      groups: [''],
      secretsEnabled: false,
    };
  }

  // RETRIEVE METADATA
  public async componentDidMount() {
    const secretsEnabled = await getSecretsEnabled();

    this.mdapi = new MetadataService();
    const vars = await this.mdapi.retrieveEnvVars();
    const groups = vars.reduce((groups, v) => {
      const group = v.group;
      if (!groups.includes(group)) {
        groups.push(group);
      }
      return groups;
    }, []);
    if (!groups.includes('')) {
      groups.push('');
    }
    this.setState({ vars, groups, loading: false, secretsEnabled });
  }

  // Drag & Drop
  private handleDragStart = (e: any, item: EnvVar) => {
    this.draggedItem = item;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  }

  public handleDragOver = (draggedOverItem: EnvVar) => {

    // if the item is dragged over itself, ignore
    if (this.draggedItem === draggedOverItem) {
      return;
    }

    const index = this.state.vars.findIndex((v) => v === draggedOverItem);
    const vars = this.state.vars.filter((v) => v !== this.draggedItem);
    const newDraggedItem = { ...this.draggedItem };
    this.draggedItem = newDraggedItem;
    if (this.draggedItem.group !== draggedOverItem.group) {
      newDraggedItem.group = draggedOverItem.group;
      newDraggedItem.hasChanges = true;
    }
    vars.splice(index, 0, newDraggedItem);
    this.setState({ vars });
  }

  public handleDragEnd = () => {
    this.draggedItem = null;
  }

  public handleDragOverNoGroup = (group: string) => {
    const index = this.state.vars.findIndex((v) => v === this.draggedItem);
    const newDraggedItem = { ...this.draggedItem };
    this.draggedItem = newDraggedItem;
    if (this.draggedItem.group !== group) {
      newDraggedItem.group = group;
      newDraggedItem.hasChanges = true;
    }
    const vars = [...this.state.vars];
    vars[index] = newDraggedItem;
    const groups = [...this.state.groups];
    this.setState({ vars, groups });
  }

  public newGroup = () => {
    const groups = [...this.state.groups];
    groups.push(undefined);
    this.setState({ groups });
  }

  public cancelNewGroup = () => {
    const groups = this.state.groups.filter((g) => g !== undefined);
    const vars: EnvVar[] = [...this.state.vars].filter((v) => v.group !== undefined);
    const groupVars = this.state.vars.filter((v) => v.group === undefined);
    groupVars.forEach((v) => {
      vars.push({ ...v, ...{ group: '' } });
    });
    this.setState({ groups, vars });
  }

  // === LOCAL STATE HANDLERS===

  private updateVar = (item: EnvVar, field: keyof EnvVar, val: string) => {
    const index = this.state.vars.findIndex((v) => v === item);
    const vars = [...this.state.vars];
    vars[index] = { ...item, ...{ [field]: val, hasChanges: true } };
    this.setState({ vars });
  }

  private addNew = () => {
    const vars = [...this.state.vars];
    vars.push({
      dataType: 'String',
      localOnly: true,
      secret: false,
      group: '',
      notes: '',
      value: '',
    });

    this.setState({ vars }, () => {
      if (this.newRef && this.newRef.current) {
        this.newRef.current.focus();
      }
    });
  }

  // === DML HANDLERS ===

  private updateGroupName = async (oldName: string, newName: string) => {
    this.setState({ loading: true }, async () => {
      const gIndex = this.state.groups.indexOf(oldName);
      const groups = [...this.state.groups];
      groups[gIndex] = newName;

      const vars: EnvVar[] = [...this.state.vars].filter((v) => v.group !== oldName);
      const groupVars = this.state.vars.filter((v) => v.group === oldName);
      groupVars.forEach((v) => {
        vars.push({ ...v, ...{ group: newName } });
      });
      try {
        await this.mdapi.updateGroup(groupVars, newName);
      } catch (e) {
        console.log('Failed to change group', newName);
      }

      // make sure we always have an empty group
      if (!groups.includes('')) {
        groups.push('');
      }
      this.setState({ vars, groups, loading: false });
    });
  }

  private saveVar = async (item: EnvVar) => {
    this.setState({ loading: true }, async () => {
      const index = this.state.vars.findIndex((v) => v === item);
      let newVar: Partial<EnvVar>;
      try {
        await this.mdapi.saveEnvVars(item);
        newVar = { hasChanges: false, localOnly: false, dmlError: false };
      } catch (e) {
        newVar = { dmlError: true };
        message.error(e.toString());
      }

      const vars = [...this.state.vars];
      vars[index] = { ...item, ...newVar };
      this.setState({ vars, loading: false });
    });
  }

  private removeVar = async (item: EnvVar) => {
    this.setState({ loading: true }, async () => {
      const index = this.state.vars.findIndex((v) => v === item);

      if (!item.localOnly) {
        try {
          await this.mdapi.deleteEnvVar(item);
        } catch (e) {
          message.error(e.toString());
        }
      }
      const vars = this.state.vars.filter((_, i) => i !== index);
      this.setState({ vars, loading: false });
    });
  }

  // === RENDER ===

  public render() {
    const vars = this.filterVars();

    const groupVars: { [key: string]: JSX.Element[] } = {};
    for (const group of this.state.groups) {
      const gVars = vars.filter((v) => v.group === group);

      groupVars[group] = gVars.map((v, i) => {
        return (

          <EnvVarItem
            ref={v.key ? null : this.newRef}
            key={i}
            item={v}
            onRemove={this.removeVar}
            onSave={this.saveVar}
            onUpdate={this.updateVar}
            onDragEnd={this.handleDragEnd}
            onDragOver={this.handleDragOver}
            onDragStart={this.handleDragStart}
          />
        );
      });
    }

    const groupElements = [];
    for (const groupKey of Object.keys(groupVars).sort()) {
      let group = groupKey;
      if (group === 'undefined') {
        group = undefined; // yuck
      }
      groupElements.push((
        <EnvGroup
          key={groupKey}
          group={group}
          items={groupVars[group]}
          onCancel={this.cancelNewGroup}
          onDragOverEmptyGroup={this.handleDragOverNoGroup}
          onGroupNameSubmit={this.updateGroupName}
        />
      ));
    }

    const toc = (
      <TableOfContents
        onTitleClick={(key) => this.setState({ filter: key })}
        vars={this.state.vars}
      />
    );

    return (
      <div>
        <Card
          title='Environment Variables'
          extra={toc}

        >
          <Spin spinning={this.state.loading} >
            <Input.Search
              placeholder='Search Keys or Values'
              value={this.state.filter}
              onChange={(e) => this.setState({ filter: e.target.value })}
              allowClear={true}
              style={{ width: '35%' }}
            />
            <SecretsEnabled style={{ float: 'right' }} enabled={this.state.secretsEnabled} />

            <Divider  dashed={true} />
            {groupElements}

          </Spin>

        </Card>
        <Affix offsetBottom={10}>
          <Card>
            <Button style={{ marginTop: 15 }} type='primary' icon='plus' onClick={this.addNew}>Add</Button>
            <Button style={{ marginLeft: 10 }} icon='folder' onClick={() => this.newGroup()}>Add Group</Button>
          </Card>
        </Affix>
      </div>
    );
  }

  private filterVars() {
    let vars = this.state.vars;
    if (this.state.filter) {
      const filter = this.state.filter.toLocaleLowerCase();
      vars = vars.filter((v) => {
        return v.key && v.key.toLocaleLowerCase().includes(filter)
          || v.value && v.value.toLocaleLowerCase().includes(filter);
      });
    }
    return vars;
  }

}

export default hot(module)(App);
