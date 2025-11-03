import type { GraphQLResolveInfo } from 'graphql';
import type { Context } from '~/server/graphql/context';
export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  channel: Scalars['String']['input'];
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
  channel: Scalars['String']['input'];
  fromSequenceNumber?: InputMaybe<Scalars['Int']['input']>;
};

export type GQLSubscription = {
  __typename?: 'Subscription';
  messageSubscription: Array<GQLIncomingMessage>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type GQLResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  IncomingMessage: ResolverTypeWrapper<GQLIncomingMessage>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Message: ResolverTypeWrapper<GQLMessage>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  NewMessage: GQLNewMessage;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<Record<PropertyKey, never>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type GQLResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  ID: Scalars['ID']['output'];
  IncomingMessage: GQLIncomingMessage;
  Int: Scalars['Int']['output'];
  Message: GQLMessage;
  Mutation: Record<PropertyKey, never>;
  NewMessage: GQLNewMessage;
  Query: Record<PropertyKey, never>;
  String: Scalars['String']['output'];
  Subscription: Record<PropertyKey, never>;
}>;

export type GQLIncomingMessageResolvers<ContextType = Context, ParentType extends GQLResolversParentTypes['IncomingMessage'] = GQLResolversParentTypes['IncomingMessage']> = ResolversObject<{
  localId?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<GQLResolversTypes['Message'], ParentType, ContextType>;
}>;

export type GQLMessageResolvers<ContextType = Context, ParentType extends GQLResolversParentTypes['Message'] = GQLResolversParentTypes['Message']> = ResolversObject<{
  content?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  sequence?: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
}>;

export type GQLMutationResolvers<ContextType = Context, ParentType extends GQLResolversParentTypes['Mutation'] = GQLResolversParentTypes['Mutation']> = ResolversObject<{
  sendMessage?: Resolver<GQLResolversTypes['IncomingMessage'], ParentType, ContextType, RequireFields<GQLMutationSendMessageArgs, 'message'>>;
}>;

export type GQLQueryResolvers<ContextType = Context, ParentType extends GQLResolversParentTypes['Query'] = GQLResolversParentTypes['Query']> = ResolversObject<{
  message?: Resolver<GQLResolversTypes['Message'], ParentType, ContextType, RequireFields<GQLQueryMessageArgs, 'id'>>;
  messages?: Resolver<Array<GQLResolversTypes['Message']>, ParentType, ContextType, RequireFields<GQLQueryMessagesArgs, 'channel'>>;
}>;

export type GQLSubscriptionResolvers<ContextType = Context, ParentType extends GQLResolversParentTypes['Subscription'] = GQLResolversParentTypes['Subscription']> = ResolversObject<{
  messageSubscription?: SubscriptionResolver<Array<GQLResolversTypes['IncomingMessage']>, "messageSubscription", ParentType, ContextType>;
}>;

export type GQLResolvers<ContextType = Context> = ResolversObject<{
  IncomingMessage?: GQLIncomingMessageResolvers<ContextType>;
  Message?: GQLMessageResolvers<ContextType>;
  Mutation?: GQLMutationResolvers<ContextType>;
  Query?: GQLQueryResolvers<ContextType>;
  Subscription?: GQLSubscriptionResolvers<ContextType>;
}>;

