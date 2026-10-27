const envUrl = import.meta.env.VITE_API_URL;
const API = envUrl && envUrl !== 'undefined' ? envUrl : 'http://localhost:3001';

export default API;