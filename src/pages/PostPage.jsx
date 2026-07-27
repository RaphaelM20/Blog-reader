import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function PostPage() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const { id } = useParams();

  const createComment = async (e) => {
    e.preventDefault();

    const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ content: commentContent }),
    });

    if (response.ok) {
      const newComment = await response.json();
      setComments([...comments, newComment]);
      setCommentContent("");
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data));
    fetch(`${import.meta.env.VITE_API_URL}/posts/${id}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, [id]);

  if (!post) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <Link to="/" className="back-link">
        ← Back to Posts
      </Link>
      <article className="post-full">
        <h1 className="post-full-title">{post.title}</h1>
        <p className="post-author">
          {post.user.firstName} {post.user.lastName}
        </p>
        <p className="post-date">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <div className="post-content">
          <p>{post.content}</p>
        </div>
      </article>

      <section className="comments-section">
        <h3 className="comments-title">Comments ({comments.length})</h3>
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <p className="comment-content">{comment.content}</p>
            </div>
          ))
        )}
      </section>

      {localStorage.getItem("authToken") ? (
        <form onSubmit={createComment} className="comment-form">
          <textarea
            className="comment-textarea"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            required
          />
          <button type="submit" className="auth-btn">Submit</button>
        </form>
      ) : (
        <p>
          Please <Link to="/login">log in</Link> to comment
        </p>
      )}
    </div>
  );
}

export default PostPage;
