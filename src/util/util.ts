import fs from "fs";
import Jimp = require("jimp");
const URL = require("url-parse");

/**
 * Helper function to download, filter, and save the filtered image locally.
 *
 * @param {String} inputURL A publicly accessible url to an image file.
 *
 * @returns {String} Absolute path to a filtered image and locally saved file.
 *
 */
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const outPath = `/tmp/filtered.${Math.floor(Math.random() * 2000)}.jpg`;

      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outPath, img => {
          resolve(__dirname + outPath);
        });
    } catch (err) {
      console.error("ERROR::filterImageFromURL >> ", err);
      reject(err);
    }
  });
}

/**
 * helper function to delete files on the local disk, useful to cleanup after applying filters to images.
 *
 * @param {Array<String>} files An array of absolute paths to files.
 *
 */
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}

/**
 * This function verifies that the given image path in string format is a supported image format.
 * Supported images types are: PNG, JPG, JPEG.
 *
 * @param {String} imagePath Absolute path from drive or web server (URL).
 *
 * @returns {Boolean} Weather or not the image is a supported format.
 *
 */
export function isImageTypeSupported(imagePath: string): boolean {
  return (
    imagePath.endsWith(".png") ||
    imagePath.endsWith(".jpg") ||
    imagePath.endsWith(".jpeg")
  );
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
