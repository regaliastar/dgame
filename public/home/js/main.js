(function(e, t) {
    var n;
    e.rails = n = {
        linkClickSelector: "a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]",
        inputChangeSelector: "select[data-remote], input[data-remote], textarea[data-remote]",
        formSubmitSelector: "form",
        formInputClickSelector: "form input[type=submit], form input[type=image], form button[type=submit], form button:not(button[type])",
        disableSelector: "input[data-disable-with], button[data-disable-with], textarea[data-disable-with]",
        enableSelector: "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled",
        requiredInputSelector: "input[name][required]:not([disabled]),textarea[name][required]:not([disabled])",
        fileInputSelector: "input:file",
        linkDisableSelector: "a[data-disable-with]",
        CSRFProtection: function(t) {
            var n = e('meta[name="csrf-token"]').attr("content");
            n && t.setRequestHeader("X-CSRF-Token", n)
        },
        fire: function(t, n, r) {
            var i = e.Event(n);
            return t.trigger(i, r),
            i.result !== !1
        },
        confirm: function(e) {
            return confirm(e)
        },
        ajax: function(t) {
            return e.ajax(t)
        },
        handleRemote: function(r) {
            var i, s, o, u = r.data("cross-domain") || null,
            a = r.data("type") || e.ajaxSettings && e.ajaxSettings.dataType,
            f;
            if (n.fire(r, "ajax:before")) {
                if (r.is("form")) {
                    i = r.attr("method"),
                    s = r.attr("action"),
                    o = r.serializeArray();
                    var l = r.data("ujs:submit-button");
                    l && (o.push(l), r.data("ujs:submit-button", null))
                } else r.is(n.inputChangeSelector) ? (i = r.data("method"), s = r.data("url"), o = r.serialize(), r.data("params") && (o = o + "&" + r.data("params"))) : (i = r.data("method"), s = r.attr("href"), o = r.data("params") || null);
                return f = {
                    type: i || "GET",
                    data: o,
                    dataType: a,
                    crossDomain: u,
                    beforeSend: function(e, i) {
                        return i.dataType === t && e.setRequestHeader("accept", "*/*;q=0.5, " + i.accepts.script),
                        n.fire(r, "ajax:beforeSend", [e, i])
                    },
                    success: function(e, t, n) {
                        r.trigger("ajax:success", [e, t, n])
                    },
                    complete: function(e, t) {
                        r.trigger("ajax:complete", [e, t])
                    },
                    error: function(e, t, n) {
                        r.trigger("ajax:error", [e, t, n])
                    }
                },
                s && (f.url = s),
                n.ajax(f)
            }
            return ! 1
        },
        handleMethod: function(n) {
            var r = n.attr("href"),
            i = n.data("method"),
            s = n.attr("target"),
            o = e("meta[name=csrf-token]").attr("content"),
            u = e("meta[name=csrf-param]").attr("content"),
            a = e('<form method="post" action="' + r + '"></form>'),
            f = '<input name="_method" value="' + i + '" type="hidden" />';
            u !== t && o !== t && (f += '<input name="' + u + '" value="' + o + '" type="hidden" />'),
            s && a.attr("target", s),
            a.hide().append(f).appendTo("body"),
            a.submit()
        },
        disableFormElements: function(t) {
            t.find(n.disableSelector).each(function() {
                var t = e(this),
                n = t.is("button") ? "html": "val";
                t.data("ujs:enable-with", t[n]()),
                t[n](t.data("disable-with")),
                t.prop("disabled", !0)
            })
        },
        enableFormElements: function(t) {
            t.find(n.enableSelector).each(function() {
                var t = e(this),
                n = t.is("button") ? "html": "val";
                t.data("ujs:enable-with") && t[n](t.data("ujs:enable-with")),
                t.prop("disabled", !1)
            })
        },
        allowAction: function(e) {
            var t = e.data("confirm"),
            r = !1,
            i;
            return t ? (n.fire(e, "confirm") && (r = n.confirm(t), i = n.fire(e, "confirm:complete", [r])), r && i) : !0
        },
        blankInputs: function(t, n, r) {
            var i = e(),
            s,
            o = n || "input,textarea";
            return t.find(o).each(function() {
                s = e(this);
                if (r ? s.val() : !s.val()) i = i.add(s)
            }),
            i.length ? i: !1
        },
        nonBlankInputs: function(e, t) {
            return n.blankInputs(e, t, !0)
        },
        stopEverything: function(t) {
            return e(t.target).trigger("ujs:everythingStopped"),
            t.stopImmediatePropagation(),
            !1
        },
        callFormSubmitBindings: function(n, r) {
            var i = n.data("events"),
            s = !0;
            return i !== t && i.submit !== t && e.each(i.submit,
            function(e, t) {
                if (typeof t.handler == "function") return s = t.handler(r)
            }),
            s
        },
        disableElement: function(e) {
            e.data("ujs:enable-with", e.html()),
            e.html(e.data("disable-with")),
            e.bind("click.railsDisable",
            function(e) {
                return n.stopEverything(e)
            })
        },
        enableElement: function(e) {
            e.data("ujs:enable-with") !== t && (e.html(e.data("ujs:enable-with")), e.data("ujs:enable-with", !1)),
            e.unbind("click.railsDisable")
        }
    },
    e.ajaxPrefilter(function(e, t, r) {
        e.crossDomain || n.CSRFProtection(r)
    }),
    e(document).delegate(n.linkDisableSelector, "ajax:complete",
    function() {
        n.enableElement(e(this))
    }),
    e(document).delegate(n.linkClickSelector, "click.rails",
    function(r) {
        var i = e(this),
        s = i.data("method"),
        o = i.data("params");
        if (!n.allowAction(i)) return n.stopEverything(r);
        i.is(n.linkDisableSelector) && n.disableElement(i);
        if (i.data("remote") !== t) return (r.metaKey || r.ctrlKey) && (!s || s === "GET") && !o ? !0 : (n.handleRemote(i) === !1 && n.enableElement(i), !1);
        if (i.data("method")) return n.handleMethod(i),
        !1
    }),
    e(document).delegate(n.inputChangeSelector, "change.rails",
    function(t) {
        var r = e(this);
        return n.allowAction(r) ? (n.handleRemote(r), !1) : n.stopEverything(t)
    }),
    e(document).delegate(n.formSubmitSelector, "submit.rails",
    function(r) {
        var i = e(this),
        s = i.data("remote") !== t,
        o = n.blankInputs(i, n.requiredInputSelector),
        u = n.nonBlankInputs(i, n.fileInputSelector);
        if (!n.allowAction(i)) return n.stopEverything(r);
        if (o && i.attr("novalidate") == t && n.fire(i, "ajax:aborted:required", [o])) return n.stopEverything(r);
        if (s) return u ? n.fire(i, "ajax:aborted:file", [u]) : !e.support.submitBubbles && e().jquery < "1.7" && n.callFormSubmitBindings(i, r) === !1 ? n.stopEverything(r) : (n.handleRemote(i), !1);
        setTimeout(function() {
            n.disableFormElements(i)
        },
        13)
    }),
    e(document).delegate(n.formInputClickSelector, "click.rails",
    function(t) {
        var r = e(this);
        if (!n.allowAction(r)) return n.stopEverything(t);
        var i = r.attr("name"),
        s = i ? {
            name: i,
            value: r.val()
        }: null;
        r.closest("form").data("ujs:submit-button", s)
    }),
    e(document).delegate(n.formSubmitSelector, "ajax:beforeSend.rails",
    function(t) {
        this == t.target && n.disableFormElements(e(this))
    }),
    e(document).delegate(n.formSubmitSelector, "ajax:complete.rails",
    function(t) {
        this == t.target && n.enableFormElements(e(this))
    })
})(jQuery),
function(e) {
    function t(e) {
        var t = 37,
        i = 39;
        if (e.target.nodeName == "BODY" || e.target.nodeName == "HTML") if (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
            var s = e.which;
            s == t ? n() : s == i && r()
        }
    }
    function n() {
        var t = e(".pagination .previous_page a").attr("href");
        t && t != document.location && t != "#" && (document.location = t)
    }
    function r() {
        var t = e(".pagination .next_page a").attr("href");
        t && t != document.location && t != "#" && (document.location = t)
    }
    e(document).keydown(t)
} (jQuery),
function(e) {
    function n() {
        var t = r(this);
        return isNaN(t.datetime) || e(this).text(i(t.datetime)),
        this
    }
    function r(n) {
        n = e(n);
        if (!n.data("timeago")) {
            n.data("timeago", {
                datetime: t.datetime(n)
            });
            var r = e.trim(n.text());
            r.length > 0 && n.attr("title", r)
        }
        return n.data("timeago")
    }
    function i(e) {
        return t.inWords(s(e))
    }
    function s(e) {
        return (new Date).getTime() - e.getTime()
    }
    e.timeago = function(t) {
        return t instanceof Date ? i(t) : typeof t == "string" ? i(e.timeago.parse(t)) : i(e.timeago.datetime(t))
    };
    var t = e.timeago;
    e.extend(e.timeago, {
        settings: {
            refreshMillis: 6e4,
            allowFuture: !1,
            strings: {
                prefixAgo: null,
                prefixFromNow: null,
                suffixAgo: "ago",
                suffixFromNow: "from now",
                seconds: "less than a minute",
                minute: "about a minute",
                minutes: "%d minutes",
                hour: "about an hour",
                hours: "about %d hours",
                day: "a day",
                days: "%d days",
                month: "about a month",
                months: "%d months",
                year: "about a year",
                years: "%d years",
                numbers: [],
                formatter: null
            }
        },
        inWords: function(t) {
            function l(r, i) {
                var s = e.isFunction(r) ? r(i, t) : r,
                o = e.isFunction(n.numbers) ? n.numbers(i) : n.numbers && n.numbers[i] || i;
                return s.replace(/%d/i, o)
            }
            var n = this.settings.strings,
            r = n.prefixAgo,
            i = n.suffixAgo;
            this.settings.allowFuture && (t < 0 && (r = n.prefixFromNow, i = n.suffixFromNow), t = Math.abs(t));
            var s = t / 1e3,
            o = s / 60,
            u = o / 60,
            a = u / 24,
            f = a / 365,
            c = s < 45 && l(n.seconds, Math.round(s)) || s < 90 && l(n.minute, 1) || o < 45 && l(n.minutes, Math.round(o)) || o < 90 && l(n.hour, 1) || u < 24 && l(n.hours, Math.round(u)) || u < 48 && l(n.day, 1) || a < 30 && l(n.days, Math.floor(a)) || a < 60 && l(n.month, 1) || a < 365 && l(n.months, Math.floor(a / 30)) || f < 2 && l(n.year, 1) || l(n.years, Math.floor(f));
            return e.isFunction(n.formatter) ? n.formatter(r, c, i) : e.trim([r, c, i].join(" "))
        },
        parse: function(t) {
            var n = e.trim(t);
            return n = n.replace(/\.\d\d\d+/, ""),
            n = n.replace(/-/, "/").replace(/-/, "/"),
            n = n.replace(/T/, " ").replace(/Z/, " UTC"),
            n = n.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"),
            new Date(n)
        },
        datetime: function(n) {
            var r = e(n).get(0).tagName.toLowerCase() === "time",
            i = r ? e(n).attr("datetime") : e(n).attr("title");
            return t.parse(i)
        }
    }),
    e.fn.timeago = function() {
        var e = this;
        e.each(n);
        var r = t.settings;
        return r.refreshMillis > 0 && setInterval(function() {
            e.each(n)
        },
        r.refreshMillis),
        e
    },
    document.createElement("abbr"),
    document.createElement("time")
} (jQuery),
function() {
    var e = {
        "zh-CN": {
            prefixAgo: null,
            prefixFromNow: null,
            suffixAgo: "前",
            suffixFromNow: "刚刚",
            seconds: "不到1分钟",
            minute: "约1分钟",
            minutes: "%d分钟",
            hour: "1小时",
            hours: "%d小时",
            day: "1天",
            days: "%d天",
            month: "1月",
            months: "%d月",
            year: "1年",
            years: "%d年",
            numbers: [],
            formatter: function(e, t, n) {
                return [e, t, n].join("")
            }
        },
        "zh-TW": {
            prefixAgo: null,
            prefixFromNow: null,
            suffixAgo: "前",
            suffixFromNow: "剛剛",
            seconds: "不到1分鐘",
            minute: "約1分鐘",
            minutes: "%d分鐘",
            hour: "1小時",
            hours: "%d小時",
            day: "1天",
            days: "%d天",
            month: "1月",
            months: "%d月",
            year: "1年",
            years: "%d年",
            numbers: [],
            formatter: function(e, t, n) {
                return [e, t, n].join("")
            }
        }
    },
    t = e["zh-CN"];
    t && (jQuery.timeago.settings.strings = t)
} (),
function() { (function(e) {
        var t, n;
        return t = function(e) {
            var t, n, r, i, s, o, u, a;
            return document.selection ? (o = document.selection.createRange(), s = 0, o && o.parentElement() === e && (i = e.value.replace(/\r\n/g, "\n"), r = i.length, a = e.createTextRange(), a.moveToBookmark(o.getBookmark()), n = e.createTextRange(), n.collapse(!1), a.compareEndPoints("StartToEnd", n) > -1 ? u = t = r: (u = -a.moveStart("character", -r), t = -a.moveEnd("character", -r)))) : u = e.selectionStart,
            u
        },
        n = function(e, t) {
            var n;
            return document.selection ? (n = e.createTextRange(), n.move("character", t), n.select()) : e.setSelectionRange(t, t)
        },
        e.fn.caretPos = function(e) {
            var r;
            return r = this[0],
            r.focus(),
            e ? n(r, e) : t(r)
        }
    })(window.jQuery),
    function(e) {
        var t, n, r, i, s, o, u, a, f, l, c;
        return r = {
            $mirror: null,
            css: ["overflowY", "height", "width", "paddingTop", "paddingLeft", "paddingRight", "paddingBottom", "marginTop", "marginLeft", "marginRight", "marginBottom", "fontFamily", "borderStyle", "borderWidth", "wordWrap", "fontSize", "lineHeight", "overflowX"],
            init: function(t) {
                var n, r;
                return n = e("<div></div>"),
                r = {
                    position: "absolute",
                    left: -9999,
                    top: 0,
                    zIndex: -2e4,
                    "white-space": "pre-wrap"
                },
                e.each(this.css,
                function(e, n) {
                    return r[n] = t.css(n)
                }),
                n.css(r),
                this.$mirror = n,
                t.after(n),
                this
            },
            setContent: function(e) {
                return this.$mirror.html(e),
                this
            },
            getFlagRect: function() {
                var e, t, n;
                return e = this.$mirror.find("span#flag"),
                t = e.position(),
                n = {
                    left: t.left,
                    top: t.top,
                    bottom: e.height() + t.top
                },
                this.$mirror.remove(),
                n
            }
        },
        t = function(t) {
            var s, o = this;
            return s = this.$inputor = e(t),
            this.options = {},
            this.query = {
                text: "",
                start: 0,
                stop: 0
            },
            this._cache = {},
            this.pos = 0,
            this.flags = {},
            this.theflag = null,
            this.search_word = {},
            this.view = n,
            this.mirror = r,
            s.on("keyup.inputor",
            function(e) {
                var t, n;
                n = e.keyCode === 40 || e.keyCode === 38,
                t = !n || !o.view.isShowing();
                if (t) return o.lookup()
            }).on("mouseup.inputor",
            function(e) {
                return o.lookup()
            }),
            this.init(),
            i("At.new", s[0]),
            this
        },
        t.prototype = {
            constructor: t,
            init: function() {
                var e = this;
                return this.$inputor.on("keydown.inputor",
                function(t) {
                    return e.onkeydown(t)
                }).on("scroll.inputor",
                function(t) {
                    return e.view.hide()
                }).on("blur.inputor",
                function(t) {
                    return e.view.hide(1e3)
                }),
                i("At.init", this.$inputor[0])
            },
            reg: function(t, n) {
                var r, s, o;
                return r = {},
                e.isFunction(n) ? r.callback = n: r = n,
                o = (s = this.options)[t] || (s[t] = e.fn.atWho["default"]),
                this.options[t] = e.extend({},
                o, r),
                i("At.reg", this.$inputor[0], t, n)
            },
            dataValue: function() {
                var e, t;
                return t = this.search_word[this.theflag],
                t ? t: (e = /data-value=["']?\$\{(\w+)\}/g.exec(this.getOpt("tpl")), this.search_word[this.theflag] = a(e) ? null: e[1])
            },
            getOpt: function(e) {
                try {
                    return this.options[this.theflag][e]
                } catch(t) {
                    return null
                }
            },
            rect: function() {
                var t, n, r, i, s, o, u, a, f, l;
                return t = this.$inputor,
                document.selection ? (n = document.selection.createRange(), f = n.boundingLeft + t.scrollLeft(), l = n.boundingTop + e(window).scrollTop() + t.scrollTop(), i = l + n.boundingHeight, {
                    top: l - 2,
                    left: f - 2,
                    bottom: i - 2
                }) : (s = function(e) {
                    return e.replace(/</g, "&lt").replace(/>/g, "&gt").replace(/`/g, "&#96").replace(/"/g, "&quot").replace(/\r\n|\r|\n/g, "<br />")
                },
                a = t.val().slice(0, this.pos - 1), o = "<span>" + s(a) + "</span>", o += "<span id='flag'>@</span>", u = t.offset(), r = this.mirror.init(t).setContent(o).getFlagRect(), f = u.left + r.left - t.scrollLeft(), l = u.top - t.scrollTop(), i = l + r.bottom, l += r.top, {
                    top: l,
                    left: f,
                    bottom: i + 2
                })
            },
            cache: function(e) {
                var t, n;
                return t = this.query.text,
                !this.getOpt("cache") || !t ? null: (n = this._cache)[t] || (n[t] = e)
            },
            getKeyname: function() {
                var t, n, r, s, o, u, f, l, c = this;
                return t = this.$inputor,
                l = t.val(),
                n = t.caretPos(),
                f = l.slice(0, n),
                o = null,
                e.each(this.options,
                function(e) {
                    var t, n;
                    n = new RegExp(e + "([A-Za-z0-9_+-]*)$|" + e + "([^\\x00-\\xff]*)$", "gi"),
                    t = n.exec(f);
                    if (!a(t)) return o = t[1] === void 0 ? t[2] : t[1],
                    c.theflag = e,
                    !1
                }),
                typeof o == "string" && o.length <= 20 ? (u = n - o.length, r = u + o.length, this.pos = u, s = {
                    text: o.toLowerCase(),
                    start: u,
                    end: r
                }) : this.view.hide(),
                i("At.getKeyname", s),
                this.query = s
            },
            replaceStr: function(e) {
                var t, n, r, s, o;
                return t = this.$inputor,
                n = this.query,
                r = t.val(),
                s = r.slice(0, n.start),
                o = s + e + r.slice(n.end),
                t.val(o),
                t.caretPos(s.length + e.length),
                t.change(),
                i("At.replaceStr", o)
            },
            onkeydown: function(t) {
                var n;
                n = this.view;
                if (!n.isShowing()) return;
                switch (t.keyCode) {
                case 38:
                    t.preventDefault(),
                    n.prev();
                    break;
                case 40:
                    t.preventDefault(),
                    n.next();
                    break;
                case 9:
                case 13:
                    if (!n.isShowing()) return;
                    t.preventDefault(),
                    n.choose();
                    break;
                default:
                    e.noop()
                }
                return t.stopPropagation()
            },
            renderView: function(e) {
                return i("At.renderView", this, e),
                e = e.splice(0, this.getOpt("limit")),
                e = c(e, this.dataValue()),
                e = f(e),
                e = l.call(this, e),
                this.view.render(this, e)
            },
            lookup: function() {
                var t, n, r;
                return r = this.getKeyname(),
                r ? (i("At.lookup.key", r), a(n = this.cache()) ? a(n = this.lookupWithData(r)) ? e.isFunction(t = this.getOpt("callback")) ? t(r.text, e.proxy(this.renderView, this)) : this.view.hide() : this.renderView(n) : this.renderView(n), e.noop()) : !1
            },
            lookupWithData: function(t) {
                var n, r, i = this;
                return n = this.getOpt("data"),
                e.isArray(n) && n.length !== 0 && (r = e.map(n,
                function(n, r) {
                    var s, o, u;
                    try {
                        o = e.isPlainObject(n) ? n[i.dataValue()] : n,
                        u = new RegExp(t.text.replace("+", "\\+"), "i"),
                        s = o.match(u)
                    } catch(a) {
                        return null
                    }
                    return s ? n: null
                })),
                r
            }
        },
        n = {
            timeout_id: null,
            id: "#at-view",
            holder: null,
            _jqo: null,
            jqo: function() {
                var t;
                return t = this._jqo,
                t = a(t) ? this._jqo = e(this.id) : t
            },
            init: function() {
                var t, n, r = this;
                if (!a(this.jqo())) return;
                return n = "<div id='" + this.id.slice(1) + "' class='at-view'><ul id='" + this.id.slice(1) + "-ul'></ul></div>",
                e("body").append(n),
                t = this.jqo().find("ul"),
                t.on("mouseenter.view", "li",
                function(n) {
                    return t.find(".cur").removeClass("cur"),
                    e(n.currentTarget).addClass("cur")
                }).on("click",
                function(e) {
                    return e.stopPropagation(),
                    e.preventDefault(),
                    r.choose()
                })
            },
            isShowing: function() {
                return this.jqo().is(":visible")
            },
            choose: function() {
                var e, t;
                return e = this.jqo().find(".cur"),
                t = a(e) ? this.holder.query.text + " ": e.attr(this.holder.getOpt("choose")) + " ",
                this.holder.replaceStr(t),
                this.hide()
            },
            rePosition: function() {
                var t;
                return t = this.holder.rect(),
                t.bottom + this.jqo().height() - e(window).scrollTop() > e(window).height() && (t.bottom = t.top - this.jqo().height()),
                i("AtView.rePosition", {
                    left: t.left,
                    top: t.bottom
                }),
                this.jqo().offset({
                    left: t.left,
                    top: t.bottom
                })
            },
            next: function() {
                var t, n;
                return t = this.jqo().find(".cur").removeClass("cur"),
                n = t.next(),
                n.length || (n = e(this.jqo().find("li")[0])),
                n.addClass("cur")
            },
            prev: function() {
                var e, t;
                return e = this.jqo().find(".cur").removeClass("cur"),
                t = e.prev(),
                t.length || (t = this.jqo().find("li").last()),
                t.addClass("cur")
            },
            show: function() {
                return this.isShowing() || this.jqo().show(),
                this.rePosition()
            },
            hide: function(e) {
                var t, n = this;
                if (!isNaN(e)) return t = function() {
                    return n.hide()
                },
                clearTimeout(this.timeout_id),
                this.timeout_id = setTimeout(t, 300);
                if (this.isShowing()) return this.jqo().hide()
            },
            clear: function(e) {
                return e === !0 && (this._cache = {}),
                this.jqo().find("ul").empty()
            },
            render: function(t, n) {
                var r, a;
                return e.isArray(n) ? n.length <= 0 ? (this.hide(), !0) : (this.holder = t, t.cache(n), this.clear(), r = this.jqo().find("ul"), a = t.getOpt("tpl"), e.each(n,
                function(e, n) {
                    var f;
                    return a || (a = s),
                    f = o(a, n),
                    i("AtView.render", f),
                    r.append(u(f, t.query.text))
                }), this.show(), r.find("li:eq(0)").addClass("cur")) : !1
            }
        },
        f = function(t) {
            return e.map(t,
            function(t, n) {
                return e.isPlainObject(t) || (t = {
                    id: n,
                    name: t
                }),
                t
            })
        },
        o = function(e, t) {
            var n;
            try {
                return n = e.replace(/\$\{([^\}]*)\}/g,
                function(e, n, r) {
                    return t[n]
                })
            } catch(r) {
                return ""
            }
        },
        u = function(e, t) {
            return a(t) ? e: e.replace(new RegExp(">\\s*(\\w*)(" + t.replace("+", "\\+") + ")(\\w*)\\s*<", "ig"),
            function(e, t, n, r) {
                return "> " + t + "<strong>" + n + "</strong>" + r + " <"
            })
        },
        l = function(e) {
            var t, n, r, i, s, o, u;
            t = this.dataValue(),
            r = this.query.text,
            i = [];
            for (o = 0, u = e.length; o < u; o++) {
                n = e[o],
                s = n[t];
                if (s.toLowerCase().indexOf(r) === -1) continue;
                n.order = s.toLowerCase().indexOf(r),
                i.push(n)
            }
            return i.sort(function(e, t) {
                return e.order - t.order
            }),
            i
        },
        c = function(t, n) {
            var r;
            return r = [],
            e.map(t,
            function(t, i) {
                var s;
                s = e.isPlainObject(t) ? t[n] : t;
                if (e.inArray(s, r) < 0) return r.push(s),
                t
            })
        },
        a = function(t) {
            return ! t || e.isPlainObject(t) && e.isEmptyObject(t) || e.isArray(t) && t.length === 0 || t instanceof e && t.length === 0 || t === void 0
        },
        s = "<li id='${id}' data-value='${name}'>${name}</li>",
        i = function() {},
        e.fn.atWho = function(r, i) {
            return n.init(),
            this.filter("textarea, input").each(function() {
                var n, s;
                return n = e(this),
                s = n.data("AtWho"),
                s || n.data("AtWho", s = new t(this)),
                s.reg(r, i)
            })
        },
        e.fn.atWho["default"] = {
            data: [],
            choose: "data-value",
            callback: null,
            cache: !0,
            limit: 5,
            tpl: s
        }
    } (window.jQuery)
}.call(this),
window.EMOJI_LIST = ["plus1", "ok_hand", "sleepy", "smile", "clap", "heart", "octopus", "six_pointed_star", "oden", "office", "ok", "ok_woman", "older_man", "skull", "smiley", "smirk", "smoking", "snake", "snowman", "sob", "soccer", "point_down", "point_left", "point_right", "point_up", "point_up_2", "a", "ab", "airplane", "alien", "ambulance", "angel", "anger", "angry", "apple", "aquarius", "aries", "arrow_backward", "arrow_down", "ski", "person_with_blond_hair", "phone", "pig", "pill", "pisces", "arrow_forward", "arrow_left", "arrow_lower_left", "arrow_lower_right", "arrow_right", "arrow_up", "arrow_upper_left", "arrow_upper_right", "art", "astonished", "atm", "b", "baby", "baby_chick", "baby_symbol", "balloon", "bamboo", "bank", "barber", "baseball", "basketball", "bath", "bear", "beer", "beers", "beginner", "bell", "bento", "bike", "bikini", "bird", "birthday", "black_square", "blue_car", "blue_heart", "blush", "boar", "boat", "bomb", "book", "boot", "bouquet", "bow", "bowtie", "boy", "bread", "briefcase", "broken_heart", "bug", "bulb", "slot_machine", "bullettrain_front", "bullettrain_side", "bus", "busstop", "cactus", "cake", "calling", "camel", "camera", "cancer", "capricorn", "car", "cat", "cd", "chart", "checkered_flag", "cherry_blossom", "chicken", "christmas_tree", "church", "cinema", "city_sunrise", "city_sunset", "clapper", "clock1", "clock10", "clock11", "clock12", "clock2", "clock3", "clock4", "clock5", "clock6", "clock7", "clock8", "clock9", "closed_umbrella", "cloud", "clubs", "cn", "cocktail", "coffee", "cold_sweat", "computer", "confounded", "congratulations", "construction", "construction_worker", "convenience_store", "cool", "cop", "copyright", "couple", "couple_with_heart", "couplekiss", "cow", "crossed_flags", "crown", "cry", "cupid", "currency_exchange", "curry", "cyclone", "dancer", "dancers", "dango", "dart", "dash", "de", "department_store", "diamonds", "disappointed", "dog", "dolls", "dolphin", "dress", "dvd", "ear", "ear_of_rice", "egg", "eggplant", "egplant", "eight_pointed_black_star", "eight_spoked_asterisk", "elephant", "email", "es", "european_castle", "exclamation", "eyes", "factory", "fallen_leaf", "fast_forward", "fax", "fearful", "feelsgood", "feet", "ferris_wheel", "finnadie", "fire", "fire_engine", "fireworks", "fish", "fist", "flags", "flushed", "football", "fork_and_knife", "fountain", "four_leaf_clover", "fr", "fries", "frog", "fuelpump", "gb", "gem", "gemini", "ghost", "gift", "gift_heart", "girl", "goberserk", "godmode", "golf", "green_heart", "grey_exclamation", "grey_question", "-1", "0", "1", "109", "2", "3", "4", "5", "6", "7", "8", "8ball", "9", "grin", "guardsman", "guitar", "gun", "haircut", "hamburger", "hammer", "hamster", "hand", "handbag", "hankey", "hash", "headphones", "heart_decoration", "heart_eyes", "heartbeat", "heartpulse", "hearts", "hibiscus", "high_heel", "horse", "hospital", "hotel", "hotsprings", "house", "hurtrealbad", "icecream", "id", "ideograph_advantage", "imp", "information_desk_person", "iphone", "it", "jack_o_lantern", "japanese_castle", "joy", "jp", "key", "kimono", "kiss", "kissing_face", "kissing_heart", "koala", "koko", "kr", "leaves", "leo", "libra", "lips", "lipstick", "lock", "loop", "loudspeaker", "love_hotel", "mag", "mahjong", "mailbox", "man", "man_with_gua_pi_mao", "man_with_turban", "maple_leaf", "mask", "massage", "mega", "memo", "mens", "metal", "metro", "microphone", "minidisc", "mobile_phone_off", "moneybag", "monkey", "monkey_face", "moon", "mortar_board", "mount_fuji", "mouse", "movie_camera", "muscle", "musical_note", "nail_care", "necktie", "new", "no_good", "no_smoking", "nose", "notes", "o", "o2", "ocean", "octocat", "older_woman", "open_hands", "ophiuchus", "palm_tree", "parking", "part_alternation_mark", "pencil", "penguin", "pensive", "persevere", "police_car", "poop", "post_office", "postbox", "pray", "princess", "punch", "purple_heart", "question", "rabbit", "racehorse", "radio", "rage", "rage1", "rage2", "rage3", "rage4", "rainbow", "raised_hands", "ramen", "red_car", "red_circle", "registered", "relaxed", "relieved", "restroom", "rewind", "ribbon", "rice", "rice_ball", "rice_cracker", "rice_scene", "ring", "rocket", "roller_coaster", "rose", "ru", "runner", "sa", "sagittarius", "sailboat", "sake", "sandal", "santa", "satellite", "satisfied", "saxophone", "school", "school_satchel", "scissors", "scorpius", "scream", "seat", "secret", "shaved_ice", "sheep", "shell", "ship", "shipit", "shirt", "shit", "shoe", "signal_strength", "space_invader", "spades", "spaghetti", "sparkler", "sparkles", "speaker", "speedboat", "squirrel", "star", "star2", "stars", "station", "statue_of_liberty", "stew", "strawberry", "sunflower", "sunny", "sunrise", "sunrise_over_mountains", "surfer", "sushi", "suspect", "sweat", "sweat_drops", "swimmer", "syringe", "tada", "tangerine", "taurus", "taxi", "tea", "telephone", "tennis", "tent", "thumbsdown", "thumbsup", "ticket", "tiger", "tm", "toilet", "tokyo_tower", "tomato", "tongue", "top", "tophat", "traffic_light", "train", "trident", "trollface", "trophy", "tropical_fish", "truck", "trumpet", "tshirt", "tulip", "tv", "u5272", "u55b6", "u6307", "u6708", "u6709", "u6e80", "u7121", "u7533", "u7a7a", "umbrella", "unamused", "underage", "unlock", "up", "us", "v", "vhs", "vibration_mode", "virgo", "vs", "walking", "warning", "watermelon", "wave", "wc", "wedding", "whale", "wheelchair", "white_square", "wind_chime", "wink", "wink2", "wolf", "woman", "womans_hat", "womens", "x", "yellow_heart", "zap", "zzz", "+1"];
var Faye = typeof Faye == "object" ? Faye: {};
typeof window != "undefined" && (window.Faye = Faye),
Faye.extend = function(e, t, n) {
    if (!t) return e;
    for (var r in t) {
        if (!t.hasOwnProperty(r)) continue;
        if (e.hasOwnProperty(r) && n === !1) continue;
        e[r] !== t[r] && (e[r] = t[r])
    }
    return e
},
Faye.extend(Faye, {
    VERSION: "0.8.2",
    BAYEUX_VERSION: "1.0",
    ID_LENGTH: 128,
    JSONP_CALLBACK: "jsonpcallback",
    CONNECTION_TYPES: ["long-polling", "cross-origin-long-polling", "callback-polling", "websocket", "eventsource", "in-process"],
    MANDATORY_CONNECTION_TYPES: ["long-polling", "callback-polling", "in-process"],
    ENV: function() {
        return this
    } (),
    random: function(e) {
        e = e || this.ID_LENGTH;
        if (e > 32) {
            var t = Math.ceil(e / 32),
            n = "";
            while (t--) n += this.random(32);
            return n
        }
        var r = Math.pow(2, e) - 1,
        i = r.toString(36).length,
        n = Math.floor(Math.random() * r).toString(36);
        while (n.length < i) n = "0" + n;
        return n
    },
    clientIdFromMessages: function(e) {
        var t = [].concat(e)[0];
        return t && t.clientId
    },
    copyObject: function(e) {
        var t, n, r;
        if (e instanceof Array) {
            t = [],
            n = e.length;
            while (n--) t[n] = Faye.copyObject(e[n]);
            return t
        }
        if (typeof e == "object") {
            t = e === null ? null: {};
            for (r in e) t[r] = Faye.copyObject(e[r]);
            return t
        }
        return e
    },
    commonElement: function(e, t) {
        for (var n = 0,
        r = e.length; n < r; n++) if (this.indexOf(t, e[n]) !== -1) return e[n];
        return null
    },
    indexOf: function(e, t) {
        if (e.indexOf) return e.indexOf(t);
        for (var n = 0,
        r = e.length; n < r; n++) if (e[n] === t) return n;
        return - 1
    },
    map: function(e, t, n) {
        if (e.map) return e.map(t, n);
        var r = [];
        if (e instanceof Array) for (var i = 0,
        s = e.length; i < s; i++) r.push(t.call(n || null, e[i], i));
        else for (var o in e) {
            if (!e.hasOwnProperty(o)) continue;
            r.push(t.call(n || null, o, e[o]))
        }
        return r
    },
    filter: function(e, t, n) {
        var r = [];
        for (var i = 0,
        s = e.length; i < s; i++) t.call(n || null, e[i], i) && r.push(e[i]);
        return r
    },
    asyncEach: function(e, t, n, r) {
        var i = e.length,
        s = -1,
        o = 0,
        u = !1,
        a = function() {
            o -= 1,
            s += 1;
            if (s === i) return n && n.call(r);
            t(e[s], l)
        },
        f = function() {
            if (u) return;
            u = !0;
            while (o > 0) a();
            u = !1
        },
        l = function() {
            o += 1,
            f()
        };
        l()
    },
    toJSON: function(e) {
        return this.stringify ? this.stringify(e,
        function(e, t) {
            return this[e] instanceof Array ? this[e] : t
        }) : JSON.stringify(e)
    },
    logger: function(e) {
        typeof console != "undefined" && console.log(e)
    },
    timestamp: function() {
        var e = new Date,
        t = e.getFullYear(),
        n = e.getMonth() + 1,
        r = e.getDate(),
        i = e.getHours(),
        s = e.getMinutes(),
        o = e.getSeconds(),
        u = function(e) {
            return e < 10 ? "0" + e: String(e)
        };
        return u(t) + "-" + u(n) + "-" + u(r) + " " + u(i) + ":" + u(s) + ":" + u(o)
    }
}),
Faye.Class = function(e, t) {
    typeof e != "function" && (t = e, e = Object);
    var n = function() {
        return this.initialize ? this.initialize.apply(this, arguments) || this: this
    },
    r = function() {};
    return r.prototype = e.prototype,
    n.prototype = new r,
    Faye.extend(n.prototype, t),
    n
},
Faye.Namespace = Faye.Class({
    initialize: function() {
        this._d = {}
    },
    exists: function(e) {
        return this._d.hasOwnProperty(e)
    },
    generate: function() {
        var e = Faye.random();
        while (this._d.hasOwnProperty(e)) e = Faye.random();
        return this._d[e] = e
    },
    release: function(e) {
        delete this._d[e]
    }
}),
Faye.Error = Faye.Class({
    initialize: function(e, t, n) {
        this.code = e,
        this.params = Array.prototype.slice.call(t),
        this.message = n
    },
    toString: function() {
        return this.code + ":" + this.params.join(",") + ":" + this.message
    }
}),
Faye.Error.parse = function(e) {
    e = e || "";
    if (!Faye.Grammar.ERROR.test(e)) return new this(null, [], e);
    var t = e.split(":"),
    n = parseInt(t[0]),
    r = t[1].split(","),
    e = t[2];
    return new this(n, r, e)
},
Faye.Error.versionMismatch = function() {
    return (new this(300, arguments, "Version mismatch")).toString()
},
Faye.Error.conntypeMismatch = function() {
    return (new this(301, arguments, "Connection types not supported")).toString()
},
Faye.Error.extMismatch = function() {
    return (new this(302, arguments, "Extension mismatch")).toString()
},
Faye.Error.badRequest = function() {
    return (new this(400, arguments, "Bad request")).toString()
},
Faye.Error.clientUnknown = function() {
    return (new this(401, arguments, "Unknown client")).toString()
},
Faye.Error.parameterMissing = function() {
    return (new this(402, arguments, "Missing required parameter")).toString()
},
Faye.Error.channelForbidden = function() {
    return (new this(403, arguments, "Forbidden channel")).toString()
},
Faye.Error.channelUnknown = function() {
    return (new this(404, arguments, "Unknown channel")).toString()
},
Faye.Error.channelInvalid = function() {
    return (new this(405, arguments, "Invalid channel")).toString()
},
Faye.Error.extUnknown = function() {
    return (new this(406, arguments, "Unknown extension")).toString()
},
Faye.Error.publishFailed = function() {
    return (new this(407, arguments, "Failed to publish")).toString()
},
Faye.Error.serverError = function() {
    return (new this(500, arguments, "Internal server error")).toString()
},
Faye.Deferrable = {
    callback: function(e, t) {
        if (!e) return;
        if (this._v === "succeeded") return e.apply(t, this._j);
        this._k = this._k || [],
        this._k.push([e, t])
    },
    timeout: function(e, t) {
        var n = this,
        r = Faye.ENV.setTimeout(function() {
            n.setDeferredStatus("failed", t)
        },
        e * 1e3);
        this._w = r
    },
    errback: function(e, t) {
        if (!e) return;
        if (this._v === "failed") return e.apply(t, this._j);
        this._l = this._l || [],
        this._l.push([e, t])
    },
    setDeferredStatus: function() {
        this._w && Faye.ENV.clearTimeout(this._w);
        var e = Array.prototype.slice.call(arguments),
        t = e.shift(),
        n;
        this._v = t,
        this._j = e,
        t === "succeeded" ? n = this._k: t === "failed" && (n = this._l);
        if (!n) return;
        var r;
        while (r = n.shift()) r[0].apply(r[1], this._j)
    }
},
Faye.Publisher = {
    countListeners: function(e) {
        return ! this._3 || !this._3[e] ? 0 : this._3[e].length
    },
    bind: function(e, t, n) {
        this._3 = this._3 || {};
        var r = this._3[e] = this._3[e] || [];
        r.push([t, n])
    },
    unbind: function(e, t, n) {
        if (!this._3 || !this._3[e]) return;
        if (!t) {
            delete this._3[e];
            return
        }
        var r = this._3[e],
        i = r.length;
        while (i--) {
            if (t !== r[i][0]) continue;
            if (n && r[i][1] !== n) continue;
            r.splice(i, 1)
        }
    },
    trigger: function() {
        var e = Array.prototype.slice.call(arguments),
        t = e.shift();
        if (!this._3 || !this._3[t]) return;
        var n = this._3[t].slice(),
        r;
        for (var i = 0,
        s = n.length; i < s; i++) r = n[i],
        r[0].apply(r[1], e)
    }
},
Faye.Timeouts = {
    addTimeout: function(e, t, n, r) {
        this._5 = this._5 || {};
        if (this._5.hasOwnProperty(e)) return;
        var i = this;
        this._5[e] = Faye.ENV.setTimeout(function() {
            delete i._5[e],
            n.call(r)
        },
        1e3 * t)
    },
    removeTimeout: function(e) {
        this._5 = this._5 || {};
        var t = this._5[e];
        if (!t) return;
        clearTimeout(t),
        delete this._5[e]
    }
},
Faye.Logging = {
    LOG_LEVELS: {
        error: 3,
        warn: 2,
        info: 1,
        debug: 0
    },
    logLevel: "error",
    log: function(e, t) {
        if (!Faye.logger) return;
        var n = Faye.Logging.LOG_LEVELS;
        if (n[Faye.Logging.logLevel] > n[t]) return;
        var e = Array.prototype.slice.apply(e),
        r = " [" + t.toUpperCase() + "] [Faye",
        i = this.className,
        s = e.shift().replace(/\?/g,
        function() {
            try {
                return Faye.toJSON(e.shift())
            } catch(t) {
                return "[Object]"
            }
        });
        for (var o in Faye) {
            if (i) continue;
            if (typeof Faye[o] != "function") continue;
            this instanceof Faye[o] && (i = o)
        }
        i && (r += "." + i),
        r += "] ",
        Faye.logger(Faye.timestamp() + r + s)
    }
},
function() {
    for (var e in Faye.Logging.LOG_LEVELS)(function(e, t) {
        Faye.Logging[e] = function() {
            this.log(arguments, e)
        }
    })(e, Faye.Logging.LOG_LEVELS[e])
} (),
Faye.Grammar = {
    LOWALPHA: /^[a-z]$/,
    UPALPHA: /^[A-Z]$/,
    ALPHA: /^([a-z]|[A-Z])$/,
    DIGIT: /^[0-9]$/,
    ALPHANUM: /^(([a-z]|[A-Z])|[0-9])$/,
    MARK: /^(\-|\_|\!|\~|\(|\)|\$|\@)$/,
    STRING: /^(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*$/,
    TOKEN: /^(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+$/,
    INTEGER: /^([0-9])+$/,
    CHANNEL_SEGMENT: /^(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+$/,
    CHANNEL_SEGMENTS: /^(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*$/,
    CHANNEL_NAME: /^\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*$/,
    WILD_CARD: /^\*{1,2}$/,
    CHANNEL_PATTERN: /^(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*\/\*{1,2}$/,
    VERSION_ELEMENT: /^(([a-z]|[A-Z])|[0-9])(((([a-z]|[A-Z])|[0-9])|\-|\_))*$/,
    VERSION: /^([0-9])+(\.(([a-z]|[A-Z])|[0-9])(((([a-z]|[A-Z])|[0-9])|\-|\_))*)*$/,
    CLIENT_ID: /^((([a-z]|[A-Z])|[0-9]))+$/,
    ID: /^((([a-z]|[A-Z])|[0-9]))+$/,
    ERROR_MESSAGE: /^(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*$/,
    ERROR_ARGS: /^(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*(,(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)*$/,
    ERROR_CODE: /^[0-9][0-9][0-9]$/,
    ERROR: /^([0-9][0-9][0-9]:(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*(,(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)*:(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*|[0-9][0-9][0-9]::(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)$/
},
Faye.Extensible = {
    addExtension: function(e) {
        this._6 = this._6 || [],
        this._6.push(e),
        e.added && e.added(this)
    },
    removeExtension: function(e) {
        if (!this._6) return;
        var t = this._6.length;
        while (t--) {
            if (this._6[t] !== e) continue;
            this._6.splice(t, 1),
            e.removed && e.removed(this)
        }
    },
    pipeThroughExtensions: function(e, t, n, r) {
        this.debug("Passing through ? extensions: ?", e, t);
        if (!this._6) return n.call(r, t);
        var i = this._6.slice(),
        s = function(t) {
            if (!t) return n.call(r, t);
            var o = i.shift();
            if (!o) return n.call(r, t);
            o[e] ? o[e](t, s) : s(t)
        };
        s(t)
    }
},
Faye.extend(Faye.Extensible, Faye.Logging),
Faye.Channel = Faye.Class({
    initialize: function(e) {
        this.id = this.name = e
    },
    push: function(e) {
        this.trigger("message", e)
    },
    isUnused: function() {
        return this.countListeners("message") === 0
    }
}),
Faye.extend(Faye.Channel.prototype, Faye.Publisher),
Faye.extend(Faye.Channel, {
    HANDSHAKE: "/meta/handshake",
    CONNECT: "/meta/connect",
    SUBSCRIBE: "/meta/subscribe",
    UNSUBSCRIBE: "/meta/unsubscribe",
    DISCONNECT: "/meta/disconnect",
    META: "meta",
    SERVICE: "service",
    expand: function(e) {
        var t = this.parse(e),
        n = ["/**", e],
        r = t.slice();
        r[r.length - 1] = "*",
        n.push(this.unparse(r));
        for (var i = 1,
        s = t.length; i < s; i++) r = t.slice(0, i),
        r.push("**"),
        n.push(this.unparse(r));
        return n
    },
    isValid: function(e) {
        return Faye.Grammar.CHANNEL_NAME.test(e) || Faye.Grammar.CHANNEL_PATTERN.test(e)
    },
    parse: function(e) {
        return this.isValid(e) ? e.split("/").slice(1) : null
    },
    unparse: function(e) {
        return "/" + e.join("/")
    },
    isMeta: function(e) {
        var t = this.parse(e);
        return t ? t[0] === this.META: null
    },
    isService: function(e) {
        var t = this.parse(e);
        return t ? t[0] === this.SERVICE: null
    },
    isSubscribable: function(e) {
        return this.isValid(e) ? !this.isMeta(e) && !this.isService(e) : null
    },
    Set: Faye.Class({
        initialize: function() {
            this._2 = {}
        },
        getKeys: function() {
            var e = [];
            for (var t in this._2) e.push(t);
            return e
        },
        remove: function(e) {
            delete this._2[e]
        },
        hasSubscription: function(e) {
            return this._2.hasOwnProperty(e)
        },
        subscribe: function(e, t, n) {
            if (!t) return;
            var r;
            for (var i = 0,
            s = e.length; i < s; i++) {
                r = e[i];
                var o = this._2[r] = this._2[r] || new Faye.Channel(r);
                o.bind("message", t, n)
            }
        },
        unsubscribe: function(e, t, n) {
            var r = this._2[e];
            return r ? (r.unbind("message", t, n), r.isUnused() ? (this.remove(e), !0) : !1) : !1
        },
        distributeMessage: function(e) {
            var t = Faye.Channel.expand(e.channel);
            for (var n = 0,
            r = t.length; n < r; n++) {
                var i = this._2[t[n]];
                i && i.trigger("message", e.data)
            }
        }
    })
}),
Faye.Publication = Faye.Class(Faye.Deferrable),
Faye.Subscription = Faye.Class({
    initialize: function(e, t, n, r) {
        this._7 = e,
        this._2 = t,
        this._m = n,
        this._n = r,
        this._x = !1
    },
    cancel: function() {
        if (this._x) return;
        this._7.unsubscribe(this._2, this._m, this._n),
        this._x = !0
    },
    unsubscribe: function() {
        this.cancel()
    }
}),
Faye.extend(Faye.Subscription.prototype, Faye.Deferrable),
Faye.Client = Faye.Class({
    UNCONNECTED: 1,
    CONNECTING: 2,
    CONNECTED: 3,
    DISCONNECTED: 4,
    HANDSHAKE: "handshake",
    RETRY: "retry",
    NONE: "none",
    CONNECTION_TIMEOUT: 60,
    DEFAULT_RETRY: 5,
    DEFAULT_ENDPOINT: "/bayeux",
    INTERVAL: 0,
    initialize: function(e, t) {
        this.info("New client created for ?", e),
        this.endpoint = e || this.DEFAULT_ENDPOINT,
        this._E = Faye.CookieJar && new Faye.CookieJar,
        this._y = {},
        this._o = t || {},
        this._p = [],
        this.retry = this._o.retry || this.DEFAULT_RETRY,
        this._z(Faye.MANDATORY_CONNECTION_TYPES),
        this._1 = this.UNCONNECTED,
        this._2 = new Faye.Channel.Set,
        this._e = 0,
        this._q = {},
        this._8 = {
            reconnect: this.RETRY,
            interval: 1e3 * (this._o.interval || this.INTERVAL),
            timeout: 1e3 * (this._o.timeout || this.CONNECTION_TIMEOUT)
        },
        Faye.Event && Faye.Event.on(Faye.ENV, "beforeunload",
        function() {
            Faye.indexOf(this._p, "autodisconnect") < 0 && this.disconnect()
        },
        this)
    },
    disable: function(e) {
        this._p.push(e)
    },
    setHeader: function(e, t) {
        this._y[e] = t
    },
    getClientId: function() {
        return this._0
    },
    getState: function() {
        switch (this._1) {
        case this.UNCONNECTED:
            return "UNCONNECTED";
        case this.CONNECTING:
            return "CONNECTING";
        case this.CONNECTED:
            return "CONNECTED";
        case this.DISCONNECTED:
            return "DISCONNECTED"
        }
    },
    handshake: function(e, t) {
        if (this._8.reconnect === this.NONE) return;
        if (this._1 !== this.UNCONNECTED) return;
        this._1 = this.CONNECTING;
        var n = this;
        this.info("Initiating handshake with ?", this.endpoint),
        this._9({
            channel: Faye.Channel.HANDSHAKE,
            version: Faye.BAYEUX_VERSION,
            supportedConnectionTypes: [this._a.connectionType]
        },
        function(r) {
            if (r.successful) {
                this._1 = this.CONNECTED,
                this._0 = r.clientId;
                var i = Faye.filter(r.supportedConnectionTypes,
                function(e) {
                    return Faye.indexOf(this._p, e) < 0
                },
                this);
                this._z(i),
                this.info("Handshake successful: ?", this._0),
                this.subscribe(this._2.getKeys(), !0),
                e && e.call(t)
            } else this.info("Handshake unsuccessful"),
            Faye.ENV.setTimeout(function() {
                n.handshake(e, t)
            },
            this._8.interval),
            this._1 = this.UNCONNECTED
        },
        this)
    },
    connect: function(e, t) {
        if (this._8.reconnect === this.NONE) return;
        if (this._1 === this.DISCONNECTED) return;
        if (this._1 === this.UNCONNECTED) return this.handshake(function() {
            this.connect(e, t)
        },
        this);
        this.callback(e, t);
        if (this._1 !== this.CONNECTED) return;
        this.info("Calling deferred actions for ?", this._0),
        this.setDeferredStatus("succeeded"),
        this.setDeferredStatus("deferred");
        if (this._r) return;
        this._r = !0,
        this.info("Initiating connection for ?", this._0),
        this._9({
            channel: Faye.Channel.CONNECT,
            clientId: this._0,
            connectionType: this._a.connectionType
        },
        this._A, this)
    },
    disconnect: function() {
        if (this._1 !== this.CONNECTED) return;
        this._1 = this.DISCONNECTED,
        this.info("Disconnecting ?", this._0),
        this._9({
            channel: Faye.Channel.DISCONNECT,
            clientId: this._0
        },
        function(e) {
            e.successful && this._a.close()
        },
        this),
        this.info("Clearing channel listeners for ?", this._0),
        this._2 = new Faye.Channel.Set
    },
    subscribe: function(e, t, n) {
        if (e instanceof Array) {
            for (var r = 0,
            i = e.length; r < i; r++) this.subscribe(e[r], t, n);
            return
        }
        var s = new Faye.Subscription(this, e, t, n),
        o = t === !0,
        u = this._2.hasSubscription(e);
        return u && !o ? (this._2.subscribe([e], t, n), s.setDeferredStatus("succeeded"), s) : (this.connect(function() {
            this.info("Client ? attempting to subscribe to ?", this._0, e),
            o || this._2.subscribe([e], t, n),
            this._9({
                channel: Faye.Channel.SUBSCRIBE,
                clientId: this._0,
                subscription: e
            },
            function(r) {
                if (!r.successful) return s.setDeferredStatus("failed", Faye.Error.parse(r.error)),
                this._2.unsubscribe(e, t, n);
                var i = [].concat(r.subscription);
                this.info("Subscription acknowledged for ? to ?", this._0, i),
                s.setDeferredStatus("succeeded")
            },
            this)
        },
        this), s)
    },
    unsubscribe: function(e, t, n) {
        if (e instanceof Array) {
            for (var r = 0,
            i = e.length; r < i; r++) this.unsubscribe(e[r], t, n);
            return
        }
        var s = this._2.unsubscribe(e, t, n);
        if (!s) return;
        this.connect(function() {
            this.info("Client ? attempting to unsubscribe from ?", this._0, e),
            this._9({
                channel: Faye.Channel.UNSUBSCRIBE,
                clientId: this._0,
                subscription: e
            },
            function(e) {
                if (!e.successful) return;
                var t = [].concat(e.subscription);
                this.info("Unsubscription acknowledged for ? from ?", this._0, t)
            },
            this)
        },
        this)
    },
    publish: function(e, t) {
        var n = new Faye.Publication;
        return this.connect(function() {
            this.info("Client ? queueing published message to ?: ?", this._0, e, t),
            this._9({
                channel: e,
                data: t,
                clientId: this._0
            },
            function(e) {
                e.successful ? n.setDeferredStatus("succeeded") : n.setDeferredStatus("failed", Faye.Error.parse(e.error))
            },
            this)
        },
        this),
        n
    },
    receiveMessage: function(e) {
        this.pipeThroughExtensions("incoming", e,
        function(e) {
            if (!e) return;
            e.advice && this._F(e.advice),
            this._G(e);
            if (e.successful === undefined) return;
            var t = this._q[e.id];
            if (!t) return;
            delete this._q[e.id],
            t[0].call(t[1], e)
        },
        this)
    },
    _z: function(e) {
        Faye.Transport.get(this, e,
        function(e) {
            this._a = e,
            this._a.cookies = this._E,
            this._a.headers = this._y,
            e.bind("down",
            function() {
                if (this._c !== undefined && !this._c) return;
                this._c = !1,
                this.trigger("transport:down")
            },
            this),
            e.bind("up",
            function() {
                if (this._c !== undefined && this._c) return;
                this._c = !0,
                this.trigger("transport:up")
            },
            this)
        },
        this)
    },
    _9: function(e, t, n) {
        e.id = this._H(),
        t && (this._q[e.id] = [t, n]),
        this.pipeThroughExtensions("outgoing", e,
        function(e) {
            if (!e) return;
            this._a.send(e, this._8.timeout / 1e3)
        },
        this)
    },
    _H: function() {
        return this._e += 1,
        this._e >= Math.pow(2, 32) && (this._e = 0),
        this._e.toString(36)
    },
    _F: function(e) {
        Faye.extend(this._8, e),
        this._8.reconnect === this.HANDSHAKE && this._1 !== this.DISCONNECTED && (this._1 = this.UNCONNECTED, this._0 = null, this._A())
    },
    _G: function(e) {
        if (!e.channel || e.data === undefined) return;
        this.info("Client ? calling listeners for ? with ?", this._0, e.channel, e.data),
        this._2.distributeMessage(e)
    },
    _I: function() {
        if (!this._r) return;
        this._r = null,
        this.info("Closed connection for ?", this._0)
    },
    _A: function() {
        this._I();
        var e = this;
        Faye.ENV.setTimeout(function() {
            e.connect()
        },
        this._8.interval)
    }
}),
Faye.extend(Faye.Client.prototype, Faye.Deferrable),
Faye.extend(Faye.Client.prototype, Faye.Publisher),
Faye.extend(Faye.Client.prototype, Faye.Logging),
Faye.extend(Faye.Client.prototype, Faye.Extensible),
Faye.Transport = Faye.extend(Faye.Class({
    MAX_DELAY: 0,
    batching: !0,
    initialize: function(e, t) {
        this.debug("Created new ? transport for ?", this.connectionType, t),
        this._7 = e,
        this._b = t,
        this._f = []
    },
    close: function() {},
    send: function(e, t) {
        this.debug("Client ? sending message to ?: ?", this._7._0, this._b, e);
        if (!this.batching) return this.request([e], t);
        this._f.push(e),
        this._J = t;
        if (e.channel === Faye.Channel.HANDSHAKE) return this.flush();
        e.channel === Faye.Channel.CONNECT && (this._s = e),
        this.addTimeout("publish", this.MAX_DELAY, this.flush, this)
    },
    flush: function() {
        this.removeTimeout("publish"),
        this._f.length > 1 && this._s && (this._s.advice = {
            timeout: 0
        }),
        this.request(this._f, this._J),
        this._s = null,
        this._f = []
    },
    receive: function(e) {
        this.debug("Client ? received from ?: ?", this._7._0, this._b, e);
        for (var t = 0,
        n = e.length; t < n; t++) this._7.receiveMessage(e[t])
    },
    retry: function(e, t) {
        var n = !1,
        r = this._7.retry * 1e3,
        i = this;
        return function() {
            if (n) return;
            n = !0,
            Faye.ENV.setTimeout(function() {
                i.request(e, t)
            },
            r)
        }
    }
}), {
    get: function(e, t, n, r) {
        var i = e.endpoint;
        t === undefined && (t = this.supportedConnectionTypes()),
        Faye.asyncEach(this._t,
        function(s, o) {
            var u = s[0],
            a = s[1];
            if (Faye.indexOf(t, u) < 0) return o();
            a.isUsable(i,
            function(t) {
                t ? n.call(r, new a(e, i)) : o()
            })
        },
        function() {
            throw new Error("Could not find a usable connection type for " + i)
        })
    },
    register: function(e, t) {
        this._t.push([e, t]),
        t.prototype.connectionType = e
    },
    _t: [],
    supportedConnectionTypes: function() {
        return Faye.map(this._t,
        function(e) {
            return e[0]
        })
    }
}),
Faye.extend(Faye.Transport.prototype, Faye.Logging),
Faye.extend(Faye.Transport.prototype, Faye.Publisher),
Faye.extend(Faye.Transport.prototype, Faye.Timeouts),
Faye.Event = {
    _g: [],
    on: function(e, t, n, r) {
        var i = function() {
            n.call(r)
        };
        e.addEventListener ? e.addEventListener(t, i, !1) : e.attachEvent("on" + t, i),
        this._g.push({
            _h: e,
            _u: t,
            _m: n,
            _n: r,
            _B: i
        })
    },
    detach: function(e, t, n, r) {
        var i = this._g.length,
        s;
        while (i--) {
            s = this._g[i];
            if (e && e !== s._h || t && t !== s._u || n && n !== s._m || r && r !== s._n) continue;
            s._h.removeEventListener ? s._h.removeEventListener(s._u, s._B, !1) : s._h.detachEvent("on" + s._u, s._B),
            this._g.splice(i, 1),
            s = null
        }
    }
},
Faye.Event.on(Faye.ENV, "unload", Faye.Event.detach, Faye.Event),
Faye.URI = Faye.extend(Faye.Class({
    queryString: function() {
        var e = [];
        for (var t in this.params) {
            if (!this.params.hasOwnProperty(t)) continue;
            e.push(encodeURIComponent(t) + "=" + encodeURIComponent(this.params[t]))
        }
        return e.join("&")
    },
    isLocal: function() {
        var e = Faye.URI.parse(Faye.ENV.location.href),
        t = e.hostname !== this.hostname || e.port !== this.port || e.protocol !== this.protocol;
        return ! t
    },
    toURL: function() {
        var e = this.queryString();
        return this.protocol + this.hostname + ":" + this.port + this.pathname + (e ? "?" + e: "")
    }
}), {
    parse: function(e, t) {
        if (typeof e != "string") return e;
        var n = new this,
        r = function(t, r) {
            e = e.replace(r,
            function(e) {
                return e && (n[t] = e),
                ""
            })
        };
        r("protocol", /^https?\:\/+/),
        r("hostname", /^[^\/\:]+/),
        r("port", /^:[0-9]+/),
        Faye.extend(n, {
            protocol: Faye.ENV.location.protocol + "//",
            hostname: Faye.ENV.location.hostname,
            port: Faye.ENV.location.port
        },
        !1),
        n.port || (n.port = n.protocol === "https://" ? "443": "80"),
        n.port = n.port.replace(/\D/g, "");
        var i = e.split("?"),
        s = i.shift(),
        o = i.join("?"),
        u = o ? o.split("&") : [],
        a = u.length,
        f = {};
        while (a--) i = u[a].split("="),
        f[decodeURIComponent(i[0] || "")] = decodeURIComponent(i[1] || "");
        return typeof t == "object" && Faye.extend(f, t),
        n.pathname = s,
        n.params = f,
        n
    }
}),
this.JSON || (JSON = {}),
function() {
    function k(e) {
        return e < 10 ? "0" + e: e
    }
    function r(e) {
        return n.lastIndex = 0,
        n.test(e) ? '"' + e.replace(n,
        function(e) {
            var t = s[e];
            return typeof t == "string" ? t: "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice( - 4)
        }) + '"': '"' + e + '"'
    }
    function q(e, t) {
        var n, i, s, u, a = l,
        f, c = t[e];
        c && typeof c == "object" && typeof c.toJSON == "function" && (c = c.toJSON(e)),
        typeof o == "function" && (c = o.call(t, e, c));
        switch (typeof c) {
        case "string":
            return r(c);
        case "number":
            return isFinite(c) ? String(c) : "null";
        case "boolean":
        case "null":
            return String(c);
        case "object":
            if (!c) return "null";
            l += p,
            f = [];
            if (Object.prototype.toString.apply(c) === "[object Array]") {
                u = c.length;
                for (n = 0; n < u; n += 1) f[n] = q(n, c) || "null";
                return s = f.length === 0 ? "[]": l ? "[\n" + l + f.join(",\n" + l) + "\n" + a + "]": "[" + f.join(",") + "]",
                l = a,
                s
            }
            if (o && typeof o == "object") {
                u = o.length;
                for (n = 0; n < u; n += 1) i = o[n],
                typeof i == "string" && (s = q(i, c), s && f.push(r(i) + (l ? ": ": ":") + s))
            } else for (i in c) Object.hasOwnProperty.call(c, i) && (s = q(i, c), s && f.push(r(i) + (l ? ": ": ":") + s));
            return s = f.length === 0 ? "{}": l ? "{\n" + l + f.join(",\n" + l) + "\n" + a + "}": "{" + f.join(",") + "}",
            l = a,
            s
        }
    }
    typeof Date.prototype.toJSON != "function" && (Date.prototype.toJSON = function(e) {
        return this.getUTCFullYear() + "-" + k(this.getUTCMonth() + 1) + "-" + k(this.getUTCDate()) + "T" + k(this.getUTCHours()) + ":" + k(this.getUTCMinutes()) + ":" + k(this.getUTCSeconds()) + "Z"
    },
    String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(e) {
        return this.valueOf()
    });
    var m = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    n = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    l, p, s = {
        "\b": "\\b",
        "	": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    },
    o;
    Faye.stringify = function(e, t, n) {
        var r;
        l = "",
        p = "";
        if (typeof n == "number") for (r = 0; r < n; r += 1) p += " ";
        else typeof n == "string" && (p = n);
        o = t;
        if (!t || typeof t == "function" || typeof t == "object" && typeof t.length == "number") return q("", {
            "": e
        });
        throw new Error("JSON.stringify")
    },
    typeof JSON.stringify != "function" && (JSON.stringify = Faye.stringify),
    typeof JSON.parse != "function" && (JSON.parse = function(g, j) {
        function h(e, t) {
            var n, r, i = e[t];
            if (i && typeof i == "object") for (n in i) Object.hasOwnProperty.call(i, n) && (r = h(i, n), r !== undefined ? i[n] = r: delete i[n]);
            return j.call(e, t, i)
        }
        var i;
        m.lastIndex = 0,
        m.test(g) && (g = g.replace(m,
        function(e) {
            return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice( - 4)
        }));
        if (/^[\],:{}\s]*$/.test(g.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return i = eval("(" + g + ")"),
        typeof j == "function" ? h({
            "": i
        },
        "") : i;
        throw new SyntaxError("JSON.parse")
    })
} (),
Faye.Transport.WebSocket = Faye.extend(Faye.Class(Faye.Transport, {
    UNCONNECTED: 1,
    CONNECTING: 2,
    CONNECTED: 3,
    batching: !1,
    request: function(e, t) {
        if (e.length === 0) return;
        this._i = this._i || {};
        for (var n = 0,
        r = e.length; n < r; n++) this._i[e[n].id] = e[n];
        this.withSocket(function(t) {
            t.send(Faye.toJSON(e))
        })
    },
    withSocket: function(e, t) {
        this.callback(e, t),
        this.connect()
    },
    close: function() {
        if (this._C) return;
        this._C = !0,
        this._4 && this._4.close()
    },
    connect: function() {
        if (this._C) return;
        this._1 = this._1 || this.UNCONNECTED;
        if (this._1 !== this.UNCONNECTED) return;
        this._1 = this.CONNECTING;
        var e = Faye.Transport.WebSocket.getClass();
        this._4 = new e(Faye.Transport.WebSocket.getSocketUrl(this._b));
        var t = this;
        this._4.onopen = function() {
            t._1 = t.CONNECTED,
            t.setDeferredStatus("succeeded", t._4),
            t.trigger("up")
        },
        this._4.onmessage = function(e) {
            var n = [].concat(JSON.parse(e.data));
            for (var r = 0,
            i = n.length; r < i; r++) delete t._i[n[r].id];
            t.receive(n)
        },
        this._4.onclose = function() {
            var e = t._1 === t.CONNECTED;
            t.setDeferredStatus("deferred"),
            t._1 = t.UNCONNECTED,
            delete t._4;
            if (e) return t.resend();
            var n = t._7.retry * 1e3;
            Faye.ENV.setTimeout(function() {
                t.connect()
            },
            n),
            t.trigger("down")
        }
    },
    resend: function() {
        var e = Faye.map(this._i,
        function(e, t) {
            return t
        });
        this.request(e)
    }
}), {
    WEBSOCKET_TIMEOUT: 1e3,
    getSocketUrl: function(e) {
        return Faye.URI && (e = Faye.URI.parse(e).toURL()),
        e.replace(/^http(s?):/ig, "ws$1:")
    },
    getClass: function() {
        return Faye.WebSocket && Faye.WebSocket.Client || Faye.ENV.WebSocket || Faye.ENV.MozWebSocket
    },
    isUsable: function(e, t, n) {
        var r = this.getClass();
        if (!r) return t.call(n, !1);
        var i = !1,
        s = !1,
        o = this.getSocketUrl(e),
        u = new r(o);
        u.onopen = function() {
            i = !0,
            u.close(),
            t.call(n, !0),
            s = !0,
            u = null
        };
        var a = function() { ! s && !i && t.call(n, !1),
            s = !0
        };
        u.onclose = u.onerror = a,
        Faye.ENV.setTimeout(a, this.WEBSOCKET_TIMEOUT)
    }
}),
Faye.extend(Faye.Transport.WebSocket.prototype, Faye.Deferrable),
Faye.Transport.register("websocket", Faye.Transport.WebSocket),
Faye.Transport.EventSource = Faye.extend(Faye.Class(Faye.Transport, {
    initialize: function(e, t) {
        Faye.Transport.prototype.initialize.call(this, e, t),
        this._K = new Faye.Transport.XHR(e, t);
        var n = new EventSource(t + "/" + e.getClientId()),
        r = this;
        n.onopen = function() {
            r.trigger("up")
        },
        n.onerror = function() {
            r.trigger("down")
        },
        n.onmessage = function(e) {
            r.receive(JSON.parse(e.data))
        },
        this._4 = n
    },
    request: function(e, t) {
        this._K.request(e, t)
    },
    close: function() {
        this._4.close()
    }
}), {
    isUsable: function(e, t, n) {
        Faye.Transport.XHR.isUsable(e,
        function(e) {
            t.call(n, e && Faye.ENV.EventSource)
        })
    }
}),
Faye.Transport.register("eventsource", Faye.Transport.EventSource),
Faye.Transport.XHR = Faye.extend(Faye.Class(Faye.Transport, {
    request: function(e, t) {
        var n = this.retry(e, t),
        r = Faye.URI.parse(this._b).pathname,
        i = this,
        s = Faye.ENV.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest;
        s.open("POST", r, !0),
        s.setRequestHeader("Content-Type", "application/json"),
        s.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        var o = this.headers;
        for (var u in o) {
            if (!o.hasOwnProperty(u)) continue;
            s.setRequestHeader(u, o[u])
        }
        var a = function() {
            s.abort()
        };
        Faye.Event.on(Faye.ENV, "beforeunload", a);
        var f = function() {
            Faye.Event.detach(Faye.ENV, "beforeunload", a),
            s.onreadystatechange = function() {},
            s = null
        };
        s.onreadystatechange = function() {
            if (s.readyState !== 4) return;
            var e = null,
            t = s.status,
            r = t >= 200 && t < 300 || t === 304 || t === 1223;
            if (!r) return f(),
            n(),
            i.trigger("down");
            try {
                e = JSON.parse(s.responseText)
            } catch(o) {}
            f(),
            e ? (i.receive(e), i.trigger("up")) : (n(), i.trigger("down"))
        },
        s.send(Faye.toJSON(e))
    }
}), {
    isUsable: function(e, t, n) {
        t.call(n, Faye.URI.parse(e).isLocal())
    }
}),
Faye.Transport.register("long-polling", Faye.Transport.XHR),
Faye.Transport.CORS = Faye.extend(Faye.Class(Faye.Transport, {
    request: function(e, t) {
        var n = Faye.ENV.XDomainRequest ? XDomainRequest: XMLHttpRequest,
        r = new n,
        i = this.retry(e, t),
        s = this;
        r.open("POST", this._b, !0);
        var o = function() {
            return r ? (r.onload = r.onerror = r.ontimeout = r.onprogress = null, r = null, Faye.ENV.clearTimeout(a), !0) : !1
        };
        r.onload = function() {
            var e = null;
            try {
                e = JSON.parse(r.responseText)
            } catch(t) {}
            o(),
            e ? (s.receive(e), s.trigger("up")) : (i(), s.trigger("down"))
        };
        var u = function() {
            o(),
            i(),
            s.trigger("down")
        },
        a = Faye.ENV.setTimeout(u, 1500 * t);
        r.onerror = u,
        r.ontimeout = u,
        r.onprogress = function() {},
        r.send("message=" + encodeURIComponent(Faye.toJSON(e)))
    }
}), {
    isUsable: function(e, t, n) {
        if (Faye.URI.parse(e).isLocal()) return t.call(n, !1);
        if (Faye.ENV.XDomainRequest) return t.call(n, !0);
        if (Faye.ENV.XMLHttpRequest) {
            var r = new Faye.ENV.XMLHttpRequest;
            return t.call(n, r.withCredentials !== undefined)
        }
        return t.call(n, !1)
    }
}),
Faye.Transport.register("cross-origin-long-polling", Faye.Transport.CORS),
Faye.Transport.JSONP = Faye.extend(Faye.Class(Faye.Transport, {
    request: function(e, t) {
        var n = {
            message: Faye.toJSON(e)
        },
        r = document.getElementsByTagName("head")[0],
        i = document.createElement("script"),
        s = Faye.Transport.JSONP.getCallbackName(),
        o = Faye.URI.parse(this._b, n),
        u = this.retry(e, t),
        a = this;
        Faye.ENV[s] = function(e) {
            l(),
            a.receive(e),
            a.trigger("up")
        };
        var f = Faye.ENV.setTimeout(function() {
            l(),
            u(),
            a.trigger("down")
        },
        1500 * t),
        l = function() {
            if (!Faye.ENV[s]) return ! 1;
            Faye.ENV[s] = undefined;
            try {
                delete Faye.ENV[s]
            } catch(e) {}
            return Faye.ENV.clearTimeout(f),
            i.parentNode.removeChild(i),
            !0
        };
        o.params.jsonp = s,
        i.type = "text/javascript",
        i.src = o.toURL(),
        r.appendChild(i)
    }
}), {
    _D: 0,
    getCallbackName: function() {
        return this._D += 1,
        "__jsonp" + this._D + "__"
    },
    isUsable: function(e, t, n) {
        t.call(n, !0)
    }
}),
Faye.Transport.register("callback-polling", Faye.Transport.JSONP),
function() {
    this.FormStorage = {
        key: function(e) {
            return "" + location.pathname + " " + location.hash + " " + $(e).prop("id")
        },
        key_backup: function(e) {
            return "/p/new #restore " + $(e).prop("id")
        },
        init: function() {
            if (window.localStorage) return $(document).on("input", "textarea[name*=body]",
            function() {
                var e;
                return e = $(this),
                localStorage.setItem(FormStorage.key(e), e.val()),
                localStorage.setItem(FormStorage.key_backup(e), e.val())
            }),
            $(document).on("submit", "form",
            function() {
                var e;
                return e = $(this),
                e.find("textarea[name*=body]").each(function() {
                    return localStorage.removeItem(FormStorage.key(this))
                })
            }),
            $(document).on("click", "form a.reset",
            function() {
                var e, t;
                t = confirm("Clean UP? No way back!!!");
                if (t) return e = $(this).closest("form"),
                e[0].reset(),
                e.find("textarea[name*=body]").each(function() {
                    return localStorage.removeItem(FormStorage.key(this))
                })
            })
        },
        restore: function() {
            if (window.localStorage) return $("textarea[name*=body]").each(function() {
                var e, t;
                e = $(this);
                if (t = localStorage.getItem(FormStorage.key(e))) return e.val(t)
            })
        }
    }
}.call(this),
function() {
    var e;
    window.App = {
        notifier: null,
        likeable: function(e) {
            var t, n, r, i;
            return t = $(e),
            r = t.data("type"),
            n = t.data("id"),
            i = parseInt(t.data("count")),
            t.data("state") !== "liked" ? ($.ajax({
                url: _mobantu.templateurl + '/functions/likes.php?id=' + n,
				type: 'GET',
				dataType: 'html',
				timeout: 9000,
				error: function() {},
				success: function(data) {
					if (data == "2") {
						$(e).attr("data-count", i+1);
					}
				}
            }), App.likeableAsLiked(e)) : ($.ajax({
                url: _mobantu.templateurl + '/functions/likes.php?idx=' + n,
				type: 'GET',
				dataType: 'html',
				timeout: 9000,
				error: function() {},
				success: function(data) {
					if (data == "2") {
						$(e).attr("data-count", i-1);
					}
				}
            }), App.unlikeableAsLiked(e))
        },
        likeableAsLiked: function(e) {
            var t;
            return t = $(e).data("count"),
            $(e).attr("data-state", "liked"),$(e).attr("title", "取消喜欢"),
            $("span", e).text("" + (Number(t)+1)),
            $("i.icon", e).attr("class", "icon icon-heart active")
        },
		unlikeableAsLiked: function(e) {
            var t;
            return t = $(e).data("count"),
            $(e).attr("data-state", ""),$(e).attr("title", ""),
            $("span", e).text("" + (Number(t)-1)),
            $("i.icon", e).attr("class", "icon icon-heart")
        },
        atReplyable: function(e, t) {
            if (t.length === 0) return;
            return $(e).atWho("@", {
                data: t,
                tpl: "<li data-value='${login}'>${name} <small>${login}</small></li>"
            })
        },
        initForDesktopView: function() {
            var e, t;
            if (typeof app_mobile != "undefined") return;
            return t = [],
            e = [],
            $(".cell_comments .comment .info .name a").each(function(n) {
                var r;
                r = {
                    name: $(this).text(),
                    login: $(this).data("name")
                };
                if ($.inArray(r.login, e) < 0) return t.push(r),
                e.push(r.login)
            }),
            App.atReplyable(".cell_comments_new textarea", t)
        },
        initNotificationSubscribe: function() {
            var e, t;
            return e = new Faye.Client(FAYE_SERVER_URL),
            t = e.subscribe("/notifications_count/" + CURRENT_USER_ACCESS_TOKEN,
            function(e) {
                var t, n, r;
                return n = $("#user_notifications_count span"),
                t = $(document).attr("title").replace(/\(\d+\) /, ""),
                e.count > 0 ? (n.addClass("badge-error"), t = "(" + e.count + ") " + t, r = App.fixUrlDash("" + ROOT_URL + e.content_path), console.log(r), $.notifier.notify("", e.title, e.content, r)) : n.removeClass("badge-error"),
                n.text(e.count),
                $(document).attr("title", t)
            }),
            !0
        }
    },
    e = function() {
        return App.initForDesktopView(),
        FormStorage.restore(),
        $("abbr.timeago").timeago(),
        typeof FAYE_SERVER_URL != "undefined" && FAYE_SERVER_URL !== null && typeof CURRENT_USER_ACCESS_TOKEN != "undefined" && CURRENT_USER_ACCESS_TOKEN !== null && App.initNotificationSubscribe(),
        $("*[data-card]").bind("hover",
        function() {
            var e;
            return e = $(this),
            e.unbind("hover"),
            $.get(e.data("card"),
            function(t) {
                return e.popover({
                    content: t
                }).popover({
                    trigger: "hover",
                    delay: 1e3
                })
            })
        }),
        $(".comment").hover(function() {
            return $(this).addClass("active")
        },
        function() {
            return $(this).removeClass("active")
        }),
        $(".cell_comments_new textarea").bind("keydown", "ctrl+return",
        function(e) {
            return $(e.target).val().trim().length > 0 && $(e.target).parent().parent().submit(),
            !1
        }),
        $("a.go_top").click(function() {
            return $("html, body").animate({
                scrollTop: 0
            },
            300),
            !1
        }),
        $(window).bind("scroll resize",
        function() {
            var e;
            return e = $(window).scrollTop(),
            e >= 1500 ? $("a.go_top").removeClass("hidden") : $("a.go_top").addClass("hidden")
        })
    },
    $(document).ready(e),
    FormStorage.init()
}.call(this);

/*$(function() {
	$(".menu-item-has-children > a").attr("href","javascript:;");
	
	$(".menu-item-has-children").click(function() {
		if($(this).hasClass("active"))
			$(this).removeClass("active");
		else
			$(this).addClass("active");					   
	});
	
	
});*/

$(function(){	
	$(window).scroll(function() {		
		if($(window).scrollTop() >= 100){ 
			$('.actGotop').fadeIn(300); 
		}else{    
			$('.actGotop').fadeOut(300); 
		}  
	});
	$('.actGotop').click(function(){$('html,body').animate({scrollTop: '0px'}, 800);}); 
});

$("#mbt-login").click(function () {
    $.post(
				_mobantu.login,
				{
				    log: $("#user_login").val(),
				    pwd: $("#user_pass").val(),
				    action: "mobantu_login",
				    redirect_to: $("#redirect_to").val(),
				    rememberme: $('#rememberme').val()
				},
				function (data) {
				    if (data != "1") {
				        $("#info_login").slideDown();
				        $("#info_login").text("用户名或密码错误,请重试");
				    }
				    else {
				        $("#info_login").slideDown();
				        $("#info_login").text("登陆成功，跳转中...");
				        location.reload();                     
                    }
				}
			);
});

$("#mbt-register").click(function () {
    $.post(
				_mobantu.login,
				{
				    user_register: $("#user_register").val(),
				    user_email: $("#user_email").val(),
				    password: $("#password").val(),
				    repeat_password: $("#repeat_password").val(),
				    redirect_to: $("#redirect_to").val(),
				    action: "mobantu_register"
				},
				function (data) {
				    if (data == "1") {
				        $("#info_register").slideDown();
				        $("#info_register").text("注册成功，正在登陆...");
						location.reload(); 
				    }
				    else {
				        $("#info_register").slideDown();
				        $("#info_register").text(data);
				    }
				}
			);
});
if(_mobantu.nav == 1){
var disScroll;
var lastScrollTop = 0;
var delat = 5;
var navHight = $('.header').outerHeight();
$(window).scroll(function(event){
    disScroll = true;
});
setInterval(function (){
    if(disScroll){
        hasScrolled();
        disScroll = false;
    }
},250);
function hasScrolled(){
    var st = $(this).scrollTop();
    var clientHeight =document.documentElement.clientHeight;
    if(Math.abs(st - lastScrollTop) <= delat){
        return;
    };
    if(st > navHight+120 && st > lastScrollTop){
        $('.header').removeClass('header-show').addClass('header-hide');
    }else{
    if(st + $(window).height() < $(document).height()){
        $('.header').removeClass('header-hide').addClass('header-show');
      }
    }
    lastScrollTop = st;
};
}
 
    var data_3 = [];
    var event_stack_3 = [];
    video_is_playing_3=false;
    data_3["0"]=[];data_3["0"]["id"]="0";data_3["0"]["image_url"]="http://source.indiegames.cn/wp-content/uploads/2017/09/2065043082.jpg";data_3["0"]["description"]="";data_3["0"]["alt"]="";data_3["1"]=[];data_3["1"]["id"]="1";data_3["1"]["image_url"]="http://source.indiegames.cn/wp-content/uploads/2017/08/第十届独立游戏大赛.jpg";data_3["1"]["description"]="";data_3["1"]["alt"]="";data_3["2"]=[];data_3["2"]["id"]="2";data_3["2"]["image_url"]="http://source.indiegames.cn/wp-content/uploads/2017/08/首发宣大图1000x500.jpg";data_3["2"]["description"]="";data_3["2"]["alt"]="";data_3["3"]=[];data_3["3"]["id"]="3";data_3["3"]["image_url"]="http://source.indiegames.cn/wp-content/uploads/2016/12/2.png";data_3["3"]["description"]="";data_3["3"]["alt"]="";
      var huge_it_trans_in_progress_3 = false;
      var huge_it_transition_duration_3 = 800;
      var huge_it_playInterval_3;
      window.clearInterval(huge_it_playInterval_3);
     var huge_it_current_key_3 = '';
     function huge_it_move_dots_3() {
        var image_left = jQuery(".huge_it_slideshow_dots_active_3").position().left;
        var image_right = jQuery(".huge_it_slideshow_dots_active_3").position().left + jQuery(".huge_it_slideshow_dots_active_3").outerWidth(true);
      }
      function huge_it_testBrowser_cssTransitions_3() {
        return huge_it_testDom_3('Transition');
      }
      function huge_it_testBrowser_cssTransforms3d_3() {
        return huge_it_testDom_3('Perspective');
      }
      function huge_it_testDom_3(prop) {
        var browserVendors = ['', '-webkit-', '-moz-', '-ms-', '-o-', '-khtml-'];
        var domPrefixes = ['', 'Webkit', 'Moz', 'ms', 'O', 'Khtml'];
        var i = domPrefixes.length;
        while (i--) {
          if (typeof document.body.style[domPrefixes[i] + prop] !== 'undefined') {
            return true;
          }
        }
        return false;
      }
        function huge_it_cube_3(tz, ntx, nty, nrx, nry, wrx, wry, current_image_class, next_image_class, direction) {
        if (!huge_it_testBrowser_cssTransitions_3()) {
            jQuery(".huge_it_slideshow_dots_3").removeClass("huge_it_slideshow_dots_active_3").addClass("huge_it_slideshow_dots_deactive_3");
        jQuery("#huge_it_dots_" + huge_it_current_key_3 + "_3").removeClass("huge_it_slideshow_dots_deactive_3").addClass("huge_it_slideshow_dots_active_3");
          return huge_it_fallback_3(current_image_class, next_image_class, direction);
        }
        if (!huge_it_testBrowser_cssTransforms3d_3()) {
          return huge_it_fallback3d_3(current_image_class, next_image_class, direction);
        }
          jQuery(current_image_class).css({'z-index': 'none'});
          jQuery(next_image_class).css({'z-index' : 2});
        huge_it_trans_in_progress_3 = true;
        jQuery(".huge_it_slideshow_dots_3").removeClass("huge_it_slideshow_dots_active_3").addClass("huge_it_slideshow_dots_deactive_3");
        jQuery("#huge_it_dots_" + huge_it_current_key_3 + "_3").removeClass("huge_it_slideshow_dots_deactive_3").addClass("huge_it_slideshow_dots_active_3");
        jQuery(".huge_it_slide_bg_3").css('perspective', 1000);
        jQuery(current_image_class).css({
          transform : 'translateZ(' + tz + 'px)',
          backfaceVisibility : 'hidden'
        });
         jQuery(".huge_it_slideshow_image_wrap_3,.huge_it_slide_bg_3,.huge_it_slideshow_image_item_3,.huge_it_slideshow_image_second_item_3 ").css('overflow', 'visible');
        jQuery(next_image_class).css({
          opacity : 1,
          filter: 'Alpha(opacity=100)',
          backfaceVisibility : 'hidden',
          transform : 'translateY(' + nty + 'px) translateX(' + ntx + 'px) rotateY('+ nry +'deg) rotateX('+ nrx +'deg)'
        });
        jQuery(".huge_it_slider_3").css({
          transform: 'translateZ(-' + tz + 'px)',
          transformStyle: 'preserve-3d'
        });
        setTimeout(function () {
          jQuery(".huge_it_slider_3").css({
            transition: 'all ' + huge_it_transition_duration_3 + 'ms ease-in-out',
            transform: 'translateZ(-' + tz + 'px) rotateX('+ wrx +'deg) rotateY('+ wry +'deg)'
          });
        }, 20);
        jQuery(".huge_it_slider_3").one('webkitTransitionEnd transitionend otransitionend oTransitionEnd mstransitionend', jQuery.proxy(huge_it_after_trans));
        function huge_it_after_trans() {
          jQuery(".huge_it_slide_bg_3,.huge_it_slideshow_image_item_3,.huge_it_slideshow_image_second_item_3 ").css('overflow', 'hidden');
          jQuery(".huge_it_slide_bg_3").removeAttr('style');
          jQuery(current_image_class).removeAttr('style');
          jQuery(next_image_class).removeAttr('style');
          jQuery(".huge_it_slider_3").removeAttr('style');
          jQuery(current_image_class).css({'opacity' : 0, filter: 'Alpha(opacity=0)', 'z-index': 1});
          jQuery(next_image_class).css({'opacity' : 1, filter: 'Alpha(opacity=100)', 'z-index' : 2});
          huge_it_trans_in_progress_3 = false;
          if (typeof event_stack_3 !== 'undefined' && event_stack_3.length > 0) {
            key = event_stack_3[0].split("-");
            event_stack_3.shift();
            huge_it_change_image_3(key[0], key[1], data_3, true,false);
          }
        }
      }
      function huge_it_cubeH_3(current_image_class, next_image_class, direction) {
        var dimension = jQuery(current_image_class).width() / 2;
        if (direction == 'right') {
          huge_it_cube_3(dimension, dimension, 0, 0, 90, 0, -90, current_image_class, next_image_class, direction);
        }
        else if (direction == 'left') {
          huge_it_cube_3(dimension, -dimension, 0, 0, -90, 0, 90, current_image_class, next_image_class, direction);
        }
      }
      function huge_it_cubeV_3(current_image_class, next_image_class, direction) {
        var dimension = jQuery(current_image_class).height() / 2;
        if (direction == 'right') {
          huge_it_cube_3(dimension, 0, -dimension, 90, 0, -90, 0, current_image_class, next_image_class, direction);
        }
        else if (direction == 'left') {
          huge_it_cube_3(dimension, 0, dimension, -90, 0, 90, 0, current_image_class, next_image_class, direction);
        }
      }
      function huge_it_fallback_3(current_image_class, next_image_class, direction) {
        huge_it_fade_3(current_image_class, next_image_class, direction);
      }
      function huge_it_fallback3d_3(current_image_class, next_image_class, direction) {
        huge_it_sliceV_3(current_image_class, next_image_class, direction);
      }
      function huge_it_none_3(current_image_class, next_image_class, direction) {
        jQuery(current_image_class).css({'opacity' : 0, 'z-index': 1});
        jQuery(next_image_class).css({'opacity' : 1, 'z-index' : 2});
        jQuery(".huge_it_slideshow_dots_3").removeClass("huge_it_slideshow_dots_active_3").addClass("huge_it_slideshow_dots_deactive_3");
        jQuery("#huge_it_dots_" + huge_it_current_key_3 + "_3").removeClass("huge_it_slideshow_dots_deactive_3").addClass("huge_it_slideshow_dots_active_3");
      }
      function huge_it_fade_3(current_image_class, next_image_class, direction) {
        if (huge_it_testBrowser_cssTransitions_3()) {
          jQuery(next_image_class).css('transition', 'opacity ' + huge_it_transition_duration_3 + 'ms linear');
          jQuery(current_image_class).css('transition', 'opacity ' + huge_it_transition_duration_3 + 'ms linear');
          jQuery(current_image_class).css({'opacity' : 0, 'z-index': 1});
          jQuery(next_image_class).css({'opacity' : 1, 'z-index' : 2});
        }
        else {
          jQuery(current_image_class).animate({'opacity' : 0, 'z-index' : 1}, huge_it_transition_duration_3);
          jQuery(next_image_class).animate({
              'opacity' : 1,
              'z-index': 2
            }, {
              duration: huge_it_transition_duration_3,
              complete: function () {return false;}
            });
          jQuery(current_image_class).fadeTo(huge_it_transition_duration_3, 0);
          jQuery(next_image_class).fadeTo(huge_it_transition_duration_3, 1);
        }
        jQuery(".huge_it_slideshow_dots_3").removeClass("huge_it_slideshow_dots_active_3").addClass("huge_it_slideshow_dots_deactive_3");
        jQuery("#huge_it_dots_" + huge_it_current_key_3 + "_3").removeClass("huge_it_slideshow_dots_deactive_3").addClass("huge_it_slideshow_dots_active_3");
      }
      function huge_it_grid_3(cols, rows, ro, tx, ty, sc, op, current_image_class, next_image_class, direction) {
        if (!huge_it_testBrowser_cssTransitions_3()) {
            jQuery(".huge_it_slideshow_dots_3").removeClass("huge_it_slideshow_dots_active_3").addClass("huge_it_slideshow_dots_deactive_3");
        jQuery("#huge_it_dots_" + huge_it_current_key_3 + "_3").removeClass("huge_it_slideshow_dots_deactive_3").addClass("huge_it_slideshow_dots_active_3");
          return huge_it_fallback_3(current_image_class, next_image_class, direction);
        }
        huge_it_trans_in_progress_3 = true;
        jQuery(".huge_it_slideshow_dots_3").removeClass("huge_it_slideshow_dots_active_3").addClass("huge_it_slideshow_dots_deactive_3");
        jQuery("#huge_it_dots_" + huge_it_current_key_3 + "_3").removeClass("huge_it_slideshow_dots_deactive_3").addClass("huge_it_slideshow_dots_active_3");
        var count = (huge_it_transition_duration_3) / (cols + rows);
        function huge_it_gridlet(width, height, top, img_top, left, img_left, src, imgWidth, imgHeight, c, r) {
          var delay = (c + r) * count;
          return jQuery('<div class="huge_it_gridlet_3" />').css({
            width : width,
            height : height,
            top : top,
            left : left,
            backgroundImage : 'url("' + src + '")',
            backgroundColor: jQuery(".huge_it_slideshow_image_wrap_3").css("background-color"),
            backgroundRepeat: 'no-repeat',
            backgroundPosition : img_left + 'px ' + img_top + 'px',
            backgroundSize : imgWidth + 'px ' + imgHeight + 'px',
            transition : 'all ' + huge_it_transition_duration_3 + 'ms ease-in-out ' + delay + 'ms',
            transform : 'none'
          });
        }
        var cur_img = jQuery(current_image_class).find('img');
        var grid = jQuery('<div />').addClass('huge_it_grid_3');
        jQuery(current_image_class).prepend(grid);
        var cont = jQuery(".huge_it_slide_bg_3");
        var imgWidth = cur_img.width();
        var imgHeight = cur_img.height();
        var contWidth = cont.width(),
            contHeight = cont.height(),
            imgSrc = cur_img.attr('src'),
            colWidth = Math.floor(contWidth / cols),
            rowHeight = Math.floor(contHeight / rows),
            colRemainder = contWidth - (cols * colWidth),
            colAdd = Math.ceil(colRemainder / cols),
            rowRemainder = contHeight - (rows * rowHeight),
            rowAdd = Math.ceil(rowRemainder / rows),
            leftDist = 0,
            img_leftDist = (jQuery(".huge_it_slide_bg_3").width() - cur_img.width()) / 2;
        tx = tx === 'auto' ? contWidth : tx;
        tx = tx === 'min-auto' ? - contWidth : tx;
        ty = ty === 'auto' ? contHeight : ty;
        ty = ty === 'min-auto' ? - contHeight : ty;
        for (var i = 0; i < cols; i++) {
          var topDist = 0,
              img_topDst = (jQuery(".huge_it_slide_bg_3").height() - cur_img.height()) / 2,
              newColWidth = colWidth;
          if (colRemainder > 0) {
            var add = colRemainder >= colAdd ? colAdd : colRemainder;
            newColWidth += add;
            colRemainder -= add;
          }
          for (var j = 0; j < rows; j++)  {
            var newRowHeight = rowHeight,
                newRowRemainder = rowRemainder;
            if (newRowRemainder > 0) {
              add = newRowRemainder >= rowAdd ? rowAdd : rowRemainder;
              newRowHeight += add;
              newRowRemainder -= add;
            }
            grid.append(huge_it_gridlet(newColWidth, newRowHeight, topDist, img_topDst, leftDist, img_leftDist, imgSrc, imgWidth, imgHeight, i, j));
            topDist += newRowHeight;
            img_topDst -= newRowHeight;
          }
          img_leftDist -= newColWidth;
          leftDist += newColWidth;
        }
        var last_gridlet = grid.children().last();
        grid.show();
        cur_img.css('opacity', 0);
        grid.children().first().addClass('rs-top-left');
        grid.children().last().addClass('rs-bottom-right');
        grid.children().eq(rows - 1).addClass('rs-bottom-left');
        grid.children().eq(- rows).addClass('rs-top-right');
        setTimeout(function () {
          grid.children().css({
            opacity: op,
            transform: 'rotate('+ ro +'deg) translateX('+ tx +'px) translateY('+ ty +'px) scale('+ sc +')'
          });
        }, 1);
        jQuery(next_image_class).css('opacity', 1);
        jQuery(last_gridlet).one('webkitTransitionEnd transitionend otransitionend oTransitionEnd mstransitionend', jQuery.proxy(huge_it_after_trans));
        function huge_it_after_trans() {
          jQuery(current_image_class).css({'opacity' : 0, 'z-index': 1});
          jQuery(next_image_class).css({'opacity' : 1, 'z-index' : 2});
          cur_img.css('opacity', 1);
          grid.remove();
          huge_it_trans_in_progress_3 = false;
          if (typeof event_stack_3 !== 'undefined' && event_stack_3.length > 0) {
            key = event_stack_3[0].split("-");
            event_stack_3.shift();
            huge_it_change_image_3(key[0], key[1], data_3, true,false);
          }
        }
      }
      function huge_it_sliceH_3(current_image_class, next_image_class, direction) {
        if (direction == 'right') {
          var translateX = 'min-auto';
        }
        else if (direction == 'left') {
          var translateX = 'auto';
        }
        huge_it_grid_3(1, 8, 0, translateX, 0, 1, 0, current_image_class, next_image_class, direction);
      }
      function huge_it_sliceV_3(current_image_class, next_image_class, direction) {
        if (direction == 'right') {
          var translateY = 'min-auto';
        }
        else if (direction == 'left') {
          var translateY = 'auto';
        }
        huge_it_grid_3(10, 1, 0, 0, translateY, 1, 0, current_image_class, next_image_class, direction);
      }
      function huge_it_slideV_3(current_image_class, next_image_class, direction) {
        if (direction == 'right') {
          var translateY = 'auto';
        }
        else if (direction == 'left') {
          var translateY = 'min-auto';
        }
        huge_it_grid_3(1, 1, 0, 0, translateY, 1, 1, current_image_class, next_image_class, direction);
      }
      function huge_it_slideH_3(current_image_class, next_image_class, direction) {
        if (direction == 'right') {
          var translateX = 'min-auto';
        }
        else if (direction == 'left') {
          var translateX = 'auto';
        }
        huge_it_grid_3(1, 1, 0, translateX, 0, 1, 1, current_image_class, next_image_class, direction);
      }
      function huge_it_scaleOut_3(current_image_class, next_image_class, direction) {
        huge_it_grid_3(1, 1, 0, 0, 0, 1.5, 0, current_image_class, next_image_class, direction);
      }
      function huge_it_scaleIn_3(current_image_class, next_image_class, direction) {
        huge_it_grid_3(1, 1, 0, 0, 0, 0.5, 0, current_image_class, next_image_class, direction);
      }
      function huge_it_blockScale_3(current_image_class, next_image_class, direction) {
        huge_it_grid_3(8, 6, 0, 0, 0, .6, 0, current_image_class, next_image_class, direction);
      }
      function huge_it_kaleidoscope_3(current_image_class, next_image_class, direction) {
        huge_it_grid_3(10, 8, 0, 0, 0, 1, 0, current_image_class, next_image_class, direction);
      }
      function huge_it_fan_3(current_image_class, next_image_class, direction) {
        if (direction == 'right') {
          var rotate = 45;
          var translateX = 100;
        }
        else if (direction == 'left') {
          var rotate = -45;
          var translateX = -100;
        }
        huge_it_grid_3(1, 10, rotate, translateX, 0, 1, 0, current_image_class, next_image_class, direction);
      }
      function huge_it_blindV_3(current_image_class, next_image_class, direction) {
        huge_it_grid_3(1, 8, 0, 0, 0, .7, 0, current_image_class, next_image_class);
      }
      function huge_it_blindH_3(current_image_class, next_image_class, direction) {
        huge_it_grid_3(10, 1, 0, 0, 0, .7, 0, current_image_class, next_image_class);
      }
      function huge_it_random_3(current_image_class, next_image_class, direction) {
        var anims = ['sliceH', 'sliceV', 'slideH', 'slideV', 'scaleOut', 'scaleIn', 'blockScale', 'kaleidoscope', 'fan', 'blindH', 'blindV'];
        this["huge_it_" + anims[Math.floor(Math.random() * anims.length)] + "_3"](current_image_class, next_image_class, direction);
      }
      function iterator_3() {
        var iterator = 1;
        return iterator;
     }
     function huge_it_change_image_3(current_key, key, data_3, from_effect,clicked) {
        if (data_3[key]) {
            if(video_is_playing_3 && !clicked){
                return false;
            }
          if (!from_effect) {
            jQuery("#huge_it_current_image_key_3").val(key);
                current_key = jQuery(".huge_it_slideshow_dots_active_3").attr("data-image_key");
          }
          if (huge_it_trans_in_progress_3) {
            event_stack_3.push(current_key + '-' + key);
            return;
          }
          var direction = 'right';
          if (huge_it_current_key_3 > key) {
            var direction = 'left';
          }
          else if (huge_it_current_key_3 == key) {
            return false;
          }
          huge_it_current_key_3 = key;
          jQuery("#huge_it_slideshow_image_3").attr('data-image_id', data_3[key]["id"]);
          jQuery(".huge_it_slideshow_title_text_3").html(data_3[key]["alt"]);
          jQuery(".huge_it_slideshow_description_text_3").html(data_3[key]["description"]);
          var current_image_class = "#image_id_3_" + data_3[current_key]["id"];
          var next_image_class = "#image_id_3_" + data_3[key]["id"];
         if(jQuery(current_image_class).find('.huge_it_video_frame_3').length>0) {
            var streffect='random';
            if(streffect=="cubeV" || streffect=="cubeH" || streffect=="none" || streffect=="fade"){
                huge_it_random_3(current_image_class, next_image_class, direction);
            }else{
                huge_it_fade_3(current_image_class, next_image_class, direction);
            }
          }else{
                huge_it_random_3(current_image_class, next_image_class, direction);
          }
        jQuery('.huge_it_slideshow_title_text_3').removeClass('none');
        if(jQuery('.huge_it_slideshow_title_text_3').html()==""){jQuery('.huge_it_slideshow_title_text_3').addClass('none');}
        jQuery('.huge_it_slideshow_description_text_3').removeClass('none');
        if(jQuery('.huge_it_slideshow_description_text_3').html()==""){jQuery('.huge_it_slideshow_description_text_3').addClass('none');}
          jQuery(current_image_class).find('.huge_it_slideshow_title_text_3').addClass('none');
          jQuery(current_image_class).find('.huge_it_slideshow_description_text_3').addClass('none');
             huge_it_move_dots_3();
                        window.clearInterval(huge_it_playInterval_3);
            play_3();
        }
      }
      function huge_it_popup_resize_3() {
        var staticsliderwidth=880;
        var sliderwidth=880;
        var bodyWidth=jQuery(window).width();
        var parentWidth = jQuery(".huge_it_slideshow_image_wrap_3").parent().width();
        if(sliderwidth>parentWidth){sliderwidth=parentWidth;}
        if(sliderwidth>bodyWidth){sliderwidth=bodyWidth;}
        var str=(440/staticsliderwidth);
        jQuery(".huge_it_slideshow_image_wrap_3").css({width: (sliderwidth)});
        jQuery(".huge_it_slideshow_image_wrap_3").css({height: ((sliderwidth) * str)});
        jQuery(".huge_it_slideshow_image_container_3").css({width: (sliderwidth)});
        jQuery(".huge_it_slideshow_image_container_3").css({height: ((sliderwidth) * str)});
        if("middle"=="middle"){var titlemargintopminus=jQuery(".huge_it_slideshow_title_text_3").outerHeight()/2;}
        if("right"=="center"){var titlemarginleftminus=jQuery(".huge_it_slideshow_title_text_3").outerWidth()/2;}
        jQuery(".huge_it_slideshow_title_text_3").css({cssText: "margin-top:-" + titlemargintopminus + "px; margin-left:-"+titlemarginleftminus+"px;"});
        if("bottom"=="middle"){var descriptionmargintopminus=jQuery(".huge_it_slideshow_description_text_3").outerHeight()/2;}
        if("right"=="center"){var descriptionmarginleftminus=jQuery(".huge_it_slideshow_description_text_3").outerWidth()/2;}
        jQuery(".huge_it_slideshow_description_text_3").css({cssText: "margin-top:-" + descriptionmargintopminus + "px; margin-left:-"+descriptionmarginleftminus+"px;"});
                jQuery("#huge_it_loading_image_3").css({display: "none"});
                jQuery(".huge_it_slideshow_image_wrap1_3").css({display: "block"});
                jQuery(".huge_it_slideshow_image_wrap_3").removeClass("nocolor");
        if("resize"=="resize"){
            jQuery(".huge_it_slideshow_image_3,  .huge_it_slideshow_image_container_3 img").css({
                cssText: "width:" + sliderwidth + "px; height:" + ((sliderwidth) * str) +"px;"
            });
        }else {
            jQuery(".huge_it_slideshow_image_3,.huge_it_slideshow_image_item2_3").css({
            cssText: "max-width: " + sliderwidth + "px !important; max-height: " + (sliderwidth * str) + "px !important;"
          });
        }
        jQuery('.huge_it_video_frame_3').each(function (e) {
          jQuery(this).width(sliderwidth);
          jQuery(this).height(sliderwidth * str);
        });
      }
      jQuery(window).load(function () {
        jQuery(window).resize(function() {
            huge_it_popup_resize_3();
        });
        jQuery('#huge_it_slideshow_left_3').on('click',function(){
            huge_it_change_image_3(parseInt(jQuery('#huge_it_current_image_key_3').val()), (parseInt(jQuery('#huge_it_current_image_key_3').val()) - iterator_3()) >= 0 ? (parseInt(jQuery('#huge_it_current_image_key_3').val()) - iterator_3()) % data_3.length : data_3.length - 1, data_3,false,true);
            return false;
        });
        jQuery('#huge_it_slideshow_right_3').on('click',function(){
            huge_it_change_image_3(parseInt(jQuery('#huge_it_current_image_key_3').val()), (parseInt(jQuery('#huge_it_current_image_key_3').val()) + iterator_3()) % data_3.length, data_3,false,true);
            return false;
        });
        huge_it_popup_resize_3();
        /* Disable right click.*/
        jQuery('div[id^="huge_it_container"]').bind("contextmenu", function () {
          return false;
        });
        /*HOVER SLIDESHOW*/
        jQuery("#huge_it_slideshow_image_container_3, .huge_it_slideshow_image_container_3, .huge_it_slideshow_dots_container_3,#huge_it_slideshow_right_3,#huge_it_slideshow_left_3").hover(function(){
            //errorlogjQuery(".huge_it_slideshow_image_wrap_3").after(" -- hover -- <br /> ");
            jQuery("#huge_it_slideshow_right_3").css({'display':'inline'});
            jQuery("#huge_it_slideshow_left_3").css({'display':'inline'});
        },function(){
            jQuery("#huge_it_slideshow_right_3").css({'display':'none'});
            jQuery("#huge_it_slideshow_left_3").css({'display':'none'});
        });
        var pausehover="on";
        if(pausehover=="on"){
            jQuery("#huge_it_slideshow_image_container_3, .huge_it_slideshow_image_container_3, .huge_it_slideshow_dots_container_3,#huge_it_slideshow_right_3,#huge_it_slideshow_left_3").hover(function(){
                window.clearInterval(huge_it_playInterval_3);
            },function(){
                window.clearInterval(huge_it_playInterval_3);
                play_3();
            });
        }
          play_3();
      });
      function play_3() {
        /* Play.*/
        //errorlogjQuery(".huge_it_slideshow_image_wrap_3").after(" -- paly  ---- ");
        huge_it_playInterval_3 = setInterval(function () {
            //errorlogjQuery(".huge_it_slideshow_image_wrap_3").after(" -- time left ---- ");
          var iterator = 1;
          huge_it_change_image_3(parseInt(jQuery('#huge_it_current_image_key_3').val()), (parseInt(jQuery('#huge_it_current_image_key_3').val()) + iterator) % data_3.length, data_3,false,false);
        }, '5800');
      }
      jQuery(window).focus(function() {
       /*event_stack_3 = [];*/
        var i_3 = 0;
        jQuery(".huge_it_slider_3").children("div").each(function () {
          if (jQuery(this).css('opacity') == 1) {
            jQuery("#huge_it_current_image_key_3").val(i_3);
          }
          i_3++;
        });
      });
      jQuery(window).blur(function() {
        event_stack_3 = [];
        window.clearInterval(huge_it_playInterval_3);
      });