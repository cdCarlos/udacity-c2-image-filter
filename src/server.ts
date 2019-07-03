import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: Request, res: Response) => {
    const { image_url } = req.query;

    if (!image_url) {
      return res
        .status(400)
        .send({ message: "Image URL required or malformed" });
    }

    if (!isImageTypeSupported(image_url.toLowerCase())) {
      return res.status(400).send({ message: "Image type not supported" });
    }

    let url: string;

    try {
      url = new URL(image_url);
    } catch (e) {
      console.error("ERROR::parseURL >> ", e);
      return res.status(400).send({ message: "Malformed image URL" });
    }

    let filtered_image: string;
    try {
      filtered_image = await filterImageFromURL(url.toString());
    } catch (err) {
      console.error("ERROR::applyFilter >> ", err);
      return res.status(204).send({ message: "Error while filtering image" });
    }

    res.download(filtered_image, async err => {
      if (err) {
        res.status(204).end();
      }

      try {
        await deleteLocalFiles([filtered_image]);
      } catch (err) {
        console.error("ERROR::deleteTempFiles >> ", err);
      }
    });
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();