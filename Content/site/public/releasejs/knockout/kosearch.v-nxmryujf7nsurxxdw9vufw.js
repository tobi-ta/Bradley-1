var isArray = (function() {
    // Use compiler's own isArray when available
    if (Array.isArray) {
        return Array.isArray;
    }

    // Retain references to variables for performance
    // optimization
    var objectToStringFn = Object.prototype.toString,
        arrayToStringResult = objectToStringFn.call([]);

    return function(subject) {
        return objectToStringFn.call(subject) === arrayToStringResult;
    };
}());

function GetRequestObject(koObject) {
    var viewModelToUpdate = ko.mapping.toJS(koObject);
    for (var prop in viewModelToUpdate) {
        var parentProperty = viewModelToUpdate[prop];
        if (isArray(parentProperty)) {
            var arrayCopy = parentProperty.slice(0);
            parentProperty.length = 0;
            for (var i = 0; i < arrayCopy.length; i++) {
                if (typeof(arrayCopy[i].IsSelected) !== 'undefined') {
                    if (arrayCopy[i].IsSelected == true) {
                        parentProperty.push(arrayCopy[i]);
                    }
                } else {
                    parentProperty.push(arrayCopy[i]);
                }
            };
        } else {
            for (var childProp in parentProperty) {
                var childProperty = parentProperty[childProp];
                if (isArray(childProperty)) {
                    var arrayCopy = childProperty.slice(0);
                    childProperty.length = 0;
                    for (var i = 0; i < arrayCopy.length; i++) {
                        if (typeof(arrayCopy[i].IsSelected) !== 'undefined') {
                            if (arrayCopy[i].IsSelected == true) {
                                childProperty.push(arrayCopy[i]);
                            }
                        } else {
                            childProperty.push(arrayCopy[i]);
                        }
                    };
                }
            }
        }
    }
    return viewModelToUpdate;
}

ko.bindingHandlers.bindFilterList = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var acInput = $(element);
        var observable = valueAccessor();
        var allBindings = allBindingsAccessor();
        var searchFilters = bindingContext.$root.SearchFilters;
        var root = bindingContext.$root;

        observable.toggleSingleSelectFilter = function(data, event) {
            var selectedItem = this;
            event.preventDefault();
            event.stopPropagation();

            if (selectedItem.IsEnabled() == false) {
                if (selectedItem.IsSelected() == true) {
                    selectedItem.IsSelected(false);
                    if (!!allBindings && $.isFunction(allBindings.bindFilterListClearFunction)) {
                        allBindings.bindFilterListClearFunction(allBindings.bindFilterListSearchFunction);
                    } else {
                        if (!!allBindings && $.isFunction(allBindings.bindFilterListSearchFunction)) {
                            allBindings.bindFilterListSearchFunction();
                        }
                    }
                    if (!!allBindings && allBindings.bindFilterListDeleteOnSelect == true) {
                        observable.remove(selectedItem);
                    }
                }
                return;
            }
            if (selectedItem.IsSelected() == true) {
                selectedItem.IsSelected(false);
            } else {
                selectedItem.IsSelected(true);
                ko.utils.arrayForEach(observable(), function(item) {
                    if (item.IsSelected() == true && item.Name() != selectedItem.Name()) {
                        item.IsSelected(false);
                    }
                });
            }
            if ($.isFunction(selectedItem.ClearFilter)) {
                selectedItem.ClearFilter();
            } else {
                if (!!allBindings && $.isFunction(allBindings.bindFilterListClearFunction)) {
                    allBindings.bindFilterListClearFunction(allBindings.bindFilterListSearchFunction);
                } else {
                    if (!!allBindings && $.isFunction(allBindings.bindFilterListSearchFunction)) {
                        allBindings.bindFilterListSearchFunction();
                    }
                }
            }
            if (!!allBindings && allBindings.bindFilterListDeleteOnSelect == true) {
                observable.remove(selectedItem);
            }
            root.Search();
        };

        observable.toggleMultiSelectFilter = function(data, event) {
            var selectedItem = this;
            event.preventDefault();
            event.stopPropagation();

            if (root.hasOwnProperty('HasPendingUpdates') && ko.isObservable(root['HasPendingUpdates'])) {
                root.HasPendingUpdates(true);
            }

            if (selectedItem.IsEnabled() == false) {
                if (selectedItem.IsSelected() == true) {
                    selectedItem.IsSelected(false);
                    if (!!allBindings && $.isFunction(allBindings.bindFilterListClearFunction)) {
                        allBindings.bindFilterListClearFunction(allBindings.bindFilterListSearchFunction);
                    } else {
                        if (!!allBindings && $.isFunction(allBindings.bindFilterListSearchFunction)) {
                            allBindings.bindFilterListSearchFunction();
                        }
                    }
                }
                return;
            }
            if (selectedItem.IsSelected() == true) {
                selectedItem.IsSelected(false);
            } else {
                if (root.hasOwnProperty('IsSelectAll') && ko.isObservable(root['IsSelectAll'])) {
                    root.IsSelectAll(false);
                }
                if (root.hasOwnProperty('IsClearAll') && ko.isObservable(root['IsClearAll'])) {
                    root.IsClearAll(false);
                }
                selectedItem.IsSelected(true);
            }
            if ($.isFunction(selectedItem.ClearFilter)) {
                selectedItem.ClearFilter();
            } else {
                if (!!allBindings && $.isFunction(allBindings.bindFilterListClearFunction)) {
                    allBindings.bindFilterListClearFunction(allBindings.bindFilterListSearchFunction);
                } else {
                    if (!!allBindings && $.isFunction(allBindings.bindFilterListSearchFunction)) {
                        allBindings.bindFilterListSearchFunction();
                    }
                }
            }
            root.Search();
            event.target.value = event.target.children[0].value;
        };

        observable.toggleDateRangeFilter = function(data, event) {
            var selectedItem = this;
            event.preventDefault();
            event.stopPropagation();

            if (selectedItem.IsEnabled() == false) {
                return;
            }
            if (ko.isObservable(searchFilters.DateRangeFrom) && ko.isObservable(searchFilters.DateRangeTo)) {
                selectedItem.IsSelected((!!searchFilters.DateRangeFrom() && searchFilters.DateRangeFrom() != '') || (!!searchFilters.DateRangeTo() && searchFilters.DateRangeTo() != ''));
                if (viewModel.AllowMultiSelect() == false) {
                    ko.utils.arrayForEach(observable(), function(item) {
                        if (item.ID != selectedItem.ID) {
                            item.IsSelected(false);
                        }
                    });
                }
            }
        };

        observable.toggleAlwaysOnFilter = function(data, event) {
            var selectedItem = this;
            event.preventDefault();
            event.stopPropagation();

            if (selectedItem.IsSelected() == true || selectedItem.IsEnabled() == false)
                return;

            selectedItem.IsSelected(true);
            ko.utils.arrayForEach(observable(), function(item) {
                if (item.IsSelected() == true && item.Name() != selectedItem.Name()) {
                    item.IsSelected(false);
                }
            });
            root.Search();
        };

        observable.ClearAllFilters = function(data, event) {
            ko.utils.arrayForEach(observable(), function(item) {
                item.IsEnabled(true);
                item.IsSelected(false);
            });
            if (!!allBindings && $.isFunction(allBindings.bindFilterListSearchFunction)) {
                allBindings.bindFilterListSearchFunction();
            }
        };
    }
}

ko.bindingHandlers.executeOnEnter = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var allBindings = allBindingsAccessor();
        $(element).keypress(function(event) {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode === 13) {
                allBindings.executeOnEnter.call(viewModel);
                return false;
            }
            return true;
        });
    }
};

ko.bindingHandlers.clearFilterClick = {
    update: function(element, valueAccessor, allBindings, DONOTUSE, bindingContext) {
        var filter = bindingContext.$data
        var search = ko.utils.unwrapObservable(valueAccessor())
        var viewModel = bindingContext.$root
        $(element).click(function(e) {
            e.preventDefault()
            e.stopPropagation()
            var isClearFilter = allBindings.get('isClearFilter');
            //Special logic for clearing all filters
            if (!!isClearFilter) {
                for (var i = 0; i < viewModel.SelectedFilters().length; i++) {
                    var thisFilter = viewModel.SelectedFilters()[i];
                    thisFilter.IsSelected(false)
                    if (thisFilter.hasOwnProperty('ClearFilter')) {
                        thisFilter.ClearFilter()
                    }
                }
                viewModel.SelectedFilters.removeAll()
            } else {
                filter.IsSelected(false)
                viewModel.SelectedFilters.remove(filter)
                if (filter.hasOwnProperty('ClearFilter')) {
                    filter.ClearFilter()
                }
            }
            search.call(viewModel)
            return false
        })
    }
};

//ko.bindingHandlers.onSelectChanged = {
//    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
//        var options = valueAccessor();
//        var allBindings = allBindingsAccessor();
//        var observable = options.observable;
//        var observableEvent = options.event;
//        var featuredobservable = options.featuredobservable;
//        var featuredcontainer = options.featuredcontainer;
//
//        $(element).change(function (event) {
//            var $this = $(this);
//            if (!!$this.val()) {
//
//                var featuredItem;
//                if ($.isFunction(featuredobservable)) {
//                    featuredItem = ko.utils.arrayFilter(featuredobservable(), function (item) {
//                        return (item.ID().toLowerCase().indexOf($this.val().toLowerCase()) == 0);
//                    });
//                }
//                if (typeof featuredItem != "undefined" && featuredItem.length > 0) {
//                    $(featuredcontainer).find("button[data-serviceid='" + $this.val() + "']").click()
//                }
//                else {
//                    var selectItem = ko.utils.arrayFilter(observable(), function (item) {
//                        return (item.ID().toLowerCase().indexOf($this.val().toLowerCase()) == 0);
//                    });
//                    if (selectItem.length > 0) {
//                        if (observableEvent != null && $.isFunction(observableEvent)) {
//                            observableEvent.call(selectItem[0], observable, event);
//                        }
//                    }
//                }
//            }
//            return false;
//        });
//    }
//};

ko.bindingHandlers.selectedText = {
    init: function(element, valueAccessor) {
        var value = valueAccessor();
        value($("option:selected", element).text());

        $(element).change(function() {
            value($("option:selected", this).text());
        });
    }
};

ko.bindingHandlers.onFilterClick = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var options = valueAccessor();
        var allBindings = allBindingsAccessor();
        var observable = options.observable;
        var observableEvent = options.event;
        var attr = options.attr;
        var root = bindingContext.$root;
        var filters = options.observables;

        $(element).click(function(event) {
            var $this = $(this);
            var attrVal = $this.attr(attr);
            if (!!attrVal) {

                //set isselected on featured filter
                var featuredItem = ko.utils.arrayFilter(observable(), function(item) {
                    return (item.ID().toLowerCase().indexOf(attrVal.toLowerCase()) == 0);
                });

                if (featuredItem[0].IsSelected() == false || root.SelectedFilters().length > 1) {
                    if ($.isFunction(root.SearchFilters.ClearSelectedFilters)) {
                        root.SearchFilters.ClearAllSearchFilters();
                    }
                    if ($.isFunction(root.SelectedFilters.removeAll)) {
                        root.SelectedFilters.removeAll();
                    }
                    featuredItem[0].IsSelected(true);

                    //find item in other observables
                    $.each(filters, function(index, value) {
                        var foundItem = ko.utils.arrayFilter(value(), function(item) {
                            return (item.ID().toLowerCase().indexOf(attrVal.toLowerCase()) == 0);
                        });
                        if (foundItem.length > 0) {
                            foundItem[0].IsSelected(true);
                            return false;
                        }
                    });

                    if ($.isFunction(root.Search)) {
                        root.Search();
                    }
                }

            }
            return false;
        });

    }
};

ko.bindingHandlers.onTypeAheadKeyUp = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var options = valueAccessor();
        var allBindings = allBindingsAccessor();
        var observable = options.observable;
        var observableEvent = options.event;
        var typeaheadContainer = options.typeaheadContainer;

        $(element).keyup(function(event) {
            var $this = $(this);
            var val = $this.val();

            if (!!val && val.length >= 3) {
                observable(val);
                observableEvent();
            }

            if (!!val && val.length < 3) {
                $(typeaheadContainer).html('');
            }
            return false;
        });

    }
};

ko.bindingHandlers.onTypeAheadClick = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var options = valueAccessor();
        var allBindings = allBindingsAccessor();
        var typeAheadObservable = options.typeAheadObservable;
        var observable = options.observable;
        var attr = options.attr;
        var root = bindingContext.$root;
        var typeaheadContainer = options.typeaheadContainer;
        var filterContainer = options.filterContainer;
        var input = options.input;

        $(element).click(function(event) {

            $(input).val('');
            if (!!filterContainer && $.isFunction(filterContainer.close)) {
                filterContainer.close();
            }
            var $this = $(this);
            var attrVal = $this.attr(attr);
            if (!!attrVal) {
                var selectItem = ko.utils.arrayFilter(typeAheadObservable(), function(item) {
                    return (item.ID().toLowerCase().indexOf(attrVal.toLowerCase()) == 0);
                });
                if (selectItem.length > 0) {
                    selectItem[0].IsSelected(true);

                    observable.push(selectItem[0]);

                    typeAheadObservable.removeAll();

                    if ($.isFunction(root.Search)) {
                        root.Search();
                    }
                }
            }
            return false;
        });
    }
};