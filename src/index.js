import axios from "axios";

const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const btnLoadMore = document.querySelector('.load-more');


let page = 1

btnLoadMore.addEventListener('click', onLoad)

searchForm.addEventListener('submit', onSearch)

function onSearch(e) {
  e.preventDefault();
        gallery.textContent = ''
    const search = e.currentTarget.elements.searchQuery.value
    
    const url = `https://pixabay.com/api/?key=33016808-d330fe94469becbda09795ec3&`

  async function pixabay(page = 1) {
      const resp = await axios.get(`${url}q=${search}&image_type=photo&orientation=horizontal&safesearch=true&per_page=5&page=${page}`);
      console.log(resp.data)
      console.log(resp.data.totalHits)
    return resp.data
    }

    pixabay()
      .then(data => {        
        createMarkup(data.hits)
        btnLoadMore.hidden = false
      })
        .catch(error => console.log(error.message))
}

function onLoad() {
  page += 1
  pixabay(page)
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