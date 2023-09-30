/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from '@angular/core';
import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api-graphql';
import { Observable } from 'zen-observable-ts';

export interface SubscriptionResponse<T> {
  value: GraphQLResult<T>;
}

export type __SubscriptionContainer = {
  onCreateReport: OnCreateReportSubscription;
  onUpdateReport: OnUpdateReportSubscription;
  onDeleteReport: OnDeleteReportSubscription;
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
  attachmentUrl?: string | null;
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
  and?: Array<ModelReportConditionInput | null> | null;
  or?: Array<ModelReportConditionInput | null> | null;
  not?: ModelReportConditionInput | null;
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

export enum ModelAttributeTypes {
  binary = 'binary',
  binarySet = 'binarySet',
  bool = 'bool',
  list = 'list',
  map = 'map',
  number = 'number',
  numberSet = 'numberSet',
  string = 'string',
  stringSet = 'stringSet',
  _null = '_null',
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

export type Report = {
  __typename: 'Report';
  id: string;
  name: string;
  testLocation: string;
  reportNum: string;
  lotNum: string;
  customerName: string;
  origin: string;
  stations: string;
  variety: string;
  attachmentUrl?: string | null;
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
};

export type DeleteReportInput = {
  id: string;
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
  and?: Array<ModelReportFilterInput | null> | null;
  or?: Array<ModelReportFilterInput | null> | null;
  not?: ModelReportFilterInput | null;
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

export type ModelReportConnection = {
  __typename: 'ModelReportConnection';
  items: Array<Report | null>;
  nextToken?: string | null;
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
  and?: Array<ModelSubscriptionReportFilterInput | null> | null;
  or?: Array<ModelSubscriptionReportFilterInput | null> | null;
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

export type CreateReportMutation = {
  __typename: 'Report';
  id: string;
  name: string;
  testLocation: string;
  reportNum: string;
  lotNum: string;
  customerName: string;
  origin: string;
  stations: string;
  variety: string;
  attachmentUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateReportMutation = {
  __typename: 'Report';
  id: string;
  name: string;
  testLocation: string;
  reportNum: string;
  lotNum: string;
  customerName: string;
  origin: string;
  stations: string;
  variety: string;
  attachmentUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DeleteReportMutation = {
  __typename: 'Report';
  id: string;
  name: string;
  testLocation: string;
  reportNum: string;
  lotNum: string;
  customerName: string;
  origin: string;
  stations: string;
  variety: string;
  attachmentUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GetReportQuery = {
  __typename: 'Report';
  id: string;
  name: string;
  testLocation: string;
  reportNum: string;
  lotNum: string;
  customerName: string;
  origin: string;
  stations: string;
  variety: string;
  attachmentUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ListReportsQuery = {
  __typename: 'ModelReportConnection';
  items: Array<{
    __typename: 'Report';
    id: string;
    name: string;
    testLocation: string;
    reportNum: string;
    lotNum: string;
    customerName: string;
    origin: string;
    stations: string;
    variety: string;
    attachmentUrl?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null>;
  nextToken?: string | null;
};

export type OnCreateReportSubscription = {
  __typename: 'Report';
  id: string;
  name: string;
  testLocation: string;
  reportNum: string;
  lotNum: string;
  customerName: string;
  origin: string;
  stations: string;
  variety: string;
  attachmentUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OnUpdateReportSubscription = {
  __typename: 'Report';
  id: string;
  name: string;
  testLocation: string;
  reportNum: string;
  lotNum: string;
  customerName: string;
  origin: string;
  stations: string;
  variety: string;
  attachmentUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OnDeleteReportSubscription = {
  __typename: 'Report';
  id: string;
  name: string;
  testLocation: string;
  reportNum: string;
  lotNum: string;
  customerName: string;
  origin: string;
  stations: string;
  variety: string;
  attachmentUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

@Injectable({
  providedIn: 'root',
})
export class APIService {
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
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input,
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
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input,
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
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input,
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteReportMutation>response.data.deleteReport;
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
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id,
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
  OnCreateReportListener(
    filter?: ModelSubscriptionReportFilterInput
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, 'onCreateReport'>>
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
      SubscriptionResponse<Pick<__SubscriptionContainer, 'onCreateReport'>>
    >;
  }

  OnUpdateReportListener(
    filter?: ModelSubscriptionReportFilterInput
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, 'onUpdateReport'>>
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
      SubscriptionResponse<Pick<__SubscriptionContainer, 'onUpdateReport'>>
    >;
  }

  OnDeleteReportListener(
    filter?: ModelSubscriptionReportFilterInput
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, 'onDeleteReport'>>
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
      SubscriptionResponse<Pick<__SubscriptionContainer, 'onDeleteReport'>>
    >;
  }
}
