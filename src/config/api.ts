import axios from 'axios';

/**
 * @description - Returns the Field Right API URL for the current environment.
 */
// const baseURL = __DEV__ ? 'https://fieldrightapitest.herokuapp.com' : 'https://fieldrightapi.herokuapp.com';
const baseURL = 'https://fieldrightapitest.herokuapp.com';
// const baseURL = 'https://fieldrightapi.herokuapp.com';

/**
 * @method api
 * @description - This is the axios instance for the Field Right Hosted API
 */
export const api = axios.create({ baseURL });

/**
 * @method google
 * @description - This is the axios instance for the Google Hosted API
 */
export const google = axios.create({
	baseURL:
		'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&key=AIzaSyC2_uGMQfhxhLRCsIDkHPy7RDGe7DwXLVQ&',
});

/**
 * @method ibge
 * @description - This is the axios instance for the IBGE Hosted API v1
 */
export const ibge = axios.create({
	baseURL: 'https://servicodados.ibge.gov.br/api/v1',
});
export const Count = [
	{
	  id: 1,
	  value: "1",
	  label: "1x",
	},
	{
	  id: 2,
	  value: "2",
	  label: "2x",
	},
	{
	  id: 3,
	  value: "3",
	  label: "3x",
	},
	{
	  id: 4,
	  value: "4",
	  label: "4x",
	},
	{
	  id: 5,
	  value: "5",
	  label: "5x",
	},
	{
	  id: 6,
	  value: "6",
	  label: "6x",
	},
	{
	  id: 7,
	  value: "7",
	  label: "7x",
	},
	{
	  id: 8,
	  value: "8",
	  label: "8x",
	},
	{
	  id: 9,
	  value: "9",
	  label: "9x",
	},
	{
	  id: 10,
	  value: "10",
	  label: "10x",
	},
	{
	  id: 11,
	  value: "11",
	  label: "11x",
	},
  ];
  