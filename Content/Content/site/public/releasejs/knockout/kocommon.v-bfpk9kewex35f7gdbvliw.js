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

ko.bindingHandlers.onSelectChanged = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var options = valueAccessor();
        var allBindings = allBindingsAccessor();
        var observable = options.observable;
        var observableEvent = options.event;

        $(element).change(function(event) {
            var $this = $(this);
            if (!!$this.val()) {

                var selectItem = ko.utils.arrayFirst(observable(), function(item) {
                    var itemID = item.ID().toString();
                    return (itemID.toLowerCase().indexOf($this.val().toLowerCase()) == 0);
                });
                if (selectItem != null) {
                    if (observableEvent != null && $.isFunction(observableEvent)) {
                        observableEvent.call(selectItem, observable, event);
                    }
                }
            }
            return false;
        });
    }
};

ko.bindingHandlers.selectedText = {
    init: function(element, valueAccessor) {
        var value = valueAccessor();
        value($("option:selected", element).text());

        $(element).change(function() {
            value($("option:selected", this).text());
        });
    }
};