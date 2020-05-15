import { Button, Card, Divider, Input, message, Spin, Affix } from 'antd';
import { hot } from 'react-hot-loader'; // needs to be before react!
import * as React from 'react';
import { MetadataService } from './lib/metadataService';
import { SecretsEnabled } from './components/Secrets';
import { getSecretsEnabled } from './lib/secretService';
import { EnvTable } from './components/EnvTable';
import { PlusOutlined } from '@ant-design/icons';
import { EnvVarEdit } from './components/EnvItem/EditEnvItem';

interface AppProps {
  //allows url linking to groups or env vars
  loadDisplayGroup?: string;
  loadDisplayEnv?: string;
}

interface AppState {
  vars: EnvVar[];
  editing?: EnvVar;
  filter?: string;
  loading: boolean;
  secretsEnabled: boolean;
}

class App extends React.Component<AppProps, AppState> {
  private mdapi: MetadataService;
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      vars: [],
      editing: undefined,
      secretsEnabled: false
    };
  }

  // RETRIEVE METADATA
  public async componentDidMount() {
    const secretsEnabled = await getSecretsEnabled();

    this.mdapi = new MetadataService();
    const vars = await this.mdapi.retrieveEnvVars();
    let editing = undefined;
    if (this.props.loadDisplayEnv) {
      editing = vars.find(v => v.key.toLocaleLowerCase() === this.props.loadDisplayEnv.toLocaleLowerCase());
    }
    this.setState({ vars, loading: false, secretsEnabled, editing });
  }

  // === LOCAL STATE HANDLERS===

  private updateEditing = (field: keyof EnvVar, val: string) => {
    const newEdit = { ...this.state.editing, ...{ [field]: val } };
    this.setState({ editing: newEdit });
  };

  private addNew = () => {
    const editing: EnvVar = {
      dataType: 'String',
      localOnly: true,
      secret: false,
      group: '',
      notes: '',
      value: ''
    };

    this.setState({ editing });
  };

  // // === DML HANDLERS ===

  private saveVar = async (item: EnvVar) => {
    this.setState({ loading: true }, async () => {
      let newVar: Partial<EnvVar>;
      let editing = item;
      try {
        await this.mdapi.saveEnvVars(item);
        newVar = { localOnly: false, dmlError: false };
        editing = null;
      } catch (e) {
        console.log(e);
        newVar = { dmlError: true };
        message.error(e.toString());
      }

      const vars = [...this.state.vars];
      const index = this.state.vars.findIndex(v => v.key === item.key);
      const updatedVar = { ...item, ...newVar };
      if (index >= 0) {
        vars[index] = updatedVar;
      } else {
        vars.push(updatedVar);
      }

      this.setState({ vars, loading: false, editing });
    });
  };

  private removeVar = async (item: EnvVar) => {
    this.setState({ loading: true }, async () => {
      const index = this.state.vars.findIndex(v => v.key === item.key);

      if (!item.localOnly) {
        try {
          await this.mdapi.deleteEnvVar(item);
        } catch (e) {
          message.error(e.toString());
        }
      }
      const vars = this.state.vars.filter((_, i) => i !== index);
      this.setState({ vars, loading: false, editing: undefined });
    });
  };

  // === RENDER ===

  public render() {
    const vars = this.filterVars();

    const editing = this.state.editing;
    const groups = this.state.vars
      .reduce((res, item) => {
        if (item.group && !res.includes(item.group)) {
          res.push(item.group);
        }
        return res;
      }, [])
      .sort();

    return (
      <div>
        {editing && (
          <EnvVarEdit
            original={vars.find(v => v.key === editing.key)}
            item={editing}
            groups={groups}
            blockUI={this.state.loading}
            onUpdate={this.updateEditing}
            onSave={() => this.saveVar(editing)}
            onCancel={() => this.setState({ editing: undefined })}
            onRemove={() => this.removeVar(editing)}
          />
        )}
        <Card title='Environment Variables'>
          <Spin spinning={this.state.loading}>
            <Input.Search
              placeholder='Search Keys or Values'
              value={this.state.filter}
              onChange={e => this.setState({ filter: e.target.value })}
              allowClear={true}
              style={{ width: '35%' }}
            />
            <SecretsEnabled style={{ float: 'right' }} enabled={this.state.secretsEnabled} />
            <Divider dashed={true} />
            <EnvTable
              items={vars}
              onEdit={(item: EnvVar) => this.setState({ editing: item })}
              defaultFilteredGroup={this.props.loadDisplayGroup}
              groups={groups}
            />
          </Spin>
        </Card>
        <Affix offsetBottom={10}>
          <Card>
            <Button style={{ marginTop: 15 }} type='primary' icon={<PlusOutlined />} onClick={this.addNew}>
              Add
            </Button>
          </Card>
        </Affix>
      </div>
    );
  }

  private filterVars() {
    let vars = this.state.vars;
    if (this.state.filter) {
      const filter = this.state.filter.toLocaleLowerCase();
      vars = vars.filter(v => {
        return (
          (v.key && v.key.toLocaleLowerCase().includes(filter)) ||
          (v.value && v.value.toLocaleLowerCase().includes(filter))
        );
      });
    }
    return vars;
  }
}

export default hot(module)(App);
