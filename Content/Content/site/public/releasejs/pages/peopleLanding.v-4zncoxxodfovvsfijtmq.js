jQuery.fn.InitializeSearchPage = function(option) {
    var defaults = {
        initialJsonData: null,
        serviceUrl: null,
    };
    var option = $.extend({}, defaults, option);
    var $filtersTrigger = $(".js-customize-filters-trigger");

    var $siteHeader = $(".js-site-header");
    var $scrollDefaultPosition = $(".js-scroll-default-position");

    // Load JSON data from model
    var viewModelJs = JSON.parse(option.initialJsonData);

    var viewModel = ko.mapping.fromJS(viewModelJs);
    var guidEmpty = "00000000-0000-0000-0000-000000000000";

    var pageContent = $(this);
    var keyWordIDKey = "KEYWORD";

    // Extend View Model
    viewModel.SelectedFilters = ko.observableArray();
    viewModel.IsSearchRunning = ko.observable(false);
    viewModel.HasSearchRun = ko.observable(false);
    viewModel.IsSelectAll = ko.observable(false);
    viewModel.IsClearAll = ko.observable(false);
    viewModel.HasPendingUpdates = ko.observable(false);
    viewModel.ScrollPositionUpdate = ko.observable(false);
    viewModel.PreventAutoScroll = ko.observable(false);
    viewModel.IsLoadMore = ko.observable(false);

    // Onstate change for history
    window.onstatechange = function() {
        var currentState = History.getState();
        var qs = History.getState().data["qs"];
        var qsParms = !!qs ? parseQueryString(qs) : {};

        var currentSkip = viewModel.GridData().length;
        var newSkip = 0;
        if (!!qsParms.skip && qsParms.skip > 0) {
            newSkip = parseInt(qsParms.skip);
        }
        var projectedTotal = newSkip + viewModel.SearchFilters.Take();
        if (projectedTotal < currentSkip && newSkip != 0) {
            // This is here for a back button after a page scroll
            viewModel.IsSearchRunning(true);
            viewModel.HasMoreResults(true);
            viewModel.HasSearchRun(true);
            viewModel.SearchFilters.Skip(newSkip);
            while (viewModel.GridData().length > projectedTotal) {
                var popped = viewModel.GridData.pop();
            }
            viewModel.IsSearchRunning(false);
        } else {
            // New filters have been selected so run search
            viewModel.SearchFilters.ClearAllSearchFilters();
            var hasFilters = false;
            var reloadFilters = false;
            if (!!qsParms.reload && qsParms.reload.length > 0) {
                reloadFilters = qsParms.reload == "true";
            }
            viewModel.SearchFilters.ReloadFilters(reloadFilters);
            if (!!qsParms.keyword && qsParms.keyword.length > 0) {
                viewModel.SearchFilters.KeywordFilter(qsParms.keyword);
                hasFilters = true;
            }
            if (!!qsParms.letter && qsParms.letter.length > 0) {
                ko.utils.arrayForEach(
                    viewModel.SearchFilters.LetterFilters(),
                    function(item) {
                        if (item.Name() == qsParms.letter) {
                            item.IsSelected(true);
                            hasFilters = true;
                        }
                    }
                );
            }
            if (!!qsParms.sort && qsParms.sort.length > 0) {
                viewModel.SearchFilters.SortField(qsParms.sort);
            }
            viewModel.SearchFilters.Skip(newSkip);

            if (!!qsParms.services && qsParms.services.length > 0) {
                ko.utils.arrayForEach(
                    viewModel.SearchFilters.ServiceFilters(),
                    function(item) {
                        if (qsParms.services.indexOf(item.ID()) >= 0) {
                            item.IsSelected(true);
                            hasFilters = true;
                        }
                    }
                );
            }
            if (!!qsParms.offices && qsParms.offices.length > 0) {
                ko.utils.arrayForEach(
                    viewModel.SearchFilters.OfficeFilters(),
                    function(item) {
                        if (qsParms.offices.indexOf(item.ID()) >= 0) {
                            item.IsSelected(true);
                            hasFilters = true;
                        }
                    }
                );
            }
            if (!!qsParms.levels && qsParms.levels.length > 0) {
                ko.utils.arrayForEach(
                    viewModel.SearchFilters.LevelFilters(),
                    function(item) {
                        if (qsParms.levels.indexOf(item.ID()) >= 0) {
                            item.IsSelected(true);
                            hasFilters = true;
                        }
                    }
                );
            }
            if (!!qsParms.schools && qsParms.schools.length > 0) {
                ko.utils.arrayForEach(
                    viewModel.SearchFilters.SchoolFilters(),
                    function(item) {
                        if (qsParms.schools.indexOf(item.ID()) >= 0) {
                            item.IsSelected(true);
                            hasFilters = true;
                        }
                    }
                );
            }
            if (!!qsParms.admissions && qsParms.admissions.length > 0) {
                ko.utils.arrayForEach(
                    viewModel.SearchFilters.BarAdmissionFilters(),
                    function(item) {
                        if (qsParms.admissions.indexOf(item.ID()) >= 0) {
                            item.IsSelected(true);
                            hasFilters = true;
                        }
                    }
                );
            }
            if (!!qsParms.languages && qsParms.languages.length > 0) {
                ko.utils.arrayForEach(
                    viewModel.SearchFilters.LanguageFilters(),
                    function(item) {
                        if (qsParms.languages.indexOf(item.ID()) >= 0) {
                            item.IsSelected(true);
                            hasFilters = true;
                        }
                    }
                );
            }
            if (!!qsParms.courts && qsParms.courts.length > 0) {
                ko.utils.arrayForEach(
                    viewModel.SearchFilters.CourtAdmissionFilters(),
                    function(item) {
                        if (qsParms.courts.indexOf(item.ID()) >= 0) {
                            item.IsSelected(true);
                            hasFilters = true;
                        }
                    }
                );
            }
            if (!viewModel.ScrollPositionUpdate()) {
                viewModel.LoadDataFromServer();
                viewModel.HasSearchRun(hasFilters);
            }
        }
        if (!viewModel.PreventAutoScroll() && viewModel.SelectedFilters().length === 0) {
            // Reposition by scoll position
            var scrollPosition = 0;
            if (!!qsParms.scroll && qsParms.scroll.length > 0) {
                scrollPosition = parseInt(qsParms.scroll);
            }
            $("html, body").animate({
                scrollTop: scrollPosition
            }, "slow");
        }
        return;
    };

    // Build query string based on filters
    viewModel.QueryString = function() {
        var queryString = "";
        if (
            viewModel.SearchFilters.KeywordFilter() != null &&
            viewModel.SearchFilters.KeywordFilter().length > 0
        ) {
            queryString += queryString != "" ? "&" : "?";
            queryString +=
                "keyword=" +
                encodeURIComponent(viewModel.SearchFilters.KeywordFilter());
        }
        var letter = "";
        ko.utils.arrayForEach(
            viewModel.SearchFilters.LetterFilters(),
            function(item) {
                if (item.IsSelected() == true) {
                    letter = item.Name();
                }
            }
        );
        if (letter.length > 0) {
            queryString += queryString != "" ? "&" : "?";
            queryString += "letter=" + letter;
        }
        var selectedItems = new Array();
        ko.utils.arrayForEach(
            viewModel.SearchFilters.ServiceFilters(),
            function(item) {
                if (item.IsSelected() == true && item.ID() != guidEmpty) {
                    selectedItems.push(item.ID());
                }
            }
        );
        if (selectedItems.length > 0) {
            queryString += queryString != "" ? "&" : "?";
            queryString += "services=" + selectedItems.join();
        }
        selectedItems = new Array();
        ko.utils.arrayForEach(
            viewModel.SearchFilters.OfficeFilters(),
            function(item) {
                if (item.IsSelected() == true && item.ID() != guidEmpty) {
                    selectedItems.push(item.ID());
                }
            }
        );
        if (selectedItems.length > 0) {
            queryString += queryString != "" ? "&" : "?";
            queryString += "offices=" + selectedItems.join();
        }
        selectedItems = new Array();
        ko.utils.arrayForEach(
            viewModel.SearchFilters.LevelFilters(),
            function(item) {
                if (item.IsSelected() == true && item.ID() != guidEmpty) {
                    selectedItems.push(item.ID());
                }
            }
        );
        if (selectedItems.length > 0) {
            queryString += queryString != "" ? "&" : "?";
            queryString += "levels=" + selectedItems.join();
        }
        selectedItems = new Array();
        ko.utils.arrayForEach(
            viewModel.SearchFilters.SchoolFilters(),
            function(item) {
                if (item.IsSelected() == true && item.ID() != guidEmpty) {
                    selectedItems.push(item.ID());
                }
            }
        );
        if (selectedItems.length > 0) {
            queryString += queryString != "" ? "&" : "?";
            queryString += "schools=" + selectedItems.join();
        }
        selectedItems = new Array();
        ko.utils.arrayForEach(
            viewModel.SearchFilters.BarAdmissionFilters(),
            function(item) {
                if (item.IsSelected() == true && item.ID() != guidEmpty) {
                    selectedItems.push(item.ID());
                }
            }
        );
        if (selectedItems.length > 0) {
            queryString += queryString != "" ? "&" : "?";
            queryString += "admissions=" + selectedItems.join();
        }
        selectedItems = new Array();
        ko.utils.arrayForEach(
            viewModel.SearchFilters.LanguageFilters(),
            function(item) {
                if (item.IsSelected() == true && item.ID() != guidEmpty) {
                    selectedItems.push(item.ID());
                }
            }
        );
        if (selectedItems.length > 0) {
            queryString += queryString != "" ? "&" : "?";
            queryString += "languages=" + selectedItems.join();
        }
        selectedItems = new Array();
        ko.utils.arrayForEach(
            viewModel.SearchFilters.CourtAdmissionFilters(),
            function(item) {
                if (item.IsSelected() == true && item.ID() != guidEmpty) {
                    selectedItems.push(item.ID());
                }
            }
        );
        if (selectedItems.length > 0) {
            queryString += queryString != "" ? "&" : "?";
            queryString += "courts=" + selectedItems.join();
        }
        if (viewModel.SearchFilters.Skip() > 0) {
            queryString += queryString != "" ? "&" : "?";
            queryString += "skip=" + viewModel.SearchFilters.Skip();
        }
        queryString += queryString != "" ? "&" : "?";
        queryString += "reload=" + viewModel.SearchFilters.ReloadFilters();

        if (viewModel.PreventAutoScroll() && viewModel.SelectedFilters().length > 0) {
            queryString += queryString != "" ? "&" : "?";
            queryString += "scroll=" + $(window).scrollTop();
        }
        return queryString;
    };

    // Run search by pushing new state
    viewModel.Search = function() {
        viewModel.SearchFilters.Skip(0);
        var qs = viewModel.QueryString();
        viewModel.ScrollPositionUpdate(false);
        History.pushState({
            qs: qs
        }, History.options.initialTitle, qs);
    };

    // Load next page
    viewModel.LoadNextPage = function() {
        viewModel.SearchFilters.Skip(viewModel.GridData().length);
        var qs = viewModel.QueryString();
        viewModel.ScrollPositionUpdate(false);
        viewModel.HasPendingUpdates(true);
        viewModel.PreventAutoScroll(true);
        viewModel.IsLoadMore(true);
        History.pushState({
            qs: qs
        }, History.options.initialTitle, qs);
    };

    // Load data from server
    viewModel.LoadDataFromServer = function() {
        viewModel.PreventAutoScroll(false);
        viewModel.IsSearchRunning(true);
        var viewModelToSend = GetRequestObject(viewModel.SearchFilters);

        $.ajax({
            url: option.serviceUrl,
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: ko.mapping.toJSON(viewModelToSend),
            cache: false,
            success: function(data) {
                var results = ko.observableArray();
                if (viewModel.SearchFilters.Skip() == 0) {
                    viewModel.ResultCount(0);
                    viewModel.GridData.removeAll();
                }
                ko.mapping.fromJS(data.GridData, {}, results);
                ko.utils.arrayForEach(results(), function(item) {
                    viewModel.GridData.push(item);
                });

                viewModel.ResultCount(data.ResultCount);
                viewModel.HasMoreResults(data.HasMoreResults);
                viewModel.SearchFilters.KeywordFilter(data.SearchFilters.KeywordFilter);
                viewModel.SearchFilters.ReloadFilters(data.SearchFilters.ReloadFilters);

                viewModel.SetSelectedFilters();
                viewModel.HasPendingUpdates(false);

                viewModel.IsSearchRunning(false);

                if (!viewModel.PreventAutoScroll() && !viewModel.IsLoadMore() && viewModel.SelectedFilters().length > 0) {
                    var scrollPosition = $(".people-search-results").offset().top - $('.js-site-header').height();
                    $("html, body").animate({
                        scrollTop: scrollPosition
                    }, "slow");
                }
                viewModel.IsLoadMore(false);
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log(xhr);
                console.log("textStatus : " + textStatus);
                console.log("errorThrown : " + errorThrown);
            },
        });
    };

    // Animations for new lit items
    viewModel.animateGridInsert = function(elem) {
        if (elem.nodeType === 1) $(elem).hide().fadeIn(1000);
    };
    viewModel.animateGridDelete = function(elem) {
        if (elem.nodeType === 1)
            $(elem).fadeOut(500, function() {
                $(elem).remove();
            });
    };

    // Clear page and reload filters
    viewModel.ClearPage = function() {
        viewModel.SearchFilters.ReloadFilters(true);
        viewModel.SearchFilters.ClearAllSearchFilters();
        viewModel.Search();
    };

    // Clear all filters and run search
    viewModel.SearchFilters.ClearSelectedFilters = function() {
        viewModel.SearchFilters.ClearAllSearchFilters();
        viewModel.SelectedFilters.removeAll();
        viewModel.Search();
    };

    // Clear all filters
    viewModel.SearchFilters.ClearAllSearchFilters = function(callBack) {
        viewModel.SearchFilters.KeywordFilter("");
        viewModel.SearchFilters.ClearAdvancedSearchFilters(callBack);
        ko.utils.arrayForEach(
            viewModel.SearchFilters.LetterFilters(),
            function(item) {
                item.IsSelected(false);
            }
        );
    };

    viewModel.SearchFilters.ClearAdvancedSearchFilters = function(callBack) {
        ko.utils.arrayForEach(
            viewModel.SearchFilters.ServiceFilters(),
            function(item) {
                item.IsSelected(false);
            }
        );
        ko.utils.arrayForEach(
            viewModel.SearchFilters.OfficeFilters(),
            function(item) {
                item.IsSelected(false);
            }
        );
        ko.utils.arrayForEach(
            viewModel.SearchFilters.SchoolFilters(),
            function(item) {
                item.IsSelected(false);
            }
        );
        ko.utils.arrayForEach(
            viewModel.SearchFilters.LevelFilters(),
            function(item) {
                item.IsSelected(false);
            }
        );
        ko.utils.arrayForEach(
            viewModel.SearchFilters.BarAdmissionFilters(),
            function(item) {
                item.IsSelected(false);
            }
        );
        ko.utils.arrayForEach(
            viewModel.SearchFilters.LanguageFilters(),
            function(item) {
                item.IsSelected(false);
            }
        );
        ko.utils.arrayForEach(
            viewModel.SearchFilters.CourtAdmissionFilters(),
            function(item) {
                item.IsSelected(false);
            }
        );
        if (!!callBack && $.isFunction(callBack)) {
            callBack();
        }
    };

    viewModel.SetSelectAll = function() {
        viewModel.SearchFilters.ClearAdvancedSearchFilters();
        viewModel.IsSelectAll(true);
        viewModel.IsClearAll(false);
        viewModel.HasPendingUpdates(true);
    };

    viewModel.SetClearAll = function() {
        viewModel.SearchFilters.ClearAllSearchFilters();
        viewModel.IsSelectAll(false);
        viewModel.IsClearAll(true);
        viewModel.HasPendingUpdates(true);
    };

    // Clear Keyword Filter
    viewModel.SearchFilters.KeywordFilter.ClearFilter = function() {
        viewModel.SearchFilters.KeywordFilter("");
        viewModel.Search();
    };

    // Set selected filters
    viewModel.SetSelectedFilters = function() {
        var practiceCount = 0;
        var officeCount = 0;
        var industryCount = 0;
        viewModel.SelectedFilters.removeAll();
        if (
            viewModel.SearchFilters.KeywordFilter() != null &&
            viewModel.SearchFilters.KeywordFilter().length > 0
        ) {
            var newItem = {
                ID: ko.observable(keyWordIDKey),
                IsEnabled: ko.observable(true),
                IsSelected: ko.observable(true),
                Name: ko.observable(viewModel.SearchFilters.KeywordFilter()),
                Label: ko.observable(option.keyWordLabel),
                Url: ko.observable("#0"),
            };
            newItem.ClearFilter = function() {
                viewModel.SearchFilters.KeywordFilter("");
                viewModel.Search();
            };
            viewModel.SelectedFilters.push(newItem);
        }
        ko.utils.arrayForEach(
            viewModel.SearchFilters.LetterFilters(),
            function(item) {
                if (item.IsSelected() == true) {
                    viewModel.SelectedFilters.push(item);
                }
            }
        );
        ko.utils.arrayForEach(
            viewModel.SearchFilters.ServiceFilters(),
            function(item) {
                if (item.IsSelected() == true && item.ID() != guidEmpty) {
                    viewModel.SelectedFilters.push(item);
                }
            }
        );
        ko.utils.arrayForEach(
            viewModel.SearchFilters.OfficeFilters(),
            function(item) {
                if (item.IsSelected() == true && item.ID() != guidEmpty) {
                    viewModel.SelectedFilters.push(item);
                }
            }
        );
        ko.utils.arrayForEach(
            viewModel.SearchFilters.SchoolFilters(),
            function(item) {
                if (item.IsSelected() == true && item.ID() != guidEmpty) {
                    viewModel.SelectedFilters.push(item);
                }
            }
        );
        ko.utils.arrayForEach(
            viewModel.SearchFilters.LevelFilters(),
            function(item) {
                if (item.IsSelected() == true && item.ID() != guidEmpty) {
                    viewModel.SelectedFilters.push(item);
                }
            }
        );
        ko.utils.arrayForEach(
            viewModel.SearchFilters.BarAdmissionFilters(),
            function(item) {
                if (item.IsSelected() == true && item.ID() != guidEmpty) {
                    viewModel.SelectedFilters.push(item);
                }
            }
        );
        ko.utils.arrayForEach(
            viewModel.SearchFilters.LanguageFilters(),
            function(item) {
                if (item.IsSelected() == true && item.ID() != guidEmpty) {
                    viewModel.SelectedFilters.push(item);
                }
            }
        );
        ko.utils.arrayForEach(
            viewModel.SearchFilters.CourtAdmissionFilters(),
            function(item) {
                if (item.IsSelected() == true && item.ID() != guidEmpty) {
                    viewModel.SelectedFilters.push(item);
                }
            }
        );
        $filtersTrigger.text($filtersTrigger.attr("data-expanded-label"));
    };

    // Click action for sort sort links
    viewModel.SetSortField = function(sortField) {
        viewModel.SearchFilters.SortField(sortField);
        viewModel.Search();
        return false;
    };

    // Set filters that might have been included from a back button
    viewModel.SetSelectedFilters();

    // Apply Bindings
    ko.applyBindings(viewModel, pageContent.get(0));

    var selectedItem = ko.utils.arrayFirst(
        viewModel.SearchFilters.ServiceFilters(),
        function(item) {
            return item.IsSelected() == true;
        }
    );
    if (selectedItem != null) {
        selectedItem.IsSelected(false);
        selectedItem.IsSelected(true);
    }
    var selectedItem = ko.utils.arrayFirst(
        viewModel.SearchFilters.OfficeFilters(),
        function(item) {
            return item.IsSelected() == true;
        }
    );
    if (selectedItem != null) {
        selectedItem.IsSelected(false);
        selectedItem.IsSelected(true);
    }
    var selectedItem = ko.utils.arrayFirst(
        viewModel.SearchFilters.SchoolFilters(),
        function(item) {
            return item.IsSelected() == true;
        }
    );
    if (selectedItem != null) {
        selectedItem.IsSelected(false);
        selectedItem.IsSelected(true);
    }
    var selectedItem = ko.utils.arrayFirst(
        viewModel.SearchFilters.LevelFilters(),
        function(item) {
            return item.IsSelected() == true;
        }
    );
    if (selectedItem != null) {
        selectedItem.IsSelected(false);
        selectedItem.IsSelected(true);
    }
    var selectedItem = ko.utils.arrayFirst(
        viewModel.SearchFilters.BarAdmissionFilters(),
        function(item) {
            return item.IsSelected() == true;
        }
    );
    if (selectedItem != null) {
        selectedItem.IsSelected(false);
        selectedItem.IsSelected(true);
    }
    var selectedItem = ko.utils.arrayFirst(
        viewModel.SearchFilters.LanguageFilters(),
        function(item) {
            return item.IsSelected() == true;
        }
    );
    if (selectedItem != null) {
        selectedItem.IsSelected(false);
        selectedItem.IsSelected(true);
    }
    var selectedItem = ko.utils.arrayFirst(
        viewModel.SearchFilters.CourtAdmissionFilters(),
        function(item) {
            return item.IsSelected() == true;
        }
    );
    if (selectedItem != null) {
        selectedItem.IsSelected(false);
        selectedItem.IsSelected(true);
    }

    // Check for scroll in query string
    var qsParms = parseQueryString(window.location.href);
    var scrollPosition = 0;
    if (!!qsParms.scroll && qsParms.scroll.length > 0) {
        scrollPosition = parseInt(qsParms.scroll);
    }
    if (viewModel.SelectedFilters().length > 0) {
        viewModel.HasSearchRun(true);
        viewModel.IsSelectAll(false);
        viewModel.IsClearAll(false);
    } else {
        viewModel.IsClearAll(false);
    }
    $("html, body").animate({
        scrollTop: scrollPosition
    }, "slow");

    $(window).on("scroll", function() {
        var distanceFromTop = $(window).scrollTop() + $(window).height();
        var triggerDistance = 0;

        if ($(".js-load-more").length) {
            triggerDistance = $(".js-load-more").offset().top - 500;
        }

        if (
            distanceFromTop > triggerDistance &&
            viewModel.HasMoreResults() &&
            !viewModel.HasPendingUpdates()
        ) {
            viewModel.LoadNextPage(false);
        }
    });

    // Custom binding hor history click
    ko.bindingHandlers.bindHistoryClick = {
        init: function(element, valueAccessor) {
            var anchorTag = $(element);
            var observable = valueAccessor();

            anchorTag.on("click tap", function(e) {
                e.preventDefault();

                var qs = viewModel.QueryString();
                viewModel.ScrollPositionUpdate(true);
                History.replaceState({
                    qs: qs
                }, History.options.initialTitle, qs);

                window.location = observable.Url();
            });
        },
    };
};