import fetch from 'node-fetch';
import { NotFoundError } from './error';

export async function fetchContributors(owner : string, repository : string) : Promise<Object> {
    /***
     * Get contributors information from list-repository-contributors-API
     * reference: https://docs.github.com/ja/free-pro-team@latest/rest/repos/repos?apiVersion=2022-11-28#list-repository-contributors
     ***/
    const response = await fetch(`https://api.github.com/repos/${owner}/${repository}/contributors`);
    const data = await response.json();

    /*** Responsible for handling exceptions when packages do not exist ***/
    if (response.status == 404) {
        throw new NotFoundError();
    }

    return data;
}