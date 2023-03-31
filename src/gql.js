import { gql } from '@apollo/client';

export const QUERY_POSTS = gql`
	query {
		posts(findPostArgs: {} ) {
			id,
			content,
			user {
				name
			}
		}
	}`
	
export const SUBSCRIBE_POST_ADDED = gql`
	subscription {
		postAdded {
				id,
				content,
				user {
				name
				}
		}
	}`

