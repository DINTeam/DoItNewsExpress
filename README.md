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
install npm
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
The server's code includes placeholder credentials that are set up to work with those supplied as an example in the SDK's documentation. You can use your own credentials by setting the `API_KEY` and `API_SECRET` environment variables before running the server. For example, you could supply your own credentials by running the server like so:

```
API_KEY=my_api_key API_SECRET=my_api_secret rackup
```

or for Windows based systems:

```
cmd /C "set API_KEY=my_api_key && set API_SECRET=my_api_secret && rackup"
```

## License
The sample backend is available under the MIT license. See the [LICENSE](./LICENSE) file for more info.
