require.config({
    baseUrl: '.',
    paths: {
        'jquery': 'node_modules/jquery/dist/jquery.min'
    }
});

requirejs(['lib/select-a11y'], function (a11ySelect) {
    a11ySelect.transform();
});