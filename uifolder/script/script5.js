/*! scripts/tumblr/utils/popover.js */
Tumblr.Utils || (Tumblr.Utils = {}),
    function(e, t) {
        var i = {
            cache: {},
            cache_tumblelog_data: function(e, t) {
                e && _.isString(e) && _.isObject(t) && (t.customizable || (this.cache[e] = {
                    timestamp: (new Date).getTime(),
                    data: JSON.stringify(t)
                }))
            },
            get_session_storage: function(e, t) {
                if (window.sessionStorage && window.sessionStorage.length) {
                    e = e || "optica_header", t = t || 36e5;
                    var i = sessionStorage.getItem(e);
                    if (i) {
                        var s = JSON.parse(i),
                            r = (new Date).getTime();
                        for (key in s)(r - s[key].timestamp > t || !_.has(s[key], "data") || s[key].data.customizable) && delete s[key];
                        return this.cache = _.extend({}, this.cache, s), s
                    }
                }
            },
            sync_session_storage: function(e) {
                if (!(_.size(this.cache) < 1) && window.sessionStorage) {
                    e = e || "optica_header";
                    var t, i, s = _.size(this.cache),
                        r = 50;
                    if (s > r) {
                        t = 0;
                        for (i in this.cache) this.cache[i] && (t++, s - r >= t && delete this.cache[i])
                    }
                    try {
                        sessionStorage.setItem(e, JSON.stringify(this.cache))
                    } catch (a) {}
                }
            },
            clear_session_storage: function(e) {
                window.sessionStorage && window.sessionStorage.length && (e = e || "optica_header", sessionStorage.getItem(e) && sessionStorage.removeItem(e))
            },
            get_bounds: function(t) {
                var i = e(t),
                    s = {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    };
                return i.length && (s = i.offset(), s.right = s.left + i.width(), s.bottom = s.top + i.height()), s
            },
            capture_tumblelog_click: function(e) {
                Tumblr.CaptureTumblelogClick && Tumblr.CaptureTumblelogClick.track_click(e)
            },
            track_premium_engagement: function(e, t) {
                if (t instanceof Tumblr.Prima.Models.Post)
                    if (Tumblr.CapturePremiumRadar && t === Tumblr.radar.postModel && (t.get("placement_id") || t.get("premium_tracked"))) Tumblr.CapturePremiumRadar.force_track_radar_controls(e);
                    else if (t.get("sponsored") || t.get("premium_tracked")) {
                    var i = _.find(Tumblr.postsView.postViews, {
                        model: t
                    });
                    if (!i) return;
                    i.capture_web_instream.force_track_sponsored_controls(e)
                }
            }
        };
        t.popover = i
    }(jQuery, Tumblr.Utils);