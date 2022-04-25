const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('favoriteMovies'))

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    // title, image
    rawHTML += `<div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">x</button>
            </div>
        </div>
      </div>
    </div>`
  })
  dataPanel.innerHTML = rawHTML

}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then(response => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date:' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img
              src="${POSTER_URL + data.image}"
              alt="movie-poster" class="img-fluid">`
  })
}

function removeFromFavorite(id) {
  if (!movies || !movies.length) return
  // 要知道位置才能移除movie, 用findIndex找位置
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if(movieIndex === -1) return
  movies.splice(movieIndex,1)
  // 存回localstorage
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  // 立即更新頁面
  renderMovieList(movies)
}


dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})


axios.get(INDEX_URL).then((response) => {
  // 80個元素的陣列
  movies.push(...response.data.results)
  renderMovieList(movies)
})
// }).catch((err) => console.log(err))
renderMovieList(filteredMovies)