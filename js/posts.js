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

      /* ========= PAGE INDEX ========= */
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

      /* ========= PAGE ARTICLE ========= */
      if (articleContainer) {
        const id = new URLSearchParams(window.location.search).get("id");
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
    .catch(err => {
      console.error(err);
      if (postsContainer) postsContainer.innerHTML = "<p>Erreur de chargement.</p>";
    });

  function renderPosts(posts) {
    postsContainer.innerHTML = "";

    posts.forEach(post => {
      const el = document.createElement("article");
      el.className = "post-preview fade";
      el.innerHTML = `
        <h2><a href="article.html?id=${post.id}">${post.title}</a></h2>
        <span class="date">${post.date}</span>
        <p>${post.excerpt}</p>
      `;
      postsContainer.appendChild(el);
    });

    activateFade();
  }

  function activateFade() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    });

    document.querySelectorAll(".fade").forEach(el => observer.observe(el));
  }
});
