document.addEventListener("DOMContentLoaded", () => {
  const postsContainer = document.querySelector(".posts");
  const articleContainer = document.querySelector(".article");
  const titleEl = document.querySelector("h1");
  const dateEl = document.querySelector(".date");

  fetch("./posts.json")
    .then(res => res.json())
    .then(posts => {

      /* ======================
         PAGE INDEX
      ====================== */
      if (postsContainer) {
        postsContainer.innerHTML = "";

        posts.forEach(post => {
          const el = document.createElement("article");
          el.className = "post-preview fade";

          el.innerHTML = `
            <h2>
              <a href="article.html?id=${post.id}">
                ${post.title}
              </a>
            </h2>
            <span class="date">${post.date}</span>
            <p>${post.excerpt}</p>
          `;

          postsContainer.appendChild(el);
        });

        // 🔥 ACTIVER LES ANIMATIONS APRÈS INSERTION
        activateFade();
      }

      /* ======================
         PAGE ARTICLE
      ====================== */
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
    .catch(err => {
      console.error(err);
    });
});

/* ======================
   OBSERVER SCROLL
====================== */
function activateFade() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".fade").forEach(el => observer.observe(el));
}
