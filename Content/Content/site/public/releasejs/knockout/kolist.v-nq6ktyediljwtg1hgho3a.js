ko.bindingHandlers.bindRelatedList = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var acInput = $(element);
        var observable = valueAccessor();
        var allBindings = allBindingsAccessor();

        var serviceUrl = allBindings.bindRelatedListServiceUrl;

        observable.IsSearchRunning = ko.observable(false);

        observable.LoadNextPage = function() {
            observable.SearchFilters.Skip(observable.GridData().length);
            observable.LoadDataFromServer();
        }

        observable.LoadDataFromServer = function() {
            observable.IsSearchRunning(true);
            $.ajax({
                url: serviceUrl,
                type: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: ko.mapping.toJSON(observable.SearchFilters),
                cache: false,
                success: function(data) {
                    var results = ko.observableArray();
                    ko.mapping.fromJS(data.GridData, {}, results);
                    ko.utils.arrayForEach(results(), function(item) {
                        observable.GridData.push(item);
                    });

                    observable.ResultCount(data.ResultCount);
                    observable.HasMoreResults(data.HasMoreResults);

                    observable.IsSearchRunning(false);

                },
                error: function(xhr, textStatus, errorThrown) {
                    console.log(xhr.responseText);
                }
            });
        }
        observable.animateGridInsert = function(elem) {
            if (elem.nodeType === 1) $(elem).hide().fadeIn(800)
        }
        observable.animateGridDelete = function(elem) {
            if (elem.nodeType === 1) $(elem).fadeOut(800, function() {
                $(elem).remove();
            })
        }
    }
}