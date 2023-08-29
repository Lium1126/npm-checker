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

    test("Fail",async () => {
        modifiedDateSpy.mockImplementationOnce(async () => {
            return new Date('2022-01-01T09:29:29.706Z');
        });

        const response = await server.inject({ method: "POST", url: "/check-package/dummy" });
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toStrictEqual({ can_use: false, reason: "That package hasn't been updated in over a year" });        
    });

    test("Fail because not found", async () => {
        modifiedDateSpy.mockImplementationOnce(async () => {
            throw new NotFoundError();
        });

        const response = await server.inject({ method: "POST", url: "/check-package/dummy" });
        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.body)).toStrictEqual({ message: "Package Not Found" });        
    });
});
