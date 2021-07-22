import { transform } from '../openWeatherMap';

const openWeatherMapResponse200 = {
  coord: {
    lon: 16.3721,
    lat: 48.2085,
  },
  weather: [
    {
      id: 801,
      main: 'Clouds',
      description: 'few clouds',
      icon: '02d',
    },
  ],
  base: 'stations',
  main: {
    temp: 20.5,
    feels_like: 20.04,
    temp_min: 17.71,
    temp_max: 22.6,
    pressure: 1022,
    humidity: 55,
  },
  visibility: 10000,
  wind: {
    speed: 0.89,
    deg: 270,
    gust: 0.89,
  },
  clouds: {
    all: 20,
  },
  dt: 1626878310,
  sys: {
    type: 2,
    id: 2037452,
    country: 'AT',
    sunrise: 1626837377,
    sunset: 1626893112,
  },
  timezone: 7200,
  id: 2761369,
  name: 'Vienna',
  cod: 200,
};

const openWeatherMapResponse401 = {
  cod: 401,
  message:
    'Invalid API key. Please see http://openweathermap.org/faq#error401 for more info.',
};

const openWeatherMapResponse404 = {
  cod: 404,
  message: 'city not found',
};

test('transforms a 200 response correctly', () => {
  expect(transform(openWeatherMapResponse200)).toEqual({
    data: {
      city: 'Vienna',
      country: 'Austria',
      icon: '02d',
      temp: 20.5,
      conditions: 'Clouds',
      conditionsDescription: 'few clouds',
    },
  });
});

test('transforms a 401 response correctly', () => {
  expect(transform(openWeatherMapResponse401)).toMatchSnapshot();
});

test('transforms a 404 response correctly', () => {
  expect(transform(openWeatherMapResponse404)).toMatchSnapshot();
});