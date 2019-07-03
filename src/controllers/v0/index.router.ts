import { Router, Request, Response } from "express";
import {
  isImageTypeSupported,
  validateURL,
  filterImageFromURL,
  deleteLocalFiles
} from "../../util/util";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  res.send("V0");
});

router.get("/image/filter", async (req: Request, res: Response) => {
  let imageURL: string = req.query.image_url;

  if (!imageURL) {
    return res.status(400).send({ message: "Image URL required or malformed" });
  }

  imageURL = validateURL(imageURL);
  if (!imageURL) {
    return res.status(400).send({ message: "Image URL malformed" });
  }

  if (!isImageTypeSupported(imageURL.toLowerCase())) {
    return res.status(422).send({ message: "Image type not supported" });
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

export const IndexRouter: Router = router;
