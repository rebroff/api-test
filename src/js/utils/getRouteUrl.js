function getRouteUrl(params = {}, ...parts) {
  const urlParts = `${[...parts].join('')}`;
  const urlParams = { ...params };
  let paramsStr = '';

  const entries = Object.entries(urlParams);

  for (const [key, value] of entries) {
    paramsStr += urlParams.length > 0 ? `&${key}=${value}` : `?${key}=${value}`;
  }

  return `${urlParts}${paramsStr}`;
}

export default getRouteUrl;
