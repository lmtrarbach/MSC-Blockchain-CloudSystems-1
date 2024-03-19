import axios from 'axios';

const fetchTokenTransfer = async (address) => {
    try {
      const currentDate = new Date();
      const startDate = new Date().toISOString().slice(0, 10);
      const pastDate = new Date(currentDate.getTime() - (9 * 24 * 60 * 60 * 1000)); // Subtract 7 days
      const endDate = pastDate.toISOString().slice(0, 10);
      const response = await axios.get('https://2zd3cz3lv3.execute-api.us-east-2.amazonaws.com/test/token?token_address='+address+'&end_date='+startDate+'&start_date='+endDate);
      return response.data;
    } catch (error) {
      console.error('Error fetching data from API 1', error);
      throw error;
    }
};

export default fetchTokenTransfer;