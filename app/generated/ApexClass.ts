import { Rest, RestObject, SObject, sField, SalesforceFieldType, SFLocation, SFieldProperties, FieldResolver, SOQLQueryParams, buildQuery, FieldProps, PicklistConst } from "ts-force";
import "./";

export type ApexClassFields = Partial<FieldProps<ApexClass>>;

/**
 * Generated class for ApexClass
 */
export class ApexClass extends RestObject {
    @sField({ apiName: 'Id', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.ID, salesforceLabel: 'Class ID', externalId: false })
    public readonly id: string;
    @sField({ apiName: 'NamespacePrefix', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Namespace Prefix', externalId: false })
    public readonly namespacePrefix: string;
    @sField({ apiName: 'Name', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Name', externalId: false })
    public name: string;
    @sField({ apiName: 'ApiVersion', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DOUBLE, salesforceLabel: 'Api Version', externalId: false })
    public apiVersion: number;
    @sField({ apiName: 'Status', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.PICKLIST, salesforceLabel: 'Status', externalId: false })
    public status: string;
    @sField({ apiName: 'IsValid', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Is Valid', externalId: false })
    public isValid: boolean;
    @sField({ apiName: 'BodyCrc', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DOUBLE, salesforceLabel: 'Body CRC', externalId: false })
    public bodyCrc: number;
    @sField({ apiName: 'Body', createable: true, updateable: true, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.TEXTAREA, salesforceLabel: 'Body', externalId: false })
    public body: string;
    @sField({ apiName: 'LengthWithoutComments', createable: true, updateable: true, required: true, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.INT, salesforceLabel: 'Size Without Comments', externalId: false })
    public lengthWithoutComments: number;
    @sField({ apiName: 'CreatedDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Created Date', externalId: false })
    public readonly createdDate: Date;
    @sField({ apiName: 'CreatedById', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Created By ID', externalId: false })
    public readonly createdById: string;
    @sField({ apiName: 'LastModifiedDate', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'Last Modified Date', externalId: false })
    public readonly lastModifiedDate: Date;
    @sField({ apiName: 'LastModifiedById', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.REFERENCE, salesforceLabel: 'Last Modified By ID', externalId: false })
    public readonly lastModifiedById: string;
    @sField({ apiName: 'SystemModstamp', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.DATETIME, salesforceLabel: 'System Modstamp', externalId: false })
    public readonly systemModstamp: Date;

    constructor(fields?: ApexClassFields, restInstance?: Rest) {
        super('ApexClass', restInstance);
        this.id = void 0;
        this.namespacePrefix = void 0;
        this.name = void 0;
        this.apiVersion = void 0;
        this.status = void 0;
        this.isValid = void 0;
        this.bodyCrc = void 0;
        this.body = void 0;
        this.lengthWithoutComments = void 0;
        this.createdDate = void 0;
        this.createdById = void 0;
        this.lastModifiedDate = void 0;
        this.lastModifiedById = void 0;
        this.systemModstamp = void 0;
        this.initObject(fields);
        return new Proxy(this, this.safeUpdateProxyHandler);
    }

    public static API_NAME: 'ApexClass' = 'ApexClass';
    public readonly _TYPE_: 'ApexClass' = 'ApexClass';
    private static _fields: { [P in keyof FieldProps<ApexClass>]: SFieldProperties; };

    public static get FIELDS() {
        return this._fields = this._fields ? this._fields : ApexClass.getPropertiesMeta<FieldProps<ApexClass>, ApexClass>(ApexClass)
    }

    public static async retrieve(qryParam: ((fields: FieldResolver<ApexClass>) => SOQLQueryParams) | string, restInstance?: Rest): Promise<ApexClass[]> {

        let qry = typeof qryParam === 'function' ? buildQuery(ApexClass, qryParam) : qryParam;
        return await RestObject.query<ApexClass>(ApexClass, qry, restInstance);

    }

    public static fromSFObject(sob: SObject): ApexClass {
        return new ApexClass().mapFromQuery(sob);
    }
}
