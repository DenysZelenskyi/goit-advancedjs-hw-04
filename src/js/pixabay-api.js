import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com';

export const fetchImages = function (query, page) {
  const URL = `/api/`;

  const axiosConfigs = {
    params: {
      q: query,
      key: '10567451-e89d654aa7ed9140fe488f539',
      image_type: 'photo',
      per_page: 15,
      page: page,
      orientation: 'horizontal',
      safesearch: true,
    },
  };

  // Обертка с задержкой
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      axios
        .get(URL, axiosConfigs)
        .then(response => resolve(response))
        .catch(error => reject(error));
    }, 3000); // Задержка 3 секунды
  });
};
