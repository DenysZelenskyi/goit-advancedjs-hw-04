import axios from 'axios'

axios.defaults.baseURL = 'https://pixabay.com';

export const getImages = async (query, page) => {
  const URL = `/api/`;


  const axiosConfigs = {
    params: {
      q: query,
      key: '10567451-e89d654aa7ed9140fe488f539',
      image_type: 'photo',
      per_page: 15,
      orientation: 'horizontal',
      safesearch: true,
      page: page,
    }
    
  }

  return axios.get(URL, axiosConfigs)
};
