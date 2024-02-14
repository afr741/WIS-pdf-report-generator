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
  onCreateUserInfo: OnCreateUserInfoSubscription;
  onUpdateUserInfo: OnUpdateUserInfoSubscription;
  onDeleteUserInfo: OnDeleteUserInfoSubscription;
};

export type CreateReportTemplateInput = {
  templateId: string;
  countryCode: string;
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
  countryCode?: ModelStringInput | null;
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
  countryCode: string;
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
  owner?: string | null;
};

export type UpdateReportTemplateInput = {
  templateId?: string | null;
  countryCode?: string | null;
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
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
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

export type CreateUserInfoInput = {
  id?: string | null;
  labLocation: string;
  countryCode: string;
  hviVersion: string;
};

export type ModelUserInfoConditionInput = {
  labLocation?: ModelStringInput | null;
  countryCode?: ModelStringInput | null;
  hviVersion?: ModelStringInput | null;
  and?: Array<ModelUserInfoConditionInput | null> | null;
  or?: Array<ModelUserInfoConditionInput | null> | null;
  not?: ModelUserInfoConditionInput | null;
};

export type UserInfo = {
  __typename: "UserInfo";
  id: string;
  labLocation: string;
  countryCode: string;
  hviVersion: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type UpdateUserInfoInput = {
  id: string;
  labLocation?: string | null;
  countryCode?: string | null;
  hviVersion?: string | null;
};

export type DeleteUserInfoInput = {
  id: string;
};

export type ModelReportTemplateFilterInput = {
  templateId?: ModelIDInput | null;
  countryCode?: ModelStringInput | null;
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

export type ModelUserInfoFilterInput = {
  id?: ModelIDInput | null;
  labLocation?: ModelStringInput | null;
  countryCode?: ModelStringInput | null;
  hviVersion?: ModelStringInput | null;
  and?: Array<ModelUserInfoFilterInput | null> | null;
  or?: Array<ModelUserInfoFilterInput | null> | null;
  not?: ModelUserInfoFilterInput | null;
};

export type ModelUserInfoConnection = {
  __typename: "ModelUserInfoConnection";
  items: Array<UserInfo | null>;
  nextToken?: string | null;
};

export type ModelSubscriptionReportTemplateFilterInput = {
  templateId?: ModelSubscriptionIDInput | null;
  countryCode?: ModelSubscriptionStringInput | null;
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

export type ModelSubscriptionUserInfoFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  labLocation?: ModelSubscriptionStringInput | null;
  countryCode?: ModelSubscriptionStringInput | null;
  hviVersion?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionUserInfoFilterInput | null> | null;
  or?: Array<ModelSubscriptionUserInfoFilterInput | null> | null;
};

export type CreateReportTemplateMutation = {
  __typename: "ReportTemplate";
  templateId: string;
  countryCode: string;
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
  owner?: string | null;
};

export type UpdateReportTemplateMutation = {
  __typename: "ReportTemplate";
  templateId: string;
  countryCode: string;
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
  owner?: string | null;
};

export type DeleteReportTemplateMutation = {
  __typename: "ReportTemplate";
  templateId: string;
  countryCode: string;
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
  owner?: string | null;
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
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
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
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
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
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type CreateUserInfoMutation = {
  __typename: "UserInfo";
  id: string;
  labLocation: string;
  countryCode: string;
  hviVersion: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type UpdateUserInfoMutation = {
  __typename: "UserInfo";
  id: string;
  labLocation: string;
  countryCode: string;
  hviVersion: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type DeleteUserInfoMutation = {
  __typename: "UserInfo";
  id: string;
  labLocation: string;
  countryCode: string;
  hviVersion: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type GetReportTemplateQuery = {
  __typename: "ReportTemplate";
  templateId: string;
  countryCode: string;
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
  owner?: string | null;
};

export type ListReportTemplatesQuery = {
  __typename: "ModelReportTemplateConnection";
  items: Array<{
    __typename: "ReportTemplate";
    templateId: string;
    countryCode: string;
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
    owner?: string | null;
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
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
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
    owner?: string | null;
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
    owner?: string | null;
  } | null>;
  nextToken?: string | null;
};

export type GetUserInfoQuery = {
  __typename: "UserInfo";
  id: string;
  labLocation: string;
  countryCode: string;
  hviVersion: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type ListUserInfosQuery = {
  __typename: "ModelUserInfoConnection";
  items: Array<{
    __typename: "UserInfo";
    id: string;
    labLocation: string;
    countryCode: string;
    hviVersion: string;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
  } | null>;
  nextToken?: string | null;
};

export type OnCreateReportTemplateSubscription = {
  __typename: "ReportTemplate";
  templateId: string;
  countryCode: string;
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
  owner?: string | null;
};

export type OnUpdateReportTemplateSubscription = {
  __typename: "ReportTemplate";
  templateId: string;
  countryCode: string;
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
  owner?: string | null;
};

export type OnDeleteReportTemplateSubscription = {
  __typename: "ReportTemplate";
  templateId: string;
  countryCode: string;
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
  owner?: string | null;
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
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
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
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
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
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type OnCreateUserInfoSubscription = {
  __typename: "UserInfo";
  id: string;
  labLocation: string;
  countryCode: string;
  hviVersion: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type OnUpdateUserInfoSubscription = {
  __typename: "UserInfo";
  id: string;
  labLocation: string;
  countryCode: string;
  hviVersion: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type OnDeleteUserInfoSubscription = {
  __typename: "UserInfo";
  id: string;
  labLocation: string;
  countryCode: string;
  hviVersion: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
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
          countryCode
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
          owner
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
          countryCode
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
          owner
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
          countryCode
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
          owner
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
          createdAt
          updatedAt
          owner
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
          createdAt
          updatedAt
          owner
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
          createdAt
          updatedAt
          owner
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
  async CreateUserInfo(
    input: CreateUserInfoInput,
    condition?: ModelUserInfoConditionInput
  ): Promise<CreateUserInfoMutation> {
    const statement = `mutation CreateUserInfo($input: CreateUserInfoInput!, $condition: ModelUserInfoConditionInput) {
        createUserInfo(input: $input, condition: $condition) {
          __typename
          id
          labLocation
          countryCode
          hviVersion
          createdAt
          updatedAt
          owner
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
    return <CreateUserInfoMutation>response.data.createUserInfo;
  }
  async UpdateUserInfo(
    input: UpdateUserInfoInput,
    condition?: ModelUserInfoConditionInput
  ): Promise<UpdateUserInfoMutation> {
    const statement = `mutation UpdateUserInfo($input: UpdateUserInfoInput!, $condition: ModelUserInfoConditionInput) {
        updateUserInfo(input: $input, condition: $condition) {
          __typename
          id
          labLocation
          countryCode
          hviVersion
          createdAt
          updatedAt
          owner
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
    return <UpdateUserInfoMutation>response.data.updateUserInfo;
  }
  async DeleteUserInfo(
    input: DeleteUserInfoInput,
    condition?: ModelUserInfoConditionInput
  ): Promise<DeleteUserInfoMutation> {
    const statement = `mutation DeleteUserInfo($input: DeleteUserInfoInput!, $condition: ModelUserInfoConditionInput) {
        deleteUserInfo(input: $input, condition: $condition) {
          __typename
          id
          labLocation
          countryCode
          hviVersion
          createdAt
          updatedAt
          owner
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
    return <DeleteUserInfoMutation>response.data.deleteUserInfo;
  }
  async GetReportTemplate(id: string): Promise<GetReportTemplateQuery> {
    const statement = `query GetReportTemplate($id: ID!) {
        getReportTemplate(id: $id) {
          __typename
          templateId
          countryCode
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
          owner
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
            countryCode
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
            owner
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
          createdAt
          updatedAt
          owner
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
            owner
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
            owner
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
  async GetUserInfo(id: string): Promise<GetUserInfoQuery> {
    const statement = `query GetUserInfo($id: ID!) {
        getUserInfo(id: $id) {
          __typename
          id
          labLocation
          countryCode
          hviVersion
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetUserInfoQuery>response.data.getUserInfo;
  }
  async ListUserInfos(
    filter?: ModelUserInfoFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListUserInfosQuery> {
    const statement = `query ListUserInfos($filter: ModelUserInfoFilterInput, $limit: Int, $nextToken: String) {
        listUserInfos(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            labLocation
            countryCode
            hviVersion
            createdAt
            updatedAt
            owner
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
    return <ListUserInfosQuery>response.data.listUserInfos;
  }
  OnCreateReportTemplateListener(
    filter?: ModelSubscriptionReportTemplateFilterInput,
    owner?: string
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onCreateReportTemplate">
    >
  > {
    const statement = `subscription OnCreateReportTemplate($filter: ModelSubscriptionReportTemplateFilterInput, $owner: String) {
        onCreateReportTemplate(filter: $filter, owner: $owner) {
          __typename
          templateId
          countryCode
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
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (owner) {
      gqlAPIServiceArguments.owner = owner;
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
    filter?: ModelSubscriptionReportTemplateFilterInput,
    owner?: string
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onUpdateReportTemplate">
    >
  > {
    const statement = `subscription OnUpdateReportTemplate($filter: ModelSubscriptionReportTemplateFilterInput, $owner: String) {
        onUpdateReportTemplate(filter: $filter, owner: $owner) {
          __typename
          templateId
          countryCode
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
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (owner) {
      gqlAPIServiceArguments.owner = owner;
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
    filter?: ModelSubscriptionReportTemplateFilterInput,
    owner?: string
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onDeleteReportTemplate">
    >
  > {
    const statement = `subscription OnDeleteReportTemplate($filter: ModelSubscriptionReportTemplateFilterInput, $owner: String) {
        onDeleteReportTemplate(filter: $filter, owner: $owner) {
          __typename
          templateId
          countryCode
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
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (owner) {
      gqlAPIServiceArguments.owner = owner;
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
    filter?: ModelSubscriptionReportFilterInput,
    owner?: string
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateReport">>
  > {
    const statement = `subscription OnCreateReport($filter: ModelSubscriptionReportFilterInput, $owner: String) {
        onCreateReport(filter: $filter, owner: $owner) {
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
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (owner) {
      gqlAPIServiceArguments.owner = owner;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateReport">>
    >;
  }

  OnUpdateReportListener(
    filter?: ModelSubscriptionReportFilterInput,
    owner?: string
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateReport">>
  > {
    const statement = `subscription OnUpdateReport($filter: ModelSubscriptionReportFilterInput, $owner: String) {
        onUpdateReport(filter: $filter, owner: $owner) {
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
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (owner) {
      gqlAPIServiceArguments.owner = owner;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateReport">>
    >;
  }

  OnDeleteReportListener(
    filter?: ModelSubscriptionReportFilterInput,
    owner?: string
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteReport">>
  > {
    const statement = `subscription OnDeleteReport($filter: ModelSubscriptionReportFilterInput, $owner: String) {
        onDeleteReport(filter: $filter, owner: $owner) {
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
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (owner) {
      gqlAPIServiceArguments.owner = owner;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteReport">>
    >;
  }

  OnCreateUserInfoListener(
    filter?: ModelSubscriptionUserInfoFilterInput,
    owner?: string
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateUserInfo">>
  > {
    const statement = `subscription OnCreateUserInfo($filter: ModelSubscriptionUserInfoFilterInput, $owner: String) {
        onCreateUserInfo(filter: $filter, owner: $owner) {
          __typename
          id
          labLocation
          countryCode
          hviVersion
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (owner) {
      gqlAPIServiceArguments.owner = owner;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateUserInfo">>
    >;
  }

  OnUpdateUserInfoListener(
    filter?: ModelSubscriptionUserInfoFilterInput,
    owner?: string
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateUserInfo">>
  > {
    const statement = `subscription OnUpdateUserInfo($filter: ModelSubscriptionUserInfoFilterInput, $owner: String) {
        onUpdateUserInfo(filter: $filter, owner: $owner) {
          __typename
          id
          labLocation
          countryCode
          hviVersion
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (owner) {
      gqlAPIServiceArguments.owner = owner;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateUserInfo">>
    >;
  }

  OnDeleteUserInfoListener(
    filter?: ModelSubscriptionUserInfoFilterInput,
    owner?: string
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteUserInfo">>
  > {
    const statement = `subscription OnDeleteUserInfo($filter: ModelSubscriptionUserInfoFilterInput, $owner: String) {
        onDeleteUserInfo(filter: $filter, owner: $owner) {
          __typename
          id
          labLocation
          countryCode
          hviVersion
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (owner) {
      gqlAPIServiceArguments.owner = owner;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteUserInfo">>
    >;
  }
}
