import { split, HttpLink, InMemoryCache, ApolloClient, gql, useSubscription } from '@apollo/client';
import produce from "immer";

import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { useEffect, useState } from 'react';
import Post from './Post';


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

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

function App() {
  const [posts, setPosts] = useState([])

  const getPosts = () => {
    client.query({
      query: gql`
      query {
        posts(findPostArgs: {} ) {
          id,
          content,
          user {
            name
          }
        }
      }`,})
    .then((result) => {
      setPosts(result.data.posts)
    });

  }

  const subscribePostAdded = () => {
    const data = client.subscribe({
      query: gql`
        subscription {
          postAdded {
            id,
            content,
            user {
              name
            }
          }
        }`
    })

    data.subscribe(
      ({ data }) => {
        setPosts(produce((draft) => {
          draft.unshift(data.postAdded)
        }))
      })
  }

  useEffect(() => {
    getPosts()
    subscribePostAdded()
  }, [])

  console.log('aaaaa', posts)

  return (
    <div className="App">
      {
        posts.map(post => <Post post={post} key={post.id} />)
      }
    </div>
  );
}

export default App;
