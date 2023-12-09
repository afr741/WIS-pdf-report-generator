/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { Observable } from "zen-observable-ts";

export interface SubscriptionResponse<T> {
  value: GraphQLResult<T>;
}

export type __SubscriptionContainer = {
  onCreateReportTemplate: OnCreateReportTemplateSubscription;
  onUpdateReportTemplate: OnUpdateReportTemplateSubscription;
  onDeleteReportTemplate: OnDeleteReportTemplateSubscription;
  onCreateReport: OnCreateReportSubscription;
  onUpdateReport: OnUpdateReportSubscription;
  onDeleteReport: OnDeleteReportSubscription;
};

export type CreateReportTemplateInput = {
  templateId: string;
  localCompanyName?: string | null;
  localCompanyNameTranslation?: string | null;
  letterHeadImageName?: string | null;
  stampImageName?: string | null;
  address?: string | null;
  addressTranslation?: string | null;
  phone?: string | null;
  fax?: string | null;
  email?: string | null;
  testLocation?: string | null;
  origin?: string | null;
  id?: string | null;
};

export type ModelReportTemplateConditionInput = {
  templateId?: ModelIDInput | null;
  localCompanyName?: ModelStringInput | null;
  localCompanyNameTranslation?: ModelStringInput | null;
  letterHeadImageName?: ModelStringInput | null;
  stampImageName?: ModelStringInput | null;
  address?: ModelStringInput | null;
  addressTranslation?: ModelStringInput | null;
  phone?: ModelStringInput | null;
  fax?: ModelStringInput | null;
  email?: ModelStringInput | null;
  testLocation?: ModelStringInput | null;
  origin?: ModelStringInput | null;
  and?: Array<ModelReportTemplateConditionInput | null> | null;
  or?: Array<ModelReportTemplateConditionInput | null> | null;
  not?: ModelReportTemplateConditionInput | null;
};

export type ModelIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null"
}

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type ModelStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type ReportTemplate = {
  __typename: "ReportTemplate";
  templateId: string;
  localCompanyName?: string | null;
  localCompanyNameTranslation?: string | null;
  letterHeadImageName?: string | null;
  stampImageName?: string | null;
  address?: string | null;
  addressTranslation?: string | null;
  phone?: string | null;
  fax?: string | null;
  email?: string | null;
  testLocation?: string | null;
  origin?: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateReportTemplateInput = {
  templateId?: string | null;
  localCompanyName?: string | null;
  localCompanyNameTranslation?: string | null;
  letterHeadImageName?: string | null;
  stampImageName?: string | null;
  address?: string | null;
  addressTranslation?: string | null;
  phone?: string | null;
  fax?: string | null;
  email?: string | null;
  testLocation?: string | null;
  origin?: string | null;
  id: string;
};

export type DeleteReportTemplateInput = {
  id: string;
};

export type CreateReportInput = {
  id?: string | null;
  name: string;
  testLocation: string;
  reportNum: string;
  lotNum: string;
  customerName: string;
  origin: string;
  stations: string;
  variety: string;
  attachmentUrl: string;
  dataRows?: Array<string | null> | null;
};

export type ModelReportConditionInput = {
  name?: ModelStringInput | null;
  testLocation?: ModelStringInput | null;
  reportNum?: ModelStringInput | null;
  lotNum?: ModelStringInput | null;
  customerName?: ModelStringInput | null;
  origin?: ModelStringInput | null;
  stations?: ModelStringInput | null;
  variety?: ModelStringInput | null;
  attachmentUrl?: ModelStringInput | null;
  dataRows?: ModelStringInput | null;
  and?: Array<ModelReportConditionInput | null> | null;
  or?: Array<ModelReportConditionInput | null> | null;
  not?: ModelReportConditionInput | null;
};

export type Report = {
  __typename: "Report";
  id: string;
  name: string;
  testLocation: string;
  reportNum: string;
  lotNum: string;
  customerName: string;
  origin: string;
  stations: string;
  variety: string;
  attachmentUrl: string;
  dataRows?: Array<string | null> | null;
  reportTemplate?: ReportTemplate | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateReportInput = {
  id: string;
  name?: string | null;
  testLocation?: string | null;
  reportNum?: string | null;
  lotNum?: string | null;
  customerName?: string | null;
  origin?: string | null;
  stations?: string | null;
  variety?: string | null;
  attachmentUrl?: string | null;
  dataRows?: Array<string | null> | null;
};

export type DeleteReportInput = {
  id: string;
};

export type ModelReportTemplateFilterInput = {
  templateId?: ModelIDInput | null;
  localCompanyName?: ModelStringInput | null;
  localCompanyNameTranslation?: ModelStringInput | null;
  letterHeadImageName?: ModelStringInput | null;
  stampImageName?: ModelStringInput | null;
  address?: ModelStringInput | null;
  addressTranslation?: ModelStringInput | null;
  phone?: ModelStringInput | null;
  fax?: ModelStringInput | null;
  email?: ModelStringInput | null;
  testLocation?: ModelStringInput | null;
  origin?: ModelStringInput | null;
  and?: Array<ModelReportTemplateFilterInput | null> | null;
  or?: Array<ModelReportTemplateFilterInput | null> | null;
  not?: ModelReportTemplateFilterInput | null;
};

export type ModelReportTemplateConnection = {
  __typename: "ModelReportTemplateConnection";
  items: Array<ReportTemplate | null>;
  nextToken?: string | null;
};

export type ModelReportFilterInput = {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  testLocation?: ModelStringInput | null;
  reportNum?: ModelStringInput | null;
  lotNum?: ModelStringInput | null;
  customerName?: ModelStringInput | null;
  origin?: ModelStringInput | null;
  stations?: ModelStringInput | null;
  variety?: ModelStringInput | null;
  attachmentUrl?: ModelStringInput | null;
  dataRows?: ModelStringInput | null;
  and?: Array<ModelReportFilterInput | null> | null;
  or?: Array<ModelReportFilterInput | null> | null;
  not?: ModelReportFilterInput | null;
};

export type ModelReportConnection = {
  __typename: "ModelReportConnection";
  items: Array<Report | null>;
  nextToken?: string | null;
};

export type ModelStringKeyConditionInput = {
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC"
}

export type ModelSubscriptionReportTemplateFilterInput = {
  templateId?: ModelSubscriptionIDInput | null;
  localCompanyName?: ModelSubscriptionStringInput | null;
  localCompanyNameTranslation?: ModelSubscriptionStringInput | null;
  letterHeadImageName?: ModelSubscriptionStringInput | null;
  stampImageName?: ModelSubscriptionStringInput | null;
  address?: ModelSubscriptionStringInput | null;
  addressTranslation?: ModelSubscriptionStringInput | null;
  phone?: ModelSubscriptionStringInput | null;
  fax?: ModelSubscriptionStringInput | null;
  email?: ModelSubscriptionStringInput | null;
  testLocation?: ModelSubscriptionStringInput | null;
  origin?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionReportTemplateFilterInput | null> | null;
  or?: Array<ModelSubscriptionReportTemplateFilterInput | null> | null;
};

export type ModelSubscriptionIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  in?: Array<string | null> | null;
  notIn?: Array<string | null> | null;
};

export type ModelSubscriptionStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  in?: Array<string | null> | null;
  notIn?: Array<string | null> | null;
};

export type ModelSubscriptionReportFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  name?: ModelSubscriptionStringInput | null;
  testLocation?: ModelSubscriptionStringInput | null;
  reportNum?: ModelSubscriptionStringInput | null;
  lotNum?: ModelSubscriptionStringInput | null;
  customerName?: ModelSubscriptionStringInput | null;
  origin?: ModelSubscriptionStringInput | null;
  stations?: ModelSubscriptionStringInput | null;
  variety?: ModelSubscriptionStringInput | null;
  attachmentUrl?: ModelSubscriptionStringInput | null;
  dataRows?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionReportFilterInput | null> | null;
  or?: Array<ModelSubscriptionReportFilterInput | null> | null;
};

export type CreateReportTemplateMutation = {
  __typename: "ReportTemplate";
  templateId: string;
  localCompanyName?: string | null;
  localCompanyNameTranslation?: string | null;
  letterHeadImageName?: string | null;
  stampImageName?: string | null;
  address?: string | null;
  addressTranslation?: string | null;
  phone?: string | null;
  fax?: string | null;
  email?: string | null;
  testLocation?: string | null;
  origin?: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateReportTemplateMutation = {
  __typename: "ReportTemplate";
  templateId: string;
  localCompanyName?: string | null;
  localCompanyNameTranslation?: string | null;
  letterHeadImageName?: string | null;
  stampImageName?: string | null;
  address?: string | null;
  addressTranslation?: string | null;
  phone?: string | null;
  fax?: string | null;
  email?: string | null;
  testLocation?: string | null;
  origin?: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type DeleteReportTemplateMutation = {
  __typename: "ReportTemplate";
  templateId: string;
  localCompanyName?: string | null;
  localCompanyNameTranslation?: string | null;
  letterHeadImageName?: string | null;
  stampImageName?: string | null;
  address?: string | null;
  addressTranslation?: string | null;
  phone?: string | null;
  fax?: string | null;
  email?: string | null;
  testLocation?: string | null;
  origin?: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateReportMutation = {
  __typename: "Report";
  id: string;
  name: string;
  testLocation: string;
  reportNum: string;
  lotNum: string;
  customerName: string;
  origin: string;
  stations: string;
  variety: string;
  attachmentUrl: string;
  dataRows?: Array<string | null> | null;
  reportTemplate?: {
    __typename: "ReportTemplate";
    templateId: string;
    localCompanyName?: string | null;
    localCompanyNameTranslation?: string | null;
    letterHeadImageName?: string | null;
    stampImageName?: string | null;
    address?: string | null;
    addressTranslation?: string | null;
    phone?: string | null;
    fax?: string | null;
    email?: string | null;
    testLocation?: string | null;
    origin?: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateReportMutation = {
  __typename: "Report";
  id: string;
  name: string;
  testLocation: string;
  reportNum: string;
  lotNum: string;
  customerName: string;
  origin: string;
  stations: string;
  variety: string;
  attachmentUrl: string;
  dataRows?: Array<string | null> | null;
  reportTemplate?: {
    __typename: "ReportTemplate";
    templateId: string;
    localCompanyName?: string | null;
    localCompanyNameTranslation?: string | null;
    letterHeadImageName?: string | null;
    stampImageName?: string | null;
    address?: string | null;
    addressTranslation?: string | null;
    phone?: string | null;
    fax?: string | null;
    email?: string | null;
    testLocation?: string | null;
    origin?: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type DeleteReportMutation = {
  __typename: "Report";
  id: string;
  name: string;
  testLocation: string;
  reportNum: string;
  lotNum: string;
  customerName: string;
  origin: string;
  stations: string;
  variety: string;
  attachmentUrl: string;
  dataRows?: Array<string | null> | null;
  reportTemplate?: {
    __typename: "ReportTemplate";
    templateId: string;
    localCompanyName?: string | null;
    localCompanyNameTranslation?: string | null;
    letterHeadImageName?: string | null;
    stampImageName?: string | null;
    address?: string | null;
    addressTranslation?: string | null;
    phone?: string | null;
    fax?: string | null;
    email?: string | null;
    testLocation?: string | null;
    origin?: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type GetReportTemplateQuery = {
  __typename: "ReportTemplate";
  templateId: string;
  localCompanyName?: string | null;
  localCompanyNameTranslation?: string | null;
  letterHeadImageName?: string | null;
  stampImageName?: string | null;
  address?: string | null;
  addressTranslation?: string | null;
  phone?: string | null;
  fax?: string | null;
  email?: string | null;
  testLocation?: string | null;
  origin?: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type ListReportTemplatesQuery = {
  __typename: "ModelReportTemplateConnection";
  items: Array<{
    __typename: "ReportTemplate";
    templateId: string;
    localCompanyName?: string | null;
    localCompanyNameTranslation?: string | null;
    letterHeadImageName?: string | null;
    stampImageName?: string | null;
    address?: string | null;
    addressTranslation?: string | null;
    phone?: string | null;
    fax?: string | null;
    email?: string | null;
    testLocation?: string | null;
    origin?: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
  } | null>;
  nextToken?: string | null;
};

export type GetReportQuery = {
  __typename: "Report";
  id: string;
  name: string;
  testLocation: string;
  reportNum: string;
  lotNum: string;
  customerName: string;
  origin: string;
  stations: string;
  variety: string;
  attachmentUrl: string;
  dataRows?: Array<string | null> | null;
  reportTemplate?: {
    __typename: "ReportTemplate";
    templateId: string;
    localCompanyName?: string | null;
    localCompanyNameTranslation?: string | null;
    letterHeadImageName?: string | null;
    stampImageName?: string | null;
    address?: string | null;
    addressTranslation?: string | null;
    phone?: string | null;
    fax?: string | null;
    email?: string | null;
    testLocation?: string | null;
    origin?: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type ListReportsQuery = {
  __typename: "ModelReportConnection";
  items: Array<{
    __typename: "Report";
    id: string;
    name: string;
    testLocation: string;
    reportNum: string;
    lotNum: string;
    customerName: string;
    origin: string;
    stations: string;
    variety: string;
    attachmentUrl: string;
    dataRows?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
  } | null>;
  nextToken?: string | null;
};

export type ReportsByAttachmentUrlAndNameQuery = {
  __typename: "ModelReportConnection";
  items: Array<{
    __typename: "Report";
    id: string;
    name: string;
    testLocation: string;
    reportNum: string;
    lotNum: string;
    customerName: string;
    origin: string;
    stations: string;
    variety: string;
    attachmentUrl: string;
    dataRows?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
  } | null>;
  nextToken?: string | null;
};

export type OnCreateReportTemplateSubscription = {
  __typename: "ReportTemplate";
  templateId: string;
  localCompanyName?: string | null;
  localCompanyNameTranslation?: string | null;
  letterHeadImageName?: string | null;
  stampImageName?: string | null;
  address?: string | null;
  addressTranslation?: string | null;
  phone?: string | null;
  fax?: string | null;
  email?: string | null;
  testLocation?: string | null;
  origin?: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type OnUpdateReportTemplateSubscription = {
  __typename: "ReportTemplate";
  templateId: string;
  localCompanyName?: string | null;
  localCompanyNameTranslation?: string | null;
  letterHeadImageName?: string | null;
  stampImageName?: string | null;
  address?: string | null;
  addressTranslation?: string | null;
  phone?: string | null;
  fax?: string | null;
  email?: string | null;
  testLocation?: string | null;
  origin?: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type OnDeleteReportTemplateSubscription = {
  __typename: "ReportTemplate";
  templateId: string;
  localCompanyName?: string | null;
  localCompanyNameTranslation?: string | null;
  letterHeadImageName?: string | null;
  stampImageName?: string | null;
  address?: string | null;
  addressTranslation?: string | null;
  phone?: string | null;
  fax?: string | null;
  email?: string | null;
  testLocation?: string | null;
  origin?: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type OnCreateReportSubscription = {
  __typename: "Report";
  id: string;
  name: string;
  testLocation: string;
  reportNum: string;
  lotNum: string;
  customerName: string;
  origin: string;
  stations: string;
  variety: string;
  attachmentUrl: string;
  dataRows?: Array<string | null> | null;
  reportTemplate?: {
    __typename: "ReportTemplate";
    templateId: string;
    localCompanyName?: string | null;
    localCompanyNameTranslation?: string | null;
    letterHeadImageName?: string | null;
    stampImageName?: string | null;
    address?: string | null;
    addressTranslation?: string | null;
    phone?: string | null;
    fax?: string | null;
    email?: string | null;
    testLocation?: string | null;
    origin?: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type OnUpdateReportSubscription = {
  __typename: "Report";
  id: string;
  name: string;
  testLocation: string;
  reportNum: string;
  lotNum: string;
  customerName: string;
  origin: string;
  stations: string;
  variety: string;
  attachmentUrl: string;
  dataRows?: Array<string | null> | null;
  reportTemplate?: {
    __typename: "ReportTemplate";
    templateId: string;
    localCompanyName?: string | null;
    localCompanyNameTranslation?: string | null;
    letterHeadImageName?: string | null;
    stampImageName?: string | null;
    address?: string | null;
    addressTranslation?: string | null;
    phone?: string | null;
    fax?: string | null;
    email?: string | null;
    testLocation?: string | null;
    origin?: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type OnDeleteReportSubscription = {
  __typename: "Report";
  id: string;
  name: string;
  testLocation: string;
  reportNum: string;
  lotNum: string;
  customerName: string;
  origin: string;
  stations: string;
  variety: string;
  attachmentUrl: string;
  dataRows?: Array<string | null> | null;
  reportTemplate?: {
    __typename: "ReportTemplate";
    templateId: string;
    localCompanyName?: string | null;
    localCompanyNameTranslation?: string | null;
    letterHeadImageName?: string | null;
    stampImageName?: string | null;
    address?: string | null;
    addressTranslation?: string | null;
    phone?: string | null;
    fax?: string | null;
    email?: string | null;
    testLocation?: string | null;
    origin?: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

@Injectable({
  providedIn: "root"
})
export class APIService {
  async CreateReportTemplate(
    input: CreateReportTemplateInput,
    condition?: ModelReportTemplateConditionInput
  ): Promise<CreateReportTemplateMutation> {
    const statement = `mutation CreateReportTemplate($input: CreateReportTemplateInput!, $condition: ModelReportTemplateConditionInput) {
        createReportTemplate(input: $input, condition: $condition) {
          __typename
          templateId
          localCompanyName
          localCompanyNameTranslation
          letterHeadImageName
          stampImageName
          address
          addressTranslation
          phone
          fax
          email
          testLocation
          origin
          id
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateReportTemplateMutation>response.data.createReportTemplate;
  }
  async UpdateReportTemplate(
    input: UpdateReportTemplateInput,
    condition?: ModelReportTemplateConditionInput
  ): Promise<UpdateReportTemplateMutation> {
    const statement = `mutation UpdateReportTemplate($input: UpdateReportTemplateInput!, $condition: ModelReportTemplateConditionInput) {
        updateReportTemplate(input: $input, condition: $condition) {
          __typename
          templateId
          localCompanyName
          localCompanyNameTranslation
          letterHeadImageName
          stampImageName
          address
          addressTranslation
          phone
          fax
          email
          testLocation
          origin
          id
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateReportTemplateMutation>response.data.updateReportTemplate;
  }
  async DeleteReportTemplate(
    input: DeleteReportTemplateInput,
    condition?: ModelReportTemplateConditionInput
  ): Promise<DeleteReportTemplateMutation> {
    const statement = `mutation DeleteReportTemplate($input: DeleteReportTemplateInput!, $condition: ModelReportTemplateConditionInput) {
        deleteReportTemplate(input: $input, condition: $condition) {
          __typename
          templateId
          localCompanyName
          localCompanyNameTranslation
          letterHeadImageName
          stampImageName
          address
          addressTranslation
          phone
          fax
          email
          testLocation
          origin
          id
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteReportTemplateMutation>response.data.deleteReportTemplate;
  }
  async CreateReport(
    input: CreateReportInput,
    condition?: ModelReportConditionInput
  ): Promise<CreateReportMutation> {
    const statement = `mutation CreateReport($input: CreateReportInput!, $condition: ModelReportConditionInput) {
        createReport(input: $input, condition: $condition) {
          __typename
          id
          name
          testLocation
          reportNum
          lotNum
          customerName
          origin
          stations
          variety
          attachmentUrl
          dataRows
          reportTemplate {
            __typename
            templateId
            localCompanyName
            localCompanyNameTranslation
            letterHeadImageName
            stampImageName
            address
            addressTranslation
            phone
            fax
            email
            testLocation
            origin
            id
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateReportMutation>response.data.createReport;
  }
  async UpdateReport(
    input: UpdateReportInput,
    condition?: ModelReportConditionInput
  ): Promise<UpdateReportMutation> {
    const statement = `mutation UpdateReport($input: UpdateReportInput!, $condition: ModelReportConditionInput) {
        updateReport(input: $input, condition: $condition) {
          __typename
          id
          name
          testLocation
          reportNum
          lotNum
          customerName
          origin
          stations
          variety
          attachmentUrl
          dataRows
          reportTemplate {
            __typename
            templateId
            localCompanyName
            localCompanyNameTranslation
            letterHeadImageName
            stampImageName
            address
            addressTranslation
            phone
            fax
            email
            testLocation
            origin
            id
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateReportMutation>response.data.updateReport;
  }
  async DeleteReport(
    input: DeleteReportInput,
    condition?: ModelReportConditionInput
  ): Promise<DeleteReportMutation> {
    const statement = `mutation DeleteReport($input: DeleteReportInput!, $condition: ModelReportConditionInput) {
        deleteReport(input: $input, condition: $condition) {
          __typename
          id
          name
          testLocation
          reportNum
          lotNum
          customerName
          origin
          stations
          variety
          attachmentUrl
          dataRows
          reportTemplate {
            __typename
            templateId
            localCompanyName
            localCompanyNameTranslation
            letterHeadImageName
            stampImageName
            address
            addressTranslation
            phone
            fax
            email
            testLocation
            origin
            id
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteReportMutation>response.data.deleteReport;
  }
  async GetReportTemplate(id: string): Promise<GetReportTemplateQuery> {
    const statement = `query GetReportTemplate($id: ID!) {
        getReportTemplate(id: $id) {
          __typename
          templateId
          localCompanyName
          localCompanyNameTranslation
          letterHeadImageName
          stampImageName
          address
          addressTranslation
          phone
          fax
          email
          testLocation
          origin
          id
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetReportTemplateQuery>response.data.getReportTemplate;
  }
  async ListReportTemplates(
    filter?: ModelReportTemplateFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListReportTemplatesQuery> {
    const statement = `query ListReportTemplates($filter: ModelReportTemplateFilterInput, $limit: Int, $nextToken: String) {
        listReportTemplates(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            templateId
            localCompanyName
            localCompanyNameTranslation
            letterHeadImageName
            stampImageName
            address
            addressTranslation
            phone
            fax
            email
            testLocation
            origin
            id
            createdAt
            updatedAt
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListReportTemplatesQuery>response.data.listReportTemplates;
  }
  async GetReport(id: string): Promise<GetReportQuery> {
    const statement = `query GetReport($id: ID!) {
        getReport(id: $id) {
          __typename
          id
          name
          testLocation
          reportNum
          lotNum
          customerName
          origin
          stations
          variety
          attachmentUrl
          dataRows
          reportTemplate {
            __typename
            templateId
            localCompanyName
            localCompanyNameTranslation
            letterHeadImageName
            stampImageName
            address
            addressTranslation
            phone
            fax
            email
            testLocation
            origin
            id
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetReportQuery>response.data.getReport;
  }
  async ListReports(
    filter?: ModelReportFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListReportsQuery> {
    const statement = `query ListReports($filter: ModelReportFilterInput, $limit: Int, $nextToken: String) {
        listReports(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            name
            testLocation
            reportNum
            lotNum
            customerName
            origin
            stations
            variety
            attachmentUrl
            dataRows
            createdAt
            updatedAt
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListReportsQuery>response.data.listReports;
  }
  async ReportsByAttachmentUrlAndName(
    attachmentUrl: string,
    name?: ModelStringKeyConditionInput,
    sortDirection?: ModelSortDirection,
    filter?: ModelReportFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ReportsByAttachmentUrlAndNameQuery> {
    const statement = `query ReportsByAttachmentUrlAndName($attachmentUrl: String!, $name: ModelStringKeyConditionInput, $sortDirection: ModelSortDirection, $filter: ModelReportFilterInput, $limit: Int, $nextToken: String) {
        reportsByAttachmentUrlAndName(
          attachmentUrl: $attachmentUrl
          name: $name
          sortDirection: $sortDirection
          filter: $filter
          limit: $limit
          nextToken: $nextToken
        ) {
          __typename
          items {
            __typename
            id
            name
            testLocation
            reportNum
            lotNum
            customerName
            origin
            stations
            variety
            attachmentUrl
            dataRows
            createdAt
            updatedAt
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {
      attachmentUrl
    };
    if (name) {
      gqlAPIServiceArguments.name = name;
    }
    if (sortDirection) {
      gqlAPIServiceArguments.sortDirection = sortDirection;
    }
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ReportsByAttachmentUrlAndNameQuery>(
      response.data.reportsByAttachmentUrlAndName
    );
  }
  OnCreateReportTemplateListener(
    filter?: ModelSubscriptionReportTemplateFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onCreateReportTemplate">
    >
  > {
    const statement = `subscription OnCreateReportTemplate($filter: ModelSubscriptionReportTemplateFilterInput) {
        onCreateReportTemplate(filter: $filter) {
          __typename
          templateId
          localCompanyName
          localCompanyNameTranslation
          letterHeadImageName
          stampImageName
          address
          addressTranslation
          phone
          fax
          email
          testLocation
          origin
          id
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<
        Pick<__SubscriptionContainer, "onCreateReportTemplate">
      >
    >;
  }

  OnUpdateReportTemplateListener(
    filter?: ModelSubscriptionReportTemplateFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onUpdateReportTemplate">
    >
  > {
    const statement = `subscription OnUpdateReportTemplate($filter: ModelSubscriptionReportTemplateFilterInput) {
        onUpdateReportTemplate(filter: $filter) {
          __typename
          templateId
          localCompanyName
          localCompanyNameTranslation
          letterHeadImageName
          stampImageName
          address
          addressTranslation
          phone
          fax
          email
          testLocation
          origin
          id
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<
        Pick<__SubscriptionContainer, "onUpdateReportTemplate">
      >
    >;
  }

  OnDeleteReportTemplateListener(
    filter?: ModelSubscriptionReportTemplateFilterInput
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onDeleteReportTemplate">
    >
  > {
    const statement = `subscription OnDeleteReportTemplate($filter: ModelSubscriptionReportTemplateFilterInput) {
        onDeleteReportTemplate(filter: $filter) {
          __typename
          templateId
          localCompanyName
          localCompanyNameTranslation
          letterHeadImageName
          stampImageName
          address
          addressTranslation
          phone
          fax
          email
          testLocation
          origin
          id
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<
        Pick<__SubscriptionContainer, "onDeleteReportTemplate">
      >
    >;
  }

  OnCreateReportListener(
    filter?: ModelSubscriptionReportFilterInput
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateReport">>
  > {
    const statement = `subscription OnCreateReport($filter: ModelSubscriptionReportFilterInput) {
        onCreateReport(filter: $filter) {
          __typename
          id
          name
          testLocation
          reportNum
          lotNum
          customerName
          origin
          stations
          variety
          attachmentUrl
          dataRows
          reportTemplate {
            __typename
            templateId
            localCompanyName
            localCompanyNameTranslation
            letterHeadImageName
            stampImageName
            address
            addressTranslation
            phone
            fax
            email
            testLocation
            origin
            id
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateReport">>
    >;
  }

  OnUpdateReportListener(
    filter?: ModelSubscriptionReportFilterInput
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateReport">>
  > {
    const statement = `subscription OnUpdateReport($filter: ModelSubscriptionReportFilterInput) {
        onUpdateReport(filter: $filter) {
          __typename
          id
          name
          testLocation
          reportNum
          lotNum
          customerName
          origin
          stations
          variety
          attachmentUrl
          dataRows
          reportTemplate {
            __typename
            templateId
            localCompanyName
            localCompanyNameTranslation
            letterHeadImageName
            stampImageName
            address
            addressTranslation
            phone
            fax
            email
            testLocation
            origin
            id
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateReport">>
    >;
  }

  OnDeleteReportListener(
    filter?: ModelSubscriptionReportFilterInput
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteReport">>
  > {
    const statement = `subscription OnDeleteReport($filter: ModelSubscriptionReportFilterInput) {
        onDeleteReport(filter: $filter) {
          __typename
          id
          name
          testLocation
          reportNum
          lotNum
          customerName
          origin
          stations
          variety
          attachmentUrl
          dataRows
          reportTemplate {
            __typename
            templateId
            localCompanyName
            localCompanyNameTranslation
            letterHeadImageName
            stampImageName
            address
            addressTranslation
            phone
            fax
            email
            testLocation
            origin
            id
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteReport">>
    >;
  }
}
