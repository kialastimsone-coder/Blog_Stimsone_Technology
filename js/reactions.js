document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return;

  const isAdmin = localStorage.getItem("isAdmin") === "true";

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
     COMMENTAIRES + ADMIN
  ========================= */
  const commentsKey = `comments_${id}`;
  const list = document.getElementById("commentList");
  const form = document.getElementById("commentForm");
  const input = document.getElementById("commentInput");

  let comments = JSON.parse(localStorage.getItem(commentsKey) || "[]");
  comments.forEach(renderComment);

  form.addEventListener("submit", e => {
    e.preventDefault();
    const text = input.value.trim();
    if (text.length < 3) return;

    const comment = {
      id: crypto.randomUUID(),
      text,
      date: new Date().toLocaleDateString("fr-FR"),
      replies: []
    };

    comments.push(comment);
    save();
    renderComment(comment);
    input.value = "";
  });

  function save() {
    localStorage.setItem(commentsKey, JSON.stringify(comments));
  }

  function renderComment(comment) {
    const li = document.createElement("li");
    li.className = "comment";

    li.innerHTML = `
      <p>${comment.text}</p>
      <span>${comment.date}</span>

      <div class="replies">
        ${comment.replies.map(r => `<div class="reply">↳ ${r}</div>`).join("")}
      </div>

      ${isAdmin ? `
        <div class="admin-actions">
          <button class="reply-btn">Répondre</button>
          <button class="delete-btn">Supprimer</button>
        </div>
      ` : ""}
    `;

    if (isAdmin) {
      li.querySelector(".reply-btn").onclick = () => {
        const reply = prompt("Réponse administrateur :");
        if (!reply) return;
        comment.replies.push(reply);
        save();
        li.querySelector(".replies").innerHTML += `<div class="reply">↳ ${reply}</div>`;
      };

      li.querySelector(".delete-btn").onclick = () => {
        if (!confirm("Supprimer ce commentaire ?")) return;
        comments = comments.filter(c => c.id !== comment.id);
        save();
        li.remove();
      };
    }

    list.appendChild(li);
  }
});
