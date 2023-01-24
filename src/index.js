import axios from "axios";

const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const btnLoadMore = document.querySelector('.load-more');


let page = 1

    const search = searchForm.elements.searchQuery.value
    
    const url = `https://pixabay.com/api/?key=33016808-d330fe94469becbda09795ec3&`

btnLoadMore.addEventListener('click', onLoad)

searchForm.addEventListener('submit', onSearch)

function onSearch(e) {
  e.preventDefault();
        gallery.textContent = ''

    pixabay()
      .then(data => {        
        createMarkup(data.hits)
        btnLoadMore.hidden = false
        page += 1
      })
        .catch(error => console.log(error.message))
}

  async function pixabay(page = 1) {
      const resp = await axios.get(`${url}q=${search}&image_type=photo&orientation=horizontal&safesearch=true&per_page=5&page=${page}`);
      console.log(resp.data)
      console.log(resp.data.totalHits)
    return resp.data
}

function onLoad() {
  pixabay()
      .then(data => {
        createMarkup(data.hits)
            btnLoadMore.hidden = false
      })
        .catch(error => console.log(error.message))
}

function createMarkup(arr) {
    const markup = arr.map(({
        webformatURL,
        // largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads
    }) => `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>${likes}</b>
    </p>
    <p class="info-item">
      <b>${views}</b>
    </p>
    <p class="info-item">
      <b>${comments}</b>
    </p>
    <p class="info-item">
      <b>${downloads}</b>
    </p>
  </div>
</div>`).join('')
    
    gallery.insertAdjacentHTML("beforeend", markup)    
}