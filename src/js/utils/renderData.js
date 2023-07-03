function renderData(data, container, tpl) {
  let list = '';

  data.forEach((item) => {
    const el = tpl(item);
    list += el;
  });

  container.insertAdjacentHTML('afterbegin', list);
}

export default renderData;
