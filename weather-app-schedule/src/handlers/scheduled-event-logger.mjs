import axios from 'axios';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

import dotenv from 'dotenv';

dotenv.config();

const ses = new SESClient({ region: "us-east-1" });
/**
 * A Lambda function that logs the payload received from a CloudWatch scheduled event.
 */
export const scheduledEventLoggerHandler = async (event, context) => {
    // All log statements are written to CloudWatch by default. For more information, see
    // https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-logging.html

    const data = await fetchData();

    console.info(JSON.stringify(data));
}

const fetchData = async () => {
    try {
      // Substitua a URL abaixo pela URL da API que você deseja chamar
      const apiUrl = process.env.WEATHER_API;
  
      // Fazendo a chamada GET usando o Axios
      const response = await axios.get(apiUrl);
  
      // Verifica se a resposta foi bem sucedida (código de status 200)
      if (response.status === 200) {
        await sendEmail(response.data);
        return response.data;
      } else {
        return { error: true, message: null}
      }
    } catch (error) {
      return { error: true, message: error.message}
    }
}

// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export const sendEmail = async(data) => {
  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: [process.env.DESTINATION_EMAIL]
    },
    Message: {
      Body: {
        Text: { Data: data.message },
      },

      Subject: { Data: data.coldDay ? '❄️Cold day Alert!❄️' : 'It\'s not a cold day ' },
    },
    Source: process.env.ORIGIN_EMAIL,
  });

  try {
    let response = await ses.send(command);
    // process data.
    return response;
  }
  catch (error) {
    console.log(error);
  }
  finally {
    // finally.
  }
};
