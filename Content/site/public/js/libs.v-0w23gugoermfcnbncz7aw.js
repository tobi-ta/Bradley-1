! function e(t, n, r) {
    function i(a, s) {
        if (!n[a]) {
            if (!t[a]) {
                var u = "function" == typeof require && require;
                if (!s && u) return u(a, !0);
                if (o) return o(a, !0);
                var c = new Error("Cannot find module '" + a + "'");
                throw c.code = "MODULE_NOT_FOUND", c
            }
            var l = n[a] = {
                exports: {}
            };
            t[a][0].call(l.exports, function(e) {
                var n = t[a][1][e];
                return i(n ? n : e)
            }, l, l.exports, e, t, n, r)
        }
        return n[a].exports
    }
    for (var o = "function" == typeof require && require, a = 0; a < r.length; a++) i(r[a]);
    return i
}({
    1: [function(e, t, n) {
        ! function(t) {
            "use strict";
            "function" == typeof define && define.amd ? define(["jquery"], t) : t("object" == typeof n && "function" == typeof e ? e("jquery") : jQuery)
        }(function(e) {
            "use strict";

            function t(n, r) {
                var i = this;
                i.element = n, i.el = e(n), i.suggestions = [], i.badQueries = [], i.selectedIndex = -1, i.currentValue = i.element.value, i.timeoutId = null, i.cachedResponse = {}, i.onChangeTimeout = null, i.onChange = null, i.isLocal = !1, i.suggestionsContainer = null, i.noSuggestionsContainer = null, i.options = e.extend(!0, {}, t.defaults, r), i.classes = {
                    selected: "autocomplete-selected",
                    suggestion: "autocomplete-suggestion"
                }, i.hint = null, i.hintValue = "", i.selection = null, i.initialize(), i.setOptions(r)
            }

            function n(e, t, n) {
                return e.value.toLowerCase().indexOf(n) !== -1
            }

            function r(t) {
                return "string" == typeof t ? e.parseJSON(t) : t
            }

            function i(e, t) {
                if (!t) return e.value;
                var n = "(" + a.escapeRegExChars(t) + ")";
                return e.value.replace(new RegExp(n, "gi"), "<strong>$1</strong>").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/&lt;(\/?strong)&gt;/g, "<$1>")
            }

            function o(e, t) {
                return '<div class="autocomplete-group">' + t + "</div>"
            }
            var a = function() {
                    return {
                        escapeRegExChars: function(e) {
                            return e.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&")
                        },
                        createNode: function(e) {
                            var t = document.createElement("div");
                            return t.className = e, t.style.position = "absolute", t.style.display = "none", t
                        }
                    }
                }(),
                s = {
                    ESC: 27,
                    TAB: 9,
                    RETURN: 13,
                    LEFT: 37,
                    UP: 38,
                    RIGHT: 39,
                    DOWN: 40
                },
                u = e.noop;
            t.utils = a, e.Autocomplete = t, t.defaults = {
                ajaxSettings: {},
                autoSelectFirst: !1,
                appendTo: "body",
                serviceUrl: null,
                lookup: null,
                onSelect: null,
                width: "auto",
                minChars: 1,
                maxHeight: 300,
                deferRequestBy: 0,
                params: {},
                formatResult: i,
                formatGroup: o,
                delimiter: null,
                zIndex: 9999,
                type: "GET",
                noCache: !1,
                onSearchStart: u,
                onSearchComplete: u,
                onSearchError: u,
                preserveInput: !1,
                containerClass: "autocomplete-suggestions",
                tabDisabled: !1,
                dataType: "text",
                currentRequest: null,
                triggerSelectOnValidInput: !0,
                preventBadQueries: !0,
                lookupFilter: n,
                paramName: "query",
                transformResult: r,
                showNoSuggestionNotice: !1,
                noSuggestionNotice: "No results",
                orientation: "bottom",
                forceFixPosition: !1
            }, t.prototype = {
                initialize: function() {
                    var n, r = this,
                        i = "." + r.classes.suggestion,
                        o = r.classes.selected,
                        a = r.options;
                    r.element.setAttribute("autocomplete", "off"), r.noSuggestionsContainer = e('<div class="autocomplete-no-suggestion"></div>').html(this.options.noSuggestionNotice).get(0), r.suggestionsContainer = t.utils.createNode(a.containerClass), n = e(r.suggestionsContainer), n.appendTo(a.appendTo || "body"), "auto" !== a.width && n.css("width", a.width), n.on("mouseover.autocomplete", i, function() {
                        r.activate(e(this).data("index"))
                    }), n.on("mouseout.autocomplete", function() {
                        r.selectedIndex = -1, n.children("." + o).removeClass(o)
                    }), n.on("click.autocomplete", i, function() {
                        r.select(e(this).data("index"))
                    }), n.on("click.autocomplete", function() {
                        clearTimeout(r.blurTimeoutId)
                    }), r.fixPositionCapture = function() {
                        r.visible && r.fixPosition()
                    }, e(window).on("resize.autocomplete", r.fixPositionCapture), r.el.on("keydown.autocomplete", function(e) {
                        r.onKeyPress(e)
                    }), r.el.on("keyup.autocomplete", function(e) {
                        r.onKeyUp(e)
                    }), r.el.on("blur.autocomplete", function() {
                        r.onBlur()
                    }), r.el.on("focus.autocomplete", function() {
                        r.onFocus()
                    }), r.el.on("change.autocomplete", function(e) {
                        r.onKeyUp(e)
                    }), r.el.on("input.autocomplete", function(e) {
                        r.onKeyUp(e)
                    })
                },
                onFocus: function() {
                    var e = this;
                    e.disabled || (e.fixPosition(), e.el.val().length >= e.options.minChars && e.onValueChange())
                },
                onBlur: function() {
                    var t = this,
                        n = t.options,
                        r = t.el.val(),
                        i = t.getQuery(r);
                    t.blurTimeoutId = setTimeout(function() {
                        t.hide(), t.selection && t.currentValue !== i && (n.onInvalidateSelection || e.noop).call(t.element)
                    }, 200)
                },
                abortAjax: function() {
                    var e = this;
                    e.currentRequest && (e.currentRequest.abort(), e.currentRequest = null)
                },
                setOptions: function(t) {
                    var n = this,
                        r = e.extend({}, n.options, t);
                    n.isLocal = Array.isArray(r.lookup), n.isLocal && (r.lookup = n.verifySuggestionsFormat(r.lookup)), r.orientation = n.validateOrientation(r.orientation, "bottom"), e(n.suggestionsContainer).css({
                        "max-height": r.maxHeight + "px",
                        width: r.width + "px",
                        "z-index": r.zIndex
                    }), this.options = r
                },
                clearCache: function() {
                    this.cachedResponse = {}, this.badQueries = []
                },
                clear: function() {
                    this.clearCache(), this.currentValue = "", this.suggestions = []
                },
                disable: function() {
                    var e = this;
                    e.disabled = !0, clearTimeout(e.onChangeTimeout), e.abortAjax()
                },
                enable: function() {
                    this.disabled = !1
                },
                fixPosition: function() {
                    var t = this,
                        n = e(t.suggestionsContainer),
                        r = n.parent().get(0);
                    if (r === document.body || t.options.forceFixPosition) {
                        var i = t.options.orientation,
                            o = n.outerHeight(),
                            a = t.el.outerHeight(),
                            s = t.el.offset(),
                            u = {
                                top: s.top,
                                left: s.left
                            };
                        if ("auto" === i) {
                            var c = e(window).height(),
                                l = e(window).scrollTop(),
                                f = -l + s.top - o,
                                d = l + c - (s.top + a + o);
                            i = Math.max(f, d) === f ? "top" : "bottom"
                        }
                        if ("top" === i ? u.top += -o : u.top += a, r !== document.body) {
                            var p, h = n.css("opacity");
                            t.visible || n.css("opacity", 0).show(), p = n.offsetParent().offset(), u.top -= p.top, u.top += r.scrollTop, u.left -= p.left, t.visible || n.css("opacity", h).hide()
                        }
                        "auto" === t.options.width && (u.width = t.el.outerWidth() + "px"), n.css(u)
                    }
                },
                isCursorAtEnd: function() {
                    var e, t = this,
                        n = t.el.val().length,
                        r = t.element.selectionStart;
                    return "number" == typeof r ? r === n : !document.selection || (e = document.selection.createRange(), e.moveStart("character", -n), n === e.text.length)
                },
                onKeyPress: function(e) {
                    var t = this;
                    if (!t.disabled && !t.visible && e.which === s.DOWN && t.currentValue) return void t.suggest();
                    if (!t.disabled && t.visible) {
                        switch (e.which) {
                            case s.ESC:
                                t.el.val(t.currentValue), t.hide();
                                break;
                            case s.RIGHT:
                                if (t.hint && t.options.onHint && t.isCursorAtEnd()) {
                                    t.selectHint();
                                    break
                                }
                                return;
                            case s.TAB:
                                if (t.hint && t.options.onHint) return void t.selectHint();
                                if (t.selectedIndex === -1) return void t.hide();
                                if (t.select(t.selectedIndex), t.options.tabDisabled === !1) return;
                                break;
                            case s.RETURN:
                                if (t.selectedIndex === -1) return void t.hide();
                                t.select(t.selectedIndex);
                                break;
                            case s.UP:
                                t.moveUp();
                                break;
                            case s.DOWN:
                                t.moveDown();
                                break;
                            default:
                                return
                        }
                        e.stopImmediatePropagation(), e.preventDefault()
                    }
                },
                onKeyUp: function(e) {
                    var t = this;
                    if (!t.disabled) {
                        switch (e.which) {
                            case s.UP:
                            case s.DOWN:
                                return
                        }
                        clearTimeout(t.onChangeTimeout), t.currentValue !== t.el.val() && (t.findBestHint(), t.options.deferRequestBy > 0 ? t.onChangeTimeout = setTimeout(function() {
                            t.onValueChange()
                        }, t.options.deferRequestBy) : t.onValueChange())
                    }
                },
                onValueChange: function() {
                    if (this.ignoreValueChange) return void(this.ignoreValueChange = !1);
                    var t = this,
                        n = t.options,
                        r = t.el.val(),
                        i = t.getQuery(r);
                    return t.selection && t.currentValue !== i && (t.selection = null, (n.onInvalidateSelection || e.noop).call(t.element)), clearTimeout(t.onChangeTimeout), t.currentValue = r, t.selectedIndex = -1, n.triggerSelectOnValidInput && t.isExactMatch(i) ? void t.select(0) : void(i.length < n.minChars ? t.hide() : t.getSuggestions(i))
                },
                isExactMatch: function(e) {
                    var t = this.suggestions;
                    return 1 === t.length && t[0].value.toLowerCase() === e.toLowerCase()
                },
                getQuery: function(t) {
                    var n, r = this.options.delimiter;
                    return r ? (n = t.split(r), e.trim(n[n.length - 1])) : t
                },
                getSuggestionsLocal: function(t) {
                    var n, r = this,
                        i = r.options,
                        o = t.toLowerCase(),
                        a = i.lookupFilter,
                        s = parseInt(i.lookupLimit, 10);
                    return n = {
                        suggestions: e.grep(i.lookup, function(e) {
                            return a(e, t, o)
                        })
                    }, s && n.suggestions.length > s && (n.suggestions = n.suggestions.slice(0, s)), n
                },
                getSuggestions: function(t) {
                    var n, r, i, o, a = this,
                        s = a.options,
                        u = s.serviceUrl;
                    if (s.params[s.paramName] = t, s.onSearchStart.call(a.element, s.params) !== !1) {
                        if (r = s.ignoreParams ? null : s.params, e.isFunction(s.lookup)) return void s.lookup(t, function(e) {
                            a.suggestions = e.suggestions, a.suggest(), s.onSearchComplete.call(a.element, t, e.suggestions)
                        });
                        a.isLocal ? n = a.getSuggestionsLocal(t) : (e.isFunction(u) && (u = u.call(a.element, t)), i = u + "?" + e.param(r || {}), n = a.cachedResponse[i]), n && Array.isArray(n.suggestions) ? (a.suggestions = n.suggestions, a.suggest(), s.onSearchComplete.call(a.element, t, n.suggestions)) : a.isBadQuery(t) ? s.onSearchComplete.call(a.element, t, []) : (a.abortAjax(), o = {
                            url: u,
                            data: r,
                            type: s.type,
                            dataType: s.dataType
                        }, e.extend(o, s.ajaxSettings), a.currentRequest = e.ajax(o).done(function(e) {
                            var n;
                            a.currentRequest = null, n = s.transformResult(e, t), a.processResponse(n, t, i), s.onSearchComplete.call(a.element, t, n.suggestions)
                        }).fail(function(e, n, r) {
                            s.onSearchError.call(a.element, t, e, n, r)
                        }))
                    }
                },
                isBadQuery: function(e) {
                    if (!this.options.preventBadQueries) return !1;
                    for (var t = this.badQueries, n = t.length; n--;)
                        if (0 === e.indexOf(t[n])) return !0;
                    return !1
                },
                hide: function() {
                    var t = this,
                        n = e(t.suggestionsContainer);
                    e.isFunction(t.options.onHide) && t.visible && t.options.onHide.call(t.element, n), t.visible = !1, t.selectedIndex = -1, clearTimeout(t.onChangeTimeout), e(t.suggestionsContainer).hide(), t.signalHint(null)
                },
                suggest: function() {
                    if (!this.suggestions.length) return void(this.options.showNoSuggestionNotice ? this.noSuggestions() : this.hide());
                    var t, n = this,
                        r = n.options,
                        i = r.groupBy,
                        o = r.formatResult,
                        a = n.getQuery(n.currentValue),
                        s = n.classes.suggestion,
                        u = n.classes.selected,
                        c = e(n.suggestionsContainer),
                        l = e(n.noSuggestionsContainer),
                        f = r.beforeRender,
                        d = "",
                        p = function(e, n) {
                            var o = e.data[i];
                            return t === o ? "" : (t = o, r.formatGroup(e, t))
                        };
                    return r.triggerSelectOnValidInput && n.isExactMatch(a) ? void n.select(0) : (e.each(n.suggestions, function(e, t) {
                        i && (d += p(t, a, e)), d += '<div class="' + s + '" data-index="' + e + '">' + o(t, a, e) + "</div>"
                    }), this.adjustContainerWidth(), l.detach(), c.html(d), e.isFunction(f) && f.call(n.element, c, n.suggestions), n.fixPosition(), c.show(), r.autoSelectFirst && (n.selectedIndex = 0, c.scrollTop(0), c.children("." + s).first().addClass(u)), n.visible = !0, void n.findBestHint())
                },
                noSuggestions: function() {
                    var t = this,
                        n = t.options.beforeRender,
                        r = e(t.suggestionsContainer),
                        i = e(t.noSuggestionsContainer);
                    this.adjustContainerWidth(), i.detach(), r.empty(), r.append(i), e.isFunction(n) && n.call(t.element, r, t.suggestions), t.fixPosition(), r.show(), t.visible = !0
                },
                adjustContainerWidth: function() {
                    var t, n = this,
                        r = n.options,
                        i = e(n.suggestionsContainer);
                    "auto" === r.width ? (t = n.el.outerWidth(), i.css("width", t > 0 ? t : 300)) : "flex" === r.width && i.css("width", "")
                },
                findBestHint: function() {
                    var t = this,
                        n = t.el.val().toLowerCase(),
                        r = null;
                    n && (e.each(t.suggestions, function(e, t) {
                        var i = 0 === t.value.toLowerCase().indexOf(n);
                        return i && (r = t), !i
                    }), t.signalHint(r))
                },
                signalHint: function(t) {
                    var n = "",
                        r = this;
                    t && (n = r.currentValue + t.value.substr(r.currentValue.length)), r.hintValue !== n && (r.hintValue = n, r.hint = t, (this.options.onHint || e.noop)(n))
                },
                verifySuggestionsFormat: function(t) {
                    return t.length && "string" == typeof t[0] ? e.map(t, function(e) {
                        return {
                            value: e,
                            data: null
                        }
                    }) : t
                },
                validateOrientation: function(t, n) {
                    return t = e.trim(t || "").toLowerCase(), e.inArray(t, ["auto", "bottom", "top"]) === -1 && (t = n), t
                },
                processResponse: function(e, t, n) {
                    var r = this,
                        i = r.options;
                    e.suggestions = r.verifySuggestionsFormat(e.suggestions), i.noCache || (r.cachedResponse[n] = e, i.preventBadQueries && !e.suggestions.length && r.badQueries.push(t)), t === r.getQuery(r.currentValue) && (r.suggestions = e.suggestions, r.suggest())
                },
                activate: function(t) {
                    var n, r = this,
                        i = r.classes.selected,
                        o = e(r.suggestionsContainer),
                        a = o.find("." + r.classes.suggestion);
                    return o.find("." + i).removeClass(i), r.selectedIndex = t, r.selectedIndex !== -1 && a.length > r.selectedIndex ? (n = a.get(r.selectedIndex), e(n).addClass(i), n) : null
                },
                selectHint: function() {
                    var t = this,
                        n = e.inArray(t.hint, t.suggestions);
                    t.select(n)
                },
                select: function(e) {
                    var t = this;
                    t.hide(), t.onSelect(e)
                },
                moveUp: function() {
                    var t = this;
                    if (t.selectedIndex !== -1) return 0 === t.selectedIndex ? (e(t.suggestionsContainer).children("." + t.classes.suggestion).first().removeClass(t.classes.selected), t.selectedIndex = -1, t.ignoreValueChange = !1, t.el.val(t.currentValue), void t.findBestHint()) : void t.adjustScroll(t.selectedIndex - 1)
                },
                moveDown: function() {
                    var e = this;
                    e.selectedIndex !== e.suggestions.length - 1 && e.adjustScroll(e.selectedIndex + 1)
                },
                adjustScroll: function(t) {
                    var n = this,
                        r = n.activate(t);
                    if (r) {
                        var i, o, a, s = e(r).outerHeight();
                        i = r.offsetTop, o = e(n.suggestionsContainer).scrollTop(), a = o + n.options.maxHeight - s, i < o ? e(n.suggestionsContainer).scrollTop(i) : i > a && e(n.suggestionsContainer).scrollTop(i - n.options.maxHeight + s), n.options.preserveInput || (n.ignoreValueChange = !0, n.el.val(n.getValue(n.suggestions[t].value))), n.signalHint(null)
                    }
                },
                onSelect: function(t) {
                    var n = this,
                        r = n.options.onSelect,
                        i = n.suggestions[t];
                    n.currentValue = n.getValue(i.value), n.currentValue === n.el.val() || n.options.preserveInput || n.el.val(n.currentValue), n.signalHint(null), n.suggestions = [], n.selection = i, e.isFunction(r) && r.call(n.element, i)
                },
                getValue: function(e) {
                    var t, n, r = this,
                        i = r.options.delimiter;
                    return i ? (t = r.currentValue, n = t.split(i), 1 === n.length ? e : t.substr(0, t.length - n[n.length - 1].length) + e) : e
                },
                dispose: function() {
                    var t = this;
                    t.el.off(".autocomplete").removeData("autocomplete"), e(window).off("resize.autocomplete", t.fixPositionCapture), e(t.suggestionsContainer).remove()
                }
            }, e.fn.devbridgeAutocomplete = function(n, r) {
                var i = "autocomplete";
                return arguments.length ? this.each(function() {
                    var o = e(this),
                        a = o.data(i);
                    "string" == typeof n ? a && "function" == typeof a[n] && a[n](r) : (a && a.dispose && a.dispose(), a = new t(this, n), o.data(i, a))
                }) : this.first().data(i)
            }, e.fn.autocomplete || (e.fn.autocomplete = e.fn.devbridgeAutocomplete)
        })
    }, {
        jquery: 3
    }],
    2: [function(e, t, n) {
        ! function(e, n, r, i) {
            "use strict";

            function o(e, t, n) {
                return setTimeout(l(e, n), t)
            }

            function a(e, t, n) {
                return !!Array.isArray(e) && (s(e, n[t], n), !0)
            }

            function s(e, t, n) {
                var r;
                if (e)
                    if (e.forEach) e.forEach(t, n);
                    else if (e.length !== i)
                    for (r = 0; r < e.length;) t.call(n, e[r], r, e), r++;
                else
                    for (r in e) e.hasOwnProperty(r) && t.call(n, e[r], r, e)
            }

            function u(t, n, r) {
                var i = "DEPRECATED METHOD: " + n + "\n" + r + " AT \n";
                return function() {
                    var n = new Error("get-stack-trace"),
                        r = n && n.stack ? n.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@") : "Unknown Stack Trace",
                        o = e.console && (e.console.warn || e.console.log);
                    return o && o.call(e.console, i, r), t.apply(this, arguments)
                }
            }

            function c(e, t, n) {
                var r, i = t.prototype;
                r = e.prototype = Object.create(i), r.constructor = e, r._super = i, n && de(r, n)
            }

            function l(e, t) {
                return function() {
                    return e.apply(t, arguments)
                }
            }

            function f(e, t) {
                return typeof e == ge ? e.apply(t ? t[0] || i : i, t) : e
            }

            function d(e, t) {
                return e === i ? t : e
            }

            function p(e, t, n) {
                s(m(t), function(t) {
                    e.addEventListener(t, n, !1)
                })
            }

            function h(e, t, n) {
                s(m(t), function(t) {
                    e.removeEventListener(t, n, !1)
                })
            }

            function g(e, t) {
                for (; e;) {
                    if (e == t) return !0;
                    e = e.parentNode
                }
                return !1
            }

            function v(e, t) {
                return e.indexOf(t) > -1
            }

            function m(e) {
                return e.trim().split(/\s+/g)
            }

            function y(e, t, n) {
                if (e.indexOf && !n) return e.indexOf(t);
                for (var r = 0; r < e.length;) {
                    if (n && e[r][n] == t || !n && e[r] === t) return r;
                    r++
                }
                return -1
            }

            function b(e) {
                return Array.prototype.slice.call(e, 0)
            }

            function x(e, t, n) {
                for (var r = [], i = [], o = 0; o < e.length;) {
                    var a = t ? e[o][t] : e[o];
                    y(i, a) < 0 && r.push(e[o]), i[o] = a, o++
                }
                return n && (r = t ? r.sort(function(e, n) {
                    return e[t] > n[t]
                }) : r.sort()), r
            }

            function w(e, t) {
                for (var n, r, o = t[0].toUpperCase() + t.slice(1), a = 0; a < pe.length;) {
                    if (n = pe[a], r = n ? n + o : t, r in e) return r;
                    a++
                }
                return i
            }

            function T() {
                return we++
            }

            function S(t) {
                var n = t.ownerDocument || t;
                return n.defaultView || n.parentWindow || e
            }

            function C(e, t) {
                var n = this;
                this.manager = e, this.callback = t, this.element = e.element, this.target = e.options.inputTarget, this.domHandler = function(t) {
                    f(e.options.enable, [e]) && n.handler(t)
                }, this.init()
            }

            function E(e) {
                var t, n = e.options.inputClass;
                return new(t = n ? n : Ce ? B : Ee ? $ : Se ? W : q)(e, k)
            }

            function k(e, t, n) {
                var r = n.pointers.length,
                    i = n.changedPointers.length,
                    o = t & Oe && r - i === 0,
                    a = t & (He | Le) && r - i === 0;
                n.isFirst = !!o, n.isFinal = !!a, o && (e.session = {}), n.eventType = t, N(e, n), e.emit("hammer.input", n), e.recognize(n), e.session.prevInput = n
            }

            function N(e, t) {
                var n = e.session,
                    r = t.pointers,
                    i = r.length;
                n.firstInput || (n.firstInput = A(t)), i > 1 && !n.firstMultiple ? n.firstMultiple = A(t) : 1 === i && (n.firstMultiple = !1);
                var o = n.firstInput,
                    a = n.firstMultiple,
                    s = a ? a.center : o.center,
                    u = t.center = O(r);
                t.timeStamp = ye(), t.deltaTime = t.timeStamp - o.timeStamp, t.angle = P(s, u), t.distance = L(s, u), j(n, t), t.offsetDirection = H(t.deltaX, t.deltaY);
                var c = D(t.deltaTime, t.deltaX, t.deltaY);
                t.overallVelocityX = c.x, t.overallVelocityY = c.y, t.overallVelocity = me(c.x) > me(c.y) ? c.x : c.y, t.scale = a ? _(a.pointers, r) : 1, t.rotation = a ? R(a.pointers, r) : 0, t.maxPointers = n.prevInput ? t.pointers.length > n.prevInput.maxPointers ? t.pointers.length : n.prevInput.maxPointers : t.pointers.length, I(n, t);
                var l = e.element;
                g(t.srcEvent.target, l) && (l = t.srcEvent.target), t.target = l
            }

            function j(e, t) {
                var n = t.center,
                    r = e.offsetDelta || {},
                    i = e.prevDelta || {},
                    o = e.prevInput || {};
                t.eventType !== Oe && o.eventType !== He || (i = e.prevDelta = {
                    x: o.deltaX || 0,
                    y: o.deltaY || 0
                }, r = e.offsetDelta = {
                    x: n.x,
                    y: n.y
                }), t.deltaX = i.x + (n.x - r.x), t.deltaY = i.y + (n.y - r.y)
            }

            function I(e, t) {
                var n, r, o, a, s = e.lastInterval || t,
                    u = t.timeStamp - s.timeStamp;
                if (t.eventType != Le && (u > Ae || s.velocity === i)) {
                    var c = t.deltaX - s.deltaX,
                        l = t.deltaY - s.deltaY,
                        f = D(u, c, l);
                    r = f.x, o = f.y, n = me(f.x) > me(f.y) ? f.x : f.y, a = H(c, l), e.lastInterval = t
                } else n = s.velocity, r = s.velocityX, o = s.velocityY, a = s.direction;
                t.velocity = n, t.velocityX = r, t.velocityY = o, t.direction = a
            }

            function A(e) {
                for (var t = [], n = 0; n < e.pointers.length;) t[n] = {
                    clientX: ve(e.pointers[n].clientX),
                    clientY: ve(e.pointers[n].clientY)
                }, n++;
                return {
                    timeStamp: ye(),
                    pointers: t,
                    center: O(t),
                    deltaX: e.deltaX,
                    deltaY: e.deltaY
                }
            }

            function O(e) {
                var t = e.length;
                if (1 === t) return {
                    x: ve(e[0].clientX),
                    y: ve(e[0].clientY)
                };
                for (var n = 0, r = 0, i = 0; i < t;) n += e[i].clientX, r += e[i].clientY, i++;
                return {
                    x: ve(n / t),
                    y: ve(r / t)
                }
            }

            function D(e, t, n) {
                return {
                    x: t / e || 0,
                    y: n / e || 0
                }
            }

            function H(e, t) {
                return e === t ? Pe : me(e) >= me(t) ? e < 0 ? Re : _e : t < 0 ? qe : Be
            }

            function L(e, t, n) {
                n || (n = Ue);
                var r = t[n[0]] - e[n[0]],
                    i = t[n[1]] - e[n[1]];
                return Math.sqrt(r * r + i * i)
            }

            function P(e, t, n) {
                n || (n = Ue);
                var r = t[n[0]] - e[n[0]],
                    i = t[n[1]] - e[n[1]];
                return 180 * Math.atan2(i, r) / Math.PI
            }

            function R(e, t) {
                return P(t[1], t[0], We) + P(e[1], e[0], We)
            }

            function _(e, t) {
                return L(t[0], t[1], We) / L(e[0], e[1], We)
            }

            function q() {
                this.evEl = ze, this.evWin = Je, this.pressed = !1, C.apply(this, arguments)
            }

            function B() {
                this.evEl = Qe, this.evWin = Ge, C.apply(this, arguments), this.store = this.manager.session.pointerEvents = []
            }

            function F() {
                this.evTarget = Ze, this.evWin = et, this.started = !1, C.apply(this, arguments)
            }

            function M(e, t) {
                var n = b(e.touches),
                    r = b(e.changedTouches);
                return t & (He | Le) && (n = x(n.concat(r), "identifier", !0)), [n, r]
            }

            function $() {
                this.evTarget = nt, this.targetIds = {}, C.apply(this, arguments)
            }

            function U(e, t) {
                var n = b(e.touches),
                    r = this.targetIds;
                if (t & (Oe | De) && 1 === n.length) return r[n[0].identifier] = !0, [n, n];
                var i, o, a = b(e.changedTouches),
                    s = [],
                    u = this.target;
                if (o = n.filter(function(e) {
                        return g(e.target, u)
                    }), t === Oe)
                    for (i = 0; i < o.length;) r[o[i].identifier] = !0, i++;
                for (i = 0; i < a.length;) r[a[i].identifier] && s.push(a[i]), t & (He | Le) && delete r[a[i].identifier], i++;
                return s.length ? [x(o.concat(s), "identifier", !0), s] : void 0
            }

            function W() {
                C.apply(this, arguments);
                var e = l(this.handler, this);
                this.touch = new $(this.manager, e), this.mouse = new q(this.manager, e), this.primaryTouch = null, this.lastTouches = []
            }

            function V(e, t) {
                e & Oe ? (this.primaryTouch = t.changedPointers[0].identifier, z.call(this, t)) : e & (He | Le) && z.call(this, t)
            }

            function z(e) {
                var t = e.changedPointers[0];
                if (t.identifier === this.primaryTouch) {
                    var n = {
                        x: t.clientX,
                        y: t.clientY
                    };
                    this.lastTouches.push(n);
                    var r = this.lastTouches,
                        i = function() {
                            var e = r.indexOf(n);
                            e > -1 && r.splice(e, 1)
                        };
                    setTimeout(i, rt)
                }
            }

            function J(e) {
                for (var t = e.srcEvent.clientX, n = e.srcEvent.clientY, r = 0; r < this.lastTouches.length; r++) {
                    var i = this.lastTouches[r],
                        o = Math.abs(t - i.x),
                        a = Math.abs(n - i.y);
                    if (o <= it && a <= it) return !0
                }
                return !1
            }

            function X(e, t) {
                this.manager = e, this.set(t)
            }

            function Y(e) {
                if (v(e, lt)) return lt;
                var t = v(e, ft),
                    n = v(e, dt);
                return t && n ? lt : t || n ? t ? ft : dt : v(e, ct) ? ct : ut
            }

            function Q() {
                if (!at) return !1;
                var t = {},
                    n = e.CSS && e.CSS.supports;
                return ["auto", "manipulation", "pan-y", "pan-x", "pan-x pan-y", "none"].forEach(function(r) {
                    t[r] = !n || e.CSS.supports("touch-action", r)
                }), t
            }

            function G(e) {
                this.options = de({}, this.defaults, e || {}), this.id = T(), this.manager = null, this.options.enable = d(this.options.enable, !0), this.state = ht, this.simultaneous = {}, this.requireFail = []
            }

            function K(e) {
                return e & bt ? "cancel" : e & mt ? "end" : e & vt ? "move" : e & gt ? "start" : ""
            }

            function Z(e) {
                return e == Be ? "down" : e == qe ? "up" : e == Re ? "left" : e == _e ? "right" : ""
            }

            function ee(e, t) {
                var n = t.manager;
                return n ? n.get(e) : e
            }

            function te() {
                G.apply(this, arguments)
            }

            function ne() {
                te.apply(this, arguments), this.pX = null, this.pY = null
            }

            function re() {
                te.apply(this, arguments)
            }

            function ie() {
                G.apply(this, arguments), this._timer = null, this._input = null
            }

            function oe() {
                te.apply(this, arguments)
            }

            function ae() {
                te.apply(this, arguments)
            }

            function se() {
                G.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, this._input = null, this.count = 0
            }

            function ue(e, t) {
                return t = t || {}, t.recognizers = d(t.recognizers, ue.defaults.preset), new ce(e, t)
            }

            function ce(e, t) {
                this.options = de({}, ue.defaults, t || {}), this.options.inputTarget = this.options.inputTarget || e, this.handlers = {}, this.session = {}, this.recognizers = [], this.oldCssProps = {}, this.element = e, this.input = E(this), this.touchAction = new X(this, this.options.touchAction), le(this, !0), s(this.options.recognizers, function(e) {
                    var t = this.add(new e[0](e[1]));
                    e[2] && t.recognizeWith(e[2]), e[3] && t.requireFailure(e[3])
                }, this)
            }

            function le(e, t) {
                var n = e.element;
                if (n.style) {
                    var r;
                    s(e.options.cssProps, function(i, o) {
                        r = w(n.style, o), t ? (e.oldCssProps[r] = n.style[r], n.style[r] = i) : n.style[r] = e.oldCssProps[r] || ""
                    }), t || (e.oldCssProps = {})
                }
            }

            function fe(e, t) {
                var r = n.createEvent("Event");
                r.initEvent(e, !0, !0), r.gesture = t, t.target.dispatchEvent(r)
            }
            var de, pe = ["", "webkit", "Moz", "MS", "ms", "o"],
                he = n.createElement("div"),
                ge = "function",
                ve = Math.round,
                me = Math.abs,
                ye = Date.now;
            de = "function" != typeof Object.assign ? function(e) {
                if (e === i || null === e) throw new TypeError("Cannot convert undefined or null to object");
                for (var t = Object(e), n = 1; n < arguments.length; n++) {
                    var r = arguments[n];
                    if (r !== i && null !== r)
                        for (var o in r) r.hasOwnProperty(o) && (t[o] = r[o])
                }
                return t
            } : Object.assign;
            var be = u(function(e, t, n) {
                    for (var r = Object.keys(t), o = 0; o < r.length;)(!n || n && e[r[o]] === i) && (e[r[o]] = t[r[o]]), o++;
                    return e
                }, "extend", "Use `assign`."),
                xe = u(function(e, t) {
                    return be(e, t, !0)
                }, "merge", "Use `assign`."),
                we = 1,
                Te = /mobile|tablet|ip(ad|hone|od)|android/i,
                Se = "ontouchstart" in e,
                Ce = w(e, "PointerEvent") !== i,
                Ee = Se && Te.test(navigator.userAgent),
                ke = "touch",
                Ne = "pen",
                je = "mouse",
                Ie = "kinect",
                Ae = 25,
                Oe = 1,
                De = 2,
                He = 4,
                Le = 8,
                Pe = 1,
                Re = 2,
                _e = 4,
                qe = 8,
                Be = 16,
                Fe = Re | _e,
                Me = qe | Be,
                $e = Fe | Me,
                Ue = ["x", "y"],
                We = ["clientX", "clientY"];
            C.prototype = {
                handler: function() {},
                init: function() {
                    this.evEl && p(this.element, this.evEl, this.domHandler), this.evTarget && p(this.target, this.evTarget, this.domHandler), this.evWin && p(S(this.element), this.evWin, this.domHandler)
                },
                destroy: function() {
                    this.evEl && h(this.element, this.evEl, this.domHandler), this.evTarget && h(this.target, this.evTarget, this.domHandler), this.evWin && h(S(this.element), this.evWin, this.domHandler)
                }
            };
            var Ve = {
                    mousedown: Oe,
                    mousemove: De,
                    mouseup: He
                },
                ze = "mousedown",
                Je = "mousemove mouseup";
            c(q, C, {
                handler: function(e) {
                    var t = Ve[e.type];
                    t & Oe && 0 === e.button && (this.pressed = !0), t & De && 1 !== e.which && (t = He), this.pressed && (t & He && (this.pressed = !1), this.callback(this.manager, t, {
                        pointers: [e],
                        changedPointers: [e],
                        pointerType: je,
                        srcEvent: e
                    }))
                }
            });
            var Xe = {
                    pointerdown: Oe,
                    pointermove: De,
                    pointerup: He,
                    pointercancel: Le,
                    pointerout: Le
                },
                Ye = {
                    2: ke,
                    3: Ne,
                    4: je,
                    5: Ie
                },
                Qe = "pointerdown",
                Ge = "pointermove pointerup pointercancel";
            e.MSPointerEvent && !e.PointerEvent && (Qe = "MSPointerDown", Ge = "MSPointerMove MSPointerUp MSPointerCancel"), c(B, C, {
                handler: function(e) {
                    var t = this.store,
                        n = !1,
                        r = e.type.toLowerCase().replace("ms", ""),
                        i = Xe[r],
                        o = Ye[e.pointerType] || e.pointerType,
                        a = o == ke,
                        s = y(t, e.pointerId, "pointerId");
                    i & Oe && (0 === e.button || a) ? s < 0 && (t.push(e), s = t.length - 1) : i & (He | Le) && (n = !0), s < 0 || (t[s] = e, this.callback(this.manager, i, {
                        pointers: t,
                        changedPointers: [e],
                        pointerType: o,
                        srcEvent: e
                    }), n && t.splice(s, 1))
                }
            });
            var Ke = {
                    touchstart: Oe,
                    touchmove: De,
                    touchend: He,
                    touchcancel: Le
                },
                Ze = "touchstart",
                et = "touchstart touchmove touchend touchcancel";
            c(F, C, {
                handler: function(e) {
                    var t = Ke[e.type];
                    if (t === Oe && (this.started = !0), this.started) {
                        var n = M.call(this, e, t);
                        t & (He | Le) && n[0].length - n[1].length === 0 && (this.started = !1), this.callback(this.manager, t, {
                            pointers: n[0],
                            changedPointers: n[1],
                            pointerType: ke,
                            srcEvent: e
                        })
                    }
                }
            });
            var tt = {
                    touchstart: Oe,
                    touchmove: De,
                    touchend: He,
                    touchcancel: Le
                },
                nt = "touchstart touchmove touchend touchcancel";
            c($, C, {
                handler: function(e) {
                    var t = tt[e.type],
                        n = U.call(this, e, t);
                    n && this.callback(this.manager, t, {
                        pointers: n[0],
                        changedPointers: n[1],
                        pointerType: ke,
                        srcEvent: e
                    })
                }
            });
            var rt = 2500,
                it = 25;
            c(W, C, {
                handler: function(e, t, n) {
                    var r = n.pointerType == ke,
                        i = n.pointerType == je;
                    if (!(i && n.sourceCapabilities && n.sourceCapabilities.firesTouchEvents)) {
                        if (r) V.call(this, t, n);
                        else if (i && J.call(this, n)) return;
                        this.callback(e, t, n)
                    }
                },
                destroy: function() {
                    this.touch.destroy(), this.mouse.destroy()
                }
            });
            var ot = w(he.style, "touchAction"),
                at = ot !== i,
                st = "compute",
                ut = "auto",
                ct = "manipulation",
                lt = "none",
                ft = "pan-x",
                dt = "pan-y",
                pt = Q();
            X.prototype = {
                set: function(e) {
                    e == st && (e = this.compute()), at && this.manager.element.style && pt[e] && (this.manager.element.style[ot] = e), this.actions = e.toLowerCase().trim()
                },
                update: function() {
                    this.set(this.manager.options.touchAction)
                },
                compute: function() {
                    var e = [];
                    return s(this.manager.recognizers, function(t) {
                        f(t.options.enable, [t]) && (e = e.concat(t.getTouchAction()))
                    }), Y(e.join(" "))
                },
                preventDefaults: function(e) {
                    var t = e.srcEvent,
                        n = e.offsetDirection;
                    if (this.manager.session.prevented) return void t.preventDefault();
                    var r = this.actions,
                        i = v(r, lt) && !pt[lt],
                        o = v(r, dt) && !pt[dt],
                        a = v(r, ft) && !pt[ft];
                    if (i) {
                        var s = 1 === e.pointers.length,
                            u = e.distance < 2,
                            c = e.deltaTime < 250;
                        if (s && u && c) return
                    }
                    return a && o ? void 0 : i || o && n & Fe || a && n & Me ? this.preventSrc(t) : void 0
                },
                preventSrc: function(e) {
                    this.manager.session.prevented = !0, e.preventDefault()
                }
            };
            var ht = 1,
                gt = 2,
                vt = 4,
                mt = 8,
                yt = mt,
                bt = 16,
                xt = 32;
            G.prototype = {
                defaults: {},
                set: function(e) {
                    return de(this.options, e), this.manager && this.manager.touchAction.update(), this
                },
                recognizeWith: function(e) {
                    if (a(e, "recognizeWith", this)) return this;
                    var t = this.simultaneous;
                    return e = ee(e, this), t[e.id] || (t[e.id] = e, e.recognizeWith(this)), this
                },
                dropRecognizeWith: function(e) {
                    return a(e, "dropRecognizeWith", this) ? this : (e = ee(e, this), delete this.simultaneous[e.id], this)
                },
                requireFailure: function(e) {
                    if (a(e, "requireFailure", this)) return this;
                    var t = this.requireFail;
                    return e = ee(e, this), y(t, e) === -1 && (t.push(e), e.requireFailure(this)), this
                },
                dropRequireFailure: function(e) {
                    if (a(e, "dropRequireFailure", this)) return this;
                    e = ee(e, this);
                    var t = y(this.requireFail, e);
                    return t > -1 && this.requireFail.splice(t, 1), this
                },
                hasRequireFailures: function() {
                    return this.requireFail.length > 0
                },
                canRecognizeWith: function(e) {
                    return !!this.simultaneous[e.id]
                },
                emit: function(e) {
                    function t(t) {
                        n.manager.emit(t, e)
                    }
                    var n = this,
                        r = this.state;
                    r < mt && t(n.options.event + K(r)), t(n.options.event), e.additionalEvent && t(e.additionalEvent), r >= mt && t(n.options.event + K(r))
                },
                tryEmit: function(e) {
                    return this.canEmit() ? this.emit(e) : void(this.state = xt)
                },
                canEmit: function() {
                    for (var e = 0; e < this.requireFail.length;) {
                        if (!(this.requireFail[e].state & (xt | ht))) return !1;
                        e++
                    }
                    return !0
                },
                recognize: function(e) {
                    var t = de({}, e);
                    return f(this.options.enable, [this, t]) ? (this.state & (yt | bt | xt) && (this.state = ht), this.state = this.process(t), void(this.state & (gt | vt | mt | bt) && this.tryEmit(t))) : (this.reset(), void(this.state = xt))
                },
                process: function(e) {},
                getTouchAction: function() {},
                reset: function() {}
            }, c(te, G, {
                defaults: {
                    pointers: 1
                },
                attrTest: function(e) {
                    var t = this.options.pointers;
                    return 0 === t || e.pointers.length === t
                },
                process: function(e) {
                    var t = this.state,
                        n = e.eventType,
                        r = t & (gt | vt),
                        i = this.attrTest(e);
                    return r && (n & Le || !i) ? t | bt : r || i ? n & He ? t | mt : t & gt ? t | vt : gt : xt
                }
            }), c(ne, te, {
                defaults: {
                    event: "pan",
                    threshold: 10,
                    pointers: 1,
                    direction: $e
                },
                getTouchAction: function() {
                    var e = this.options.direction,
                        t = [];
                    return e & Fe && t.push(dt), e & Me && t.push(ft), t
                },
                directionTest: function(e) {
                    var t = this.options,
                        n = !0,
                        r = e.distance,
                        i = e.direction,
                        o = e.deltaX,
                        a = e.deltaY;
                    return i & t.direction || (t.direction & Fe ? (i = 0 === o ? Pe : o < 0 ? Re : _e, n = o != this.pX, r = Math.abs(e.deltaX)) : (i = 0 === a ? Pe : a < 0 ? qe : Be, n = a != this.pY, r = Math.abs(e.deltaY))), e.direction = i, n && r > t.threshold && i & t.direction
                },
                attrTest: function(e) {
                    return te.prototype.attrTest.call(this, e) && (this.state & gt || !(this.state & gt) && this.directionTest(e))
                },
                emit: function(e) {
                    this.pX = e.deltaX, this.pY = e.deltaY;
                    var t = Z(e.direction);
                    t && (e.additionalEvent = this.options.event + t), this._super.emit.call(this, e)
                }
            }), c(re, te, {
                defaults: {
                    event: "pinch",
                    threshold: 0,
                    pointers: 2
                },
                getTouchAction: function() {
                    return [lt]
                },
                attrTest: function(e) {
                    return this._super.attrTest.call(this, e) && (Math.abs(e.scale - 1) > this.options.threshold || this.state & gt)
                },
                emit: function(e) {
                    if (1 !== e.scale) {
                        var t = e.scale < 1 ? "in" : "out";
                        e.additionalEvent = this.options.event + t
                    }
                    this._super.emit.call(this, e)
                }
            }), c(ie, G, {
                defaults: {
                    event: "press",
                    pointers: 1,
                    time: 251,
                    threshold: 9
                },
                getTouchAction: function() {
                    return [ut]
                },
                process: function(e) {
                    var t = this.options,
                        n = e.pointers.length === t.pointers,
                        r = e.distance < t.threshold,
                        i = e.deltaTime > t.time;
                    if (this._input = e, !r || !n || e.eventType & (He | Le) && !i) this.reset();
                    else if (e.eventType & Oe) this.reset(), this._timer = o(function() {
                        this.state = yt, this.tryEmit()
                    }, t.time, this);
                    else if (e.eventType & He) return yt;
                    return xt
                },
                reset: function() {
                    clearTimeout(this._timer)
                },
                emit: function(e) {
                    this.state === yt && (e && e.eventType & He ? this.manager.emit(this.options.event + "up", e) : (this._input.timeStamp = ye(), this.manager.emit(this.options.event, this._input)))
                }
            }), c(oe, te, {
                defaults: {
                    event: "rotate",
                    threshold: 0,
                    pointers: 2
                },
                getTouchAction: function() {
                    return [lt]
                },
                attrTest: function(e) {
                    return this._super.attrTest.call(this, e) && (Math.abs(e.rotation) > this.options.threshold || this.state & gt)
                }
            }), c(ae, te, {
                defaults: {
                    event: "swipe",
                    threshold: 10,
                    velocity: .3,
                    direction: Fe | Me,
                    pointers: 1
                },
                getTouchAction: function() {
                    return ne.prototype.getTouchAction.call(this)
                },
                attrTest: function(e) {
                    var t, n = this.options.direction;
                    return n & (Fe | Me) ? t = e.overallVelocity : n & Fe ? t = e.overallVelocityX : n & Me && (t = e.overallVelocityY), this._super.attrTest.call(this, e) && n & e.offsetDirection && e.distance > this.options.threshold && e.maxPointers == this.options.pointers && me(t) > this.options.velocity && e.eventType & He
                },
                emit: function(e) {
                    var t = Z(e.offsetDirection);
                    t && this.manager.emit(this.options.event + t, e), this.manager.emit(this.options.event, e)
                }
            }), c(se, G, {
                defaults: {
                    event: "tap",
                    pointers: 1,
                    taps: 1,
                    interval: 300,
                    time: 250,
                    threshold: 9,
                    posThreshold: 10
                },
                getTouchAction: function() {
                    return [ct]
                },
                process: function(e) {
                    var t = this.options,
                        n = e.pointers.length === t.pointers,
                        r = e.distance < t.threshold,
                        i = e.deltaTime < t.time;
                    if (this.reset(), e.eventType & Oe && 0 === this.count) return this.failTimeout();
                    if (r && i && n) {
                        if (e.eventType != He) return this.failTimeout();
                        var a = !this.pTime || e.timeStamp - this.pTime < t.interval,
                            s = !this.pCenter || L(this.pCenter, e.center) < t.posThreshold;
                        this.pTime = e.timeStamp, this.pCenter = e.center, s && a ? this.count += 1 : this.count = 1, this._input = e;
                        var u = this.count % t.taps;
                        if (0 === u) return this.hasRequireFailures() ? (this._timer = o(function() {
                            this.state = yt, this.tryEmit()
                        }, t.interval, this), gt) : yt
                    }
                    return xt
                },
                failTimeout: function() {
                    return this._timer = o(function() {
                        this.state = xt
                    }, this.options.interval, this), xt
                },
                reset: function() {
                    clearTimeout(this._timer)
                },
                emit: function() {
                    this.state == yt && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input))
                }
            }), ue.VERSION = "2.0.7", ue.defaults = {
                domEvents: !1,
                touchAction: st,
                enable: !0,
                inputTarget: null,
                inputClass: null,
                preset: [
                    [oe, {
                        enable: !1
                    }],
                    [re, {
                            enable: !1
                        },
                        ["rotate"]
                    ],
                    [ae, {
                        direction: Fe
                    }],
                    [ne, {
                            direction: Fe
                        },
                        ["swipe"]
                    ],
                    [se],
                    [se, {
                            event: "doubletap",
                            taps: 2
                        },
                        ["tap"]
                    ],
                    [ie]
                ],
                cssProps: {
                    userSelect: "none",
                    touchSelect: "none",
                    touchCallout: "none",
                    contentZooming: "none",
                    userDrag: "none",
                    tapHighlightColor: "rgba(0,0,0,0)"
                }
            };
            var wt = 1,
                Tt = 2;
            ce.prototype = {
                set: function(e) {
                    return de(this.options, e), e.touchAction && this.touchAction.update(), e.inputTarget && (this.input.destroy(), this.input.target = e.inputTarget, this.input.init()), this
                },
                stop: function(e) {
                    this.session.stopped = e ? Tt : wt
                },
                recognize: function(e) {
                    var t = this.session;
                    if (!t.stopped) {
                        this.touchAction.preventDefaults(e);
                        var n, r = this.recognizers,
                            i = t.curRecognizer;
                        (!i || i && i.state & yt) && (i = t.curRecognizer = null);
                        for (var o = 0; o < r.length;) n = r[o], t.stopped === Tt || i && n != i && !n.canRecognizeWith(i) ? n.reset() : n.recognize(e), !i && n.state & (gt | vt | mt) && (i = t.curRecognizer = n), o++
                    }
                },
                get: function(e) {
                    if (e instanceof G) return e;
                    for (var t = this.recognizers, n = 0; n < t.length; n++)
                        if (t[n].options.event == e) return t[n];
                    return null
                },
                add: function(e) {
                    if (a(e, "add", this)) return this;
                    var t = this.get(e.options.event);
                    return t && this.remove(t), this.recognizers.push(e), e.manager = this, this.touchAction.update(), e
                },
                remove: function(e) {
                    if (a(e, "remove", this)) return this;
                    if (e = this.get(e)) {
                        var t = this.recognizers,
                            n = y(t, e);
                        n !== -1 && (t.splice(n, 1), this.touchAction.update())
                    }
                    return this
                },
                on: function(e, t) {
                    if (e !== i && t !== i) {
                        var n = this.handlers;
                        return s(m(e), function(e) {
                            n[e] = n[e] || [], n[e].push(t)
                        }), this
                    }
                },
                off: function(e, t) {
                    if (e !== i) {
                        var n = this.handlers;
                        return s(m(e), function(e) {
                            t ? n[e] && n[e].splice(y(n[e], t), 1) : delete n[e]
                        }), this
                    }
                },
                emit: function(e, t) {
                    this.options.domEvents && fe(e, t);
                    var n = this.handlers[e] && this.handlers[e].slice();
                    if (n && n.length) {
                        t.type = e, t.preventDefault = function() {
                            t.srcEvent.preventDefault()
                        };
                        for (var r = 0; r < n.length;) n[r](t), r++
                    }
                },
                destroy: function() {
                    this.element && le(this, !1), this.handlers = {}, this.session = {}, this.input.destroy(), this.element = null
                }
            }, de(ue, {
                INPUT_START: Oe,
                INPUT_MOVE: De,
                INPUT_END: He,
                INPUT_CANCEL: Le,
                STATE_POSSIBLE: ht,
                STATE_BEGAN: gt,
                STATE_CHANGED: vt,
                STATE_ENDED: mt,
                STATE_RECOGNIZED: yt,
                STATE_CANCELLED: bt,
                STATE_FAILED: xt,
                DIRECTION_NONE: Pe,
                DIRECTION_LEFT: Re,
                DIRECTION_RIGHT: _e,
                DIRECTION_UP: qe,
                DIRECTION_DOWN: Be,
                DIRECTION_HORIZONTAL: Fe,
                DIRECTION_VERTICAL: Me,
                DIRECTION_ALL: $e,
                Manager: ce,
                Input: C,
                TouchAction: X,
                TouchInput: $,
                MouseInput: q,
                PointerEventInput: B,
                TouchMouseInput: W,
                SingleTouchInput: F,
                Recognizer: G,
                AttrRecognizer: te,
                Tap: se,
                Pan: ne,
                Swipe: ae,
                Pinch: re,
                Rotate: oe,
                Press: ie,
                on: p,
                off: h,
                each: s,
                merge: xe,
                extend: be,
                assign: de,
                inherit: c,
                bindFn: l,
                prefixed: w
            });
            var St = "undefined" != typeof e ? e : "undefined" != typeof self ? self : {};
            St.Hammer = ue, "function" == typeof define && define.amd ? define(function() {
                return ue
            }) : "undefined" != typeof t && t.exports ? t.exports = ue : e[r] = ue
        }(window, document, "Hammer")
    }, {}],
    3: [function(e, t, n) {
        ! function(e, n) {
            "object" == typeof t && "object" == typeof t.exports ? t.exports = e.document ? n(e, !0) : function(e) {
                if (!e.document) throw new Error("jQuery requires a window with a document");
                return n(e)
            } : n(e)
        }("undefined" != typeof window ? window : this, function(e, t) {
            function n(e) {
                var t = !!e && "length" in e && e.length,
                    n = oe.type(e);
                return "function" !== n && !oe.isWindow(e) && ("array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e)
            }

            function r(e, t, n) {
                if (oe.isFunction(t)) return oe.grep(e, function(e, r) {
                    return !!t.call(e, r, e) !== n
                });
                if (t.nodeType) return oe.grep(e, function(e) {
                    return e === t !== n
                });
                if ("string" == typeof t) {
                    if (ge.test(t)) return oe.filter(t, e, n);
                    t = oe.filter(t, e)
                }
                return oe.grep(e, function(e) {
                    return Z.call(t, e) > -1 !== n
                })
            }

            function i(e, t) {
                for (;
                    (e = e[t]) && 1 !== e.nodeType;);
                return e
            }

            function o(e) {
                var t = {};
                return oe.each(e.match(we) || [], function(e, n) {
                    t[n] = !0
                }), t
            }

            function a() {
                Y.removeEventListener("DOMContentLoaded", a), e.removeEventListener("load", a), oe.ready()
            }

            function s() {
                this.expando = oe.expando + s.uid++
            }

            function u(e, t, n) {
                var r;
                if (void 0 === n && 1 === e.nodeType)
                    if (r = "data-" + t.replace(je, "-$&").toLowerCase(), n = e.getAttribute(r), "string" == typeof n) {
                        try {
                            n = "true" === n || "false" !== n && ("null" === n ? null : +n + "" === n ? +n : Ne.test(n) ? oe.parseJSON(n) : n)
                        } catch (i) {}
                        ke.set(e, t, n)
                    } else n = void 0;
                return n
            }

            function c(e, t, n, r) {
                var i, o = 1,
                    a = 20,
                    s = r ? function() {
                        return r.cur()
                    } : function() {
                        return oe.css(e, t, "")
                    },
                    u = s(),
                    c = n && n[3] || (oe.cssNumber[t] ? "" : "px"),
                    l = (oe.cssNumber[t] || "px" !== c && +u) && Ae.exec(oe.css(e, t));
                if (l && l[3] !== c) {
                    c = c || l[3], n = n || [], l = +u || 1;
                    do o = o || ".5", l /= o, oe.style(e, t, l + c); while (o !== (o = s() / u) && 1 !== o && --a)
                }
                return n && (l = +l || +u || 0, i = n[1] ? l + (n[1] + 1) * n[2] : +n[2], r && (r.unit = c, r.start = l, r.end = i)), i
            }

            function l(e, t) {
                var n = "undefined" != typeof e.getElementsByTagName ? e.getElementsByTagName(t || "*") : "undefined" != typeof e.querySelectorAll ? e.querySelectorAll(t || "*") : [];
                return void 0 === t || t && oe.nodeName(e, t) ? oe.merge([e], n) : n
            }

            function f(e, t) {
                for (var n = 0, r = e.length; n < r; n++) Ee.set(e[n], "globalEval", !t || Ee.get(t[n], "globalEval"))
            }

            function d(e, t, n, r, i) {
                for (var o, a, s, u, c, d, p = t.createDocumentFragment(), h = [], g = 0, v = e.length; g < v; g++)
                    if (o = e[g], o || 0 === o)
                        if ("object" === oe.type(o)) oe.merge(h, o.nodeType ? [o] : o);
                        else if (_e.test(o)) {
                    for (a = a || p.appendChild(t.createElement("div")), s = (Le.exec(o) || ["", ""])[1].toLowerCase(), u = Re[s] || Re._default, a.innerHTML = u[1] + oe.htmlPrefilter(o) + u[2], d = u[0]; d--;) a = a.lastChild;
                    oe.merge(h, a.childNodes), a = p.firstChild, a.textContent = ""
                } else h.push(t.createTextNode(o));
                for (p.textContent = "", g = 0; o = h[g++];)
                    if (r && oe.inArray(o, r) > -1) i && i.push(o);
                    else if (c = oe.contains(o.ownerDocument, o), a = l(p.appendChild(o), "script"), c && f(a), n)
                    for (d = 0; o = a[d++];) Pe.test(o.type || "") && n.push(o);
                return p
            }

            function p() {
                return !0
            }

            function h() {
                return !1
            }

            function g() {
                try {
                    return Y.activeElement
                } catch (e) {}
            }

            function v(e, t, n, r, i, o) {
                var a, s;
                if ("object" == typeof t) {
                    "string" != typeof n && (r = r || n, n = void 0);
                    for (s in t) v(e, s, n, r, t[s], o);
                    return e
                }
                if (null == r && null == i ? (i = n, r = n = void 0) : null == i && ("string" == typeof n ? (i = r, r = void 0) : (i = r, r = n, n = void 0)), i === !1) i = h;
                else if (!i) return e;
                return 1 === o && (a = i, i = function(e) {
                    return oe().off(e), a.apply(this, arguments)
                }, i.guid = a.guid || (a.guid = oe.guid++)), e.each(function() {
                    oe.event.add(this, t, i, r, n)
                })
            }

            function m(e, t) {
                return oe.nodeName(e, "table") && oe.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
            }

            function y(e) {
                return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e
            }

            function b(e) {
                var t = We.exec(e.type);
                return t ? e.type = t[1] : e.removeAttribute("type"), e
            }

            function x(e, t) {
                var n, r, i, o, a, s, u, c;
                if (1 === t.nodeType) {
                    if (Ee.hasData(e) && (o = Ee.access(e), a = Ee.set(t, o), c = o.events)) {
                        delete a.handle, a.events = {};
                        for (i in c)
                            for (n = 0, r = c[i].length; n < r; n++) oe.event.add(t, i, c[i][n])
                    }
                    ke.hasData(e) && (s = ke.access(e), u = oe.extend({}, s), ke.set(t, u))
                }
            }

            function w(e, t) {
                var n = t.nodeName.toLowerCase();
                "input" === n && He.test(e.type) ? t.checked = e.checked : "input" !== n && "textarea" !== n || (t.defaultValue = e.defaultValue)
            }

            function T(e, t, n, r) {
                t = G.apply([], t);
                var i, o, a, s, u, c, f = 0,
                    p = e.length,
                    h = p - 1,
                    g = t[0],
                    v = oe.isFunction(g);
                if (v || p > 1 && "string" == typeof g && !re.checkClone && Ue.test(g)) return e.each(function(i) {
                    var o = e.eq(i);
                    v && (t[0] = g.call(this, i, o.html())), T(o, t, n, r)
                });
                if (p && (i = d(t, e[0].ownerDocument, !1, e, r), o = i.firstChild, 1 === i.childNodes.length && (i = o), o || r)) {
                    for (a = oe.map(l(i, "script"), y), s = a.length; f < p; f++) u = i, f !== h && (u = oe.clone(u, !0, !0), s && oe.merge(a, l(u, "script"))), n.call(e[f], u, f);
                    if (s)
                        for (c = a[a.length - 1].ownerDocument, oe.map(a, b), f = 0; f < s; f++) u = a[f], Pe.test(u.type || "") && !Ee.access(u, "globalEval") && oe.contains(c, u) && (u.src ? oe._evalUrl && oe._evalUrl(u.src) : oe.globalEval(u.textContent.replace(Ve, "")))
                }
                return e
            }

            function S(e, t, n) {
                for (var r, i = t ? oe.filter(t, e) : e, o = 0; null != (r = i[o]); o++) n || 1 !== r.nodeType || oe.cleanData(l(r)), r.parentNode && (n && oe.contains(r.ownerDocument, r) && f(l(r, "script")), r.parentNode.removeChild(r));
                return e
            }

            function C(e, t) {
                var n = oe(t.createElement(e)).appendTo(t.body),
                    r = oe.css(n[0], "display");
                return n.detach(), r
            }

            function E(e) {
                var t = Y,
                    n = Je[e];
                return n || (n = C(e, t), "none" !== n && n || (ze = (ze || oe("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement), t = ze[0].contentDocument, t.write(), t.close(), n = C(e, t), ze.detach()), Je[e] = n), n
            }

            function k(e, t, n) {
                var r, i, o, a, s = e.style;
                return n = n || Qe(e), a = n ? n.getPropertyValue(t) || n[t] : void 0, "" !== a && void 0 !== a || oe.contains(e.ownerDocument, e) || (a = oe.style(e, t)), n && !re.pixelMarginRight() && Ye.test(a) && Xe.test(t) && (r = s.width, i = s.minWidth, o = s.maxWidth, s.minWidth = s.maxWidth = s.width = a, a = n.width, s.width = r, s.minWidth = i, s.maxWidth = o), void 0 !== a ? a + "" : a
            }

            function N(e, t) {
                return {
                    get: function() {
                        return e() ? void delete this.get : (this.get = t).apply(this, arguments)
                    }
                }
            }

            function j(e) {
                if (e in rt) return e;
                for (var t = e[0].toUpperCase() + e.slice(1), n = nt.length; n--;)
                    if (e = nt[n] + t, e in rt) return e
            }

            function I(e, t, n) {
                var r = Ae.exec(t);
                return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t
            }

            function A(e, t, n, r, i) {
                for (var o = n === (r ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0; o < 4; o += 2) "margin" === n && (a += oe.css(e, n + Oe[o], !0, i)), r ? ("content" === n && (a -= oe.css(e, "padding" + Oe[o], !0, i)), "margin" !== n && (a -= oe.css(e, "border" + Oe[o] + "Width", !0, i))) : (a += oe.css(e, "padding" + Oe[o], !0, i), "padding" !== n && (a += oe.css(e, "border" + Oe[o] + "Width", !0, i)));
                return a
            }

            function O(e, t, n) {
                var r = !0,
                    i = "width" === t ? e.offsetWidth : e.offsetHeight,
                    o = Qe(e),
                    a = "border-box" === oe.css(e, "boxSizing", !1, o);
                if (i <= 0 || null == i) {
                    if (i = k(e, t, o), (i < 0 || null == i) && (i = e.style[t]), Ye.test(i)) return i;
                    r = a && (re.boxSizingReliable() || i === e.style[t]), i = parseFloat(i) || 0
                }
                return i + A(e, t, n || (a ? "border" : "content"), r, o) + "px"
            }

            function D(e, t) {
                for (var n, r, i, o = [], a = 0, s = e.length; a < s; a++) r = e[a], r.style && (o[a] = Ee.get(r, "olddisplay"), n = r.style.display, t ? (o[a] || "none" !== n || (r.style.display = ""), "" === r.style.display && De(r) && (o[a] = Ee.access(r, "olddisplay", E(r.nodeName)))) : (i = De(r), "none" === n && i || Ee.set(r, "olddisplay", i ? n : oe.css(r, "display"))));
                for (a = 0; a < s; a++) r = e[a], r.style && (t && "none" !== r.style.display && "" !== r.style.display || (r.style.display = t ? o[a] || "" : "none"));
                return e
            }

            function H(e, t, n, r, i) {
                return new H.prototype.init(e, t, n, r, i)
            }

            function L() {
                return e.setTimeout(function() {
                    it = void 0
                }), it = oe.now()
            }

            function P(e, t) {
                var n, r = 0,
                    i = {
                        height: e
                    };
                for (t = t ? 1 : 0; r < 4; r += 2 - t) n = Oe[r], i["margin" + n] = i["padding" + n] = e;
                return t && (i.opacity = i.width = e), i
            }

            function R(e, t, n) {
                for (var r, i = (B.tweeners[t] || []).concat(B.tweeners["*"]), o = 0, a = i.length; o < a; o++)
                    if (r = i[o].call(n, t, e)) return r
            }

            function _(e, t, n) {
                var r, i, o, a, s, u, c, l, f = this,
                    d = {},
                    p = e.style,
                    h = e.nodeType && De(e),
                    g = Ee.get(e, "fxshow");
                n.queue || (s = oe._queueHooks(e, "fx"), null == s.unqueued && (s.unqueued = 0, u = s.empty.fire, s.empty.fire = function() {
                    s.unqueued || u()
                }), s.unqueued++, f.always(function() {
                    f.always(function() {
                        s.unqueued--, oe.queue(e, "fx").length || s.empty.fire()
                    })
                })), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [p.overflow, p.overflowX, p.overflowY], c = oe.css(e, "display"), l = "none" === c ? Ee.get(e, "olddisplay") || E(e.nodeName) : c, "inline" === l && "none" === oe.css(e, "float") && (p.display = "inline-block")), n.overflow && (p.overflow = "hidden", f.always(function() {
                    p.overflow = n.overflow[0], p.overflowX = n.overflow[1], p.overflowY = n.overflow[2]
                }));
                for (r in t)
                    if (i = t[r], at.exec(i)) {
                        if (delete t[r], o = o || "toggle" === i, i === (h ? "hide" : "show")) {
                            if ("show" !== i || !g || void 0 === g[r]) continue;
                            h = !0
                        }
                        d[r] = g && g[r] || oe.style(e, r)
                    } else c = void 0;
                if (oe.isEmptyObject(d)) "inline" === ("none" === c ? E(e.nodeName) : c) && (p.display = c);
                else {
                    g ? "hidden" in g && (h = g.hidden) : g = Ee.access(e, "fxshow", {}), o && (g.hidden = !h), h ? oe(e).show() : f.done(function() {
                        oe(e).hide()
                    }), f.done(function() {
                        var t;
                        Ee.remove(e, "fxshow");
                        for (t in d) oe.style(e, t, d[t])
                    });
                    for (r in d) a = R(h ? g[r] : 0, r, f), r in g || (g[r] = a.start, h && (a.end = a.start, a.start = "width" === r || "height" === r ? 1 : 0))
                }
            }

            function q(e, t) {
                var n, r, i, o, a;
                for (n in e)
                    if (r = oe.camelCase(n), i = t[r], o = e[n], oe.isArray(o) && (i = o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), a = oe.cssHooks[r], a && "expand" in a) {
                        o = a.expand(o), delete e[r];
                        for (n in o) n in e || (e[n] = o[n], t[n] = i)
                    } else t[r] = i
            }

            function B(e, t, n) {
                var r, i, o = 0,
                    a = B.prefilters.length,
                    s = oe.Deferred().always(function() {
                        delete u.elem
                    }),
                    u = function() {
                        if (i) return !1;
                        for (var t = it || L(), n = Math.max(0, c.startTime + c.duration - t), r = n / c.duration || 0, o = 1 - r, a = 0, u = c.tweens.length; a < u; a++) c.tweens[a].run(o);
                        return s.notifyWith(e, [c, o, n]), o < 1 && u ? n : (s.resolveWith(e, [c]), !1)
                    },
                    c = s.promise({
                        elem: e,
                        props: oe.extend({}, t),
                        opts: oe.extend(!0, {
                            specialEasing: {},
                            easing: oe.easing._default
                        }, n),
                        originalProperties: t,
                        originalOptions: n,
                        startTime: it || L(),
                        duration: n.duration,
                        tweens: [],
                        createTween: function(t, n) {
                            var r = oe.Tween(e, c.opts, t, n, c.opts.specialEasing[t] || c.opts.easing);
                            return c.tweens.push(r), r
                        },
                        stop: function(t) {
                            var n = 0,
                                r = t ? c.tweens.length : 0;
                            if (i) return this;
                            for (i = !0; n < r; n++) c.tweens[n].run(1);
                            return t ? (s.notifyWith(e, [c, 1, 0]), s.resolveWith(e, [c, t])) : s.rejectWith(e, [c, t]), this
                        }
                    }),
                    l = c.props;
                for (q(l, c.opts.specialEasing); o < a; o++)
                    if (r = B.prefilters[o].call(c, e, l, c.opts)) return oe.isFunction(r.stop) && (oe._queueHooks(c.elem, c.opts.queue).stop = oe.proxy(r.stop, r)), r;
                return oe.map(l, R, c), oe.isFunction(c.opts.start) && c.opts.start.call(e, c), oe.fx.timer(oe.extend(u, {
                    elem: e,
                    anim: c,
                    queue: c.opts.queue
                })), c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always)
            }

            function F(e) {
                return e.getAttribute && e.getAttribute("class") || ""
            }

            function M(e) {
                return function(t, n) {
                    "string" != typeof t && (n = t, t = "*");
                    var r, i = 0,
                        o = t.toLowerCase().match(we) || [];
                    if (oe.isFunction(n))
                        for (; r = o[i++];) "+" === r[0] ? (r = r.slice(1) || "*", (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n)
                }
            }

            function $(e, t, n, r) {
                function i(s) {
                    var u;
                    return o[s] = !0, oe.each(e[s] || [], function(e, s) {
                        var c = s(t, n, r);
                        return "string" != typeof c || a || o[c] ? a ? !(u = c) : void 0 : (t.dataTypes.unshift(c), i(c), !1)
                    }), u
                }
                var o = {},
                    a = e === kt;
                return i(t.dataTypes[0]) || !o["*"] && i("*")
            }

            function U(e, t) {
                var n, r, i = oe.ajaxSettings.flatOptions || {};
                for (n in t) void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
                return r && oe.extend(!0, e, r), e
            }

            function W(e, t, n) {
                for (var r, i, o, a, s = e.contents, u = e.dataTypes;
                    "*" === u[0];) u.shift(), void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
                if (r)
                    for (i in s)
                        if (s[i] && s[i].test(r)) {
                            u.unshift(i);
                            break
                        }
                if (u[0] in n) o = u[0];
                else {
                    for (i in n) {
                        if (!u[0] || e.converters[i + " " + u[0]]) {
                            o = i;
                            break
                        }
                        a || (a = i)
                    }
                    o = o || a
                }
                if (o) return o !== u[0] && u.unshift(o), n[o]
            }

            function V(e, t, n, r) {
                var i, o, a, s, u, c = {},
                    l = e.dataTypes.slice();
                if (l[1])
                    for (a in e.converters) c[a.toLowerCase()] = e.converters[a];
                for (o = l.shift(); o;)
                    if (e.responseFields[o] && (n[e.responseFields[o]] = t), !u && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), u = o, o = l.shift())
                        if ("*" === o) o = u;
                        else if ("*" !== u && u !== o) {
                    if (a = c[u + " " + o] || c["* " + o], !a)
                        for (i in c)
                            if (s = i.split(" "), s[1] === o && (a = c[u + " " + s[0]] || c["* " + s[0]])) {
                                a === !0 ? a = c[i] : c[i] !== !0 && (o = s[0], l.unshift(s[1]));
                                break
                            }
                    if (a !== !0)
                        if (a && e["throws"]) t = a(t);
                        else try {
                            t = a(t)
                        } catch (f) {
                            return {
                                state: "parsererror",
                                error: a ? f : "No conversion from " + u + " to " + o
                            }
                        }
                }
                return {
                    state: "success",
                    data: t
                }
            }

            function z(e, t, n, r) {
                var i;
                if (oe.isArray(t)) oe.each(t, function(t, i) {
                    n || At.test(e) ? r(e, i) : z(e + "[" + ("object" == typeof i && null != i ? t : "") + "]", i, n, r)
                });
                else if (n || "object" !== oe.type(t)) r(e, t);
                else
                    for (i in t) z(e + "[" + i + "]", t[i], n, r)
            }

            function J(e) {
                return oe.isWindow(e) ? e : 9 === e.nodeType && e.defaultView
            }
            var X = [],
                Y = e.document,
                Q = X.slice,
                G = X.concat,
                K = X.push,
                Z = X.indexOf,
                ee = {},
                te = ee.toString,
                ne = ee.hasOwnProperty,
                re = {},
                ie = "2.2.4",
                oe = function(e, t) {
                    return new oe.fn.init(e, t)
                },
                ae = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
                se = /^-ms-/,
                ue = /-([\da-z])/gi,
                ce = function(e, t) {
                    return t.toUpperCase()
                };
            oe.fn = oe.prototype = {
                jquery: ie,
                constructor: oe,
                selector: "",
                length: 0,
                toArray: function() {
                    return Q.call(this)
                },
                get: function(e) {
                    return null != e ? e < 0 ? this[e + this.length] : this[e] : Q.call(this)
                },
                pushStack: function(e) {
                    var t = oe.merge(this.constructor(), e);
                    return t.prevObject = this, t.context = this.context, t
                },
                each: function(e) {
                    return oe.each(this, e)
                },
                map: function(e) {
                    return this.pushStack(oe.map(this, function(t, n) {
                        return e.call(t, n, t)
                    }))
                },
                slice: function() {
                    return this.pushStack(Q.apply(this, arguments))
                },
                first: function() {
                    return this.eq(0)
                },
                last: function() {
                    return this.eq(-1)
                },
                eq: function(e) {
                    var t = this.length,
                        n = +e + (e < 0 ? t : 0);
                    return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
                },
                end: function() {
                    return this.prevObject || this.constructor()
                },
                push: K,
                sort: X.sort,
                splice: X.splice
            }, oe.extend = oe.fn.extend = function() {
                var e, t, n, r, i, o, a = arguments[0] || {},
                    s = 1,
                    u = arguments.length,
                    c = !1;
                for ("boolean" == typeof a && (c = a, a = arguments[s] || {}, s++), "object" == typeof a || oe.isFunction(a) || (a = {}), s === u && (a = this, s--); s < u; s++)
                    if (null != (e = arguments[s]))
                        for (t in e) n = a[t], r = e[t], a !== r && (c && r && (oe.isPlainObject(r) || (i = oe.isArray(r))) ? (i ? (i = !1, o = n && oe.isArray(n) ? n : []) : o = n && oe.isPlainObject(n) ? n : {}, a[t] = oe.extend(c, o, r)) : void 0 !== r && (a[t] = r));
                return a
            }, oe.extend({
                expando: "jQuery" + (ie + Math.random()).replace(/\D/g, ""),
                isReady: !0,
                error: function(e) {
                    throw new Error(e)
                },
                noop: function() {},
                isFunction: function(e) {
                    return "function" === oe.type(e)
                },
                isArray: Array.isArray,
                isWindow: function(e) {
                    return null != e && e === e.window
                },
                isNumeric: function(e) {
                    var t = e && e.toString();
                    return !oe.isArray(e) && t - parseFloat(t) + 1 >= 0
                },
                isPlainObject: function(e) {
                    var t;
                    if ("object" !== oe.type(e) || e.nodeType || oe.isWindow(e)) return !1;
                    if (e.constructor && !ne.call(e, "constructor") && !ne.call(e.constructor.prototype || {}, "isPrototypeOf")) return !1;
                    for (t in e);
                    return void 0 === t || ne.call(e, t)
                },
                isEmptyObject: function(e) {
                    var t;
                    for (t in e) return !1;
                    return !0
                },
                type: function(e) {
                    return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? ee[te.call(e)] || "object" : typeof e
                },
                globalEval: function(e) {
                    var t, n = eval;
                    e = oe.trim(e), e && (1 === e.indexOf("use strict") ? (t = Y.createElement("script"), t.text = e, Y.head.appendChild(t).parentNode.removeChild(t)) : n(e))
                },
                camelCase: function(e) {
                    return e.replace(se, "ms-").replace(ue, ce)
                },
                nodeName: function(e, t) {
                    return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
                },
                each: function(e, t) {
                    var r, i = 0;
                    if (n(e))
                        for (r = e.length; i < r && t.call(e[i], i, e[i]) !== !1; i++);
                    else
                        for (i in e)
                            if (t.call(e[i], i, e[i]) === !1) break;
                    return e
                },
                trim: function(e) {
                    return null == e ? "" : (e + "").replace(ae, "")
                },
                makeArray: function(e, t) {
                    var r = t || [];
                    return null != e && (n(Object(e)) ? oe.merge(r, "string" == typeof e ? [e] : e) : K.call(r, e)), r
                },
                inArray: function(e, t, n) {
                    return null == t ? -1 : Z.call(t, e, n)
                },
                merge: function(e, t) {
                    for (var n = +t.length, r = 0, i = e.length; r < n; r++) e[i++] = t[r];
                    return e.length = i, e
                },
                grep: function(e, t, n) {
                    for (var r, i = [], o = 0, a = e.length, s = !n; o < a; o++) r = !t(e[o], o), r !== s && i.push(e[o]);
                    return i
                },
                map: function(e, t, r) {
                    var i, o, a = 0,
                        s = [];
                    if (n(e))
                        for (i = e.length; a < i; a++) o = t(e[a], a, r), null != o && s.push(o);
                    else
                        for (a in e) o = t(e[a], a, r), null != o && s.push(o);
                    return G.apply([], s)
                },
                guid: 1,
                proxy: function(e, t) {
                    var n, r, i;
                    if ("string" == typeof t && (n = e[t], t = e, e = n), oe.isFunction(e)) return r = Q.call(arguments, 2), i = function() {
                        return e.apply(t || this, r.concat(Q.call(arguments)))
                    }, i.guid = e.guid = e.guid || oe.guid++, i
                },
                now: Date.now,
                support: re
            }), "function" == typeof Symbol && (oe.fn[Symbol.iterator] = X[Symbol.iterator]), oe.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(e, t) {
                ee["[object " + t + "]"] = t.toLowerCase()
            });
            var le = function(e) {
                function t(e, t, n, r) {
                    var i, o, a, s, u, c, f, p, h = t && t.ownerDocument,
                        g = t ? t.nodeType : 9;
                    if (n = n || [], "string" != typeof e || !e || 1 !== g && 9 !== g && 11 !== g) return n;
                    if (!r && ((t ? t.ownerDocument || t : F) !== D && O(t), t = t || D, L)) {
                        if (11 !== g && (c = me.exec(e)))
                            if (i = c[1]) {
                                if (9 === g) {
                                    if (!(a = t.getElementById(i))) return n;
                                    if (a.id === i) return n.push(a), n
                                } else if (h && (a = h.getElementById(i)) && q(t, a) && a.id === i) return n.push(a), n
                            } else {
                                if (c[2]) return K.apply(n, t.getElementsByTagName(e)), n;
                                if ((i = c[3]) && w.getElementsByClassName && t.getElementsByClassName) return K.apply(n, t.getElementsByClassName(i)), n
                            }
                        if (w.qsa && !V[e + " "] && (!P || !P.test(e))) {
                            if (1 !== g) h = t, p = e;
                            else if ("object" !== t.nodeName.toLowerCase()) {
                                for ((s = t.getAttribute("id")) ? s = s.replace(be, "\\$&") : t.setAttribute("id", s = B), f = E(e), o = f.length, u = de.test(s) ? "#" + s : "[id='" + s + "']"; o--;) f[o] = u + " " + d(f[o]);
                                p = f.join(","), h = ye.test(e) && l(t.parentNode) || t
                            }
                            if (p) try {
                                return K.apply(n, h.querySelectorAll(p)), n
                            } catch (v) {} finally {
                                s === B && t.removeAttribute("id")
                            }
                        }
                    }
                    return N(e.replace(se, "$1"), t, n, r)
                }

                function n() {
                    function e(n, r) {
                        return t.push(n + " ") > T.cacheLength && delete e[t.shift()], e[n + " "] = r
                    }
                    var t = [];
                    return e
                }

                function r(e) {
                    return e[B] = !0, e
                }

                function i(e) {
                    var t = D.createElement("div");
                    try {
                        return !!e(t)
                    } catch (n) {
                        return !1
                    } finally {
                        t.parentNode && t.parentNode.removeChild(t), t = null
                    }
                }

                function o(e, t) {
                    for (var n = e.split("|"), r = n.length; r--;) T.attrHandle[n[r]] = t
                }

                function a(e, t) {
                    var n = t && e,
                        r = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || J) - (~e.sourceIndex || J);
                    if (r) return r;
                    if (n)
                        for (; n = n.nextSibling;)
                            if (n === t) return -1;
                    return e ? 1 : -1
                }

                function s(e) {
                    return function(t) {
                        var n = t.nodeName.toLowerCase();
                        return "input" === n && t.type === e
                    }
                }

                function u(e) {
                    return function(t) {
                        var n = t.nodeName.toLowerCase();
                        return ("input" === n || "button" === n) && t.type === e
                    }
                }

                function c(e) {
                    return r(function(t) {
                        return t = +t, r(function(n, r) {
                            for (var i, o = e([], n.length, t), a = o.length; a--;) n[i = o[a]] && (n[i] = !(r[i] = n[i]))
                        })
                    })
                }

                function l(e) {
                    return e && "undefined" != typeof e.getElementsByTagName && e
                }

                function f() {}

                function d(e) {
                    for (var t = 0, n = e.length, r = ""; t < n; t++) r += e[t].value;
                    return r
                }

                function p(e, t, n) {
                    var r = t.dir,
                        i = n && "parentNode" === r,
                        o = $++;
                    return t.first ? function(t, n, o) {
                        for (; t = t[r];)
                            if (1 === t.nodeType || i) return e(t, n, o)
                    } : function(t, n, a) {
                        var s, u, c, l = [M, o];
                        if (a) {
                            for (; t = t[r];)
                                if ((1 === t.nodeType || i) && e(t, n, a)) return !0
                        } else
                            for (; t = t[r];)
                                if (1 === t.nodeType || i) {
                                    if (c = t[B] || (t[B] = {}), u = c[t.uniqueID] || (c[t.uniqueID] = {}), (s = u[r]) && s[0] === M && s[1] === o) return l[2] = s[2];
                                    if (u[r] = l, l[2] = e(t, n, a)) return !0
                                }
                    }
                }

                function h(e) {
                    return e.length > 1 ? function(t, n, r) {
                        for (var i = e.length; i--;)
                            if (!e[i](t, n, r)) return !1;
                        return !0
                    } : e[0]
                }

                function g(e, n, r) {
                    for (var i = 0, o = n.length; i < o; i++) t(e, n[i], r);
                    return r
                }

                function v(e, t, n, r, i) {
                    for (var o, a = [], s = 0, u = e.length, c = null != t; s < u; s++)(o = e[s]) && (n && !n(o, r, i) || (a.push(o), c && t.push(s)));
                    return a
                }

                function m(e, t, n, i, o, a) {
                    return i && !i[B] && (i = m(i)), o && !o[B] && (o = m(o, a)), r(function(r, a, s, u) {
                        var c, l, f, d = [],
                            p = [],
                            h = a.length,
                            m = r || g(t || "*", s.nodeType ? [s] : s, []),
                            y = !e || !r && t ? m : v(m, d, e, s, u),
                            b = n ? o || (r ? e : h || i) ? [] : a : y;
                        if (n && n(y, b, s, u), i)
                            for (c = v(b, p), i(c, [], s, u), l = c.length; l--;)(f = c[l]) && (b[p[l]] = !(y[p[l]] = f));
                        if (r) {
                            if (o || e) {
                                if (o) {
                                    for (c = [], l = b.length; l--;)(f = b[l]) && c.push(y[l] = f);
                                    o(null, b = [], c, u)
                                }
                                for (l = b.length; l--;)(f = b[l]) && (c = o ? ee(r, f) : d[l]) > -1 && (r[c] = !(a[c] = f))
                            }
                        } else b = v(b === a ? b.splice(h, b.length) : b), o ? o(null, a, b, u) : K.apply(a, b)
                    })
                }

                function y(e) {
                    for (var t, n, r, i = e.length, o = T.relative[e[0].type], a = o || T.relative[" "], s = o ? 1 : 0, u = p(function(e) {
                            return e === t
                        }, a, !0), c = p(function(e) {
                            return ee(t, e) > -1
                        }, a, !0), l = [function(e, n, r) {
                            var i = !o && (r || n !== j) || ((t = n).nodeType ? u(e, n, r) : c(e, n, r));
                            return t = null, i
                        }]; s < i; s++)
                        if (n = T.relative[e[s].type]) l = [p(h(l), n)];
                        else {
                            if (n = T.filter[e[s].type].apply(null, e[s].matches), n[B]) {
                                for (r = ++s; r < i && !T.relative[e[r].type]; r++);
                                return m(s > 1 && h(l), s > 1 && d(e.slice(0, s - 1).concat({
                                    value: " " === e[s - 2].type ? "*" : ""
                                })).replace(se, "$1"), n, s < r && y(e.slice(s, r)), r < i && y(e = e.slice(r)), r < i && d(e))
                            }
                            l.push(n)
                        }
                    return h(l)
                }

                function b(e, n) {
                    var i = n.length > 0,
                        o = e.length > 0,
                        a = function(r, a, s, u, c) {
                            var l, f, d, p = 0,
                                h = "0",
                                g = r && [],
                                m = [],
                                y = j,
                                b = r || o && T.find.TAG("*", c),
                                x = M += null == y ? 1 : Math.random() || .1,
                                w = b.length;
                            for (c && (j = a === D || a || c); h !== w && null != (l = b[h]); h++) {
                                if (o && l) {
                                    for (f = 0, a || l.ownerDocument === D || (O(l), s = !L); d = e[f++];)
                                        if (d(l, a || D, s)) {
                                            u.push(l);
                                            break
                                        }
                                    c && (M = x)
                                }
                                i && ((l = !d && l) && p--, r && g.push(l))
                            }
                            if (p += h, i && h !== p) {
                                for (f = 0; d = n[f++];) d(g, m, a, s);
                                if (r) {
                                    if (p > 0)
                                        for (; h--;) g[h] || m[h] || (m[h] = Q.call(u));
                                    m = v(m)
                                }
                                K.apply(u, m), c && !r && m.length > 0 && p + n.length > 1 && t.uniqueSort(u)
                            }
                            return c && (M = x, j = y), g
                        };
                    return i ? r(a) : a
                }
                var x, w, T, S, C, E, k, N, j, I, A, O, D, H, L, P, R, _, q, B = "sizzle" + 1 * new Date,
                    F = e.document,
                    M = 0,
                    $ = 0,
                    U = n(),
                    W = n(),
                    V = n(),
                    z = function(e, t) {
                        return e === t && (A = !0), 0
                    },
                    J = 1 << 31,
                    X = {}.hasOwnProperty,
                    Y = [],
                    Q = Y.pop,
                    G = Y.push,
                    K = Y.push,
                    Z = Y.slice,
                    ee = function(e, t) {
                        for (var n = 0, r = e.length; n < r; n++)
                            if (e[n] === t) return n;
                        return -1
                    },
                    te = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                    ne = "[\\x20\\t\\r\\n\\f]",
                    re = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                    ie = "\\[" + ne + "*(" + re + ")(?:" + ne + "*([*^$|!~]?=)" + ne + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + re + "))|)" + ne + "*\\]",
                    oe = ":(" + re + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + ie + ")*)|.*)\\)|)",
                    ae = new RegExp(ne + "+", "g"),
                    se = new RegExp("^" + ne + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ne + "+$", "g"),
                    ue = new RegExp("^" + ne + "*," + ne + "*"),
                    ce = new RegExp("^" + ne + "*([>+~]|" + ne + ")" + ne + "*"),
                    le = new RegExp("=" + ne + "*([^\\]'\"]*?)" + ne + "*\\]", "g"),
                    fe = new RegExp(oe),
                    de = new RegExp("^" + re + "$"),
                    pe = {
                        ID: new RegExp("^#(" + re + ")"),
                        CLASS: new RegExp("^\\.(" + re + ")"),
                        TAG: new RegExp("^(" + re + "|[*])"),
                        ATTR: new RegExp("^" + ie),
                        PSEUDO: new RegExp("^" + oe),
                        CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ne + "*(even|odd|(([+-]|)(\\d*)n|)" + ne + "*(?:([+-]|)" + ne + "*(\\d+)|))" + ne + "*\\)|)", "i"),
                        bool: new RegExp("^(?:" + te + ")$", "i"),
                        needsContext: new RegExp("^" + ne + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ne + "*((?:-\\d)?\\d*)" + ne + "*\\)|)(?=[^-]|$)", "i")
                    },
                    he = /^(?:input|select|textarea|button)$/i,
                    ge = /^h\d$/i,
                    ve = /^[^{]+\{\s*\[native \w/,
                    me = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                    ye = /[+~]/,
                    be = /'|\\/g,
                    xe = new RegExp("\\\\([\\da-f]{1,6}" + ne + "?|(" + ne + ")|.)", "ig"),
                    we = function(e, t, n) {
                        var r = "0x" + t - 65536;
                        return r !== r || n ? t : r < 0 ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320)
                    },
                    Te = function() {
                        O()
                    };
                try {
                    K.apply(Y = Z.call(F.childNodes), F.childNodes), Y[F.childNodes.length].nodeType
                } catch (Se) {
                    K = {
                        apply: Y.length ? function(e, t) {
                            G.apply(e, Z.call(t))
                        } : function(e, t) {
                            for (var n = e.length, r = 0; e[n++] = t[r++];);
                            e.length = n - 1
                        }
                    }
                }
                w = t.support = {}, C = t.isXML = function(e) {
                    var t = e && (e.ownerDocument || e).documentElement;
                    return !!t && "HTML" !== t.nodeName
                }, O = t.setDocument = function(e) {
                    var t, n, r = e ? e.ownerDocument || e : F;
                    return r !== D && 9 === r.nodeType && r.documentElement ? (D = r, H = D.documentElement, L = !C(D), (n = D.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", Te, !1) : n.attachEvent && n.attachEvent("onunload", Te)), w.attributes = i(function(e) {
                        return e.className = "i", !e.getAttribute("className")
                    }), w.getElementsByTagName = i(function(e) {
                        return e.appendChild(D.createComment("")), !e.getElementsByTagName("*").length
                    }), w.getElementsByClassName = ve.test(D.getElementsByClassName), w.getById = i(function(e) {
                        return H.appendChild(e).id = B, !D.getElementsByName || !D.getElementsByName(B).length
                    }), w.getById ? (T.find.ID = function(e, t) {
                        if ("undefined" != typeof t.getElementById && L) {
                            var n = t.getElementById(e);
                            return n ? [n] : []
                        }
                    }, T.filter.ID = function(e) {
                        var t = e.replace(xe, we);
                        return function(e) {
                            return e.getAttribute("id") === t
                        }
                    }) : (delete T.find.ID, T.filter.ID = function(e) {
                        var t = e.replace(xe, we);
                        return function(e) {
                            var n = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
                            return n && n.value === t
                        }
                    }), T.find.TAG = w.getElementsByTagName ? function(e, t) {
                        return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : w.qsa ? t.querySelectorAll(e) : void 0
                    } : function(e, t) {
                        var n, r = [],
                            i = 0,
                            o = t.getElementsByTagName(e);
                        if ("*" === e) {
                            for (; n = o[i++];) 1 === n.nodeType && r.push(n);
                            return r
                        }
                        return o
                    }, T.find.CLASS = w.getElementsByClassName && function(e, t) {
                        if ("undefined" != typeof t.getElementsByClassName && L) return t.getElementsByClassName(e)
                    }, R = [], P = [], (w.qsa = ve.test(D.querySelectorAll)) && (i(function(e) {
                        H.appendChild(e).innerHTML = "<a id='" + B + "'></a><select id='" + B + "-\r\\' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && P.push("[*^$]=" + ne + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || P.push("\\[" + ne + "*(?:value|" + te + ")"), e.querySelectorAll("[id~=" + B + "-]").length || P.push("~="), e.querySelectorAll(":checked").length || P.push(":checked"), e.querySelectorAll("a#" + B + "+*").length || P.push(".#.+[+~]")
                    }), i(function(e) {
                        var t = D.createElement("input");
                        t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && P.push("name" + ne + "*[*^$|!~]?="), e.querySelectorAll(":enabled").length || P.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), P.push(",.*:")
                    })), (w.matchesSelector = ve.test(_ = H.matches || H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector)) && i(function(e) {
                        w.disconnectedMatch = _.call(e, "div"), _.call(e, "[s!='']:x"), R.push("!=", oe)
                    }), P = P.length && new RegExp(P.join("|")), R = R.length && new RegExp(R.join("|")), t = ve.test(H.compareDocumentPosition), q = t || ve.test(H.contains) ? function(e, t) {
                        var n = 9 === e.nodeType ? e.documentElement : e,
                            r = t && t.parentNode;
                        return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
                    } : function(e, t) {
                        if (t)
                            for (; t = t.parentNode;)
                                if (t === e) return !0;
                        return !1
                    }, z = t ? function(e, t) {
                        if (e === t) return A = !0, 0;
                        var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                        return n ? n : (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1, 1 & n || !w.sortDetached && t.compareDocumentPosition(e) === n ? e === D || e.ownerDocument === F && q(F, e) ? -1 : t === D || t.ownerDocument === F && q(F, t) ? 1 : I ? ee(I, e) - ee(I, t) : 0 : 4 & n ? -1 : 1)
                    } : function(e, t) {
                        if (e === t) return A = !0, 0;
                        var n, r = 0,
                            i = e.parentNode,
                            o = t.parentNode,
                            s = [e],
                            u = [t];
                        if (!i || !o) return e === D ? -1 : t === D ? 1 : i ? -1 : o ? 1 : I ? ee(I, e) - ee(I, t) : 0;
                        if (i === o) return a(e, t);
                        for (n = e; n = n.parentNode;) s.unshift(n);
                        for (n = t; n = n.parentNode;) u.unshift(n);
                        for (; s[r] === u[r];) r++;
                        return r ? a(s[r], u[r]) : s[r] === F ? -1 : u[r] === F ? 1 : 0
                    }, D) : D
                }, t.matches = function(e, n) {
                    return t(e, null, null, n)
                }, t.matchesSelector = function(e, n) {
                    if ((e.ownerDocument || e) !== D && O(e), n = n.replace(le, "='$1']"), w.matchesSelector && L && !V[n + " "] && (!R || !R.test(n)) && (!P || !P.test(n))) try {
                        var r = _.call(e, n);
                        if (r || w.disconnectedMatch || e.document && 11 !== e.document.nodeType) return r
                    } catch (i) {}
                    return t(n, D, null, [e]).length > 0
                }, t.contains = function(e, t) {
                    return (e.ownerDocument || e) !== D && O(e), q(e, t)
                }, t.attr = function(e, t) {
                    (e.ownerDocument || e) !== D && O(e);
                    var n = T.attrHandle[t.toLowerCase()],
                        r = n && X.call(T.attrHandle, t.toLowerCase()) ? n(e, t, !L) : void 0;
                    return void 0 !== r ? r : w.attributes || !L ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
                }, t.error = function(e) {
                    throw new Error("Syntax error, unrecognized expression: " + e)
                }, t.uniqueSort = function(e) {
                    var t, n = [],
                        r = 0,
                        i = 0;
                    if (A = !w.detectDuplicates, I = !w.sortStable && e.slice(0), e.sort(z), A) {
                        for (; t = e[i++];) t === e[i] && (r = n.push(i));
                        for (; r--;) e.splice(n[r], 1)
                    }
                    return I = null, e
                }, S = t.getText = function(e) {
                    var t, n = "",
                        r = 0,
                        i = e.nodeType;
                    if (i) {
                        if (1 === i || 9 === i || 11 === i) {
                            if ("string" == typeof e.textContent) return e.textContent;
                            for (e = e.firstChild; e; e = e.nextSibling) n += S(e)
                        } else if (3 === i || 4 === i) return e.nodeValue
                    } else
                        for (; t = e[r++];) n += S(t);
                    return n
                }, T = t.selectors = {
                    cacheLength: 50,
                    createPseudo: r,
                    match: pe,
                    attrHandle: {},
                    find: {},
                    relative: {
                        ">": {
                            dir: "parentNode",
                            first: !0
                        },
                        " ": {
                            dir: "parentNode"
                        },
                        "+": {
                            dir: "previousSibling",
                            first: !0
                        },
                        "~": {
                            dir: "previousSibling"
                        }
                    },
                    preFilter: {
                        ATTR: function(e) {
                            return e[1] = e[1].replace(xe, we), e[3] = (e[3] || e[4] || e[5] || "").replace(xe, we), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                        },
                        CHILD: function(e) {
                            return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
                        },
                        PSEUDO: function(e) {
                            var t, n = !e[6] && e[2];
                            return pe.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && fe.test(n) && (t = E(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                        }
                    },
                    filter: {
                        TAG: function(e) {
                            var t = e.replace(xe, we).toLowerCase();
                            return "*" === e ? function() {
                                return !0
                            } : function(e) {
                                return e.nodeName && e.nodeName.toLowerCase() === t
                            }
                        },
                        CLASS: function(e) {
                            var t = U[e + " "];
                            return t || (t = new RegExp("(^|" + ne + ")" + e + "(" + ne + "|$)")) && U(e, function(e) {
                                return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
                            })
                        },
                        ATTR: function(e, n, r) {
                            return function(i) {
                                var o = t.attr(i, e);
                                return null == o ? "!=" === n : !n || (o += "", "=" === n ? o === r : "!=" === n ? o !== r : "^=" === n ? r && 0 === o.indexOf(r) : "*=" === n ? r && o.indexOf(r) > -1 : "$=" === n ? r && o.slice(-r.length) === r : "~=" === n ? (" " + o.replace(ae, " ") + " ").indexOf(r) > -1 : "|=" === n && (o === r || o.slice(0, r.length + 1) === r + "-"))
                            }
                        },
                        CHILD: function(e, t, n, r, i) {
                            var o = "nth" !== e.slice(0, 3),
                                a = "last" !== e.slice(-4),
                                s = "of-type" === t;
                            return 1 === r && 0 === i ? function(e) {
                                return !!e.parentNode
                            } : function(t, n, u) {
                                var c, l, f, d, p, h, g = o !== a ? "nextSibling" : "previousSibling",
                                    v = t.parentNode,
                                    m = s && t.nodeName.toLowerCase(),
                                    y = !u && !s,
                                    b = !1;
                                if (v) {
                                    if (o) {
                                        for (; g;) {
                                            for (d = t; d = d[g];)
                                                if (s ? d.nodeName.toLowerCase() === m : 1 === d.nodeType) return !1;
                                            h = g = "only" === e && !h && "nextSibling"
                                        }
                                        return !0
                                    }
                                    if (h = [a ? v.firstChild : v.lastChild], a && y) {
                                        for (d = v, f = d[B] || (d[B] = {}), l = f[d.uniqueID] || (f[d.uniqueID] = {}), c = l[e] || [], p = c[0] === M && c[1], b = p && c[2], d = p && v.childNodes[p]; d = ++p && d && d[g] || (b = p = 0) || h.pop();)
                                            if (1 === d.nodeType && ++b && d === t) {
                                                l[e] = [M, p, b];
                                                break
                                            }
                                    } else if (y && (d = t, f = d[B] || (d[B] = {}), l = f[d.uniqueID] || (f[d.uniqueID] = {}), c = l[e] || [], p = c[0] === M && c[1], b = p), b === !1)
                                        for (;
                                            (d = ++p && d && d[g] || (b = p = 0) || h.pop()) && ((s ? d.nodeName.toLowerCase() !== m : 1 !== d.nodeType) || !++b || (y && (f = d[B] || (d[B] = {}), l = f[d.uniqueID] || (f[d.uniqueID] = {}), l[e] = [M, b]), d !== t)););
                                    return b -= i, b === r || b % r === 0 && b / r >= 0
                                }
                            }
                        },
                        PSEUDO: function(e, n) {
                            var i, o = T.pseudos[e] || T.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                            return o[B] ? o(n) : o.length > 1 ? (i = [e, e, "", n], T.setFilters.hasOwnProperty(e.toLowerCase()) ? r(function(e, t) {
                                for (var r, i = o(e, n), a = i.length; a--;) r = ee(e, i[a]), e[r] = !(t[r] = i[a])
                            }) : function(e) {
                                return o(e, 0, i)
                            }) : o
                        }
                    },
                    pseudos: {
                        not: r(function(e) {
                            var t = [],
                                n = [],
                                i = k(e.replace(se, "$1"));
                            return i[B] ? r(function(e, t, n, r) {
                                for (var o, a = i(e, null, r, []), s = e.length; s--;)(o = a[s]) && (e[s] = !(t[s] = o))
                            }) : function(e, r, o) {
                                return t[0] = e, i(t, null, o, n), t[0] = null, !n.pop()
                            }
                        }),
                        has: r(function(e) {
                            return function(n) {
                                return t(e, n).length > 0
                            }
                        }),
                        contains: r(function(e) {
                            return e = e.replace(xe, we),
                                function(t) {
                                    return (t.textContent || t.innerText || S(t)).indexOf(e) > -1
                                }
                        }),
                        lang: r(function(e) {
                            return de.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(xe, we).toLowerCase(),
                                function(t) {
                                    var n;
                                    do
                                        if (n = L ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + "-"); while ((t = t.parentNode) && 1 === t.nodeType);
                                    return !1
                                }
                        }),
                        target: function(t) {
                            var n = e.location && e.location.hash;
                            return n && n.slice(1) === t.id
                        },
                        root: function(e) {
                            return e === H
                        },
                        focus: function(e) {
                            return e === D.activeElement && (!D.hasFocus || D.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                        },
                        enabled: function(e) {
                            return e.disabled === !1
                        },
                        disabled: function(e) {
                            return e.disabled === !0
                        },
                        checked: function(e) {
                            var t = e.nodeName.toLowerCase();
                            return "input" === t && !!e.checked || "option" === t && !!e.selected
                        },
                        selected: function(e) {
                            return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                        },
                        empty: function(e) {
                            for (e = e.firstChild; e; e = e.nextSibling)
                                if (e.nodeType < 6) return !1;
                            return !0
                        },
                        parent: function(e) {
                            return !T.pseudos.empty(e)
                        },
                        header: function(e) {
                            return ge.test(e.nodeName)
                        },
                        input: function(e) {
                            return he.test(e.nodeName)
                        },
                        button: function(e) {
                            var t = e.nodeName.toLowerCase();
                            return "input" === t && "button" === e.type || "button" === t
                        },
                        text: function(e) {
                            var t;
                            return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                        },
                        first: c(function() {
                            return [0]
                        }),
                        last: c(function(e, t) {
                            return [t - 1]
                        }),
                        eq: c(function(e, t, n) {
                            return [n < 0 ? n + t : n]
                        }),
                        even: c(function(e, t) {
                            for (var n = 0; n < t; n += 2) e.push(n);
                            return e
                        }),
                        odd: c(function(e, t) {
                            for (var n = 1; n < t; n += 2) e.push(n);
                            return e
                        }),
                        lt: c(function(e, t, n) {
                            for (var r = n < 0 ? n + t : n; --r >= 0;) e.push(r);
                            return e
                        }),
                        gt: c(function(e, t, n) {
                            for (var r = n < 0 ? n + t : n; ++r < t;) e.push(r);
                            return e
                        })
                    }
                }, T.pseudos.nth = T.pseudos.eq;
                for (x in {
                        radio: !0,
                        checkbox: !0,
                        file: !0,
                        password: !0,
                        image: !0
                    }) T.pseudos[x] = s(x);
                for (x in {
                        submit: !0,
                        reset: !0
                    }) T.pseudos[x] = u(x);
                return f.prototype = T.filters = T.pseudos, T.setFilters = new f, E = t.tokenize = function(e, n) {
                    var r, i, o, a, s, u, c, l = W[e + " "];
                    if (l) return n ? 0 : l.slice(0);
                    for (s = e, u = [], c = T.preFilter; s;) {
                        r && !(i = ue.exec(s)) || (i && (s = s.slice(i[0].length) || s), u.push(o = [])), r = !1, (i = ce.exec(s)) && (r = i.shift(), o.push({
                            value: r,
                            type: i[0].replace(se, " ")
                        }), s = s.slice(r.length));
                        for (a in T.filter) !(i = pe[a].exec(s)) || c[a] && !(i = c[a](i)) || (r = i.shift(), o.push({
                            value: r,
                            type: a,
                            matches: i
                        }), s = s.slice(r.length));
                        if (!r) break
                    }
                    return n ? s.length : s ? t.error(e) : W(e, u).slice(0)
                }, k = t.compile = function(e, t) {
                    var n, r = [],
                        i = [],
                        o = V[e + " "];
                    if (!o) {
                        for (t || (t = E(e)), n = t.length; n--;) o = y(t[n]), o[B] ? r.push(o) : i.push(o);
                        o = V(e, b(i, r)), o.selector = e
                    }
                    return o
                }, N = t.select = function(e, t, n, r) {
                    var i, o, a, s, u, c = "function" == typeof e && e,
                        f = !r && E(e = c.selector || e);
                    if (n = n || [], 1 === f.length) {
                        if (o = f[0] = f[0].slice(0), o.length > 2 && "ID" === (a = o[0]).type && w.getById && 9 === t.nodeType && L && T.relative[o[1].type]) {
                            if (t = (T.find.ID(a.matches[0].replace(xe, we), t) || [])[0], !t) return n;
                            c && (t = t.parentNode), e = e.slice(o.shift().value.length)
                        }
                        for (i = pe.needsContext.test(e) ? 0 : o.length; i-- && (a = o[i], !T.relative[s = a.type]);)
                            if ((u = T.find[s]) && (r = u(a.matches[0].replace(xe, we), ye.test(o[0].type) && l(t.parentNode) || t))) {
                                if (o.splice(i, 1), e = r.length && d(o), !e) return K.apply(n, r), n;
                                break
                            }
                    }
                    return (c || k(e, f))(r, t, !L, n, !t || ye.test(e) && l(t.parentNode) || t), n
                }, w.sortStable = B.split("").sort(z).join("") === B, w.detectDuplicates = !!A, O(), w.sortDetached = i(function(e) {
                    return 1 & e.compareDocumentPosition(D.createElement("div"))
                }), i(function(e) {
                    return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
                }) || o("type|href|height|width", function(e, t, n) {
                    if (!n) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
                }), w.attributes && i(function(e) {
                    return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
                }) || o("value", function(e, t, n) {
                    if (!n && "input" === e.nodeName.toLowerCase()) return e.defaultValue
                }), i(function(e) {
                    return null == e.getAttribute("disabled")
                }) || o(te, function(e, t, n) {
                    var r;
                    if (!n) return e[t] === !0 ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
                }), t
            }(e);
            oe.find = le, oe.expr = le.selectors, oe.expr[":"] = oe.expr.pseudos, oe.uniqueSort = oe.unique = le.uniqueSort, oe.text = le.getText, oe.isXMLDoc = le.isXML, oe.contains = le.contains;
            var fe = function(e, t, n) {
                    for (var r = [], i = void 0 !== n;
                        (e = e[t]) && 9 !== e.nodeType;)
                        if (1 === e.nodeType) {
                            if (i && oe(e).is(n)) break;
                            r.push(e)
                        }
                    return r
                },
                de = function(e, t) {
                    for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
                    return n
                },
                pe = oe.expr.match.needsContext,
                he = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,
                ge = /^.[^:#\[\.,]*$/;
            oe.filter = function(e, t, n) {
                var r = t[0];
                return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === r.nodeType ? oe.find.matchesSelector(r, e) ? [r] : [] : oe.find.matches(e, oe.grep(t, function(e) {
                    return 1 === e.nodeType
                }))
            }, oe.fn.extend({
                find: function(e) {
                    var t, n = this.length,
                        r = [],
                        i = this;
                    if ("string" != typeof e) return this.pushStack(oe(e).filter(function() {
                        for (t = 0; t < n; t++)
                            if (oe.contains(i[t], this)) return !0
                    }));
                    for (t = 0; t < n; t++) oe.find(e, i[t], r);
                    return r = this.pushStack(n > 1 ? oe.unique(r) : r), r.selector = this.selector ? this.selector + " " + e : e, r
                },
                filter: function(e) {
                    return this.pushStack(r(this, e || [], !1))
                },
                not: function(e) {
                    return this.pushStack(r(this, e || [], !0))
                },
                is: function(e) {
                    return !!r(this, "string" == typeof e && pe.test(e) ? oe(e) : e || [], !1).length
                }
            });
            var ve, me = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
                ye = oe.fn.init = function(e, t, n) {
                    var r, i;
                    if (!e) return this;
                    if (n = n || ve, "string" == typeof e) {
                        if (r = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : me.exec(e), !r || !r[1] && t) return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
                        if (r[1]) {
                            if (t = t instanceof oe ? t[0] : t, oe.merge(this, oe.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : Y, !0)), he.test(r[1]) && oe.isPlainObject(t))
                                for (r in t) oe.isFunction(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
                            return this
                        }
                        return i = Y.getElementById(r[2]), i && i.parentNode && (this.length = 1, this[0] = i), this.context = Y, this.selector = e, this
                    }
                    return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : oe.isFunction(e) ? void 0 !== n.ready ? n.ready(e) : e(oe) : (void 0 !== e.selector && (this.selector = e.selector, this.context = e.context), oe.makeArray(e, this))
                };
            ye.prototype = oe.fn, ve = oe(Y);
            var be = /^(?:parents|prev(?:Until|All))/,
                xe = {
                    children: !0,
                    contents: !0,
                    next: !0,
                    prev: !0
                };
            oe.fn.extend({
                has: function(e) {
                    var t = oe(e, this),
                        n = t.length;
                    return this.filter(function() {
                        for (var e = 0; e < n; e++)
                            if (oe.contains(this, t[e])) return !0
                    })
                },
                closest: function(e, t) {
                    for (var n, r = 0, i = this.length, o = [], a = pe.test(e) || "string" != typeof e ? oe(e, t || this.context) : 0; r < i; r++)
                        for (n = this[r]; n && n !== t; n = n.parentNode)
                            if (n.nodeType < 11 && (a ? a.index(n) > -1 : 1 === n.nodeType && oe.find.matchesSelector(n, e))) {
                                o.push(n);
                                break
                            }
                    return this.pushStack(o.length > 1 ? oe.uniqueSort(o) : o)
                },
                index: function(e) {
                    return e ? "string" == typeof e ? Z.call(oe(e), this[0]) : Z.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
                },
                add: function(e, t) {
                    return this.pushStack(oe.uniqueSort(oe.merge(this.get(), oe(e, t))))
                },
                addBack: function(e) {
                    return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
                }
            }), oe.each({
                parent: function(e) {
                    var t = e.parentNode;
                    return t && 11 !== t.nodeType ? t : null
                },
                parents: function(e) {
                    return fe(e, "parentNode")
                },
                parentsUntil: function(e, t, n) {
                    return fe(e, "parentNode", n)
                },
                next: function(e) {
                    return i(e, "nextSibling")
                },
                prev: function(e) {
                    return i(e, "previousSibling")
                },
                nextAll: function(e) {
                    return fe(e, "nextSibling")
                },
                prevAll: function(e) {
                    return fe(e, "previousSibling")
                },
                nextUntil: function(e, t, n) {
                    return fe(e, "nextSibling", n)
                },
                prevUntil: function(e, t, n) {
                    return fe(e, "previousSibling", n)
                },
                siblings: function(e) {
                    return de((e.parentNode || {}).firstChild, e)
                },
                children: function(e) {
                    return de(e.firstChild)
                },
                contents: function(e) {
                    return e.contentDocument || oe.merge([], e.childNodes)
                }
            }, function(e, t) {
                oe.fn[e] = function(n, r) {
                    var i = oe.map(this, t, n);
                    return "Until" !== e.slice(-5) && (r = n), r && "string" == typeof r && (i = oe.filter(r, i)), this.length > 1 && (xe[e] || oe.uniqueSort(i), be.test(e) && i.reverse()), this.pushStack(i)
                }
            });
            var we = /\S+/g;
            oe.Callbacks = function(e) {
                e = "string" == typeof e ? o(e) : oe.extend({}, e);
                var t, n, r, i, a = [],
                    s = [],
                    u = -1,
                    c = function() {
                        for (i = e.once, r = t = !0; s.length; u = -1)
                            for (n = s.shift(); ++u < a.length;) a[u].apply(n[0], n[1]) === !1 && e.stopOnFalse && (u = a.length, n = !1);
                        e.memory || (n = !1), t = !1, i && (a = n ? [] : "")
                    },
                    l = {
                        add: function() {
                            return a && (n && !t && (u = a.length - 1, s.push(n)), function r(t) {
                                oe.each(t, function(t, n) {
                                    oe.isFunction(n) ? e.unique && l.has(n) || a.push(n) : n && n.length && "string" !== oe.type(n) && r(n)
                                })
                            }(arguments), n && !t && c()), this
                        },
                        remove: function() {
                            return oe.each(arguments, function(e, t) {
                                for (var n;
                                    (n = oe.inArray(t, a, n)) > -1;) a.splice(n, 1), n <= u && u--
                            }), this
                        },
                        has: function(e) {
                            return e ? oe.inArray(e, a) > -1 : a.length > 0
                        },
                        empty: function() {
                            return a && (a = []), this
                        },
                        disable: function() {
                            return i = s = [], a = n = "", this
                        },
                        disabled: function() {
                            return !a
                        },
                        lock: function() {
                            return i = s = [], n || (a = n = ""), this
                        },
                        locked: function() {
                            return !!i
                        },
                        fireWith: function(e, n) {
                            return i || (n = n || [], n = [e, n.slice ? n.slice() : n], s.push(n), t || c()), this
                        },
                        fire: function() {
                            return l.fireWith(this, arguments), this
                        },
                        fired: function() {
                            return !!r
                        }
                    };
                return l
            }, oe.extend({
                Deferred: function(e) {
                    var t = [
                            ["resolve", "done", oe.Callbacks("once memory"), "resolved"],
                            ["reject", "fail", oe.Callbacks("once memory"), "rejected"],
                            ["notify", "progress", oe.Callbacks("memory")]
                        ],
                        n = "pending",
                        r = {
                            state: function() {
                                return n
                            },
                            always: function() {
                                return i.done(arguments).fail(arguments), this
                            },
                            then: function() {
                                var e = arguments;
                                return oe.Deferred(function(n) {
                                    oe.each(t, function(t, o) {
                                        var a = oe.isFunction(e[t]) && e[t];
                                        i[o[1]](function() {
                                            var e = a && a.apply(this, arguments);
                                            e && oe.isFunction(e.promise) ? e.promise().progress(n.notify).done(n.resolve).fail(n.reject) : n[o[0] + "With"](this === r ? n.promise() : this, a ? [e] : arguments)
                                        })
                                    }), e = null
                                }).promise()
                            },
                            promise: function(e) {
                                return null != e ? oe.extend(e, r) : r
                            }
                        },
                        i = {};
                    return r.pipe = r.then, oe.each(t, function(e, o) {
                        var a = o[2],
                            s = o[3];
                        r[o[1]] = a.add, s && a.add(function() {
                            n = s
                        }, t[1 ^ e][2].disable, t[2][2].lock), i[o[0]] = function() {
                            return i[o[0] + "With"](this === i ? r : this, arguments), this
                        }, i[o[0] + "With"] = a.fireWith
                    }), r.promise(i), e && e.call(i, i), i
                },
                when: function(e) {
                    var t, n, r, i = 0,
                        o = Q.call(arguments),
                        a = o.length,
                        s = 1 !== a || e && oe.isFunction(e.promise) ? a : 0,
                        u = 1 === s ? e : oe.Deferred(),
                        c = function(e, n, r) {
                            return function(i) {
                                n[e] = this, r[e] = arguments.length > 1 ? Q.call(arguments) : i, r === t ? u.notifyWith(n, r) : --s || u.resolveWith(n, r)
                            }
                        };
                    if (a > 1)
                        for (t = new Array(a), n = new Array(a), r = new Array(a); i < a; i++) o[i] && oe.isFunction(o[i].promise) ? o[i].promise().progress(c(i, n, t)).done(c(i, r, o)).fail(u.reject) : --s;
                    return s || u.resolveWith(r, o), u.promise()
                }
            });
            var Te;
            oe.fn.ready = function(e) {
                return oe.ready.promise().done(e), this
            }, oe.extend({
                isReady: !1,
                readyWait: 1,
                holdReady: function(e) {
                    e ? oe.readyWait++ : oe.ready(!0)
                },
                ready: function(e) {
                    (e === !0 ? --oe.readyWait : oe.isReady) || (oe.isReady = !0, e !== !0 && --oe.readyWait > 0 || (Te.resolveWith(Y, [oe]), oe.fn.triggerHandler && (oe(Y).triggerHandler("ready"), oe(Y).off("ready"))))
                }
            }), oe.ready.promise = function(t) {
                return Te || (Te = oe.Deferred(), "complete" === Y.readyState || "loading" !== Y.readyState && !Y.documentElement.doScroll ? e.setTimeout(oe.ready) : (Y.addEventListener("DOMContentLoaded", a), e.addEventListener("load", a))), Te.promise(t)
            }, oe.ready.promise();
            var Se = function(e, t, n, r, i, o, a) {
                    var s = 0,
                        u = e.length,
                        c = null == n;
                    if ("object" === oe.type(n)) {
                        i = !0;
                        for (s in n) Se(e, t, s, n[s], !0, o, a)
                    } else if (void 0 !== r && (i = !0, oe.isFunction(r) || (a = !0), c && (a ? (t.call(e, r), t = null) : (c = t, t = function(e, t, n) {
                            return c.call(oe(e), n)
                        })), t))
                        for (; s < u; s++) t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
                    return i ? e : c ? t.call(e) : u ? t(e[0], n) : o
                },
                Ce = function(e) {
                    return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
                };
            s.uid = 1, s.prototype = {
                register: function(e, t) {
                    var n = t || {};
                    return e.nodeType ? e[this.expando] = n : Object.defineProperty(e, this.expando, {
                        value: n,
                        writable: !0,
                        configurable: !0
                    }), e[this.expando]
                },
                cache: function(e) {
                    if (!Ce(e)) return {};
                    var t = e[this.expando];
                    return t || (t = {}, Ce(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                        value: t,
                        configurable: !0
                    }))), t
                },
                set: function(e, t, n) {
                    var r, i = this.cache(e);
                    if ("string" == typeof t) i[t] = n;
                    else
                        for (r in t) i[r] = t[r];
                    return i
                },
                get: function(e, t) {
                    return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][t]
                },
                access: function(e, t, n) {
                    var r;
                    return void 0 === t || t && "string" == typeof t && void 0 === n ? (r = this.get(e, t), void 0 !== r ? r : this.get(e, oe.camelCase(t))) : (this.set(e, t, n), void 0 !== n ? n : t)
                },
                remove: function(e, t) {
                    var n, r, i, o = e[this.expando];
                    if (void 0 !== o) {
                        if (void 0 === t) this.register(e);
                        else {
                            oe.isArray(t) ? r = t.concat(t.map(oe.camelCase)) : (i = oe.camelCase(t), t in o ? r = [t, i] : (r = i, r = r in o ? [r] : r.match(we) || [])), n = r.length;
                            for (; n--;) delete o[r[n]]
                        }(void 0 === t || oe.isEmptyObject(o)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando])
                    }
                },
                hasData: function(e) {
                    var t = e[this.expando];
                    return void 0 !== t && !oe.isEmptyObject(t)
                }
            };
            var Ee = new s,
                ke = new s,
                Ne = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
                je = /[A-Z]/g;
            oe.extend({
                hasData: function(e) {
                    return ke.hasData(e) || Ee.hasData(e)
                },
                data: function(e, t, n) {
                    return ke.access(e, t, n)
                },
                removeData: function(e, t) {
                    ke.remove(e, t)
                },
                _data: function(e, t, n) {
                    return Ee.access(e, t, n)
                },
                _removeData: function(e, t) {
                    Ee.remove(e, t)
                }
            }), oe.fn.extend({
                data: function(e, t) {
                    var n, r, i, o = this[0],
                        a = o && o.attributes;
                    if (void 0 === e) {
                        if (this.length && (i = ke.get(o), 1 === o.nodeType && !Ee.get(o, "hasDataAttrs"))) {
                            for (n = a.length; n--;) a[n] && (r = a[n].name, 0 === r.indexOf("data-") && (r = oe.camelCase(r.slice(5)), u(o, r, i[r])));
                            Ee.set(o, "hasDataAttrs", !0)
                        }
                        return i
                    }
                    return "object" == typeof e ? this.each(function() {
                        ke.set(this, e)
                    }) : Se(this, function(t) {
                        var n, r;
                        if (o && void 0 === t) {
                            if (n = ke.get(o, e) || ke.get(o, e.replace(je, "-$&").toLowerCase()), void 0 !== n) return n;
                            if (r = oe.camelCase(e), n = ke.get(o, r), void 0 !== n) return n;
                            if (n = u(o, r, void 0), void 0 !== n) return n
                        } else r = oe.camelCase(e), this.each(function() {
                            var n = ke.get(this, r);
                            ke.set(this, r, t), e.indexOf("-") > -1 && void 0 !== n && ke.set(this, e, t)
                        })
                    }, null, t, arguments.length > 1, null, !0)
                },
                removeData: function(e) {
                    return this.each(function() {
                        ke.remove(this, e)
                    })
                }
            }), oe.extend({
                queue: function(e, t, n) {
                    var r;
                    if (e) return t = (t || "fx") + "queue", r = Ee.get(e, t), n && (!r || oe.isArray(n) ? r = Ee.access(e, t, oe.makeArray(n)) : r.push(n)), r || []
                },
                dequeue: function(e, t) {
                    t = t || "fx";
                    var n = oe.queue(e, t),
                        r = n.length,
                        i = n.shift(),
                        o = oe._queueHooks(e, t),
                        a = function() {
                            oe.dequeue(e, t)
                        };
                    "inprogress" === i && (i = n.shift(), r--), i && ("fx" === t && n.unshift("inprogress"), delete o.stop, i.call(e, a, o)), !r && o && o.empty.fire()
                },
                _queueHooks: function(e, t) {
                    var n = t + "queueHooks";
                    return Ee.get(e, n) || Ee.access(e, n, {
                        empty: oe.Callbacks("once memory").add(function() {
                            Ee.remove(e, [t + "queue", n])
                        })
                    })
                }
            }), oe.fn.extend({
                queue: function(e, t) {
                    var n = 2;
                    return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? oe.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                        var n = oe.queue(this, e, t);
                        oe._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && oe.dequeue(this, e)
                    })
                },
                dequeue: function(e) {
                    return this.each(function() {
                        oe.dequeue(this, e)
                    })
                },
                clearQueue: function(e) {
                    return this.queue(e || "fx", [])
                },
                promise: function(e, t) {
                    var n, r = 1,
                        i = oe.Deferred(),
                        o = this,
                        a = this.length,
                        s = function() {
                            --r || i.resolveWith(o, [o])
                        };
                    for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; a--;) n = Ee.get(o[a], e + "queueHooks"), n && n.empty && (r++, n.empty.add(s));
                    return s(), i.promise(t)
                }
            });
            var Ie = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
                Ae = new RegExp("^(?:([+-])=|)(" + Ie + ")([a-z%]*)$", "i"),
                Oe = ["Top", "Right", "Bottom", "Left"],
                De = function(e, t) {
                    return e = t || e, "none" === oe.css(e, "display") || !oe.contains(e.ownerDocument, e)
                },
                He = /^(?:checkbox|radio)$/i,
                Le = /<([\w:-]+)/,
                Pe = /^$|\/(?:java|ecma)script/i,
                Re = {
                    option: [1, "<select multiple='multiple'>", "</select>"],
                    thead: [1, "<table>", "</table>"],
                    col: [2, "<table><colgroup>", "</colgroup></table>"],
                    tr: [2, "<table><tbody>", "</tbody></table>"],
                    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                    _default: [0, "", ""]
                };
            Re.optgroup = Re.option, Re.tbody = Re.tfoot = Re.colgroup = Re.caption = Re.thead, Re.th = Re.td;
            var _e = /<|&#?\w+;/;
            ! function() {
                var e = Y.createDocumentFragment(),
                    t = e.appendChild(Y.createElement("div")),
                    n = Y.createElement("input");
                n.setAttribute("type", "radio"), n.setAttribute("checked", "checked"), n.setAttribute("name", "t"), t.appendChild(n), re.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked, t.innerHTML = "<textarea>x</textarea>", re.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue
            }();
            var qe = /^key/,
                Be = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
                Fe = /^([^.]*)(?:\.(.+)|)/;
            oe.event = {
                global: {},
                add: function(e, t, n, r, i) {
                    var o, a, s, u, c, l, f, d, p, h, g, v = Ee.get(e);
                    if (v)
                        for (n.handler && (o = n, n = o.handler, i = o.selector), n.guid || (n.guid = oe.guid++), (u = v.events) || (u = v.events = {}), (a = v.handle) || (a = v.handle = function(t) {
                                return "undefined" != typeof oe && oe.event.triggered !== t.type ? oe.event.dispatch.apply(e, arguments) : void 0
                            }), t = (t || "").match(we) || [""], c = t.length; c--;) s = Fe.exec(t[c]) || [], p = g = s[1], h = (s[2] || "").split(".").sort(), p && (f = oe.event.special[p] || {}, p = (i ? f.delegateType : f.bindType) || p, f = oe.event.special[p] || {}, l = oe.extend({
                            type: p,
                            origType: g,
                            data: r,
                            handler: n,
                            guid: n.guid,
                            selector: i,
                            needsContext: i && oe.expr.match.needsContext.test(i),
                            namespace: h.join(".")
                        }, o), (d = u[p]) || (d = u[p] = [], d.delegateCount = 0, f.setup && f.setup.call(e, r, h, a) !== !1 || e.addEventListener && e.addEventListener(p, a)), f.add && (f.add.call(e, l), l.handler.guid || (l.handler.guid = n.guid)), i ? d.splice(d.delegateCount++, 0, l) : d.push(l), oe.event.global[p] = !0)
                },
                remove: function(e, t, n, r, i) {
                    var o, a, s, u, c, l, f, d, p, h, g, v = Ee.hasData(e) && Ee.get(e);
                    if (v && (u = v.events)) {
                        for (t = (t || "").match(we) || [""], c = t.length; c--;)
                            if (s = Fe.exec(t[c]) || [], p = g = s[1], h = (s[2] || "").split(".").sort(), p) {
                                for (f = oe.event.special[p] || {}, p = (r ? f.delegateType : f.bindType) || p, d = u[p] || [], s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), a = o = d.length; o--;) l = d[o], !i && g !== l.origType || n && n.guid !== l.guid || s && !s.test(l.namespace) || r && r !== l.selector && ("**" !== r || !l.selector) || (d.splice(o, 1), l.selector && d.delegateCount--, f.remove && f.remove.call(e, l));
                                a && !d.length && (f.teardown && f.teardown.call(e, h, v.handle) !== !1 || oe.removeEvent(e, p, v.handle), delete u[p])
                            } else
                                for (p in u) oe.event.remove(e, p + t[c], n, r, !0);
                        oe.isEmptyObject(u) && Ee.remove(e, "handle events")
                    }
                },
                dispatch: function(e) {
                    e = oe.event.fix(e);
                    var t, n, r, i, o, a = [],
                        s = Q.call(arguments),
                        u = (Ee.get(this, "events") || {})[e.type] || [],
                        c = oe.event.special[e.type] || {};
                    if (s[0] = e, e.delegateTarget = this, !c.preDispatch || c.preDispatch.call(this, e) !== !1) {
                        for (a = oe.event.handlers.call(this, e, u), t = 0;
                            (i = a[t++]) && !e.isPropagationStopped();)
                            for (e.currentTarget = i.elem, n = 0;
                                (o = i.handlers[n++]) && !e.isImmediatePropagationStopped();) e.rnamespace && !e.rnamespace.test(o.namespace) || (e.handleObj = o, e.data = o.data, r = ((oe.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, s), void 0 !== r && (e.result = r) === !1 && (e.preventDefault(), e.stopPropagation()));
                        return c.postDispatch && c.postDispatch.call(this, e), e.result
                    }
                },
                handlers: function(e, t) {
                    var n, r, i, o, a = [],
                        s = t.delegateCount,
                        u = e.target;
                    if (s && u.nodeType && ("click" !== e.type || isNaN(e.button) || e.button < 1))
                        for (; u !== this; u = u.parentNode || this)
                            if (1 === u.nodeType && (u.disabled !== !0 || "click" !== e.type)) {
                                for (r = [], n = 0; n < s; n++) o = t[n], i = o.selector + " ", void 0 === r[i] && (r[i] = o.needsContext ? oe(i, this).index(u) > -1 : oe.find(i, this, null, [u]).length), r[i] && r.push(o);
                                r.length && a.push({
                                    elem: u,
                                    handlers: r
                                })
                            }
                    return s < t.length && a.push({
                        elem: this,
                        handlers: t.slice(s)
                    }), a
                },
                props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
                fixHooks: {},
                keyHooks: {
                    props: "char charCode key keyCode".split(" "),
                    filter: function(e, t) {
                        return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
                    }
                },
                mouseHooks: {
                    props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                    filter: function(e, t) {
                        var n, r, i, o = t.button;
                        return null == e.pageX && null != t.clientX && (n = e.target.ownerDocument || Y, r = n.documentElement, i = n.body, e.pageX = t.clientX + (r && r.scrollLeft || i && i.scrollLeft || 0) - (r && r.clientLeft || i && i.clientLeft || 0), e.pageY = t.clientY + (r && r.scrollTop || i && i.scrollTop || 0) - (r && r.clientTop || i && i.clientTop || 0)), e.which || void 0 === o || (e.which = 1 & o ? 1 : 2 & o ? 3 : 4 & o ? 2 : 0), e
                    }
                },
                fix: function(e) {
                    if (e[oe.expando]) return e;
                    var t, n, r, i = e.type,
                        o = e,
                        a = this.fixHooks[i];
                    for (a || (this.fixHooks[i] = a = Be.test(i) ? this.mouseHooks : qe.test(i) ? this.keyHooks : {}), r = a.props ? this.props.concat(a.props) : this.props, e = new oe.Event(o), t = r.length; t--;) n = r[t], e[n] = o[n];
                    return e.target || (e.target = Y), 3 === e.target.nodeType && (e.target = e.target.parentNode), a.filter ? a.filter(e, o) : e
                },
                special: {
                    load: {
                        noBubble: !0
                    },
                    focus: {
                        trigger: function() {
                            if (this !== g() && this.focus) return this.focus(), !1
                        },
                        delegateType: "focusin"
                    },
                    blur: {
                        trigger: function() {
                            if (this === g() && this.blur) return this.blur(), !1
                        },
                        delegateType: "focusout"
                    },
                    click: {
                        trigger: function() {
                            if ("checkbox" === this.type && this.click && oe.nodeName(this, "input")) return this.click(), !1
                        },
                        _default: function(e) {
                            return oe.nodeName(e.target, "a")
                        }
                    },
                    beforeunload: {
                        postDispatch: function(e) {
                            void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                        }
                    }
                }
            }, oe.removeEvent = function(e, t, n) {
                e.removeEventListener && e.removeEventListener(t, n)
            }, oe.Event = function(e, t) {
                return this instanceof oe.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && e.returnValue === !1 ? p : h) : this.type = e, t && oe.extend(this, t), this.timeStamp = e && e.timeStamp || oe.now(), void(this[oe.expando] = !0)) : new oe.Event(e, t)
            }, oe.Event.prototype = {
                constructor: oe.Event,
                isDefaultPrevented: h,
                isPropagationStopped: h,
                isImmediatePropagationStopped: h,
                isSimulated: !1,
                preventDefault: function() {
                    var e = this.originalEvent;
                    this.isDefaultPrevented = p, e && !this.isSimulated && e.preventDefault()
                },
                stopPropagation: function() {
                    var e = this.originalEvent;
                    this.isPropagationStopped = p, e && !this.isSimulated && e.stopPropagation()
                },
                stopImmediatePropagation: function() {
                    var e = this.originalEvent;
                    this.isImmediatePropagationStopped = p, e && !this.isSimulated && e.stopImmediatePropagation(), this.stopPropagation()
                }
            }, oe.each({
                mouseenter: "mouseover",
                mouseleave: "mouseout",
                pointerenter: "pointerover",
                pointerleave: "pointerout"
            }, function(e, t) {
                oe.event.special[e] = {
                    delegateType: t,
                    bindType: t,
                    handle: function(e) {
                        var n, r = this,
                            i = e.relatedTarget,
                            o = e.handleObj;
                        return i && (i === r || oe.contains(r, i)) || (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n
                    }
                }
            }), oe.fn.extend({
                on: function(e, t, n, r) {
                    return v(this, e, t, n, r)
                },
                one: function(e, t, n, r) {
                    return v(this, e, t, n, r, 1)
                },
                off: function(e, t, n) {
                    var r, i;
                    if (e && e.preventDefault && e.handleObj) return r = e.handleObj, oe(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler), this;
                    if ("object" == typeof e) {
                        for (i in e) this.off(i, t, e[i]);
                        return this
                    }
                    return t !== !1 && "function" != typeof t || (n = t, t = void 0), n === !1 && (n = h), this.each(function() {
                        oe.event.remove(this, e, n, t)
                    })
                }
            });
            var Me = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
                $e = /<script|<style|<link/i,
                Ue = /checked\s*(?:[^=]|=\s*.checked.)/i,
                We = /^true\/(.*)/,
                Ve = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
            oe.extend({
                htmlPrefilter: function(e) {
                    return e.replace(Me, "<$1></$2>")
                },
                clone: function(e, t, n) {
                    var r, i, o, a, s = e.cloneNode(!0),
                        u = oe.contains(e.ownerDocument, e);
                    if (!(re.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || oe.isXMLDoc(e)))
                        for (a = l(s), o = l(e), r = 0, i = o.length; r < i; r++) w(o[r], a[r]);
                    if (t)
                        if (n)
                            for (o = o || l(e), a = a || l(s), r = 0, i = o.length; r < i; r++) x(o[r], a[r]);
                        else x(e, s);
                    return a = l(s, "script"), a.length > 0 && f(a, !u && l(e, "script")), s
                },
                cleanData: function(e) {
                    for (var t, n, r, i = oe.event.special, o = 0; void 0 !== (n = e[o]); o++)
                        if (Ce(n)) {
                            if (t = n[Ee.expando]) {
                                if (t.events)
                                    for (r in t.events) i[r] ? oe.event.remove(n, r) : oe.removeEvent(n, r, t.handle);
                                n[Ee.expando] = void 0
                            }
                            n[ke.expando] && (n[ke.expando] = void 0)
                        }
                }
            }), oe.fn.extend({
                domManip: T,
                detach: function(e) {
                    return S(this, e, !0)
                },
                remove: function(e) {
                    return S(this, e)
                },
                text: function(e) {
                    return Se(this, function(e) {
                        return void 0 === e ? oe.text(this) : this.empty().each(function() {
                            1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                        })
                    }, null, e, arguments.length)
                },
                append: function() {
                    return T(this, arguments, function(e) {
                        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                            var t = m(this, e);
                            t.appendChild(e)
                        }
                    })
                },
                prepend: function() {
                    return T(this, arguments, function(e) {
                        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                            var t = m(this, e);
                            t.insertBefore(e, t.firstChild)
                        }
                    })
                },
                before: function() {
                    return T(this, arguments, function(e) {
                        this.parentNode && this.parentNode.insertBefore(e, this)
                    })
                },
                after: function() {
                    return T(this, arguments, function(e) {
                        this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
                    })
                },
                empty: function() {
                    for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (oe.cleanData(l(e, !1)), e.textContent = "");
                    return this
                },
                clone: function(e, t) {
                    return e = null != e && e, t = null == t ? e : t, this.map(function() {
                        return oe.clone(this, e, t)
                    })
                },
                html: function(e) {
                    return Se(this, function(e) {
                        var t = this[0] || {},
                            n = 0,
                            r = this.length;
                        if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
                        if ("string" == typeof e && !$e.test(e) && !Re[(Le.exec(e) || ["", ""])[1].toLowerCase()]) {
                            e = oe.htmlPrefilter(e);
                            try {
                                for (; n < r; n++) t = this[n] || {}, 1 === t.nodeType && (oe.cleanData(l(t, !1)), t.innerHTML = e);
                                t = 0
                            } catch (i) {}
                        }
                        t && this.empty().append(e)
                    }, null, e, arguments.length)
                },
                replaceWith: function() {
                    var e = [];
                    return T(this, arguments, function(t) {
                        var n = this.parentNode;
                        oe.inArray(this, e) < 0 && (oe.cleanData(l(this)), n && n.replaceChild(t, this))
                    }, e)
                }
            }), oe.each({
                appendTo: "append",
                prependTo: "prepend",
                insertBefore: "before",
                insertAfter: "after",
                replaceAll: "replaceWith"
            }, function(e, t) {
                oe.fn[e] = function(e) {
                    for (var n, r = [], i = oe(e), o = i.length - 1, a = 0; a <= o; a++) n = a === o ? this : this.clone(!0), oe(i[a])[t](n), K.apply(r, n.get());
                    return this.pushStack(r)
                }
            });
            var ze, Je = {
                    HTML: "block",
                    BODY: "block"
                },
                Xe = /^margin/,
                Ye = new RegExp("^(" + Ie + ")(?!px)[a-z%]+$", "i"),
                Qe = function(t) {
                    var n = t.ownerDocument.defaultView;
                    return n && n.opener || (n = e), n.getComputedStyle(t)
                },
                Ge = function(e, t, n, r) {
                    var i, o, a = {};
                    for (o in t) a[o] = e.style[o], e.style[o] = t[o];
                    i = n.apply(e, r || []);
                    for (o in t) e.style[o] = a[o];
                    return i
                },
                Ke = Y.documentElement;
            ! function() {
                function t() {
                    s.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", s.innerHTML = "", Ke.appendChild(a);
                    var t = e.getComputedStyle(s);
                    n = "1%" !== t.top, o = "2px" === t.marginLeft, r = "4px" === t.width, s.style.marginRight = "50%", i = "4px" === t.marginRight, Ke.removeChild(a)
                }
                var n, r, i, o, a = Y.createElement("div"),
                    s = Y.createElement("div");
                s.style && (s.style.backgroundClip = "content-box", s.cloneNode(!0).style.backgroundClip = "", re.clearCloneStyle = "content-box" === s.style.backgroundClip, a.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", a.appendChild(s), oe.extend(re, {
                    pixelPosition: function() {
                        return t(), n
                    },
                    boxSizingReliable: function() {
                        return null == r && t(), r
                    },
                    pixelMarginRight: function() {
                        return null == r && t(), i
                    },
                    reliableMarginLeft: function() {
                        return null == r && t(), o
                    },
                    reliableMarginRight: function() {
                        var t, n = s.appendChild(Y.createElement("div"));
                        return n.style.cssText = s.style.cssText = "-webkit-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", n.style.marginRight = n.style.width = "0", s.style.width = "1px", Ke.appendChild(a), t = !parseFloat(e.getComputedStyle(n).marginRight), Ke.removeChild(a), s.removeChild(n), t
                    }
                }))
            }();
            var Ze = /^(none|table(?!-c[ea]).+)/,
                et = {
                    position: "absolute",
                    visibility: "hidden",
                    display: "block"
                },
                tt = {
                    letterSpacing: "0",
                    fontWeight: "400"
                },
                nt = ["Webkit", "O", "Moz", "ms"],
                rt = Y.createElement("div").style;
            oe.extend({
                cssHooks: {
                    opacity: {
                        get: function(e, t) {
                            if (t) {
                                var n = k(e, "opacity");
                                return "" === n ? "1" : n
                            }
                        }
                    }
                },
                cssNumber: {
                    animationIterationCount: !0,
                    columnCount: !0,
                    fillOpacity: !0,
                    flexGrow: !0,
                    flexShrink: !0,
                    fontWeight: !0,
                    lineHeight: !0,
                    opacity: !0,
                    order: !0,
                    orphans: !0,
                    widows: !0,
                    zIndex: !0,
                    zoom: !0
                },
                cssProps: {
                    "float": "cssFloat"
                },
                style: function(e, t, n, r) {
                    if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                        var i, o, a, s = oe.camelCase(t),
                            u = e.style;
                        return t = oe.cssProps[s] || (oe.cssProps[s] = j(s) || s), a = oe.cssHooks[t] || oe.cssHooks[s], void 0 === n ? a && "get" in a && void 0 !== (i = a.get(e, !1, r)) ? i : u[t] : (o = typeof n, "string" === o && (i = Ae.exec(n)) && i[1] && (n = c(e, t, i), o = "number"), null != n && n === n && ("number" === o && (n += i && i[3] || (oe.cssNumber[s] ? "" : "px")), re.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (u[t] = "inherit"), a && "set" in a && void 0 === (n = a.set(e, n, r)) || (u[t] = n)), void 0)
                    }
                },
                css: function(e, t, n, r) {
                    var i, o, a, s = oe.camelCase(t);
                    return t = oe.cssProps[s] || (oe.cssProps[s] = j(s) || s), a = oe.cssHooks[t] || oe.cssHooks[s], a && "get" in a && (i = a.get(e, !0, n)), void 0 === i && (i = k(e, t, r)), "normal" === i && t in tt && (i = tt[t]), "" === n || n ? (o = parseFloat(i), n === !0 || isFinite(o) ? o || 0 : i) : i
                }
            }), oe.each(["height", "width"], function(e, t) {
                oe.cssHooks[t] = {
                    get: function(e, n, r) {
                        if (n) return Ze.test(oe.css(e, "display")) && 0 === e.offsetWidth ? Ge(e, et, function() {
                            return O(e, t, r)
                        }) : O(e, t, r)
                    },
                    set: function(e, n, r) {
                        var i, o = r && Qe(e),
                            a = r && A(e, t, r, "border-box" === oe.css(e, "boxSizing", !1, o), o);
                        return a && (i = Ae.exec(n)) && "px" !== (i[3] || "px") && (e.style[t] = n, n = oe.css(e, t)), I(e, n, a)
                    }
                }
            }), oe.cssHooks.marginLeft = N(re.reliableMarginLeft, function(e, t) {
                if (t) return (parseFloat(k(e, "marginLeft")) || e.getBoundingClientRect().left - Ge(e, {
                    marginLeft: 0
                }, function() {
                    return e.getBoundingClientRect().left
                })) + "px"
            }), oe.cssHooks.marginRight = N(re.reliableMarginRight, function(e, t) {
                if (t) return Ge(e, {
                    display: "inline-block"
                }, k, [e, "marginRight"])
            }), oe.each({
                margin: "",
                padding: "",
                border: "Width"
            }, function(e, t) {
                oe.cssHooks[e + t] = {
                    expand: function(n) {
                        for (var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [n]; r < 4; r++) i[e + Oe[r] + t] = o[r] || o[r - 2] || o[0];
                        return i
                    }
                }, Xe.test(e) || (oe.cssHooks[e + t].set = I)
            }), oe.fn.extend({
                css: function(e, t) {
                    return Se(this, function(e, t, n) {
                        var r, i, o = {},
                            a = 0;
                        if (oe.isArray(t)) {
                            for (r = Qe(e), i = t.length; a < i; a++) o[t[a]] = oe.css(e, t[a], !1, r);
                            return o
                        }
                        return void 0 !== n ? oe.style(e, t, n) : oe.css(e, t)
                    }, e, t, arguments.length > 1)
                },
                show: function() {
                    return D(this, !0)
                },
                hide: function() {
                    return D(this)
                },
                toggle: function(e) {
                    return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                        De(this) ? oe(this).show() : oe(this).hide()
                    })
                }
            }), oe.Tween = H, H.prototype = {
                constructor: H,
                init: function(e, t, n, r, i, o) {
                    this.elem = e, this.prop = n, this.easing = i || oe.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = o || (oe.cssNumber[n] ? "" : "px")
                },
                cur: function() {
                    var e = H.propHooks[this.prop];
                    return e && e.get ? e.get(this) : H.propHooks._default.get(this)
                },
                run: function(e) {
                    var t, n = H.propHooks[this.prop];
                    return this.options.duration ? this.pos = t = oe.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : H.propHooks._default.set(this), this
                }
            }, H.prototype.init.prototype = H.prototype, H.propHooks = {
                _default: {
                    get: function(e) {
                        var t;
                        return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = oe.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0)
                    },
                    set: function(e) {
                        oe.fx.step[e.prop] ? oe.fx.step[e.prop](e) : 1 !== e.elem.nodeType || null == e.elem.style[oe.cssProps[e.prop]] && !oe.cssHooks[e.prop] ? e.elem[e.prop] = e.now : oe.style(e.elem, e.prop, e.now + e.unit)
                    }
                }
            }, H.propHooks.scrollTop = H.propHooks.scrollLeft = {
                set: function(e) {
                    e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
                }
            }, oe.easing = {
                linear: function(e) {
                    return e
                },
                swing: function(e) {
                    return .5 - Math.cos(e * Math.PI) / 2
                },
                _default: "swing"
            }, oe.fx = H.prototype.init, oe.fx.step = {};
            var it, ot, at = /^(?:toggle|show|hide)$/,
                st = /queueHooks$/;
            oe.Animation = oe.extend(B, {
                    tweeners: {
                        "*": [function(e, t) {
                            var n = this.createTween(e, t);
                            return c(n.elem, e, Ae.exec(t), n), n
                        }]
                    },
                    tweener: function(e, t) {
                        oe.isFunction(e) ? (t = e, e = ["*"]) : e = e.match(we);
                        for (var n, r = 0, i = e.length; r < i; r++) n = e[r], B.tweeners[n] = B.tweeners[n] || [], B.tweeners[n].unshift(t)
                    },
                    prefilters: [_],
                    prefilter: function(e, t) {
                        t ? B.prefilters.unshift(e) : B.prefilters.push(e)
                    }
                }), oe.speed = function(e, t, n) {
                    var r = e && "object" == typeof e ? oe.extend({}, e) : {
                        complete: n || !n && t || oe.isFunction(e) && e,
                        duration: e,
                        easing: n && t || t && !oe.isFunction(t) && t
                    };
                    return r.duration = oe.fx.off ? 0 : "number" == typeof r.duration ? r.duration : r.duration in oe.fx.speeds ? oe.fx.speeds[r.duration] : oe.fx.speeds._default, null != r.queue && r.queue !== !0 || (r.queue = "fx"),
                        r.old = r.complete, r.complete = function() {
                            oe.isFunction(r.old) && r.old.call(this), r.queue && oe.dequeue(this, r.queue)
                        }, r
                }, oe.fn.extend({
                    fadeTo: function(e, t, n, r) {
                        return this.filter(De).css("opacity", 0).show().end().animate({
                            opacity: t
                        }, e, n, r)
                    },
                    animate: function(e, t, n, r) {
                        var i = oe.isEmptyObject(e),
                            o = oe.speed(t, n, r),
                            a = function() {
                                var t = B(this, oe.extend({}, e), o);
                                (i || Ee.get(this, "finish")) && t.stop(!0)
                            };
                        return a.finish = a, i || o.queue === !1 ? this.each(a) : this.queue(o.queue, a)
                    },
                    stop: function(e, t, n) {
                        var r = function(e) {
                            var t = e.stop;
                            delete e.stop, t(n)
                        };
                        return "string" != typeof e && (n = t, t = e, e = void 0), t && e !== !1 && this.queue(e || "fx", []), this.each(function() {
                            var t = !0,
                                i = null != e && e + "queueHooks",
                                o = oe.timers,
                                a = Ee.get(this);
                            if (i) a[i] && a[i].stop && r(a[i]);
                            else
                                for (i in a) a[i] && a[i].stop && st.test(i) && r(a[i]);
                            for (i = o.length; i--;) o[i].elem !== this || null != e && o[i].queue !== e || (o[i].anim.stop(n), t = !1, o.splice(i, 1));
                            !t && n || oe.dequeue(this, e)
                        })
                    },
                    finish: function(e) {
                        return e !== !1 && (e = e || "fx"), this.each(function() {
                            var t, n = Ee.get(this),
                                r = n[e + "queue"],
                                i = n[e + "queueHooks"],
                                o = oe.timers,
                                a = r ? r.length : 0;
                            for (n.finish = !0, oe.queue(this, e, []), i && i.stop && i.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
                            for (t = 0; t < a; t++) r[t] && r[t].finish && r[t].finish.call(this);
                            delete n.finish
                        })
                    }
                }), oe.each(["toggle", "show", "hide"], function(e, t) {
                    var n = oe.fn[t];
                    oe.fn[t] = function(e, r, i) {
                        return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(P(t, !0), e, r, i)
                    }
                }), oe.each({
                    slideDown: P("show"),
                    slideUp: P("hide"),
                    slideToggle: P("toggle"),
                    fadeIn: {
                        opacity: "show"
                    },
                    fadeOut: {
                        opacity: "hide"
                    },
                    fadeToggle: {
                        opacity: "toggle"
                    }
                }, function(e, t) {
                    oe.fn[e] = function(e, n, r) {
                        return this.animate(t, e, n, r)
                    }
                }), oe.timers = [], oe.fx.tick = function() {
                    var e, t = 0,
                        n = oe.timers;
                    for (it = oe.now(); t < n.length; t++) e = n[t], e() || n[t] !== e || n.splice(t--, 1);
                    n.length || oe.fx.stop(), it = void 0
                }, oe.fx.timer = function(e) {
                    oe.timers.push(e), e() ? oe.fx.start() : oe.timers.pop()
                }, oe.fx.interval = 13, oe.fx.start = function() {
                    ot || (ot = e.setInterval(oe.fx.tick, oe.fx.interval))
                }, oe.fx.stop = function() {
                    e.clearInterval(ot), ot = null
                }, oe.fx.speeds = {
                    slow: 600,
                    fast: 200,
                    _default: 400
                }, oe.fn.delay = function(t, n) {
                    return t = oe.fx ? oe.fx.speeds[t] || t : t, n = n || "fx", this.queue(n, function(n, r) {
                        var i = e.setTimeout(n, t);
                        r.stop = function() {
                            e.clearTimeout(i)
                        }
                    })
                },
                function() {
                    var e = Y.createElement("input"),
                        t = Y.createElement("select"),
                        n = t.appendChild(Y.createElement("option"));
                    e.type = "checkbox", re.checkOn = "" !== e.value, re.optSelected = n.selected, t.disabled = !0, re.optDisabled = !n.disabled, e = Y.createElement("input"), e.value = "t", e.type = "radio", re.radioValue = "t" === e.value
                }();
            var ut, ct = oe.expr.attrHandle;
            oe.fn.extend({
                attr: function(e, t) {
                    return Se(this, oe.attr, e, t, arguments.length > 1)
                },
                removeAttr: function(e) {
                    return this.each(function() {
                        oe.removeAttr(this, e)
                    })
                }
            }), oe.extend({
                attr: function(e, t, n) {
                    var r, i, o = e.nodeType;
                    if (3 !== o && 8 !== o && 2 !== o) return "undefined" == typeof e.getAttribute ? oe.prop(e, t, n) : (1 === o && oe.isXMLDoc(e) || (t = t.toLowerCase(), i = oe.attrHooks[t] || (oe.expr.match.bool.test(t) ? ut : void 0)), void 0 !== n ? null === n ? void oe.removeAttr(e, t) : i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ""), n) : i && "get" in i && null !== (r = i.get(e, t)) ? r : (r = oe.find.attr(e, t), null == r ? void 0 : r))
                },
                attrHooks: {
                    type: {
                        set: function(e, t) {
                            if (!re.radioValue && "radio" === t && oe.nodeName(e, "input")) {
                                var n = e.value;
                                return e.setAttribute("type", t), n && (e.value = n), t
                            }
                        }
                    }
                },
                removeAttr: function(e, t) {
                    var n, r, i = 0,
                        o = t && t.match(we);
                    if (o && 1 === e.nodeType)
                        for (; n = o[i++];) r = oe.propFix[n] || n, oe.expr.match.bool.test(n) && (e[r] = !1), e.removeAttribute(n)
                }
            }), ut = {
                set: function(e, t, n) {
                    return t === !1 ? oe.removeAttr(e, n) : e.setAttribute(n, n), n
                }
            }, oe.each(oe.expr.match.bool.source.match(/\w+/g), function(e, t) {
                var n = ct[t] || oe.find.attr;
                ct[t] = function(e, t, r) {
                    var i, o;
                    return r || (o = ct[t], ct[t] = i, i = null != n(e, t, r) ? t.toLowerCase() : null, ct[t] = o), i
                }
            });
            var lt = /^(?:input|select|textarea|button)$/i,
                ft = /^(?:a|area)$/i;
            oe.fn.extend({
                prop: function(e, t) {
                    return Se(this, oe.prop, e, t, arguments.length > 1)
                },
                removeProp: function(e) {
                    return this.each(function() {
                        delete this[oe.propFix[e] || e]
                    })
                }
            }), oe.extend({
                prop: function(e, t, n) {
                    var r, i, o = e.nodeType;
                    if (3 !== o && 8 !== o && 2 !== o) return 1 === o && oe.isXMLDoc(e) || (t = oe.propFix[t] || t, i = oe.propHooks[t]), void 0 !== n ? i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get" in i && null !== (r = i.get(e, t)) ? r : e[t]
                },
                propHooks: {
                    tabIndex: {
                        get: function(e) {
                            var t = oe.find.attr(e, "tabindex");
                            return t ? parseInt(t, 10) : lt.test(e.nodeName) || ft.test(e.nodeName) && e.href ? 0 : -1
                        }
                    }
                },
                propFix: {
                    "for": "htmlFor",
                    "class": "className"
                }
            }), re.optSelected || (oe.propHooks.selected = {
                get: function(e) {
                    var t = e.parentNode;
                    return t && t.parentNode && t.parentNode.selectedIndex, null
                },
                set: function(e) {
                    var t = e.parentNode;
                    t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex)
                }
            }), oe.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
                oe.propFix[this.toLowerCase()] = this
            });
            var dt = /[\t\r\n\f]/g;
            oe.fn.extend({
                addClass: function(e) {
                    var t, n, r, i, o, a, s, u = 0;
                    if (oe.isFunction(e)) return this.each(function(t) {
                        oe(this).addClass(e.call(this, t, F(this)))
                    });
                    if ("string" == typeof e && e)
                        for (t = e.match(we) || []; n = this[u++];)
                            if (i = F(n), r = 1 === n.nodeType && (" " + i + " ").replace(dt, " ")) {
                                for (a = 0; o = t[a++];) r.indexOf(" " + o + " ") < 0 && (r += o + " ");
                                s = oe.trim(r), i !== s && n.setAttribute("class", s)
                            }
                    return this
                },
                removeClass: function(e) {
                    var t, n, r, i, o, a, s, u = 0;
                    if (oe.isFunction(e)) return this.each(function(t) {
                        oe(this).removeClass(e.call(this, t, F(this)))
                    });
                    if (!arguments.length) return this.attr("class", "");
                    if ("string" == typeof e && e)
                        for (t = e.match(we) || []; n = this[u++];)
                            if (i = F(n), r = 1 === n.nodeType && (" " + i + " ").replace(dt, " ")) {
                                for (a = 0; o = t[a++];)
                                    for (; r.indexOf(" " + o + " ") > -1;) r = r.replace(" " + o + " ", " ");
                                s = oe.trim(r), i !== s && n.setAttribute("class", s)
                            }
                    return this
                },
                toggleClass: function(e, t) {
                    var n = typeof e;
                    return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : oe.isFunction(e) ? this.each(function(n) {
                        oe(this).toggleClass(e.call(this, n, F(this), t), t)
                    }) : this.each(function() {
                        var t, r, i, o;
                        if ("string" === n)
                            for (r = 0, i = oe(this), o = e.match(we) || []; t = o[r++];) i.hasClass(t) ? i.removeClass(t) : i.addClass(t);
                        else void 0 !== e && "boolean" !== n || (t = F(this), t && Ee.set(this, "__className__", t), this.setAttribute && this.setAttribute("class", t || e === !1 ? "" : Ee.get(this, "__className__") || ""))
                    })
                },
                hasClass: function(e) {
                    var t, n, r = 0;
                    for (t = " " + e + " "; n = this[r++];)
                        if (1 === n.nodeType && (" " + F(n) + " ").replace(dt, " ").indexOf(t) > -1) return !0;
                    return !1
                }
            });
            var pt = /\r/g,
                ht = /[\x20\t\r\n\f]+/g;
            oe.fn.extend({
                val: function(e) {
                    var t, n, r, i = this[0]; {
                        if (arguments.length) return r = oe.isFunction(e), this.each(function(n) {
                            var i;
                            1 === this.nodeType && (i = r ? e.call(this, n, oe(this).val()) : e, null == i ? i = "" : "number" == typeof i ? i += "" : oe.isArray(i) && (i = oe.map(i, function(e) {
                                return null == e ? "" : e + ""
                            })), t = oe.valHooks[this.type] || oe.valHooks[this.nodeName.toLowerCase()], t && "set" in t && void 0 !== t.set(this, i, "value") || (this.value = i))
                        });
                        if (i) return t = oe.valHooks[i.type] || oe.valHooks[i.nodeName.toLowerCase()], t && "get" in t && void 0 !== (n = t.get(i, "value")) ? n : (n = i.value, "string" == typeof n ? n.replace(pt, "") : null == n ? "" : n)
                    }
                }
            }), oe.extend({
                valHooks: {
                    option: {
                        get: function(e) {
                            var t = oe.find.attr(e, "value");
                            return null != t ? t : oe.trim(oe.text(e)).replace(ht, " ")
                        }
                    },
                    select: {
                        get: function(e) {
                            for (var t, n, r = e.options, i = e.selectedIndex, o = "select-one" === e.type || i < 0, a = o ? null : [], s = o ? i + 1 : r.length, u = i < 0 ? s : o ? i : 0; u < s; u++)
                                if (n = r[u], (n.selected || u === i) && (re.optDisabled ? !n.disabled : null === n.getAttribute("disabled")) && (!n.parentNode.disabled || !oe.nodeName(n.parentNode, "optgroup"))) {
                                    if (t = oe(n).val(), o) return t;
                                    a.push(t)
                                }
                            return a
                        },
                        set: function(e, t) {
                            for (var n, r, i = e.options, o = oe.makeArray(t), a = i.length; a--;) r = i[a], (r.selected = oe.inArray(oe.valHooks.option.get(r), o) > -1) && (n = !0);
                            return n || (e.selectedIndex = -1), o
                        }
                    }
                }
            }), oe.each(["radio", "checkbox"], function() {
                oe.valHooks[this] = {
                    set: function(e, t) {
                        if (oe.isArray(t)) return e.checked = oe.inArray(oe(e).val(), t) > -1
                    }
                }, re.checkOn || (oe.valHooks[this].get = function(e) {
                    return null === e.getAttribute("value") ? "on" : e.value
                })
            });
            var gt = /^(?:focusinfocus|focusoutblur)$/;
            oe.extend(oe.event, {
                trigger: function(t, n, r, i) {
                    var o, a, s, u, c, l, f, d = [r || Y],
                        p = ne.call(t, "type") ? t.type : t,
                        h = ne.call(t, "namespace") ? t.namespace.split(".") : [];
                    if (a = s = r = r || Y, 3 !== r.nodeType && 8 !== r.nodeType && !gt.test(p + oe.event.triggered) && (p.indexOf(".") > -1 && (h = p.split("."), p = h.shift(), h.sort()), c = p.indexOf(":") < 0 && "on" + p, t = t[oe.expando] ? t : new oe.Event(p, "object" == typeof t && t), t.isTrigger = i ? 2 : 3, t.namespace = h.join("."), t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = r), n = null == n ? [t] : oe.makeArray(n, [t]), f = oe.event.special[p] || {}, i || !f.trigger || f.trigger.apply(r, n) !== !1)) {
                        if (!i && !f.noBubble && !oe.isWindow(r)) {
                            for (u = f.delegateType || p, gt.test(u + p) || (a = a.parentNode); a; a = a.parentNode) d.push(a), s = a;
                            s === (r.ownerDocument || Y) && d.push(s.defaultView || s.parentWindow || e)
                        }
                        for (o = 0;
                            (a = d[o++]) && !t.isPropagationStopped();) t.type = o > 1 ? u : f.bindType || p, l = (Ee.get(a, "events") || {})[t.type] && Ee.get(a, "handle"), l && l.apply(a, n), l = c && a[c], l && l.apply && Ce(a) && (t.result = l.apply(a, n), t.result === !1 && t.preventDefault());
                        return t.type = p, i || t.isDefaultPrevented() || f._default && f._default.apply(d.pop(), n) !== !1 || !Ce(r) || c && oe.isFunction(r[p]) && !oe.isWindow(r) && (s = r[c], s && (r[c] = null), oe.event.triggered = p, r[p](), oe.event.triggered = void 0, s && (r[c] = s)), t.result
                    }
                },
                simulate: function(e, t, n) {
                    var r = oe.extend(new oe.Event, n, {
                        type: e,
                        isSimulated: !0
                    });
                    oe.event.trigger(r, null, t)
                }
            }), oe.fn.extend({
                trigger: function(e, t) {
                    return this.each(function() {
                        oe.event.trigger(e, t, this)
                    })
                },
                triggerHandler: function(e, t) {
                    var n = this[0];
                    if (n) return oe.event.trigger(e, t, n, !0)
                }
            }), oe.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
                oe.fn[t] = function(e, n) {
                    return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
                }
            }), oe.fn.extend({
                hover: function(e, t) {
                    return this.mouseenter(e).mouseleave(t || e)
                }
            }), re.focusin = "onfocusin" in e, re.focusin || oe.each({
                focus: "focusin",
                blur: "focusout"
            }, function(e, t) {
                var n = function(e) {
                    oe.event.simulate(t, e.target, oe.event.fix(e))
                };
                oe.event.special[t] = {
                    setup: function() {
                        var r = this.ownerDocument || this,
                            i = Ee.access(r, t);
                        i || r.addEventListener(e, n, !0), Ee.access(r, t, (i || 0) + 1)
                    },
                    teardown: function() {
                        var r = this.ownerDocument || this,
                            i = Ee.access(r, t) - 1;
                        i ? Ee.access(r, t, i) : (r.removeEventListener(e, n, !0), Ee.remove(r, t))
                    }
                }
            });
            var vt = e.location,
                mt = oe.now(),
                yt = /\?/;
            oe.parseJSON = function(e) {
                return JSON.parse(e + "")
            }, oe.parseXML = function(t) {
                var n;
                if (!t || "string" != typeof t) return null;
                try {
                    n = (new e.DOMParser).parseFromString(t, "text/xml")
                } catch (r) {
                    n = void 0
                }
                return n && !n.getElementsByTagName("parsererror").length || oe.error("Invalid XML: " + t), n
            };
            var bt = /#.*$/,
                xt = /([?&])_=[^&]*/,
                wt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
                Tt = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
                St = /^(?:GET|HEAD)$/,
                Ct = /^\/\//,
                Et = {},
                kt = {},
                Nt = "*/".concat("*"),
                jt = Y.createElement("a");
            jt.href = vt.href, oe.extend({
                active: 0,
                lastModified: {},
                etag: {},
                ajaxSettings: {
                    url: vt.href,
                    type: "GET",
                    isLocal: Tt.test(vt.protocol),
                    global: !0,
                    processData: !0,
                    async: !0,
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    accepts: {
                        "*": Nt,
                        text: "text/plain",
                        html: "text/html",
                        xml: "application/xml, text/xml",
                        json: "application/json, text/javascript"
                    },
                    contents: {
                        xml: /\bxml\b/,
                        html: /\bhtml/,
                        json: /\bjson\b/
                    },
                    responseFields: {
                        xml: "responseXML",
                        text: "responseText",
                        json: "responseJSON"
                    },
                    converters: {
                        "* text": String,
                        "text html": !0,
                        "text json": oe.parseJSON,
                        "text xml": oe.parseXML
                    },
                    flatOptions: {
                        url: !0,
                        context: !0
                    }
                },
                ajaxSetup: function(e, t) {
                    return t ? U(U(e, oe.ajaxSettings), t) : U(oe.ajaxSettings, e)
                },
                ajaxPrefilter: M(Et),
                ajaxTransport: M(kt),
                ajax: function(t, n) {
                    function r(t, n, r, s) {
                        var c, f, y, b, w, S = n;
                        2 !== x && (x = 2, u && e.clearTimeout(u), i = void 0, a = s || "", T.readyState = t > 0 ? 4 : 0, c = t >= 200 && t < 300 || 304 === t, r && (b = W(d, T, r)), b = V(d, b, T, c), c ? (d.ifModified && (w = T.getResponseHeader("Last-Modified"), w && (oe.lastModified[o] = w), w = T.getResponseHeader("etag"), w && (oe.etag[o] = w)), 204 === t || "HEAD" === d.type ? S = "nocontent" : 304 === t ? S = "notmodified" : (S = b.state, f = b.data, y = b.error, c = !y)) : (y = S, !t && S || (S = "error", t < 0 && (t = 0))), T.status = t, T.statusText = (n || S) + "", c ? g.resolveWith(p, [f, S, T]) : g.rejectWith(p, [T, S, y]), T.statusCode(m), m = void 0, l && h.trigger(c ? "ajaxSuccess" : "ajaxError", [T, d, c ? f : y]), v.fireWith(p, [T, S]), l && (h.trigger("ajaxComplete", [T, d]), --oe.active || oe.event.trigger("ajaxStop")))
                    }
                    "object" == typeof t && (n = t, t = void 0), n = n || {};
                    var i, o, a, s, u, c, l, f, d = oe.ajaxSetup({}, n),
                        p = d.context || d,
                        h = d.context && (p.nodeType || p.jquery) ? oe(p) : oe.event,
                        g = oe.Deferred(),
                        v = oe.Callbacks("once memory"),
                        m = d.statusCode || {},
                        y = {},
                        b = {},
                        x = 0,
                        w = "canceled",
                        T = {
                            readyState: 0,
                            getResponseHeader: function(e) {
                                var t;
                                if (2 === x) {
                                    if (!s)
                                        for (s = {}; t = wt.exec(a);) s[t[1].toLowerCase()] = t[2];
                                    t = s[e.toLowerCase()]
                                }
                                return null == t ? null : t
                            },
                            getAllResponseHeaders: function() {
                                return 2 === x ? a : null
                            },
                            setRequestHeader: function(e, t) {
                                var n = e.toLowerCase();
                                return x || (e = b[n] = b[n] || e, y[e] = t), this
                            },
                            overrideMimeType: function(e) {
                                return x || (d.mimeType = e), this
                            },
                            statusCode: function(e) {
                                var t;
                                if (e)
                                    if (x < 2)
                                        for (t in e) m[t] = [m[t], e[t]];
                                    else T.always(e[T.status]);
                                return this
                            },
                            abort: function(e) {
                                var t = e || w;
                                return i && i.abort(t), r(0, t), this
                            }
                        };
                    if (g.promise(T).complete = v.add, T.success = T.done, T.error = T.fail, d.url = ((t || d.url || vt.href) + "").replace(bt, "").replace(Ct, vt.protocol + "//"), d.type = n.method || n.type || d.method || d.type, d.dataTypes = oe.trim(d.dataType || "*").toLowerCase().match(we) || [""], null == d.crossDomain) {
                        c = Y.createElement("a");
                        try {
                            c.href = d.url, c.href = c.href, d.crossDomain = jt.protocol + "//" + jt.host != c.protocol + "//" + c.host
                        } catch (S) {
                            d.crossDomain = !0
                        }
                    }
                    if (d.data && d.processData && "string" != typeof d.data && (d.data = oe.param(d.data, d.traditional)), $(Et, d, n, T), 2 === x) return T;
                    l = oe.event && d.global, l && 0 === oe.active++ && oe.event.trigger("ajaxStart"), d.type = d.type.toUpperCase(), d.hasContent = !St.test(d.type), o = d.url, d.hasContent || (d.data && (o = d.url += (yt.test(o) ? "&" : "?") + d.data, delete d.data), d.cache === !1 && (d.url = xt.test(o) ? o.replace(xt, "$1_=" + mt++) : o + (yt.test(o) ? "&" : "?") + "_=" + mt++)), d.ifModified && (oe.lastModified[o] && T.setRequestHeader("If-Modified-Since", oe.lastModified[o]), oe.etag[o] && T.setRequestHeader("If-None-Match", oe.etag[o])), (d.data && d.hasContent && d.contentType !== !1 || n.contentType) && T.setRequestHeader("Content-Type", d.contentType), T.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + ("*" !== d.dataTypes[0] ? ", " + Nt + "; q=0.01" : "") : d.accepts["*"]);
                    for (f in d.headers) T.setRequestHeader(f, d.headers[f]);
                    if (d.beforeSend && (d.beforeSend.call(p, T, d) === !1 || 2 === x)) return T.abort();
                    w = "abort";
                    for (f in {
                            success: 1,
                            error: 1,
                            complete: 1
                        }) T[f](d[f]);
                    if (i = $(kt, d, n, T)) {
                        if (T.readyState = 1, l && h.trigger("ajaxSend", [T, d]), 2 === x) return T;
                        d.async && d.timeout > 0 && (u = e.setTimeout(function() {
                            T.abort("timeout")
                        }, d.timeout));
                        try {
                            x = 1, i.send(y, r)
                        } catch (S) {
                            if (!(x < 2)) throw S;
                            r(-1, S)
                        }
                    } else r(-1, "No Transport");
                    return T
                },
                getJSON: function(e, t, n) {
                    return oe.get(e, t, n, "json")
                },
                getScript: function(e, t) {
                    return oe.get(e, void 0, t, "script")
                }
            }), oe.each(["get", "post"], function(e, t) {
                oe[t] = function(e, n, r, i) {
                    return oe.isFunction(n) && (i = i || r, r = n, n = void 0), oe.ajax(oe.extend({
                        url: e,
                        type: t,
                        dataType: i,
                        data: n,
                        success: r
                    }, oe.isPlainObject(e) && e))
                }
            }), oe._evalUrl = function(e) {
                return oe.ajax({
                    url: e,
                    type: "GET",
                    dataType: "script",
                    async: !1,
                    global: !1,
                    "throws": !0
                })
            }, oe.fn.extend({
                wrapAll: function(e) {
                    var t;
                    return oe.isFunction(e) ? this.each(function(t) {
                        oe(this).wrapAll(e.call(this, t))
                    }) : (this[0] && (t = oe(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                        for (var e = this; e.firstElementChild;) e = e.firstElementChild;
                        return e
                    }).append(this)), this)
                },
                wrapInner: function(e) {
                    return oe.isFunction(e) ? this.each(function(t) {
                        oe(this).wrapInner(e.call(this, t))
                    }) : this.each(function() {
                        var t = oe(this),
                            n = t.contents();
                        n.length ? n.wrapAll(e) : t.append(e)
                    })
                },
                wrap: function(e) {
                    var t = oe.isFunction(e);
                    return this.each(function(n) {
                        oe(this).wrapAll(t ? e.call(this, n) : e)
                    })
                },
                unwrap: function() {
                    return this.parent().each(function() {
                        oe.nodeName(this, "body") || oe(this).replaceWith(this.childNodes)
                    }).end()
                }
            }), oe.expr.filters.hidden = function(e) {
                return !oe.expr.filters.visible(e)
            }, oe.expr.filters.visible = function(e) {
                return e.offsetWidth > 0 || e.offsetHeight > 0 || e.getClientRects().length > 0
            };
            var It = /%20/g,
                At = /\[\]$/,
                Ot = /\r?\n/g,
                Dt = /^(?:submit|button|image|reset|file)$/i,
                Ht = /^(?:input|select|textarea|keygen)/i;
            oe.param = function(e, t) {
                var n, r = [],
                    i = function(e, t) {
                        t = oe.isFunction(t) ? t() : null == t ? "" : t, r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
                    };
                if (void 0 === t && (t = oe.ajaxSettings && oe.ajaxSettings.traditional), oe.isArray(e) || e.jquery && !oe.isPlainObject(e)) oe.each(e, function() {
                    i(this.name, this.value)
                });
                else
                    for (n in e) z(n, e[n], t, i);
                return r.join("&").replace(It, "+")
            }, oe.fn.extend({
                serialize: function() {
                    return oe.param(this.serializeArray())
                },
                serializeArray: function() {
                    return this.map(function() {
                        var e = oe.prop(this, "elements");
                        return e ? oe.makeArray(e) : this
                    }).filter(function() {
                        var e = this.type;
                        return this.name && !oe(this).is(":disabled") && Ht.test(this.nodeName) && !Dt.test(e) && (this.checked || !He.test(e))
                    }).map(function(e, t) {
                        var n = oe(this).val();
                        return null == n ? null : oe.isArray(n) ? oe.map(n, function(e) {
                            return {
                                name: t.name,
                                value: e.replace(Ot, "\r\n")
                            }
                        }) : {
                            name: t.name,
                            value: n.replace(Ot, "\r\n")
                        }
                    }).get()
                }
            }), oe.ajaxSettings.xhr = function() {
                try {
                    return new e.XMLHttpRequest
                } catch (t) {}
            };
            var Lt = {
                    0: 200,
                    1223: 204
                },
                Pt = oe.ajaxSettings.xhr();
            re.cors = !!Pt && "withCredentials" in Pt, re.ajax = Pt = !!Pt, oe.ajaxTransport(function(t) {
                var n, r;
                if (re.cors || Pt && !t.crossDomain) return {
                    send: function(i, o) {
                        var a, s = t.xhr();
                        if (s.open(t.type, t.url, t.async, t.username, t.password), t.xhrFields)
                            for (a in t.xhrFields) s[a] = t.xhrFields[a];
                        t.mimeType && s.overrideMimeType && s.overrideMimeType(t.mimeType), t.crossDomain || i["X-Requested-With"] || (i["X-Requested-With"] = "XMLHttpRequest");
                        for (a in i) s.setRequestHeader(a, i[a]);
                        n = function(e) {
                            return function() {
                                n && (n = r = s.onload = s.onerror = s.onabort = s.onreadystatechange = null, "abort" === e ? s.abort() : "error" === e ? "number" != typeof s.status ? o(0, "error") : o(s.status, s.statusText) : o(Lt[s.status] || s.status, s.statusText, "text" !== (s.responseType || "text") || "string" != typeof s.responseText ? {
                                    binary: s.response
                                } : {
                                    text: s.responseText
                                }, s.getAllResponseHeaders()))
                            }
                        }, s.onload = n(), r = s.onerror = n("error"), void 0 !== s.onabort ? s.onabort = r : s.onreadystatechange = function() {
                            4 === s.readyState && e.setTimeout(function() {
                                n && r()
                            })
                        }, n = n("abort");
                        try {
                            s.send(t.hasContent && t.data || null)
                        } catch (u) {
                            if (n) throw u
                        }
                    },
                    abort: function() {
                        n && n()
                    }
                }
            }), oe.ajaxSetup({
                accepts: {
                    script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
                },
                contents: {
                    script: /\b(?:java|ecma)script\b/
                },
                converters: {
                    "text script": function(e) {
                        return oe.globalEval(e), e
                    }
                }
            }), oe.ajaxPrefilter("script", function(e) {
                void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET")
            }), oe.ajaxTransport("script", function(e) {
                if (e.crossDomain) {
                    var t, n;
                    return {
                        send: function(r, i) {
                            t = oe("<script>").prop({
                                charset: e.scriptCharset,
                                src: e.url
                            }).on("load error", n = function(e) {
                                t.remove(), n = null, e && i("error" === e.type ? 404 : 200, e.type)
                            }), Y.head.appendChild(t[0])
                        },
                        abort: function() {
                            n && n()
                        }
                    }
                }
            });
            var Rt = [],
                _t = /(=)\?(?=&|$)|\?\?/;
            oe.ajaxSetup({
                jsonp: "callback",
                jsonpCallback: function() {
                    var e = Rt.pop() || oe.expando + "_" + mt++;
                    return this[e] = !0, e
                }
            }), oe.ajaxPrefilter("json jsonp", function(t, n, r) {
                var i, o, a, s = t.jsonp !== !1 && (_t.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && _t.test(t.data) && "data");
                if (s || "jsonp" === t.dataTypes[0]) return i = t.jsonpCallback = oe.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, s ? t[s] = t[s].replace(_t, "$1" + i) : t.jsonp !== !1 && (t.url += (yt.test(t.url) ? "&" : "?") + t.jsonp + "=" + i), t.converters["script json"] = function() {
                    return a || oe.error(i + " was not called"), a[0]
                }, t.dataTypes[0] = "json", o = e[i], e[i] = function() {
                    a = arguments
                }, r.always(function() {
                    void 0 === o ? oe(e).removeProp(i) : e[i] = o, t[i] && (t.jsonpCallback = n.jsonpCallback, Rt.push(i)), a && oe.isFunction(o) && o(a[0]), a = o = void 0
                }), "script"
            }), oe.parseHTML = function(e, t, n) {
                if (!e || "string" != typeof e) return null;
                "boolean" == typeof t && (n = t, t = !1), t = t || Y;
                var r = he.exec(e),
                    i = !n && [];
                return r ? [t.createElement(r[1])] : (r = d([e], t, i), i && i.length && oe(i).remove(), oe.merge([], r.childNodes))
            };
            var qt = oe.fn.load;
            oe.fn.load = function(e, t, n) {
                if ("string" != typeof e && qt) return qt.apply(this, arguments);
                var r, i, o, a = this,
                    s = e.indexOf(" ");
                return s > -1 && (r = oe.trim(e.slice(s)), e = e.slice(0, s)), oe.isFunction(t) ? (n = t, t = void 0) : t && "object" == typeof t && (i = "POST"), a.length > 0 && oe.ajax({
                    url: e,
                    type: i || "GET",
                    dataType: "html",
                    data: t
                }).done(function(e) {
                    o = arguments, a.html(r ? oe("<div>").append(oe.parseHTML(e)).find(r) : e)
                }).always(n && function(e, t) {
                    a.each(function() {
                        n.apply(this, o || [e.responseText, t, e])
                    })
                }), this
            }, oe.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
                oe.fn[t] = function(e) {
                    return this.on(t, e)
                }
            }), oe.expr.filters.animated = function(e) {
                return oe.grep(oe.timers, function(t) {
                    return e === t.elem
                }).length
            }, oe.offset = {
                setOffset: function(e, t, n) {
                    var r, i, o, a, s, u, c, l = oe.css(e, "position"),
                        f = oe(e),
                        d = {};
                    "static" === l && (e.style.position = "relative"), s = f.offset(), o = oe.css(e, "top"), u = oe.css(e, "left"), c = ("absolute" === l || "fixed" === l) && (o + u).indexOf("auto") > -1, c ? (r = f.position(), a = r.top, i = r.left) : (a = parseFloat(o) || 0, i = parseFloat(u) || 0), oe.isFunction(t) && (t = t.call(e, n, oe.extend({}, s))), null != t.top && (d.top = t.top - s.top + a), null != t.left && (d.left = t.left - s.left + i), "using" in t ? t.using.call(e, d) : f.css(d)
                }
            }, oe.fn.extend({
                offset: function(e) {
                    if (arguments.length) return void 0 === e ? this : this.each(function(t) {
                        oe.offset.setOffset(this, e, t)
                    });
                    var t, n, r = this[0],
                        i = {
                            top: 0,
                            left: 0
                        },
                        o = r && r.ownerDocument;
                    if (o) return t = o.documentElement, oe.contains(t, r) ? (i = r.getBoundingClientRect(), n = J(o), {
                        top: i.top + n.pageYOffset - t.clientTop,
                        left: i.left + n.pageXOffset - t.clientLeft
                    }) : i
                },
                position: function() {
                    if (this[0]) {
                        var e, t, n = this[0],
                            r = {
                                top: 0,
                                left: 0
                            };
                        return "fixed" === oe.css(n, "position") ? t = n.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), oe.nodeName(e[0], "html") || (r = e.offset()), r.top += oe.css(e[0], "borderTopWidth", !0), r.left += oe.css(e[0], "borderLeftWidth", !0)), {
                            top: t.top - r.top - oe.css(n, "marginTop", !0),
                            left: t.left - r.left - oe.css(n, "marginLeft", !0)
                        }
                    }
                },
                offsetParent: function() {
                    return this.map(function() {
                        for (var e = this.offsetParent; e && "static" === oe.css(e, "position");) e = e.offsetParent;
                        return e || Ke
                    })
                }
            }), oe.each({
                scrollLeft: "pageXOffset",
                scrollTop: "pageYOffset"
            }, function(e, t) {
                var n = "pageYOffset" === t;
                oe.fn[e] = function(r) {
                    return Se(this, function(e, r, i) {
                        var o = J(e);
                        return void 0 === i ? o ? o[t] : e[r] : void(o ? o.scrollTo(n ? o.pageXOffset : i, n ? i : o.pageYOffset) : e[r] = i)
                    }, e, r, arguments.length)
                }
            }), oe.each(["top", "left"], function(e, t) {
                oe.cssHooks[t] = N(re.pixelPosition, function(e, n) {
                    if (n) return n = k(e, t), Ye.test(n) ? oe(e).position()[t] + "px" : n
                })
            }), oe.each({
                Height: "height",
                Width: "width"
            }, function(e, t) {
                oe.each({
                    padding: "inner" + e,
                    content: t,
                    "": "outer" + e
                }, function(n, r) {
                    oe.fn[r] = function(r, i) {
                        var o = arguments.length && (n || "boolean" != typeof r),
                            a = n || (r === !0 || i === !0 ? "margin" : "border");
                        return Se(this, function(t, n, r) {
                            var i;
                            return oe.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (i = t.documentElement, Math.max(t.body["scroll" + e], i["scroll" + e], t.body["offset" + e], i["offset" + e], i["client" + e])) : void 0 === r ? oe.css(t, n, a) : oe.style(t, n, r, a)
                        }, t, o ? r : void 0, o, null)
                    }
                })
            }), oe.fn.extend({
                bind: function(e, t, n) {
                    return this.on(e, null, t, n)
                },
                unbind: function(e, t) {
                    return this.off(e, null, t)
                },
                delegate: function(e, t, n, r) {
                    return this.on(t, e, n, r)
                },
                undelegate: function(e, t, n) {
                    return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
                },
                size: function() {
                    return this.length
                }
            }), oe.fn.andSelf = oe.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
                return oe
            });
            var Bt = e.jQuery,
                Ft = e.$;
            return oe.noConflict = function(t) {
                return e.$ === oe && (e.$ = Ft), t && e.jQuery === oe && (e.jQuery = Bt), oe
            }, t || (e.jQuery = e.$ = oe), oe
        })
    }, {}],
    4: [function(e, t, n) {
        ! function(r) {
            "function" == typeof e && "object" == typeof n && "object" == typeof t ? r(e("knockout"), n) : "function" == typeof define && define.amd ? define(["knockout", "exports"], r) : r(ko, ko.mapping = {})
        }(function(e, t) {
            function n() {
                for (var e, t, n, r = arguments, i = r.length, o = {}, a = []; i--;)
                    for (n = r[i], e = n.length; e--;) t = n[e], o[t] || (o[t] = 1, a.push(t));
                return a
            }

            function r(e, i) {
                var o;
                for (var a in i)
                    if (i.hasOwnProperty(a) && i[a])
                        if (o = t.getType(e[a]), a && e[a] && "array" !== o && "string" !== o) r(e[a], i[a]);
                        else {
                            var s = "array" === t.getType(e[a]) && "array" === t.getType(i[a]);
                            s ? e[a] = n(e[a], i[a]) : e[a] = i[a]
                        }
            }

            function i(e, t) {
                var n = {};
                return r(n, e), r(n, t), n
            }

            function o(e, t) {
                for (var n = i({}, e), r = C.length - 1; r >= 0; r--) {
                    var o = C[r];
                    n[o] && (n[""] instanceof Object || (n[""] = {}), n[""][o] = n[o], delete n[o])
                }
                return t && (n.ignore = a(t.ignore, n.ignore), n.include = a(t.include, n.include), n.copy = a(t.copy, n.copy), n.observe = a(t.observe, n.observe)), n.ignore = a(n.ignore, N.ignore), n.include = a(n.include, N.include), n.copy = a(n.copy, N.copy), n.observe = a(n.observe, N.observe), n.mappedProperties = n.mappedProperties || {}, n.copiedProperties = n.copiedProperties || {}, n
            }

            function a(n, r) {
                return "array" !== t.getType(n) && (n = "undefined" === t.getType(n) ? [] : [n]), "array" !== t.getType(r) && (r = "undefined" === t.getType(r) ? [] : [r]), e.utils.arrayGetDistinctValues(n.concat(r))
            }

            function s(t, n) {
                var r = e.dependentObservable;
                e.dependentObservable = function(n, r, i) {
                    i = i || {}, n && "object" == typeof n && (i = n);
                    var o = i.deferEvaluation,
                        a = !1,
                        s = function(n) {
                            var r = e.dependentObservable;
                            e.dependentObservable = T;
                            var i = e.isWriteableObservable(n);
                            e.dependentObservable = r;
                            var o = T({
                                read: function() {
                                    return a || (e.utils.arrayRemoveItem(t, n), a = !0), n.apply(n, arguments)
                                },
                                write: i && function(e) {
                                    return n(e)
                                },
                                deferEvaluation: !0
                            });
                            return x && (o._wrapper = !0), o.__DO = n, o
                        };
                    i.deferEvaluation = !0;
                    var u = new T(n, r, i);
                    return o || (u = s(u), t.push(u)), u
                }, e.dependentObservable.fn = T.fn, e.computed = e.dependentObservable;
                var i = n();
                return e.dependentObservable = r, e.computed = e.dependentObservable, i
            }

            function u(n, r, o, a, l, g, v) {
                var m = "array" === t.getType(e.utils.unwrapObservable(r));
                if (g = g || "", t.isMapped(n)) {
                    var x = e.utils.unwrapObservable(n)[w];
                    o = i(x, o)
                }
                var T = {
                        data: r,
                        parent: v || l
                    },
                    S = function() {
                        return o[a] && o[a].create instanceof Function
                    },
                    C = function(t) {
                        return s(y, function() {
                            return e.utils.unwrapObservable(l) instanceof Array ? o[a].create({
                                data: t || T.data,
                                parent: T.parent,
                                skip: E
                            }) : o[a].create({
                                data: t || T.data,
                                parent: T.parent
                            })
                        })
                    },
                    k = function() {
                        return o[a] && o[a].update instanceof Function
                    },
                    N = function(t, n) {
                        var r = {
                            data: n || T.data,
                            parent: T.parent,
                            target: e.utils.unwrapObservable(t)
                        };
                        return e.isWriteableObservable(t) && (r.observable = t), o[a].update(r)
                    },
                    j = b.get(r);
                if (j) return j;
                if (a = a || "", m) {
                    var I = [],
                        A = !1,
                        O = function(e) {
                            return e
                        };
                    o[a] && o[a].key && (O = o[a].key, A = !0), e.isObservable(n) || (n = e.observableArray([]), n.mappedRemove = function(e) {
                        var t = "function" == typeof e ? e : function(t) {
                            return t === O(e)
                        };
                        return n.remove(function(e) {
                            return t(O(e))
                        })
                    }, n.mappedRemoveAll = function(t) {
                        var r = d(t, O);
                        return n.remove(function(t) {
                            return e.utils.arrayIndexOf(r, O(t)) != -1
                        })
                    }, n.mappedDestroy = function(e) {
                        var t = "function" == typeof e ? e : function(t) {
                            return t === O(e)
                        };
                        return n.destroy(function(e) {
                            return t(O(e))
                        })
                    }, n.mappedDestroyAll = function(t) {
                        var r = d(t, O);
                        return n.destroy(function(t) {
                            return e.utils.arrayIndexOf(r, O(t)) != -1
                        })
                    }, n.mappedIndexOf = function(t) {
                        var r = d(n(), O),
                            i = O(t);
                        return e.utils.arrayIndexOf(r, i)
                    }, n.mappedGet = function(e) {
                        return n()[n.mappedIndexOf(e)]
                    }, n.mappedCreate = function(t) {
                        if (n.mappedIndexOf(t) !== -1) throw new Error("There already is an object with the key that you specified.");
                        var r = S() ? C(t) : t;
                        if (k()) {
                            var i = N(r, t);
                            e.isWriteableObservable(r) ? r(i) : r = i
                        }
                        return n.push(r), r
                    });
                    var D = d(e.utils.unwrapObservable(n), O).sort(),
                        H = d(r, O);
                    A && H.sort();
                    var L, P, R, _ = e.utils.compareArrays(D, H),
                        q = {},
                        B = e.utils.unwrapObservable(r),
                        F = {},
                        M = !0;
                    for (L = 0, P = B.length; L < P; L++) {
                        if (R = O(B[L]), void 0 === R || R instanceof Object) {
                            M = !1;
                            break
                        }
                        F[R] = B[L]
                    }
                    var $ = [],
                        U = 0;
                    for (L = 0, P = _.length; L < P; L++) {
                        R = _[L];
                        var W, V, z, J = g + "[" + L + "]";
                        switch (R.status) {
                            case "added":
                                V = M ? F[R.value] : f(e.utils.unwrapObservable(r), R.value, O), W = u(void 0, V, o, a, n, J, l), S() || (W = e.utils.unwrapObservable(W)), z = c(e.utils.unwrapObservable(r), V, q), W === E ? U++ : $[z - U] = W, q[z] = !0;
                                break;
                            case "retained":
                                V = M ? F[R.value] : f(e.utils.unwrapObservable(r), R.value, O), W = f(n, R.value, O), u(W, V, o, a, n, J, l), z = c(e.utils.unwrapObservable(r), V, q), $[z] = W, q[z] = !0;
                                break;
                            case "deleted":
                                W = f(n, R.value, O)
                        }
                        I.push({
                            event: R.status,
                            item: W
                        })
                    }
                    n($), o[a] && o[a].arrayChanged && e.utils.arrayForEach(I, function(e) {
                        o[a].arrayChanged(e.event, e.item)
                    })
                } else if (h(r)) {
                    if (n = e.utils.unwrapObservable(n), !n) {
                        if (S()) {
                            var X = C();
                            return k() && (X = N(X)), X
                        }
                        if (k()) return N(X);
                        n = {}
                    }
                    if (k() && (n = N(n)), b.save(r, n), k()) return n;
                    p(r, function(t) {
                        var i = g.length ? g + "." + t : t;
                        if (e.utils.arrayIndexOf(o.ignore, i) == -1) {
                            if (e.utils.arrayIndexOf(o.copy, i) != -1) return void(n[t] = r[t]);
                            if ("object" != typeof r[t] && "array" != typeof r[t] && o.observe.length > 0 && e.utils.arrayIndexOf(o.observe, i) == -1) return n[t] = r[t], void(o.copiedProperties[i] = !0);
                            var a = b.get(r[t]),
                                s = u(n[t], r[t], o, t, n, i, n),
                                c = a || s;
                            if (o.observe.length > 0 && e.utils.arrayIndexOf(o.observe, i) == -1) return n[t] = e.utils.unwrapObservable(c), void(o.copiedProperties[i] = !0);
                            e.isWriteableObservable(n[t]) ? (c = e.utils.unwrapObservable(c), n[t]() !== c && n[t](c)) : (c = void 0 === n[t] ? c : e.utils.unwrapObservable(c), n[t] = c), o.mappedProperties[i] = !0
                        }
                    })
                } else switch (t.getType(r)) {
                    case "function":
                        k() ? e.isWriteableObservable(r) ? (r(N(r)), n = r) : n = N(r) : n = r;
                        break;
                    default:
                        var Y;
                        if (e.isWriteableObservable(n)) return k() ? (Y = N(n), n(Y), Y) : (Y = e.utils.unwrapObservable(r), n(Y), Y);
                        var Q = S() || k();
                        if (n = S() ? C() : e.observable(e.utils.unwrapObservable(r)), k() && n(N(n)), Q) return n
                }
                return n
            }

            function c(e, t, n) {
                for (var r = 0, i = e.length; r < i; r++)
                    if (n[r] !== !0 && e[r] === t) return r;
                return null
            }

            function l(n, r) {
                var i;
                return r && (i = r(n)), "undefined" === t.getType(i) && (i = n), e.utils.unwrapObservable(i)
            }

            function f(t, n, r) {
                t = e.utils.unwrapObservable(t);
                for (var i = 0, o = t.length; i < o; i++) {
                    var a = t[i];
                    if (l(a, r) === n) return a
                }
                throw new Error("When calling ko.update*, the key '" + n + "' was not found!")
            }

            function d(t, n) {
                return e.utils.arrayMap(e.utils.unwrapObservable(t), function(e) {
                    return n ? l(e, n) : e
                })
            }

            function p(e, n) {
                if ("array" === t.getType(e))
                    for (var r = 0; r < e.length; r++) n(r);
                else
                    for (var i in e) n(i)
            }

            function h(e) {
                var n = t.getType(e);
                return ("object" === n || "array" === n) && null !== e
            }

            function g(e, n, r) {
                var i = e || "";
                return "array" === t.getType(n) ? e && (i += "[" + r + "]") : (e && (i += "."), i += r), i
            }

            function v() {
                var t = [],
                    n = [];
                this.save = function(r, i) {
                    var o = e.utils.arrayIndexOf(t, r);
                    o >= 0 ? n[o] = i : (t.push(r), n.push(i))
                }, this.get = function(r) {
                    var i = e.utils.arrayIndexOf(t, r),
                        o = i >= 0 ? n[i] : void 0;
                    return o
                }
            }

            function m() {
                var e = {},
                    t = function(t) {
                        var n;
                        try {
                            n = t
                        } catch (r) {
                            n = "$$$"
                        }
                        var i = e[n];
                        return void 0 === i && (i = new v, e[n] = i), i
                    };
                this.save = function(e, n) {
                    t(e).save(e, n)
                }, this.get = function(e) {
                    return t(e).get(e)
                }
            }
            var y, b, x = !0,
                w = "__ko_mapping__",
                T = e.dependentObservable,
                S = 0,
                C = ["create", "update", "key", "arrayChanged"],
                E = {},
                k = {
                    include: ["_destroy"],
                    ignore: [],
                    copy: [],
                    observe: []
                },
                N = k;
            t.isMapped = function(t) {
                var n = e.utils.unwrapObservable(t);
                return n && n[w]
            }, t.fromJS = function(e) {
                if (!arguments.length) throw new Error("When calling ko.mapping.fromJS, pass the object you want to convert.");
                try {
                    S++ || (y = [], b = new m);
                    var t, n;
                    2 == arguments.length && (arguments[1][w] ? n = arguments[1] : t = arguments[1]), 3 == arguments.length && (t = arguments[1], n = arguments[2]), n && (t = i(t, n[w])), t = o(t);
                    var r = u(n, e, t);
                    if (n && (r = n), !--S)
                        for (; y.length;) {
                            var a = y.pop();
                            a && (a(), a.__DO.throttleEvaluation = a.throttleEvaluation)
                        }
                    return r[w] = i(r[w], t), r
                } catch (s) {
                    throw S = 0, s
                }
            }, t.fromJSON = function(n) {
                var r = e.utils.parseJson(n),
                    i = Array.prototype.slice.call(arguments);
                return i[0] = r, t.fromJS.apply(this, i)
            }, t.updateFromJS = function(e) {
                throw new Error("ko.mapping.updateFromJS, use ko.mapping.fromJS instead. Please note that the order of parameters is different!")
            }, t.updateFromJSON = function(e) {
                throw new Error("ko.mapping.updateFromJSON, use ko.mapping.fromJSON instead. Please note that the order of parameters is different!")
            }, t.toJS = function(n, r) {
                if (N || t.resetDefaultOptions(), !arguments.length) throw new Error("When calling ko.mapping.toJS, pass the object you want to convert.");
                if ("array" !== t.getType(N.ignore)) throw new Error("ko.mapping.defaultOptions().ignore should be an array.");
                if ("array" !== t.getType(N.include)) throw new Error("ko.mapping.defaultOptions().include should be an array.");
                if ("array" !== t.getType(N.copy)) throw new Error("ko.mapping.defaultOptions().copy should be an array.");
                return r = o(r, n[w]), t.visitModel(n, function(t) {
                    return e.utils.unwrapObservable(t)
                }, r)
            }, t.toJSON = function(n, r) {
                var i = t.toJS(n, r);
                return e.utils.stringifyJson(i)
            }, t.defaultOptions = function() {
                return arguments.length > 0 ? void(N = arguments[0]) : N
            }, t.resetDefaultOptions = function() {
                N = {
                    include: k.include.slice(0),
                    ignore: k.ignore.slice(0),
                    copy: k.copy.slice(0),
                    observe: k.observe.slice(0)
                }
            }, t.getType = function(e) {
                if (e && "object" == typeof e) {
                    if (e.constructor === Date) return "date";
                    if (e.constructor === Array) return "array"
                }
                return typeof e
            }, t.visitModel = function(n, r, i) {
                i = i || {}, i.visitedObjects = i.visitedObjects || new m;
                var a, s = e.utils.unwrapObservable(n);
                if (!h(s)) return r(n, i.parentName);
                i = o(i, s[w]), r(n, i.parentName), a = "array" === t.getType(s) ? [] : {}, i.visitedObjects.save(n, a);
                var u = i.parentName;
                return p(s, function(n) {
                    if (!i.ignore || e.utils.arrayIndexOf(i.ignore, n) == -1) {
                        var o = s[n];
                        if (i.parentName = g(u, s, n), e.utils.arrayIndexOf(i.copy, n) !== -1 || e.utils.arrayIndexOf(i.include, n) !== -1 || !s[w] || !s[w].mappedProperties || s[w].mappedProperties[n] || !s[w].copiedProperties || s[w].copiedProperties[n] || "array" === t.getType(s)) {
                            switch (t.getType(e.utils.unwrapObservable(o))) {
                                case "object":
                                case "array":
                                case "undefined":
                                    var c = i.visitedObjects.get(o);
                                    a[n] = "undefined" !== t.getType(c) ? c : t.visitModel(o, r, i);
                                    break;
                                default:
                                    a[n] = r(o, i.parentName)
                            }
                        }
                    }
                }), a
            }
        })
    }, {
        knockout: 5
    }],
    5: [function(e, t, n) {
        ! function() {
            ! function(e) {
                var r = this || (0, eval)("this"),
                    i = r.document,
                    o = r.navigator,
                    a = r.jQuery,
                    s = r.JSON;
                a || "undefined" == typeof jQuery || (a = jQuery),
                    function(e) {
                        "function" == typeof define && define.amd ? define(["exports", "require"], e) : e("object" == typeof n && "object" == typeof t ? t.exports || n : r.ko = {})
                    }(function(t, n) {
                        function u(e, t) {
                            return (null === e || typeof e in g) && e === t
                        }

                        function c(t, n) {
                            var r;
                            return function() {
                                r || (r = h.a.setTimeout(function() {
                                    r = e, t()
                                }, n))
                            }
                        }

                        function l(e, t) {
                            var n;
                            return function() {
                                clearTimeout(n), n = h.a.setTimeout(e, t)
                            }
                        }

                        function f(e, t) {
                            t && "change" !== t ? "beforeChange" === t ? this.pc(e) : this.gb(e, t) : this.qc(e)
                        }

                        function d(e, t) {
                            null !== t && t.s && t.s()
                        }

                        function p(e, t) {
                            var n = this.qd,
                                r = n[x];
                            r.ra || (this.Qb && this.mb[t] ? (n.uc(t, e, this.mb[t]), this.mb[t] = null, --this.Qb) : r.I[t] || n.uc(t, e, r.J ? {
                                da: e
                            } : n.$c(e)), e.Ja && e.gd())
                        }
                        var h = "undefined" != typeof t ? t : {};
                        h.b = function(e, t) {
                                for (var n = e.split("."), r = h, i = 0; i < n.length - 1; i++) r = r[n[i]];
                                r[n[n.length - 1]] = t
                            }, h.L = function(e, t, n) {
                                e[t] = n
                            }, h.version = "3.5.1", h.b("version", h.version), h.options = {
                                deferUpdates: !1,
                                useOnlyNativeEvents: !1,
                                foreachHidesDestroyed: !1
                            }, h.a = function() {
                                function t(e, t) {
                                    for (var n in e) l.call(e, n) && t(n, e[n])
                                }

                                function n(e, t) {
                                    if (t)
                                        for (var n in t) l.call(t, n) && (e[n] = t[n]);
                                    return e
                                }

                                function u(e, t) {
                                    return e.__proto__ = t, e
                                }

                                function c(e, t, n, r) {
                                    var i = e[t].match(b) || [];
                                    h.a.D(n.match(b), function(e) {
                                        h.a.Na(i, e, r)
                                    }), e[t] = i.join(" ")
                                }
                                var l = Object.prototype.hasOwnProperty,
                                    f = {
                                        __proto__: []
                                    }
                                instanceof Array, d = "function" == typeof Symbol, p = {}, g = {};
                                p[o && /Firefox\/2/i.test(o.userAgent) ? "KeyboardEvent" : "UIEvents"] = ["keyup", "keydown", "keypress"], p.MouseEvents = "click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave".split(" "), t(p, function(e, t) {
                                    if (t.length)
                                        for (var n = 0, r = t.length; n < r; n++) g[t[n]] = e
                                });
                                var v, m = {
                                        propertychange: !0
                                    },
                                    y = i && function() {
                                        for (var t = 3, n = i.createElement("div"), r = n.getElementsByTagName("i"); n.innerHTML = "<!--[if gt IE " + ++t + "]><i></i><![endif]-->", r[0];);
                                        return 4 < t ? t : e
                                    }(),
                                    b = /\S+/g;
                                return {
                                    Jc: ["authenticity_token", /^__RequestVerificationToken(_.*)?$/],
                                    D: function(e, t, n) {
                                        for (var r = 0, i = e.length; r < i; r++) t.call(n, e[r], r, e)
                                    },
                                    A: "function" == typeof Array.prototype.indexOf ? function(e, t) {
                                        return Array.prototype.indexOf.call(e, t)
                                    } : function(e, t) {
                                        for (var n = 0, r = e.length; n < r; n++)
                                            if (e[n] === t) return n;
                                        return -1
                                    },
                                    Lb: function(t, n, r) {
                                        for (var i = 0, o = t.length; i < o; i++)
                                            if (n.call(r, t[i], i, t)) return t[i];
                                        return e
                                    },
                                    Pa: function(e, t) {
                                        var n = h.a.A(e, t);
                                        0 < n ? e.splice(n, 1) : 0 === n && e.shift()
                                    },
                                    wc: function(e) {
                                        var t = [];
                                        return e && h.a.D(e, function(e) {
                                            0 > h.a.A(t, e) && t.push(e)
                                        }), t
                                    },
                                    Mb: function(e, t, n) {
                                        var r = [];
                                        if (e)
                                            for (var i = 0, o = e.length; i < o; i++) r.push(t.call(n, e[i], i));
                                        return r
                                    },
                                    jb: function(e, t, n) {
                                        var r = [];
                                        if (e)
                                            for (var i = 0, o = e.length; i < o; i++) t.call(n, e[i], i) && r.push(e[i]);
                                        return r
                                    },
                                    Nb: function(e, t) {
                                        if (t instanceof Array) e.push.apply(e, t);
                                        else
                                            for (var n = 0, r = t.length; n < r; n++) e.push(t[n]);
                                        return e
                                    },
                                    Na: function(e, t, n) {
                                        var r = h.a.A(h.a.bc(e), t);
                                        0 > r ? n && e.push(t) : n || e.splice(r, 1)
                                    },
                                    Ba: f,
                                    extend: n,
                                    setPrototypeOf: u,
                                    Ab: f ? u : n,
                                    P: t,
                                    Ga: function(e, t, n) {
                                        if (!e) return e;
                                        var r, i = {};
                                        for (r in e) l.call(e, r) && (i[r] = t.call(n, e[r], r, e));
                                        return i
                                    },
                                    Tb: function(e) {
                                        for (; e.firstChild;) h.removeNode(e.firstChild)
                                    },
                                    Yb: function(e) {
                                        e = h.a.la(e);
                                        for (var t = (e[0] && e[0].ownerDocument || i).createElement("div"), n = 0, r = e.length; n < r; n++) t.appendChild(h.oa(e[n]));
                                        return t
                                    },
                                    Ca: function(e, t) {
                                        for (var n = 0, r = e.length, i = []; n < r; n++) {
                                            var o = e[n].cloneNode(!0);
                                            i.push(t ? h.oa(o) : o)
                                        }
                                        return i
                                    },
                                    va: function(e, t) {
                                        if (h.a.Tb(e), t)
                                            for (var n = 0, r = t.length; n < r; n++) e.appendChild(t[n])
                                    },
                                    Xc: function(e, t) {
                                        var n = e.nodeType ? [e] : e;
                                        if (0 < n.length) {
                                            for (var r = n[0], i = r.parentNode, o = 0, a = t.length; o < a; o++) i.insertBefore(t[o], r);
                                            for (o = 0, a = n.length; o < a; o++) h.removeNode(n[o])
                                        }
                                    },
                                    Ua: function(e, t) {
                                        if (e.length) {
                                            for (t = 8 === t.nodeType && t.parentNode || t; e.length && e[0].parentNode !== t;) e.splice(0, 1);
                                            for (; 1 < e.length && e[e.length - 1].parentNode !== t;) e.length--;
                                            if (1 < e.length) {
                                                var n = e[0],
                                                    r = e[e.length - 1];
                                                for (e.length = 0; n !== r;) e.push(n), n = n.nextSibling;
                                                e.push(r)
                                            }
                                        }
                                        return e
                                    },
                                    Zc: function(e, t) {
                                        7 > y ? e.setAttribute("selected", t) : e.selected = t
                                    },
                                    Db: function(t) {
                                        return null === t || t === e ? "" : t.trim ? t.trim() : t.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
                                    },
                                    Ud: function(e, t) {
                                        return e = e || "", !(t.length > e.length) && e.substring(0, t.length) === t
                                    },
                                    vd: function(e, t) {
                                        if (e === t) return !0;
                                        if (11 === e.nodeType) return !1;
                                        if (t.contains) return t.contains(1 !== e.nodeType ? e.parentNode : e);
                                        if (t.compareDocumentPosition) return 16 == (16 & t.compareDocumentPosition(e));
                                        for (; e && e != t;) e = e.parentNode;
                                        return !!e
                                    },
                                    Sb: function(e) {
                                        return h.a.vd(e, e.ownerDocument.documentElement)
                                    },
                                    kd: function(e) {
                                        return !!h.a.Lb(e, h.a.Sb)
                                    },
                                    R: function(e) {
                                        return e && e.tagName && e.tagName.toLowerCase()
                                    },
                                    Ac: function(e) {
                                        return h.onError ? function() {
                                            try {
                                                return e.apply(this, arguments)
                                            } catch (t) {
                                                throw h.onError && h.onError(t), t
                                            }
                                        } : e
                                    },
                                    setTimeout: function(e, t) {
                                        return setTimeout(h.a.Ac(e), t)
                                    },
                                    Gc: function(e) {
                                        setTimeout(function() {
                                            throw h.onError && h.onError(e), e
                                        }, 0)
                                    },
                                    B: function(e, t, n) {
                                        var r = h.a.Ac(n);
                                        if (n = m[t], h.options.useOnlyNativeEvents || n || !a)
                                            if (n || "function" != typeof e.addEventListener) {
                                                if ("undefined" == typeof e.attachEvent) throw Error("Browser doesn't support addEventListener or attachEvent");
                                                var i = function(t) {
                                                        r.call(e, t)
                                                    },
                                                    o = "on" + t;
                                                e.attachEvent(o, i), h.a.K.za(e, function() {
                                                    e.detachEvent(o, i)
                                                })
                                            } else e.addEventListener(t, r, !1);
                                        else v || (v = "function" == typeof a(e).on ? "on" : "bind"), a(e)[v](t, r)
                                    },
                                    Fb: function(e, t) {
                                        if (!e || !e.nodeType) throw Error("element must be a DOM node when calling triggerEvent");
                                        var n;
                                        if ("input" === h.a.R(e) && e.type && "click" == t.toLowerCase() ? (n = e.type, n = "checkbox" == n || "radio" == n) : n = !1, h.options.useOnlyNativeEvents || !a || n)
                                            if ("function" == typeof i.createEvent) {
                                                if ("function" != typeof e.dispatchEvent) throw Error("The supplied element doesn't support dispatchEvent");
                                                n = i.createEvent(g[t] || "HTMLEvents"), n.initEvent(t, !0, !0, r, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, e), e.dispatchEvent(n)
                                            } else if (n && e.click) e.click();
                                        else {
                                            if ("undefined" == typeof e.fireEvent) throw Error("Browser doesn't support triggering events");
                                            e.fireEvent("on" + t)
                                        } else a(e).trigger(t)
                                    },
                                    f: function(e) {
                                        return h.O(e) ? e() : e
                                    },
                                    bc: function(e) {
                                        return h.O(e) ? e.v() : e
                                    },
                                    Eb: function(e, t, n) {
                                        var r;
                                        t && ("object" == typeof e.classList ? (r = e.classList[n ? "add" : "remove"], h.a.D(t.match(b), function(t) {
                                            r.call(e.classList, t)
                                        })) : "string" == typeof e.className.baseVal ? c(e.className, "baseVal", t, n) : c(e, "className", t, n))
                                    },
                                    Bb: function(t, n) {
                                        var r = h.a.f(n);
                                        null !== r && r !== e || (r = "");
                                        var i = h.h.firstChild(t);
                                        !i || 3 != i.nodeType || h.h.nextSibling(i) ? h.h.va(t, [t.ownerDocument.createTextNode(r)]) : i.data = r, h.a.Ad(t)
                                    },
                                    Yc: function(e, t) {
                                        if (e.name = t, 7 >= y) try {
                                            var n = e.name.replace(/[&<>'"]/g, function(e) {
                                                return "&#" + e.charCodeAt(0) + ";"
                                            });
                                            e.mergeAttributes(i.createElement("<input name='" + n + "'/>"), !1)
                                        } catch (r) {}
                                    },
                                    Ad: function(e) {
                                        9 <= y && (e = 1 == e.nodeType ? e : e.parentNode, e.style && (e.style.zoom = e.style.zoom))
                                    },
                                    wd: function(e) {
                                        if (y) {
                                            var t = e.style.width;
                                            e.style.width = 0, e.style.width = t
                                        }
                                    },
                                    Pd: function(e, t) {
                                        e = h.a.f(e), t = h.a.f(t);
                                        for (var n = [], r = e; r <= t; r++) n.push(r);
                                        return n
                                    },
                                    la: function(e) {
                                        for (var t = [], n = 0, r = e.length; n < r; n++) t.push(e[n]);
                                        return t
                                    },
                                    Da: function(e) {
                                        return d ? Symbol(e) : e
                                    },
                                    Zd: 6 === y,
                                    $d: 7 === y,
                                    W: y,
                                    Lc: function(e, t) {
                                        for (var n = h.a.la(e.getElementsByTagName("input")).concat(h.a.la(e.getElementsByTagName("textarea"))), r = "string" == typeof t ? function(e) {
                                                return e.name === t
                                            } : function(e) {
                                                return t.test(e.name)
                                            }, i = [], o = n.length - 1; 0 <= o; o--) r(n[o]) && i.push(n[o]);
                                        return i
                                    },
                                    Nd: function(e) {
                                        return "string" == typeof e && (e = h.a.Db(e)) ? s && s.parse ? s.parse(e) : new Function("return " + e)() : null
                                    },
                                    hc: function(e, t, n) {
                                        if (!s || !s.stringify) throw Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
                                        return s.stringify(h.a.f(e), t, n)
                                    },
                                    Od: function(e, n, r) {
                                        r = r || {};
                                        var o = r.params || {},
                                            a = r.includeFields || this.Jc,
                                            s = e;
                                        if ("object" == typeof e && "form" === h.a.R(e))
                                            for (var s = e.action, u = a.length - 1; 0 <= u; u--)
                                                for (var c = h.a.Lc(e, a[u]), l = c.length - 1; 0 <= l; l--) o[c[l].name] = c[l].value;
                                        n = h.a.f(n);
                                        var f = i.createElement("form");
                                        f.style.display = "none", f.action = s, f.method = "post";
                                        for (var d in n) e = i.createElement("input"), e.type = "hidden", e.name = d, e.value = h.a.hc(h.a.f(n[d])), f.appendChild(e);
                                        t(o, function(e, t) {
                                            var n = i.createElement("input");
                                            n.type = "hidden", n.name = e, n.value = t, f.appendChild(n)
                                        }), i.body.appendChild(f), r.submitter ? r.submitter(f) : f.submit(), setTimeout(function() {
                                            f.parentNode.removeChild(f)
                                        }, 0)
                                    }
                                }
                            }(), h.b("utils", h.a), h.b("utils.arrayForEach", h.a.D), h.b("utils.arrayFirst", h.a.Lb), h.b("utils.arrayFilter", h.a.jb), h.b("utils.arrayGetDistinctValues", h.a.wc), h.b("utils.arrayIndexOf", h.a.A), h.b("utils.arrayMap", h.a.Mb), h.b("utils.arrayPushAll", h.a.Nb), h.b("utils.arrayRemoveItem", h.a.Pa), h.b("utils.cloneNodes", h.a.Ca), h.b("utils.createSymbolOrString", h.a.Da), h.b("utils.extend", h.a.extend), h.b("utils.fieldsIncludedWithJsonPost", h.a.Jc), h.b("utils.getFormFields", h.a.Lc), h.b("utils.objectMap", h.a.Ga), h.b("utils.peekObservable", h.a.bc), h.b("utils.postJson", h.a.Od), h.b("utils.parseJson", h.a.Nd), h.b("utils.registerEventHandler", h.a.B), h.b("utils.stringifyJson", h.a.hc), h.b("utils.range", h.a.Pd), h.b("utils.toggleDomNodeCssClass", h.a.Eb), h.b("utils.triggerEvent", h.a.Fb), h.b("utils.unwrapObservable", h.a.f), h.b("utils.objectForEach", h.a.P), h.b("utils.addOrRemoveItem", h.a.Na), h.b("utils.setTextContent", h.a.Bb), h.b("unwrap", h.a.f), Function.prototype.bind || (Function.prototype.bind = function(e) {
                                var t = this;
                                if (1 === arguments.length) return function() {
                                    return t.apply(e, arguments)
                                };
                                var n = Array.prototype.slice.call(arguments, 1);
                                return function() {
                                    var r = n.slice(0);
                                    return r.push.apply(r, arguments), t.apply(e, r)
                                }
                            }), h.a.g = new function() {
                                var t, n, r = 0,
                                    i = "__ko__" + (new Date).getTime(),
                                    o = {};
                                return h.a.W ? (t = function(t, n) {
                                    var a = t[i];
                                    if (!a || "null" === a || !o[a]) {
                                        if (!n) return e;
                                        a = t[i] = "ko" + r++, o[a] = {}
                                    }
                                    return o[a]
                                }, n = function(e) {
                                    var t = e[i];
                                    return !!t && (delete o[t], e[i] = null, !0)
                                }) : (t = function(e, t) {
                                    var n = e[i];
                                    return !n && t && (n = e[i] = {}), n
                                }, n = function(e) {
                                    return !!e[i] && (delete e[i], !0)
                                }), {
                                    get: function(e, n) {
                                        var r = t(e, !1);
                                        return r && r[n]
                                    },
                                    set: function(n, r, i) {
                                        (n = t(n, i !== e)) && (n[r] = i)
                                    },
                                    Ub: function(e, n, r) {
                                        return e = t(e, !0), e[n] || (e[n] = r)
                                    },
                                    clear: n,
                                    Z: function() {
                                        return r++ + i
                                    }
                                }
                            }, h.b("utils.domData", h.a.g), h.b("utils.domData.clear", h.a.g.clear), h.a.K = new function() {
                                function t(t, n) {
                                    var r = h.a.g.get(t, i);
                                    return r === e && n && (r = [], h.a.g.set(t, i, r)), r
                                }

                                function n(e) {
                                    var n = t(e, !1);
                                    if (n)
                                        for (var n = n.slice(0), i = 0; i < n.length; i++) n[i](e);
                                    h.a.g.clear(e), h.a.K.cleanExternalData(e), s[e.nodeType] && r(e.childNodes, !0)
                                }

                                function r(e, t) {
                                    for (var r, i = [], o = 0; o < e.length; o++)
                                        if ((!t || 8 === e[o].nodeType) && (n(i[i.length] = r = e[o]), e[o] !== r))
                                            for (; o-- && -1 == h.a.A(i, e[o]););
                                }
                                var i = h.a.g.Z(),
                                    o = {
                                        1: !0,
                                        8: !0,
                                        9: !0
                                    },
                                    s = {
                                        1: !0,
                                        9: !0
                                    };
                                return {
                                    za: function(e, n) {
                                        if ("function" != typeof n) throw Error("Callback must be a function");
                                        t(e, !0).push(n)
                                    },
                                    yb: function(n, r) {
                                        var o = t(n, !1);
                                        o && (h.a.Pa(o, r), 0 == o.length && h.a.g.set(n, i, e))
                                    },
                                    oa: function(e) {
                                        return h.u.G(function() {
                                            o[e.nodeType] && (n(e), s[e.nodeType] && r(e.getElementsByTagName("*")))
                                        }), e
                                    },
                                    removeNode: function(e) {
                                        h.oa(e), e.parentNode && e.parentNode.removeChild(e)
                                    },
                                    cleanExternalData: function(e) {
                                        a && "function" == typeof a.cleanData && a.cleanData([e])
                                    }
                                }
                            }, h.oa = h.a.K.oa, h.removeNode = h.a.K.removeNode, h.b("cleanNode", h.oa), h.b("removeNode", h.removeNode), h.b("utils.domNodeDisposal", h.a.K), h.b("utils.domNodeDisposal.addDisposeCallback", h.a.K.za), h.b("utils.domNodeDisposal.removeDisposeCallback", h.a.K.yb),
                            function() {
                                var t = [0, "", ""],
                                    n = [1, "<table>", "</table>"],
                                    o = [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                                    s = [1, "<select multiple='multiple'>", "</select>"],
                                    u = {
                                        thead: n,
                                        tbody: n,
                                        tfoot: n,
                                        tr: [2, "<table><tbody>", "</tbody></table>"],
                                        td: o,
                                        th: o,
                                        option: s,
                                        optgroup: s
                                    },
                                    c = 8 >= h.a.W;
                                h.a.ua = function(e, n) {
                                    var o;
                                    if (a) {
                                        if (a.parseHTML) o = a.parseHTML(e, n) || [];
                                        else if ((o = a.clean([e], n)) && o[0]) {
                                            for (var s = o[0]; s.parentNode && 11 !== s.parentNode.nodeType;) s = s.parentNode;
                                            s.parentNode && s.parentNode.removeChild(s)
                                        }
                                    } else {
                                        (o = n) || (o = i);
                                        var l, s = o.parentWindow || o.defaultView || r,
                                            f = h.a.Db(e).toLowerCase(),
                                            d = o.createElement("div");
                                        for (l = (f = f.match(/^(?:\x3c!--.*?--\x3e\s*?)*?<([a-z]+)[\s>]/)) && u[f[1]] || t, f = l[0], l = "ignored<div>" + l[1] + e + l[2] + "</div>", "function" == typeof s.innerShiv ? d.appendChild(s.innerShiv(l)) : (c && o.body.appendChild(d), d.innerHTML = l, c && d.parentNode.removeChild(d)); f--;) d = d.lastChild;
                                        o = h.a.la(d.lastChild.childNodes)
                                    }
                                    return o
                                }, h.a.Md = function(e, t) {
                                    var n = h.a.ua(e, t);
                                    return n.length && n[0].parentElement || h.a.Yb(n)
                                }, h.a.fc = function(t, n) {
                                    if (h.a.Tb(t), n = h.a.f(n), null !== n && n !== e)
                                        if ("string" != typeof n && (n = n.toString()), a) a(t).html(n);
                                        else
                                            for (var r = h.a.ua(n, t.ownerDocument), i = 0; i < r.length; i++) t.appendChild(r[i])
                                }
                            }(), h.b("utils.parseHtmlFragment", h.a.ua), h.b("utils.setHtml", h.a.fc), h.aa = function() {
                                function t(e, n) {
                                    if (e)
                                        if (8 == e.nodeType) {
                                            var r = h.aa.Uc(e.nodeValue);
                                            null != r && n.push({
                                                ud: e,
                                                Kd: r
                                            })
                                        } else if (1 == e.nodeType)
                                        for (var r = 0, i = e.childNodes, o = i.length; r < o; r++) t(i[r], n)
                                }
                                var n = {};
                                return {
                                    Xb: function(e) {
                                        if ("function" != typeof e) throw Error("You can only pass a function to ko.memoization.memoize()");
                                        var t = (4294967296 * (1 + Math.random()) | 0).toString(16).substring(1) + (4294967296 * (1 + Math.random()) | 0).toString(16).substring(1);
                                        return n[t] = e, "<!--[ko_memo:" + t + "]-->"
                                    },
                                    bd: function(t, r) {
                                        var i = n[t];
                                        if (i === e) throw Error("Couldn't find any memo with ID " + t + ". Perhaps it's already been unmemoized.");
                                        try {
                                            return i.apply(null, r || []), !0
                                        } finally {
                                            delete n[t]
                                        }
                                    },
                                    cd: function(e, n) {
                                        var r = [];
                                        t(e, r);
                                        for (var i = 0, o = r.length; i < o; i++) {
                                            var a = r[i].ud,
                                                s = [a];
                                            n && h.a.Nb(s, n), h.aa.bd(r[i].Kd, s), a.nodeValue = "", a.parentNode && a.parentNode.removeChild(a)
                                        }
                                    },
                                    Uc: function(e) {
                                        return (e = e.match(/^\[ko_memo\:(.*?)\]$/)) ? e[1] : null
                                    }
                                }
                            }(), h.b("memoization", h.aa), h.b("memoization.memoize", h.aa.Xb), h.b("memoization.unmemoize", h.aa.bd), h.b("memoization.parseMemoText", h.aa.Uc), h.b("memoization.unmemoizeDomNodeAndDescendants", h.aa.cd), h.na = function() {
                                function e() {
                                    if (a)
                                        for (var e, t = a, n = 0; u < a;)
                                            if (e = o[u++]) {
                                                if (u > t) {
                                                    if (5e3 <= ++n) {
                                                        u = a, h.a.Gc(Error("'Too much recursion' after processing " + n + " task groups."));
                                                        break
                                                    }
                                                    t = a
                                                }
                                                try {
                                                    e()
                                                } catch (r) {
                                                    h.a.Gc(r)
                                                }
                                            }
                                }

                                function t() {
                                    e(), u = a = o.length = 0
                                }
                                var n, o = [],
                                    a = 0,
                                    s = 1,
                                    u = 0;
                                return n = r.MutationObserver ? function(e) {
                                    var t = i.createElement("div");
                                    return new MutationObserver(e).observe(t, {
                                            attributes: !0
                                        }),
                                        function() {
                                            t.classList.toggle("foo")
                                        }
                                }(t) : i && "onreadystatechange" in i.createElement("script") ? function(e) {
                                    var t = i.createElement("script");
                                    t.onreadystatechange = function() {
                                        t.onreadystatechange = null, i.documentElement.removeChild(t), t = null, e()
                                    }, i.documentElement.appendChild(t)
                                } : function(e) {
                                    setTimeout(e, 0)
                                }, {
                                    scheduler: n,
                                    zb: function(e) {
                                        return a || h.na.scheduler(t), o[a++] = e, s++
                                    },
                                    cancel: function(e) {
                                        e -= s - a, e >= u && e < a && (o[e] = null)
                                    },
                                    resetForTesting: function() {
                                        var e = a - u;
                                        return u = a = o.length = 0, e
                                    },
                                    Sd: e
                                }
                            }(), h.b("tasks", h.na), h.b("tasks.schedule", h.na.zb), h.b("tasks.runEarly", h.na.Sd), h.Ta = {
                                throttle: function(e, t) {
                                    e.throttleEvaluation = t;
                                    var n = null;
                                    return h.$({
                                        read: e,
                                        write: function(r) {
                                            clearTimeout(n), n = h.a.setTimeout(function() {
                                                e(r)
                                            }, t)
                                        }
                                    })
                                },
                                rateLimit: function(e, t) {
                                    var n, r, i;
                                    "number" == typeof t ? n = t : (n = t.timeout, r = t.method), e.Hb = !1, i = "function" == typeof r ? r : "notifyWhenChangesStop" == r ? l : c, e.ub(function(e) {
                                        return i(e, n, t)
                                    })
                                },
                                deferred: function(t, n) {
                                    if (!0 !== n) throw Error("The 'deferred' extender only accepts the value 'true', because it is not supported to turn deferral off once enabled.");
                                    t.Hb || (t.Hb = !0, t.ub(function(n) {
                                        var r, i = !1;
                                        return function() {
                                            if (!i) {
                                                h.na.cancel(r), r = h.na.zb(n);
                                                try {
                                                    i = !0, t.notifySubscribers(e, "dirty")
                                                } finally {
                                                    i = !1
                                                }
                                            }
                                        }
                                    }))
                                },
                                notify: function(e, t) {
                                    e.equalityComparer = "always" == t ? null : u
                                }
                            };
                        var g = {
                            undefined: 1,
                            "boolean": 1,
                            number: 1,
                            string: 1
                        };
                        h.b("extenders", h.Ta), h.ic = function(e, t, n) {
                            this.da = e, this.lc = t, this.mc = n, this.Ib = !1, this.fb = this.Jb = null, h.L(this, "dispose", this.s), h.L(this, "disposeWhenNodeIsRemoved", this.l)
                        }, h.ic.prototype.s = function() {
                            this.Ib || (this.fb && h.a.K.yb(this.Jb, this.fb), this.Ib = !0, this.mc(), this.da = this.lc = this.mc = this.Jb = this.fb = null)
                        }, h.ic.prototype.l = function(e) {
                            this.Jb = e, h.a.K.za(e, this.fb = this.s.bind(this))
                        }, h.T = function() {
                            h.a.Ab(this, v), v.qb(this)
                        };
                        var v = {
                            qb: function(e) {
                                e.U = {
                                    change: []
                                }, e.sc = 1
                            },
                            subscribe: function(e, t, n) {
                                var r = this;
                                n = n || "change";
                                var i = new h.ic(r, t ? e.bind(t) : e, function() {
                                    h.a.Pa(r.U[n], i), r.hb && r.hb(n)
                                });
                                return r.Qa && r.Qa(n), r.U[n] || (r.U[n] = []), r.U[n].push(i), i
                            },
                            notifySubscribers: function(e, t) {
                                if (t = t || "change", "change" === t && this.Gb(), this.Wa(t)) {
                                    var n = "change" === t && this.ed || this.U[t].slice(0);
                                    try {
                                        h.u.xc();
                                        for (var r, i = 0; r = n[i]; ++i) r.Ib || r.lc(e)
                                    } finally {
                                        h.u.end()
                                    }
                                }
                            },
                            ob: function() {
                                return this.sc
                            },
                            Dd: function(e) {
                                return this.ob() !== e
                            },
                            Gb: function() {
                                ++this.sc
                            },
                            ub: function(e) {
                                var t, n, r, i, o, a = this,
                                    s = h.O(a);
                                a.gb || (a.gb = a.notifySubscribers, a.notifySubscribers = f);
                                var u = e(function() {
                                    a.Ja = !1, s && i === a && (i = a.nc ? a.nc() : a());
                                    var e = n || o && a.sb(r, i);
                                    o = n = t = !1, e && a.gb(r = i)
                                });
                                a.qc = function(e, n) {
                                    n && a.Ja || (o = !n), a.ed = a.U.change.slice(0), a.Ja = t = !0, i = e, u()
                                }, a.pc = function(e) {
                                    t || (r = e, a.gb(e, "beforeChange"))
                                }, a.rc = function() {
                                    o = !0
                                }, a.gd = function() {
                                    a.sb(r, a.v(!0)) && (n = !0)
                                }
                            },
                            Wa: function(e) {
                                return this.U[e] && this.U[e].length
                            },
                            Bd: function(e) {
                                if (e) return this.U[e] && this.U[e].length || 0;
                                var t = 0;
                                return h.a.P(this.U, function(e, n) {
                                    "dirty" !== e && (t += n.length)
                                }), t
                            },
                            sb: function(e, t) {
                                return !this.equalityComparer || !this.equalityComparer(e, t)
                            },
                            toString: function() {
                                return "[object Object]"
                            },
                            extend: function(e) {
                                var t = this;
                                return e && h.a.P(e, function(e, n) {
                                    var r = h.Ta[e];
                                    "function" == typeof r && (t = r(t, n) || t)
                                }), t
                            }
                        };
                        h.L(v, "init", v.qb), h.L(v, "subscribe", v.subscribe), h.L(v, "extend", v.extend), h.L(v, "getSubscriptionsCount", v.Bd), h.a.Ba && h.a.setPrototypeOf(v, Function.prototype), h.T.fn = v, h.Qc = function(e) {
                            return null != e && "function" == typeof e.subscribe && "function" == typeof e.notifySubscribers
                        }, h.b("subscribable", h.T), h.b("isSubscribable", h.Qc), h.S = h.u = function() {
                            function e(e) {
                                r.push(n), n = e
                            }

                            function t() {
                                n = r.pop()
                            }
                            var n, r = [],
                                i = 0;
                            return {
                                xc: e,
                                end: t,
                                cc: function(e) {
                                    if (n) {
                                        if (!h.Qc(e)) throw Error("Only subscribable things can act as dependencies");
                                        n.od.call(n.pd, e, e.fd || (e.fd = ++i))
                                    }
                                },
                                G: function(n, r, i) {
                                    try {
                                        return e(), n.apply(r, i || [])
                                    } finally {
                                        t()
                                    }
                                },
                                qa: function() {
                                    if (n) return n.o.qa()
                                },
                                Va: function() {
                                    if (n) return n.o.Va()
                                },
                                Ya: function() {
                                    if (n) return n.Ya
                                },
                                o: function() {
                                    if (n) return n.o
                                }
                            }
                        }(), h.b("computedContext", h.S), h.b("computedContext.getDependenciesCount", h.S.qa), h.b("computedContext.getDependencies", h.S.Va), h.b("computedContext.isInitial", h.S.Ya), h.b("computedContext.registerDependency", h.S.cc), h.b("ignoreDependencies", h.Yd = h.u.G);
                        var m = h.a.Da("_latestValue");
                        h.ta = function(e) {
                            function t() {
                                return 0 < arguments.length ? (t.sb(t[m], arguments[0]) && (t.ya(), t[m] = arguments[0], t.xa()), this) : (h.u.cc(t), t[m])
                            }
                            return t[m] = e, h.a.Ba || h.a.extend(t, h.T.fn), h.T.fn.qb(t), h.a.Ab(t, y), h.options.deferUpdates && h.Ta.deferred(t, !0), t
                        };
                        var y = {
                            equalityComparer: u,
                            v: function() {
                                return this[m]
                            },
                            xa: function() {
                                this.notifySubscribers(this[m], "spectate"), this.notifySubscribers(this[m])
                            },
                            ya: function() {
                                this.notifySubscribers(this[m], "beforeChange")
                            }
                        };
                        h.a.Ba && h.a.setPrototypeOf(y, h.T.fn);
                        var b = h.ta.Ma = "__ko_proto__";
                        y[b] = h.ta, h.O = function(e) {
                            if ((e = "function" == typeof e && e[b]) && e !== y[b] && e !== h.o.fn[b]) throw Error("Invalid object that looks like an observable; possibly from another Knockout instance");
                            return !!e
                        }, h.Za = function(e) {
                            return "function" == typeof e && (e[b] === y[b] || e[b] === h.o.fn[b] && e.Nc)
                        }, h.b("observable", h.ta), h.b("isObservable", h.O), h.b("isWriteableObservable", h.Za), h.b("isWritableObservable", h.Za), h.b("observable.fn", y), h.L(y, "peek", y.v), h.L(y, "valueHasMutated", y.xa), h.L(y, "valueWillMutate", y.ya), h.Ha = function(e) {
                            if (e = e || [], "object" != typeof e || !("length" in e)) throw Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");
                            return e = h.ta(e), h.a.Ab(e, h.Ha.fn), e.extend({
                                trackArrayChanges: !0
                            })
                        }, h.Ha.fn = {
                            remove: function(e) {
                                for (var t = this.v(), n = [], r = "function" != typeof e || h.O(e) ? function(t) {
                                        return t === e
                                    } : e, i = 0; i < t.length; i++) {
                                    var o = t[i];
                                    if (r(o)) {
                                        if (0 === n.length && this.ya(), t[i] !== o) throw Error("Array modified during remove; cannot remove item");
                                        n.push(o), t.splice(i, 1), i--
                                    }
                                }
                                return n.length && this.xa(), n
                            },
                            removeAll: function(t) {
                                if (t === e) {
                                    var n = this.v(),
                                        r = n.slice(0);
                                    return this.ya(), n.splice(0, n.length), this.xa(), r
                                }
                                return t ? this.remove(function(e) {
                                    return 0 <= h.a.A(t, e)
                                }) : []
                            },
                            destroy: function(e) {
                                var t = this.v(),
                                    n = "function" != typeof e || h.O(e) ? function(t) {
                                        return t === e
                                    } : e;
                                this.ya();
                                for (var r = t.length - 1; 0 <= r; r--) {
                                    var i = t[r];
                                    n(i) && (i._destroy = !0)
                                }
                                this.xa()
                            },
                            destroyAll: function(t) {
                                return t === e ? this.destroy(function() {
                                    return !0
                                }) : t ? this.destroy(function(e) {
                                    return 0 <= h.a.A(t, e)
                                }) : []
                            },
                            indexOf: function(e) {
                                var t = this();
                                return h.a.A(t, e)
                            },
                            replace: function(e, t) {
                                var n = this.indexOf(e);
                                0 <= n && (this.ya(), this.v()[n] = t, this.xa())
                            },
                            sorted: function(e) {
                                var t = this().slice(0);
                                return e ? t.sort(e) : t.sort()
                            },
                            reversed: function() {
                                return this().slice(0).reverse()
                            }
                        }, h.a.Ba && h.a.setPrototypeOf(h.Ha.fn, h.ta.fn), h.a.D("pop push reverse shift sort splice unshift".split(" "), function(e) {
                            h.Ha.fn[e] = function() {
                                var t = this.v();
                                this.ya(), this.zc(t, e, arguments);
                                var n = t[e].apply(t, arguments);
                                return this.xa(), n === t ? this : n
                            }
                        }), h.a.D(["slice"], function(e) {
                            h.Ha.fn[e] = function() {
                                var t = this();
                                return t[e].apply(t, arguments)
                            }
                        }), h.Pc = function(e) {
                            return h.O(e) && "function" == typeof e.remove && "function" == typeof e.push
                        }, h.b("observableArray", h.Ha), h.b("isObservableArray", h.Pc), h.Ta.trackArrayChanges = function(t, n) {
                            function r() {
                                function e() {
                                    if (c) {
                                        var e, n = [].concat(t.v() || []);
                                        t.Wa("arrayChange") && ((!u || 1 < c) && (u = h.a.Pb(a, n, t.Ob)), e = u), a = n, u = null, c = 0, e && e.length && t.notifySubscribers(e, "arrayChange")
                                    }
                                }
                                s ? e() : (s = !0, o = t.subscribe(function() {
                                    ++c
                                }, null, "spectate"), a = [].concat(t.v() || []), u = null, i = t.subscribe(e))
                            }
                            if (t.Ob = {}, n && "object" == typeof n && h.a.extend(t.Ob, n), t.Ob.sparse = !0, !t.zc) {
                                var i, o, a, s = !1,
                                    u = null,
                                    c = 0,
                                    l = t.Qa,
                                    f = t.hb;
                                t.Qa = function(e) {
                                    l && l.call(t, e), "arrayChange" === e && r()
                                }, t.hb = function(n) {
                                    f && f.call(t, n), "arrayChange" !== n || t.Wa("arrayChange") || (i && i.s(), o && o.s(), o = i = null, s = !1, a = e)
                                }, t.zc = function(e, t, n) {
                                    function r(e, t, n) {
                                        return i[i.length] = {
                                            status: e,
                                            value: t,
                                            index: n
                                        }
                                    }
                                    if (s && !c) {
                                        var i = [],
                                            o = e.length,
                                            a = n.length,
                                            l = 0;
                                        switch (t) {
                                            case "push":
                                                l = o;
                                            case "unshift":
                                                for (t = 0; t < a; t++) r("added", n[t], l + t);
                                                break;
                                            case "pop":
                                                l = o - 1;
                                            case "shift":
                                                o && r("deleted", e[l], l);
                                                break;
                                            case "splice":
                                                t = Math.min(Math.max(0, 0 > n[0] ? o + n[0] : n[0]), o);
                                                for (var o = 1 === a ? o : Math.min(t + (n[1] || 0), o), a = t + a - 2, l = Math.max(o, a), f = [], d = [], p = 2; t < l; ++t, ++p) t < o && d.push(r("deleted", e[t], t)), t < a && f.push(r("added", n[p], t));
                                                h.a.Kc(d, f);
                                                break;
                                            default:
                                                return
                                        }
                                        u = i
                                    }
                                }
                            }
                        };
                        var x = h.a.Da("_state");
                        h.o = h.$ = function(t, n, r) {
                            function i() {
                                if (0 < arguments.length) {
                                    if ("function" != typeof o) throw Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
                                    return o.apply(a.nb, arguments), this
                                }
                                return a.ra || h.u.cc(i), (a.ka || a.J && i.Xa()) && i.ha(), a.X
                            }
                            if ("object" == typeof t ? r = t : (r = r || {}, t && (r.read = t)), "function" != typeof r.read) throw Error("Pass a function that returns the value of the ko.computed");
                            var o = r.write,
                                a = {
                                    X: e,
                                    sa: !0,
                                    ka: !0,
                                    rb: !1,
                                    jc: !1,
                                    ra: !1,
                                    wb: !1,
                                    J: !1,
                                    Wc: r.read,
                                    nb: n || r.owner,
                                    l: r.disposeWhenNodeIsRemoved || r.l || null,
                                    Sa: r.disposeWhen || r.Sa,
                                    Rb: null,
                                    I: {},
                                    V: 0,
                                    Ic: null
                                };
                            return i[x] = a, i.Nc = "function" == typeof o, h.a.Ba || h.a.extend(i, h.T.fn), h.T.fn.qb(i), h.a.Ab(i, w), r.pure ? (a.wb = !0, a.J = !0, h.a.extend(i, T)) : r.deferEvaluation && h.a.extend(i, S), h.options.deferUpdates && h.Ta.deferred(i, !0), a.l && (a.jc = !0, a.l.nodeType || (a.l = null)), a.J || r.deferEvaluation || i.ha(), a.l && i.ja() && h.a.K.za(a.l, a.Rb = function() {
                                i.s()
                            }), i
                        };
                        var w = {
                                equalityComparer: u,
                                qa: function() {
                                    return this[x].V
                                },
                                Va: function() {
                                    var e = [];
                                    return h.a.P(this[x].I, function(t, n) {
                                        e[n.Ka] = n.da
                                    }), e
                                },
                                Vb: function(e) {
                                    if (!this[x].V) return !1;
                                    var t = this.Va();
                                    return -1 !== h.a.A(t, e) || !!h.a.Lb(t, function(t) {
                                        return t.Vb && t.Vb(e)
                                    })
                                },
                                uc: function(e, t, n) {
                                    if (this[x].wb && t === this) throw Error("A 'pure' computed must not be called recursively");
                                    this[x].I[e] = n, n.Ka = this[x].V++, n.La = t.ob()
                                },
                                Xa: function() {
                                    var e, t, n = this[x].I;
                                    for (e in n)
                                        if (Object.prototype.hasOwnProperty.call(n, e) && (t = n[e], this.Ia && t.da.Ja || t.da.Dd(t.La))) return !0
                                },
                                Jd: function() {
                                    this.Ia && !this[x].rb && this.Ia(!1)
                                },
                                ja: function() {
                                    var e = this[x];
                                    return e.ka || 0 < e.V
                                },
                                Rd: function() {
                                    this.Ja ? this[x].ka && (this[x].sa = !0) : this.Hc()
                                },
                                $c: function(e) {
                                    if (e.Hb) {
                                        var t = e.subscribe(this.Jd, this, "dirty"),
                                            n = e.subscribe(this.Rd, this);
                                        return {
                                            da: e,
                                            s: function() {
                                                t.s(), n.s()
                                            }
                                        }
                                    }
                                    return e.subscribe(this.Hc, this)
                                },
                                Hc: function() {
                                    var e = this,
                                        t = e.throttleEvaluation;
                                    t && 0 <= t ? (clearTimeout(this[x].Ic), this[x].Ic = h.a.setTimeout(function() {
                                        e.ha(!0)
                                    }, t)) : e.Ia ? e.Ia(!0) : e.ha(!0)
                                },
                                ha: function(e) {
                                    var t = this[x],
                                        n = t.Sa,
                                        r = !1;
                                    if (!t.rb && !t.ra) {
                                        if (t.l && !h.a.Sb(t.l) || n && n()) {
                                            if (!t.jc) return void this.s()
                                        } else t.jc = !1;
                                        t.rb = !0;
                                        try {
                                            r = this.zd(e)
                                        } finally {
                                            t.rb = !1
                                        }
                                        return r
                                    }
                                },
                                zd: function(t) {
                                    var n = this[x],
                                        r = !1,
                                        i = n.wb ? e : !n.V,
                                        r = {
                                            qd: this,
                                            mb: n.I,
                                            Qb: n.V
                                        };
                                    h.u.xc({
                                        pd: r,
                                        od: p,
                                        o: this,
                                        Ya: i
                                    }), n.I = {}, n.V = 0;
                                    var o = this.yd(n, r);
                                    return n.V ? r = this.sb(n.X, o) : (this.s(), r = !0), r && (n.J ? this.Gb() : this.notifySubscribers(n.X, "beforeChange"), n.X = o, this.notifySubscribers(n.X, "spectate"), !n.J && t && this.notifySubscribers(n.X), this.rc && this.rc()), i && this.notifySubscribers(n.X, "awake"), r
                                },
                                yd: function(e, t) {
                                    try {
                                        var n = e.Wc;
                                        return e.nb ? n.call(e.nb) : n()
                                    } finally {
                                        h.u.end(), t.Qb && !e.J && h.a.P(t.mb, d), e.sa = e.ka = !1
                                    }
                                },
                                v: function(e) {
                                    var t = this[x];
                                    return (t.ka && (e || !t.V) || t.J && this.Xa()) && this.ha(), t.X
                                },
                                ub: function(e) {
                                    h.T.fn.ub.call(this, e), this.nc = function() {
                                        return this[x].J || (this[x].sa ? this.ha() : this[x].ka = !1), this[x].X
                                    }, this.Ia = function(e) {
                                        this.pc(this[x].X), this[x].ka = !0, e && (this[x].sa = !0), this.qc(this, !e)
                                    }
                                },
                                s: function() {
                                    var t = this[x];
                                    !t.J && t.I && h.a.P(t.I, function(e, t) {
                                        t.s && t.s()
                                    }), t.l && t.Rb && h.a.K.yb(t.l, t.Rb), t.I = e, t.V = 0, t.ra = !0, t.sa = !1, t.ka = !1, t.J = !1, t.l = e, t.Sa = e, t.Wc = e, this.Nc || (t.nb = e)
                                }
                            },
                            T = {
                                Qa: function(e) {
                                    var t = this,
                                        n = t[x];
                                    if (!n.ra && n.J && "change" == e) {
                                        if (n.J = !1, n.sa || t.Xa()) n.I = null, n.V = 0, t.ha() && t.Gb();
                                        else {
                                            var r = [];
                                            h.a.P(n.I, function(e, t) {
                                                r[t.Ka] = e
                                            }), h.a.D(r, function(e, r) {
                                                var i = n.I[e],
                                                    o = t.$c(i.da);
                                                o.Ka = r, o.La = i.La, n.I[e] = o
                                            }), t.Xa() && t.ha() && t.Gb()
                                        }
                                        n.ra || t.notifySubscribers(n.X, "awake")
                                    }
                                },
                                hb: function(t) {
                                    var n = this[x];
                                    n.ra || "change" != t || this.Wa("change") || (h.a.P(n.I, function(e, t) {
                                        t.s && (n.I[e] = {
                                            da: t.da,
                                            Ka: t.Ka,
                                            La: t.La
                                        }, t.s())
                                    }), n.J = !0, this.notifySubscribers(e, "asleep"))
                                },
                                ob: function() {
                                    var e = this[x];
                                    return e.J && (e.sa || this.Xa()) && this.ha(), h.T.fn.ob.call(this)
                                }
                            },
                            S = {
                                Qa: function(e) {
                                    "change" != e && "beforeChange" != e || this.v()
                                }
                            };
                        h.a.Ba && h.a.setPrototypeOf(w, h.T.fn);
                        var C = h.ta.Ma;
                        w[C] = h.o, h.Oc = function(e) {
                                return "function" == typeof e && e[C] === w[C]
                            }, h.Fd = function(e) {
                                return h.Oc(e) && e[x] && e[x].wb
                            }, h.b("computed", h.o), h.b("dependentObservable", h.o), h.b("isComputed", h.Oc), h.b("isPureComputed", h.Fd), h.b("computed.fn", w), h.L(w, "peek", w.v), h.L(w, "dispose", w.s), h.L(w, "isActive", w.ja), h.L(w, "getDependenciesCount", w.qa), h.L(w, "getDependencies", w.Va), h.xb = function(e, t) {
                                return "function" == typeof e ? h.o(e, t, {
                                    pure: !0
                                }) : (e = h.a.extend({}, e), e.pure = !0, h.o(e, t))
                            }, h.b("pureComputed", h.xb),
                            function() {
                                function t(i, o, a) {
                                    if (a = a || new r, i = o(i), "object" != typeof i || null === i || i === e || i instanceof RegExp || i instanceof Date || i instanceof String || i instanceof Number || i instanceof Boolean) return i;
                                    var s = i instanceof Array ? [] : {};
                                    return a.save(i, s), n(i, function(n) {
                                        var r = o(i[n]);
                                        switch (typeof r) {
                                            case "boolean":
                                            case "number":
                                            case "string":
                                            case "function":
                                                s[n] = r;
                                                break;
                                            case "object":
                                            case "undefined":
                                                var u = a.get(r);
                                                s[n] = u !== e ? u : t(r, o, a)
                                        }
                                    }), s
                                }

                                function n(e, t) {
                                    if (e instanceof Array) {
                                        for (var n = 0; n < e.length; n++) t(n);
                                        "function" == typeof e.toJSON && t("toJSON")
                                    } else
                                        for (n in e) t(n)
                                }

                                function r() {
                                    this.keys = [], this.values = []
                                }
                                h.ad = function(e) {
                                    if (0 == arguments.length) throw Error("When calling ko.toJS, pass the object you want to convert.");
                                    return t(e, function(e) {
                                        for (var t = 0; h.O(e) && 10 > t; t++) e = e();
                                        return e
                                    })
                                }, h.toJSON = function(e, t, n) {
                                    return e = h.ad(e), h.a.hc(e, t, n)
                                }, r.prototype = {
                                    constructor: r,
                                    save: function(e, t) {
                                        var n = h.a.A(this.keys, e);
                                        0 <= n ? this.values[n] = t : (this.keys.push(e), this.values.push(t))
                                    },
                                    get: function(t) {
                                        return t = h.a.A(this.keys, t), 0 <= t ? this.values[t] : e
                                    }
                                }
                            }(), h.b("toJS", h.ad), h.b("toJSON", h.toJSON), h.Wd = function(e, t, n) {
                                function r(t) {
                                    var r = h.xb(e, n).extend({
                                            ma: "always"
                                        }),
                                        i = r.subscribe(function(e) {
                                            e && (i.s(), t(e))
                                        });
                                    return r.notifySubscribers(r.v()), i
                                }
                                return "function" != typeof Promise || t ? r(t.bind(n)) : new Promise(r)
                            }, h.b("when", h.Wd),
                            function() {
                                h.w = {
                                    M: function(t) {
                                        switch (h.a.R(t)) {
                                            case "option":
                                                return !0 === t.__ko__hasDomDataOptionValue__ ? h.a.g.get(t, h.c.options.$b) : 7 >= h.a.W ? t.getAttributeNode("value") && t.getAttributeNode("value").specified ? t.value : t.text : t.value;
                                            case "select":
                                                return 0 <= t.selectedIndex ? h.w.M(t.options[t.selectedIndex]) : e;
                                            default:
                                                return t.value
                                        }
                                    },
                                    cb: function(t, n, r) {
                                        switch (h.a.R(t)) {
                                            case "option":
                                                "string" == typeof n ? (h.a.g.set(t, h.c.options.$b, e), "__ko__hasDomDataOptionValue__" in t && delete t.__ko__hasDomDataOptionValue__, t.value = n) : (h.a.g.set(t, h.c.options.$b, n), t.__ko__hasDomDataOptionValue__ = !0, t.value = "number" == typeof n ? n : "");
                                                break;
                                            case "select":
                                                "" !== n && null !== n || (n = e);
                                                for (var i, o = -1, a = 0, s = t.options.length; a < s; ++a)
                                                    if (i = h.w.M(t.options[a]), i == n || "" === i && n === e) {
                                                        o = a;
                                                        break
                                                    }(r || 0 <= o || n === e && 1 < t.size) && (t.selectedIndex = o, 6 === h.a.W && h.a.setTimeout(function() {
                                                        t.selectedIndex = o
                                                    }, 0));
                                                break;
                                            default:
                                                null !== n && n !== e || (n = ""), t.value = n
                                        }
                                    }
                                }
                            }(), h.b("selectExtensions", h.w), h.b("selectExtensions.readValue", h.w.M), h.b("selectExtensions.writeValue", h.w.cb), h.m = function() {
                                function e(e) {
                                    e = h.a.Db(e), 123 === e.charCodeAt(0) && (e = e.slice(1, -1)), e += "\n,";
                                    var t, n = [],
                                        a = e.match(r),
                                        s = [],
                                        u = 0;
                                    if (1 < a.length) {
                                        for (var c, l = 0; c = a[l]; ++l) {
                                            var f = c.charCodeAt(0);
                                            if (44 === f) {
                                                if (0 >= u) {
                                                    n.push(t && s.length ? {
                                                        key: t,
                                                        value: s.join("")
                                                    } : {
                                                        unknown: t || s.join("")
                                                    }), t = u = 0, s = [];
                                                    continue
                                                }
                                            } else if (58 === f) {
                                                if (!u && !t && 1 === s.length) {
                                                    t = s.pop();
                                                    continue
                                                }
                                            } else {
                                                if (47 === f && 1 < c.length && (47 === c.charCodeAt(1) || 42 === c.charCodeAt(1))) continue;
                                                47 === f && l && 1 < c.length ? (f = a[l - 1].match(i)) && !o[f[0]] && (e = e.substr(e.indexOf(c) + 1), a = e.match(r), l = -1, c = "/") : 40 === f || 123 === f || 91 === f ? ++u : 41 === f || 125 === f || 93 === f ? --u : t || s.length || 34 !== f && 39 !== f || (c = c.slice(1, -1))
                                            }
                                            s.push(c)
                                        }
                                        if (0 < u) throw Error("Unbalanced parentheses, braces, or brackets")
                                    }
                                    return n
                                }
                                var t = ["true", "false", "null", "undefined"],
                                    n = /^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i,
                                    r = RegExp("\"(?:\\\\.|[^\"])*\"|'(?:\\\\.|[^'])*'|`(?:\\\\.|[^`])*`|/\\*(?:[^*]|\\*+[^*/])*\\*+/|//.*\n|/(?:\\\\.|[^/])+/w*|[^\\s:,/][^,\"'`{}()/:[\\]]*[^\\s,\"'`{}()/:[\\]]|[^\\s]", "g"),
                                    i = /[\])"'A-Za-z0-9_$]+$/,
                                    o = {
                                        "in": 1,
                                        "return": 1,
                                        "typeof": 1
                                    },
                                    a = {};
                                return {
                                    Ra: [],
                                    wa: a,
                                    ac: e,
                                    vb: function(r, i) {
                                        function o(e, r) {
                                            var i;
                                            if (!l) {
                                                var f = h.getBindingHandler(e);
                                                if (f && f.preprocess && !(r = f.preprocess(r, e, o))) return;
                                                (f = a[e]) && (i = r, 0 <= h.a.A(t, i) ? i = !1 : (f = i.match(n), i = null !== f && (f[1] ? "Object(" + f[1] + ")" + f[2] : i)), f = i), f && u.push("'" + ("string" == typeof a[e] ? a[e] : e) + "':function(_z){" + i + "=_z}")
                                            }
                                            c && (r = "function(){return " + r + " }"), s.push("'" + e + "':" + r)
                                        }
                                        i = i || {};
                                        var s = [],
                                            u = [],
                                            c = i.valueAccessors,
                                            l = i.bindingParams,
                                            f = "string" == typeof r ? e(r) : r;
                                        return h.a.D(f, function(e) {
                                            o(e.key || e.unknown, e.value)
                                        }), u.length && o("_ko_property_writers", "{" + u.join(",") + " }"), s.join(",")
                                    },
                                    Id: function(e, t) {
                                        for (var n = 0; n < e.length; n++)
                                            if (e[n].key == t) return !0;
                                        return !1
                                    },
                                    eb: function(e, t, n, r, i) {
                                        e && h.O(e) ? !h.Za(e) || i && e.v() === r || e(r) : (e = t.get("_ko_property_writers")) && e[n] && e[n](r)
                                    }
                                }
                            }(), h.b("expressionRewriting", h.m), h.b("expressionRewriting.bindingRewriteValidators", h.m.Ra), h.b("expressionRewriting.parseObjectLiteral", h.m.ac), h.b("expressionRewriting.preProcessBindings", h.m.vb), h.b("expressionRewriting._twoWayBindings", h.m.wa), h.b("jsonExpressionRewriting", h.m), h.b("jsonExpressionRewriting.insertPropertyAccessorsIntoJson", h.m.vb),
                            function() {
                                function e(e) {
                                    return 8 == e.nodeType && a.test(o ? e.text : e.nodeValue)
                                }

                                function t(e) {
                                    return 8 == e.nodeType && s.test(o ? e.text : e.nodeValue)
                                }

                                function n(n, r) {
                                    for (var i = n, o = 1, a = []; i = i.nextSibling;) {
                                        if (t(i) && (h.a.g.set(i, c, !0), o--, 0 === o)) return a;
                                        a.push(i), e(i) && o++
                                    }
                                    if (!r) throw Error("Cannot find closing comment tag to match: " + n.nodeValue);
                                    return null
                                }

                                function r(e, t) {
                                    var r = n(e, t);
                                    return r ? 0 < r.length ? r[r.length - 1].nextSibling : e.nextSibling : null
                                }
                                var o = i && "<!--test-->" === i.createComment("test").text,
                                    a = o ? /^\x3c!--\s*ko(?:\s+([\s\S]+))?\s*--\x3e$/ : /^\s*ko(?:\s+([\s\S]+))?\s*$/,
                                    s = o ? /^\x3c!--\s*\/ko\s*--\x3e$/ : /^\s*\/ko\s*$/,
                                    u = {
                                        ul: !0,
                                        ol: !0
                                    },
                                    c = "__ko_matchedEndComment__";
                                h.h = {
                                    ea: {},
                                    childNodes: function(t) {
                                        return e(t) ? n(t) : t.childNodes
                                    },
                                    Ea: function(t) {
                                        if (e(t)) {
                                            t = h.h.childNodes(t);
                                            for (var n = 0, r = t.length; n < r; n++) h.removeNode(t[n])
                                        } else h.a.Tb(t)
                                    },
                                    va: function(t, n) {
                                        if (e(t)) {
                                            h.h.Ea(t);
                                            for (var r = t.nextSibling, i = 0, o = n.length; i < o; i++) r.parentNode.insertBefore(n[i], r)
                                        } else h.a.va(t, n)
                                    },
                                    Vc: function(t, n) {
                                        var r;
                                        e(t) ? (r = t.nextSibling, t = t.parentNode) : r = t.firstChild, r ? n !== r && t.insertBefore(n, r) : t.appendChild(n)
                                    },
                                    Wb: function(t, n, r) {
                                        r ? (r = r.nextSibling, e(t) && (t = t.parentNode), r ? n !== r && t.insertBefore(n, r) : t.appendChild(n)) : h.h.Vc(t, n)
                                    },
                                    firstChild: function(n) {
                                        if (e(n)) return !n.nextSibling || t(n.nextSibling) ? null : n.nextSibling;
                                        if (n.firstChild && t(n.firstChild)) throw Error("Found invalid end comment, as the first child of " + n);
                                        return n.firstChild
                                    },
                                    nextSibling: function(n) {
                                        if (e(n) && (n = r(n)), n.nextSibling && t(n.nextSibling)) {
                                            var i = n.nextSibling;
                                            if (t(i) && !h.a.g.get(i, c)) throw Error("Found end comment without a matching opening comment, as child of " + n);
                                            return null
                                        }
                                        return n.nextSibling
                                    },
                                    Cd: e,
                                    Vd: function(e) {
                                        return (e = (o ? e.text : e.nodeValue).match(a)) ? e[1] : null
                                    },
                                    Sc: function(n) {
                                        if (u[h.a.R(n)]) {
                                            var i = n.firstChild;
                                            if (i)
                                                do
                                                    if (1 === i.nodeType) {
                                                        var o;
                                                        o = i.firstChild;
                                                        var a = null;
                                                        if (o)
                                                            do
                                                                if (a) a.push(o);
                                                                else if (e(o)) {
                                                            var s = r(o, !0);
                                                            s ? o = s : a = [o]
                                                        } else t(o) && (a = [o]);
                                                        while (o = o.nextSibling);
                                                        if (o = a)
                                                            for (a = i.nextSibling, s = 0; s < o.length; s++) a ? n.insertBefore(o[s], a) : n.appendChild(o[s])
                                                    }
                                            while (i = i.nextSibling)
                                        }
                                    }
                                }
                            }(), h.b("virtualElements", h.h), h.b("virtualElements.allowedBindings", h.h.ea), h.b("virtualElements.emptyNode", h.h.Ea), h.b("virtualElements.insertAfter", h.h.Wb), h.b("virtualElements.prepend", h.h.Vc), h.b("virtualElements.setDomNodeChildren", h.h.va),
                            function() {
                                h.ga = function() {
                                    this.nd = {}
                                }, h.a.extend(h.ga.prototype, {
                                    nodeHasBindings: function(e) {
                                        switch (e.nodeType) {
                                            case 1:
                                                return null != e.getAttribute("data-bind") || h.j.getComponentNameForNode(e);
                                            case 8:
                                                return h.h.Cd(e);
                                            default:
                                                return !1
                                        }
                                    },
                                    getBindings: function(e, t) {
                                        var n = this.getBindingsString(e, t),
                                            n = n ? this.parseBindingsString(n, t, e) : null;
                                        return h.j.tc(n, e, t, !1)
                                    },
                                    getBindingAccessors: function(e, t) {
                                        var n = this.getBindingsString(e, t),
                                            n = n ? this.parseBindingsString(n, t, e, {
                                                valueAccessors: !0
                                            }) : null;
                                        return h.j.tc(n, e, t, !0)
                                    },
                                    getBindingsString: function(e) {
                                        switch (e.nodeType) {
                                            case 1:
                                                return e.getAttribute("data-bind");
                                            case 8:
                                                return h.h.Vd(e);
                                            default:
                                                return null
                                        }
                                    },
                                    parseBindingsString: function(e, t, n, r) {
                                        try {
                                            var i, o = this.nd,
                                                a = e + (r && r.valueAccessors || "");
                                            if (!(i = o[a])) {
                                                var s, u = "with($context){with($data||{}){return{" + h.m.vb(e, r) + "}}}";
                                                s = new Function("$context", "$element", u), i = o[a] = s
                                            }
                                            return i(t, n)
                                        } catch (c) {
                                            throw c.message = "Unable to parse bindings.\nBindings value: " + e + "\nMessage: " + c.message, c
                                        }
                                    }
                                }), h.ga.instance = new h.ga
                            }(), h.b("bindingProvider", h.ga),
                            function() {
                                function t(e) {
                                    var t = (e = h.a.g.get(e, T)) && e.N;
                                    t && (e.N = null, t.Tc())
                                }

                                function n(e, n, r) {
                                    this.node = e, this.yc = n, this.kb = [], this.H = !1, n.N || h.a.K.za(e, t), r && r.N && (r.N.kb.push(e), this.Kb = r)
                                }

                                function o(e) {
                                    return function() {
                                        return e
                                    }
                                }

                                function s(e) {
                                    return e()
                                }

                                function u(e) {
                                    return h.a.Ga(h.u.G(e), function(t, n) {
                                        return function() {
                                            return e()[n]
                                        }
                                    })
                                }

                                function c(e, t, n) {
                                    return "function" == typeof e ? u(e.bind(null, t, n)) : h.a.Ga(e, o)
                                }

                                function l(e, t) {
                                    return u(this.getBindings.bind(this, e, t))
                                }

                                function f(e, t) {
                                    var n = h.h.firstChild(t);
                                    if (n) {
                                        var r, i = h.ga.instance,
                                            o = i.preprocessNode;
                                        if (o) {
                                            for (; r = n;) n = h.h.nextSibling(r), o.call(i, r);
                                            n = h.h.firstChild(t)
                                        }
                                        for (; r = n;) n = h.h.nextSibling(r), d(e, r)
                                    }
                                    h.i.ma(t, h.i.H)
                                }

                                function d(e, t) {
                                    var n = e,
                                        r = 1 === t.nodeType;
                                    r && h.h.Sc(t), (r || h.ga.instance.nodeHasBindings(t)) && (n = g(t, null, e).bindingContextForDescendants), n && !x[h.a.R(t)] && f(n, t)
                                }

                                function p(e) {
                                    var t = [],
                                        n = {},
                                        r = [];
                                    return h.a.P(e, function i(o) {
                                        if (!n[o]) {
                                            var a = h.getBindingHandler(o);
                                            a && (a.after && (r.push(o), h.a.D(a.after, function(t) {
                                                if (e[t]) {
                                                    if (-1 !== h.a.A(r, t)) throw Error("Cannot combine the following bindings, because they have a cyclic dependency: " + r.join(", "));
                                                    i(t)
                                                }
                                            }), r.length--), t.push({
                                                key: o,
                                                Mc: a
                                            })), n[o] = !0
                                        }
                                    }), t
                                }

                                function g(t, n, r) {
                                    var i = h.a.g.Ub(t, T, {}),
                                        o = i.hd;
                                    if (!n) {
                                        if (o) throw Error("You cannot apply bindings multiple times to the same element.");
                                        i.hd = !0
                                    }
                                    o || (i.context = r), i.Zb || (i.Zb = {});
                                    var a;
                                    if (n && "function" != typeof n) a = n;
                                    else {
                                        var u = h.ga.instance,
                                            c = u.getBindingAccessors || l,
                                            f = h.$(function() {
                                                return (a = n ? n(r, t) : c.call(u, t, r)) && (r[m] && r[m](), r[b] && r[b]()), a
                                            }, null, {
                                                l: t
                                            });
                                        a && f.ja() || (f = null)
                                    }
                                    var d, g = r;
                                    if (a) {
                                        var v = function() {
                                                return h.a.Ga(f ? f() : a, s)
                                            },
                                            y = f ? function(e) {
                                                return function() {
                                                    return s(f()[e])
                                                }
                                            } : function(e) {
                                                return a[e]
                                            };
                                        v.get = function(e) {
                                            return a[e] && s(y(e))
                                        }, v.has = function(e) {
                                            return e in a
                                        }, h.i.H in a && h.i.subscribe(t, h.i.H, function() {
                                            var e = (0, a[h.i.H])();
                                            if (e) {
                                                var n = h.h.childNodes(t);
                                                n.length && e(n, h.Ec(n[0]))
                                            }
                                        }), h.i.pa in a && (g = h.i.Cb(t, r), h.i.subscribe(t, h.i.pa, function() {
                                            var e = (0, a[h.i.pa])();
                                            e && h.h.firstChild(t) && e(t)
                                        })), i = p(a), h.a.D(i, function(n) {
                                            var r = n.Mc.init,
                                                i = n.Mc.update,
                                                o = n.key;
                                            if (8 === t.nodeType && !h.h.ea[o]) throw Error("The binding '" + o + "' cannot be used with virtual elements");
                                            try {
                                                "function" == typeof r && h.u.G(function() {
                                                    var n = r(t, y(o), v, g.$data, g);
                                                    if (n && n.controlsDescendantBindings) {
                                                        if (d !== e) throw Error("Multiple bindings (" + d + " and " + o + ") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
                                                        d = o
                                                    }
                                                }), "function" == typeof i && h.$(function() {
                                                    i(t, y(o), v, g.$data, g)
                                                }, null, {
                                                    l: t
                                                })
                                            } catch (s) {
                                                throw s.message = 'Unable to process binding "' + o + ": " + a[o] + '"\nMessage: ' + s.message, s
                                            }
                                        })
                                    }
                                    return i = d === e, {
                                        shouldBindDescendants: i,
                                        bindingContextForDescendants: i && g
                                    }
                                }

                                function v(t, n) {
                                    return t && t instanceof h.fa ? t : new h.fa(t, e, e, n)
                                }
                                var m = h.a.Da("_subscribable"),
                                    y = h.a.Da("_ancestorBindingInfo"),
                                    b = h.a.Da("_dataDependency");
                                h.c = {};
                                var x = {
                                    script: !0,
                                    textarea: !0,
                                    template: !0
                                };
                                h.getBindingHandler = function(e) {
                                    return h.c[e]
                                };
                                var w = {};
                                h.fa = function(t, n, r, i, o) {
                                    function a() {
                                        var e = f ? l() : l,
                                            t = h.a.f(e);
                                        return n ? (h.a.extend(u, n), y in n && (u[y] = n[y])) : (u.$parents = [], u.$root = t, u.ko = h), u[m] = s, c ? t = u.$data : (u.$rawData = e, u.$data = t), r && (u[r] = t), i && i(u, n, t), n && n[m] && !h.S.o().Vb(n[m]) && n[m](), d && (u[b] = d), u.$data
                                    }
                                    var s, u = this,
                                        c = t === w,
                                        l = c ? e : t,
                                        f = "function" == typeof l && !h.O(l),
                                        d = o && o.dataDependency;
                                    o && o.exportDependencies ? a() : (s = h.xb(a), s.v(), s.ja() ? s.equalityComparer = null : u[m] = e)
                                }, h.fa.prototype.createChildContext = function(e, t, n, r) {
                                    if (!r && t && "object" == typeof t && (r = t, t = r.as, n = r.extend), t && r && r.noChildContext) {
                                        var i = "function" == typeof e && !h.O(e);
                                        return new h.fa(w, this, null, function(r) {
                                            n && n(r), r[t] = i ? e() : e
                                        }, r)
                                    }
                                    return new h.fa(e, this, t, function(e, t) {
                                        e.$parentContext = t, e.$parent = t.$data, e.$parents = (t.$parents || []).slice(0), e.$parents.unshift(e.$parent), n && n(e)
                                    }, r)
                                }, h.fa.prototype.extend = function(e, t) {
                                    return new h.fa(w, this, null, function(t) {
                                        h.a.extend(t, "function" == typeof e ? e(t) : e)
                                    }, t)
                                };
                                var T = h.a.g.Z();
                                n.prototype.Tc = function() {
                                    this.Kb && this.Kb.N && this.Kb.N.sd(this.node)
                                }, n.prototype.sd = function(e) {
                                    h.a.Pa(this.kb, e), !this.kb.length && this.H && this.Cc()
                                }, n.prototype.Cc = function() {
                                    this.H = !0, this.yc.N && !this.kb.length && (this.yc.N = null, h.a.K.yb(this.node, t), h.i.ma(this.node, h.i.pa), this.Tc())
                                }, h.i = {
                                    H: "childrenComplete",
                                    pa: "descendantsComplete",
                                    subscribe: function(e, t, n, r, i) {
                                        var o = h.a.g.Ub(e, T, {});
                                        return o.Fa || (o.Fa = new h.T), i && i.notifyImmediately && o.Zb[t] && h.u.G(n, r, [e]), o.Fa.subscribe(n, r, t)
                                    },
                                    ma: function(t, n) {
                                        var r = h.a.g.get(t, T);
                                        if (r && (r.Zb[n] = !0, r.Fa && r.Fa.notifySubscribers(t, n), n == h.i.H))
                                            if (r.N) r.N.Cc();
                                            else if (r.N === e && r.Fa && r.Fa.Wa(h.i.pa)) throw Error("descendantsComplete event not supported for bindings on this node")
                                    },
                                    Cb: function(e, t) {
                                        var r = h.a.g.Ub(e, T, {});
                                        return r.N || (r.N = new n(e, r, t[y])), t[y] == r ? t : t.extend(function(e) {
                                            e[y] = r
                                        })
                                    }
                                }, h.Td = function(e) {
                                    return (e = h.a.g.get(e, T)) && e.context
                                }, h.ib = function(e, t, n) {
                                    return 1 === e.nodeType && h.h.Sc(e), g(e, t, v(n))
                                }, h.ld = function(e, t, n) {
                                    return n = v(n), h.ib(e, c(t, n, e), n)
                                }, h.Oa = function(e, t) {
                                    1 !== t.nodeType && 8 !== t.nodeType || f(v(e), t)
                                }, h.vc = function(e, t, n) {
                                    if (!a && r.jQuery && (a = r.jQuery), 2 > arguments.length) {
                                        if (t = i.body, !t) throw Error("ko.applyBindings: could not find document.body; has the document been loaded?")
                                    } else if (!t || 1 !== t.nodeType && 8 !== t.nodeType) throw Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
                                    d(v(e, n), t)
                                }, h.Dc = function(t) {
                                    return !t || 1 !== t.nodeType && 8 !== t.nodeType ? e : h.Td(t)
                                }, h.Ec = function(t) {
                                    return (t = h.Dc(t)) ? t.$data : e
                                }, h.b("bindingHandlers", h.c), h.b("bindingEvent", h.i), h.b("bindingEvent.subscribe", h.i.subscribe), h.b("bindingEvent.startPossiblyAsyncContentBinding", h.i.Cb), h.b("applyBindings", h.vc), h.b("applyBindingsToDescendants", h.Oa), h.b("applyBindingAccessorsToNode", h.ib), h.b("applyBindingsToNode", h.ld), h.b("contextFor", h.Dc), h.b("dataFor", h.Ec)
                            }(),
                            function(e) {
                                function t(t, r) {
                                    var a, s = Object.prototype.hasOwnProperty.call(i, t) ? i[t] : e;
                                    s ? s.subscribe(r) : (s = i[t] = new h.T, s.subscribe(r), n(t, function(e, n) {
                                        var r = !(!n || !n.synchronous);
                                        o[t] = {
                                            definition: e,
                                            Gd: r
                                        }, delete i[t], a || r ? s.notifySubscribers(e) : h.na.zb(function() {
                                            s.notifySubscribers(e)
                                        })
                                    }), a = !0)
                                }

                                function n(e, t) {
                                    r("getConfig", [e], function(n) {
                                        n ? r("loadComponent", [e, n], function(e) {
                                            t(e, n)
                                        }) : t(null, null)
                                    })
                                }

                                function r(t, n, i, o) {
                                    o || (o = h.j.loaders.slice(0));
                                    var a = o.shift();
                                    if (a) {
                                        var s = a[t];
                                        if (s) {
                                            var u = !1;
                                            if (s.apply(a, n.concat(function(e) {
                                                    u ? i(null) : null !== e ? i(e) : r(t, n, i, o)
                                                })) !== e && (u = !0, !a.suppressLoaderExceptions)) throw Error("Component loaders must supply values by invoking the callback, not by returning values synchronously.")
                                        } else r(t, n, i, o)
                                    } else i(null)
                                }
                                var i = {},
                                    o = {};
                                h.j = {
                                    get: function(n, r) {
                                        var i = Object.prototype.hasOwnProperty.call(o, n) ? o[n] : e;
                                        i ? i.Gd ? h.u.G(function() {
                                            r(i.definition)
                                        }) : h.na.zb(function() {
                                            r(i.definition)
                                        }) : t(n, r)
                                    },
                                    Bc: function(e) {
                                        delete o[e]
                                    },
                                    oc: r
                                }, h.j.loaders = [], h.b("components", h.j), h.b("components.get", h.j.get), h.b("components.clearCachedDefinition", h.j.Bc)
                            }(),
                            function() {
                                function e(e, t, n, r) {
                                    function i() {
                                        0 === --a && r(o)
                                    }
                                    var o = {},
                                        a = 2,
                                        u = n.template;
                                    n = n.viewModel, u ? s(t, u, function(t) {
                                        h.j.oc("loadTemplate", [e, t], function(e) {
                                            o.template = e, i()
                                        })
                                    }) : i(), n ? s(t, n, function(t) {
                                        h.j.oc("loadViewModel", [e, t], function(e) {
                                            o[l] = e, i()
                                        })
                                    }) : i()
                                }

                                function t(e, n, r) {
                                    if ("function" == typeof n) r(function(e) {
                                        return new n(e)
                                    });
                                    else if ("function" == typeof n[l]) r(n[l]);
                                    else if ("instance" in n) {
                                        var i = n.instance;
                                        r(function() {
                                            return i
                                        })
                                    } else "viewModel" in n ? t(e, n.viewModel, r) : e("Unknown viewModel value: " + n)
                                }

                                function o(e) {
                                    switch (h.a.R(e)) {
                                        case "script":
                                            return h.a.ua(e.text);
                                        case "textarea":
                                            return h.a.ua(e.value);
                                        case "template":
                                            if (a(e.content)) return h.a.Ca(e.content.childNodes)
                                    }
                                    return h.a.Ca(e.childNodes)
                                }

                                function a(e) {
                                    return r.DocumentFragment ? e instanceof DocumentFragment : e && 11 === e.nodeType
                                }

                                function s(e, t, i) {
                                    "string" == typeof t.require ? n || r.require ? (n || r.require)([t.require], function(e) {
                                        e && "object" == typeof e && e.Xd && e["default"] && (e = e["default"]), i(e)
                                    }) : e("Uses require, but no AMD loader is present") : i(t)
                                }

                                function u(e) {
                                    return function(t) {
                                        throw Error("Component '" + e + "': " + t)
                                    }
                                }
                                var c = {};
                                h.j.register = function(e, t) {
                                    if (!t) throw Error("Invalid configuration for " + e);
                                    if (h.j.tb(e)) throw Error("Component " + e + " is already registered");
                                    c[e] = t
                                }, h.j.tb = function(e) {
                                    return Object.prototype.hasOwnProperty.call(c, e)
                                }, h.j.unregister = function(e) {
                                    delete c[e], h.j.Bc(e)
                                }, h.j.Fc = {
                                    getConfig: function(e, t) {
                                        t(h.j.tb(e) ? c[e] : null)
                                    },
                                    loadComponent: function(t, n, r) {
                                        var i = u(t);
                                        s(i, n, function(n) {
                                            e(t, i, n, r)
                                        })
                                    },
                                    loadTemplate: function(e, t, n) {
                                        if (e = u(e), "string" == typeof t) n(h.a.ua(t));
                                        else if (t instanceof Array) n(t);
                                        else if (a(t)) n(h.a.la(t.childNodes));
                                        else if (t.element)
                                            if (t = t.element, r.HTMLElement ? t instanceof HTMLElement : t && t.tagName && 1 === t.nodeType) n(o(t));
                                            else if ("string" == typeof t) {
                                            var s = i.getElementById(t);
                                            s ? n(o(s)) : e("Cannot find element with ID " + t)
                                        } else e("Unknown element type: " + t);
                                        else e("Unknown template value: " + t)
                                    },
                                    loadViewModel: function(e, n, r) {
                                        t(u(e), n, r)
                                    }
                                };
                                var l = "createViewModel";
                                h.b("components.register", h.j.register), h.b("components.isRegistered", h.j.tb), h.b("components.unregister", h.j.unregister), h.b("components.defaultLoader", h.j.Fc), h.j.loaders.push(h.j.Fc), h.j.dd = c
                            }(),
                            function() {
                                function e(e, n) {
                                    var r = e.getAttribute("params");
                                    if (r) {
                                        var r = t.parseBindingsString(r, n, e, {
                                                valueAccessors: !0,
                                                bindingParams: !0
                                            }),
                                            r = h.a.Ga(r, function(t) {
                                                return h.o(t, null, {
                                                    l: e
                                                })
                                            }),
                                            i = h.a.Ga(r, function(t) {
                                                var n = t.v();
                                                return t.ja() ? h.o({
                                                    read: function() {
                                                        return h.a.f(t())
                                                    },
                                                    write: h.Za(n) && function(e) {
                                                        t()(e)
                                                    },
                                                    l: e
                                                }) : n
                                            });
                                        return Object.prototype.hasOwnProperty.call(i, "$raw") || (i.$raw = r), i
                                    }
                                    return {
                                        $raw: {}
                                    }
                                }
                                h.j.getComponentNameForNode = function(e) {
                                    var t = h.a.R(e);
                                    if (h.j.tb(t) && (-1 != t.indexOf("-") || "[object HTMLUnknownElement]" == "" + e || 8 >= h.a.W && e.tagName === t)) return t
                                }, h.j.tc = function(t, n, r, i) {
                                    if (1 === n.nodeType) {
                                        var o = h.j.getComponentNameForNode(n);
                                        if (o) {
                                            if (t = t || {}, t.component) throw Error('Cannot use the "component" binding on a custom element matching a component');
                                            var a = {
                                                name: o,
                                                params: e(n, r)
                                            };
                                            t.component = i ? function() {
                                                return a
                                            } : a
                                        }
                                    }
                                    return t
                                };
                                var t = new h.ga;
                                9 > h.a.W && (h.j.register = function(e) {
                                    return function(t) {
                                        return e.apply(this, arguments)
                                    }
                                }(h.j.register), i.createDocumentFragment = function(e) {
                                    return function() {
                                        var t, n = e(),
                                            r = h.j.dd;
                                        for (t in r);
                                        return n
                                    }
                                }(i.createDocumentFragment))
                            }(),
                            function() {
                                function e(e, t, n) {
                                    if (t = t.template, !t) throw Error("Component '" + e + "' has no template");
                                    e = h.a.Ca(t), h.h.va(n, e)
                                }

                                function t(e, t, n) {
                                    var r = e.createViewModel;
                                    return r ? r.call(e, t, n) : t
                                }
                                var n = 0;
                                h.c.component = {
                                    init: function(r, i, o, a, s) {
                                        function u() {
                                            var e = c && c.dispose;
                                            "function" == typeof e && e.call(c), f && f.s(), l = c = f = null
                                        }
                                        var c, l, f, d = h.a.la(h.h.childNodes(r));
                                        return h.h.Ea(r), h.a.K.za(r, u), h.o(function() {
                                            var o, a, p = h.a.f(i());
                                            if ("string" == typeof p ? o = p : (o = h.a.f(p.name), a = h.a.f(p.params)), !o) throw Error("No component name specified");
                                            var g = h.i.Cb(r, s),
                                                v = l = ++n;
                                            h.j.get(o, function(n) {
                                                if (l === v) {
                                                    if (u(), !n) throw Error("Unknown component '" + o + "'");
                                                    e(o, n, r);
                                                    var i = t(n, a, {
                                                        element: r,
                                                        templateNodes: d
                                                    });
                                                    n = g.createChildContext(i, {
                                                        extend: function(e) {
                                                            e.$component = i, e.$componentTemplateNodes = d
                                                        }
                                                    }), i && i.koDescendantsComplete && (f = h.i.subscribe(r, h.i.pa, i.koDescendantsComplete, i)), c = i, h.Oa(n, r)
                                                }
                                            })
                                        }, null, {
                                            l: r
                                        }), {
                                            controlsDescendantBindings: !0
                                        }
                                    }
                                }, h.h.ea.component = !0
                            }();
                        var E = {
                            "class": "className",
                            "for": "htmlFor"
                        };
                        h.c.attr = {
                                update: function(t, n) {
                                    var r = h.a.f(n()) || {};
                                    h.a.P(r, function(n, r) {
                                        r = h.a.f(r);
                                        var i = n.indexOf(":"),
                                            i = "lookupNamespaceURI" in t && 0 < i && t.lookupNamespaceURI(n.substr(0, i)),
                                            o = !1 === r || null === r || r === e;
                                        o ? i ? t.removeAttributeNS(i, n) : t.removeAttribute(n) : r = r.toString(), 8 >= h.a.W && n in E ? (n = E[n], o ? t.removeAttribute(n) : t[n] = r) : o || (i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r)), "name" === n && h.a.Yc(t, o ? "" : r)
                                    })
                                }
                            },
                            function() {
                                h.c.checked = {
                                    after: ["value", "attr"],
                                    init: function(t, n, r) {
                                        function i() {
                                            var i = t.checked,
                                                o = a();
                                            if (!h.S.Ya() && (i || !u && !h.S.qa())) {
                                                var c = h.u.G(n);
                                                if (l) {
                                                    var d = f ? c.v() : c,
                                                        g = p;
                                                    p = o, g !== o ? i && (h.a.Na(d, o, !0), h.a.Na(d, g, !1)) : h.a.Na(d, o, i), f && h.Za(c) && c(d)
                                                } else s && (o === e ? o = i : i || (o = e)), h.m.eb(c, r, "checked", o, !0)
                                            }
                                        }

                                        function o() {
                                            var r = h.a.f(n()),
                                                i = a();
                                            l ? (t.checked = 0 <= h.a.A(r, i), p = i) : t.checked = s && i === e ? !!r : a() === r
                                        }
                                        var a = h.xb(function() {
                                                return r.has("checkedValue") ? h.a.f(r.get("checkedValue")) : d ? r.has("value") ? h.a.f(r.get("value")) : t.value : void 0
                                            }),
                                            s = "checkbox" == t.type,
                                            u = "radio" == t.type;
                                        if (s || u) {
                                            var c = n(),
                                                l = s && h.a.f(c) instanceof Array,
                                                f = !(l && c.push && c.splice),
                                                d = u || l,
                                                p = l ? a() : e;
                                            u && !t.name && h.c.uniqueName.init(t, function() {
                                                return !0
                                            }), h.o(i, null, {
                                                l: t
                                            }), h.a.B(t, "click", i), h.o(o, null, {
                                                l: t
                                            }), c = e
                                        }
                                    }
                                }, h.m.wa.checked = !0, h.c.checkedValue = {
                                    update: function(e, t) {
                                        e.value = h.a.f(t())
                                    }
                                }
                            }(), h.c["class"] = {
                                update: function(e, t) {
                                    var n = h.a.Db(h.a.f(t()));
                                    h.a.Eb(e, e.__ko__cssValue, !1), e.__ko__cssValue = n, h.a.Eb(e, n, !0)
                                }
                            }, h.c.css = {
                                update: function(e, t) {
                                    var n = h.a.f(t());
                                    null !== n && "object" == typeof n ? h.a.P(n, function(t, n) {
                                        n = h.a.f(n), h.a.Eb(e, t, n)
                                    }) : h.c["class"].update(e, t)
                                }
                            }, h.c.enable = {
                                update: function(e, t) {
                                    var n = h.a.f(t());
                                    n && e.disabled ? e.removeAttribute("disabled") : n || e.disabled || (e.disabled = !0)
                                }
                            }, h.c.disable = {
                                update: function(e, t) {
                                    h.c.enable.update(e, function() {
                                        return !h.a.f(t())
                                    })
                                }
                            }, h.c.event = {
                                init: function(e, t, n, r, i) {
                                    var o = t() || {};
                                    h.a.P(o, function(o) {
                                        "string" == typeof o && h.a.B(e, o, function(e) {
                                            var a, s = t()[o];
                                            if (s) {
                                                try {
                                                    var u = h.a.la(arguments);
                                                    r = i.$data, u.unshift(r), a = s.apply(r, u)
                                                } finally {
                                                    !0 !== a && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
                                                }!1 === n.get(o + "Bubble") && (e.cancelBubble = !0, e.stopPropagation && e.stopPropagation())
                                            }
                                        })
                                    })
                                }
                            }, h.c.foreach = {
                                Rc: function(e) {
                                    return function() {
                                        var t = e(),
                                            n = h.a.bc(t);
                                        return n && "number" != typeof n.length ? (h.a.f(t), {
                                            foreach: n.data,
                                            as: n.as,
                                            noChildContext: n.noChildContext,
                                            includeDestroyed: n.includeDestroyed,
                                            afterAdd: n.afterAdd,
                                            beforeRemove: n.beforeRemove,
                                            afterRender: n.afterRender,
                                            beforeMove: n.beforeMove,
                                            afterMove: n.afterMove,
                                            templateEngine: h.ba.Ma
                                        }) : {
                                            foreach: t,
                                            templateEngine: h.ba.Ma
                                        }
                                    }
                                },
                                init: function(e, t) {
                                    return h.c.template.init(e, h.c.foreach.Rc(t))
                                },
                                update: function(e, t, n, r, i) {
                                    return h.c.template.update(e, h.c.foreach.Rc(t), n, r, i)
                                }
                            }, h.m.Ra.foreach = !1, h.h.ea.foreach = !0, h.c.hasfocus = {
                                init: function(e, t, n) {
                                    function r(r) {
                                        e.__ko_hasfocusUpdating = !0;
                                        var i = e.ownerDocument;
                                        if ("activeElement" in i) {
                                            var o;
                                            try {
                                                o = i.activeElement
                                            } catch (a) {
                                                o = i.body
                                            }
                                            r = o === e
                                        }
                                        i = t(), h.m.eb(i, n, "hasfocus", r, !0), e.__ko_hasfocusLastValue = r, e.__ko_hasfocusUpdating = !1
                                    }
                                    var i = r.bind(null, !0),
                                        o = r.bind(null, !1);
                                    h.a.B(e, "focus", i), h.a.B(e, "focusin", i), h.a.B(e, "blur", o), h.a.B(e, "focusout", o), e.__ko_hasfocusLastValue = !1
                                },
                                update: function(e, t) {
                                    var n = !!h.a.f(t());
                                    e.__ko_hasfocusUpdating || e.__ko_hasfocusLastValue === n || (n ? e.focus() : e.blur(), !n && e.__ko_hasfocusLastValue && e.ownerDocument.body.focus(), h.u.G(h.a.Fb, null, [e, n ? "focusin" : "focusout"]))
                                }
                            }, h.m.wa.hasfocus = !0, h.c.hasFocus = h.c.hasfocus, h.m.wa.hasFocus = "hasfocus", h.c.html = {
                                init: function() {
                                    return {
                                        controlsDescendantBindings: !0
                                    }
                                },
                                update: function(e, t) {
                                    h.a.fc(e, t())
                                }
                            },
                            function() {
                                function e(e, t, n) {
                                    h.c[e] = {
                                        init: function(e, r, i, o, a) {
                                            var s, u, c, l, f, d = {};
                                            if (t) {
                                                o = i.get("as");
                                                var p = i.get("noChildContext");
                                                f = !(o && p), d = {
                                                    as: o,
                                                    noChildContext: p,
                                                    exportDependencies: f
                                                }
                                            }
                                            return l = (c = "render" == i.get("completeOn")) || i.has(h.i.pa), h.o(function() {
                                                var i, o = h.a.f(r()),
                                                    p = !n != !o,
                                                    g = !u;
                                                (f || p !== s) && (l && (a = h.i.Cb(e, a)), p && (t && !f || (d.dataDependency = h.S.o()), i = t ? a.createChildContext("function" == typeof o ? o : r, d) : h.S.qa() ? a.extend(null, d) : a), g && h.S.qa() && (u = h.a.Ca(h.h.childNodes(e), !0)), p ? (g || h.h.va(e, h.a.Ca(u)), h.Oa(i, e)) : (h.h.Ea(e), c || h.i.ma(e, h.i.H)), s = p)
                                            }, null, {
                                                l: e
                                            }), {
                                                controlsDescendantBindings: !0
                                            }
                                        }
                                    }, h.m.Ra[e] = !1, h.h.ea[e] = !0
                                }
                                e("if"), e("ifnot", !1, !0), e("with", !0)
                            }(), h.c["let"] = {
                                init: function(e, t, n, r, i) {
                                    return t = i.extend(t), h.Oa(t, e), {
                                        controlsDescendantBindings: !0
                                    }
                                }
                            }, h.h.ea["let"] = !0;
                        var k = {};
                        h.c.options = {
                                init: function(e) {
                                    if ("select" !== h.a.R(e)) throw Error("options binding applies only to SELECT elements");
                                    for (; 0 < e.length;) e.remove(0);
                                    return {
                                        controlsDescendantBindings: !0
                                    }
                                },
                                update: function(t, n, r) {
                                    function i() {
                                        return h.a.jb(t.options, function(e) {
                                            return e.selected
                                        })
                                    }

                                    function o(e, t, n) {
                                        var r = typeof t;
                                        return "function" == r ? t(e) : "string" == r ? e[t] : n
                                    }

                                    function a(e, n) {
                                        if (g && l) h.i.ma(t, h.i.H);
                                        else if (p.length) {
                                            var r = 0 <= h.a.A(p, h.w.M(n[0]));
                                            h.a.Zc(n[0], r), g && !r && h.u.G(h.a.Fb, null, [t, "change"])
                                        }
                                    }
                                    var s = t.multiple,
                                        u = 0 != t.length && s ? t.scrollTop : null,
                                        c = h.a.f(n()),
                                        l = r.get("valueAllowUnset") && r.has("value"),
                                        f = r.get("optionsIncludeDestroyed");
                                    n = {};
                                    var d, p = [];
                                    l || (s ? p = h.a.Mb(i(), h.w.M) : 0 <= t.selectedIndex && p.push(h.w.M(t.options[t.selectedIndex]))), c && ("undefined" == typeof c.length && (c = [c]), d = h.a.jb(c, function(t) {
                                        return f || t === e || null === t || !h.a.f(t._destroy)
                                    }), r.has("optionsCaption") && (c = h.a.f(r.get("optionsCaption")), null !== c && c !== e && d.unshift(k)));
                                    var g = !1;
                                    if (n.beforeRemove = function(e) {
                                            t.removeChild(e)
                                        }, c = a, r.has("optionsAfterRender") && "function" == typeof r.get("optionsAfterRender") && (c = function(t, n) {
                                            a(0, n), h.u.G(r.get("optionsAfterRender"), null, [n[0], t !== k ? t : e])
                                        }), h.a.ec(t, d, function(n, i, a) {
                                            return a.length && (p = !l && a[0].selected ? [h.w.M(a[0])] : [], g = !0), i = t.ownerDocument.createElement("option"), n === k ? (h.a.Bb(i, r.get("optionsCaption")), h.w.cb(i, e)) : (a = o(n, r.get("optionsValue"), n), h.w.cb(i, h.a.f(a)), n = o(n, r.get("optionsText"), a), h.a.Bb(i, n)), [i]
                                        }, n, c), !l) {
                                        var v;
                                        v = s ? p.length && i().length < p.length : p.length && 0 <= t.selectedIndex ? h.w.M(t.options[t.selectedIndex]) !== p[0] : p.length || 0 <= t.selectedIndex, v && h.u.G(h.a.Fb, null, [t, "change"])
                                    }(l || h.S.Ya()) && h.i.ma(t, h.i.H), h.a.wd(t), u && 20 < Math.abs(u - t.scrollTop) && (t.scrollTop = u)
                                }
                            }, h.c.options.$b = h.a.g.Z(), h.c.selectedOptions = {
                                init: function(e, t, n) {
                                    function r() {
                                        var r = t(),
                                            i = [];
                                        h.a.D(e.getElementsByTagName("option"), function(e) {
                                            e.selected && i.push(h.w.M(e))
                                        }), h.m.eb(r, n, "selectedOptions", i)
                                    }

                                    function i() {
                                        var n = h.a.f(t()),
                                            r = e.scrollTop;
                                        n && "number" == typeof n.length && h.a.D(e.getElementsByTagName("option"), function(e) {
                                            var t = 0 <= h.a.A(n, h.w.M(e));
                                            e.selected != t && h.a.Zc(e, t)
                                        }), e.scrollTop = r
                                    }
                                    if ("select" != h.a.R(e)) throw Error("selectedOptions binding applies only to SELECT elements");
                                    var o;
                                    h.i.subscribe(e, h.i.H, function() {
                                        o ? r() : (h.a.B(e, "change", r), o = h.o(i, null, {
                                            l: e
                                        }))
                                    }, null, {
                                        notifyImmediately: !0
                                    })
                                },
                                update: function() {}
                            }, h.m.wa.selectedOptions = !0, h.c.style = {
                                update: function(t, n) {
                                    var r = h.a.f(n() || {});
                                    h.a.P(r, function(n, r) {
                                        if (r = h.a.f(r), null !== r && r !== e && !1 !== r || (r = ""), a) a(t).css(n, r);
                                        else if (/^--/.test(n)) t.style.setProperty(n, r);
                                        else {
                                            n = n.replace(/-(\w)/g, function(e, t) {
                                                return t.toUpperCase()
                                            });
                                            var i = t.style[n];
                                            t.style[n] = r, r === i || t.style[n] != i || isNaN(r) || (t.style[n] = r + "px")
                                        }
                                    })
                                }
                            }, h.c.submit = {
                                init: function(e, t, n, r, i) {
                                    if ("function" != typeof t()) throw Error("The value for a submit binding must be a function");
                                    h.a.B(e, "submit", function(n) {
                                        var r, o = t();
                                        try {
                                            r = o.call(i.$data, e)
                                        } finally {
                                            !0 !== r && (n.preventDefault ? n.preventDefault() : n.returnValue = !1)
                                        }
                                    })
                                }
                            }, h.c.text = {
                                init: function() {
                                    return {
                                        controlsDescendantBindings: !0
                                    }
                                },
                                update: function(e, t) {
                                    h.a.Bb(e, t())
                                }
                            }, h.h.ea.text = !0,
                            function() {
                                if (r && r.navigator) {
                                    var t, n, i, o, a, s = function(e) {
                                            if (e) return parseFloat(e[1])
                                        },
                                        u = r.navigator.userAgent;
                                    (t = r.opera && r.opera.version && parseInt(r.opera.version())) || (a = s(u.match(/Edge\/([^ ]+)$/))) || s(u.match(/Chrome\/([^ ]+)/)) || (n = s(u.match(/Version\/([^ ]+) Safari/))) || (i = s(u.match(/Firefox\/([^ ]+)/))) || (o = h.a.W || s(u.match(/MSIE ([^ ]+)/))) || (o = s(u.match(/rv:([^ )]+)/)))
                                }
                                if (8 <= o && 10 > o) var c = h.a.g.Z(),
                                    l = h.a.g.Z(),
                                    f = function(e) {
                                        var t = this.activeElement;
                                        (t = t && h.a.g.get(t, l)) && t(e)
                                    },
                                    d = function(e, t) {
                                        var n = e.ownerDocument;
                                        h.a.g.get(n, c) || (h.a.g.set(n, c, !0), h.a.B(n, "selectionchange", f)), h.a.g.set(e, l, t)
                                    };
                                h.c.textInput = {
                                    init: function(r, s, u) {
                                        function c(e, t) {
                                            h.a.B(r, e, t)
                                        }

                                        function l() {
                                            var t = h.a.f(s());
                                            null !== t && t !== e || (t = ""), v !== e && t === v ? h.a.setTimeout(l, 4) : r.value !== t && (b = !0, r.value = t, b = !1, m = r.value)
                                        }

                                        function f() {
                                            g || (v = r.value, g = h.a.setTimeout(p, 4))
                                        }

                                        function p() {
                                            clearTimeout(g), v = g = e;
                                            var t = r.value;
                                            m !== t && (m = t, h.m.eb(s(), u, "textInput", t))
                                        }
                                        var g, v, m = r.value,
                                            y = 9 == h.a.W ? f : p,
                                            b = !1;
                                        o && c("keypress", p), 11 > o && c("propertychange", function(e) {
                                            b || "value" !== e.propertyName || y(e)
                                        }), 8 == o && (c("keyup", p), c("keydown", p)), d && (d(r, y), c("dragend", f)), (!o || 9 <= o) && c("input", y), 5 > n && "textarea" === h.a.R(r) ? (c("keydown", f), c("paste", f), c("cut", f)) : 11 > t ? c("keydown", f) : 4 > i ? (c("DOMAutoComplete", p), c("dragdrop", p), c("drop", p)) : a && "number" === r.type && c("keydown", f), c("change", p), c("blur", p), h.o(l, null, {
                                            l: r
                                        })
                                    }
                                }, h.m.wa.textInput = !0, h.c.textinput = {
                                    preprocess: function(e, t, n) {
                                        n("textInput", e)
                                    }
                                }
                            }(), h.c.uniqueName = {
                                init: function(e, t) {
                                    if (t()) {
                                        var n = "ko_unique_" + ++h.c.uniqueName.rd;
                                        h.a.Yc(e, n)
                                    }
                                }
                            }, h.c.uniqueName.rd = 0, h.c.using = {
                                init: function(e, t, n, r, i) {
                                    var o;
                                    return n.has("as") && (o = {
                                        as: n.get("as"),
                                        noChildContext: n.get("noChildContext")
                                    }), t = i.createChildContext(t, o), h.Oa(t, e), {
                                        controlsDescendantBindings: !0
                                    }
                                }
                            }, h.h.ea.using = !0, h.c.value = {
                                init: function(t, n, r) {
                                    var i = h.a.R(t),
                                        o = "input" == i;
                                    if (!o || "checkbox" != t.type && "radio" != t.type) {
                                        var a = [],
                                            s = r.get("valueUpdate"),
                                            u = !1,
                                            c = null;
                                        s && (a = "string" == typeof s ? [s] : h.a.wc(s), h.a.Pa(a, "change"));
                                        var l = function() {
                                            c = null, u = !1;
                                            var e = n(),
                                                i = h.w.M(t);
                                            h.m.eb(e, r, "value", i)
                                        };
                                        !h.a.W || !o || "text" != t.type || "off" == t.autocomplete || t.form && "off" == t.form.autocomplete || -1 != h.a.A(a, "propertychange") || (h.a.B(t, "propertychange", function() {
                                            u = !0
                                        }), h.a.B(t, "focus", function() {
                                            u = !1
                                        }), h.a.B(t, "blur", function() {
                                            u && l()
                                        })), h.a.D(a, function(e) {
                                            var n = l;
                                            h.a.Ud(e, "after") && (n = function() {
                                                c = h.w.M(t), h.a.setTimeout(l, 0)
                                            }, e = e.substring(5)), h.a.B(t, e, n)
                                        });
                                        var f;
                                        if (f = o && "file" == t.type ? function() {
                                                var r = h.a.f(n());
                                                null === r || r === e || "" === r ? t.value = "" : h.u.G(l)
                                            } : function() {
                                                var o = h.a.f(n()),
                                                    a = h.w.M(t);
                                                null !== c && o === c ? h.a.setTimeout(f, 0) : o === a && a !== e || ("select" === i ? (a = r.get("valueAllowUnset"), h.w.cb(t, o, a), a || o === h.w.M(t) || h.u.G(l)) : h.w.cb(t, o))
                                            }, "select" === i) {
                                            var d;
                                            h.i.subscribe(t, h.i.H, function() {
                                                d ? r.get("valueAllowUnset") ? f() : l() : (h.a.B(t, "change", l), d = h.o(f, null, {
                                                    l: t
                                                }))
                                            }, null, {
                                                notifyImmediately: !0
                                            })
                                        } else h.a.B(t, "change", l), h.o(f, null, {
                                            l: t
                                        })
                                    } else h.ib(t, {
                                        checkedValue: n
                                    })
                                },
                                update: function() {}
                            }, h.m.wa.value = !0, h.c.visible = {
                                update: function(e, t) {
                                    var n = h.a.f(t()),
                                        r = "none" != e.style.display;
                                    n && !r ? e.style.display = "" : !n && r && (e.style.display = "none")
                                }
                            }, h.c.hidden = {
                                update: function(e, t) {
                                    h.c.visible.update(e, function() {
                                        return !h.a.f(t())
                                    })
                                }
                            },
                            function(e) {
                                h.c[e] = {
                                    init: function(t, n, r, i, o) {
                                        return h.c.event.init.call(this, t, function() {
                                            var t = {};
                                            return t[e] = n(), t
                                        }, r, i, o)
                                    }
                                }
                            }("click"), h.ca = function() {}, h.ca.prototype.renderTemplateSource = function() {
                                throw Error("Override renderTemplateSource")
                            }, h.ca.prototype.createJavaScriptEvaluatorBlock = function() {
                                throw Error("Override createJavaScriptEvaluatorBlock")
                            }, h.ca.prototype.makeTemplateSource = function(e, t) {
                                if ("string" == typeof e) {
                                    t = t || i;
                                    var n = t.getElementById(e);
                                    if (!n) throw Error("Cannot find template with ID " + e);
                                    return new h.C.F(n)
                                }
                                if (1 == e.nodeType || 8 == e.nodeType) return new h.C.ia(e);
                                throw Error("Unknown template type: " + e)
                            }, h.ca.prototype.renderTemplate = function(e, t, n, r) {
                                return e = this.makeTemplateSource(e, r), this.renderTemplateSource(e, t, n, r)
                            }, h.ca.prototype.isTemplateRewritten = function(e, t) {
                                return !1 === this.allowTemplateRewriting || this.makeTemplateSource(e, t).data("isRewritten")
                            }, h.ca.prototype.rewriteTemplate = function(e, t, n) {
                                e = this.makeTemplateSource(e, n), t = t(e.text()), e.text(t), e.data("isRewritten", !0)
                            }, h.b("templateEngine", h.ca), h.kc = function() {
                                function e(e, t, n, r) {
                                    e = h.m.ac(e);
                                    for (var i = h.m.Ra, o = 0; o < e.length; o++) {
                                        var a = e[o].key;
                                        if (Object.prototype.hasOwnProperty.call(i, a)) {
                                            var s = i[a];
                                            if ("function" == typeof s) {
                                                if (a = s(e[o].value)) throw Error(a)
                                            } else if (!s) throw Error("This template engine does not support the '" + a + "' binding within its templates")
                                        }
                                    }
                                    return n = "ko.__tr_ambtns(function($context,$element){return(function(){return{ " + h.m.vb(e, {
                                        valueAccessors: !0
                                    }) + " } })()},'" + n.toLowerCase() + "')", r.createJavaScriptEvaluatorBlock(n) + t
                                }
                                var t = /(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'|[^>]*))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi,
                                    n = /\x3c!--\s*ko\b\s*([\s\S]*?)\s*--\x3e/g;
                                return {
                                    xd: function(e, t, n) {
                                        t.isTemplateRewritten(e, n) || t.rewriteTemplate(e, function(e) {
                                            return h.kc.Ld(e, t)
                                        }, n)
                                    },
                                    Ld: function(r, i) {
                                        return r.replace(t, function(t, n, r, o, a) {
                                            return e(a, n, r, i)
                                        }).replace(n, function(t, n) {
                                            return e(n, "<!-- ko -->", "#comment", i)
                                        })
                                    },
                                    md: function(e, t) {
                                        return h.aa.Xb(function(n, r) {
                                            var i = n.nextSibling;
                                            i && i.nodeName.toLowerCase() === t && h.ib(i, e, r)
                                        })
                                    }
                                }
                            }(), h.b("__tr_ambtns", h.kc.md),
                            function() {
                                h.C = {}, h.C.F = function(e) {
                                    if (this.F = e) {
                                        var t = h.a.R(e);
                                        this.ab = "script" === t ? 1 : "textarea" === t ? 2 : "template" == t && e.content && 11 === e.content.nodeType ? 3 : 4
                                    }
                                }, h.C.F.prototype.text = function() {
                                    var e = 1 === this.ab ? "text" : 2 === this.ab ? "value" : "innerHTML";
                                    if (0 == arguments.length) return this.F[e];
                                    var t = arguments[0];
                                    "innerHTML" === e ? h.a.fc(this.F, t) : this.F[e] = t
                                };
                                var t = h.a.g.Z() + "_";
                                h.C.F.prototype.data = function(e) {
                                    return 1 === arguments.length ? h.a.g.get(this.F, t + e) : void h.a.g.set(this.F, t + e, arguments[1])
                                };
                                var n = h.a.g.Z();
                                h.C.F.prototype.nodes = function() {
                                    var t = this.F;
                                    if (0 == arguments.length) {
                                        var r = h.a.g.get(t, n) || {},
                                            i = r.lb || (3 === this.ab ? t.content : 4 === this.ab ? t : e);
                                        if (!i || r.jd) {
                                            var o = this.text();
                                            o && o !== r.bb && (i = h.a.Md(o, t.ownerDocument), h.a.g.set(t, n, {
                                                lb: i,
                                                bb: o,
                                                jd: !0
                                            }))
                                        }
                                        return i
                                    }
                                    r = arguments[0], this.ab !== e && this.text(""), h.a.g.set(t, n, {
                                        lb: r
                                    })
                                }, h.C.ia = function(e) {
                                    this.F = e
                                }, h.C.ia.prototype = new h.C.F, h.C.ia.prototype.constructor = h.C.ia, h.C.ia.prototype.text = function() {
                                    if (0 == arguments.length) {
                                        var t = h.a.g.get(this.F, n) || {};
                                        return t.bb === e && t.lb && (t.bb = t.lb.innerHTML), t.bb
                                    }
                                    h.a.g.set(this.F, n, {
                                        bb: arguments[0]
                                    })
                                }, h.b("templateSources", h.C), h.b("templateSources.domElement", h.C.F), h.b("templateSources.anonymousTemplate", h.C.ia)
                            }(),
                            function() {
                                function t(e, t, n) {
                                    var r;
                                    for (t = h.h.nextSibling(t); e && (r = e) !== t;) e = h.h.nextSibling(r), n(r, e)
                                }

                                function n(e, n) {
                                    if (e.length) {
                                        var r = e[0],
                                            i = e[e.length - 1],
                                            o = r.parentNode,
                                            a = h.ga.instance,
                                            s = a.preprocessNode;
                                        if (s) {
                                            if (t(r, i, function(e, t) {
                                                    var n = e.previousSibling,
                                                        o = s.call(a, e);
                                                    o && (e === r && (r = o[0] || t), e === i && (i = o[o.length - 1] || n))
                                                }), e.length = 0, !r) return;
                                            r === i ? e.push(r) : (e.push(r, i), h.a.Ua(e, o))
                                        }
                                        t(r, i, function(e) {
                                            1 !== e.nodeType && 8 !== e.nodeType || h.vc(n, e)
                                        }), t(r, i, function(e) {
                                            1 !== e.nodeType && 8 !== e.nodeType || h.aa.cd(e, [n])
                                        }), h.a.Ua(e, o)
                                    }
                                }

                                function r(e) {
                                    return e.nodeType ? e : 0 < e.length ? e[0] : null
                                }

                                function i(e, t, i, o, s) {
                                    s = s || {};
                                    var u = (e && r(e) || i || {}).ownerDocument,
                                        c = s.templateEngine || a;
                                    if (h.kc.xd(i, c, u), i = c.renderTemplate(i, o, s, u), "number" != typeof i.length || 0 < i.length && "number" != typeof i[0].nodeType) throw Error("Template engine must return an array of DOM nodes");
                                    switch (u = !1, t) {
                                        case "replaceChildren":
                                            h.h.va(e, i), u = !0;
                                            break;
                                        case "replaceNode":
                                            h.a.Xc(e, i), u = !0;
                                            break;
                                        case "ignoreTargetNode":
                                            break;
                                        default:
                                            throw Error("Unknown renderMode: " + t)
                                    }
                                    return u && (n(i, o), s.afterRender && h.u.G(s.afterRender, null, [i, o[s.as || "$data"]]), "replaceChildren" == t && h.i.ma(e, h.i.H)), i
                                }

                                function o(e, t, n) {
                                    return h.O(e) ? e() : "function" == typeof e ? e(t, n) : e
                                }
                                var a;
                                h.gc = function(t) {
                                    if (t != e && !(t instanceof h.ca)) throw Error("templateEngine must inherit from ko.templateEngine");
                                    a = t
                                }, h.dc = function(t, n, s, u, c) {
                                    if (s = s || {}, (s.templateEngine || a) == e) throw Error("Set a template engine before calling renderTemplate");
                                    if (c = c || "replaceChildren", u) {
                                        var l = r(u);
                                        return h.$(function() {
                                            var e = n && n instanceof h.fa ? n : new h.fa(n, null, null, null, {
                                                    exportDependencies: !0
                                                }),
                                                a = o(t, e.$data, e),
                                                e = i(u, c, a, e, s);
                                            "replaceNode" == c && (u = e, l = r(u))
                                        }, null, {
                                            Sa: function() {
                                                return !l || !h.a.Sb(l)
                                            },
                                            l: l && "replaceNode" == c ? l.parentNode : l
                                        })
                                    }
                                    return h.aa.Xb(function(e) {
                                        h.dc(t, n, s, e, "replaceNode")
                                    })
                                }, h.Qd = function(t, r, a, s, u) {
                                    function c(e, t) {
                                        h.u.G(h.a.ec, null, [s, e, f, a, l, t]), h.i.ma(s, h.i.H)
                                    }

                                    function l(e, t) {
                                        n(t, d), a.afterRender && a.afterRender(t, e), d = null
                                    }

                                    function f(e, n) {
                                        d = u.createChildContext(e, {
                                            as: p,
                                            noChildContext: a.noChildContext,
                                            extend: function(e) {
                                                e.$index = n, p && (e[p + "Index"] = n)
                                            }
                                        });
                                        var r = o(t, e, d);
                                        return i(s, "ignoreTargetNode", r, d, a)
                                    }
                                    var d, p = a.as,
                                        g = !1 === a.includeDestroyed || h.options.foreachHidesDestroyed && !a.includeDestroyed;
                                    if (g || a.beforeRemove || !h.Pc(r)) return h.$(function() {
                                        var t = h.a.f(r) || [];
                                        "undefined" == typeof t.length && (t = [t]), g && (t = h.a.jb(t, function(t) {
                                            return t === e || null === t || !h.a.f(t._destroy)
                                        })), c(t)
                                    }, null, {
                                        l: s
                                    });
                                    c(r.v());
                                    var v = r.subscribe(function(e) {
                                        c(r(), e)
                                    }, null, "arrayChange");
                                    return v.l(s), v
                                };
                                var s = h.a.g.Z(),
                                    u = h.a.g.Z();
                                h.c.template = {
                                    init: function(e, t) {
                                        var n = h.a.f(t());
                                        if ("string" == typeof n || "name" in n) h.h.Ea(e);
                                        else if ("nodes" in n) {
                                            if (n = n.nodes || [], h.O(n)) throw Error('The "nodes" option must be a plain, non-observable array.');
                                            var r = n[0] && n[0].parentNode;
                                            r && h.a.g.get(r, u) || (r = h.a.Yb(n), h.a.g.set(r, u, !0)), new h.C.ia(e).nodes(r)
                                        } else {
                                            if (n = h.h.childNodes(e), !(0 < n.length)) throw Error("Anonymous template defined, but no template content was provided");
                                            r = h.a.Yb(n), new h.C.ia(e).nodes(r)
                                        }
                                        return {
                                            controlsDescendantBindings: !0
                                        }
                                    },
                                    update: function(t, n, r, i, o) {
                                        var a = n();
                                        n = h.a.f(a), r = !0, i = null, "string" == typeof n ? n = {} : (a = "name" in n ? n.name : t, "if" in n && (r = h.a.f(n["if"])), r && "ifnot" in n && (r = !h.a.f(n.ifnot)), r && !a && (r = !1)), "foreach" in n ? i = h.Qd(a, r && n.foreach || [], n, t, o) : r ? (r = o, "data" in n && (r = o.createChildContext(n.data, {
                                            as: n.as,
                                            noChildContext: n.noChildContext,
                                            exportDependencies: !0
                                        })), i = h.dc(a, r, n, t)) : h.h.Ea(t), o = i, (n = h.a.g.get(t, s)) && "function" == typeof n.s && n.s(), h.a.g.set(t, s, !o || o.ja && !o.ja() ? e : o)
                                    }
                                }, h.m.Ra.template = function(e) {
                                    return e = h.m.ac(e), 1 == e.length && e[0].unknown || h.m.Id(e, "name") ? null : "This template engine does not support anonymous templates nested within its templates"
                                }, h.h.ea.template = !0
                            }(), h.b("setTemplateEngine", h.gc), h.b("renderTemplate", h.dc), h.a.Kc = function(e, t, n) {
                                if (e.length && t.length) {
                                    var r, i, o, a, s;
                                    for (r = i = 0;
                                        (!n || r < n) && (a = e[i]); ++i) {
                                        for (o = 0; s = t[o]; ++o)
                                            if (a.value === s.value) {
                                                a.moved = s.index, s.moved = a.index, t.splice(o, 1), r = o = 0;
                                                break
                                            }
                                        r += o
                                    }
                                }
                            }, h.a.Pb = function() {
                                function e(e, t, n, r, i) {
                                    var o, a, s, u, c, l = Math.min,
                                        f = Math.max,
                                        d = [],
                                        p = e.length,
                                        g = t.length,
                                        v = g - p || 1,
                                        m = p + g + 1;
                                    for (o = 0; o <= p; o++)
                                        for (u = s, d.push(s = []), c = l(g, o + v), a = f(0, o - 1); a <= c; a++) s[a] = a ? o ? e[o - 1] === t[a - 1] ? u[a - 1] : l(u[a] || m, s[a - 1] || m) + 1 : a + 1 : o + 1;
                                    for (l = [], f = [], v = [], o = p, a = g; o || a;) g = d[o][a] - 1, a && g === d[o][a - 1] ? f.push(l[l.length] = {
                                        status: n,
                                        value: t[--a],
                                        index: a
                                    }) : o && g === d[o - 1][a] ? v.push(l[l.length] = {
                                        status: r,
                                        value: e[--o],
                                        index: o
                                    }) : (--a, --o, i.sparse || l.push({
                                        status: "retained",
                                        value: t[a]
                                    }));
                                    return h.a.Kc(v, f, !i.dontLimitMoves && 10 * p), l.reverse()
                                }
                                return function(t, n, r) {
                                    return r = "boolean" == typeof r ? {
                                        dontLimitMoves: r
                                    } : r || {}, t = t || [], n = n || [], t.length < n.length ? e(t, n, "added", "deleted", r) : e(n, t, "deleted", "added", r)
                                }
                            }(), h.b("utils.compareArrays", h.a.Pb),
                            function() {
                                function t(t, n, r, i, o) {
                                    var a = [],
                                        s = h.$(function() {
                                            var e = n(r, o, h.a.Ua(a, t)) || [];
                                            0 < a.length && (h.a.Xc(a, e), i && h.u.G(i, null, [r, e, o])), a.length = 0, h.a.Nb(a, e)
                                        }, null, {
                                            l: t,
                                            Sa: function() {
                                                return !h.a.kd(a)
                                            }
                                        });
                                    return {
                                        Y: a,
                                        $: s.ja() ? s : e
                                    }
                                }
                                var n = h.a.g.Z(),
                                    r = h.a.g.Z();
                                h.a.ec = function(i, o, a, s, u, c) {
                                    function l(e) {
                                        p = {
                                            Aa: e,
                                            pb: h.ta(b++)
                                        }, m.push(p), v || C.push(p)
                                    }

                                    function f(e) {
                                        p = g[e], b !== p.pb.v() && S.push(p), p.pb(b++), h.a.Ua(p.Y, i), m.push(p)
                                    }

                                    function d(e, t) {
                                        if (e)
                                            for (var n = 0, r = t.length; n < r; n++) h.a.D(t[n].Y, function(r) {
                                                e(r, n, t[n].Aa)
                                            })
                                    }
                                    o = o || [], "undefined" == typeof o.length && (o = [o]), s = s || {};
                                    var p, g = h.a.g.get(i, n),
                                        v = !g,
                                        m = [],
                                        y = 0,
                                        b = 0,
                                        x = [],
                                        w = [],
                                        T = [],
                                        S = [],
                                        C = [],
                                        E = 0;
                                    if (v) h.a.D(o, l);
                                    else {
                                        if (!c || g && g._countWaitingForRemove) {
                                            var k = h.a.Mb(g, function(e) {
                                                return e.Aa
                                            });
                                            c = h.a.Pb(k, o, {
                                                dontLimitMoves: s.dontLimitMoves,
                                                sparse: !0
                                            })
                                        }
                                        for (var N, j, I, k = 0; N = c[k]; k++) switch (j = N.moved, I = N.index, N.status) {
                                            case "deleted":
                                                for (; y < I;) f(y++);
                                                j === e && (p = g[y], p.$ && (p.$.s(), p.$ = e), h.a.Ua(p.Y, i).length && (s.beforeRemove && (m.push(p), E++, p.Aa === r ? p = null : T.push(p)), p && x.push.apply(x, p.Y))), y++;
                                                break;
                                            case "added":
                                                for (; b < I;) f(y++);
                                                j !== e ? (w.push(m.length), f(j)) : l(N.value)
                                        }
                                        for (; b < o.length;) f(y++);
                                        m._countWaitingForRemove = E
                                    }
                                    h.a.g.set(i, n, m), d(s.beforeMove, S), h.a.D(x, s.beforeRemove ? h.oa : h.removeNode);
                                    var A, O, D;
                                    try {
                                        D = i.ownerDocument.activeElement
                                    } catch (H) {}
                                    if (w.length)
                                        for (;
                                            (k = w.shift()) != e;) {
                                            for (p = m[k], A = e; k;)
                                                if ((O = m[--k].Y) && O.length) {
                                                    A = O[O.length - 1];
                                                    break
                                                }
                                            for (o = 0; y = p.Y[o]; A = y, o++) h.h.Wb(i, y, A)
                                        }
                                    for (k = 0; p = m[k]; k++) {
                                        for (p.Y || h.a.extend(p, t(i, a, p.Aa, u, p.pb)), o = 0; y = p.Y[o]; A = y, o++) h.h.Wb(i, y, A);
                                        !p.Ed && u && (u(p.Aa, p.Y, p.pb), p.Ed = !0, A = p.Y[p.Y.length - 1])
                                    }
                                    for (D && i.ownerDocument.activeElement != D && D.focus(), d(s.beforeRemove, T), k = 0; k < T.length; ++k) T[k].Aa = r;
                                    d(s.afterMove, S), d(s.afterAdd, C)
                                }
                            }(), h.b("utils.setDomNodeChildrenFromArrayMapping", h.a.ec), h.ba = function() {
                                this.allowTemplateRewriting = !1
                            }, h.ba.prototype = new h.ca, h.ba.prototype.constructor = h.ba, h.ba.prototype.renderTemplateSource = function(e, t, n, r) {
                                return (t = (9 > h.a.W ? 0 : e.nodes) ? e.nodes() : null) ? h.a.la(t.cloneNode(!0).childNodes) : (e = e.text(), h.a.ua(e, r))
                            }, h.ba.Ma = new h.ba, h.gc(h.ba.Ma), h.b("nativeTemplateEngine", h.ba),
                            function() {
                                h.$a = function() {
                                    var e = this.Hd = function() {
                                        if (!a || !a.tmpl) return 0;
                                        try {
                                            if (0 <= a.tmpl.tag.tmpl.open.toString().indexOf("__")) return 2
                                        } catch (e) {}
                                        return 1
                                    }();
                                    this.renderTemplateSource = function(t, n, r, o) {
                                        if (o = o || i, r = r || {}, 2 > e) throw Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");
                                        var s = t.data("precompiled");
                                        return s || (s = t.text() || "", s = a.template(null, "{{ko_with $item.koBindingContext}}" + s + "{{/ko_with}}"), t.data("precompiled", s)), t = [n.$data], n = a.extend({
                                            koBindingContext: n
                                        }, r.templateOptions), n = a.tmpl(s, t, n), n.appendTo(o.createElement("div")), a.fragments = {}, n
                                    }, this.createJavaScriptEvaluatorBlock = function(e) {
                                        return "{{ko_code ((function() { return " + e + " })()) }}"
                                    }, this.addTemplate = function(e, t) {
                                        i.write("<script type='text/html' id='" + e + "'>" + t + "</script>")
                                    }, 0 < e && (a.tmpl.tag.ko_code = {
                                        open: "__.push($1 || '');"
                                    }, a.tmpl.tag.ko_with = {
                                        open: "with($1) {",
                                        close: "} "
                                    })
                                }, h.$a.prototype = new h.ca, h.$a.prototype.constructor = h.$a;
                                var e = new h.$a;
                                0 < e.Hd && h.gc(e), h.b("jqueryTmplTemplateEngine", h.$a)
                            }()
                    })
            }()
        }()
    }, {}],
    6: [function(e, t, n) {
        function r(e, t, n) {
            $.ajax({
                url: e,
                success: function(e) {
                    t.html(e), n && n()
                }
            })
        }
        window.getResultViaAjax = r
    }, {}],
    7: [function(require, module, exports) {
        "object" != typeof JSON && (JSON = {}),
            function() {
                "use strict";

                function f(e) {
                    return e < 10 ? "0" + e : e
                }

                function quote(e) {
                    return escapable.lastIndex = 0, escapable.test(e) ? '"' + e.replace(escapable, function(e) {
                        var t = meta[e];
                        return "string" == typeof t ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                    }) + '"' : '"' + e + '"'
                }

                function str(e, t) {
                    var n, r, i, o, a, s = gap,
                        u = t[e];
                    switch (u && "object" == typeof u && "function" == typeof u.toJSON && (u = u.toJSON(e)), "function" == typeof rep && (u = rep.call(t, e, u)), typeof u) {
                        case "string":
                            return quote(u);
                        case "number":
                            return isFinite(u) ? String(u) : "null";
                        case "boolean":
                        case "null":
                            return String(u);
                        case "object":
                            if (!u) return "null";
                            if (gap += indent, a = [], "[object Array]" === Object.prototype.toString.apply(u)) {
                                for (o = u.length, n = 0; n < o; n += 1) a[n] = str(n, u) || "null";
                                return i = 0 === a.length ? "[]" : gap ? "[\n" + gap + a.join(",\n" + gap) + "\n" + s + "]" : "[" + a.join(",") + "]", gap = s, i
                            }
                            if (rep && "object" == typeof rep)
                                for (o = rep.length, n = 0; n < o; n += 1) "string" == typeof rep[n] && (r = rep[n], i = str(r, u), i && a.push(quote(r) + (gap ? ": " : ":") + i));
                            else
                                for (r in u) Object.prototype.hasOwnProperty.call(u, r) && (i = str(r, u), i && a.push(quote(r) + (gap ? ": " : ":") + i));
                            return i = 0 === a.length ? "{}" : gap ? "{\n" + gap + a.join(",\n" + gap) + "\n" + s + "}" : "{" + a.join(",") + "}", gap = s, i
                    }
                }
                "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function(e) {
                    return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
                }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(e) {
                    return this.valueOf()
                });
                var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                    gap, indent, meta = {
                        "\b": "\\b",
                        "\t": "\\t",
                        "\n": "\\n",
                        "\f": "\\f",
                        "\r": "\\r",
                        '"': '\\"',
                        "\\": "\\\\"
                    },
                    rep;
                "function" != typeof JSON.stringify && (JSON.stringify = function(e, t, n) {
                    var r;
                    if (gap = "", indent = "", "number" == typeof n)
                        for (r = 0; r < n; r += 1) indent += " ";
                    else "string" == typeof n && (indent = n);
                    if (rep = t, !t || "function" == typeof t || "object" == typeof t && "number" == typeof t.length) return str("", {
                        "": e
                    });
                    throw new Error("JSON.stringify")
                }), "function" != typeof JSON.parse && (JSON.parse = function(text, reviver) {
                    function walk(e, t) {
                        var n, r, i = e[t];
                        if (i && "object" == typeof i)
                            for (n in i) Object.prototype.hasOwnProperty.call(i, n) && (r = walk(i, n), void 0 !== r ? i[n] = r : delete i[n]);
                        return reviver.call(e, t, i)
                    }
                    var j;
                    if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(e) {
                            return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                        })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({
                        "": j
                    }, "") : j;
                    throw new SyntaxError("JSON.parse")
                })
            }(),
            function(e, t) {
                "use strict";
                var n = e.History = e.History || {},
                    r = e.jQuery;
                if ("undefined" != typeof n.Adapter) throw new Error("History.js Adapter has already been loaded...");
                n.Adapter = {
                    bind: function(e, t, n) {
                        r(e).bind(t, n)
                    },
                    trigger: function(e, t, n) {
                        r(e).trigger(t, n)
                    },
                    extractEventData: function(e, n, r) {
                        var i = n && n.originalEvent && n.originalEvent[e] || r && r[e] || t;
                        return i
                    },
                    onDomLoad: function(e) {
                        r(e)
                    }
                }, "undefined" != typeof n.init && n.init()
            }(window),
            function(e, t) {
                "use strict";
                var n = e.document,
                    r = e.setTimeout || r,
                    i = e.clearTimeout || i,
                    o = e.setInterval || o,
                    a = e.History = e.History || {};
                if ("undefined" != typeof a.initHtml4) throw new Error("History.js HTML4 Support has already been loaded...");
                a.initHtml4 = function() {
                    return "undefined" == typeof a.initHtml4.initialized && (a.initHtml4.initialized = !0, a.enabled = !0, a.savedHashes = [], a.isLastHash = function(e) {
                        var t, n = a.getHashByIndex();
                        return t = e === n
                    }, a.isHashEqual = function(e, t) {
                        return e = encodeURIComponent(e).replace(/%25/g, "%"), t = encodeURIComponent(t).replace(/%25/g, "%"), e === t
                    }, a.saveHash = function(e) {
                        return !a.isLastHash(e) && (a.savedHashes.push(e), !0)
                    }, a.getHashByIndex = function(e) {
                        var t = null;
                        return t = "undefined" == typeof e ? a.savedHashes[a.savedHashes.length - 1] : e < 0 ? a.savedHashes[a.savedHashes.length + e] : a.savedHashes[e]
                    }, a.discardedHashes = {}, a.discardedStates = {}, a.discardState = function(e, t, n) {
                        var r, i = a.getHashByState(e);
                        return r = {
                            discardedState: e,
                            backState: n,
                            forwardState: t
                        }, a.discardedStates[i] = r, !0
                    }, a.discardHash = function(e, t, n) {
                        var r = {
                            discardedHash: e,
                            backState: n,
                            forwardState: t
                        };
                        return a.discardedHashes[e] = r, !0
                    }, a.discardedState = function(e) {
                        var t, n = a.getHashByState(e);
                        return t = a.discardedStates[n] || !1
                    }, a.discardedHash = function(e) {
                        var t = a.discardedHashes[e] || !1;
                        return t
                    }, a.recycleState = function(e) {
                        var t = a.getHashByState(e);
                        return a.discardedState(e) && delete a.discardedStates[t], !0
                    }, a.emulated.hashChange && (a.hashChangeInit = function() {
                        a.checkerFunction = null;
                        var t, r, i, s, u = "",
                            c = Boolean(a.getHash());
                        return a.isInternetExplorer() ? (t = "historyjs-iframe", r = n.createElement("iframe"), r.setAttribute("id", t), r.setAttribute("src", "#"), r.style.display = "none", n.body.appendChild(r), r.contentWindow.document.open(), r.contentWindow.document.close(), i = "", s = !1, a.checkerFunction = function() {
                            if (s) return !1;
                            s = !0;
                            var t = a.getHash(),
                                n = a.getHash(r.contentWindow.document);
                            return t !== u ? (u = t, n !== t && (i = n = t, r.contentWindow.document.open(), r.contentWindow.document.close(), r.contentWindow.document.location.hash = a.escapeHash(t)), a.Adapter.trigger(e, "hashchange")) : n !== i && (i = n, c && "" === n ? a.back() : a.setHash(n, !1)), s = !1, !0
                        }) : a.checkerFunction = function() {
                            var t = a.getHash() || "";
                            return t !== u && (u = t, a.Adapter.trigger(e, "hashchange")), !0
                        }, a.intervalList.push(o(a.checkerFunction, a.options.hashChangeInterval)), !0
                    }, a.Adapter.onDomLoad(a.hashChangeInit)), a.emulated.pushState && (a.onHashChange = function(t) {
                        var n, r = t && t.newURL || a.getLocationHref(),
                            i = a.getHashByUrl(r),
                            o = null,
                            s = null;
                        return a.isLastHash(i) ? (a.busy(!1), !1) : (a.doubleCheckComplete(), a.saveHash(i), i && a.isTraditionalAnchor(i) ? (a.Adapter.trigger(e, "anchorchange"), a.busy(!1), !1) : (o = a.extractState(a.getFullUrl(i || a.getLocationHref()), !0), a.isLastSavedState(o) ? (a.busy(!1), !1) : (s = a.getHashByState(o), n = a.discardedState(o), n ? (a.getHashByIndex(-2) === a.getHashByState(n.forwardState) ? a.back(!1) : a.forward(!1), !1) : (a.pushState(o.data, o.title, encodeURI(o.url), !1), !0))))
                    }, a.Adapter.bind(e, "hashchange", a.onHashChange), a.pushState = function(t, n, r, i) {
                        if (r = encodeURI(r).replace(/%25/g, "%"), a.getHashByUrl(r)) throw new Error("History.js does not support states with fragment-identifiers (hashes/anchors).");
                        if (i !== !1 && a.busy()) return a.pushQueue({
                            scope: a,
                            callback: a.pushState,
                            args: arguments,
                            queue: i
                        }), !1;
                        a.busy(!0);
                        var o = a.createStateObject(t, n, r),
                            s = a.getHashByState(o),
                            u = a.getState(!1),
                            c = a.getHashByState(u),
                            l = a.getHash(),
                            f = a.expectedStateId == o.id;
                        return a.storeState(o), a.expectedStateId = o.id, a.recycleState(o), a.setTitle(o), s === c ? (a.busy(!1), !1) : (a.saveState(o), f || a.Adapter.trigger(e, "statechange"), !a.isHashEqual(s, l) && !a.isHashEqual(s, a.getShortUrl(a.getLocationHref())) && a.setHash(s, !1), a.busy(!1), !0)
                    }, a.replaceState = function(t, n, r, i) {
                        if (r = encodeURI(r).replace(/%25/g, "%"), a.getHashByUrl(r)) throw new Error("History.js does not support states with fragment-identifiers (hashes/anchors).");
                        if (i !== !1 && a.busy()) return a.pushQueue({
                            scope: a,
                            callback: a.replaceState,
                            args: arguments,
                            queue: i
                        }), !1;
                        a.busy(!0);
                        var o = a.createStateObject(t, n, r),
                            s = a.getHashByState(o),
                            u = a.getState(!1),
                            c = a.getHashByState(u),
                            l = a.getStateByIndex(-2);
                        return a.discardState(u, o, l), s === c ? (a.storeState(o), a.expectedStateId = o.id, a.recycleState(o), a.setTitle(o), a.saveState(o), a.Adapter.trigger(e, "statechange"), a.busy(!1)) : a.pushState(o.data, o.title, o.url, !1), !0
                    }), a.emulated.pushState && a.getHash() && !a.emulated.hashChange && a.Adapter.onDomLoad(function() {
                        a.Adapter.trigger(e, "hashchange")
                    }), void 0)
                }, "undefined" != typeof a.init && a.init()
            }(window),
            function(e, t) {
                "use strict";
                var n = e.console || t,
                    r = e.document,
                    i = e.navigator,
                    o = !1,
                    a = e.setTimeout,
                    s = e.clearTimeout,
                    u = e.setInterval,
                    c = e.clearInterval,
                    l = e.JSON,
                    f = e.alert,
                    d = e.History = e.History || {},
                    p = e.history;
                try {
                    o = e.sessionStorage, o.setItem("TEST", "1"), o.removeItem("TEST")
                } catch (h) {
                    o = !1
                }
                if (l.stringify = l.stringify || l.encode, l.parse = l.parse || l.decode, "undefined" != typeof d.init) throw new Error("History.js Core has already been loaded...");
                d.init = function(e) {
                    return "undefined" != typeof d.Adapter && ("undefined" != typeof d.initCore && d.initCore(), "undefined" != typeof d.initHtml4 && d.initHtml4(), !0)
                }, d.initCore = function(h) {
                    if ("undefined" != typeof d.initCore.initialized) return !1;
                    if (d.initCore.initialized = !0, d.options = d.options || {}, d.options.hashChangeInterval = d.options.hashChangeInterval || 100, d.options.safariPollInterval = d.options.safariPollInterval || 500, d.options.doubleCheckInterval = d.options.doubleCheckInterval || 500, d.options.disableSuid = d.options.disableSuid || !1, d.options.storeInterval = d.options.storeInterval || 1e3, d.options.busyDelay = d.options.busyDelay || 250, d.options.debug = d.options.debug || !1, d.options.initialTitle = d.options.initialTitle || r.title, d.options.html4Mode = d.options.html4Mode || !1, d.options.delayInit = d.options.delayInit || !1, d.intervalList = [], d.clearAllIntervals = function() {
                            var e, t = d.intervalList;
                            if ("undefined" != typeof t && null !== t) {
                                for (e = 0; e < t.length; e++) c(t[e]);
                                d.intervalList = null
                            }
                        }, d.debug = function() {
                            (d.options.debug || !1) && d.log.apply(d, arguments)
                        }, d.log = function() {
                            var e, t, i, o, a, s = "undefined" != typeof n && "undefined" != typeof n.log && "undefined" != typeof n.log.apply,
                                u = r.getElementById("log");
                            for (s ? (o = Array.prototype.slice.call(arguments), e = o.shift(), "undefined" != typeof n.debug ? n.debug.apply(n, [e, o]) : n.log.apply(n, [e, o])) : e = "\n" + arguments[0] + "\n", t = 1, i = arguments.length; t < i; ++t) {
                                if (a = arguments[t], "object" == typeof a && "undefined" != typeof l) try {
                                    a = l.stringify(a)
                                } catch (c) {}
                                e += "\n" + a + "\n"
                            }
                            return u ? (u.value += e + "\n-----\n", u.scrollTop = u.scrollHeight - u.clientHeight) : s || f(e), !0
                        }, d.getInternetExplorerMajorVersion = function() {
                            var e = d.getInternetExplorerMajorVersion.cached = "undefined" != typeof d.getInternetExplorerMajorVersion.cached ? d.getInternetExplorerMajorVersion.cached : function() {
                                for (var e = 3, t = r.createElement("div"), n = t.getElementsByTagName("i");
                                    (t.innerHTML = "<!--[if gt IE " + ++e + "]><i></i><![endif]-->") && n[0];);
                                return e > 4 && e
                            }();
                            return e
                        }, d.isInternetExplorer = function() {
                            var e = d.isInternetExplorer.cached = "undefined" != typeof d.isInternetExplorer.cached ? d.isInternetExplorer.cached : Boolean(d.getInternetExplorerMajorVersion());
                            return e
                        }, d.options.html4Mode ? d.emulated = {
                            pushState: !0,
                            hashChange: !0
                        } : d.emulated = {
                            pushState: !Boolean(e.history && e.history.pushState && e.history.replaceState && !/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i.test(i.userAgent) && !/AppleWebKit\/5([0-2]|3[0-2])/i.test(i.userAgent)),
                            hashChange: Boolean(!("onhashchange" in e || "onhashchange" in r) || d.isInternetExplorer() && d.getInternetExplorerMajorVersion() < 8)
                        }, d.enabled = !d.emulated.pushState, d.bugs = {
                            setHash: Boolean(!d.emulated.pushState && "Apple Computer, Inc." === i.vendor && /AppleWebKit\/5([0-2]|3[0-3])/.test(i.userAgent)),
                            safariPoll: Boolean(!d.emulated.pushState && "Apple Computer, Inc." === i.vendor && /AppleWebKit\/5([0-2]|3[0-3])/.test(i.userAgent)),
                            ieDoubleCheck: Boolean(d.isInternetExplorer() && d.getInternetExplorerMajorVersion() < 8),
                            hashEscape: Boolean(d.isInternetExplorer() && d.getInternetExplorerMajorVersion() < 7)
                        }, d.isEmptyObject = function(e) {
                            for (var t in e)
                                if (e.hasOwnProperty(t)) return !1;
                            return !0
                        }, d.cloneObject = function(e) {
                            var t, n;
                            return e ? (t = l.stringify(e), n = l.parse(t)) : n = {}, n
                        }, d.getRootUrl = function() {
                            var e = r.location.protocol + "//" + (r.location.hostname || r.location.host);
                            return r.location.port && (e += ":" + r.location.port), e += "/"
                        }, d.getBaseHref = function() {
                            var e = r.getElementsByTagName("base"),
                                t = null,
                                n = "";
                            return 1 === e.length && (t = e[0], n = t.href.replace(/[^\/]+$/, "")), n = n.replace(/\/+$/, ""), n && (n += "/"), n
                        }, d.getBaseUrl = function() {
                            var e = d.getBaseHref() || d.getBasePageUrl() || d.getRootUrl();
                            return e
                        }, d.getPageUrl = function() {
                            var e, t = d.getState(!1, !1),
                                n = (t || {}).url || d.getLocationHref();
                            return e = n.replace(/\/+$/, "").replace(/[^\/]+$/, function(e, t, n) {
                                return /\./.test(e) ? e : e + "/"
                            })
                        }, d.getBasePageUrl = function() {
                            var e = d.getLocationHref().replace(/[#\?].*/, "").replace(/[^\/]+$/, function(e, t, n) {
                                return /[^\/]$/.test(e) ? "" : e
                            }).replace(/\/+$/, "") + "/";
                            return e
                        }, d.getFullUrl = function(e, t) {
                            var n = e,
                                r = e.substring(0, 1);
                            return t = "undefined" == typeof t || t, /[a-z]+\:\/\//.test(e) || (n = "/" === r ? d.getRootUrl() + e.replace(/^\/+/, "") : "#" === r ? d.getPageUrl().replace(/#.*/, "") + e : "?" === r ? d.getPageUrl().replace(/[\?#].*/, "") + e : t ? d.getBaseUrl() + e.replace(/^(\.\/)+/, "") : d.getBasePageUrl() + e.replace(/^(\.\/)+/, "")), n.replace(/\#$/, "")
                        }, d.getShortUrl = function(e) {
                            var t = e,
                                n = d.getBaseUrl(),
                                r = d.getRootUrl();
                            return d.emulated.pushState && (t = t.replace(n, "")), t = t.replace(r, "/"), d.isTraditionalAnchor(t) && (t = "./" + t), t = t.replace(/^(\.\/)+/g, "./").replace(/\#$/, "")
                        }, d.getLocationHref = function(e) {
                            return e = e || r, e.URL === e.location.href ? e.location.href : e.location.href === decodeURIComponent(e.URL) ? e.URL : e.location.hash && decodeURIComponent(e.location.href.replace(/^[^#]+/, "")) === e.location.hash ? e.location.href : e.URL.indexOf("#") == -1 && e.location.href.indexOf("#") != -1 ? e.location.href : e.URL || e.location.href
                        }, d.store = {}, d.idToState = d.idToState || {}, d.stateToId = d.stateToId || {}, d.urlToId = d.urlToId || {}, d.storedStates = d.storedStates || [], d.savedStates = d.savedStates || [], d.normalizeStore = function() {
                            d.store.idToState = d.store.idToState || {}, d.store.urlToId = d.store.urlToId || {}, d.store.stateToId = d.store.stateToId || {}
                        }, d.getState = function(e, t) {
                            "undefined" == typeof e && (e = !0), "undefined" == typeof t && (t = !0);
                            var n = d.getLastSavedState();
                            return !n && t && (n = d.createStateObject()), e && (n = d.cloneObject(n), n.url = n.cleanUrl || n.url), n
                        }, d.getIdByState = function(e) {
                            var t, n = d.extractId(e.url);
                            if (!n)
                                if (t = d.getStateString(e), "undefined" != typeof d.stateToId[t]) n = d.stateToId[t];
                                else if ("undefined" != typeof d.store.stateToId[t]) n = d.store.stateToId[t];
                            else {
                                for (; n = (new Date).getTime() + String(Math.random()).replace(/\D/g, ""), "undefined" != typeof d.idToState[n] || "undefined" != typeof d.store.idToState[n];);
                                d.stateToId[t] = n, d.idToState[n] = e
                            }
                            return n
                        }, d.normalizeState = function(e) {
                            var t, n;
                            return e && "object" == typeof e || (e = {}), "undefined" != typeof e.normalized ? e : (e.data && "object" == typeof e.data || (e.data = {}), t = {}, t.normalized = !0, t.title = e.title || "", t.url = d.getFullUrl(e.url ? e.url : d.getLocationHref()), t.hash = d.getShortUrl(t.url), t.data = d.cloneObject(e.data), t.id = d.getIdByState(t), t.cleanUrl = t.url.replace(/\??\&_suid.*/, ""), t.url = t.cleanUrl, n = !d.isEmptyObject(t.data), (t.title || n) && d.options.disableSuid !== !0 && (t.hash = d.getShortUrl(t.url).replace(/\??\&_suid.*/, ""), /\?/.test(t.hash) || (t.hash += "?"), t.hash += "&_suid=" + t.id), t.hashedUrl = d.getFullUrl(t.hash), (d.emulated.pushState || d.bugs.safariPoll) && d.hasUrlDuplicate(t) && (t.url = t.hashedUrl), t)
                        }, d.createStateObject = function(e, t, n) {
                            var r = {
                                data: e,
                                title: t,
                                url: n
                            };
                            return r = d.normalizeState(r)
                        }, d.getStateById = function(e) {
                            e = String(e);
                            var n = d.idToState[e] || d.store.idToState[e] || t;
                            return n
                        }, d.getStateString = function(e) {
                            var t, n, r;
                            return t = d.normalizeState(e), n = {
                                data: t.data,
                                title: e.title,
                                url: e.url
                            }, r = l.stringify(n)
                        }, d.getStateId = function(e) {
                            var t, n;
                            return t = d.normalizeState(e), n = t.id
                        }, d.getHashByState = function(e) {
                            var t, n;
                            return t = d.normalizeState(e), n = t.hash
                        }, d.extractId = function(e) {
                            var t, n, r, i;
                            return i = e.indexOf("#") != -1 ? e.split("#")[0] : e, n = /(.*)\&_suid=([0-9]+)$/.exec(i), r = n ? n[1] || e : e, t = n ? String(n[2] || "") : "", t || !1
                        }, d.isTraditionalAnchor = function(e) {
                            var t = !/[\/\?\.]/.test(e);
                            return t
                        }, d.extractState = function(e, t) {
                            var n, r, i = null;
                            return t = t || !1, n = d.extractId(e), n && (i = d.getStateById(n)), i || (r = d.getFullUrl(e), n = d.getIdByUrl(r) || !1, n && (i = d.getStateById(n)), !i && t && !d.isTraditionalAnchor(e) && (i = d.createStateObject(null, null, r))), i
                        }, d.getIdByUrl = function(e) {
                            var n = d.urlToId[e] || d.store.urlToId[e] || t;
                            return n
                        }, d.getLastSavedState = function() {
                            return d.savedStates[d.savedStates.length - 1] || t
                        }, d.getLastStoredState = function() {
                            return d.storedStates[d.storedStates.length - 1] || t
                        }, d.hasUrlDuplicate = function(e) {
                            var t, n = !1;
                            return t = d.extractState(e.url), n = t && t.id !== e.id
                        }, d.storeState = function(e) {
                            return d.urlToId[e.url] = e.id, d.storedStates.push(d.cloneObject(e)), e
                        }, d.isLastSavedState = function(e) {
                            var t, n, r, i = !1;
                            return d.savedStates.length && (t = e.id, n = d.getLastSavedState(), r = n.id, i = t === r), i
                        }, d.saveState = function(e) {
                            return !d.isLastSavedState(e) && (d.savedStates.push(d.cloneObject(e)), !0)
                        }, d.getStateByIndex = function(e) {
                            var t = null;
                            return t = "undefined" == typeof e ? d.savedStates[d.savedStates.length - 1] : e < 0 ? d.savedStates[d.savedStates.length + e] : d.savedStates[e]
                        }, d.getCurrentIndex = function() {
                            var e = null;
                            return e = d.savedStates.length < 1 ? 0 : d.savedStates.length - 1
                        }, d.getHash = function(e) {
                            var t, n = d.getLocationHref(e);
                            return t = d.getHashByUrl(n)
                        }, d.unescapeHash = function(e) {
                            var t = d.normalizeHash(e);
                            return t = decodeURIComponent(t)
                        }, d.normalizeHash = function(e) {
                            var t = e.replace(/[^#]*#/, "").replace(/#.*/, "");
                            return t
                        }, d.setHash = function(e, t) {
                            var n, i;
                            return t !== !1 && d.busy() ? (d.pushQueue({
                                scope: d,
                                callback: d.setHash,
                                args: arguments,
                                queue: t
                            }), !1) : (d.busy(!0), n = d.extractState(e, !0), n && !d.emulated.pushState ? d.pushState(n.data, n.title, n.url, !1) : d.getHash() !== e && (d.bugs.setHash ? (i = d.getPageUrl(), d.pushState(null, null, i + "#" + e, !1)) : r.location.hash = e), d)
                        }, d.escapeHash = function(t) {
                            var n = d.normalizeHash(t);
                            return n = e.encodeURIComponent(n), d.bugs.hashEscape || (n = n.replace(/\%21/g, "!").replace(/\%26/g, "&").replace(/\%3D/g, "=").replace(/\%3F/g, "?")), n
                        }, d.getHashByUrl = function(e) {
                            var t = String(e).replace(/([^#]*)#?([^#]*)#?(.*)/, "$2");
                            return t = d.unescapeHash(t)
                        }, d.setTitle = function(e) {
                            var t, n = e.title;
                            n || (t = d.getStateByIndex(0), t && t.url === e.url && (n = t.title || d.options.initialTitle));
                            try {
                                r.getElementsByTagName("title")[0].innerHTML = n.replace("<", "&lt;").replace(">", "&gt;").replace(" & ", " &amp; ")
                            } catch (i) {}
                            return r.title = n, d
                        }, d.queues = [], d.busy = function(e) {
                            if ("undefined" != typeof e ? d.busy.flag = e : "undefined" == typeof d.busy.flag && (d.busy.flag = !1), !d.busy.flag) {
                                s(d.busy.timeout);
                                var t = function() {
                                    var e, n, r;
                                    if (!d.busy.flag)
                                        for (e = d.queues.length - 1; e >= 0; --e) n = d.queues[e], 0 !== n.length && (r = n.shift(), d.fireQueueItem(r), d.busy.timeout = a(t, d.options.busyDelay))
                                };
                                d.busy.timeout = a(t, d.options.busyDelay)
                            }
                            return d.busy.flag
                        }, d.busy.flag = !1, d.fireQueueItem = function(e) {
                            return e.callback.apply(e.scope || d, e.args || [])
                        }, d.pushQueue = function(e) {
                            return d.queues[e.queue || 0] = d.queues[e.queue || 0] || [], d.queues[e.queue || 0].push(e), d
                        }, d.queue = function(e, t) {
                            return "function" == typeof e && (e = {
                                callback: e
                            }), "undefined" != typeof t && (e.queue = t), d.busy() ? d.pushQueue(e) : d.fireQueueItem(e), d
                        }, d.clearQueue = function() {
                            return d.busy.flag = !1, d.queues = [], d
                        }, d.stateChanged = !1, d.doubleChecker = !1, d.doubleCheckComplete = function() {
                            return d.stateChanged = !0, d.doubleCheckClear(), d
                        }, d.doubleCheckClear = function() {
                            return d.doubleChecker && (s(d.doubleChecker), d.doubleChecker = !1), d
                        }, d.doubleCheck = function(e) {
                            return d.stateChanged = !1, d.doubleCheckClear(), d.bugs.ieDoubleCheck && (d.doubleChecker = a(function() {
                                return d.doubleCheckClear(), d.stateChanged || e(), !0
                            }, d.options.doubleCheckInterval)), d
                        }, d.safariStatePoll = function() {
                            var t, n = d.extractState(d.getLocationHref());
                            if (!d.isLastSavedState(n)) return t = n, t || (t = d.createStateObject()), d.Adapter.trigger(e, "popstate"), d
                        }, d.back = function(e) {
                            return e !== !1 && d.busy() ? (d.pushQueue({
                                scope: d,
                                callback: d.back,
                                args: arguments,
                                queue: e
                            }), !1) : (d.busy(!0), d.doubleCheck(function() {
                                d.back(!1)
                            }), p.go(-1), !0)
                        }, d.forward = function(e) {
                            return e !== !1 && d.busy() ? (d.pushQueue({
                                scope: d,
                                callback: d.forward,
                                args: arguments,
                                queue: e
                            }), !1) : (d.busy(!0), d.doubleCheck(function() {
                                d.forward(!1)
                            }), p.go(1), !0)
                        }, d.go = function(e, t) {
                            var n;
                            if (e > 0)
                                for (n = 1; n <= e; ++n) d.forward(t);
                            else {
                                if (!(e < 0)) throw new Error("History.go: History.go requires a positive or negative integer passed.");
                                for (n = -1; n >= e; --n) d.back(t)
                            }
                            return d
                        }, d.emulated.pushState) {
                        var g = function() {};
                        d.pushState = d.pushState || g, d.replaceState = d.replaceState || g
                    } else d.onPopState = function(t, n) {
                        var r, i, o = !1,
                            a = !1;
                        return d.doubleCheckComplete(), r = d.getHash(), r ? (i = d.extractState(r || d.getLocationHref(), !0), i ? d.replaceState(i.data, i.title, i.url, !1) : (d.Adapter.trigger(e, "anchorchange"), d.busy(!1)), d.expectedStateId = !1, !1) : (o = d.Adapter.extractEventData("state", t, n) || !1, a = o ? d.getStateById(o) : d.expectedStateId ? d.getStateById(d.expectedStateId) : d.extractState(d.getLocationHref()), a || (a = d.createStateObject(null, null, d.getLocationHref())), d.expectedStateId = !1, d.isLastSavedState(a) ? (d.busy(!1), !1) : (d.storeState(a), d.saveState(a), d.setTitle(a), d.Adapter.trigger(e, "statechange"), d.busy(!1), !0))
                    }, d.Adapter.bind(e, "popstate", d.onPopState), d.pushState = function(t, n, r, i) {
                        if (d.getHashByUrl(r) && d.emulated.pushState) throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
                        if (i !== !1 && d.busy()) return d.pushQueue({
                            scope: d,
                            callback: d.pushState,
                            args: arguments,
                            queue: i
                        }), !1;
                        d.busy(!0);
                        var o = d.createStateObject(t, n, r);
                        return d.isLastSavedState(o) ? d.busy(!1) : (d.storeState(o), d.expectedStateId = o.id, p.pushState(o.id, o.title, o.url), d.Adapter.trigger(e, "popstate")), !0
                    }, d.replaceState = function(t, n, r, i) {
                        if (d.getHashByUrl(r) && d.emulated.pushState) throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
                        if (i !== !1 && d.busy()) return d.pushQueue({
                            scope: d,
                            callback: d.replaceState,
                            args: arguments,
                            queue: i
                        }), !1;
                        d.busy(!0);
                        var o = d.createStateObject(t, n, r);
                        return d.isLastSavedState(o) ? d.busy(!1) : (d.storeState(o), d.expectedStateId = o.id, p.replaceState(o.id, o.title, o.url), d.Adapter.trigger(e, "popstate")), !0
                    };
                    if (o) {
                        try {
                            d.store = l.parse(o.getItem("History.store")) || {}
                        } catch (v) {
                            d.store = {}
                        }
                        d.normalizeStore()
                    } else d.store = {}, d.normalizeStore();
                    d.Adapter.bind(e, "unload", d.clearAllIntervals), d.saveState(d.storeState(d.extractState(d.getLocationHref(), !0))), o && (d.onUnload = function() {
                        var e, t, n;
                        try {
                            e = l.parse(o.getItem("History.store")) || {}
                        } catch (r) {
                            e = {}
                        }
                        e.idToState = e.idToState || {}, e.urlToId = e.urlToId || {}, e.stateToId = e.stateToId || {};
                        for (t in d.idToState) d.idToState.hasOwnProperty(t) && (e.idToState[t] = d.idToState[t]);
                        for (t in d.urlToId) d.urlToId.hasOwnProperty(t) && (e.urlToId[t] = d.urlToId[t]);
                        for (t in d.stateToId) d.stateToId.hasOwnProperty(t) && (e.stateToId[t] = d.stateToId[t]);
                        d.store = e, d.normalizeStore(), n = l.stringify(e);
                        try {
                            o.setItem("History.store", n)
                        } catch (i) {
                            if (i.code !== DOMException.QUOTA_EXCEEDED_ERR) throw i;
                            o.length && (o.removeItem("History.store"), o.setItem("History.store", n))
                        }
                    }, d.intervalList.push(u(d.onUnload, d.options.storeInterval)), d.Adapter.bind(e, "beforeunload", d.onUnload), d.Adapter.bind(e, "unload", d.onUnload)), d.emulated.pushState || (d.bugs.safariPoll && d.intervalList.push(u(d.safariStatePoll, d.options.safariPollInterval)), "Apple Computer, Inc." !== i.vendor && "Mozilla" !== (i.appCodeName || "") || (d.Adapter.bind(e, "hashchange", function() {
                        d.Adapter.trigger(e, "popstate")
                    }), d.getHash() && d.Adapter.onDomLoad(function() {
                        d.Adapter.trigger(e, "hashchange")
                    })))
                }, (!d.options || !d.options.delayInit) && d.init()
            }(window)
    }, {}],
    8: [function(e, t, n) {
        function r(e, t, n, r, i, o) {
            $.ajax({
                url: e,
                success: function(e) {
                    var t = $(e),
                        a = n;
                    n.find("#hideshowmorerecords").remove();
                    i && "Y" == i && (a.empty(), o && r.data("currentguid") && r.data("currentguid", o)), a.append($(t).hide()), $(t).slideDown(), $showmore = t.filter("#hideshowmorerecords").val(), "Y" !== $showmore ? r.hide() : r.show()
                }
            })
        }
        window.callLoadMoreAjax = r
    }, {}],
    9: [function(e, t, n) {
        $(function() {
            function e() {
                o = c.width();
                var e = u.eq(u.length - 1);
                if (totalWidthOfElementsInPx = e.offset().left + e.width() - c.offset().left, totalWidthOfElementsInPx = parseInt(totalWidthOfElementsInPx, 10), s.css("width", totalWidthOfElementsInPx + 50 + "px"), totalWidthOfElementsInPx > o ? (s.css("width", totalWidthOfElementsInPx + 100 + "px"), l.css("display", "block"), f.css("display", "block")) : (l.css("display", "none"), f.css("display", "none")), void 0 !== document.getElementsByClassName("sub-nav-tabs__item--active")[0]) {
                    var t = document.getElementsByClassName("js-sub-nav-tabs-carousel")[0].offsetWidth,
                        n = 70,
                        r = document.getElementsByClassName("sub-nav-tabs__item--active")[0].getBoundingClientRect().right;
                    if (t < r) {
                        var i = r - t + n;
                        document.getElementsByClassName("js-sub-nav-tabs-carousel")[0].style.marginLeft = "-" + i + "px"
                    }
                }
            }

            function t(e) {
                var t = s.css("margin-left"),
                    n = t ? parseInt(s.css("margin-left")) : 0;
                "next" === e ? u.each(function(e) {
                    var t = $(this),
                        r = t.width(),
                        i = t.offset().left + r;
                    if (i + n > o) return s.css("margin-left", n - (r - 30) + "px"), !1
                }) : u.each(function(e) {
                    var t = $(this),
                        n = t.offset().left;
                    if (n < 0) {
                        $(this).width();
                        return s.css("margin-left", "0px"), !1
                    }
                })
            }

            function n() {
                e(), l.on("click", function(e) {
                    e.preventDefault(), t("prev")
                }), f.on("click", function(e) {
                    e.preventDefault(), t("next")
                }), r()
            }

            function r() {
                var t;
                $(window).on("resize.carouselTabs", function() {
                    clearTimeout(t), t = setTimeout(function() {
                        a = window.innerWidth, e()
                    }, 500)
                })
            }
            var i = $(".js-sub-nav-tabs");
            if (i.length > 0) {
                var o, a = window.innerWidth,
                    s = i.find(".js-sub-nav-tabs-list"),
                    u = i.find(".sub-nav-tabs__item"),
                    c = i.find(".js-sub-nav-tabs-belt"),
                    l = i.find(".js-sub-arrow-left"),
                    f = i.find(".js-sub-arrow-right");
                i.find("sub-nav-tabs__item--active"), i.find("js-sub-nav-tabs-carousel");
                n()
            }
        })
    }, {}],
    10: [function(e, t, n) {
        var r, i, o, a, s, u, c, l, f, d, p;
        jQuery.fn.InitializeTabs = function(e) {
            function t() {
                $(".js-custom-tab").click(function(e) {
                    e.preventDefault(), e.stopPropagation(), $thisEl = $(this);
                    var t = $thisEl.attr("href"),
                        n = $thisEl.data("bioid"),
                        r = $thisEl.siblings(".js-tabpagetitle"),
                        i = r.length > 0 ? r.val() : "";
                    return History.pushState({
                        bioid: n,
                        pagetitle: i
                    }, "", t), !1
                })
            }

            function n() {
                $(".js-tabs-nav-link").click(function(e) {
                    e.preventDefault(), e.stopPropagation(), $thisEl = $(this);
                    var t = $thisEl.attr("href"),
                        n = $thisEl.data("tabid"),
                        r = $thisEl.siblings(".js-tabpagetitle"),
                        i = r.length > 0 ? r.val() : "";
                    return History.pushState({
                        tabid: n,
                        pagetitle: i
                    }, "", t), d($thisEl), !1
                }), $(".layout-main").on("click", ".js-tab-trigger-prev", function(e) {
                    e.preventDefault(), e.stopPropagation();
                    var t = $(".js-tabs-nav-link"),
                        n = $(".is-active-tab"),
                        i = t.index(n);
                    if (0 == i) {
                        var o = t.last();
                        o[0].click()
                    } else {
                        var a = t.eq(i - 1);
                        a[0].click()
                    }
                    return r(), !1
                }), $(".layout-main").on("click", ".js-tab-trigger-next", function(e) {
                    e.preventDefault(), e.stopPropagation();
                    var t = $(".js-tabs-nav-link"),
                        n = $(".is-active-tab"),
                        i = t.index(n);
                    if (i == t.length - 1) {
                        var o = t.first();
                        o[0].click()
                    } else {
                        var a = t.eq(i + 1);
                        a[0].click()
                    }
                    return r(), !1
                })
            }

            function r() {
                $("html, body").animate({
                    scrollTop: $(".tabs-nav").offset().top - 100
                }, "slow")
            }

            function i(e) {
                $(".js-tabs").html(e), t();
                var n = $(".accordion-module"),
                    r = $(".js-overview-expand");
                n.length && n.InitializeAccordions(), r.length && r.InitializeExpandNodes()
            }

            function c(e) {
                $(".js-custom-tabs-rte").html(e);
                var t = $(".accordion-module");
                t.length && t.InitializeAccordions()
            }
            var l = e.pageTabBaseUrl,
                f = e.innerPageTabBaseUrl;
            n(), t(), window.onstatechange = function() {
                var e = History.getState(),
                    t = e.data ? e.data.tabid : "",
                    n = e.data ? e.data.bioid : "",
                    r = e.data ? e.data.pagetitle : "",
                    d = e.url,
                    p = $("#entityguid").val();
                if (n) {
                    $(".js-custom-tab").removeClass("is-active-custom");
                    var h = c,
                        g = $("a[data-bioid='" + n + "']");
                    0 === g.length && (g = $(".js-tabs-nav-link").first()), g.addClass("is-active-custom");
                    var v = getQueryString("bio", d),
                        m = v ? v : "",
                        y = "" == m ? "?guid=" + p : "?bio=" + encodeURIComponent(m) + "&guid=" + p,
                        b = f + y;
                    a = o.width(), s = o.offset().left, u = g.offset().left + g.width(), console.log(s, u, a)
                } else {
                    $(".js-tabs-nav-link").removeClass("is-active-tab");
                    var h = i,
                        x = $("a[data-tabid='" + t + "']");
                    0 === x.length && (x = $(".js-tabs-nav-link").first()), x.addClass("is-active-tab");
                    var v = getQueryString("tab", d),
                        w = v ? v : "",
                        y = "" == w ? "?guid=" + p : "?tab=" + encodeURIComponent(w) + "&guid=" + p,
                        b = l + y;
                    a = o.width(), s = o.offset().left, u = x.offset().left + x.width(), console.log(s, u, a)
                }
                r && $(document).prop("title", r), $.ajax({
                    url: b,
                    success: h,
                    dataType: "html"
                })
            }
        }, $(function() {
            function e() {
                c(), h.on("click", function(e) {
                    e.preventDefault(), l("prev")
                }), g.on("click", function(e) {
                    e.preventDefault(), l("next")
                }), p()
            }
            if (r = $(".js-tab-carousel"), 0 !== r.length) {
                i = r.find(".js-tabs-nav-list"), o = r.find(".js-tabs-belt");
                var t, n = window.innerWidth,
                    a = !1,
                    s = !1,
                    u = r.find(".tabs-nav__item"),
                    h = r.find(".js-arrow-left"),
                    g = r.find(".js-arrow-right"),
                    v = u.find(".is-active-tab");
                c = function() {
                    t = o.width();
                    var e = 0;
                    if (u.each(function() {
                            e += $(this).width()
                        }), i.css("width", e + "px"), e > t + 80) {
                        h.css("display", "block"), g.css("display", "block");
                        var n = $(u[u.length - 1]),
                            r = Math.round(n.offset().left + n.width()),
                            a = Math.round(o.offset().left + o.width());
                        if (r < a) {
                            var c = i.css("margin-left"),
                                l = c ? parseInt(i.css("margin-left")) : 0;
                            i.css("margin-left", l + (a - r) + "px")
                        }
                        s = !0
                    } else h.css("display", "none"), g.css("display", "none"), i.css("margin-left", ""), s = !1
                }, f = function() {
                    i.css({
                        width: "auto"
                    })
                }, l = function(e) {
                    var t = i.css("margin-left"),
                        n = t ? parseInt(i.css("margin-left")) : 0,
                        r = $(".js-tab-carousel").offset().left;
                    r < 0 && (r = 0), "next" === e ? u.each(function(e) {
                        var t = $(this),
                            r = Math.round(t.offset().left + t.width()),
                            a = Math.round(o.offset().left + o.width());
                        if (r > a) return i.css("margin-left", n - (r - a) + "px"), !1
                    }) : u.each(function(e) {
                        var t = $(u[u.length - e - 1]),
                            r = Math.round(t.offset().left),
                            a = Math.round(o.offset().left);
                        if (r < a) return i.css("margin-left", n + (a - r) + "px"), !1
                    })
                }, p = function() {
                    var e;
                    $(window).on("resize.carouselTabs", function() {
                        clearTimeout(e), e = setTimeout(function() {
                            n = window.innerWidth, a = !0, c()
                        }, 500)
                    })
                }, d = function(e) {
                    var t, n = e.length ? e.offset().left : "",
                        r = .93 * e.outerWidth(),
                        a = r + n,
                        s = o.width(),
                        u = o.offset().left,
                        c = i.css("margin-left"),
                        l = c ? parseInt(i.css("margin-left")) : 0,
                        f = s + u;
                    f = parseInt(f, 10);
                    var d = $(".js-tabs-belt") ? $(".js-tabs-belt").position().left : "",
                        p = e.length ? e.position().left : "";
                    a > f ? (l < 0 && (a -= l), t = f - a - 5, i.css("margin-left", t + "px")) : p < d && i.css("margin-left", l - (p - 30) + "px")
                }, e(), s && d(v)
            }
        })
    }, {}],
    11: [function(e, t, n) {
        "use strict";
        window.helperUtils = {
                getDocDimen: function() {
                    var e = {};
                    return e.height = window.innerHeight, e.width = window.innerWidth, e
                }
            }, window.parseQueryString = function(e) {
                return "string" != typeof e ? {} : (e = e.trim().replace(/^\?/, ""), e ? e.trim().split("&").reduce(function(e, t) {
                    var n = t.replace(/\+/g, " ").split("=");
                    return e[n[0]] = void 0 === n[1] ? null : decodeURIComponent(n[1]), e
                }, {}) : {})
            }, window.getQueryString = function(e, t) {
                var n = t ? t : window.location.href,
                    r = new RegExp("[?&]" + e + "=([^&#]*)", "i"),
                    i = r.exec(n);
                return i ? i[1] : null
            },
            function() {
                for (var e = 0, t = ["ms", "moz", "webkit", "o"], n = 0; n < t.length && !window.requestAnimationFrame; ++n) window.requestAnimationFrame = window[t[n] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[t[n] + "CancelAnimationFrame"] || window[t[n] + "CancelRequestAnimationFrame"];
                window.requestAnimationFrame || (window.requestAnimationFrame = function(t, n) {
                    var r = (new Date).getTime(),
                        i = Math.max(0, 16 - (r - e)),
                        o = window.setTimeout(function() {
                            t(r + i)
                        }, i);
                    return e = r + i, o
                }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(e) {
                    clearTimeout(e)
                })
            }()
    }, {}],
    12: [function(e, t, n) {
        window.jQuery = window.$ = e("jquery"), window.Hammer = e("hammerjs"), window.ko = e("knockout"), window.ko.mapping = e("knockout.mapping"), e("./features/jquery.history.js"), e("./features/utils"), e("./features/tabs"), e("./features/sub-nav-tabs"), e("./features/load-more"), e("./features/ajax"), e("devbridge-autocomplete")
    }, {
        "./features/ajax": 6,
        "./features/jquery.history.js": 7,
        "./features/load-more": 8,
        "./features/sub-nav-tabs": 9,
        "./features/tabs": 10,
        "./features/utils": 11,
        "devbridge-autocomplete": 1,
        hammerjs: 2,
        jquery: 3,
        knockout: 5,
        "knockout.mapping": 4
    }]
}, {}, [12]);