import fetch from "node-fetch"
import { NotFoundError } from "./error"

export async function fetchDownloadCount(packageName : string) : Promise<number> {
    /***
     * Get download counts from DownloadCountsAPI 
     * reference: https://github.com/npm/registry/blob/master/docs/download-counts.md
     ***/
    const response = await fetch(`https://api.npmjs.org/downloads/point/last-month/${packageName}`);
    const data = await response.json();

    /*** Responsible for handling exceptions when packages do not exist ***/
    if (response.status == 404) {
        throw new NotFoundError();
    }

    return data.downloads;
}