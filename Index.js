const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12

const movies = []
let filteredMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

function renderMovieList(data){
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
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
        </div>
      </div>
    </div>`
  })
  dataPanel.innerHTML = rawHTML

}
// math.ceil = 無條件進位
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let page =1; page <= numberOfPages; page++){
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

paginator.addEventListener('click',function onPaginatorClicked(event){
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))
})

// movies 分成兩種 80部電影/搜尋出來的電影



function getMoviesByPage(page) {

  const data = filteredMovies.length ? filteredMovies: movies
  // slice 切割陣列的一部分回傳回來
  // p1 0>11
  // p2 12-23
  // p3 24-35
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
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
// 我想要localstorage.getitem如果沒有的話 那就給我空陣列吧（由左至右）
function addToFavorite(id){
  // function isMovieIdMatched(movie){
  //   return movie.id === id
  
  //   JSON.parse會把字串變成js的object或陣列
 const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
 const movie = movies.find((movie) => movie.id === id)
 
// 檢查：重複的電影
// some, 回傳布林值, find, 回傳值本身
if (list.some((movie) => movie.id === id)) {
  return alert('此電影已經加入收藏清單')
}

 list.push(movie)
//  const jsonString = JSON.stringify(list)
//  用JSON.stringify把資料轉成JSON字串
//  console.log('json string:', jsonString)
//  console.log('json object:', JSON.parse(jsonString)
//  用JSON.parse把jsonString轉回js資料 
//  將favoritemovies放進localstorage中，value值是將list中的陣列藉由js改成字串
localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

dataPanel.addEventListener('click',function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
   showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')){
   addToFavorite(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) { 
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
// 儲存符合篩的項目

// 輸入錯誤時顯示
  // if (!keyword.length) {
    // return alert('Please enter a valid string')
  // }
// 優化：輸入無效的字串時直接用filter剔除
  filteredMovies = movies.filter((movie) => 
  movie.title.toLowerCase().includes(keyword)
  )
  
  if (filteredMovies.length === 0) {
    return alert('Cannot find movies with keyword:' + keyword)
  }


  // for(const movie of movies){
  //   if (movie.title.toLowerCase().includes(keyword)){
  //     filterMovies.push(movie)
  //   }
  // }
  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))
})

axios.get(INDEX_URL).then((response) => {
// 80個元素的陣列
  movies.push(...response.data.results)
  renderPaginator(movies.length)
  renderMovieList(getMoviesByPage(1))
})
.catch((err) => console.log(err))
