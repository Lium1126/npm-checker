export async function getHostedService(url : string) : Promise<string> {
    const arr = url.split("/");
    return arr.slice(-3)[0];
}

export async function getRepositoryOwner(url : string) : Promise<string> {
    const arr = url.split("/");
    return arr.slice(-2)[0];
}

export async function getRepositoryName(url : string) : Promise<string> {
    const arr = url.split("/");
    const dotGit = arr.slice(-1)[0];
    const repositoryName = dotGit.split(".");
    return repositoryName.slice(-2)[0];
}
