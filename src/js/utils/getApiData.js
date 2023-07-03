import axios from 'axios';

async function getApiData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

export default getApiData;
