import { NextApiRequest, NextApiResponse } from 'next';
import { transform } from '../../util/openWeatherMap';

/**
 * Weather data from the OpenWeatherMap API
 *
 * Example:
 *
 * ```json
 * {
 *   "coord": {
 *     "lon": 16.3721,
 *     "lat": 48.2085
 *   },
 *   "weather": [
 *     {
 *       "id": 801,
 *       "main": "Clouds",
 *       "description": "few clouds",
 *       "icon": "02d"
 *     }
 *   ],
 *   "base": "stations",
 *   "main": {
 *     "temp": 20.5,
 *     "feels_like": 20.04,
 *     "temp_min": 17.71,
 *     "temp_max": 22.6,
 *     "pressure": 1022,
 *     "humidity": 55,
 *   },
 *   "visibility": 10000,
 *   "wind": {
 *     "speed": 0.89,
 *     "deg": 270,
 *     "gust": 0.89
 *   },
 *   "clouds": {
 *     "all": 20
 *   },
 *   "dt": 1626878310,
 *   "sys": {
 *     "type": 2,
 *     "id": 2037452,
 *     "country": "AT",
 *     "sunrise": 1626837377,
 *     "sunset": 1626893112
 *   },
 *   "timezone": 7200,
 *   "id": 2761369,
 *   "name": "Vienna",
 *   "cod": 200
 * }
 * ```
 */
export type WeatherData =
  | {
      coord: {
        lon: number;
        lat: number;
      };
      weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
      }[];
      base: string;
      main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
      };
      visibility: number;
      wind: {
        speed: number;
        deg: number;
        gust: number;
      };
      clouds: {
        all: number;
      };
      dt: number;
      sys: {
        type: number;
        id: number;
        country: string;
        sunrise: number;
        sunset: number;
      };
      timezone: number;
      id: number;
      name: string;
      cod: number;
    }
  | { cod: number; message: string };

export type WeatherApiResponse =
  | {
      city: string;
      country: string;
      icon: string;
      temp: number;
      conditions: string;
      conditionsDescription: string;
    }
  | {
      error: {
        message: string;
      };
    };

export default async function weatherHandler(
  req: NextApiRequest,
  res: NextApiResponse<WeatherApiResponse>,
) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${req.query.q}&units=metric&appId=${process.env.OPENWEATHERMAP_API_KEY}`,
  );
  const json = (await response.json()) as WeatherData;

  const result = transform(json);

  if (result.error) {
    return res
      .status(result.error.code)
      .json({ error: { message: result.error.message } });
  }

  res.status(200).json(result.data);
}
