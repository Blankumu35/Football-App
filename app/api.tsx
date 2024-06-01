import axios from 'axios';


const API_KEY = '411b10d0b7mshaae3b28cbbccfdep1aced9jsnf1dd4e7d051b';
const BASE_URL = "https://api-football-v1.p.rapidapi.com/v3";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
    'X-RapidAPI-Key': API_KEY,
  },
});

export const getLeagues = async () => {
  try {
    const response = await api.get('/leagues');
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getTeams = async (leagueId) => {
  try {
    const response = await api.get(`/teams?league=${leagueId}&season=2023`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getResults = async (leagueId) => {
  try {
    const response = await api.get(`/fixtures?league=${leagueId}&season=2023&status=FT`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getFixtures = async (leagueId) => {
  try {
    const response = await api.get(`/fixtures?league=${leagueId}&season=2023&status=NS`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};