import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const btnLoadMore = document.querySelector('.load-more');

btnLoadMore.hidden = true;

searchForm.addEventListener('submit', onSearch);
btnLoadMore.addEventListener('click', onLoad);

const gallery1 = new SimpleLightbox('.gallery a', { captionDelay: 250 });
let page = 1
const URL = `https://pixabay.com/api/?key=33016808-d330fe94469becbda09795ec3&`

async function pixabay(page = 1) {
    const search = searchForm.elements.searchQuery.value.trim();
    const resp = await axios.get(`${URL}q=${search}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
    return resp.data
}

async function onSearch(e) {
  e.preventDefault();
  gallery.textContent = ''
  if (searchForm.elements.searchQuery.value.trim() === "") {
    btnLoadMore.hidden = true
    return Notify.failure('Please enter your search query');
  }
  try{ const p = await pixabay() 
    page = 1;
    if (p.totalHits === 0) {
      btnLoadMore.hidden = true
      return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }       
    createMarkup(p.hits)
    btnLoadMore.hidden = false}
    catch {error => console.log(error.message)}
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
        <a class="photo-item" href="${largeImageURL}">
          <img
            class="photo-img"
            src="${webformatURL}"
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
    
    gallery.insertAdjacentHTML("beforeend", markup);
    gallery1.refresh();  
}

async function onLoad() {
  page +=1; 
  try { const p = await pixabay(page)
      createMarkup(p.hits)
      if (page >= p.totalHits / 40) {
      btnLoadMore.hidden = true        
        return Notify.failure('Sorry, there are no images matching your search query. Please try again.');

      }
      }
      catch {error => console.log(error.message)}
}