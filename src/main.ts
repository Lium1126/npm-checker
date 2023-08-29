import fastify from 'fastify'

const server = fastify()

server.get('/ping', async (request, reply) => {
    return 'pong\n'
})

server.listen({ port: 8080 }, (err, address) => {
    // Try-catchも勉強しておこう
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})
