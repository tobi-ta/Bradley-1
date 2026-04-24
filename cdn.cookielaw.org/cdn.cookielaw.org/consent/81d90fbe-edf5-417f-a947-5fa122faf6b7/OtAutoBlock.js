! function() {
    function n(d) {
        var g = [],
            a = [],
            f = function(c) {
                for (var b = {}, e = 0; e < z.length; e++) {
                    var h = z[e];
                    if (h.Tag === c) {
                        b = h;
                        break
                    }
                    var k = (r = h.Tag, t = x = l = void 0, l = -1 !== (t = r).indexOf("http:") ? t.replace("http:", "") : t.replace("https:", ""), -1 !== (x = l.indexOf("?")) ? l.replace(l.substring(x), "") : l);
                    if (c && (-1 !== c.indexOf(k) || -1 !== h.Tag.indexOf(c))) {
                        b = h;
                        break
                    }
                }
                var r, l, x, t;
                return b
            }(d);
        return f.CategoryId && (g = f.CategoryId), f.Vendor && (a = f.Vendor.split(":")), !f.Tag && D && (a = g = function(c) {
            var b = [],
                e = function(h) {
                    var k = document.createElement("a");
                    k.href = h;
                    h = k.hostname.split(".");
                    return -1 !== h.indexOf("www") || 2 < h.length ? h.slice(1).join(".") : k.hostname
                }(c);
            y.some(function(h) {
                return h === e
            }) && (b = ["C0004"]);
            return b
        }(d)), {
            categoryIds: g,
            vsCatIds: a
        }
    }

    function A(d) {
        return !d || !d.length || (d && window.OptanonActiveGroups ? d.every(function(g) {
            return -1 !== window.OptanonActiveGroups.indexOf("," + g + ",")
        }) : void 0)
    }

    function m(d, g) {
        void 0 === g && (g = null);
        var a = window,
            f = a.OneTrust && a.OneTrust.IsVendorServiceEnabled;
        a = f && a.OneTrust.IsVendorServiceEnabled();
        return "Categories" ===
            u || "All" === u && f && !a ? A(d) : ("Vendors" === u || "All" === u && f && a) && A(g)
    }

    function p(d) {
        d = d.getAttribute("class") || "";
        return -1 !== d.indexOf("optanon-category") || -1 !== d.indexOf("ot-vscat")
    }

    function q(d) {
        return d.hasAttribute("data-ot-ignore")
    }

    function v(d, g, a) {
        void 0 === a && (a = null);
        var f = d.join("-"),
            c = a && a.join("-"),
            b = g.getAttribute("class") || "",
            e = "",
            h = !1;
        d && d.length && -1 === b.indexOf("optanon-category-" + f) && (e = ("optanon-category-" + f).trim(), h = !0);
        a && a.length && -1 === b.indexOf("ot-vscat-" + c) && (e += " " + ("ot-vscat-" +
            c).trim(), h = !0);
        h && g.setAttribute("class", e + " " + b)
    }

    function B(d, g, a) {
        void 0 === a && (a = null);
        var f;
        d = d.join("-");
        a = a && a.join("-");
        return -1 === g.indexOf("optanon-category-" + d) && (f = ("optanon-category-" + d).trim()), -1 === g.indexOf("ot-vscat-" + a) && (f += " " + ("ot-vscat-" + a).trim()), f + " " + g
    }
    var z = JSON.parse('[{"Tag":"https://www.googletagmanager.com/gtm.js","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/402750532","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/432206826","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/656282428","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/429625966","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://www.youtube.com/embed/rSh-5Uw9Glg","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://www.superlawyers.com/services/badge/beacon/e84d51a5-9238-42c4-81d8-f660fc2e58be/l/10.gif","CategoryId":["C0002"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/179228637","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://www.youtube.com/embed/iDHGA-aMQNQ","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://www.nbcdfw.com/news/local/nbc-5-responds-how-does-a-50-covid-19-test-cost-insurance-more-than-10000/2458428/","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://www.youtube.com/embed/qu1my0rbfGw","CategoryId":["C0004"],"Vendor":null},{"Tag":"http://mtshrm.affiniscape.com/errors/404.cfm","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://sb.scorecardresearch.com/b","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://www.youtube.com/embed/aFZeFJTtHqA","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://www.youtube.com/embed/33lQExzNIdw","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://www.youtube.com/embed/NyIiqcb74qM","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://www.apple.com/wss/fonts/SF-Pro-Icons/v1/SFProIcons_regular.woff","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://aadcdn.msftauth.net/shared/1.0/content/js/ConvergedLogin_PCore_ZuzZ0B9zaPr4yfAbYf7RGA2.js","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/247227092","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/527346614","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/644059857","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/520062684","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://aadcdn.msftauth.net/shared/1.0/content/js/ConvergedLogin_PCore_6J06iic7msGxWHwxS1Qglg2.js","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://www.apple.com/wss/fonts","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://open.spotify.com/embed-podcast/episode/7zODtB5SwuGfRZyHv5QPq5","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://www.youtube.com/embed/jE0NnDfg9H8","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://open.spotify.com/embed-podcast/episode/5dTZX3vKvOuwJ9XBa18cgo","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://open.spotify.com/embed-podcast/show/6ybKuawm7eZSXsYS6zZhgh","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://www.podbean.com/player-v2/","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://browser.events.data.microsoft.com/OneCollector/1.0/","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/323285342","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://www.youtube.com/embed/ASBprKz7Ow8","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://www.youtube.com/embed/NIf10gCUJEE","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://www.google-analytics.com/analytics.js","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/703854717","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/447445285","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://autologon.microsoftazuread-sso.com/c9f7317c-0f4e-484e-be99-78ba5fae49b5/winauth/iframe","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/411213565","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://open.spotify.com/embed/show/6ybKuawm7eZSXsYS6zZhgh","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://www.superlawyers.com/services/badge/beacon/d0893a7f-bc93-45dd-a8b7-7519b8573724/l/10.gif","CategoryId":["C0002"],"Vendor":null},{"Tag":"https://map.brightcove.com/config","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/450175756","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://www.youtube.com/embed/b22WNSOzeps","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://www.slideshare.net/slideshow/embed_code/key/4pmHqyMCpjRRJZ","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/539745064","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://www.slideshare.net/slideshow/embed_code/key/NYuyKsifPiIdcB","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://www.apple.com/wss/fonts/SF-Pro-Icons/v1/SFProIcons_semibold.woff","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/167296952","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/701984316","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/477282011","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://www.apple.com/wss/fonts/SF-Pro/v4/SFPro.woff2","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://www.americanbar.org/content/dam/aba/global/brightcove/css/podcast_placeholder.jpg","CategoryId":["C0003","C0004"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/672143789","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://www.youtube.com/embed/0J4SIYJdRyQ","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/279886353","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://www.youtube.com/embed/i39OpngZsYY","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://open.spotify.com/embed/episode/6VkoLAEDHn2mPV8SYtoUKc","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://beacon.krxd.net/event.gif","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/176325865","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://open.spotify.com/embed/episode/5dTZX3vKvOuwJ9XBa18cgo","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://www.youtube.com/embed/ax4qdhF7G2c","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://www.youtube.com/embed/yV82nPG6ACg","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://13793.global.siteimproveanalytics.io/image.aspx","CategoryId":["C0002"],"Vendor":null},{"Tag":"https://www.youtube.com/embed/jGHoRETGtDc","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/213277463","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://www.youtube.com/embed/SQETiN12Br8","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://www.googletagmanager.com/gtag/js","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/252600376","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://bam.nr-data.net/1/689d5b4562","CategoryId":["C0002"],"Vendor":null},{"Tag":"http://mtshrm.affiniscape.com/associations/9690/files/HRCI_ApprovedForCreditSeal-.jpg","CategoryId":["C0003","C0004"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/405126463","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://bradley.vuturevx.com/security/tracker.gif","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://www.slideshare.net/slideshow/embed_code/45087506","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://www.slideshare.net/slideshow/embed_code/key/t3cMhFt99aRPYM","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/368872638","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://www.youtube.com/embed/CkbYtose4dM","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://www.cbsnews.com/video/health-insurers-seek-to-reclaim-millions-lost-in-rural-hospital-billing-schemes/","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/404798940","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://app.link/_r","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/470772482","CategoryId":["C0003"],"Vendor":null},{"Tag":"https://www.youtube.com/embed/7cyiRypK9_4","CategoryId":["C0004"],"Vendor":null},{"Tag":"https://player.vimeo.com/video/502365316","CategoryId":["C0003"],"Vendor":null}]'),
        D = JSON.parse("true"),
        u = JSON.parse('"Categories"'),
        y = "addthis.com addtoany.com adsrvr.org amazon-adsystem.com bing.com bounceexchange.com bouncex.net criteo.com criteo.net dailymotion.com doubleclick.net everesttech.net facebook.com facebook.net googleadservices.com googlesyndication.com krxd.net liadm.com linkedin.com outbrain.com rubiconproject.com sharethis.com taboola.com twitter.com vimeo.com yahoo.com youtube.com".split(" ");
    y = y.filter(function(d) {
        if ("null" !== d && d.trim().length) return d
    });
    var w = ["embed", "iframe", "img", "script"];
    (new MutationObserver(function(d) {
        Array.prototype.forEach.call(d, function(g) {
            Array.prototype.forEach.call(g.addedNodes, function(e) {
                var h, k;
                if (1 === e.nodeType && -1 !== w.indexOf(e.tagName.toLowerCase()) && !p(e) && !q(e))
                    if ("script" === e.tagName.toLowerCase()) {
                        if ((k = n(h = e.src || "")).categoryIds.length || k.vsCatIds.length) {
                            v(k.categoryIds, e, k.vsCatIds);
                            m(k.categoryIds, k.vsCatIds) || (e.type = "text/plain");
                            var r = function(l) {
                                "text/plain" === e.getAttribute("type") && l.preventDefault();
                                e.removeEventListener("beforescriptexecute", r)
                            };
                            e.addEventListener("beforescriptexecute", r)
                        }
                    } else((k = n(h = e.src || "")).categoryIds.length || k.vsCatIds.length) && (v(k.categoryIds, e, k.vsCatIds), m(k.categoryIds, k.vsCatIds) || (e.removeAttribute("src"), e.setAttribute("data-src", h)))
            });
            var a = g.target;
            if (g.attributeName && (!p(a) || !q(a)))
                if ("script" === a.nodeName.toLowerCase()) {
                    if ((b = n(c = a.src || "")).categoryIds.length || b.vsCatIds.length) {
                        v(b.categoryIds, a, b.vsCatIds);
                        m(b.categoryIds, b.vsCatIds) || (a.type = "text/plain");
                        var f = function(e) {
                            "text/plain" === a.getAttribute("type") && e.preventDefault();
                            a.removeEventListener("beforescriptexecute", f)
                        };
                        a.addEventListener("beforescriptexecute", f)
                    }
                } else if (-1 !== w.indexOf(g.target.nodeName.toLowerCase())) {
                var c, b;
                ((b = n(c = a.src || "")).categoryIds.length || b.vsCatIds.length) && (v(b.categoryIds, a, b.vsCatIds), m(b.categoryIds, b.vsCatIds) || (a.removeAttribute("src"), a.setAttribute("data-src", c)))
            }
        })
    })).observe(document.documentElement, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["src"]
    });
    var C = document.createElement;
    document.createElement = function() {
        for (var d = [], g = 0; g < arguments.length; g++) d[g] = arguments[g];
        if ("script" !== d[0].toLowerCase() && -1 === w.indexOf(d[0].toLowerCase())) return C.bind(document).apply(void 0, d);
        var a = C.bind(document).apply(void 0, d),
            f = a.setAttribute.bind(a);
        return Object.defineProperties(a, {
            src: {
                get: function() {
                    return a.getAttribute("src") || ""
                },
                set: function(c) {
                    var b = "";
                    "string" == typeof c ? b = c : c instanceof Object && (b = c.toString());
                    b = n(b);
                    !b.categoryIds.length && !b.vsCatIds.length ||
                        "script" !== d[0].toLowerCase() || p(a) || m(b.categoryIds, b.vsCatIds) || q(a) ? !b.categoryIds.length || -1 === w.indexOf(d[0].toLowerCase()) || p(a) || m(b.categoryIds, b.vsCatIds) || q(a) ? f("src", c) : (a.removeAttribute("src"), f("data-src", c), c = a.getAttribute("class"), c || (c = B(b.categoryIds, c || "", b.vsCatIds), f("class", c))) : (f("type", "text/plain"), f("src", c));
                    return !0
                }
            },
            type: {
                set: function(c) {
                    var b = n(a.src || "");
                    c = !b.categoryIds.length && !b.vsCatIds.length || p(a) || m(b.categoryIds, b.vsCatIds) || q(a) ? c : "text/plain";
                    return f("type",
                        c), !0
                }
            },
            class: {
                set: function(c) {
                    var b = n(a.src);
                    !b.categoryIds.length && !b.vsCatIds.length || p(a) || m(b.categoryIds, b.vsCatIds) || q(a) ? f("class", c) : (c = B(b.categoryIds, c, b.vsCatIds), f("class", c));
                    return !0
                }
            }
        }), a.setAttribute = function(c, b, e) {
            "type" !== c && "src" !== c || e ? f(c, b) : a[c] = b
        }, a
    }
}();