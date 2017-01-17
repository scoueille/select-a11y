require.config({
    baseUrl: '.',
    paths: {
        'jquery': 'node_modules/jquery/dist/jquery.min'
    }
});

requirejs(['lib/filter-component'], function (filterComponent) {
    filterComponent.transform();
});