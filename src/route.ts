import { FastifyInstance } from "fastify";
import { fetchPackageInfo } from "./packageinfo";
import { fetchDownloadCount } from "./download_count";
import { NotFoundError, UnsupportedRepositoryTypeError } from "./error";
import { fetchContributors } from "./contributors";
import { PackageInfo } from "./type";

export function registerRoute(server : FastifyInstance) {
    /*** 
     * Specify the endpoint with a wildcard, considering the case where the package name contains '/'.
     * The package name is obtained by extracting it from the URL.
    ***/
    server.post('/check-package/*',async (request, response) => {
        /*** Extract package name from URL ***/
        const packageName = request.url.replace('/check-package/', '');

        try {
            /*** Request last updated date, repository information and counts of download based on packageName ***/
            const packageInfo = await fetchPackageInfo(packageName);
            const downloadCount = await fetchDownloadCount(packageName);
            const contributors = await fetchContributors(packageInfo.owner, packageInfo.repository);

            displaySummary(packageName, packageInfo, downloadCount, contributors);

            /*** Check if the lastModifiedDate is within the last year. ***/
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            if (packageInfo.modified.getTime() < oneYearAgo.getTime()) {  // negative check
                await response.send({ can_use : false, reason: "That package hasn't been updated in over 1 year" });
                return;
            }

            /*** Check if downloadCount is above the threshold ***/
            if (downloadCount < 500) {  // negative check
                await response.send({ can_use: false, reason: "The package has fewer than 500 installs in the last month" });
                return;
            }

            /*** check whether the number of people working on the project exceeds the threshold. */
            if (Object.keys([contributors][0]).length < 5) {  // negative check
                await response.send({ can_use : false, reason: "This package has few contributors" });
                return;
            }
        }
        catch (e) {
            if (e instanceof NotFoundError) {
                await response.code(404).send({ message: "Package Not Found" });
            }
            else if (e instanceof UnsupportedRepositoryTypeError) {
                await response.code(500).send({ message: "Unsupported Repository Type" });
            }
            else {
                await response.code(500).send({ message: "Unexpected Error" });
            }
            return;
        }

        /*** send normal response ***/
        await response.send({ can_use: true, reason: "" });
        return;
    });

    server.get('/health',async (request, response) => {
        return "OK";
    });
}

function displaySummary(packageName : string, packageInfo : PackageInfo, downloadCount : number, contributors : Object) {
    console.log();
    console.log(`Package Name:\t\t${packageName}`);
    console.log(`Repository:\t\t${packageInfo.owner}/${packageInfo.repository}`);
    console.log(`Last Modified:\t\t${packageInfo.modified}`);
    console.log(`Count of Download:\t${downloadCount}`);
    
    let enumerateContributors : string = "";
    Object.values(contributors).forEach(function (value) {
        if (enumerateContributors) enumerateContributors += ", ";
        enumerateContributors += value.login;
    });
    console.log(`Contributors:\t\t${enumerateContributors}`);
}