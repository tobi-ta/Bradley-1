jQuery.fn.InitializeSearchPage = function(option) {
    var defaults = {
        initialJsonData: null,
        serviceUrl: null
    };
    var option = $.extend({}, defaults, option);
    var $filtersTrigger = $('.js-customize-filters-trigger');

    var $siteHeader = $('.js-site-header');
    var $scrollDefaultPosition = $('.js-scroll-default-position');

    // Load JSON data from model
    var viewModelJs = JSON.parse(option.initialJsonData);
    var viewModel = ko.mapping.fromJS(viewModelJs)
    var guidEmpty = '00000000-0000-0000-0000-000000000000'

    var pageContent = $(this);
    var keyWordIDKey = 'KEYWORD';
    var activeClass = "is-active";

    // Extend View Model
    viewModel.SelectedFilters = ko.observableArray();
    viewModel.IsSearchRunning = ko.observable(false);
    viewModel.HasSearchRun = ko.observable(false);
    viewModel.IsSelectAll = ko.observable(false);
    viewModel.IsClearAll = ko.observable(false);
    viewModel.HasPendingUpdates = ko.observable(false);
    viewModel.ScrollPositionUpdate = ko.observable(false);

    // Onstate change for history
    window.onstatechange = function() {
        var currentState = History.getState();
        var qs = History.getState().data['qs'];
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
                reloadFilters = (qsParms.reload == "true");
            }
            viewModel.SearchFilters.ReloadFilters(reloadFilters);
            if (!!qsParms.keyword && qsParms.keyword.length > 0) {
                viewModel.SearchFilters.KeywordFilter(qsParms.keyword);
                hasFilters = true;
            }
            viewModel.SearchFilters.Skip(newSkip);

            if (!!qsParms.practices && qsParms.practices.length > 0) {
                ko.utils.arrayForEach(viewModel.SearchFilters.PracticeFilters(), function(item) {
                    if (qsParms.practices.indexOf(item.ID()) >= 0) {
                        item.IsSelected(true);
                        hasFilters = true;
                    }
                });
            }
            if (!!qsParms.blogs && qsParms.blogs.length > 0) {
                ko.utils.arrayForEach(viewModel.SearchFilters.BlogFilters(), function(item) {
                    if (qsParms.blogs.indexOf(item.ID()) >= 0) {
                        item.IsSelected(true);
                        hasFilters = true;
                    }
                });
            }
            if (!!qsParms.industries && qsParms.industries.length > 0) {
                ko.utils.arrayForEach(viewModel.SearchFilters.IndustryFilters(), function(item) {
                    if (qsParms.industries.indexOf(item.ID()) >= 0) {
                        item.IsSelected(true);
                        hasFilters = true;
                    }
                });
            }
            if (!!qsParms.types && qsParms.types.length > 0) {
                ko.utils.arrayForEach(viewModel.SearchFilters.TypeFilters(), function(item) {
                    if (qsParms.types.indexOf(item.ID()) >= 0) {
                        item.IsSelected(true);
                        hasFilters = true;
                    }
                });
            }
            if (!!qsParms.dateoption && qsParms.dateoption.length > 0) {
                ko.utils.arrayForEach(viewModel.SearchFilters.DateRangeFilters(), function(item) {
                    if (qsParms.dateoption.indexOf(item.ID()) >= 0) {
                        item.IsSelected(true);
                        hasFilters = true;
                    }
                });
            }
            if (!!qsParms.topics && qsParms.topics.length > 0) {
                ko.utils.arrayForEach(viewModel.SearchFilters.TopicFilters(), function(item) {
                    if (qsParms.topics.indexOf(item.ID()) >= 0) {
                        item.IsSelected(true);
                        hasFilters = true;
                    }
                });
            }
            if (!!qsParms.tab && qsParms.tab.length > 0) {
                ko.utils.arrayForEach(viewModel.SearchFilters.TabFilters(), function(item) {
                    if (qsParms.tab.indexOf(item.ID()) >= 0) {
                        item.IsSelected(true);
                        hasFilters = true;
                    }
                });
            }
            if (!viewModel.ScrollPositionUpdate()) {
                viewModel.LoadDataFromServer();
                viewModel.HasSearchRun(hasFilters);
            }
        }
        // Reposition by scoll position
        var scrollPosition = 0;
        if (!!qsParms.scroll && qsParms.scroll.length > 0) {
            scrollPosition = parseInt(qsParms.scroll);
        }
        $("html, body").animate({
            scrollTop: scrollPosition
        }, "slow");
        return;
    }

    // Build query string based on filters
    viewModel.QueryString = function() {
        var queryString = "";
        if (viewModel.SearchFilters.KeywordFilter() != null && viewModel.SearchFilters.KeywordFilter().length > 0) {
            queryString += (queryString != "" ? "&" : "?");
            queryString += "keyword=" + encodeURIComponent(viewModel.SearchFilters.KeywordFilter());
        }
        var selectedItems = new Array();
        ko.utils.arrayForEach(viewModel.SearchFilters.PracticeFilters(), function(item) {
            if (item.IsSelected() == true && item.ID() != guidEmpty) {
                selectedItems.push(item.ID());
            }
        });
        if (selectedItems.length > 0) {
            queryString += (queryString != "" ? "&" : "?");
            queryString += "practices=" + selectedItems.join();
        }
        var selectedItems = new Array();
        ko.utils.arrayForEach(viewModel.SearchFilters.BlogFilters(), function(item) {
            if (item.IsSelected() == true && item.ID() != guidEmpty) {
                selectedItems.push(item.ID());
            }
        });
        if (selectedItems.length > 0) {
            queryString += (queryString != "" ? "&" : "?");
            queryString += "blogs=" + selectedItems.join();
        }
        selectedItems = new Array();
        ko.utils.arrayForEach(viewModel.SearchFilters.IndustryFilters(), function(item) {
            if (item.IsSelected() == true && item.ID() != guidEmpty) {
                selectedItems.push(item.ID());
            }
        });
        if (selectedItems.length > 0) {
            queryString += (queryString != "" ? "&" : "?");
            queryString += "industries=" + selectedItems.join();
        }
        selectedItems = new Array();
        ko.utils.arrayForEach(viewModel.SearchFilters.TypeFilters(), function(item) {
            if (item.IsSelected() == true && item.ID() != guidEmpty) {
                selectedItems.push(item.ID());
            }
        });
        if (selectedItems.length > 0) {
            queryString += (queryString != "" ? "&" : "?");
            queryString += "types=" + selectedItems.join();
        }
        selectedItems = new Array();
        ko.utils.arrayForEach(viewModel.SearchFilters.DateRangeFilters(), function(item) {
            if (item.IsSelected() == true && item.ID() != -1) {
                selectedItems.push(item.ID());
            }
        });
        if (selectedItems.length > 0) {
            queryString += (queryString != "" ? "&" : "?");
            queryString += "dateoption=" + selectedItems.join();
        }
        selectedItems = new Array();
        ko.utils.arrayForEach(viewModel.SearchFilters.TopicFilters(), function(item) {
            if (item.IsSelected() == true && item.ID() != guidEmpty) {
                selectedItems.push(item.ID());
            }
        });
        if (selectedItems.length > 0) {
            queryString += (queryString != "" ? "&" : "?");
            queryString += "topics=" + selectedItems.join();
        }
        selectedItems = new Array();
        ko.utils.arrayForEach(viewModel.SearchFilters.TabFilters(), function(item) {
            if (item.IsSelected() == true && item.ID() != guidEmpty) {
                selectedItems.push(item.ID());
            }
        });
        if (selectedItems.length > 0) {
            queryString += (queryString != "" ? "&" : "?");
            queryString += "tab=" + selectedItems.join();
        }
        if (viewModel.SearchFilters.Skip() > 0) {
            queryString += (queryString != "" ? "&" : "?");
            queryString += "skip=" + viewModel.SearchFilters.Skip();
        }
        queryString += (queryString != "" ? "&" : "?");
        queryString += "reload=" + viewModel.SearchFilters.ReloadFilters();
        queryString += (queryString != "" ? "&" : "?");
        queryString += "scroll=" + $(window).scrollTop();
        return queryString;
    };

    // Run search by pushing new state
    viewModel.Search = function() {
        //viewModel.HasMoreResults(false);
        viewModel.SearchFilters.Skip(0);
        var qs = viewModel.QueryString();
        viewModel.ScrollPositionUpdate(false);
        History.pushState({
            qs: qs
        }, History.options.initialTitle, qs);
    }

    // Load next page
    viewModel.LoadNextPage = function() {
        viewModel.SearchFilters.Skip(viewModel.GridData().length);
        var qs = viewModel.QueryString();
        viewModel.ScrollPositionUpdate(false);
        History.pushState({
            qs: qs
        }, History.options.initialTitle, qs);
    }

    viewModel.jumpToBlogs = function() {
        var headerOffset = $('.js-site-header').height()
        $('html, body').animate({
            scrollTop: $('#blogs-search-listing').offset().top - headerOffset
        }, 1500);
    }

    // Calculate position
    viewModel.CalculateQueryPosition = function() {
        var qs = viewModel.QueryString();
        viewModel.ScrollPositionUpdate(false);
        History.pushState({
            qs: qs
        }, History.options.initialTitle, qs);
        return true;
    }

    // Load data from server
    viewModel.LoadDataFromServer = function() {
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
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log(xhr);
                console.log("textStatus : " + textStatus);
                console.log("errorThrown : " + errorThrown);
            }
        });
    }

    // Animations for new lit items
    viewModel.animateGridInsert = function(elem) {
        if (elem.nodeType === 1) $(elem).hide().fadeIn(800)
    }
    viewModel.animateGridDelete = function(elem) {
        if (elem.nodeType === 1) $(elem).fadeOut(800, function() {
            $(elem).remove();
        })
    }

    // Clear page and reload filters
    viewModel.ClearPage = function() {
        viewModel.SearchFilters.ReloadFilters(true);
        viewModel.SearchFilters.ClearAllSearchFilters();
        viewModel.Search();
    }

    // Clear all filters and run search
    viewModel.SearchFilters.ClearSelectedFilters = function() {
        viewModel.SearchFilters.ClearAllSearchFilters();
        viewModel.SelectedFilters.removeAll();
        viewModel.Search();
    };

    // Clear all filters
    viewModel.SearchFilters.ClearAllSearchFilters = function(callBack) {
        viewModel.SearchFilters.KeywordFilter('');
        viewModel.SearchFilters.ClearAdvancedSearchFilters(callBack);
    };

    viewModel.SearchFilters.ClearAdvancedSearchFilters = function(callBack) {
        ko.utils.arrayForEach(viewModel.SearchFilters.PracticeFilters(), function(item) {
            item.IsSelected(false);
        });
        ko.utils.arrayForEach(viewModel.SearchFilters.BlogFilters(), function(item) {
            item.IsSelected(false);
        });
        ko.utils.arrayForEach(viewModel.SearchFilters.IndustryFilters(), function(item) {
            item.IsSelected(false);
        });
        ko.utils.arrayForEach(viewModel.SearchFilters.TypeFilters(), function(item) {
            item.IsSelected(false);
        });
        ko.utils.arrayForEach(viewModel.SearchFilters.DateRangeFilters(), function(item) {
            item.IsSelected(false);
        });
        ko.utils.arrayForEach(viewModel.SearchFilters.TopicFilters(), function(item) {
            item.IsSelected(false);
        });
        ko.utils.arrayForEach(viewModel.SearchFilters.TabFilters(), function(item) {
            item.IsSelected(false);
        });
        if (!!callBack && $.isFunction(callBack)) {
            callBack();
        }
    };

    viewModel.SetSelectAll = function() {
        viewModel.SearchFilters.ClearAdvancedSearchFilters();
        viewModel.IsSelectAll(true);
        viewModel.IsClearAll(false);
        viewModel.HasPendingUpdates(true);
    }

    viewModel.SetClearAll = function() {
        viewModel.SearchFilters.ClearAllSearchFilters();
        viewModel.IsSelectAll(false);
        viewModel.IsClearAll(true);
        viewModel.HasPendingUpdates(true);
    }

    // Clear Keyword Filter
    viewModel.SearchFilters.KeywordFilter.ClearFilter = function() {
        viewModel.SearchFilters.KeywordFilter('');
        viewModel.Search();
    };

    // Set selected filters
    viewModel.SetSelectedFilters = function() {
        viewModel.SelectedFilters.removeAll();
        if (viewModel.SearchFilters.KeywordFilter() != null && viewModel.SearchFilters.KeywordFilter().length > 0) {
            var newItem = {
                ID: ko.observable(keyWordIDKey),
                IsEnabled: ko.observable(true),
                IsSelected: ko.observable(true),
                Name: ko.observable(viewModel.SearchFilters.KeywordFilter()),
                Label: ko.observable(option.keyWordLabel),
                Url: ko.observable('#0')
            };
            newItem.ClearFilter = function() {
                viewModel.SearchFilters.KeywordFilter('');
                viewModel.Search();
            };
            viewModel.SelectedFilters.push(newItem);
        }
        ko.utils.arrayForEach(viewModel.SearchFilters.PracticeFilters(), function(item) {
            if (item.IsSelected() == true && item.ID() != guidEmpty) {
                viewModel.SelectedFilters.push(item);
            }
        });
        ko.utils.arrayForEach(viewModel.SearchFilters.BlogFilters(), function(item) {
            if (item.IsSelected() == true && item.ID() != guidEmpty) {
                viewModel.SelectedFilters.push(item);
            }
        });
        ko.utils.arrayForEach(viewModel.SearchFilters.IndustryFilters(), function(item) {
            if (item.IsSelected() == true && item.ID() != guidEmpty) {
                viewModel.SelectedFilters.push(item);
            }
        });
        ko.utils.arrayForEach(viewModel.SearchFilters.TypeFilters(), function(item) {
            if (item.IsSelected() == true && item.ID() != guidEmpty) {
                viewModel.SelectedFilters.push(item);
            }
        });
        ko.utils.arrayForEach(viewModel.SearchFilters.DateRangeFilters(), function(item) {
            if (item.IsSelected() == true && item.ID() != -1) {
                viewModel.SelectedFilters.push(item);
            }
        });
        ko.utils.arrayForEach(viewModel.SearchFilters.TopicFilters(), function(item) {
            if (item.IsSelected() == true && item.ID() != guidEmpty) {
                viewModel.SelectedFilters.push(item);
            }
        });
        $filtersTrigger.text($filtersTrigger.attr('data-expanded-label'))
    }

    viewModel.ToggleAdvancedSearch = function() {
        $('.insights-search_advanced_wrapper').toggleClass(activeClass);
    }

    viewModel.SelectedTab = function() {
        var selectItem = ko.utils.arrayFirst(viewModel.SearchFilters.TabFilters(), function(item) {
            return (item.IsSelected() == true);
        });
        return selectItem;
    }

    viewModel.ShowFeatured = function() {
        var selectItem = viewModel.SelectedTab();
        return !!selectItem && viewModel.SelectedFilters().length == 0 ? selectItem.Name() : false;
    }

    // Set filters that might have been included from a back button
    viewModel.SetSelectedFilters();

    // Apply Bindings
    ko.applyBindings(viewModel, pageContent.get(0));

    // Initialize Selected Item (this needs to be done for initial selection of dropdowns)
    var selectedItem = ko.utils.arrayFirst(viewModel.SearchFilters.PracticeFilters(), function(item) {
        return (item.IsSelected() == true);
    });
    if (selectedItem != null) {
        selectedItem.IsSelected(false);
        selectedItem.IsSelected(true);
    }
    var selectedItem = ko.utils.arrayFirst(viewModel.SearchFilters.BlogFilters(), function(item) {
        return (item.IsSelected() == true);
    });
    if (selectedItem != null) {
        selectedItem.IsSelected(false);
        selectedItem.IsSelected(true);
    }
    var selectedItem = ko.utils.arrayFirst(viewModel.SearchFilters.IndustryFilters(), function(item) {
        return (item.IsSelected() == true);
    });
    if (selectedItem != null) {
        selectedItem.IsSelected(false);
        selectedItem.IsSelected(true);
    }
    var selectedItem = ko.utils.arrayFirst(viewModel.SearchFilters.TypeFilters(), function(item) {
        return (item.IsSelected() == true);
    });
    if (selectedItem != null) {
        selectedItem.IsSelected(false);
        selectedItem.IsSelected(true);
    }
    var selectedItem = ko.utils.arrayFirst(viewModel.SearchFilters.DateRangeFilters(), function(item) {
        return (item.IsSelected() == true);
    });
    if (selectedItem != null) {
        selectedItem.IsSelected(false);
        selectedItem.IsSelected(true);
    }
    var selectedItem = ko.utils.arrayFirst(viewModel.SearchFilters.TopicFilters(), function(item) {
        return (item.IsSelected() == true);
    });
    if (selectedItem != null) {
        selectedItem.IsSelected(false);
        selectedItem.IsSelected(true);
    }
    var selectedItem = ko.utils.arrayFirst(viewModel.SearchFilters.TabFilters(), function(item) {
        return (item.IsSelected() == true);
    });
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
        }
    }
};