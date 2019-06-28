import { Rest, RestObject, SObject, sField, SalesforceFieldType, SFLocation, SFieldProperties, FieldResolver, SOQLQueryParams, buildQuery, FieldProps, PicklistConst } from "ts-force";
import "./";

export type PublisherFields = Partial<FieldProps<Publisher>>;

/**
 * Generated class for Publisher
 */
export class Publisher extends RestObject {
    @sField({ apiName: 'Id', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.ID, salesforceLabel: 'Publisher ID', externalId: false })
    public readonly id: string;
    @sField({ apiName: 'DurableId', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Publisher Durable ID', externalId: false })
    public readonly durableId: string;
    @sField({ apiName: 'Name', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Publisher Name', externalId: false })
    public readonly name: string;
    @sField({ apiName: 'NamespacePrefix', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.STRING, salesforceLabel: 'Publisher Namespace Prefix', externalId: false })
    public readonly namespacePrefix: string;
    @sField({ apiName: 'IsSalesforce', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.BOOLEAN, salesforceLabel: 'Is Salesforce the Publisher?', externalId: false })
    public readonly isSalesforce: boolean;
    @sField({ apiName: 'MajorVersion', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.INT, salesforceLabel: 'Publisher Major Version', externalId: false })
    public readonly majorVersion: number;
    @sField({ apiName: 'MinorVersion', createable: false, updateable: false, required: false, reference: undefined, childRelationship: false, salesforceType: SalesforceFieldType.INT, salesforceLabel: 'Publisher Minor Version', externalId: false })
    public readonly minorVersion: number;

    constructor(fields?: PublisherFields, restInstance?: Rest) {
        super('Publisher', restInstance);
        this.id = void 0;
        this.durableId = void 0;
        this.name = void 0;
        this.namespacePrefix = void 0;
        this.isSalesforce = void 0;
        this.majorVersion = void 0;
        this.minorVersion = void 0;
        this.initObject(fields);
        return new Proxy(this, this.safeUpdateProxyHandler);
    }

    public static API_NAME: 'Publisher' = 'Publisher';
    public readonly _TYPE_: 'Publisher' = 'Publisher';
    private static _fields: { [P in keyof FieldProps<Publisher>]: SFieldProperties; };

    public static get FIELDS() {
        return this._fields = this._fields ? this._fields : Publisher.getPropertiesMeta<FieldProps<Publisher>, Publisher>(Publisher)
    }

    public static async retrieve(qryParam: ((fields: FieldResolver<Publisher>) => SOQLQueryParams) | string, restInstance?: Rest): Promise<Publisher[]> {

        let qry = typeof qryParam === 'function' ? buildQuery(Publisher, qryParam) : qryParam;
        return await RestObject.query<Publisher>(Publisher, qry, restInstance);

    }

    public static fromSFObject(sob: SObject): Publisher {
        return new Publisher().mapFromQuery(sob);
    }
}
