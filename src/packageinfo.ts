import fetch from 'node-fetch';
import { NotFoundError, UnsupportedRepositoryTypeError } from './error';
import { PackageInfo } from './type';
import { getHostedService, getRepositoryOwner, getRepositoryName } from './repository';

export async function fetchPackageInfo(packageName : string) : Promise<PackageInfo> {
    /***
     * Get package information from RegistryAPI 
     * reference: https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md
     ***/
    const response = await fetch(`https://registry.npmjs.org/${packageName}`);
    const data = await response.json();

    /*** Responsible for handling exceptions when packages do not exist ***/
    if (response.status == 404) {
        throw new NotFoundError();
    }

    /*** Get repository information ***/
    const hostedService : string = await getHostedService(data.repository.url);
    if (!(data.repository.type === 'git' && hostedService === 'github.com')) {
        throw new UnsupportedRepositoryTypeError();
    }

    const repositoryOwner : string = await getRepositoryOwner(data.repository.url);
    const repositoryName : string = await getRepositoryName(data.repository.url);

    return { modified: new Date(data.time.modified), owner: repositoryOwner, repository: repositoryName };
}
