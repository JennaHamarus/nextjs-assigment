const express = require('express'); // Rivi 1
const app = express(); // Rivi 2
const port = process.env.PORT || 5000; // Rivi 3
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

  app.listen(port, () => console.log(`Listening on port ${port}`));

const cors = require('cors');
app.use(cors());


app.get('/get_prices', async function (req, res) {
	const url ='https://api.porssisahko.net/v1/latest-prices.json';

	(async () => {
		const response = await fetch(url);
		const body = await response.text();
		console.log(body);
	})();

	const options = {
		method: 'GET',
		headers: {
		  'Content-Type': 'application/json'
		},
	  };
	
		try {
			let response = await fetch(url, options);
			response = await response.json();
			res.status(200).json(response);
		} catch (err) {
			console.log(err);
			res.status(500).json({msg: `Internal Server Error.`});
		}
});