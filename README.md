# Udagram Image Filtering Microservice

This microservice exposes and endpoint which uses a query parameter to download an image from a public URL, filter the image, and return the filtered image to the client.

## Usage

### Installation

Once you have downloaded the [repository](https://github.com/cdCarlos/udacity-c2-image-filter.git), open a terminal inside the repository and install the dependencies as follows:

```bash
$ npm install
```

### Development Server

To spin up a development server and start testing the app use:

```bash
$ npm run dev
```

## REST API

- [Image Filter](docs/restapi/image/filter/get.md): `GET /api/v0/image/filter`

### Postman

If you load into Postman `cloud-cdnd-c2-final.postman_collection.json` you should be able to test exposed endpoint locally and once it has been deployed to a remote server.
