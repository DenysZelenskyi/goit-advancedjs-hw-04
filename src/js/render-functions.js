import iziToast from 'izitoast';

export const createGalleryCardTemplate = (cardInfo) => {
  return `
    <a href="${cardInfo.largeImageURL}" class="gallery-item">
      <div class="gallery-card">
        <img src="${cardInfo.webformatURL}" alt="${cardInfo.tags}" loading="lazy" />
        <div class="info">
          <p><strong>Likes:</strong> ${cardInfo.likes}</p>
          <p><strong>Views:</strong> ${cardInfo.views}</p>
          <p><strong>Comments:</strong> ${cardInfo.comments}</p>
          <p><strong>Downloads:</strong> ${cardInfo.downloads}</p>
        </div>
      </div>
    </a>
  `;
};

export const displayGallery = (galleryMarkup, galleryEl, lightbox) => {
  galleryEl.insertAdjacentHTML('beforeend', galleryMarkup);
  lightbox.refresh();
};

export const displayError = (message) => {
  iziToast.error({
    title: 'Error',
    message,
  });
};

export const displayWarning = (message) => {
  iziToast.warning({
    title: 'No results',
    message,
  });
};
