import SimpleLightbox from 'simplelightbox';
import { fetchImages } from './js/pixabay-api';
import {
  createGalleryCardTemplate,
  displayGallery,
  displayError,
  displayWarning,
} from './js/render-functions';

let lightbox = new SimpleLightbox('.js-gallery a');

const searchFormEl = document.querySelector('.js-search-form');
const galleryEl = document.querySelector('.js-gallery');
const loaderEl = document.querySelector('.js-loader');
const loadMoreBtnEl = document.querySelector('.js-load-more-btn');

let currentQuery = '';
let page = 1;

const onSearchFormSubmit = async e => {
  try {
    e.preventDefault();

    currentQuery = e.currentTarget.elements.user_query.value.trim();
    page = 1;
    loaderEl.classList.add('is-hidden');

    if (!currentQuery) {
      displayError('Please enter a search query.');
      galleryEl.innerHTML = '';
      loaderEl.classList.add('is-hidden');
      loadMoreBtnEl.classList.add('is-hidden');

      return;
    }

    loaderEl.classList.remove('is-hidden');

    const response = await fetchImages(currentQuery, page);

    if (response.data.total === 0) {
      galleryEl.innerHTML = '';
      loaderEl.classList.add('is-hidden');
      displayWarning(
        'Sorry, there are no images matching your search query. Please try again!'
      );
    } else {
      const galleryMarkup = response.data.hits
        .map(createGalleryCardTemplate)
        .join('');
      displayGallery(galleryMarkup, galleryEl, lightbox);
      loadMoreBtnEl.classList.remove('is-hidden');
    }
  } catch (err) {
    displayError(`Something went wrong: ${err.message}`);
  }
};

const onLoadMoreBtnClick = async () => {
  try {
    page += 1;
    loaderEl.classList.remove('is-hidden');
    loadMoreBtnEl.classList.add('is-hidden');

    const response = await fetchImages(currentQuery, page);

    const galleryMarkup = response.data.hits
      .map(createGalleryCardTemplate)
      .join('');
    galleryEl.insertAdjacentHTML('beforeend', galleryMarkup);

    lightbox.refresh();

    const totalLoadedImages = page * 15;

    if (response.data.totalHits <= totalLoadedImages) {
      loadMoreBtnEl.classList.add('is-hidden');
      displayWarning(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      loadMoreBtnEl.classList.remove('is-hidden');
    }

    const { height: cardHeight } =
      galleryEl.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (err) {
    displayError(`Something went wrong: ${err.message}`);
  } finally {
    loaderEl.classList.add('is-hidden');
  }
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
