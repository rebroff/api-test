import { API_URL, URL_PRODUCTS, URL_CATEGORY } from './constants/api';
import getRouteUrl from './utils/getRouteUrl';
import updateProductsList from './product/updateProductsList';
import { initDatePickers } from './initDatePickers';

const formEl = document.querySelector('form');
const resultEl = document.querySelector('#result');
const limit = 20;
const urlAll = getRouteUrl({ limit }, API_URL, URL_PRODUCTS);

formEl.addEventListener('change', (e) => {
  const { target } = e;

  if (target.classList.contains('js-all-input') && target.checked) {
    updateProductsList(urlAll, resultEl);
  }

  if (target.classList.contains('js-filter-input') && target.checked) {
    const url = getRouteUrl(
      { limit },
      API_URL,
      URL_PRODUCTS,
      URL_CATEGORY,
      target.value
    );
    updateProductsList(url, resultEl);
  }
});

updateProductsList(urlAll, resultEl);

initDatePickers();
