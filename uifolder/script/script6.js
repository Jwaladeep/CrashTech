/*! scripts/antispam/client_profiling.js */ ! function(e, n, t, i) {
    i.CLP = n.View.extend({
        el: "body",
        initialize: function(n) {
            this.options = n || {}, this.url = n.url || !1, this.form_key = e("#tumblr_form_key").attr("content")
        },
        template: t.template('<iframe id="clp" class="clp" height="0" width="0" src="<%- this.url %>/?f=<%- this.form_key %>" style="border: 0; visibility: hidden; height: 0; width: 0; position: absolute; left: -10000px;"></iframe>'),
        render: function() {
            return this.rendered || (this.rendered = !0, this.$el.append(this.template())), this
        },
        rendered: !1
    })
}(jQuery, Backbone, _, Tumblr), /*! scripts/email_checker.js */
function(e, n) {
    var t = {
        dictionary: [],
        maxTransforms: 1,
        costMultiplier: 1,
        damerauLevenshteinDist: function(e, n, t) {
            if ("string" != typeof e || "string" != typeof n) return !1;
            "number" != typeof t && (t = 99);
            var i = 0,
                s = 0,
                a = 0,
                r = e.length,
                o = n.length;
            if (0 === r || 0 === o) return Math.abs(r - o) <= t && Math.max(r, o);
            if (r < o) {
                var u;
                u = r, r = o, o = u, u = e, e = n, n = u
            }
            var c = [];
            for (i = 0; i <= r; i++) c[i] = [], c[i][0] = i;
            for (s = 0; s <= o; s++) c[0][s] = s;
            for (i = 1; i <= r; i++)
                for (s = 1; s <= o; s++) a = e[i - 1] == n[s - 1] ? 0 : 1, c[i][s] = Math.min(c[i - 1][s] + 1, c[i][s - 1] + 1, c[i - 1][s - 1] + a), 1 != i && 1 != s && e[i - 1] == n[s - 2] && e[i - 2] == n[s - 1] && (c[i][s] = Math.min(c[i][s], c[i - 2][s - 2] + a));
            return c[r][o] <= t && c[r][o]
        },
        returnFunc: function(e, n) {
            return e.name
        },
        suggest: function(n) {
            var t = [],
                i = 0,
                s = this.damerauLevenshteinDist,
                a = this.maxTransforms;
            this.returnFunc;
            return e.each(this.dictionary, function(e, r) {
                (i = s(n, r.name, a)) !== !1 && t.push({
                    name: r.name,
                    dist: i,
                    cost: r.cost
                })
            }), t.length ? e.map(t.sort(this.sortByFunc), this.returnFunc) : []
        },
        sortByFunc: function(e, n) {
            var t = e.dist + e.cost * this.costMultiplier,
                i = n.dist + n.cost * this.costMultiplier;
            return t - i
        },
        initialized: !1,
        init: function(n, t) {
            if (!(n instanceof Array)) return !1;
            var i, s = [];
            if (e.each(n, function(e, n) {
                    var t = typeof n;
                    "object" === t ? s.push(n) : "string" === t && s.push({
                        name: n,
                        cost: 0
                    })
                }), this.dictionary = s, "object" == typeof t)
                for (i in t) t.hasOwnProperty(i) && this.hasOwnProperty(i) && (this[i] = t[i]);
            return this.initialized = !0, this
        }
    };
    n.SpellChecker = t
}(jQuery, Tumblr), "undefined" != typeof Tumblr || (Tumblr = {}),
    function(e, n) {
        var t = Backbone.View.extend({
            initialize: function(e) {
                if (this.options = e || {}, !window.Recaptcha) {
                    var n = document.createElement("script");
                    n.src = "//www.google.com/recaptcha/api/js/recaptcha_ajax.js", n.onload = _.bind(this.setup_captcha, this);
                    var t = document.getElementsByTagName("script")[0];
                    t.parentNode.insertBefore(n, t)
                }
            },
            setup_captcha: function() {
                this.$captcha_input = e("#recaptcha_response_field"), this.$captcha_controls = e(".captcha_control"), this.$captcha_controls.on("click.recaptcha", _.bind(_.throttle(function(n) {
                    var t = e(n.target);
                    t.hasClass("audio") && this.audio(), t.hasClass("visual") && this.visual(), t.hasClass("refresh") && this.refresh()
                }, 1e3), this)), this.captcha_callback = this.options.callback || function() {}, this.captcha_callback()
            },
            audio: function() {
                window.Recaptcha.switch_type("audio"), this.update_placeholder()
            },
            visual: function() {
                window.Recaptcha.switch_type("image"), this.update_placeholder()
            },
            refresh: function() {
                window.Recaptcha.reload()
            },
            update_placeholder: function() {
                var e = "image" === window.Recaptcha.type ? this.$captcha_input.data("placeholder-visual") : this.$captcha_input.data("placeholder-audio");
                this.$captcha_input.attr({
                    placeholder: e
                })
            }
        });
        Tumblr.Recaptcha = t
    }(jQuery, Tumblr), "undefined" != typeof Tumblr || (Tumblr = {}),
    function(e, n) {
        var t, i = Backbone.View.extend({
            initialize: function(e) {
                this.options = e || {};
                var n = document.createElement("script");
                n.src = "//www.google.com/recaptcha/api.js?render=explicit&onload=onNocaptchaCallback", window.onNocaptchaCallback = _.bind(this.setup_captcha, this);
                var t = document.getElementsByTagName("script")[0];
                t.parentNode.insertBefore(n, t)
            },
            setup_captcha: function() {
                window.grecaptcha.render(this.options.target || "g-recaptcha", {
                    callback: this.options.callback || function() {},
                    theme: this.options.theme || "light",
                    type: this.options.type || "image",
                    sitekey: this.options.sitekey || e(".g-recaptcha").data("sitekey")
                }), Tumblr.Events && Tumblr.Events.on("abouttumblr:change", function(e) {
                    0 !== e && 5 !== e || window.grecaptcha.reset()
                })
            },
            refresh: function() {
                window.grecaptcha.reset()
            }
        });
        Tumblr.NoCaptcha = function(e) {
            return t || (t = new i(e)), t
        }
    }(jQuery, Tumblr), /*! scripts/tfa_code.js */
    function(e, n, t, i) {
        var s = t.View.extend({
            initialize: function(e) {
                this.options = e || {}
            },
            resend_token_sms: function(n, t) {
                var i = e("#tfa_sms_resend");
                i.addClass("animate"), e.ajax({
                    url: "/svc/tfa/resend_token_sms",
                    data: {
                        email: n,
                        tfa_form_key: t.val()
                    },
                    withFormKey: !0,
                    dataType: "json",
                    type: "POST"
                }).done(function(e) {
                    t.val(e.tfa_form_key)
                }).fail(function() {}).always(function() {
                    i.removeClass("animate")
                })
            }
        });
        Tumblr.TFACode = s
    }(jQuery, _, Backbone, Tumblr), /*! scripts/registration/username_suggester.js */
    function(e, n, t, i) {
        "use strict";
        i.UsernameSuggester = n.View.extend({
            el: "body",
            defaults: {
                username_input: "#signup_username"
            },
            events: {
                "click #suggested_usernames .popover_menu_item": "handle_click"
            },
            initialize: function(e) {
                this.options = e || {}, this.options = t.extend(this.defaults, this.options)
            },
            handle_click: function(n) {
                e(this.options.username_input).val(n.target.innerHTML).focus(), e("#used_suggestion").val(1), e("#used_auto_suggestion").val(0), e("#suggested_usernames_container").addClass("hidden")
            }
        })
    }(jQuery, Backbone, _, Tumblr), "undefined" != typeof Tumblr || (Tumblr = {}), Tumblr.RegistrationForm = function(e) {
        function n(n) {
            D.current_view = n, e("body").addClass("show_form").addClass(n), loading_next_page = !0, i(n), s(), H.track_event("update_view", n)
        }

        function t(n) {
            reset_form = void 0 === n, n = n || "show_form signup_get_started signup_determine signup_account signup_birthday signup_magiclink signup_magiclinkemail signup_register signup_login slow_motion now", e.each(n.split(/\s+/), function(n, t) {
                e("body").removeClass(t)
            }), e("#signup_button_signup").length && e("#signup_button_signup").removeClass("shallow").addClass("other_blue"), loading_next_page = !1, D.current_view = null, M = null, reset_form && d(), reset_form && H.track_event("reset_view")
        }

        function i(n) {
            var t, i = e("#" + n);
            e("#signup_forms_submit").removeClass("changed"), M = e("#" + n + " input"), L.attr("action", L.attr("data-secure-ajax-action"));
            var s = "signup_login" === n ? "signup_account" : n;
            if (e(".signup_forms_panel .signup_view:not(#" + s + ")").removeClass("active"), e(".signup_forms_submit span").removeClass("active"), "signup_login" === n ? e("#signup_account").addClass("active") : i.addClass("active"), e(".signup_forms_submit ." + n + "_btn").addClass("active"), o(), r(), R(n) && (u(), L.attr("action", L.attr("data-secure-action")), M = e('#signup_account input:not("#signup_username")'), e("#signup_button_signup").length && e("#signup_button_signup").addClass("shallow").removeClass("other_blue"), D.errors && (p(D.errors), D.errors = null), e("body").hasClass("has_login_captcha") ? (W(function() {
                    Tumblr.NoCaptcha({
                        target: "g-recaptcha",
                        sitekey: e(".g-recaptcha").data("sitekey")
                    })
                }, function() {
                    j(function() {
                        window.Recaptcha.create(e("#recaptcha_public_key").val(), "recaptcha_widget", {
                            theme: "custom",
                            custom_theme_widget: "recaptcha_widget",
                            callback: function() {
                                window.Recaptcha.focus_response_field, e("#signup_forms_panel").css("display", "none"), e("#signup_forms_panel").css("display", "block")
                            }
                        })
                    })
                }), Tumblr.Events.trigger("Kraken:loginregister:captchaShown"), e("#signup_password").focus(), e("#signup_username").prop("tabindex", "-1")) : e("body").hasClass("has_login_tfa") ? (setTimeout(function() {
                    e("#tfa_response_field").focus()
                }, 500), e("#tfa_sms_resend").click(function(e) {
                    e.preventDefault(), a()
                })) : e("body").hasClass("mobile_splash_active") || e("#signup_email").focus()), "signup_magiclink" == n && (e("body").removeClass("signup_determine"), Tumblr.Events.trigger("Kraken:MagicLink:LoginSuccess"), e(".signup_forms_submit").css("display", "none"), setTimeout(function() {
                    e("#signup_magiclink").focus()
                }, 50), e(".forgot_password_container").css("display", "none"), e(".magiclink_password_container").css("display", "inline-block"), e(".magiclink_password_container").off("click").click(w), e(".magiclink_send_magic_link").off("click").click(w), e(".email_user").html(e("#signup_determine_email").val()), e(".input_email").val(e("#signup_determine_email").val()), 0 !== e(".signup_forms_container").find(".magiclink").length && e(".signup_forms_container").css("background", "transparent"), e(".back_container").off("click").click(w)), "signup_magiclinkemail" == n && (e(".signup_forms_submit").css("display", "none"), e(".forgot_password_container").css("display", "none"), e("body").removeClass("signup_determine signup_magiclink"), Tumblr.Events.trigger("Kraken:MagicLink:SendSuccess"), setTimeout(function() {
                    e("#signup_magiclinkemail").focus()
                }, 50), e(".magiclink_password_container").css("display", "inline-block").off("click").click(w), e(".magiclink_send_magic_link").off("click").click(w), e(".email_user").html(e("#signup_determine_email").val()), e(".input_email").val(e("#signup_determine_email").val()), 0 !== e(".signup_forms_container").find(".magiclink").length && e(".signup_forms_container").css("background", "transparent"), e(".back_container").off("click").click(w)), "signup_login" == n && (e(".forgot_password_container").css("display", "inline-block"), e("body").hasClass("signup_determine") && (!e("#signup_password").val() && e("#signup_password_hidden").val() && e("#signup_password").val(e("#signup_password_hidden").val()), e("#signup_email").val(e("#signup_determine_email").val()), e("#signup_email").attr("readonly", "readonly"), e("#signup_password").focus())), "signup_account" == n && (e("body").hasClass("mobile_splash_active") || e("#signup_email").focus(), e("body").hasClass("signup_determine") && (e("#signup_email").val(e("#signup_determine_email").val()), e("#signup_email").attr("readonly", "readonly"), e("#signup_password").focus()), J && (q ? q.update() : q = new Tumblr.PasswordStrengthMeter), i.keydown(function(n) {
                    t = e(n.target), t.hasClass("signup_username") && (e("#used_suggestion").val(0), e("#used_auto_suggestion").val(0))
                }), Tumblr.Flags.bool("show_random_username_suggestions"))) {
                var _;
                try {
                    _ = JSON.parse(e("#random_username_suggestions").val())
                } catch (g) {
                    _ = !1
                }
                _ && (e("#signup_username").on("focus", function() {
                    e(this).val() || l(_, Tumblr.Flags.bool("autopopulate_username_suggestion"))
                }), e(".signup_username").on("keyup", function() {
                    e(".signup_username_checkmark").toggle(_.indexOf(e(this).val()) > -1)
                }))
            }
            "signup_birthday" == n ? (setTimeout(function() {
                e("#signup_age").focus()
            }, 500), c(e("#signup_age")), i.keyup(function(n) {
                t = e(n.target), t.hasClass("signup_age") && c(t)
            }), i.keydown(function(n) {
                t = e(n.target), t.hasClass("signup_age") && c(t)
            }), i.keypress(function(n) {
                t = e(n.target), t.hasClass("signup_age") && c(t)
            }), e(".signup_terms_link").attr("tabindex", 0)) : e(".signup_terms_link").attr("tabindex", -1), "signup_register" == n && W(function() {
                Tumblr.NoCaptcha({
                    target: "g-recaptcha",
                    sitekey: e(".g-recaptcha").data("sitekey"),
                    callback: w
                })
            }, function() {
                j(function() {
                    window.Recaptcha.create(e("#recaptcha_public_key").val(), "recaptcha_widget", {
                        theme: "custom",
                        custom_theme_widget: "recaptcha_widget",
                        callback: function() {
                            window.Recaptcha.focus_response_field, e("#signup_forms_panel").css("display", "none"), e("#signup_forms_panel").css("display", "block")
                        }
                    }), Tumblr.Events.trigger("Kraken:loginregister:captchaShown")
                }), i.keyup(function() {
                    e("#signup_forms_submit").addClass("changed")
                })
            }), "signup_determine" == n && (e("body").hasClass("mobile_splash_active") || e("body").hasClass("is_mobile_handset") || setTimeout(function() {
                e("#signup_determine_email").focus()
            }, 1e3)), "signup_determine" == n && e("body").hasClass("error_auth_bad_token") ? setTimeout(function() {
                p([__("Link expired. Please login again.")])
            }, 500) : e("body").hasClass("error_auth_rate_limit") ? setTimeout(function() {
                p([__("Thanks for testing our system. Please wait a minute before logging in again.")])
            }, 500) : e("body").hasClass("error_auth_unkown") && setTimeout(function() {
                p([__("Something went wrong. Please try logging in again.")])
            }, 500)
        }

        function s() {
            e("body").hasClass("signup_account") ? e(".signup_link.login-button").attr("tabindex", 2) : e("body").hasClass("signup_get_started") ? (e(".logo_anchor").attr("tabindex", -1), e(".signup_forms_submit_helper").attr("tabindex", -1)) : e("body").hasClass("signup_determine") && (e(".logo_anchor").attr("tabindex", -1), e(".signup_forms_submit_helper").attr("tabindex", -1), e(".signup_link.signup-button").attr("tabindex", 2))
        }

        function a() {
            G || (G = new Tumblr.TFACode), G.resend_token_sms(e("#signup_email").val(), e("#tfa_form_key"))
        }

        function r() {
            e("#" + D.current_view + " input").each(function(n) {
                e(this).removeAttr("disabled")
            })
        }

        function o() {
            e("#signup_form .form_row input").each(function(n) {
                e(this).attr("disabled", "disabled")
            })
        }

        function u() {
            e("#signup_form .form_row input").each(function(n) {
                e(this).removeAttr("disabled")
            })
        }

        function c(n) {
            label = e("label[for='" + n.attr("id") + "']"), slug = label.children().first(), slug.text(n.val()), "" === n.val() ? (n.addClass("is_empty"), label.addClass("is_empty")) : (n.removeClass("is_empty"), label.removeClass("is_empty"))
        }

        function l(n, t) {
            var i = e("#suggested_usernames"),
                s = e("#suggested_usernames_container"),
                a = (e("#suggested_usernames_container .username_note"), e("#suggested_usernames_container .popover_inner"), n.length);
            t = t || !1, t === !0 && (e(".signup_username").val(n[0]), e(".signup_username_checkmark").show(), e("#used_auto_suggestion").val(1)), i.html("");
            for (var r = 0; r < a; r++) {
                var o = e("<li></li>");
                o.attr("class", "popover_menu_item"), o.attr("tabindex", 0), o.html(n[r]), i.append(o)
            }
            s.removeClass("hidden"), B = new Tumblr.Popover({
                el: "#suggested_usernames_container",
                direction: "left",
                skip_glass: !0
            }), B.show(), new Tumblr.UsernameSuggester, e("#seen_suggestion")[0].value++
        }

        function g(n) {
            var t, i, s = e("#signup_form_errors"),
                a = n.length;
            for (s.html(""), i = a - 1; i >= 0; i--) {
                t = e("<li></li>"), t.attr("class", "error"), t.html(n[i]), s.append(t);
                var r = n[i].replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, "");
                H.track_event("error", r)
            }
        }

        function p(n) {
            n && n.length && (g(n), e("#signup_forms").addClass("has_errors")), W(function() {
                window.grecaptcha && (window.grecaptcha.reset(), Tumblr.Events.trigger("Kraken:loginregister:captchaShown"))
            }, function() {
                window.Recaptcha && (window.Recaptcha.reload(), Tumblr.Events.trigger("Kraken:loginregister:captchaShown"))
            }), V || e("#signup_forms_container").addClass("shake").addClass("animated");
            setTimeout(function() {
                e("#signup_forms_container").removeClass("shake")
            }, 500)
        }

        function d() {
            e("#signup_form")[0].reset(), m()
        }

        function m() {
            e("#signup_forms_container").removeClass("shake"), e("#signup_forms").removeClass("has_errors")
        }

        function h() {
            var n, t, i, s = M.length,
                a = [];
            for (i = s - 1; i >= 0; i--)
                if (n = M[i], ("" === n.value || "checkbox" == n.type && n.checked === !1) && e(n).attr("data-required")) {
                    switch (n.id) {
                        case "signup_email":
                            t = S(["Don't forget your email address!", "You forgot to enter your email address!"]);
                            break;
                        case "signup_password":
                            t = S(["Don't forget your password!", "You forgot to enter your password!"]);
                            break;
                        case "signup_username":
                            t = S(["Don't forget your username!", "You forgot to enter your username!"]);
                            break;
                        case "signup_age":
                            t = S(["Don't forget to tell us your age!", "You forgot to tell us your age."]);
                            break;
                        case "signup_tos":
                            t = S(["One more thing &ndash; please accept our Terms!", "You must accept Tumblr's terms before proceeding."]);
                            break;
                        case "recaptcha_response_field":
                            t = S(["Don't forget to fill out the Captcha!", "Please fill out the Captcha."]);
                            break;
                        default:
                            t = S(["There was an error. Please try again.", "Oops. There was an error. Try again."])
                    }
                    a.push(__(t))
                }
            return !a.length || (p(a), !1)
        }

        function f(e) {
            return "signup_email" == e.attr("id") || "signup_determine_email" == e.attr("id")
        }

        function b(n) {
            if (R(D.current_view)) return !0;
            n = e(n);
            var t, i = [],
                s = n.val();
            if ("" !== s) {
                if (f(n) && !s.match(/\@ymail.com$/i)) {
                    var a, r, o, u, c, l;
                    Tumblr.SpellChecker.init(K, {
                        costMultiplier: .05
                    }), o = (r = s.match(/[^@]+$/)) ? r[0] : "", /\@/.test(s) ? s.toLowerCase().indexOf("@tumblr.com") != -1 ? t = S(["That email address is already in use. Please try again.", "That email address is already associated with another account."]) : !Z && (a = Tumblr.SpellChecker.suggest(o)).length && (c = s.split("@")[0] + "@" + a[0], c != s && (l = __("Oops. Did you mean %1$s ?"), email_placeholder = "%1$s", u = '<a href="#" id="' + n.attr("id") + '_suggestion">' + c + "</a>", t = l.replace(email_placeholder, u, "g"), Z = !0)) : t = "That's not a valid email address. Please try again."
                }
                if ("signup_password" == n.attr("id") && ("" == e.trim(s) && (t = "Don't forget your password!"), q && q.block_registration_step && (t = q.block_registration_step)), "signup_username" == n.attr("id") && (s.length > 0 && s.indexOf("-", s.length - 1) === s.length - 1 && (t = "Can't do dashes at the start or end. Middles only."), 0 === s.lastIndexOf("-", 0) && (t = "Can't do dashes at the start or end. Middles only."), s.toLowerCase().indexOf("tumblr") != -1 && (t = "Rule #14: You can't put Tumblr in your username.")), "signup_age" == n.attr("id")) {
                    var _ = parseInt(s),
                        g = new String(_),
                        d = s.replace(/^\s+|\s+$/g, "");
                    g != d ? t = "Please enter your age as a number only!" : _ < 1 && (t = "Please enter a number!")
                }
                t && i.push(__(t))
            }
            return i.length ? (p(i), !1) : (m(), !0)
        }

        function v() {
            for (var e = M.length - 1; e >= 0; e--)
                if (!b(M[e])) return !1;
            return h()
        }

        function k() {
            e(B).length && (e("#suggested_usernames_container").addClass("hidden"), e(B).hide())
        }

        function w(i) {
            if (!te) return !1;
            if (te = !1, m(), R(D.current_view)) return L.submit(), !0;
            if ("signup_magiclink" === D.current_view) {
                if (e(".signup_forms_container").css("background", "white"), e(".signup_forms_submit").css("display", "block"), e(".signup_forms_submit.mobile.login").css("display", "none"), e(".magiclink_password_container").css("display", "none"), e("body").removeClass("signup_determine"), "magiclink_send_magic_link chrome blue" == i.currentTarget.className) {
                    e("body").removeClass("signup_magiclinkemail signup_magiclink");
                    var s = L.serialize() + "&email=" + encodeURIComponent(e("#signup_determine_email").val());
                    e.ajax("/svc/login_link_send", {
                        type: "POST",
                        dataType: "json",
                        data: s
                    }), n("signup_magiclinkemail"), e("#signup_login_button").css("display", "none")
                } else "magiclink_password_container chrome" == i.currentTarget.className ? (e("body").removeClass("signup_magiclinkemail"), e("body").removeClass("signup_magiclink"), Tumblr.Events.trigger("Kraken:MagicLink:UsePasswordButtonPressed"), n("signup_login"), e("#signup_login_button").css("display", "none"), e("#signup_email").val(e("#signup_determine_email").val()), e("#signup_password").focus()) : "back_container" == i.currentTarget.className && (e("body").removeClass("signup_magiclinkemail"), e("body").removeClass("signup_magiclink"), Tumblr.Events.trigger("Kraken:MagicLink:BackButtonPressed"), n("signup_determine"), e("#signup_login_button").css("display", "none"));
                return void(te = !0)
            }
            return "signup_magiclinkemail" === D.current_view ? (e(".signup_forms_container").css("background", "white"), e(".signup_forms_submit").css("display", "block"), e(".signup_forms_submit.mobile.login").css("display", "none"), e(".magiclink_password_container").css("display", "none"), e("body").removeClass("signup_determine"), "magiclink_password_container chrome" == i.currentTarget.className ? (e("body").removeClass("signup_magiclinkemail"), e("body").removeClass("signup_magiclink"), Tumblr.Events.trigger("Kraken:MagicLink:UsePasswordButtonPressed"), n("signup_login"), e("#signup_login_button").css("display", "none")) : "back_container" == i.currentTarget.className && (e("body").removeClass("signup_magiclinkemail"), e("body").removeClass("signup_magiclink"), Tumblr.Events.trigger("Kraken:MagicLink:BackButtonPressed"), n("signup_determine"), e("#signup_login_button").css("display", "none")), void(te = !0)) : void("signup_account" !== D.current_view || L.find("#signup_username").val() || e("body").hasClass("openid_connect_registration") ? v() ? (k(), u(), s = L.serialize() + "&action=" + encodeURIComponent(D.current_view) + "&tracking_url=" + encodeURIComponent(Q) + "&tracking_version=" + encodeURIComponent(z), e.ajax(L.attr("action"), {
                type: "POST",
                dataType: "json",
                data: s,
                error: function(e, n, t) {
                    var i = e.responseJSON.errors;
                    try {
                        e = JSON.parse(e.responseText)
                    } catch (s) {
                        e = {}
                    }
                    i.forEach(function(n) {
                        1026 === n.code && (e.redirect = "/privacy/consent?redirect=/register&section=signup")
                    }), e.redirect ? (H.track_event("error", "redirect"), window.location.replace(e.redirect)) : (p(e.errors), e.usernames && setTimeout(function() {
                        V || l(e.usernames, Tumblr.Flags.bool("autopopulate_username_suggestion"))
                    }, 750)), "signup_register" == D.current_view && H.track_event("fail", U), te = !e.redirect
                },
                success: function(i) {
                    i.signup_success && (H.track_event("success", U), Tumblr.Events.trigger("Kraken:loginregister:flowComplete")), i.redirect ? "POST" === i.redirect_method ? (L.attr("action", i.redirect), L.submit()) : window.location.replace(i.redirect) : i.next_view ? ("signup_account" === i.next_view && t(), n(i.next_view)) : n(e("#" + D.current_view).next().attr("id")), te = !(i.redirect && "POST" === i.redirect_method)
                }
            })) : te = !0 : (L.prop("action", L.attr("data-secure-action")), L.submit()))
        }

        function y(e) {
            e.length && e.focus()
        }

        function C(n) {
            "signup_email_suggestion" == e(n.target).attr("id") && (e("#signup_email").val(e(n.target).html()), e("#signup_password").focus(), m(), n.preventDefault(), n.stopPropagation()), "signup_determine_email_suggestion" == e(n.target).attr("id") && (e("#signup_determine_email").val(e(n.target).html()), m(), n.preventDefault(), n.stopPropagation())
        }

        function T() {
            var n = e("body");
            n.hasClass("signup_get_started") ? Tumblr.RegistrationForm.update_view("signup_get_started") : n.hasClass("signup_magiclinkemail") ? Tumblr.RegistrationForm.update_view("signup_magiclinkemail") : n.hasClass("signup_magiclink") ? Tumblr.RegistrationForm.update_view("signup_magiclink") : n.hasClass("signup_determine") ? Tumblr.RegistrationForm.update_view("signup_determine") : n.hasClass("signup_login") ? Tumblr.RegistrationForm.update_view("signup_login") : n.hasClass("signup_account") ? Tumblr.RegistrationForm.update_view("signup_account") : n.hasClass("signup_birthday") && Tumblr.RegistrationForm.update_view("signup_birthday")
        }

        function x() {
            var n, t = e("#signup_subhead"),
                i = e("#signup_subhead_content");
            0 != t.length && (n = t.width(), i.width() > n && (t.addClass("medium"), setTimeout(function() {
                i.width() > n && (t.addClass("small").removeClass("medium"), setTimeout(function() {
                    i.width() > n && t.addClass("infinitesimal").removeClass("small")
                }, 0))
            }, 0)))
        }

        function P() {
            $ = e(".like_button, .reblog_button, .everyone_i_follow, .my_posts, .send_to_signup")
        }

        function R(e) {
            return "signup_login" === e
        }

        function S(e) {
            if (e.length) {
                var n = e.length,
                    t = Math.floor(Math.random() * n);
                return e[t]
            }
        }

        function j(e) {
            new Tumblr.Recaptcha({
                callback: e
            })
        }
        var B, E, F, M, N, O, L, D, K, $, z, Q, U, I, V, Y, A, q, J, H, G, W, X, Z = !1,
            ee = [],
            ne = ("https:" === document.location.protocol, ""),
            te = !0;
        return K = [{
            name: "gmail.com",
            cost: 0,
            share: 30.2102985741
        }, {
            name: "yahoo.com",
            cost: 0,
            share: 26.013029172
        }, {
            name: "hotmail.com",
            cost: 1,
            share: 18.1002246857
        }, {
            name: "aol.com",
            cost: 6,
            share: 3.03687405106
        }, {
            name: "live.com",
            cost: 9,
            share: 2.06294942827
        }, {
            name: "hotmail.co.uk",
            cost: 10,
            share: 1.95604539045
        }, {
            name: "aim.com",
            cost: 10,
            share: 1.89339378918
        }, {
            name: "mail.com",
            cost: 17,
            share: 1.2102985741
        }, {
            name: "ymail.com",
            cost: 18,
            share: 1.0549753888
        }, {
            name: "msn.com",
            cost: 32,
            share: .609550330148
        }], {
            initialize: function(t) {
                t = t || {}, ne = e("#tumblr_form_key").attr("content"), W = Tumblr.Flags("captcha_use_recaptcha2"), I = document.body.className.match("is_login_register"), I = !(!I || !I.length), Y = e(document.body).hasClass("is_tablet"), A = e(document.body).hasClass("is_mobile_handset"), V = Y || A, J = e(document.body).hasClass("show_password_strength"), L = e("#signup_form"), N = e("#signup_forms_submit"), O = e("#signup_login_button"), E = e(".signup_buttons .login_signup_button, #logo"), F = e(".signup_view"), signup_form_fields = e("#signup_form input"), D = this, z = "modal", Q = document.location.pathname, U = "?url=" + Q + "&version=" + z, P(), X = !1, t.clp_url && t.clp_url.length && Tumblr.CLP && (X = new Tumblr.CLP({
                    url: t.clp_url
                })), H = new Tumblr.OnboardingBehaviors, e(document).click(function(n) {
                    var t = e(n.target),
                        i = t.parents($.selector);
                    if (i.length) {
                        var s = document.getElementById("signup_button_signup");
                        s && s.click(), n.preventDefault(), n.stopPropagation()
                    }
                }), !I && L && (e(window).keydown(function(t) {
                    if (ee[t.keyCode] = 1, ee[16] && e("body").addClass("slow_motion"), ee[17] && ee[18] && ee[76]) return e("body").removeClass("slow_motion"), n("signup_login"), ee = [], !1
                }), e(window).keyup(function(n) {
                    if (ee[n.keyCode] = 0, 16 == n.keyCode && e("body").removeClass("slow_motion"), 27 == n.keyCode) {
                        if (e("body").hasClass("lite")) return;
                        e("body").hasClass("already_logged_in") && (window.location = "/dashboard")
                    }
                })), Tumblr.Events.on("MobileSplash:close", function() {
                    y(e("#signup_email"))
                }), L.length && (signup_form_fields.each(function(n) {
                    e(this).on("change", _.partial(b, this)), e(this).on("blur", function() {
                        X && !X.rendered && "signup_account" == D.current_view && X.render(), Tumblr.Events.trigger("Kraken:loginregister:beginFlow")
                    })
                }), L.on("keydown", function(e) {
                    13 == e.keyCode && (e.preventDefault(), e.stopPropagation(), w())
                }), e("#signup_form_errors").click(C), N.click(function() {
                    w()
                }), O.click(function() {
                    var e = "/login",
                        n = window.location.pathname.split("/");
                    n.length > 2 && "" === n[0] && "follow" === n[2] && (n[1] = "login", e = n.join("/")), window.location = e + window.location.search
                }), e("#signup_forms_container").scroll(function(n) {
                    e("#signup_forms_container").scrollLeft(0)
                }), T(), D.errors && (p(D.errors), D.errors = null)), x()
            },
            update_send_to_signup_links: P,
            reset_view: function() {
                t()
            },
            update_view: function(e) {
                t(), n(e)
            },
            current_view: null
        }
    }(jQuery), /*! scripts/registration/registration_behaviors.js */
    function(e, n) {
        var t = Backbone.View.extend({
            el: "body",
            events: {},
            initialize: function() {
                e("#signup_form input").on("focus", _.bind(function(e) {
                    this.tracking_events || (this.start_tracking_events(), this.tracking_events = !0)
                }, this))
            },
            tracking_events: !1,
            track_event: function(e, n) {
                "undefined" != typeof _gaq && _gaq.push(["_trackPageview", "/signup/" + e])
            },
            start_tracking_events: function() {
                e("body").on("click", _.bind(function(e) {
                    var n = e.currentTarget,
                        t = n.nodeName;
                    t += n.id.length ? "-" + n.id : "", t += n.className.length ? "-" + n.className : "", this.track_event("clicked", t)
                }, this)), e(window).on("keyup", _.bind(function(e) {
                    27 == e.keyCode && this.track_event("keypress", "esc")
                }, this))
            }
        });
        n.OnboardingBehaviors = t
    }(jQuery, Tumblr);