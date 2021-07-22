import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { WeatherApiResponse } from './api/weather';

const containerStyles = css`
  background-color: #eee;
  min-height: 100vh;
  padding: 10px;

  @media (min-width: 400px) {
    padding: 40px;
  }
`;

const formStyles = css`
  max-width: 360px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 15px;
  margin: 0 auto 30px;

  input,
  button {
    font-size: 20px;
    line-height: 40px;
  }

  input {
    width: 100%;
    background: none;
    border: 0;
    border-bottom: 2px solid #bbb;
    transition: 0.3s border-bottom;

    &:focus {
      outline: none;
      border-bottom-color: #666;
    }
  }

  button {
    background-color: #ff3367;
    color: #fff;
    border-radius: 30px;
    border: 0;
    padding: 0 20px;
    cursor: pointer;
  }
`;

const errorStyles = css`
  max-width: 360px;
  font-weight: bold;
  color: #941437;

  &:not(:empty) {
    margin: -20px auto 10px;
    padding: 10px;
  }
`;

const resultsStyles = css`
  background-color: #fff;
  box-shadow: 0px 3px 17px 6px #e4e4e4;
  border-radius: 10px;
  padding: 30px 20px 60px;
  text-align: center;
  max-width: 360px;
  margin: 0 auto;
`;

type AppError = {
  message: string;
};

export default function Home() {
  const initialState: string = 'Vienna';
  const [queryDraft, setQueryDraft] = useState(initialState);
  const [query, setQuery] = useState(initialState);
  const [error, setError] = useState<AppError>();

  const [weatherData, setWeatherData] = useState<WeatherApiResponse>();


  useEffect(() => {
    async function retrieveWeatherData() {
      const response = await fetch(`/api/weather?q=${query}`);
      const json = (await response.json()) as WeatherApiResponse;

      if ('error' in json) {
        return setError({ message: json.error.message });
      } else {
        setError(undefined);
      }

      setWeatherData(json);
    }
    retrieveWeatherData();
  }, [query]);

  return (
    <div css={containerStyles}>
      <form
        css={formStyles}
        onSubmit={(event) => {
          event.preventDefault();
          setQuery(queryDraft);
        }}
      >
        <input
          data-cy="search-field"
          onChange={(event) => setQueryDraft(event.currentTarget.value)}
          value={queryDraft}
        />
        <button>Search</button>
      </form>

      <div data-cy="error-message" css={errorStyles}>
        {error?.message}
      </div>

      <div css={resultsStyles}>
        {!(weatherData && 'temp' in weatherData)
          ? 'Choose a city first!'
          : (() => {
              return (
                <>
                  <h1>
                    {weatherData.city}, {weatherData.country}
                  </h1>
                  <img
                    src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                    alt=""
                  />
                  <h2>
                    {Math.round(weatherData.temp)}°C, {weatherData.conditions}
                  </h2>
                  <div>{weatherData.conditionsDescription}</div>
                </>
              );
            })()}
      </div>
    </div>
  );
}
