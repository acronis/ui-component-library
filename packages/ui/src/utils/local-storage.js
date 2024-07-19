export const DEV_MODE = 'dev';

export const getLocale = () => localStorage.getItem('locale');

export const setLocale = value => localStorage.setItem('locale', value);

export const getBrand = () => (localStorage.getItem('brand') || 'default:new').split(':');

export const setBrand = (brand, brandVersion) => localStorage.setItem('brand', `${brand}:${brandVersion}`);

export const checkDevMode = () => localStorage.getItem('mode') === DEV_MODE;

export const setDevMode = () => localStorage.setItem('mode', DEV_MODE);

export const removeDevMode = () => localStorage.removeItem('mode');

export const getFont = () => localStorage.getItem('font');

export const setFont = value => localStorage.setItem('font', value);
