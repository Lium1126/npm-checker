import fastify from "fastify";
import { registerRoute } from "../src/route";
import * as modifiedDate from "../src/modified_date"
import * as downloadCount from "../src/download_count"
import { NotFoundError } from "../src/error";

describe("main", () => {
    const server = fastify();

    beforeAll(() => {
        registerRoute(server);
        // テストコードなのでListenは不要
    });

    let modifiedDateSpy : jest.SpyInstance;
    let downloadCountSpy : jest.SpyInstance;
    beforeEach(() => {
        modifiedDateSpy = jest.spyOn(modifiedDate, "fetchLastModifiedDate").mockImplementation(async () => {
            return new Date();
        });
        downloadCountSpy = jest.spyOn(downloadCount, "fetchDownloadCount").mockImplementation(async () => {
            return 100000000;
        });
    });

    afterEach(() => {
        modifiedDateSpy.mockRestore();
        downloadCountSpy.mockRestore();
    })

    test("If the specified package satisfies the conditions, true is set to can_use AND the status code is 200.", async () => {
        const response = await server.inject({ method: "POST", url: "/check-package/dummy" });
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toStrictEqual({ can_use: true, reason: "" });
    });

    test("For packages that have not been updated for over a year, false is set to can_use and 200 is set to the status code.",async () => {
        modifiedDateSpy.mockImplementationOnce(async () => {
            return new Date('2022-01-01T09:29:29.706Z');
        });

        const response = await server.inject({ method: "POST", url: "/check-package/dummy" });
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toStrictEqual({ can_use: false, reason: "That package hasn't been updated in over a year" });        
    });

    test("If the package does not exist in the last update date confirmation API, the status code is 404 and message is set.", async () => {
        modifiedDateSpy.mockImplementationOnce(async () => {
            throw new NotFoundError();
        });

        const response = await server.inject({ method: "POST", url: "/check-package/dummy" });
        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.body)).toStrictEqual({ message: "Package Not Found" });        
    });

    test("If the last update date confirmation API outputs an error status, the status code is set to 500 and a message is set.", async () => {
        modifiedDateSpy.mockImplementationOnce(async () => {
            throw new Error();
        });

        const response = await server.inject({ method: "POST", url: "/check-package/dummy" });
        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body)).toStrictEqual({ message: "Unexpected Error" });        
    });

    test("For packages with less than 500 downloads, can_use is set to false and status code is set to 200.", async () => {
        downloadCountSpy.mockImplementationOnce(async () => {
            return 0;
        });

        const response = await server.inject({ method: "POST", url: "/check-package/dummy" });
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toStrictEqual({ can_use: false, reason: "The package has fewer than 500 installs in the last month" });        
    });

    test("If the package does not exist in the download counting API, the status code is 404 and message is set", async () => {
        downloadCountSpy.mockImplementationOnce(async () => {
            throw new NotFoundError();
        });

        const response = await server.inject({ method: "POST", url: "/check-package/dummy" });
        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.body)).toStrictEqual({ message: "Package Not Found" });        
    });

    test("If the download counting API outputs an error status, the status code is set to 500 and a message is set.", async () => {
        downloadCountSpy.mockImplementationOnce(async () => {
            throw new Error();
        });

        const response = await server.inject({ method: "POST", url: "/check-package/dummy" });
        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body)).toStrictEqual({ message: "Unexpected Error" });        
    });
});
