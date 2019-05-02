import { Rest, RestObject, SObject, sField, SalesforceFieldType, SFLocation, SFieldProperties, FieldResolver, SOQLQueryParams, buildQuery, FieldProps } from "ts-force";
import "./";

export type EnvVarRecordFields = Partial<FieldProps<EnvVarRecord>>;

/**
 * Generated class for ENV_Var__mdt
 */
export class EnvVarRecord extends RestObject {
    @sField({ apiName: 'Id', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.ID, salesforceLabel: 'Custom Metadata Record ID', externalId: false })
    public readonly id: string;
    @sField({ apiName: 'DeveloperName', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Custom Metadata Record Name', externalId: false })
    public readonly developerName: string;
    @sField({ apiName: 'MasterLabel', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Label', externalId: false })
    public readonly masterLabel: string;
    @sField({ apiName: 'Language', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Master Language', externalId: false })
    public readonly language: string;
    @sField({ apiName: 'NamespacePrefix', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Namespace Prefix', externalId: false })
    public readonly namespacePrefix: string;
    @sField({ apiName: 'Label', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Label', externalId: false })
    public readonly label: string;
    @sField({ apiName: 'QualifiedApiName', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Qualified API Name', externalId: false })
    public readonly qualifiedApiName: string;
    /**
     * The datatype of this ENV var
     */
    @sField({ apiName: 'Datatype__c', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Datatype', externalId: false })
    public readonly datatype: string;
    /**
     * Grouping for this ENV Var (best managed by UI)
     */
    @sField({ apiName: 'Group__c', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Group', externalId: false })
    public readonly group: string;
    /**
     * Describe how this setting is used, where it's used and any notes about how to enter the values
     */
    @sField({ apiName: 'Notes__c', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.TEXTAREA, salesforceLabel: 'Notes', externalId: false })
    public readonly notes: string;
    /**
     * The value of this var
     */
    @sField({ apiName: 'Value__c', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.TEXTAREA, salesforceLabel: 'Value', externalId: false })
    public readonly value: string;
    /**
     * A copy of the first 255 characters of the value.  Allows use in formula!
     */
    @sField({ apiName: 'Val__c', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Val', externalId: false })
    public readonly val: string;

    constructor(fields?: EnvVarRecordFields, client?: Rest) {
        super('ENV_Var__mdt', client);
        this.id = void 0;
        this.developerName = void 0;
        this.masterLabel = void 0;
        this.language = void 0;
        this.namespacePrefix = void 0;
        this.label = void 0;
        this.qualifiedApiName = void 0;
        this.datatype = void 0;
        this.group = void 0;
        this.notes = void 0;
        this.value = void 0;
        this.val = void 0;
        this.initObject(fields);
        return new Proxy(this, this.safeUpdateProxyHandler);
    }

    public static API_NAME: 'ENV_Var__mdt' = 'ENV_Var__mdt';
    public readonly _TYPE_: 'ENV_Var__mdt' = 'ENV_Var__mdt';
    private static _fields: { [P in keyof FieldProps<EnvVarRecord>]: SFieldProperties; };

    public static get FIELDS() {
        return this._fields = this._fields ? this._fields : EnvVarRecord.getPropertiesMeta<FieldProps<EnvVarRecord>, EnvVarRecord>(EnvVarRecord)
    }

    public static async retrieve(qryParam: ((fields: FieldResolver<EnvVarRecord>) => SOQLQueryParams) | string): Promise<EnvVarRecord[]> {

        let qry = typeof qryParam === 'function' ? buildQuery(EnvVarRecord, qryParam) : qryParam;
        return await RestObject.query<EnvVarRecord>(EnvVarRecord, qry);

    }

    public static fromSFObject(sob: SObject): EnvVarRecord {
        return new EnvVarRecord().mapFromQuery(sob);
    }
}
