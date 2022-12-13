const axios = require('axios').default;
let page = 1;
let per_page = 40;
export const galleryItems = async image => {
  console.log('zapytanie', image);
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=31993556-98ab722596578832b23ea9bf6&q=${image}&image_type=photo&per_page=${per_page}&page=${page}`
    );
    console.log('response', response);
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};
