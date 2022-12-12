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
      ({ previewURL, largeImageURL, likes, views, comments, downloads }) =>
        `<div class="photo-card">
      <a class="gallery__item" href="${largeImageURL}">
        <img
        class="gallery__image"
        src="${previewURL}"        
        loading="lazy"
     
      />
      </a>
  
  <div class="info">
    <p class="info-item">
      <b>"${likes}"</b>
    </p>
    <p class="info-item">
      <b>"${views}"</b>
    </p>
    <p class="info-item">
      <b>${comments}</b>
    </p>
    <p class="info-item">
      <b>${downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');
  gallery.insertAdjacentHTML('afterbegin', markup);
}

const imageSearch = async event => {
  event.preventDefault();
  if (inputField.validity.patternMismatch === true) {
    gallery.innerHTML = '';
    console.log(event.target.value);
    return Notify.failure('Oops, use letters only');
  }
  const searchedImage = inputField.value.trim();
  if (searchedImage.length === 0) return (gallery.innerHTML = '');
  const foundImages = await galleryItems(searchedImage);

  const imagesData = await foundImages.data.hits;

  return renderImages(imagesData);

  if (error) {
    countryInfo.innerHTML = '';
    Notify.failure('Oops, there is no country with that name', error);
  }
};
form.addEventListener('submit', imageSearch);

let lightbox = new SimpleLightbox('.gallery a');
