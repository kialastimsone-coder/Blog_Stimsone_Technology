document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);
  const articleId = params.get("id");

  if (!articleId) return;

  /* ======================
     VUES
  ====================== */
  const viewKey = `views-${articleId}`;
  const viewsEl = document.getElementById("viewCount");

  let views = Number(localStorage.getItem(viewKey)) || 0;
  views++;
  localStorage.setItem(viewKey, views);
  if (viewsEl) viewsEl.textContent = views;

  /* ======================
     LIKES (UNIQUE)
  ====================== */
  const likeBtn = document.getElementById("likeBtn");
  const likeCountEl = document.getElementById("likeCount");

  const likeKey = `likes-${articleId}`;
  const likedKey = `liked-${articleId}`;

  let likes = Number(localStorage.getItem(likeKey)) || 0;
  const hasLiked = localStorage.getItem(likedKey);

  likeCountEl.textContent = likes;

  if (hasLiked) {
    likeBtn.classList.add("liked");
    likeBtn.disabled = true;
  }

  likeBtn.addEventListener("click", () => {
    if (localStorage.getItem(likedKey)) return;

    likes++;
    localStorage.setItem(likeKey, likes);
    localStorage.setItem(likedKey, "true");

    likeCountEl.textContent = likes;
    likeBtn.classList.add("liked");
    likeBtn.disabled = true;

    likeBtn.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.3)" }, { transform: "scale(1)" }],
      { duration: 400 }
    );
  });

  /* ======================
     COMMENTAIRES
  ====================== */
  const form = document.getElementById("commentForm");
  const input = document.getElementById("commentInput");
  const list = document.getElementById("commentList");

  const commentKey = `comments-${articleId}`;
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  let comments = JSON.parse(localStorage.getItem(commentKey)) || [];

  function renderComments() {
    list.innerHTML = "";

    comments.forEach((comment, index) => {
      const li = document.createElement("li");
      li.className = "comment";

      li.innerHTML = `
        <p>${comment.text}</p>
        <small>${comment.date}</small>
      `;

      if (isAdmin) {
        const actions = document.createElement("div");
        actions.className = "admin-actions";

        const del = document.createElement("button");
        del.textContent = "Supprimer";
        del.onclick = () => {
          comments.splice(index, 1);
          saveComments();
        };

        const reply = document.createElement("button");
        reply.textContent = "Répondre";
        reply.onclick = () => {
          const r = prompt("Réponse admin :");
          if (r) {
            comments.push({
              text: `🛠️ Admin : ${r}`,
              date: new Date().toLocaleString()
            });
            saveComments();
          }
        };

        actions.append(reply, del);
        li.appendChild(actions);
      }

      list.appendChild(li);
    });
  }

  function saveComments() {
    localStorage.setItem(commentKey, JSON.stringify(comments));
    renderComments();
  }

  /* 🔥 CORRECTION MAJEURE ICI */
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // ⬅️ EMPÊCHE LE RECHARGEMENT

    const text = input.value.trim();
    if (!text) return;

    comments.push({
      text,
      date: new Date().toLocaleString()
    });

    input.value = "";
    saveComments();
  });

  renderComments();
});
