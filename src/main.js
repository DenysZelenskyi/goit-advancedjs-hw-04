import SimpleLightbox from "simplelightbox";

import { getImages } from './js/pixabay-api';
import { createGalleryCardTemplate, displayGallery, displayError, displayWarning } from './js/render-functions';

const searchFormEl = document.querySelector('.js-search-form');
const galleryEl = document.querySelector('.js-gallery');
const loaderEl = document.querySelector('.js-loader');
const loadMoreBtnEl = document.querySelector('.js-load-more-btn')


let lightbox = new SimpleLightbox('.js-gallery a');
let currentPage = 1;
let currentQuery = '';
let totalHits = 0;
let imagesLoaded = 0;


const onSearchFormSubmit = async e => {
  e.preventDefault();

  currentQuery = e.target.elements.user_query.value.trim();
  currentPage = 1;
  imagesLoaded = 0;
  galleryEl.innerHTML = '';
  loadMoreBtnEl.classList.add('is-hidden');

  try {
    loaderEl.classList.remove('is-hidden');
    
    const { data: { hits, totalHits: total } } = await getImages(currentQuery, currentPage);
    totalHits = total;
    
    if (hits.length === 0) {
      displayWarning('Sorry, there are no images matching your search query. Please try again!');
      loadMoreBtnEl.classList.add('is-hidden');
    } else {
      imagesLoaded += hits.length;
      const galleryMarkup = hits.map(createGalleryCardTemplate).join('');
      displayGallery(galleryMarkup, galleryEl, lightbox);
      if (imagesLoaded < totalHits) {
        loadMoreBtnEl.classList.remove('is-hidden');
      }
    }
  } catch(err) {
    displayError(`Something went wrong: ${err.message}`);
  } finally {
    loaderEl.classList.add('is-hidden');
  }
}

const onLoadMoreBtnClick = async e => {
  try {
    currentPage++;
    loaderEl.classList.remove('is-hidden');

    if (imagesLoaded >= totalHits) {
      displayWarning("We're sorry, but you've reached the end of search results.");
      loadMoreBtnEl.classList.add('is-hidden');
      loaderEl.classList.add('is-hidden');
      return;
    }

    const { data: { hits } } = await getImages(currentQuery, currentPage);

    if (hits.length === 0) {
      displayWarning("We're sorry, but you've reached the end of search results.");
      loadMoreBtnEl.classList.add('is-hidden');
    } else {
      imagesLoaded += hits.length;
      const galleryMarkup = hits.map(createGalleryCardTemplate).join('');
      displayGallery(galleryMarkup, galleryEl, lightbox);
      if (imagesLoaded >= totalHits) {
        loadMoreBtnEl.classList.add('is-hidden');
        displayWarning("We're sorry, but you've reached the end of search results.");
      }

      const { height: cardHeight } = galleryEl.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch(err){
    displayError(`Something went wrong: ${err.message}`);
  } finally {
    loaderEl.classList.add('is-hidden');
  }
}

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick)
