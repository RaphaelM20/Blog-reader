import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function HomePage() {
  const token = localStorage.getItem("authToken");
  const currentUserId = token ? jwtDecode(token).id : null;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  const handleLike = async (postId, likes) => {
    const alreadyLiked = likes.some((like) => like.userId === currentUserId);
    const method = alreadyLiked ? "DELETE" : "POST";

    await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/likes`, {
      method: method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`);

    const data = await response.json();
    setPosts(data);
  };

  return (
    <div className="container">
      <main>
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <Link to={`/posts/${post.id}`} className="post-title-link">
              <h2 className="post-title">{post.title}</h2>
            </Link>
            <p className="post-excerpt">{post.content.substring(0, 150)}</p>
            <Link to={`/posts/${post.id}`} className="read-more">
              Read more →
            </Link>
            {token && (
              <button
                onClick={() => handleLike(post.id, post.likes)}
                className={`action-btn ${post.likes.some((like) => like.userId === currentUserId) ? "action-liked" : "action-like"}`}
              >
                👍 {post.likes.length}
              </button>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}

export default HomePage;
