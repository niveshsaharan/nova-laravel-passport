Nova.booting((Vue, router, store) => {
    router.addRoutes([
        {
            name: 'laravel-passport',
            path: '/laravel-passport',
            component: require('./components/OauthTokens'),
        },
    ])
})
