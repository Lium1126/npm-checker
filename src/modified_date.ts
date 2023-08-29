import fetch from 'node-fetch';
import { NotFoundError } from './error';

export async function fetchLastModifiedDate(packageName : string) : Promise<Date> {
    const response = await fetch(`https://registry.npmjs.org/${packageName}`);
    const data = await response.json();

    // Responsible for handling exceptions when packages do not exist
    if (response.status == 404) {
        throw new NotFoundError();
    }

    return new Date(data.time.modified);
}