document.addEventListener("DOMContentLoaded", () => {
  const postsContainer = document.querySelector(".posts");
  const articleContainer = document.querySelector(".article");
  const titleEl = document.querySelector("h1");
  const dateEl = document.querySelector(".date");

  fetch("./posts.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Impossible de charger posts.json");
      }
      return response.json();
    })
    .then(posts => {

      /* ==========================
         PAGE INDEX (liste)
      ========================== */
      if (postsContainer) {
        postsContainer.innerHTML = "";

        posts.forEach(post => {
          const article = document.createElement("article");
          article.className = "post-preview fade";

          article.innerHTML = `
            <h2>
              <a href="article.html?id=${post.id}">
                ${post.title}
              </a>
            </h2>
            <span class="date">${post.date}</span>
            <p>${post.excerpt}</p>
          `;

          postsContainer.appendChild(article);
        });
      }

      /* ==========================
         PAGE ARTICLE (détail)
      ========================== */
      if (articleContainer) {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");

        const post = posts.find(p => p.id === id);

        if (!post) {
          articleContainer.innerHTML = "<p>Article introuvable.</p>";
          return;
        }

        titleEl.textContent = post.title;
        dateEl.textContent = post.date;
        articleContainer.innerHTML = post.content;
      }

    })
    .catch(error => {
      console.error("Erreur blog :", error);

      if (postsContainer) {
        postsContainer.innerHTML = "<p>Erreur de chargement des articles.</p>";
      }

      if (articleContainer) {
        articleContainer.innerHTML = "<p>Erreur de chargement de l’article.</p>";
      }
    });
});
