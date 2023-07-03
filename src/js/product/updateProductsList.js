import getApiData from '../utils/getApiData';
import renderData from '../utils/renderData';
import getProductCardTpl from './getProductCardTpl';

async function updateProductsList(url, container) {
  const data = await getApiData(url);
  container.innerHTML = '';
  renderData(data.products, container, getProductCardTpl);
}

export default updateProductsList;
