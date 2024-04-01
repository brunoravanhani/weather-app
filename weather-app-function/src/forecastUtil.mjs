import axios from 'axios';
import moment from 'moment';

export const getForecast = async () => {

  const options = {
    method: 'GET',
    url: process.env.WEATHER_API,
    params: {
      location: 'cuiaba',
      timesteps: '1h',
      units: 'metric'
    },
    headers: {
      'X-RapidAPI-Key': process.env.WEATHER_API_KEY,
      'X-RapidAPI-Host': process.env.WEATHER_API_HOST
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    return { error: "Some error ocurred" }
  }
}
  
export const filterForecast = (forecasts, date) => {

  return forecasts.filter(x => {
    let time = moment(x.time);
    
    let result = time.diff(date, 'days');
    return result == 0;
  });

}

export const checkTemperatureBelowForecasts = (forecasts, belowThan) => {
  return forecasts.filter(x => x.values.temperature < belowThan);
}

export const findMinTemperature = (forecasts) => {
  return forecasts.reduce((prev, curr) => 
    prev.values.temperature < curr.values.temperature ? prev : curr);
}