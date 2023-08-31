import fastify from 'fastify'
import { registerRoute } from './route'

const server = fastify({ disableRequestLogging: false });

registerRoute(server);

server.listen({ port: Number(process.env.PORT ?? "8080"), host: "0.0.0.0" }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
});
