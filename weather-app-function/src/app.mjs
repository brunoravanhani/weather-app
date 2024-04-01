/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

import dotenv from 'dotenv';

import { filterForecast, getForecast, checkTemperatureBelowForecasts, findMinTemperature } from './forecastUtil.mjs';
import moment from 'moment';

dotenv.config();

export const lambdaHandler = async (event, context) => {

  const forecast = await getForecast();

  if (forecast.error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: forecast.error,
      })
    }
  }

  const datePlusFive = moment().add(5, 'days');

  const forecastsByDate = filterForecast(forecast.timelines.hourly, datePlusFive);

  const forecastColdDays = checkTemperatureBelowForecasts(forecastsByDate, 20);

  if (!forecastColdDays.length) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        coldDay: false,
        message: `The day ${datePlusFive.format('DD/MM/YYYY')} will not be a cold day.`
      })
    };
  }

  const minTemp = findMinTemperature(forecastColdDays);

  return {
    statusCode: 200,
    body: JSON.stringify({
      coldDay: true,
      message: `The day ${datePlusFive.format('DD/MM/YYYY')} will be a cold day ❄️. Prepare yourself, the minimum temperature is: ${minTemp.values.temperature}.`
    })
  };

};

