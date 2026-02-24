export default {
    introspection: {
        type: 'sdl',
        paths: ['./graphql/schema.flat.graphql'],
    },
    website: {
        template: 'carbon-multi-page',
        title: 'ControlApp GraphQL API',
        description: 'Automatic GraphQL documentation for ControlApp.',
        output: './public/docs/graphql',
    },
}
