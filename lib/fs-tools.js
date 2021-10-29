import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
//fs-extra
const { readJSON, writeJSON, writeFile } = fs;

//Folder path for JSON file
const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
// JSON path
const mediaJSONPath = join(dataFolderPath, "media.json");
const reviewsJSONPath = join(dataFolderPath, "reviews.json");

//read and write on products JSON files
export function getMediaJson() {
  return readJSON(mediaJSONPath);
}
export function writeMediaJson(content) {
  return readJSON(mediaJSONPath, content);
}

//Read and write reviews JSON files

export function getReviewsJson() {
  return readJSON(reviewsJSONPath)
}

export function writeReviewsJSON(content){
    return writeJSON(reviewsJSONPath, content)
}

