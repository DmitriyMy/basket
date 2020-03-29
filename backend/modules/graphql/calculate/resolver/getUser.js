function getUser(args, context) {
    return 'User'
}

module.exports = {
    Query: {
        getUser: (parent, args, context) => getUser(args, context)
    },
}