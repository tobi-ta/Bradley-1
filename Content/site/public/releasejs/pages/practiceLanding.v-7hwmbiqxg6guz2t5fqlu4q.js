jQuery.fn.InitializeLandingPage = function(option) {
    var pageContent = $(this);

    var viewModel = {};
    viewModel.KeywordFilter = ko.observable('');

    var activeClass = "is-active-tab";

    function updateTabClasses($el, tabContainerClass) {
        var tabButton = $el

        $('.tabs-nav__item').removeClass(activeClass);
        tabButton.parent('.tabs-nav__item').addClass(activeClass);
        $('.tab-content__item').removeClass(activeClass);
        $("." + tabContainerClass).addClass(activeClass);
    }

    viewModel.TabClicked = function(el, tabContainer) {
        var clickedTab = $(el);

        updateTabClasses(clickedTab, tabContainer)

        var qs = "?tab=" + tabContainer
        History.pushState({
            qs: qs
        }, History.options.initialTitle, qs);
    }


    function onInitialize() {
        var qs = History.getState().data['qs'];
        var qsParms = parseQueryString(qs);

        // If hasSearchParams
        if (qsParms.tab) {
            var buttonThatMatchesParam = $('.js-tabs-belt')
                .find('.js-tabs-nav-link')
                .filter(function() {
                    return $(this).data("tab") == qsParms.tab
                });

            if (buttonThatMatchesParam.length > 0) {
                updateTabClasses(buttonThatMatchesParam, qsParms.tab)
            }
        }
    }


    onInitialize()

    // Apply Bindings
    ko.applyBindings(viewModel, pageContent.get(0));
};