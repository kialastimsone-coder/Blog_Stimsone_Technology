document.addEventListener("DOMContentLoaded", () => {

  const postsContainer = document.querySelector(".posts");
  const articleContainer = document.querySelector(".article");
  const titleEl = document.querySelector(".header h1");
  const dateEl = document.querySelector(".date");
  const search = document.getElementById("search");

  fetch("./posts.json")
    .then(res => res.json())
    .then(posts => {

      if (postsContainer) {
        render(posts);

        search.addEventListener("input", e => {
          const value = e.target.value.toLowerCase();
          render(posts.filter(p =>
            p.title.toLowerCase().includes(value) ||
            p.excerpt.toLowerCase().includes(value)
          ));
        });
      }

      if (articleContainer) {
        const id = new URLSearchParams(location.search).get("id");
        const post = posts.find(p => p.id === id);
        if (!post) return;

        titleEl.textContent = post.title;
        dateEl.textContent = post.date;
        articleContainer.innerHTML = `
          <img src="${post.image}">
          ${post.content}
        `;
      }

      function render(list) {
        <img src="${p.image}" loading="lazy" alt="${p.title}">
        postsContainer.innerHTML = "";
        list.forEach(p => {
          postsContainer.innerHTML += `
            <article class="post-preview">
              <img src="${p.image}">
              <h2><a href="article.html?id=${p.id}">${p.title}</a></h2>
              <span class="date">${p.date}</span>
              <p>${p.excerpt}</p>
            </article>
          `;
        });
      }
    });
});

