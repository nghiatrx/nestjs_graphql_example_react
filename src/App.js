import React from 'react';
import produce from "immer";
import { useEffect, useState } from 'react';
import Post from './Post';
import graphClient from './graphClient';
import { QUERY_POSTS, SUBSCRIBE_POST_ADDED } from "./gql";

function App() {
  const [posts, setPosts] = useState([])

  const getPosts = () => {
    graphClient.query({ query: QUERY_POSTS }).then(({ data }) => setPosts(data.posts));
  }

  const subscribePostAdded = () => {
    graphClient
      .subscribe({ query: SUBSCRIBE_POST_ADDED })
      .subscribe(({ data }) => {
        setPosts(produce(draft => {
          draft.unshift(data.postAdded)
        }))
      })
  }

  useEffect(() => {
    getPosts()
    subscribePostAdded()
  }, [])

  return (
    <div className="App">
      {
        posts.map(post => <Post post={post} key={post.id} />)
      }
    </div>
  );
}

export default App;
