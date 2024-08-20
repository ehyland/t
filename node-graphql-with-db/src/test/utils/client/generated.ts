import gql from 'graphql-tag';
import type { GraphQLClient, RequestOptions } from 'graphql-request';
import { GraphQLError, print } from 'graphql'
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type GQLIncomingMessage = {
  __typename?: 'IncomingMessage';
  localId: Scalars['String']['output'];
  message: GQLMessage;
};

export type GQLMessage = {
  __typename?: 'Message';
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  sequence: Scalars['Int']['output'];
};

export type GQLMutation = {
  __typename?: 'Mutation';
  sendMessage: GQLIncomingMessage;
};


export type GQLMutationSendMessageArgs = {
  message: GQLNewMessage;
};

export type GQLNewMessage = {
  content: Scalars['String']['input'];
  localId: Scalars['String']['input'];
};

export type GQLQuery = {
  __typename?: 'Query';
  message: GQLMessage;
  messages: Array<GQLMessage>;
};


export type GQLQueryMessageArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQueryMessagesArgs = {
  fromSequenceNumber?: InputMaybe<Scalars['Int']['input']>;
};

export type GQLSubscription = {
  __typename?: 'Subscription';
  messageSubscription: Array<GQLIncomingMessage>;
};

export type GQLGetMessagesQueryVariables = Exact<{
  fromSequenceNumber?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GQLGetMessagesQuery = { __typename?: 'Query', messages: Array<{ __typename?: 'Message', id: string, sequence: number, content: string }> };

export type GQLGetMessageQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GQLGetMessageQuery = { __typename?: 'Query', message: { __typename?: 'Message', id: string, sequence: number, content: string } };

export type GQLSubscribeMessagesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type GQLSubscribeMessagesSubscription = { __typename?: 'Subscription', messageSubscription: Array<{ __typename?: 'IncomingMessage', localId: string, message: { __typename?: 'Message', id: string, sequence: number, content: string } }> };

export type GQLSendMessageMutationVariables = Exact<{
  input: GQLNewMessage;
}>;


export type GQLSendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'IncomingMessage', localId: string, message: { __typename?: 'Message', id: string, sequence: number, content: string } } };

export type GQLMessageFragment = { __typename?: 'Message', id: string, sequence: number, content: string };

export type GQLIncomingMessageFragment = { __typename?: 'IncomingMessage', localId: string, message: { __typename?: 'Message', id: string, sequence: number, content: string } };

export const Message = gql`
    fragment message on Message {
  id
  sequence
  content
}
    `;
export const IncomingMessage = gql`
    fragment incomingMessage on IncomingMessage {
  localId
  message {
    ...message
  }
}
    ${Message}`;
export const GetMessages = gql`
    query GetMessages($fromSequenceNumber: Int) {
  messages(fromSequenceNumber: $fromSequenceNumber) {
    ...message
  }
}
    ${Message}`;
export const GetMessage = gql`
    query GetMessage($id: ID!) {
  message(id: $id) {
    ...message
  }
}
    ${Message}`;
export const SubscribeMessages = gql`
    subscription SubscribeMessages {
  messageSubscription {
    ...incomingMessage
  }
}
    ${IncomingMessage}`;
export const SendMessage = gql`
    mutation SendMessage($input: NewMessage!) {
  sendMessage(message: $input) {
    ...incomingMessage
  }
}
    ${IncomingMessage}`;
export const MessageFragmentDoc = gql`
    fragment message on Message {
  id
  sequence
  content
}
    `;
export const IncomingMessageFragmentDoc = gql`
    fragment incomingMessage on IncomingMessage {
  localId
  message {
    ...message
  }
}
    ${MessageFragmentDoc}`;
export const GetMessagesDocument = gql`
    query GetMessages($fromSequenceNumber: Int) {
  messages(fromSequenceNumber: $fromSequenceNumber) {
    ...message
  }
}
    ${MessageFragmentDoc}`;
export const GetMessageDocument = gql`
    query GetMessage($id: ID!) {
  message(id: $id) {
    ...message
  }
}
    ${MessageFragmentDoc}`;
export const SubscribeMessagesDocument = gql`
    subscription SubscribeMessages {
  messageSubscription {
    ...incomingMessage
  }
}
    ${IncomingMessageFragmentDoc}`;
export const SendMessageDocument = gql`
    mutation SendMessage($input: NewMessage!) {
  sendMessage(message: $input) {
    ...incomingMessage
  }
}
    ${IncomingMessageFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();
const GetMessagesDocumentString = print(GetMessagesDocument);
const GetMessageDocumentString = print(GetMessageDocument);
const SubscribeMessagesDocumentString = print(SubscribeMessagesDocument);
const SendMessageDocumentString = print(SendMessageDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetMessages(variables?: GQLGetMessagesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GQLGetMessagesQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GQLGetMessagesQuery>(GetMessagesDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetMessages', 'query', variables);
    },
    GetMessage(variables: GQLGetMessageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GQLGetMessageQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GQLGetMessageQuery>(GetMessageDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetMessage', 'query', variables);
    },
    SubscribeMessages(variables?: GQLSubscribeMessagesSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GQLSubscribeMessagesSubscription; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GQLSubscribeMessagesSubscription>(SubscribeMessagesDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SubscribeMessages', 'subscription', variables);
    },
    SendMessage(variables: GQLSendMessageMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GQLSendMessageMutation; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GQLSendMessageMutation>(SendMessageDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SendMessage', 'mutation', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;