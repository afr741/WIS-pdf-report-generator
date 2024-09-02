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
  onCreateLabs: OnCreateLabsSubscription;
  onUpdateLabs: OnUpdateLabsSubscription;
  onDeleteLabs: OnDeleteLabsSubscription;
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
  labLocation?: string | null;
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
  labLocation?: ModelStringInput | null;
  and?: Array<ModelReportTemplateConditionInput | null> | null;
  or?: Array<ModelReportTemplateConditionInput | null> | null;
  not?: ModelReportTemplateConditionInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  owner?: ModelStringInput | null;
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
  labLocation?: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
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
  labLocation?: string | null;
  id: string;
};

export type DeleteReportTemplateInput = {
  id: string;
};

export type CreateReportInput = {
  id?: string | null;
  name: string;
  email: string;
  labLocation: string;
  hviVersion: string;
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
  email?: ModelStringInput | null;
  labLocation?: ModelStringInput | null;
  hviVersion?: ModelStringInput | null;
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
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  owner?: ModelStringInput | null;
};

export type Report = {
  __typename: "Report";
  id: string;
  name: string;
  email: string;
  labLocation: string;
  hviVersion: string;
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
  email?: string | null;
  labLocation?: string | null;
  hviVersion?: string | null;
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
  hviVersion: string;
};

export type ModelUserInfoConditionInput = {
  labLocation?: ModelStringInput | null;
  hviVersion?: ModelStringInput | null;
  and?: Array<ModelUserInfoConditionInput | null> | null;
  or?: Array<ModelUserInfoConditionInput | null> | null;
  not?: ModelUserInfoConditionInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  owner?: ModelStringInput | null;
};

export type UserInfo = {
  __typename: "UserInfo";
  id: string;
  labLocation: string;
  hviVersion: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type UpdateUserInfoInput = {
  id: string;
  labLocation?: string | null;
  hviVersion?: string | null;
};

export type DeleteUserInfoInput = {
  id: string;
};

export type CreateLabsInput = {
  labCountry: string;
  labCode: string;
  label: string;
  defaultHVIProcessingVersion: string;
  id?: string | null;
};

export type ModelLabsConditionInput = {
  labCountry?: ModelStringInput | null;
  labCode?: ModelStringInput | null;
  label?: ModelStringInput | null;
  defaultHVIProcessingVersion?: ModelStringInput | null;
  and?: Array<ModelLabsConditionInput | null> | null;
  or?: Array<ModelLabsConditionInput | null> | null;
  not?: ModelLabsConditionInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  owner?: ModelStringInput | null;
};

export type Labs = {
  __typename: "Labs";
  labCountry: string;
  labCode: string;
  label: string;
  defaultHVIProcessingVersion: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type UpdateLabsInput = {
  labCountry?: string | null;
  labCode?: string | null;
  label?: string | null;
  defaultHVIProcessingVersion?: string | null;
  id: string;
};

export type DeleteLabsInput = {
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
  labLocation?: ModelStringInput | null;
  id?: ModelIDInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelReportTemplateFilterInput | null> | null;
  or?: Array<ModelReportTemplateFilterInput | null> | null;
  not?: ModelReportTemplateFilterInput | null;
  owner?: ModelStringInput | null;
};

export type ModelReportTemplateConnection = {
  __typename: "ModelReportTemplateConnection";
  items: Array<ReportTemplate | null>;
  nextToken?: string | null;
};

export type ModelReportFilterInput = {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  email?: ModelStringInput | null;
  labLocation?: ModelStringInput | null;
  hviVersion?: ModelStringInput | null;
  reportNum?: ModelStringInput | null;
  lotNum?: ModelStringInput | null;
  customerName?: ModelStringInput | null;
  origin?: ModelStringInput | null;
  stations?: ModelStringInput | null;
  variety?: ModelStringInput | null;
  attachmentUrl?: ModelStringInput | null;
  dataRows?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelReportFilterInput | null> | null;
  or?: Array<ModelReportFilterInput | null> | null;
  not?: ModelReportFilterInput | null;
  owner?: ModelStringInput | null;
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
  hviVersion?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelUserInfoFilterInput | null> | null;
  or?: Array<ModelUserInfoFilterInput | null> | null;
  not?: ModelUserInfoFilterInput | null;
  owner?: ModelStringInput | null;
};

export type ModelUserInfoConnection = {
  __typename: "ModelUserInfoConnection";
  items: Array<UserInfo | null>;
  nextToken?: string | null;
};

export type ModelLabsFilterInput = {
  labCountry?: ModelStringInput | null;
  labCode?: ModelStringInput | null;
  label?: ModelStringInput | null;
  defaultHVIProcessingVersion?: ModelStringInput | null;
  id?: ModelIDInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelLabsFilterInput | null> | null;
  or?: Array<ModelLabsFilterInput | null> | null;
  not?: ModelLabsFilterInput | null;
  owner?: ModelStringInput | null;
};

export type ModelLabsConnection = {
  __typename: "ModelLabsConnection";
  items: Array<Labs | null>;
  nextToken?: string | null;
};

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
  labLocation?: ModelSubscriptionStringInput | null;
  id?: ModelSubscriptionIDInput | null;
  createdAt?: ModelSubscriptionStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionReportTemplateFilterInput | null> | null;
  or?: Array<ModelSubscriptionReportTemplateFilterInput | null> | null;
  owner?: ModelStringInput | null;
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
  email?: ModelSubscriptionStringInput | null;
  labLocation?: ModelSubscriptionStringInput | null;
  hviVersion?: ModelSubscriptionStringInput | null;
  reportNum?: ModelSubscriptionStringInput | null;
  lotNum?: ModelSubscriptionStringInput | null;
  customerName?: ModelSubscriptionStringInput | null;
  origin?: ModelSubscriptionStringInput | null;
  stations?: ModelSubscriptionStringInput | null;
  variety?: ModelSubscriptionStringInput | null;
  attachmentUrl?: ModelSubscriptionStringInput | null;
  dataRows?: ModelSubscriptionStringInput | null;
  createdAt?: ModelSubscriptionStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionReportFilterInput | null> | null;
  or?: Array<ModelSubscriptionReportFilterInput | null> | null;
  owner?: ModelStringInput | null;
};

export type ModelSubscriptionUserInfoFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  labLocation?: ModelSubscriptionStringInput | null;
  hviVersion?: ModelSubscriptionStringInput | null;
  createdAt?: ModelSubscriptionStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionUserInfoFilterInput | null> | null;
  or?: Array<ModelSubscriptionUserInfoFilterInput | null> | null;
  owner?: ModelStringInput | null;
};

export type ModelSubscriptionLabsFilterInput = {
  labCountry?: ModelSubscriptionStringInput | null;
  labCode?: ModelSubscriptionStringInput | null;
  label?: ModelSubscriptionStringInput | null;
  defaultHVIProcessingVersion?: ModelSubscriptionStringInput | null;
  id?: ModelSubscriptionIDInput | null;
  createdAt?: ModelSubscriptionStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionLabsFilterInput | null> | null;
  or?: Array<ModelSubscriptionLabsFilterInput | null> | null;
  owner?: ModelStringInput | null;
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
  labLocation?: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
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
  labLocation?: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
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
  labLocation?: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type CreateReportMutation = {
  __typename: "Report";
  id: string;
  name: string;
  email: string;
  labLocation: string;
  hviVersion: string;
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
  email: string;
  labLocation: string;
  hviVersion: string;
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
  email: string;
  labLocation: string;
  hviVersion: string;
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
  hviVersion: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type UpdateUserInfoMutation = {
  __typename: "UserInfo";
  id: string;
  labLocation: string;
  hviVersion: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type DeleteUserInfoMutation = {
  __typename: "UserInfo";
  id: string;
  labLocation: string;
  hviVersion: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type CreateLabsMutation = {
  __typename: "Labs";
  labCountry: string;
  labCode: string;
  label: string;
  defaultHVIProcessingVersion: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type UpdateLabsMutation = {
  __typename: "Labs";
  labCountry: string;
  labCode: string;
  label: string;
  defaultHVIProcessingVersion: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type DeleteLabsMutation = {
  __typename: "Labs";
  labCountry: string;
  labCode: string;
  label: string;
  defaultHVIProcessingVersion: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
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
  labLocation?: string | null;
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
    labLocation?: string | null;
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
  email: string;
  labLocation: string;
  hviVersion: string;
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
    email: string;
    labLocation: string;
    hviVersion: string;
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
    email: string;
    labLocation: string;
    hviVersion: string;
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
    hviVersion: string;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
  } | null>;
  nextToken?: string | null;
};

export type GetLabsQuery = {
  __typename: "Labs";
  labCountry: string;
  labCode: string;
  label: string;
  defaultHVIProcessingVersion: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type ListLabsQuery = {
  __typename: "ModelLabsConnection";
  items: Array<{
    __typename: "Labs";
    labCountry: string;
    labCode: string;
    label: string;
    defaultHVIProcessingVersion: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
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
  labLocation?: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
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
  labLocation?: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
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
  labLocation?: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type OnCreateReportSubscription = {
  __typename: "Report";
  id: string;
  name: string;
  email: string;
  labLocation: string;
  hviVersion: string;
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
  email: string;
  labLocation: string;
  hviVersion: string;
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
  email: string;
  labLocation: string;
  hviVersion: string;
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
  hviVersion: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type OnUpdateUserInfoSubscription = {
  __typename: "UserInfo";
  id: string;
  labLocation: string;
  hviVersion: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type OnDeleteUserInfoSubscription = {
  __typename: "UserInfo";
  id: string;
  labLocation: string;
  hviVersion: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type OnCreateLabsSubscription = {
  __typename: "Labs";
  labCountry: string;
  labCode: string;
  label: string;
  defaultHVIProcessingVersion: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type OnUpdateLabsSubscription = {
  __typename: "Labs";
  labCountry: string;
  labCode: string;
  label: string;
  defaultHVIProcessingVersion: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type OnDeleteLabsSubscription = {
  __typename: "Labs";
  labCountry: string;
  labCode: string;
  label: string;
  defaultHVIProcessingVersion: string;
  id: string;
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
          labLocation
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
          labLocation
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
          labLocation
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
          email
          labLocation
          hviVersion
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
          email
          labLocation
          hviVersion
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
          email
          labLocation
          hviVersion
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
  async CreateLabs(
    input: CreateLabsInput,
    condition?: ModelLabsConditionInput
  ): Promise<CreateLabsMutation> {
    const statement = `mutation CreateLabs($input: CreateLabsInput!, $condition: ModelLabsConditionInput) {
        createLabs(input: $input, condition: $condition) {
          __typename
          labCountry
          labCode
          label
          defaultHVIProcessingVersion
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
    return <CreateLabsMutation>response.data.createLabs;
  }
  async UpdateLabs(
    input: UpdateLabsInput,
    condition?: ModelLabsConditionInput
  ): Promise<UpdateLabsMutation> {
    const statement = `mutation UpdateLabs($input: UpdateLabsInput!, $condition: ModelLabsConditionInput) {
        updateLabs(input: $input, condition: $condition) {
          __typename
          labCountry
          labCode
          label
          defaultHVIProcessingVersion
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
    return <UpdateLabsMutation>response.data.updateLabs;
  }
  async DeleteLabs(
    input: DeleteLabsInput,
    condition?: ModelLabsConditionInput
  ): Promise<DeleteLabsMutation> {
    const statement = `mutation DeleteLabs($input: DeleteLabsInput!, $condition: ModelLabsConditionInput) {
        deleteLabs(input: $input, condition: $condition) {
          __typename
          labCountry
          labCode
          label
          defaultHVIProcessingVersion
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
    return <DeleteLabsMutation>response.data.deleteLabs;
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
          labLocation
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
            labLocation
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
          email
          labLocation
          hviVersion
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
            email
            labLocation
            hviVersion
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
            email
            labLocation
            hviVersion
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
  async GetLabs(id: string): Promise<GetLabsQuery> {
    const statement = `query GetLabs($id: ID!) {
        getLabs(id: $id) {
          __typename
          labCountry
          labCode
          label
          defaultHVIProcessingVersion
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
    return <GetLabsQuery>response.data.getLabs;
  }
  async ListLabs(
    filter?: ModelLabsFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListLabsQuery> {
    const statement = `query ListLabs($filter: ModelLabsFilterInput, $limit: Int, $nextToken: String) {
        listLabs(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            labCountry
            labCode
            label
            defaultHVIProcessingVersion
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
    return <ListLabsQuery>response.data.listLabs;
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
          labLocation
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
          labLocation
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
          labLocation
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
          email
          labLocation
          hviVersion
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
          email
          labLocation
          hviVersion
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
          email
          labLocation
          hviVersion
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

  OnCreateLabsListener(
    filter?: ModelSubscriptionLabsFilterInput,
    owner?: string
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateLabs">>
  > {
    const statement = `subscription OnCreateLabs($filter: ModelSubscriptionLabsFilterInput, $owner: String) {
        onCreateLabs(filter: $filter, owner: $owner) {
          __typename
          labCountry
          labCode
          label
          defaultHVIProcessingVersion
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
      SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateLabs">>
    >;
  }

  OnUpdateLabsListener(
    filter?: ModelSubscriptionLabsFilterInput,
    owner?: string
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateLabs">>
  > {
    const statement = `subscription OnUpdateLabs($filter: ModelSubscriptionLabsFilterInput, $owner: String) {
        onUpdateLabs(filter: $filter, owner: $owner) {
          __typename
          labCountry
          labCode
          label
          defaultHVIProcessingVersion
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
      SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateLabs">>
    >;
  }

  OnDeleteLabsListener(
    filter?: ModelSubscriptionLabsFilterInput,
    owner?: string
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteLabs">>
  > {
    const statement = `subscription OnDeleteLabs($filter: ModelSubscriptionLabsFilterInput, $owner: String) {
        onDeleteLabs(filter: $filter, owner: $owner) {
          __typename
          labCountry
          labCode
          label
          defaultHVIProcessingVersion
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
      SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteLabs">>
    >;
  }
}
