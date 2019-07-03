import express from "express";
import bodyParser from "body-parser";
import { Request, Response } from "express";
import {
  filterImageFromURL,
  deleteLocalFiles,
  isImageTypeSupported,
  validateURL
} from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: Request, res: Response) => {
    let imageURL: string = req.query.image_url;

    if (!imageURL) {
      return res
        .status(400)
        .send({ message: "Image URL required or malformed" });
    }

    if (!isImageTypeSupported(imageURL.toLowerCase())) {
      return res.status(400).send({ message: "Image type not supported" });
    }

    imageURL = validateURL(imageURL);
    if (!imageURL) {
      return res.status(400).send({ message: "Image URL malformed" });
    }

    let filteredImagePath: string;
    try {
      filteredImagePath = await filterImageFromURL(imageURL);
    } catch (err) {
      console.error("ERROR::applyFilter >> ", err);
      return res.status(204).send({ message: "Error while filtering image" });
    }

    res.download(filteredImagePath, async err => {
      if (err) {
        res.status(204).end();
      }

      try {
        await deleteLocalFiles([filteredImagePath]);
      } catch (err) {
        console.error("ERROR::deleteTempFiles >> ", err);
      }
    });
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
