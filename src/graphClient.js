import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

const httpLink = new HttpLink({
	uri: 'http://localhost:3000/graphql'
});
  
const wsLink = new GraphQLWsLink(createClient({
	url: 'ws://localhost:3000/graphql',
}));
  
  
const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === 'OperationDefinition' &&
			definition.operation === 'subscription'
		);
	},
	wsLink,
	httpLink,
);
  
const graphClient = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache()
});

export default graphClient