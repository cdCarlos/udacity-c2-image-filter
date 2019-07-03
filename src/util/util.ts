import fs from "fs";
import Jimp = require("jimp");
const URL = require("url-parse");

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const outpath = `/tmp/filtered.${Math.floor(Math.random() * 2000)}.jpg`;

      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, img => {
          resolve(__dirname + outpath);
        });
    } catch (err) {
      console.error("ERROR::filterImageFromURL >> ", err);
      reject(err);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}

export function isImageTypeSupported(url: string): boolean {
  if (url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg")) {
    return true;
  }
  return false;
}

/**
 * This function verifies that the given string is a valid URL.
 *
 * @param {String} url  String value representing a URL.
 *
 * @returns {String|undefined} URL.
 *
 */
export function validateURL(url: string): string {
  try {
    url = new URL(url).toString();
  } catch (e) {
    console.error("ERROR::parseURL >> ", e);
    url = undefined;
  }
  return url;
}
