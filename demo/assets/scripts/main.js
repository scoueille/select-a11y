require.config({
    baseUrl: 'assets/scripts',
    paths: {
        'jquery': 'https://code.jquery.com/jquery-3.3.1.min'
    }
});

requirejs(['select-a11y'], function (a11ySelect) {
    a11ySelect.transform();
});
