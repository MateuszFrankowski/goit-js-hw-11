import { Notify } from 'notiflix/build/notiflix-notify-aio';

//simple LightBox
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
//
import { galleryItems } from '../js/gallery-items.js';

const gallery = document.querySelector('div.gallery');
const inputField = document.querySelector('input[name="searchQuery"]');
const loadMoreButton = document.querySelector('button.load-more');
const form = document.querySelector('form');
let oldSearchedImage;
function renderImages(images) {
  console.log({ images });
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        likes,
        views,
        comments,
        downloads,
        tags,
      }) =>
        `
  <div class="gallery__card">
      <a class="gallery__item" href="${largeImageURL}">
        <img
        class="gallery__image"
        src="${webformatURL}"        
        loading="lazy"
        alt="${tags}"
     
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
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
  loadMoreButton.style.display = 'flex';
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
  //

  observer.observe(loadMoreButton);
}

const imageSearch = async event => {
  event.preventDefault();
  loadMoreButton.style.display = 'none';
  const searchedImage = inputField.value.trim();
  const foundImages = await galleryItems(searchedImage);
  const imagesData = await foundImages.data.hits;
  if (imagesData.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    observer.unobserve(loadMoreButton);
    return (gallery.innerHTML = '');
  }

  if (searchedImage != oldSearchedImage) {
    gallery.innerHTML = '';
    oldSearchedImage = searchedImage;
    Notify.success(`Hurray! We found ${foundImages.data.total} images`);
  }

  return renderImages(imagesData);
};
const imageLoader = async () => {
  loadMoreButton.style.display = 'none';
  let allImages = document.querySelectorAll('img');
  let alreadyLoadedImages = allImages.length;
  const searchedImage = inputField.value.trim();
  const foundImages = await galleryItems(searchedImage);
  const imagesData = await foundImages.data.hits;
  console.log('tu', imagesData.totalHits, foundImages);
  if (foundImages.data.totalHits === alreadyLoadedImages) {
    observer.unobserve(loadMoreButton);
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
  if (imagesData.length === 0) {
    observer.unobserve(loadMoreButton);
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return (gallery.innerHTML = '');
  }

  if (searchedImage != oldSearchedImage) {
    gallery.innerHTML = '';
    oldSearchedImage = searchedImage;
    Notify.success(`Hurray! We found ${foundImages.data.totalHits} images`);
  }

  return renderImages(imagesData);
};
form.addEventListener('submit', imageSearch);
let lightbox = new SimpleLightbox('.gallery a');
loadMoreButton.style.display = 'none';
loadMoreButton.addEventListener('click', imageSearch);
let debounce = 0;
const observer = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting) return;
  if (debounce + 1000 < Date.now()) {
    imageLoader();
    debounce = Date.now();
  }
});
