document.addEventListener('DOMContentLoaded', () => {
  const animeListContainer = document.getElementById('animeList');
  const toggleDarkModeButton = document.getElementById('toggleDarkMode');

  // Fetch anime data from the server
  fetch('/api/anime')
    .then(response => response.json())
    .then(data => {
      data.forEach(anime => {
        const animeCard = document.createElement('div');
        animeCard.classList.add('p-4', 'border', 'rounded', 'shadow');

        animeCard.innerHTML = `
          <img src="images/${anime.thumbnail}" alt="${anime.title}" class="w-full h-40 object-cover mb-2 rounded">
          <h2 class="text-xl font-semibold">${anime.title}</h2>
          <p class="text-sm text-gray-500">${anime.description}</p>
          <div class="mt-4 flex justify-between">
            <button class="like-btn" data-id="${anime.id}">👍 ${anime.likes}</button>
            <button class="dislike-btn" data-id="${anime.id}">👎 ${anime.dislikes}</button>
          </div>
        `;
        animeListContainer.appendChild(animeCard);
      });
    });

  // Event listener for like and dislike buttons
  document.addEventListener('click', event => {
    if (event.target.classList.contains('like-btn')) {
      handleLikeDislike(event.target, 'like');
    } else if (event.target.classList.contains('dislike-btn')) {
      handleLikeDislike(event.target, 'dislike');
    }
  });

  // Function to handle like/dislike actions
  function handleLikeDislike(button, type) {
    const animeId = button.getAttribute('data-id');
    const url = `/api/anime/${animeId}/${type}`;

    fetch(url, { method: 'POST' })
      .then(() => {
        button.textContent = `${type === 'like' ? '👍' : '👎'} ${parseInt(button.textContent.split(' ')[1]) + 1}`;
      });
  }

  // Toggle dark mode
  toggleDarkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', document.body.classList.contains('dark'));
  });

  // Set dark mode based on user preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
  }
});
