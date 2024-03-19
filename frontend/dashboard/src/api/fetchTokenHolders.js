import axios from 'axios';
import fetch from 'node-fetch';

const fetchTokenHolders = async (address) => {
    try {
      //const startDate = new Date().toISOString().slice(0, 10);
      const today = new Date();
      today.setFullYear(today.getFullYear() - 5);
      const endDate = today.toISOString().slice(0, 10);
      const response = await axios.get('https://2zd3cz3lv3.execute-api.us-east-2.amazonaws.com/test/tokenHolders?token_address='+address+'&date='+endDate);
      return response.data;
    } catch (error) {
      console.error('Error fetching data from API 1', error);
      throw error;
    }
};

export default fetchTokenHolders;