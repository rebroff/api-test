function getProductCardTpl(data) {
  return `<div class="card">
            <img src="${data.thumbnail}">
            <div class="card__title">${data.title}</div>
            <div class="card__category">${data.category}</div>
          </div>`;
}

export default getProductCardTpl;
