document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return;

  /* ========= VUES ========= */
  const viewsKey = `views_${id}`;
  let views = Number(localStorage.getItem(viewsKey) || 0);
  views++;
  localStorage.setItem(viewsKey, views);
  document.getElementById("viewCount").textContent = views;

  /* ========= LIKES ========= */
  const likeKey = `likes_${id}`;
  let likes = Number(localStorage.getItem(likeKey) || 0);
  document.getElementById("likeCount").textContent = likes;

  document.getElementById("likeBtn").addEventListener("click", () => {
    likes++;
    localStorage.setItem(likeKey, likes);
    document.getElementById("likeCount").textContent = likes;
  });

  /* ========= COMMENTAIRES ========= */
  const commentsKey = `comments_${id}`;
  const list = document.getElementById("commentList");
  const form = document.getElementById("commentForm");
  const input = document.getElementById("commentInput");

  const comments = JSON.parse(localStorage.getItem(commentsKey) || "[]");
  comments.forEach(addComment);

  form.addEventListener("submit", e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    comments.push(text);
    localStorage.setItem(commentsKey, JSON.stringify(comments));
    addComment(text);
    input.value = "";
  });

  function addComment(text) {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  }
});
