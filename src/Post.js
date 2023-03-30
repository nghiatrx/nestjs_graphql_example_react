function Post({ post }) {
  return (
    <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      { post.content }, by { post.user.name }
    </div>
  )
}

export default Post