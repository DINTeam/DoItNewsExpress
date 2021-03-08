# DoItNewsExpress

# Backend

This project provides article writing and portfolio writing services for prospective reporters. 

The server itself is implemented in [Node.js](https://nodejs.org/en/) using [Express](https://expressjs.com/en/). Even if you are not familiar with the language do not worry, as the code has been extensively documented.

The server logs all API requests it performs to the terminal, so you can see what's going on even without diving into the code.

## Integration with the Swagger API
This backend interacts directly with Swagger API, specifically for the purpose of authorizing and capturing orders. You can read more about the API [here](https://swagger.io/).

## Running the server
If you wish to run the server, the first step is [installing Node.js](https://nodejs.org/ko/download/).

To check if you have Node.js installed, run this command in your terminal:

```
node -v
```

Once that's out of the way, open a terminal and run the following command:

```
apt-get install npm
```

To confirm that you have npm installed you can run this command in your terminal:

```
npm -v
```

to install said dependencies.

The server is now ready to run. Simply point a terminal to the project's folder and run:

```
node .\bin\www
```

which should result in output such as:

```
"C:\Program Files\nodejs\node.exe" C:\Projects\DoItNewsExpress\bin\www
  doitnewsexpress:server Listening on port 3001 +0ms
```

indicating the server is now listening at port 3001.

### Using your credentials
The Server does not offer mysql credentials.
So you have to running your own mysql server.

We built it with [here](https://aws.amazon.com/ko/rds/?nc2=type_a) - the amazon web service RDS.
And after that, make your own db configuration file.
You can change your credential settings in [this file](./utils/pool.js)

We just wrote dead server configuration the file now.

So you can change it like the below:
```
const mysql = require('mysql');
const config = require('./db_config.json');
//db_config.json file are needed!

var pool = mysql.createPool(config);
```

db_config.json examples:
```
{
  "host": "<host>",
  "user": "<username>",
  "password": "<password>",
  "database": "<database>",
  "connectionLimit": 30
}
```

Our Server contains mail sending system with SendGrid.
So If you want to use it, you need to obatin your own API Key.
You can do this in [here](https://sendgrid.com/)

We use API_KEY alias on your computer, so just add it with solution by SendGrid.

## License
The sample backend is available under the MIT license. See the [LICENSE](./LICENSE) file for more info.
