import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const btnLoadMore = document.querySelector('.load-more');

btnLoadMore.hidden = true

searchForm.addEventListener('submit', onSearch)
btnLoadMore.addEventListener('click', onLoad)
gallery.addEventListener("click", onClikcImg)

let page = 1
const URL = `https://pixabay.com/api/?key=33016808-d330fe94469becbda09795ec3&`

function onSearch(e) {
  e.preventDefault();
        gallery.textContent = ''

    pix()
      .then(data => {
        if (data.totalHits === 0) {
         return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }       
        createMarkup(data.hits)
        btnLoadMore.hidden = false

      })
        .catch(error => console.log(error.message))
}

const pix = async function pixabay(page = 1) {
    const search = searchForm.elements.searchQuery.value;
    const resp = await axios.get(`${URL}q=${search}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
    return resp.data
}

function createMarkup(arr) {
    const markup = arr.map(({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads
    }) => `
      <div class="photo-card">
        <a class="photo-item" href="${webformatURL}">
          <img
            class="photo-img"
            src="${largeImageURL}"
            alt="${tags}"
            title=""
            loading="lazy"
          />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes: ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${downloads}</b>
          </p>
        </div>
      </div>`).join('')
    
    gallery.insertAdjacentHTML("beforeend", markup)    
}

function onLoad() {
  page += 1  
 
      pix(page)
        .then(data => {
          createMarkup(data.hits)
          if (page >= data.totalHits / 40) {
            btnLoadMore.hidden = true            
            return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }
          // btnLoadMore.hidden = true
      })
    .catch(error => console.log(error.message))
}

function onClikcImg(event) {
  event.preventDefault()
    if (!event.target.classList.contains('.photo-item')) {
        return;
  }
const gallery1 = new SimpleLightbox('.gallery a', { captionDelay: 250 });
  
gallery1.refresh();
}