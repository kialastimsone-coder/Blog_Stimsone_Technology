document.addEventListener("DOMContentLoaded", () => {

  const postsContainer = document.querySelector(".posts");
  const articleContainer = document.querySelector(".article");
  const titleEl = document.querySelector(".header h1");
  const dateEl = document.querySelector(".date");
  const searchInput = document.getElementById("search");

  fetch("./posts.json")
    .then(res => {
      if (!res.ok) throw new Error("posts.json introuvable");
      return res.json();
    })
    .then(posts => {

      /* ==========================
         PAGE INDEX
      ========================== */
      if (postsContainer) {
        renderPosts(posts);

        if (searchInput) {
          searchInput.addEventListener("input", e => {
            const value = e.target.value.toLowerCase();
            const filtered = posts.filter(p =>
              p.title.toLowerCase().includes(value) ||
              p.excerpt.toLowerCase().includes(value)
            );
            renderPosts(filtered);
          });
        }
      }

      /* ==========================
         PAGE ARTICLE
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

        /* 👉 LAZY LOADING ICI */
        articleContainer.innerHTML = `
          <img 
            src="${post.image}" 
            loading="lazy" 
            alt="${post.title}"
          >
          ${post.content}
        `;
      }
    })
    .catch(err => {
      console.error(err);
      if (postsContainer) {
        postsContainer.innerHTML = "<p>Erreur de chargement.</p>";
      }
    });

  /* ==========================
     RENDER POSTS (INDEX)
  ========================== */
  function renderPosts(posts) {
    postsContainer.innerHTML = "";

    posts.forEach(post => {
      const article = document.createElement("article");
      article.className = "post-preview";

      /* 👉 LAZY LOADING ICI */
      article.innerHTML = `
        <img 
          src="${post.image}" 
          loading="lazy" 
          alt="${post.title}"
        >
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
});
