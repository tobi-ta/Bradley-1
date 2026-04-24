jQuery.fn.InitializeSearchPage = function() {
    var pageContent = $(this);

    var viewModelSearch = {};
    viewModelSearch.KeywordFilter = ko.observable('');

    viewModelSearch.Search = function() {
        var siteSearchUrl = option.siteSearchUrl + "?query=" + encodeURIComponent(viewModelSearch.KeywordFilter());
        window.location.href = siteSearchUrl;
    }

    // Apply Bindings
    ko.applyBindings(viewModelSearch, pageContent.get(0));
};