let allPosts = [];

fetch("posts.json")
  .then(res => res.json())
  .then(posts => {
    allPosts = posts;
    renderPosts(posts);
    loadArticle(posts);
  });

function renderPosts(posts) {
  const container = document.querySelector(".posts");
  if (!container) return;

  container.innerHTML = "";

  posts.forEach(post => {
    container.innerHTML += `
      <article class="post-preview fade">
        <h2>
          <a href="article.html?id=${post.id}">${post.title}</a>
        </h2>
        <span class="date">${post.date}</span>
        <p>${post.excerpt}</p>
      </article>
    `;
  });

  observeFade();
}

function loadArticle(posts) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  const article = posts.find(p => p.id === id);
  if (!article) return;

  document.querySelector("h1").textContent = article.title;
  document.querySelector(".article").innerHTML = article.content;
}

// 🔍 Recherche
const searchInput = document.getElementById("search");
if (searchInput) {
  searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase();
    const filtered = allPosts.filter(post =>
      post.title.toLowerCase().includes(value) ||
      post.excerpt.toLowerCase().includes(value)
    );
    renderPosts(filtered);
  });
}

// Animation scroll
function observeFade() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  });

  document.querySelectorAll(".fade").forEach(el => observer.observe(el));
}
