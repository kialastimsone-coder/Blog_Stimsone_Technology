document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return;

  /* =========================
     VUES
  ========================= */
  const viewsKey = `views_${id}`;
  let views = Number(localStorage.getItem(viewsKey) || 0) + 1;
  localStorage.setItem(viewsKey, views);
  document.getElementById("viewCount").textContent = views;

  /* =========================
     LIKES (UNIQUE)
  ========================= */
  const likesKey = `likes_${id}`;
  const likedKey = `liked_${id}`;

  let likes = Number(localStorage.getItem(likesKey) || 0);
  const liked = localStorage.getItem(likedKey) === "true";

  const likeBtn = document.getElementById("likeBtn");
  const likeCount = document.getElementById("likeCount");

  likeCount.textContent = likes;

  if (liked) {
    likeBtn.classList.add("liked");
    likeBtn.disabled = true;
  }

  likeBtn.addEventListener("click", () => {
    if (liked) return;

    likes++;
    localStorage.setItem(likesKey, likes);
    localStorage.setItem(likedKey, "true");

    likeCount.textContent = likes;
    likeBtn.classList.add("liked");
    likeBtn.disabled = true;
  });

  /* =========================
     COMMENTAIRES
  ========================= */
  const commentsKey = `comments_${id}`;
  const list = document.getElementById("commentList");
  const form = document.getElementById("commentForm");
  const input = document.getElementById("commentInput");

  const comments = JSON.parse(localStorage.getItem(commentsKey) || "[]");
  comments.forEach(addComment);

  form.addEventListener("submit", e => {
    e.preventDefault();
    const text = input.value.trim();
    if (text.length < 3) return;

    const comment = {
      text,
      date: new Date().toLocaleDateString("fr-FR")
    };

    comments.push(comment);
    localStorage.setItem(commentsKey, JSON.stringify(comments));
    addComment(comment);
    input.value = "";
  });

  function addComment(comment) {
    const li = document.createElement("li");
    li.innerHTML = `
      <p>${comment.text}</p>
      <span>${comment.date}</span>
    `;
    list.appendChild(li);
  }
});
