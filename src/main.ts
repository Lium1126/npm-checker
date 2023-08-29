import fastify from 'fastify'
import { fetchLastModifiedDate } from './modified_date'
import { fetchDownloadCount } from './download_count'
import { NotFoundError } from './error'

const server = fastify({ disableRequestLogging: false })

interface IPackageName {
    packageName: string
}

/*** 
 * Specify the endpoint with a wildcard, considering the case where the package name contains '/'.
 * The package name is obtained by extracting it from the URL.
***/
server.post<{
    Params: IPackageName
}>('/check-package/*',async (request, response) => {
    // Extract package name from URL
    const packageName = request.url.replace('/check-package/', '');

    // Get last modified date
    try {
        const lastModifiedDate = await fetchLastModifiedDate(packageName);

        // Check if the lastModifiedDate is within the last year.
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        if (lastModifiedDate.getTime() < oneYearAgo.getTime()) {  // negative check
            await response.send({ can_use : false, reason: "That package hasn't been updated in over a year" });
            return;
        }
    }
    catch (e) {
        if (e instanceof NotFoundError) await response.code(404).send({ message: "Package Not Found" });
        else await response.code(500).send({ message: "Unexpected Error" });
        return;
    }

    try {
        const downloadCount = await fetchDownloadCount(packageName);
        if (downloadCount < 500) {  // negative check
            await response.send({ can_use: false, reason: "The package has fewer than 500 installs in the last month" });
            return;
        }
    }
    catch (e) {
        if (e instanceof NotFoundError) await response.code(404).send({ message: "Package Not Found" });
        else await response.code(500).send({ message: "Unexpected Error" });
    }

    await response.send({ can_use: true, reason: "" });
    return;
})

server.listen({ port: 8080, host: "127.0.0.1" }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})
