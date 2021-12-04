import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import NewsApiService from './components/news-service.js';
import cardsMarkup from './templates/card-img.hbs';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const newsApiService = new NewsApiService();

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoad);
loadMoreBtn.classList.add('is-hidden');

async function onSearch(e) {
  e.preventDefault();
  clearGallery();
  newsApiService.resetPage();
  newsApiService.query = e.currentTarget.elements.searchQuery.value;
  try {
    const res = await newsApiService.axiosArticles();
    if (newsApiService.query === '' || res.hits.length === 0) {
      clearGallery();
      loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    }
    {
      loadMoreBtn.classList.remove('is-hidden');
      Notiflix.Notify.success(`"Hooray! We found ${res.totalHits} images."`);
      appendCardsMarkup(res.hits);
    }
  } catch (error) {
    console.log(error);
  }
}
async function onLoad() {
  try {
    const res = await newsApiService.axiosArticles();
    appendCardsMarkup(res.hits);
    const cardHits = gallery.querySelectorAll('.photo-card').length;
    if (cardHits >= res.totalHits) {
      Notiflix.Notify.failure('"We are sorry, but you have reached the end of search results."');
      loadMoreBtn.classList.add('is-hidden');
    }
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 1.5,
      behavior: 'smooth',
    });
  } catch (error) {
    console.log(error);
  }
}
function appendCardsMarkup(hits) {
  gallery.insertAdjacentHTML('beforeend', cardsMarkup(hits));
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}
function clearGallery() {
  gallery.innerHTML = '';
}
