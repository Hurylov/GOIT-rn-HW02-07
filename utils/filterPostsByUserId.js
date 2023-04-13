function filterPostsByUserId(posts, uid) {
  return posts.filter((post) => post.userId === uid);
}
export default filterPostsByUserId;