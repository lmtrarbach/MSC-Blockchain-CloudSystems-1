import axios from 'axios';

const fetchEthBurn = async (address) => {
  try 
  {
    const currentDate = new Date().toISOString().slice(0, 10);
    const response = await axios.get('https://limg7lmnl74uqf5vsv23uqjmzm0kphqz.lambda-url.us-east-2.on.aws/?token_address='+address+'&date='+currentDate);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from API 1', error);
    throw error;
  }
};

export default fetchEthBurn;




  