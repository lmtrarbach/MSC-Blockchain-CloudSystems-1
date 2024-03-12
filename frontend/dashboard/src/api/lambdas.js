import axios from 'axios';

export const fetchEthBurn = async () => {
  try {
    const response = await axios.get('URL_OF_API_1');
    return response.data;
  } catch (error) {
    console.error('Error fetching data from API 1', error);
    throw error;
  }
};

export const fetchTokenHolders = async () => {
    try {
      const response = await axios.get('URL_OF_API_1');
      return response.data;
    } catch (error) {
      console.error('Error fetching data from API 1', error);
      throw error;
    }
};

export const fetchTokenTransfer = async () => {
    try {
      const response = await axios.get('URL_OF_API_1');
      return response.data;
    } catch (error) {
      console.error('Error fetching data from API 1', error);
      throw error;
    }
};
  