import fastify from 'fastify'
import { fetchLastModifiedDate } from './modified_date'
import { fetchDownloadCount } from './download_count'
import { NotFoundError } from './error'
import { registerRoute } from './route'

const server = fastify({ disableRequestLogging: false });

registerRoute(server);

server.listen({ port: 8080, host: "127.0.0.1" }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
});
