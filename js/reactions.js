document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return;

  const viewsKey = `views_${id}`;
  const likesKey = `likes_${id}`;
  const commentsKey = `comments_${id}`;

  const viewsEl = document.getElementById("viewCount");
  const likeEl = document.getElementById("likeCount");

  let views = Number(localStorage.getItem(viewsKey) || 0) + 1;
  localStorage.setItem(viewsKey, views);
  viewsEl.textContent = views;

  let likes = Number(localStorage.getItem(likesKey) || 0);
  likeEl.textContent = likes;

  document.getElementById("likeBtn").onclick = () => {
    likes++;
    localStorage.setItem(likesKey, likes);
    likeEl.textContent = likes;
  };

  const list = document.getElementById("commentList");
  const form = document.getElementById("commentForm");
  const input = document.getElementById("commentInput");

  const comments = JSON.parse(localStorage.getItem(commentsKey) || "[]");
  comments.forEach(add);

  form.onsubmit = e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    comments.push(text);
    localStorage.setItem(commentsKey, JSON.stringify(comments));
    add(text);
    input.value = "";
  };

  function add(text) {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  }
});
