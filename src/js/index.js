import { Notify } from 'notiflix/build/notiflix-notify-aio';

//simple LightBox
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
//
import { galleryItems } from '../js/gallery-items.js';

const gallery = document.querySelector('div.gallery');
const inputField = document.querySelector('input[name="searchQuery"]');
const form = document.querySelector('form');

function renderImages(images) {
  console.log({ images });
  const markup = images
    .map(
      ({ webformatURL, largeImageURL, likes, views, comments, downloads }) =>
        `
  <div class="gallery__card">
      <a class="gallery__item" href="${largeImageURL}">
        <img
        class="gallery__image"
        src="${webformatURL}"        
        loading="lazy"
     
      />
      </a>
  
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
     <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
          <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`
    )
    .join('');
  gallery.insertAdjacentHTML('afterbegin', markup);
  lightbox.refresh();
}

const imageSearch = async event => {
  event.preventDefault();
  gallery.innerHTML = '';
  if (inputField.validity.patternMismatch === true) {
    console.log(event.target.value);
    return Notify.failure('Oops, use letters only');
  }
  const searchedImage = inputField.value.trim();
  const foundImages = await galleryItems(searchedImage);

  const imagesData = await foundImages.data.hits;
  if (imagesData.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return (gallery.innerHTML = '');
  }
  return renderImages(imagesData);

  if (error) {
    countryInfo.innerHTML = '';
    Notify.failure('Oops, there is no country with that name', error);
  }
};
form.addEventListener('submit', imageSearch);

let lightbox = new SimpleLightbox('.gallery a');
