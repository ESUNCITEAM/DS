/*
 Highcharts JS v9.3.2 (2021-11-29)

 (c) 2009-2021 Torstein Honsi

 License: www.highcharts.com/license
*/
'use strict';
(function(d) {
    "object" === typeof module && module.exports ? (d["default"] = d, module.exports = d) : "function" === typeof define && define.amd ? define("highcharts/highcharts-more", ["highcharts"], function(A) {
        d(A);
        d.Highcharts = A;
        return d
    }) : d("undefined" !== typeof Highcharts ? Highcharts : void 0)
})(function(d) {
    function A(d, e, l, a) {
        d.hasOwnProperty(e) || (d[e] = a.apply(null, l))
    }
    d = d ? d._modules : {};
    A(d, "Extensions/Pane.js", [d["Core/Chart/Chart.js"], d["Series/CenteredUtilities.js"], d["Core/Globals.js"], d["Core/Pointer.js"],
        d["Core/Utilities.js"]
    ], function(d, e, l, a, c) {
        function t(b, m, n) {
            return Math.sqrt(Math.pow(b - n[0], 2) + Math.pow(m - n[1], 2)) <= n[2] / 2
        }
        var p = c.addEvent,
            k = c.extend,
            x = c.merge,
            w = c.pick,
            b = c.splat;
        d.prototype.collectionsWithUpdate.push("pane");
        c = function() {
            function g(b, g) {
                this.options = this.chart = this.center = this.background = void 0;
                this.coll = "pane";
                this.defaultOptions = {
                    center: ["50%", "50%"],
                    size: "85%",
                    innerSize: "0%",
                    startAngle: 0
                };
                this.defaultBackgroundOptions = {
                    shape: "circle",
                    borderWidth: 1,
                    borderColor: "#cccccc",
                    backgroundColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, "#ffffff"],
                            [1, "#e6e6e6"]
                        ]
                    },
                    from: -Number.MAX_VALUE,
                    innerRadius: 0,
                    to: Number.MAX_VALUE,
                    outerRadius: "105%"
                };
                this.init(b, g)
            }
            g.prototype.init = function(b, g) {
                this.chart = g;
                this.background = [];
                g.pane.push(this);
                this.setOptions(b)
            };
            g.prototype.setOptions = function(b) {
                this.options = x(this.defaultOptions, this.chart.angular ? {
                    background: {}
                } : void 0, b)
            };
            g.prototype.render = function() {
                var g = this.options,
                    n = this.options.background,
                    q = this.chart.renderer;
                this.group || (this.group = q.g("pane-group").attr({
                    zIndex: g.zIndex ||
                        0
                }).add());
                this.updateCenter();
                if (n)
                    for (n = b(n), g = Math.max(n.length, this.background.length || 0), q = 0; q < g; q++) n[q] && this.axis ? this.renderBackground(x(this.defaultBackgroundOptions, n[q]), q) : this.background[q] && (this.background[q] = this.background[q].destroy(), this.background.splice(q, 1))
            };
            g.prototype.renderBackground = function(b, g) {
                var n = "animate",
                    m = {
                        "class": "highcharts-pane " + (b.className || "")
                    };
                this.chart.styledMode || k(m, {
                    fill: b.backgroundColor,
                    stroke: b.borderColor,
                    "stroke-width": b.borderWidth
                });
                this.background[g] ||
                    (this.background[g] = this.chart.renderer.path().add(this.group), n = "attr");
                this.background[g][n]({
                    d: this.axis.getPlotBandPath(b.from, b.to, b)
                }).attr(m)
            };
            g.prototype.updateCenter = function(b) {
                this.center = (b || this.axis || {}).center = e.getCenter.call(this)
            };
            g.prototype.update = function(b, g) {
                x(!0, this.options, b);
                this.setOptions(this.options);
                this.render();
                this.chart.axes.forEach(function(b) {
                    b.pane === this && (b.pane = null, b.update({}, g))
                }, this)
            };
            return g
        }();
        d.prototype.getHoverPane = function(b) {
            var g = this,
                n;
            b && g.pane.forEach(function(q) {
                var m =
                    b.chartX - g.plotLeft,
                    a = b.chartY - g.plotTop;
                t(g.inverted ? a : m, g.inverted ? m : a, q.center) && (n = q)
            });
            return n
        };
        p(d, "afterIsInsidePlot", function(b) {
            this.polar && (b.isInsidePlot = this.pane.some(function(g) {
                return t(b.x, b.y, g.center)
            }))
        });
        p(a, "beforeGetHoverData", function(b) {
            var g = this.chart;
            g.polar ? (g.hoverPane = g.getHoverPane(b), b.filter = function(n) {
                return n.visible && !(!b.shared && n.directTouch) && w(n.options.enableMouseTracking, !0) && (!g.hoverPane || n.xAxis.pane === g.hoverPane)
            }) : g.hoverPane = void 0
        });
        p(a, "afterGetHoverData",
            function(b) {
                var g = this.chart;
                b.hoverPoint && b.hoverPoint.plotX && b.hoverPoint.plotY && g.hoverPane && !t(b.hoverPoint.plotX, b.hoverPoint.plotY, g.hoverPane.center) && (b.hoverPoint = void 0)
            });
        l.Pane = c;
        return l.Pane
    });
    A(d, "Core/Axis/RadialAxis.js", [d["Core/Axis/AxisDefaults.js"], d["Core/DefaultOptions.js"], d["Core/Globals.js"], d["Core/Utilities.js"]], function(d, e, l, a) {
        var c = e.defaultOptions,
            t = l.noop,
            p = a.addEvent,
            k = a.correctFloat,
            x = a.defined,
            w = a.extend,
            b = a.fireEvent,
            g = a.merge,
            m = a.pick,
            n = a.relativeLength,
            q = a.wrap,
            H;
        (function(a) {
            function e() {
                this.autoConnect = this.isCircular && "undefined" === typeof m(this.userMax, this.options.max) && k(this.endAngleRad - this.startAngleRad) === k(2 * Math.PI);
                !this.isCircular && this.chart.inverted && this.max++;
                this.autoConnect && (this.max += this.categories && 1 || this.pointRange || this.closestPointRange || 0)
            }

            function y() {
                var h = this;
                return function() {
                    if (h.isRadial && h.tickPositions && h.options.labels && !0 !== h.options.labels.allowOverlap) return h.tickPositions.map(function(f) {
                        return h.ticks[f] && h.ticks[f].label
                    }).filter(function(h) {
                        return !!h
                    })
                }
            }

            function z() {
                return t
            }

            function f(h, f, b) {
                var r = this.pane.center,
                    u = h.value;
                if (this.isCircular) {
                    if (x(u)) h.point && (g = h.point.shapeArgs || {}, g.start && (u = this.chart.inverted ? this.translate(h.point.rectPlotY, !0) : h.point.x));
                    else {
                        var g = h.chartX || 0;
                        var v = h.chartY || 0;
                        u = this.translate(Math.atan2(v - b, g - f) - this.startAngleRad, !0)
                    }
                    h = this.getPosition(u);
                    g = h.x;
                    v = h.y
                } else x(u) || (g = h.chartX, v = h.chartY), x(g) && x(v) && (b = r[1] + this.chart.plotTop, u = this.translate(Math.min(Math.sqrt(Math.pow(g - f, 2) + Math.pow(v - b, 2)), r[2] / 2) -
                    r[3] / 2, !0));
                return [u, g || 0, v || 0]
            }

            function h(h, f, b) {
                h = this.pane.center;
                var r = this.chart,
                    u = this.left || 0,
                    g = this.top || 0,
                    v = m(f, h[2] / 2 - this.offset);
                "undefined" === typeof b && (b = this.horiz ? 0 : this.center && -this.center[3] / 2);
                b && (v += b);
                this.isCircular || "undefined" !== typeof f ? (f = this.chart.renderer.symbols.arc(u + h[0], g + h[1], v, v, {
                    start: this.startAngleRad,
                    end: this.endAngleRad,
                    open: !0,
                    innerR: 0
                }), f.xBounds = [u + h[0]], f.yBounds = [g + h[1] - v]) : (f = this.postTranslate(this.angleRad, v), f = [
                    ["M", this.center[0] + r.plotLeft, this.center[1] +
                        r.plotTop
                    ],
                    ["L", f.x, f.y]
                ]);
                return f
            }

            function u() {
                this.constructor.prototype.getOffset.call(this);
                this.chart.axisOffset[this.side] = 0
            }

            function r(h, f, b) {
                var r = this.chart,
                    u = function(h) {
                        if ("string" === typeof h) {
                            var f = parseInt(h, 10);
                            y.test(h) && (f = f * B / 100);
                            return f
                        }
                        return h
                    },
                    g = this.center,
                    v = this.startAngleRad,
                    B = g[2] / 2,
                    n = Math.min(this.offset, 0),
                    q = this.left || 0,
                    a = this.top || 0,
                    y = /%$/,
                    z = this.isCircular,
                    c = m(u(b.outerRadius), B),
                    k = u(b.innerRadius);
                u = m(u(b.thickness), 10);
                if ("polygon" === this.options.gridLineInterpolation) n =
                    this.getPlotLinePath({
                        value: h
                    }).concat(this.getPlotLinePath({
                        value: f,
                        reverse: !0
                    }));
                else {
                    h = Math.max(h, this.min);
                    f = Math.min(f, this.max);
                    h = this.translate(h);
                    f = this.translate(f);
                    z || (c = h || 0, k = f || 0);
                    if ("circle" !== b.shape && z) b = v + (h || 0), v += f || 0;
                    else {
                        b = -Math.PI / 2;
                        v = 1.5 * Math.PI;
                        var E = !0
                    }
                    c -= n;
                    n = r.renderer.symbols.arc(q + g[0], a + g[1], c, c, {
                        start: Math.min(b, v),
                        end: Math.max(b, v),
                        innerR: m(k, c - (u - n)),
                        open: E
                    });
                    z && (z = (v + b) / 2, q = q + g[0] + g[2] / 2 * Math.cos(z), n.xBounds = z > -Math.PI / 2 && z < Math.PI / 2 ? [q, r.plotWidth] : [0, q], n.yBounds = [a + g[1] + g[2] / 2 * Math.sin(z)], n.yBounds[0] += z > -Math.PI && 0 > z || z > Math.PI ? -10 : 10)
                }
                return n
            }

            function B(h) {
                var f = this,
                    b = this.pane.center,
                    r = this.chart,
                    u = r.inverted,
                    g = h.reverse,
                    v = this.pane.options.background ? this.pane.options.background[0] || this.pane.options.background : {},
                    B = v.innerRadius || "0%",
                    q = v.outerRadius || "100%",
                    a = b[0] + r.plotLeft,
                    z = b[1] + r.plotTop,
                    c = this.height,
                    y = h.isCrosshair;
                v = b[3] / 2;
                var m = h.value,
                    k;
                var E = this.getPosition(m);
                var e = E.x;
                E = E.y;
                y && (E = this.getCrosshairPosition(h, a, z), m = E[0], e = E[1], E = E[2]);
                if (this.isCircular) m = Math.sqrt(Math.pow(e - a, 2) + Math.pow(E - z, 2)), g = "string" === typeof B ? n(B, 1) : B / m, r = "string" === typeof q ? n(q, 1) : q / m, b && v && (v /= m, g < v && (g = v), r < v && (r = v)), b = [
                    ["M", a + g * (e - a), z - g * (z - E)],
                    ["L", e - (1 - r) * (e - a), E + (1 - r) * (z - E)]
                ];
                else if ((m = this.translate(m)) && (0 > m || m > c) && (m = 0), "circle" === this.options.gridLineInterpolation) b = this.getLinePath(0, m, v);
                else if (b = [], r[u ? "yAxis" : "xAxis"].forEach(function(h) {
                        h.pane === f.pane && (k = h)
                    }), k)
                    for (a = k.tickPositions, k.autoConnect && (a = a.concat([a[0]])), g && (a = a.slice().reverse()),
                        m && (m += v), z = 0; z < a.length; z++) v = k.getPosition(a[z], m), b.push(z ? ["L", v.x, v.y] : ["M", v.x, v.y]);
                return b
            }

            function v(h, f) {
                h = this.translate(h);
                return this.postTranslate(this.isCircular ? h : this.angleRad, m(this.isCircular ? f : 0 > h ? 0 : h, this.center[2] / 2) - this.offset)
            }

            function E() {
                var h = this.center,
                    f = this.chart,
                    b = this.options.title;
                return {
                    x: f.plotLeft + h[0] + (b.x || 0),
                    y: f.plotTop + h[1] - {
                        high: .5,
                        middle: .25,
                        low: 0
                    }[b.align] * h[2] + (b.y || 0)
                }
            }

            function l(b) {
                b.beforeSetTickPositions = e;
                b.createLabelCollector = y;
                b.getCrosshairPosition =
                    f;
                b.getLinePath = h;
                b.getOffset = u;
                b.getPlotBandPath = r;
                b.getPlotLinePath = B;
                b.getPosition = v;
                b.getTitlePosition = E;
                b.postTranslate = O;
                b.setAxisSize = A;
                b.setAxisTranslation = P;
                b.setOptions = Q
            }

            function L() {
                var h = this.chart,
                    f = this.options,
                    b = this.pane,
                    r = b && b.options;
                h.angular && this.isXAxis || !b || !h.angular && !h.polar || (this.angleRad = (f.angle || 0) * Math.PI / 180, this.startAngleRad = (r.startAngle - 90) * Math.PI / 180, this.endAngleRad = (m(r.endAngle, r.startAngle + 360) - 90) * Math.PI / 180, this.offset = f.offset || 0)
            }

            function H(h) {
                this.isRadial &&
                    (h.align = void 0, h.preventDefault())
            }

            function K() {
                if (this.chart && this.chart.labelCollectors) {
                    var h = this.labelCollector ? this.chart.labelCollectors.indexOf(this.labelCollector) : -1;
                    0 <= h && this.chart.labelCollectors.splice(h, 1)
                }
            }

            function C(h) {
                var f = this.chart,
                    b = f.inverted,
                    r = f.angular,
                    u = f.polar,
                    v = this.isXAxis,
                    B = this.coll,
                    n = r && v,
                    a = f.options;
                h = h.userOptions.pane || 0;
                h = this.pane = f.pane && f.pane[h];
                var q;
                if ("colorAxis" === B) this.isRadial = !1;
                else {
                    if (r) {
                        if (n ? (this.isHidden = !0, this.createLabelCollector = z, this.getOffset =
                                t, this.render = this.redraw = G, this.setTitle = this.setCategories = this.setScale = t) : l(this), q = !v) this.defaultPolarOptions = R
                    } else u && (l(this), this.defaultPolarOptions = (q = this.horiz) ? S : g("xAxis" === B ? d.defaultXAxisOptions : d.defaultYAxisOptions, T), b && "yAxis" === B && (this.defaultPolarOptions.stackLabels = d.defaultYAxisOptions.stackLabels, this.defaultPolarOptions.reversedStacks = !0));
                    r || u ? (this.isRadial = !0, a.chart.zoomType = null, this.labelCollector || (this.labelCollector = this.createLabelCollector()), this.labelCollector &&
                        f.labelCollectors.push(this.labelCollector)) : this.isRadial = !1;
                    h && q && (h.axis = this);
                    this.isCircular = q
                }
            }

            function U() {
                this.isRadial && this.beforeSetTickPositions()
            }

            function J(h) {
                var f = this.label;
                if (f) {
                    var b = this.axis,
                        r = f.getBBox(),
                        u = b.options.labels,
                        v = (b.translate(this.pos) + b.startAngleRad + Math.PI / 2) / Math.PI * 180 % 360,
                        g = Math.round(v),
                        B = x(u.y) ? 0 : .3 * -r.height,
                        a = u.y,
                        q = 20,
                        z = u.align,
                        c = "end",
                        y = 0 > g ? g + 360 : g,
                        E = y,
                        k = 0,
                        e = 0;
                    if (b.isRadial) {
                        var l = b.getPosition(this.pos, b.center[2] / 2 + n(m(u.distance, -25), b.center[2] / 2, -b.center[2] /
                            2));
                        "auto" === u.rotation ? f.attr({
                            rotation: v
                        }) : x(a) || (a = b.chart.renderer.fontMetrics(f.styles && f.styles.fontSize).b - r.height / 2);
                        x(z) || (b.isCircular ? (r.width > b.len * b.tickInterval / (b.max - b.min) && (q = 0), z = v > q && v < 180 - q ? "left" : v > 180 + q && v < 360 - q ? "right" : "center") : z = "center", f.attr({
                            align: z
                        }));
                        if ("auto" === z && 2 === b.tickPositions.length && b.isCircular) {
                            90 < y && 180 > y ? y = 180 - y : 270 < y && 360 >= y && (y = 540 - y);
                            180 < E && 360 >= E && (E = 360 - E);
                            if (b.pane.options.startAngle === g || b.pane.options.startAngle === g + 360 || b.pane.options.startAngle ===
                                g - 360) c = "start";
                            z = -90 <= g && 90 >= g || -360 <= g && -270 >= g || 270 <= g && 360 >= g ? "start" === c ? "right" : "left" : "start" === c ? "left" : "right";
                            70 < E && 110 > E && (z = "center");
                            15 > y || 180 <= y && 195 > y ? k = .3 * r.height : 15 <= y && 35 >= y ? k = "start" === c ? 0 : .75 * r.height : 195 <= y && 215 >= y ? k = "start" === c ? .75 * r.height : 0 : 35 < y && 90 >= y ? k = "start" === c ? .25 * -r.height : r.height : 215 < y && 270 >= y && (k = "start" === c ? r.height : .25 * -r.height);
                            15 > E ? e = "start" === c ? .15 * -r.height : .15 * r.height : 165 < E && 180 >= E && (e = "start" === c ? .15 * r.height : .15 * -r.height);
                            f.attr({
                                align: z
                            });
                            f.translate(e,
                                k + B)
                        }
                        h.pos.x = l.x + (u.x || 0);
                        h.pos.y = l.y + (a || 0)
                    }
                }
            }

            function V(h) {
                this.axis.getPosition && w(h.pos, this.axis.getPosition(this.pos))
            }

            function O(h, f) {
                var b = this.chart,
                    r = this.center;
                h = this.startAngleRad + h;
                return {
                    x: b.plotLeft + r[0] + Math.cos(h) * f,
                    y: b.plotTop + r[1] + Math.sin(h) * f
                }
            }

            function G() {
                this.isDirty = !1
            }

            function A() {
                this.constructor.prototype.setAxisSize.call(this);
                if (this.isRadial) {
                    this.pane.updateCenter(this);
                    var h = this.center = this.pane.center.slice();
                    if (this.isCircular) this.sector = this.endAngleRad - this.startAngleRad;
                    else {
                        var f = this.postTranslate(this.angleRad, h[3] / 2);
                        h[0] = f.x - this.chart.plotLeft;
                        h[1] = f.y - this.chart.plotTop
                    }
                    this.len = this.width = this.height = (h[2] - h[3]) * m(this.sector, 1) / 2
                }
            }

            function P() {
                this.constructor.prototype.setAxisTranslation.call(this);
                this.center && (this.transA = this.isCircular ? (this.endAngleRad - this.startAngleRad) / (this.max - this.min || 1) : (this.center[2] - this.center[3]) / 2 / (this.max - this.min || 1), this.minPixelPadding = this.isXAxis ? this.transA * this.minPointOffset : 0)
            }

            function Q(h) {
                h = this.options =
                    g(this.constructor.defaultOptions, this.defaultPolarOptions, c[this.coll], h);
                h.plotBands || (h.plotBands = []);
                b(this, "afterSetOptions")
            }

            function W(h, f, b, r, u, g, v) {
                var B = this.axis;
                B.isRadial ? (h = B.getPosition(this.pos, B.center[2] / 2 + r), f = ["M", f, b, "L", h.x, h.y]) : f = h.call(this, f, b, r, u, g, v);
                return f
            }
            var N = [],
                S = {
                    gridLineWidth: 1,
                    labels: {
                        align: void 0,
                        distance: 15,
                        x: 0,
                        y: void 0,
                        style: {
                            textOverflow: "none"
                        }
                    },
                    maxPadding: 0,
                    minPadding: 0,
                    showLastLabel: !1,
                    tickLength: 0
                },
                R = {
                    labels: {
                        align: "center",
                        x: 0,
                        y: void 0
                    },
                    minorGridLineWidth: 0,
                    minorTickInterval: "auto",
                    minorTickLength: 10,
                    minorTickPosition: "inside",
                    minorTickWidth: 1,
                    tickLength: 10,
                    tickPosition: "inside",
                    tickWidth: 2,
                    title: {
                        rotation: 0
                    },
                    zIndex: 2
                },
                T = {
                    gridLineInterpolation: "circle",
                    gridLineWidth: 1,
                    labels: {
                        align: "right",
                        x: -3,
                        y: -2
                    },
                    showLastLabel: !1,
                    title: {
                        x: 4,
                        text: null,
                        rotation: 90
                    }
                };
            a.compose = function(h, f) {
                -1 === N.indexOf(h) && (N.push(h), p(h, "afterInit", L), p(h, "autoLabelAlign", H), p(h, "destroy", K), p(h, "init", C), p(h, "initialAxisTranslation", U)); - 1 === N.indexOf(f) && (N.push(f), p(f, "afterGetLabelPosition",
                    J), p(f, "afterGetPosition", V), q(f.prototype, "getMarkPath", W));
                return h
            }
        })(H || (H = {}));
        return H
    });
    A(d, "Series/AreaRange/AreaRangePoint.js", [d["Series/Area/AreaSeries.js"], d["Core/Series/Point.js"], d["Core/Utilities.js"]], function(d, e, l) {
        var a = this && this.__extends || function() {
                var a = function(c, k) {
                    a = Object.setPrototypeOf || {
                        __proto__: []
                    }
                    instanceof Array && function(b, g) {
                        b.__proto__ = g
                    } || function(b, g) {
                        for (var a in g) g.hasOwnProperty(a) && (b[a] = g[a])
                    };
                    return a(c, k)
                };
                return function(c, k) {
                    function b() {
                        this.constructor =
                            c
                    }
                    a(c, k);
                    c.prototype = null === k ? Object.create(k) : (b.prototype = k.prototype, new b)
                }
            }(),
            c = e.prototype,
            t = l.defined,
            p = l.isNumber;
        return function(k) {
            function e() {
                var a = null !== k && k.apply(this, arguments) || this;
                a.high = void 0;
                a.low = void 0;
                a.options = void 0;
                a.plotHigh = void 0;
                a.plotLow = void 0;
                a.plotHighX = void 0;
                a.plotLowX = void 0;
                a.plotX = void 0;
                a.series = void 0;
                return a
            }
            a(e, k);
            e.prototype.setState = function() {
                var a = this.state,
                    b = this.series,
                    g = b.chart.polar;
                t(this.plotHigh) || (this.plotHigh = b.yAxis.toPixels(this.high, !0));
                t(this.plotLow) || (this.plotLow = this.plotY = b.yAxis.toPixels(this.low, !0));
                b.stateMarkerGraphic && (b.lowerStateMarkerGraphic = b.stateMarkerGraphic, b.stateMarkerGraphic = b.upperStateMarkerGraphic);
                this.graphic = this.upperGraphic;
                this.plotY = this.plotHigh;
                g && (this.plotX = this.plotHighX);
                c.setState.apply(this, arguments);
                this.state = a;
                this.plotY = this.plotLow;
                this.graphic = this.lowerGraphic;
                g && (this.plotX = this.plotLowX);
                b.stateMarkerGraphic && (b.upperStateMarkerGraphic = b.stateMarkerGraphic, b.stateMarkerGraphic =
                    b.lowerStateMarkerGraphic, b.lowerStateMarkerGraphic = void 0);
                c.setState.apply(this, arguments)
            };
            e.prototype.haloPath = function() {
                var a = this.series.chart.polar,
                    b = [];
                this.plotY = this.plotLow;
                a && (this.plotX = this.plotLowX);
                this.isInside && (b = c.haloPath.apply(this, arguments));
                this.plotY = this.plotHigh;
                a && (this.plotX = this.plotHighX);
                this.isTopInside && (b = b.concat(c.haloPath.apply(this, arguments)));
                return b
            };
            e.prototype.isValid = function() {
                return p(this.low) && p(this.high)
            };
            return e
        }(d.prototype.pointClass)
    });
    A(d,
        "Series/AreaRange/AreaRangeSeries.js", [d["Series/AreaRange/AreaRangePoint.js"], d["Series/Area/AreaSeries.js"], d["Series/Column/ColumnSeries.js"], d["Core/Globals.js"], d["Core/Series/Series.js"], d["Core/Series/SeriesRegistry.js"], d["Core/Utilities.js"]],
        function(d, e, l, a, c, t, p) {
            var k = this && this.__extends || function() {
                    var b = function(g, a) {
                        b = Object.setPrototypeOf || {
                            __proto__: []
                        }
                        instanceof Array && function(b, f) {
                            b.__proto__ = f
                        } || function(b, f) {
                            for (var h in f) f.hasOwnProperty(h) && (b[h] = f[h])
                        };
                        return b(g, a)
                    };
                    return function(g,
                        a) {
                        function n() {
                            this.constructor = g
                        }
                        b(g, a);
                        g.prototype = null === a ? Object.create(a) : (n.prototype = a.prototype, new n)
                    }
                }(),
                x = e.prototype,
                w = l.prototype;
            l = a.noop;
            var b = c.prototype,
                g = p.defined,
                m = p.extend,
                n = p.isArray,
                q = p.pick,
                H = p.merge;
            c = function(a) {
                function c() {
                    var b = null !== a && a.apply(this, arguments) || this;
                    b.data = void 0;
                    b.options = void 0;
                    b.points = void 0;
                    b.lowerStateMarkerGraphic = void 0;
                    b.xAxis = void 0;
                    return b
                }
                k(c, a);
                c.prototype.toYData = function(b) {
                    return [b.low, b.high]
                };
                c.prototype.highToXY = function(b) {
                    var g =
                        this.chart,
                        f = this.xAxis.postTranslate(b.rectPlotX || 0, this.yAxis.len - b.plotHigh);
                    b.plotHighX = f.x - g.plotLeft;
                    b.plotHigh = f.y - g.plotTop;
                    b.plotLowX = b.plotX
                };
                c.prototype.translate = function() {
                    var b = this,
                        g = b.yAxis;
                    x.translate.apply(b);
                    b.points.forEach(function(f) {
                        var h = f.high,
                            u = f.plotY;
                        f.isNull ? f.plotY = null : (f.plotLow = u, f.plotHigh = g.translate(b.dataModify ? b.dataModify.modifyValue(h) : h, 0, 1, 0, 1), b.dataModify && (f.yBottom = f.plotHigh))
                    });
                    this.chart.polar && this.points.forEach(function(f) {
                        b.highToXY(f);
                        f.tooltipPos = [(f.plotHighX + f.plotLowX) / 2, (f.plotHigh + f.plotLow) / 2]
                    })
                };
                c.prototype.getGraphPath = function(b) {
                    var g = [],
                        f = [],
                        h, u = x.getGraphPath;
                    var r = this.options;
                    var a = this.chart.polar,
                        v = a && !1 !== r.connectEnds,
                        n = r.connectNulls,
                        c = r.step;
                    b = b || this.points;
                    for (h = b.length; h--;) {
                        var m = b[h];
                        var k = a ? {
                            plotX: m.rectPlotX,
                            plotY: m.yBottom,
                            doCurve: !1
                        } : {
                            plotX: m.plotX,
                            plotY: m.plotY,
                            doCurve: !1
                        };
                        m.isNull || v || n || b[h + 1] && !b[h + 1].isNull || f.push(k);
                        var e = {
                            polarPlotY: m.polarPlotY,
                            rectPlotX: m.rectPlotX,
                            yBottom: m.yBottom,
                            plotX: q(m.plotHighX,
                                m.plotX),
                            plotY: m.plotHigh,
                            isNull: m.isNull
                        };
                        f.push(e);
                        g.push(e);
                        m.isNull || v || n || b[h - 1] && !b[h - 1].isNull || f.push(k)
                    }
                    b = u.call(this, b);
                    c && (!0 === c && (c = "left"), r.step = {
                        left: "right",
                        center: "center",
                        right: "left"
                    }[c]);
                    g = u.call(this, g);
                    f = u.call(this, f);
                    r.step = c;
                    r = [].concat(b, g);
                    !this.chart.polar && f[0] && "M" === f[0][0] && (f[0] = ["L", f[0][1], f[0][2]]);
                    this.graphPath = r;
                    this.areaPath = b.concat(f);
                    r.isArea = !0;
                    r.xMap = b.xMap;
                    this.areaPath.xMap = b.xMap;
                    return r
                };
                c.prototype.drawDataLabels = function() {
                    var g = this.points,
                        a = g.length,
                        f, h = [],
                        u = this.options.dataLabels,
                        r, B = this.chart.inverted;
                    if (u) {
                        if (n(u)) {
                            var v = u[0] || {
                                enabled: !1
                            };
                            var c = u[1] || {
                                enabled: !1
                            }
                        } else v = m({}, u), v.x = u.xHigh, v.y = u.yHigh, c = m({}, u), c.x = u.xLow, c.y = u.yLow;
                        if (v.enabled || this._hasPointLabels) {
                            for (f = a; f--;)
                                if (r = g[f]) {
                                    var q = v.inside ? r.plotHigh < r.plotLow : r.plotHigh > r.plotLow;
                                    r.y = r.high;
                                    r._plotY = r.plotY;
                                    r.plotY = r.plotHigh;
                                    h[f] = r.dataLabel;
                                    r.dataLabel = r.dataLabelUpper;
                                    r.below = q;
                                    B ? v.align || (v.align = q ? "right" : "left") : v.verticalAlign || (v.verticalAlign = q ? "top" : "bottom")
                                }
                            this.options.dataLabels =
                                v;
                            b.drawDataLabels && b.drawDataLabels.apply(this, arguments);
                            for (f = a; f--;)
                                if (r = g[f]) r.dataLabelUpper = r.dataLabel, r.dataLabel = h[f], delete r.dataLabels, r.y = r.low, r.plotY = r._plotY
                        }
                        if (c.enabled || this._hasPointLabels) {
                            for (f = a; f--;)
                                if (r = g[f]) q = c.inside ? r.plotHigh < r.plotLow : r.plotHigh > r.plotLow, r.below = !q, B ? c.align || (c.align = q ? "left" : "right") : c.verticalAlign || (c.verticalAlign = q ? "bottom" : "top");
                            this.options.dataLabels = c;
                            b.drawDataLabels && b.drawDataLabels.apply(this, arguments)
                        }
                        if (v.enabled)
                            for (f = a; f--;)
                                if (r =
                                    g[f]) r.dataLabels = [r.dataLabelUpper, r.dataLabel].filter(function(h) {
                                    return !!h
                                });
                        this.options.dataLabels = u
                    }
                };
                c.prototype.alignDataLabel = function() {
                    w.alignDataLabel.apply(this, arguments)
                };
                c.prototype.drawPoints = function() {
                    var a = this.points.length,
                        c;
                    b.drawPoints.apply(this, arguments);
                    for (c = 0; c < a;) {
                        var f = this.points[c];
                        f.origProps = {
                            plotY: f.plotY,
                            plotX: f.plotX,
                            isInside: f.isInside,
                            negative: f.negative,
                            zone: f.zone,
                            y: f.y
                        };
                        f.lowerGraphic = f.graphic;
                        f.graphic = f.upperGraphic;
                        f.plotY = f.plotHigh;
                        g(f.plotHighX) &&
                            (f.plotX = f.plotHighX);
                        f.y = q(f.high, f.origProps.y);
                        f.negative = f.y < (this.options.threshold || 0);
                        this.zones.length && (f.zone = f.getZone());
                        this.chart.polar || (f.isInside = f.isTopInside = "undefined" !== typeof f.plotY && 0 <= f.plotY && f.plotY <= this.yAxis.len && 0 <= f.plotX && f.plotX <= this.xAxis.len);
                        c++
                    }
                    b.drawPoints.apply(this, arguments);
                    for (c = 0; c < a;) f = this.points[c], f.upperGraphic = f.graphic, f.graphic = f.lowerGraphic, f.origProps && (m(f, f.origProps), delete f.origProps), c++
                };
                c.defaultOptions = H(e.defaultOptions, {
                    lineWidth: 1,
                    threshold: null,
                    tooltip: {
                        pointFormat: '<span style="color:{series.color}">\u25cf</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'
                    },
                    trackByArea: !0,
                    dataLabels: {
                        align: void 0,
                        verticalAlign: void 0,
                        xLow: 0,
                        xHigh: 0,
                        yLow: 0,
                        yHigh: 0
                    }
                });
                return c
            }(e);
            m(c.prototype, {
                pointArrayMap: ["low", "high"],
                pointValKey: "low",
                deferTranslatePolar: !0,
                pointClass: d,
                setStackedPoints: l
            });
            t.registerSeriesType("arearange", c);
            "";
            return c
        });
    A(d, "Series/AreaSplineRange/AreaSplineRangeSeries.js", [d["Series/AreaRange/AreaRangeSeries.js"],
        d["Core/Series/SeriesRegistry.js"], d["Core/Utilities.js"]
    ], function(d, e, l) {
        var a = this && this.__extends || function() {
                var a = function(c, k) {
                    a = Object.setPrototypeOf || {
                        __proto__: []
                    }
                    instanceof Array && function(b, g) {
                        b.__proto__ = g
                    } || function(b, g) {
                        for (var a in g) g.hasOwnProperty(a) && (b[a] = g[a])
                    };
                    return a(c, k)
                };
                return function(c, k) {
                    function b() {
                        this.constructor = c
                    }
                    a(c, k);
                    c.prototype = null === k ? Object.create(k) : (b.prototype = k.prototype, new b)
                }
            }(),
            c = e.seriesTypes.spline,
            t = l.merge;
        l = l.extend;
        var p = function(c) {
            function k() {
                var a =
                    null !== c && c.apply(this, arguments) || this;
                a.options = void 0;
                a.data = void 0;
                a.points = void 0;
                return a
            }
            a(k, c);
            k.defaultOptions = t(d.defaultOptions);
            return k
        }(d);
        l(p.prototype, {
            getPointSpline: c.prototype.getPointSpline
        });
        e.registerSeriesType("areasplinerange", p);
        "";
        return p
    });
    A(d, "Series/BoxPlot/BoxPlotSeries.js", [d["Series/Column/ColumnSeries.js"], d["Core/Globals.js"], d["Core/Series/SeriesRegistry.js"], d["Core/Utilities.js"]], function(d, e, l, a) {
        var c = this && this.__extends || function() {
            var a = function(c, b) {
                a =
                    Object.setPrototypeOf || {
                        __proto__: []
                    }
                instanceof Array && function(b, a) {
                    b.__proto__ = a
                } || function(b, a) {
                    for (var g in a) a.hasOwnProperty(g) && (b[g] = a[g])
                };
                return a(c, b)
            };
            return function(c, b) {
                function g() {
                    this.constructor = c
                }
                a(c, b);
                c.prototype = null === b ? Object.create(b) : (g.prototype = b.prototype, new g)
            }
        }();
        e = e.noop;
        var t = a.extend,
            p = a.merge,
            k = a.pick;
        a = function(a) {
            function e() {
                var b = null !== a && a.apply(this, arguments) || this;
                b.data = void 0;
                b.options = void 0;
                b.points = void 0;
                return b
            }
            c(e, a);
            e.prototype.pointAttribs =
                function() {
                    return {}
                };
            e.prototype.translate = function() {
                var b = this.yAxis,
                    g = this.pointArrayMap;
                a.prototype.translate.apply(this);
                this.points.forEach(function(a) {
                    g.forEach(function(g) {
                        null !== a[g] && (a[g + "Plot"] = b.translate(a[g], 0, 1, 0, 1))
                    });
                    a.plotHigh = a.highPlot
                })
            };
            e.prototype.drawPoints = function() {
                var b = this,
                    g = b.options,
                    a = b.chart,
                    c = a.renderer,
                    q, e, l, p, y, z, f = 0,
                    h, u, r, B, v = !1 !== b.doQuartiles,
                    E, d = b.options.whiskerLength;
                b.points.forEach(function(n) {
                    var m = n.graphic,
                        H = m ? "animate" : "attr",
                        t = n.shapeArgs,
                        x = {},
                        I = {},
                        w = {},
                        L = {},
                        M = n.color || b.color;
                    "undefined" !== typeof n.plotY && (h = Math.round(t.width), u = Math.floor(t.x), r = u + h, B = Math.round(h / 2), q = Math.floor(v ? n.q1Plot : n.lowPlot), e = Math.floor(v ? n.q3Plot : n.lowPlot), l = Math.floor(n.highPlot), p = Math.floor(n.lowPlot), m || (n.graphic = m = c.g("point").add(b.group), n.stem = c.path().addClass("highcharts-boxplot-stem").add(m), d && (n.whiskers = c.path().addClass("highcharts-boxplot-whisker").add(m)), v && (n.box = c.path(void 0).addClass("highcharts-boxplot-box").add(m)), n.medianShape = c.path(void 0).addClass("highcharts-boxplot-median").add(m)),
                        a.styledMode || (I.stroke = n.stemColor || g.stemColor || M, I["stroke-width"] = k(n.stemWidth, g.stemWidth, g.lineWidth), I.dashstyle = n.stemDashStyle || g.stemDashStyle || g.dashStyle, n.stem.attr(I), d && (w.stroke = n.whiskerColor || g.whiskerColor || M, w["stroke-width"] = k(n.whiskerWidth, g.whiskerWidth, g.lineWidth), w.dashstyle = n.whiskerDashStyle || g.whiskerDashStyle || g.dashStyle, n.whiskers.attr(w)), v && (x.fill = n.fillColor || g.fillColor || M, x.stroke = g.lineColor || M, x["stroke-width"] = g.lineWidth || 0, x.dashstyle = n.boxDashStyle || g.boxDashStyle ||
                            g.dashStyle, n.box.attr(x)), L.stroke = n.medianColor || g.medianColor || M, L["stroke-width"] = k(n.medianWidth, g.medianWidth, g.lineWidth), L.dashstyle = n.medianDashStyle || g.medianDashStyle || g.dashStyle, n.medianShape.attr(L)), z = n.stem.strokeWidth() % 2 / 2, f = u + B + z, m = [
                            ["M", f, e],
                            ["L", f, l],
                            ["M", f, q],
                            ["L", f, p]
                        ], n.stem[H]({
                            d: m
                        }), v && (z = n.box.strokeWidth() % 2 / 2, q = Math.floor(q) + z, e = Math.floor(e) + z, u += z, r += z, m = [
                            ["M", u, e],
                            ["L", u, q],
                            ["L", r, q],
                            ["L", r, e],
                            ["L", u, e],
                            ["Z"]
                        ], n.box[H]({
                            d: m
                        })), d && (z = n.whiskers.strokeWidth() % 2 / 2, l +=
                            z, p += z, E = /%$/.test(d) ? B * parseFloat(d) / 100 : d / 2, m = [
                                ["M", f - E, l],
                                ["L", f + E, l],
                                ["M", f - E, p],
                                ["L", f + E, p]
                            ], n.whiskers[H]({
                                d: m
                            })), y = Math.round(n.medianPlot), z = n.medianShape.strokeWidth() % 2 / 2, y += z, m = [
                            ["M", u, y],
                            ["L", r, y]
                        ], n.medianShape[H]({
                            d: m
                        }))
                })
            };
            e.prototype.toYData = function(b) {
                return [b.low, b.q1, b.median, b.q3, b.high]
            };
            e.defaultOptions = p(d.defaultOptions, {
                threshold: null,
                tooltip: {
                    pointFormat: '<span style="color:{point.color}">\u25cf</span> <b> {series.name}</b><br/>Maximum: {point.high}<br/>Upper quartile: {point.q3}<br/>Median: {point.median}<br/>Lower quartile: {point.q1}<br/>Minimum: {point.low}<br/>'
                },
                whiskerLength: "50%",
                fillColor: "#ffffff",
                lineWidth: 1,
                medianWidth: 2,
                whiskerWidth: 2
            });
            return e
        }(d);
        t(a.prototype, {
            pointArrayMap: ["low", "q1", "median", "q3", "high"],
            pointValKey: "high",
            drawDataLabels: e,
            setStackedPoints: e
        });
        l.registerSeriesType("boxplot", a);
        "";
        return a
    });
    A(d, "Series/Bubble/BubbleLegendDefaults.js", [], function() {
        return {
            borderColor: void 0,
            borderWidth: 2,
            className: void 0,
            color: void 0,
            connectorClassName: void 0,
            connectorColor: void 0,
            connectorDistance: 60,
            connectorWidth: 1,
            enabled: !1,
            labels: {
                className: void 0,
                allowOverlap: !1,
                format: "",
                formatter: void 0,
                align: "right",
                style: {
                    fontSize: "10px",
                    color: "#000000"
                },
                x: 0,
                y: 0
            },
            maxSize: 60,
            minSize: 10,
            legendIndex: 0,
            ranges: {
                value: void 0,
                borderColor: void 0,
                color: void 0,
                connectorColor: void 0
            },
            sizeBy: "area",
            sizeByAbsoluteValue: !1,
            zIndex: 1,
            zThreshold: 0
        }
    });
    A(d, "Series/Bubble/BubbleLegendItem.js", [d["Core/Color/Color.js"], d["Core/FormatUtilities.js"], d["Core/Globals.js"], d["Core/Utilities.js"]], function(d, e, l, a) {
        var c = d.parse,
            t = l.noop,
            p = a.arrayMax,
            k = a.arrayMin,
            x = a.isNumber,
            w =
            a.merge,
            b = a.pick,
            g = a.stableSort;
        "";
        return function() {
            function a(b, a) {
                this.options = this.symbols = this.visible = this.selected = this.ranges = this.movementX = this.maxLabel = this.legendSymbol = this.legendItemWidth = this.legendItemHeight = this.legendItem = this.legendGroup = this.legend = this.fontMetrics = this.chart = void 0;
                this.setState = t;
                this.init(b, a)
            }
            a.prototype.init = function(b, a) {
                this.options = b;
                this.visible = !0;
                this.chart = a.chart;
                this.legend = a
            };
            a.prototype.addToLegend = function(b) {
                b.splice(this.options.legendIndex,
                    0, this)
            };
            a.prototype.drawLegendSymbol = function(a) {
                var c = this.chart,
                    n = this.options,
                    e = b(a.options.itemDistance, 20),
                    k = n.ranges,
                    m = n.connectorDistance;
                this.fontMetrics = c.renderer.fontMetrics(n.labels.style.fontSize);
                k && k.length && x(k[0].value) ? (g(k, function(b, f) {
                        return f.value - b.value
                    }), this.ranges = k, this.setOptions(), this.render(), a = this.getMaxLabelSize(), k = this.ranges[0].radius, c = 2 * k, m = m - k + a.width, m = 0 < m ? m : 0, this.maxLabel = a, this.movementX = "left" === n.labels.align ? m : 0, this.legendItemWidth = c + m + e, this.legendItemHeight =
                    c + this.fontMetrics.h / 2) : a.options.bubbleLegend.autoRanges = !0
            };
            a.prototype.setOptions = function() {
                var a = this.ranges,
                    g = this.options,
                    k = this.chart.series[g.seriesIndex],
                    e = this.legend.baseline,
                    m = {
                        zIndex: g.zIndex,
                        "stroke-width": g.borderWidth
                    },
                    l = {
                        zIndex: g.zIndex,
                        "stroke-width": g.connectorWidth
                    },
                    z = {
                        align: this.legend.options.rtl || "left" === g.labels.align ? "right" : "left",
                        zIndex: g.zIndex
                    },
                    f = k.options.marker.fillOpacity,
                    h = this.chart.styledMode;
                a.forEach(function(u, r) {
                    h || (m.stroke = b(u.borderColor, g.borderColor, k.color),
                        m.fill = b(u.color, g.color, 1 !== f ? c(k.color).setOpacity(f).get("rgba") : k.color), l.stroke = b(u.connectorColor, g.connectorColor, k.color));
                    a[r].radius = this.getRangeRadius(u.value);
                    a[r] = w(a[r], {
                        center: a[0].radius - a[r].radius + e
                    });
                    h || w(!0, a[r], {
                        bubbleAttribs: w(m),
                        connectorAttribs: w(l),
                        labelAttribs: z
                    })
                }, this)
            };
            a.prototype.getRangeRadius = function(b) {
                var a = this.options;
                return this.chart.series[this.options.seriesIndex].getRadius.call(this, a.ranges[a.ranges.length - 1].value, a.ranges[0].value, a.minSize, a.maxSize,
                    b)
            };
            a.prototype.render = function() {
                var b = this.chart.renderer,
                    a = this.options.zThreshold;
                this.symbols || (this.symbols = {
                    connectors: [],
                    bubbleItems: [],
                    labels: []
                });
                this.legendSymbol = b.g("bubble-legend");
                this.legendItem = b.g("bubble-legend-item");
                this.legendSymbol.translateX = 0;
                this.legendSymbol.translateY = 0;
                this.ranges.forEach(function(b) {
                    b.value >= a && this.renderRange(b)
                }, this);
                this.legendSymbol.add(this.legendItem);
                this.legendItem.add(this.legendGroup);
                this.hideOverlappingLabels()
            };
            a.prototype.renderRange =
                function(b) {
                    var a = this.options,
                        g = a.labels,
                        c = this.chart,
                        n = c.series[a.seriesIndex],
                        k = c.renderer,
                        e = this.symbols;
                    c = e.labels;
                    var f = b.center,
                        h = Math.abs(b.radius),
                        u = a.connectorDistance || 0,
                        r = g.align,
                        B = a.connectorWidth,
                        v = this.ranges[0].radius || 0,
                        m = f - h - a.borderWidth / 2 + B / 2,
                        l = this.fontMetrics;
                    l = l.f / 2 - (l.h - l.f) / 2;
                    var d = k.styledMode;
                    u = this.legend.options.rtl || "left" === r ? -u : u;
                    "center" === r && (u = 0, a.connectorDistance = 0, b.labelAttribs.align = "center");
                    r = m + a.labels.y;
                    var p = v + u + a.labels.x;
                    e.bubbleItems.push(k.circle(v,
                        f + ((m % 1 ? 1 : .5) - (B % 2 ? 0 : .5)), h).attr(d ? {} : b.bubbleAttribs).addClass((d ? "highcharts-color-" + n.colorIndex + " " : "") + "highcharts-bubble-legend-symbol " + (a.className || "")).add(this.legendSymbol));
                    e.connectors.push(k.path(k.crispLine([
                        ["M", v, m],
                        ["L", v + u, m]
                    ], a.connectorWidth)).attr(d ? {} : b.connectorAttribs).addClass((d ? "highcharts-color-" + this.options.seriesIndex + " " : "") + "highcharts-bubble-legend-connectors " + (a.connectorClassName || "")).add(this.legendSymbol));
                    b = k.text(this.formatLabel(b), p, r + l).attr(d ? {} : b.labelAttribs).css(d ? {} : g.style).addClass("highcharts-bubble-legend-labels " + (a.labels.className || "")).add(this.legendSymbol);
                    c.push(b);
                    b.placed = !0;
                    b.alignAttr = {
                        x: p,
                        y: r + l
                    }
                };
            a.prototype.getMaxLabelSize = function() {
                var b, a;
                this.symbols.labels.forEach(function(g) {
                    a = g.getBBox(!0);
                    b = b ? a.width > b.width ? a : b : a
                });
                return b || {}
            };
            a.prototype.formatLabel = function(b) {
                var a = this.options,
                    g = a.labels.formatter;
                a = a.labels.format;
                var c = this.chart.numberFormatter;
                return a ? e.format(a, b) : g ? g.call(b) : c(b.value, 1)
            };
            a.prototype.hideOverlappingLabels =
                function() {
                    var b = this.chart,
                        a = this.symbols;
                    !this.options.labels.allowOverlap && a && (b.hideOverlappingLabels(a.labels), a.labels.forEach(function(b, g) {
                        b.newOpacity ? b.newOpacity !== b.oldOpacity && a.connectors[g].show() : a.connectors[g].hide()
                    }))
                };
            a.prototype.getRanges = function() {
                var a = this.legend.bubbleLegend,
                    g = a.options.ranges,
                    c, e = Number.MAX_VALUE,
                    m = -Number.MAX_VALUE;
                a.chart.series.forEach(function(a) {
                    a.isBubble && !a.ignoreSeries && (c = a.zData.filter(x), c.length && (e = b(a.options.zMin, Math.min(e, Math.max(k(c), !1 === a.options.displayNegative ? a.options.zThreshold : -Number.MAX_VALUE))), m = b(a.options.zMax, Math.max(m, p(c)))))
                });
                var l = e === m ? [{
                    value: m
                }] : [{
                    value: e
                }, {
                    value: (e + m) / 2
                }, {
                    value: m,
                    autoRanges: !0
                }];
                g.length && g[0].radius && l.reverse();
                l.forEach(function(b, f) {
                    g && g[f] && (l[f] = w(g[f], b))
                });
                return l
            };
            a.prototype.predictBubbleSizes = function() {
                var b = this.chart,
                    a = this.fontMetrics,
                    g = b.legend.options,
                    c = g.floating,
                    k = (g = "horizontal" === g.layout) ? b.legend.lastLineHeight : 0,
                    e = b.plotSizeX,
                    m = b.plotSizeY,
                    f = b.series[this.options.seriesIndex],
                    h = f.getPxExtremes();
                b = Math.ceil(h.minPxSize);
                h = Math.ceil(h.maxPxSize);
                var u = Math.min(m, e);
                f = f.options.maxSize;
                if (c || !/%$/.test(f)) a = h;
                else if (f = parseFloat(f), a = (u + k - a.h / 2) * f / 100 / (f / 100 + 1), g && m - a >= e || !g && e - a >= m) a = h;
                return [b, Math.ceil(a)]
            };
            a.prototype.updateRanges = function(b, a) {
                var g = this.legend.options.bubbleLegend;
                g.minSize = b;
                g.maxSize = a;
                g.ranges = this.getRanges()
            };
            a.prototype.correctSizes = function() {
                var b = this.legend,
                    a = this.chart.series[this.options.seriesIndex].getPxExtremes();
                1 < Math.abs(Math.ceil(a.maxPxSize) -
                    this.options.maxSize) && (this.updateRanges(this.options.minSize, a.maxPxSize), b.render())
            };
            return a
        }()
    });
    A(d, "Series/Bubble/BubbleLegendComposition.js", [d["Series/Bubble/BubbleLegendDefaults.js"], d["Series/Bubble/BubbleLegendItem.js"], d["Core/DefaultOptions.js"], d["Core/Utilities.js"]], function(d, e, l, a) {
        var c = l.setOptions,
            t = a.addEvent,
            p = a.objectEach,
            k = a.wrap,
            x;
        (function(a) {
            function b(b, a, c) {
                var f = this.legend,
                    h = 0 <= g(this);
                if (f && f.options.enabled && f.bubbleLegend && f.options.bubbleLegend.autoRanges && h) {
                    var u =
                        f.bubbleLegend.options;
                    h = f.bubbleLegend.predictBubbleSizes();
                    f.bubbleLegend.updateRanges(h[0], h[1]);
                    u.placed || (f.group.placed = !1, f.allItems.forEach(function(h) {
                        h.legendGroup.translateY = null
                    }));
                    f.render();
                    this.getMargins();
                    this.axes.forEach(function(h) {
                        h.visible && h.render();
                        u.placed || (h.setScale(), h.updateNames(), p(h.ticks, function(h) {
                            h.isNew = !0;
                            h.isNewLabel = !0
                        }))
                    });
                    u.placed = !0;
                    this.getMargins();
                    b.call(this, a, c);
                    f.bubbleLegend.correctSizes();
                    x(f, m(f))
                } else b.call(this, a, c), f && f.options.enabled && f.bubbleLegend &&
                    (f.render(), x(f, m(f)))
            }

            function g(b) {
                b = b.series;
                for (var a = 0; a < b.length;) {
                    if (b[a] && b[a].isBubble && b[a].visible && b[a].zData.length) return a;
                    a++
                }
                return -1
            }

            function m(b) {
                b = b.allItems;
                var a = [],
                    g = b.length,
                    f, h = 0;
                for (f = 0; f < g; f++)
                    if (b[f].legendItemHeight && (b[f].itemHeight = b[f].legendItemHeight), b[f] === b[g - 1] || b[f + 1] && b[f]._legendItemPos[1] !== b[f + 1]._legendItemPos[1]) {
                        a.push({
                            height: 0
                        });
                        var u = a[a.length - 1];
                        for (h; h <= f; h++) b[h].itemHeight > u.height && (u.height = b[h].itemHeight);
                        u.step = f
                    }
                return a
            }

            function n(b) {
                var a =
                    this.bubbleLegend,
                    c = this.options,
                    f = c.bubbleLegend,
                    h = g(this.chart);
                a && a.ranges && a.ranges.length && (f.ranges.length && (f.autoRanges = !!f.ranges[0].autoRanges), this.destroyItem(a));
                0 <= h && c.enabled && f.enabled && (f.seriesIndex = h, this.bubbleLegend = new e(f, this), this.bubbleLegend.addToLegend(b.allItems))
            }

            function l() {
                var b = this.chart,
                    a = this.visible,
                    c = this.chart.legend;
                c && c.bubbleLegend && (this.visible = !a, this.ignoreSeries = a, b = 0 <= g(b), c.bubbleLegend.visible !== b && (c.update({
                        bubbleLegend: {
                            enabled: b
                        }
                    }), c.bubbleLegend.visible =
                    b), this.visible = a)
            }

            function x(b, a) {
                var g = b.options.rtl,
                    f, h, u, r = 0;
                b.allItems.forEach(function(b, c) {
                    f = b.legendGroup.translateX;
                    h = b._legendItemPos[1];
                    if ((u = b.movementX) || g && b.ranges) u = g ? f - b.options.maxSize / 2 : f + u, b.legendGroup.attr({
                        translateX: u
                    });
                    c > a[r].step && r++;
                    b.legendGroup.attr({
                        translateY: Math.round(h + a[r].height / 2)
                    });
                    b._legendItemPos[1] = h + a[r].height / 2
                })
            }
            var w = [];
            a.compose = function(a, g, e) {
                -1 === w.indexOf(a) && (w.push(a), c({
                    legend: {
                        bubbleLegend: d
                    }
                }), k(a.prototype, "drawChartBox", b)); - 1 === w.indexOf(g) &&
                    (w.push(g), t(g, "afterGetAllItems", n)); - 1 === w.indexOf(e) && (w.push(e), t(e, "legendItemClick", l))
            }
        })(x || (x = {}));
        return x
    });
    A(d, "Series/Bubble/BubblePoint.js", [d["Core/Series/Point.js"], d["Core/Series/SeriesRegistry.js"], d["Core/Utilities.js"]], function(d, e, l) {
        var a = this && this.__extends || function() {
            var a = function(c, e) {
                a = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array && function(a, c) {
                    a.__proto__ = c
                } || function(a, c) {
                    for (var e in c) c.hasOwnProperty(e) && (a[e] = c[e])
                };
                return a(c, e)
            };
            return function(c, e) {
                function k() {
                    this.constructor =
                        c
                }
                a(c, e);
                c.prototype = null === e ? Object.create(e) : (k.prototype = e.prototype, new k)
            }
        }();
        l = l.extend;
        e = function(c) {
            function e() {
                var a = null !== c && c.apply(this, arguments) || this;
                a.options = void 0;
                a.series = void 0;
                return a
            }
            a(e, c);
            e.prototype.haloPath = function(a) {
                return d.prototype.haloPath.call(this, 0 === a ? 0 : (this.marker ? this.marker.radius || 0 : 0) + a)
            };
            return e
        }(e.seriesTypes.scatter.prototype.pointClass);
        l(e.prototype, {
            ttBelow: !1
        });
        return e
    });
    A(d, "Series/Bubble/BubbleSeries.js", [d["Core/Axis/Axis.js"], d["Series/Bubble/BubbleLegendComposition.js"],
        d["Series/Bubble/BubblePoint.js"], d["Core/Color/Color.js"], d["Core/Globals.js"], d["Core/Series/Series.js"], d["Core/Series/SeriesRegistry.js"], d["Core/Utilities.js"]
    ], function(d, e, l, a, c, t, p, k) {
        var x = this && this.__extends || function() {
                var b = function(f, h) {
                    b = Object.setPrototypeOf || {
                        __proto__: []
                    }
                    instanceof Array && function(b, h) {
                        b.__proto__ = h
                    } || function(b, h) {
                        for (var f in h) h.hasOwnProperty(f) && (b[f] = h[f])
                    };
                    return b(f, h)
                };
                return function(f, h) {
                    function a() {
                        this.constructor = f
                    }
                    b(f, h);
                    f.prototype = null === h ? Object.create(h) :
                        (a.prototype = h.prototype, new a)
                }
            }(),
            w = a.parse;
        a = c.noop;
        var b = p.seriesTypes;
        c = b.column;
        var g = b.scatter;
        b = k.addEvent;
        var m = k.arrayMax,
            n = k.arrayMin,
            q = k.clamp,
            H = k.extend,
            K = k.isNumber,
            I = k.merge,
            y = k.pick;
        k = function(b) {
            function f() {
                var h = null !== b && b.apply(this, arguments) || this;
                h.data = void 0;
                h.maxPxSize = void 0;
                h.minPxSize = void 0;
                h.options = void 0;
                h.points = void 0;
                h.radii = void 0;
                h.yData = void 0;
                h.zData = void 0;
                return h
            }
            x(f, b);
            f.prototype.animate = function(b) {
                !b && this.points.length < this.options.animationLimit &&
                    this.points.forEach(function(b) {
                        var h = b.graphic;
                        h && h.width && (this.hasRendered || h.attr({
                            x: b.plotX,
                            y: b.plotY,
                            width: 1,
                            height: 1
                        }), h.animate(this.markerAttribs(b), this.options.animation))
                    }, this)
            };
            f.prototype.getRadii = function() {
                var b = this,
                    f = this.zData,
                    a = this.yData,
                    g = [],
                    c = this.chart.bubbleZExtremes;
                var e = this.getPxExtremes();
                var m = e.minPxSize,
                    k = e.maxPxSize;
                if (!c) {
                    var n = Number.MAX_VALUE,
                        l = -Number.MAX_VALUE,
                        d;
                    this.chart.series.forEach(function(h) {
                        h.bubblePadding && (h.visible || !b.chart.options.chart.ignoreHiddenSeries) &&
                            (h = h.getZExtremes()) && (n = Math.min(n || h.zMin, h.zMin), l = Math.max(l || h.zMax, h.zMax), d = !0)
                    });
                    d ? (c = {
                        zMin: n,
                        zMax: l
                    }, this.chart.bubbleZExtremes = c) : c = {
                        zMin: 0,
                        zMax: 0
                    }
                }
                var p = 0;
                for (e = f.length; p < e; p++) {
                    var q = f[p];
                    g.push(this.getRadius(c.zMin, c.zMax, m, k, q, a[p]))
                }
                this.radii = g
            };
            f.prototype.getRadius = function(b, f, a, g, c, e) {
                var h = this.options,
                    r = "width" !== h.sizeBy,
                    u = h.zThreshold,
                    v = f - b,
                    m = .5;
                if (null === e || null === c) return null;
                if (K(c)) {
                    h.sizeByAbsoluteValue && (c = Math.abs(c - u), v = Math.max(f - u, Math.abs(b - u)), b = 0);
                    if (c < b) return a /
                        2 - 1;
                    0 < v && (m = (c - b) / v)
                }
                r && 0 <= m && (m = Math.sqrt(m));
                return Math.ceil(a + m * (g - a)) / 2
            };
            f.prototype.hasData = function() {
                return !!this.processedXData.length
            };
            f.prototype.pointAttribs = function(b, f) {
                var h = this.options.marker.fillOpacity;
                b = t.prototype.pointAttribs.call(this, b, f);
                1 !== h && (b.fill = w(b.fill).setOpacity(h).get("rgba"));
                return b
            };
            f.prototype.translate = function() {
                b.prototype.translate.call(this);
                this.getRadii();
                this.translateBubble()
            };
            f.prototype.translateBubble = function() {
                for (var b = this.data, f = this.radii,
                        a = this.getPxExtremes().minPxSize, g = b.length; g--;) {
                    var c = b[g],
                        e = f ? f[g] : 0;
                    K(e) && e >= a / 2 ? (c.marker = H(c.marker, {
                        radius: e,
                        width: 2 * e,
                        height: 2 * e
                    }), c.dlBox = {
                        x: c.plotX - e,
                        y: c.plotY - e,
                        width: 2 * e,
                        height: 2 * e
                    }) : c.shapeArgs = c.plotY = c.dlBox = void 0
                }
            };
            f.prototype.getPxExtremes = function() {
                var b = Math.min(this.chart.plotWidth, this.chart.plotHeight),
                    f = function(h) {
                        if ("string" === typeof h) {
                            var f = /%$/.test(h);
                            h = parseInt(h, 10)
                        }
                        return f ? b * h / 100 : h
                    },
                    a = f(y(this.options.minSize, 8));
                f = Math.max(f(y(this.options.maxSize, "20%")), a);
                return {
                    minPxSize: a,
                    maxPxSize: f
                }
            };
            f.prototype.getZExtremes = function() {
                var b = this.options,
                    f = (this.zData || []).filter(K);
                if (f.length) {
                    var a = y(b.zMin, q(n(f), !1 === b.displayNegative ? b.zThreshold || 0 : -Number.MAX_VALUE, Number.MAX_VALUE));
                    b = y(b.zMax, m(f));
                    if (K(a) && K(b)) return {
                        zMin: a,
                        zMax: b
                    }
                }
            };
            f.compose = e.compose;
            f.defaultOptions = I(g.defaultOptions, {
                dataLabels: {
                    formatter: function() {
                        var b = this.series.chart.numberFormatter,
                            f = this.point.z;
                        return K(f) ? b(f, -1) : ""
                    },
                    inside: !0,
                    verticalAlign: "middle"
                },
                animationLimit: 250,
                marker: {
                    lineColor: null,
                    lineWidth: 1,
                    fillOpacity: .5,
                    radius: null,
                    states: {
                        hover: {
                            radiusPlus: 0
                        }
                    },
                    symbol: "circle"
                },
                minSize: 8,
                maxSize: "20%",
                softThreshold: !1,
                states: {
                    hover: {
                        halo: {
                            size: 5
                        }
                    }
                },
                tooltip: {
                    pointFormat: "({point.x}, {point.y}), Size: {point.z}"
                },
                turboThreshold: 0,
                zThreshold: 0,
                zoneAxis: "z"
            });
            return f
        }(g);
        H(k.prototype, {
            alignDataLabel: c.prototype.alignDataLabel,
            applyZones: a,
            bubblePadding: !0,
            buildKDTree: a,
            directTouch: !0,
            isBubble: !0,
            pointArrayMap: ["y", "z"],
            pointClass: l,
            parallelArrays: ["x", "y", "z"],
            trackerGroups: ["group", "dataLabelsGroup"],
            specialGroup: "group",
            zoneAxis: "z"
        });
        b(k, "updatedData", function(b) {
            delete b.target.chart.bubbleZExtremes
        });
        d.prototype.beforePadding = function() {
            var b = this,
                f = this.len,
                h = this.chart,
                a = 0,
                g = f,
                c = this.isXAxis,
                v = c ? "xData" : "yData",
                e = this.min,
                m = this.max - e,
                k = f / m,
                n;
            this.series.forEach(function(f) {
                if (f.bubblePadding && (f.visible || !h.options.chart.ignoreHiddenSeries)) {
                    n = b.allowZoomOutside = !0;
                    var r = f[v];
                    c && f.getRadii(0, 0, f);
                    if (0 < m)
                        for (var u = r.length; u--;)
                            if (K(r[u]) && b.dataMin <= r[u] && r[u] <= b.max) {
                                var B = f.radii && f.radii[u] ||
                                    0;
                                a = Math.min((r[u] - e) * k - B, a);
                                g = Math.max((r[u] - e) * k + B, g)
                            }
                }
            });
            n && 0 < m && !this.logarithmic && (g -= f, k *= (f + Math.max(0, a) - Math.min(g, f)) / f, [
                ["min", "userMin", a],
                ["max", "userMax", g]
            ].forEach(function(h) {
                "undefined" === typeof y(b.options[h[0]], b[h[1]]) && (b[h[0]] += h[2] / k)
            }))
        };
        p.registerSeriesType("bubble", k);
        "";
        "";
        return k
    });
    A(d, "Series/ColumnRange/ColumnRangePoint.js", [d["Core/Series/SeriesRegistry.js"], d["Core/Utilities.js"]], function(d, e) {
        var l = this && this.__extends || function() {
                var a = function(c, e) {
                    a = Object.setPrototypeOf || {
                        __proto__: []
                    }
                    instanceof Array && function(a, b) {
                        a.__proto__ = b
                    } || function(a, b) {
                        for (var g in b) b.hasOwnProperty(g) && (a[g] = b[g])
                    };
                    return a(c, e)
                };
                return function(c, e) {
                    function k() {
                        this.constructor = c
                    }
                    a(c, e);
                    c.prototype = null === e ? Object.create(e) : (k.prototype = e.prototype, new k)
                }
            }(),
            a = d.seriesTypes;
        d = a.column.prototype.pointClass;
        var c = e.extend,
            t = e.isNumber;
        e = function(a) {
            function c() {
                var c = null !== a && a.apply(this, arguments) || this;
                c.series = void 0;
                c.options = void 0;
                c.barX = void 0;
                c.pointWidth = void 0;
                c.shapeType =
                    void 0;
                return c
            }
            l(c, a);
            c.prototype.isValid = function() {
                return t(this.low)
            };
            return c
        }(a.arearange.prototype.pointClass);
        c(e.prototype, {
            setState: d.prototype.setState
        });
        return e
    });
    A(d, "Series/ColumnRange/ColumnRangeSeries.js", [d["Series/ColumnRange/ColumnRangePoint.js"], d["Core/Globals.js"], d["Core/Series/SeriesRegistry.js"], d["Core/Utilities.js"]], function(d, e, l, a) {
        var c = this && this.__extends || function() {
            var b = function(a, g) {
                b = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array && function(b, a) {
                    b.__proto__ =
                        a
                } || function(b, a) {
                    for (var g in a) a.hasOwnProperty(g) && (b[g] = a[g])
                };
                return b(a, g)
            };
            return function(a, g) {
                function c() {
                    this.constructor = a
                }
                b(a, g);
                a.prototype = null === g ? Object.create(g) : (c.prototype = g.prototype, new c)
            }
        }();
        e = e.noop;
        var t = l.seriesTypes,
            p = t.arearange,
            k = t.column,
            x = k.prototype,
            w = p.prototype,
            b = a.clamp,
            g = a.merge,
            m = a.pick;
        a = a.extend;
        var n = {
            pointRange: null,
            marker: null,
            states: {
                hover: {
                    halo: !1
                }
            }
        };
        t = function(a) {
            function e() {
                var b = null !== a && a.apply(this, arguments) || this;
                b.data = void 0;
                b.points = void 0;
                b.options = void 0;
                return b
            }
            c(e, a);
            e.prototype.setOptions = function() {
                g(!0, arguments[0], {
                    stacking: void 0
                });
                return w.setOptions.apply(this, arguments)
            };
            e.prototype.translate = function() {
                var a = this,
                    g = a.yAxis,
                    c = a.xAxis,
                    e = c.startAngleRad,
                    f, h = a.chart,
                    u = a.xAxis.isRadial,
                    r = Math.max(h.chartWidth, h.chartHeight) + 999,
                    k;
                x.translate.apply(a);
                a.points.forEach(function(v) {
                    var n = v.shapeArgs || {},
                        B = a.options.minPointLength;
                    v.plotHigh = k = b(g.translate(v.high, 0, 1, 0, 1), -r, r);
                    v.plotLow = b(v.plotY, -r, r);
                    var l = k;
                    var d = m(v.rectPlotY,
                        v.plotY) - k;
                    Math.abs(d) < B ? (B -= d, d += B, l -= B / 2) : 0 > d && (d *= -1, l -= d);
                    u ? (f = v.barX + e, v.shapeType = "arc", v.shapeArgs = a.polarArc(l + d, l, f, f + v.pointWidth)) : (n.height = d, n.y = l, B = n.x, B = void 0 === B ? 0 : B, n = n.width, n = void 0 === n ? 0 : n, v.tooltipPos = h.inverted ? [g.len + g.pos - h.plotLeft - l - d / 2, c.len + c.pos - h.plotTop - B - n / 2, d] : [c.left - h.plotLeft + B + n / 2, g.pos - h.plotTop + l + d / 2, d])
                })
            };
            e.prototype.crispCol = function() {
                return x.crispCol.apply(this, arguments)
            };
            e.prototype.drawPoints = function() {
                return x.drawPoints.apply(this, arguments)
            };
            e.prototype.drawTracker =
                function() {
                    return x.drawTracker.apply(this, arguments)
                };
            e.prototype.getColumnMetrics = function() {
                return x.getColumnMetrics.apply(this, arguments)
            };
            e.prototype.pointAttribs = function() {
                return x.pointAttribs.apply(this, arguments)
            };
            e.prototype.adjustForMissingColumns = function() {
                return x.adjustForMissingColumns.apply(this, arguments)
            };
            e.prototype.animate = function() {
                return x.animate.apply(this, arguments)
            };
            e.prototype.translate3dPoints = function() {
                return x.translate3dPoints.apply(this, arguments)
            };
            e.prototype.translate3dShapes =
                function() {
                    return x.translate3dShapes.apply(this, arguments)
                };
            e.defaultOptions = g(k.defaultOptions, p.defaultOptions, n);
            return e
        }(p);
        a(t.prototype, {
            directTouch: !0,
            trackerGroups: ["group", "dataLabelsGroup"],
            drawGraph: e,
            getSymbol: e,
            polarArc: function() {
                return x.polarArc.apply(this, arguments)
            },
            pointClass: d
        });
        l.registerSeriesType("columnrange", t);
        "";
        return t
    });
    A(d, "Series/ColumnPyramid/ColumnPyramidSeries.js", [d["Series/Column/ColumnSeries.js"], d["Core/Series/SeriesRegistry.js"], d["Core/Utilities.js"]], function(d,
        e, l) {
        var a = this && this.__extends || function() {
                var a = function(c, b) {
                    a = Object.setPrototypeOf || {
                        __proto__: []
                    }
                    instanceof Array && function(b, a) {
                        b.__proto__ = a
                    } || function(b, a) {
                        for (var g in a) a.hasOwnProperty(g) && (b[g] = a[g])
                    };
                    return a(c, b)
                };
                return function(c, b) {
                    function g() {
                        this.constructor = c
                    }
                    a(c, b);
                    c.prototype = null === b ? Object.create(b) : (g.prototype = b.prototype, new g)
                }
            }(),
            c = d.prototype,
            t = l.clamp,
            p = l.merge,
            k = l.pick;
        l = function(e) {
            function l() {
                var b = null !== e && e.apply(this, arguments) || this;
                b.data = void 0;
                b.options =
                    void 0;
                b.points = void 0;
                return b
            }
            a(l, e);
            l.prototype.translate = function() {
                var b = this,
                    a = b.chart,
                    e = b.options,
                    n = b.dense = 2 > b.closestPointRange * b.xAxis.transA;
                n = b.borderWidth = k(e.borderWidth, n ? 0 : 1);
                var d = b.yAxis,
                    l = e.threshold,
                    p = b.translatedThreshold = d.getThreshold(l),
                    x = k(e.minPointLength, 5),
                    w = b.getColumnMetrics(),
                    z = w.width,
                    f = b.barW = Math.max(z, 1 + 2 * n),
                    h = b.pointXOffset = w.offset;
                a.inverted && (p -= .5);
                e.pointPadding && (f = Math.ceil(f));
                c.translate.apply(b);
                b.points.forEach(function(g) {
                    var c = k(g.yBottom, p),
                        u = 999 +
                        Math.abs(c),
                        v = t(g.plotY, -u, d.len + u);
                    u = g.plotX + h;
                    var m = f / 2,
                        n = Math.min(v, c);
                    c = Math.max(v, c) - n;
                    var q;
                    g.barX = u;
                    g.pointWidth = z;
                    g.tooltipPos = a.inverted ? [d.len + d.pos - a.plotLeft - v, b.xAxis.len - u - m, c] : [u + m, v + d.pos - a.plotTop, c];
                    v = l + (g.total || g.y);
                    "percent" === e.stacking && (v = l + (0 > g.y) ? -100 : 100);
                    v = d.toPixels(v, !0);
                    var w = (q = a.plotHeight - v - (a.plotHeight - p)) ? m * (n - v) / q : 0;
                    var y = q ? m * (n + c - v) / q : 0;
                    q = u - w + m;
                    w = u + w + m;
                    var C = u + y + m;
                    y = u - y + m;
                    var H = n - x;
                    var D = n + c;
                    0 > g.y && (H = n, D = n + c + x);
                    a.inverted && (C = d.width - n, q = v - (d.width - p), w = m * (v -
                        C) / q, y = m * (v - (C - c)) / q, q = u + m + w, w = q - 2 * w, C = u - y + m, y = u + y + m, H = n, D = n + c - x, 0 > g.y && (D = n + c + x));
                    g.shapeType = "path";
                    g.shapeArgs = {
                        x: q,
                        y: H,
                        width: w - q,
                        height: c,
                        d: [
                            ["M", q, H],
                            ["L", w, H],
                            ["L", C, D],
                            ["L", y, D],
                            ["Z"]
                        ]
                    }
                })
            };
            l.defaultOptions = p(d.defaultOptions, {});
            return l
        }(d);
        e.registerSeriesType("columnpyramid", l);
        "";
        return l
    });
    A(d, "Series/ErrorBar/ErrorBarSeries.js", [d["Series/BoxPlot/BoxPlotSeries.js"], d["Series/Column/ColumnSeries.js"], d["Core/Series/SeriesRegistry.js"], d["Core/Utilities.js"]], function(d, e, l, a) {
        var c = this &&
            this.__extends || function() {
                var a = function(c, b) {
                    a = Object.setPrototypeOf || {
                        __proto__: []
                    }
                    instanceof Array && function(b, a) {
                        b.__proto__ = a
                    } || function(b, a) {
                        for (var g in a) a.hasOwnProperty(g) && (b[g] = a[g])
                    };
                    return a(c, b)
                };
                return function(c, b) {
                    function g() {
                        this.constructor = c
                    }
                    a(c, b);
                    c.prototype = null === b ? Object.create(b) : (g.prototype = b.prototype, new g)
                }
            }(),
            t = l.seriesTypes.arearange,
            p = a.merge;
        a = a.extend;
        var k = function(a) {
            function k() {
                var b = null !== a && a.apply(this, arguments) || this;
                b.data = void 0;
                b.options = void 0;
                b.points = void 0;
                return b
            }
            c(k, a);
            k.prototype.getColumnMetrics = function() {
                return this.linkedParent && this.linkedParent.columnMetrics || e.prototype.getColumnMetrics.call(this)
            };
            k.prototype.drawDataLabels = function() {
                var b = this.pointValKey;
                t && (t.prototype.drawDataLabels.call(this), this.data.forEach(function(a) {
                    a.y = a[b]
                }))
            };
            k.prototype.toYData = function(b) {
                return [b.low, b.high]
            };
            k.defaultOptions = p(d.defaultOptions, {
                color: "#000000",
                grouping: !1,
                linkedTo: ":previous",
                tooltip: {
                    pointFormat: '<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'
                },
                whiskerWidth: null
            });
            return k
        }(d);
        a(k.prototype, {
            pointArrayMap: ["low", "high"],
            pointValKey: "high",
            doQuartiles: !1
        });
        l.registerSeriesType("errorbar", k);
        "";
        return k
    });
    A(d, "Series/Gauge/GaugePoint.js", [d["Core/Series/SeriesRegistry.js"]], function(d) {
        var e = this && this.__extends || function() {
            var e = function(a, c) {
                e = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array && function(a, c) {
                    a.__proto__ = c
                } || function(a, c) {
                    for (var e in c) c.hasOwnProperty(e) && (a[e] = c[e])
                };
                return e(a, c)
            };
            return function(a, c) {
                function d() {
                    this.constructor =
                        a
                }
                e(a, c);
                a.prototype = null === c ? Object.create(c) : (d.prototype = c.prototype, new d)
            }
        }();
        return function(d) {
            function a() {
                var a = null !== d && d.apply(this, arguments) || this;
                a.options = void 0;
                a.series = void 0;
                a.shapeArgs = void 0;
                return a
            }
            e(a, d);
            a.prototype.setState = function(a) {
                this.state = a
            };
            return a
        }(d.series.prototype.pointClass)
    });
    A(d, "Series/Gauge/GaugeSeries.js", [d["Series/Gauge/GaugePoint.js"], d["Core/Globals.js"], d["Core/Series/SeriesRegistry.js"], d["Core/Utilities.js"]], function(d, e, l, a) {
        var c = this && this.__extends ||
            function() {
                var b = function(a, g) {
                    b = Object.setPrototypeOf || {
                        __proto__: []
                    }
                    instanceof Array && function(b, a) {
                        b.__proto__ = a
                    } || function(b, a) {
                        for (var g in a) a.hasOwnProperty(g) && (b[g] = a[g])
                    };
                    return b(a, g)
                };
                return function(a, g) {
                    function c() {
                        this.constructor = a
                    }
                    b(a, g);
                    a.prototype = null === g ? Object.create(g) : (c.prototype = g.prototype, new c)
                }
            }();
        e = e.noop;
        var t = l.series,
            p = l.seriesTypes.column,
            k = a.clamp,
            x = a.isNumber,
            w = a.extend,
            b = a.merge,
            g = a.pick,
            m = a.pInt;
        a = function(a) {
            function e() {
                var b = null !== a && a.apply(this, arguments) ||
                    this;
                b.data = void 0;
                b.points = void 0;
                b.options = void 0;
                b.yAxis = void 0;
                return b
            }
            c(e, a);
            e.prototype.translate = function() {
                var a = this.yAxis,
                    c = this.options,
                    e = a.center;
                this.generatePoints();
                this.points.forEach(function(d) {
                    var n = b(c.dial, d.dial),
                        f = m(g(n.radius, "80%")) * e[2] / 200,
                        h = m(g(n.baseLength, "70%")) * f / 100,
                        u = m(g(n.rearLength, "10%")) * f / 100,
                        r = n.baseWidth || 3,
                        l = n.topWidth || 1,
                        v = c.overshoot,
                        p = a.startAngleRad + a.translate(d.y, null, null, null, !0);
                    if (x(v) || !1 === c.wrap) v = x(v) ? v / 180 * Math.PI : 0, p = k(p, a.startAngleRad - v,
                        a.endAngleRad + v);
                    p = 180 * p / Math.PI;
                    d.shapeType = "path";
                    d.shapeArgs = {
                        d: n.path || [
                            ["M", -u, -r / 2],
                            ["L", h, -r / 2],
                            ["L", f, -l / 2],
                            ["L", f, l / 2],
                            ["L", h, r / 2],
                            ["L", -u, r / 2],
                            ["Z"]
                        ],
                        translateX: e[0],
                        translateY: e[1],
                        rotation: p
                    };
                    d.plotX = e[0];
                    d.plotY = e[1]
                })
            };
            e.prototype.drawPoints = function() {
                var a = this,
                    c = a.chart,
                    e = a.yAxis.center,
                    d = a.pivot,
                    m = a.options,
                    f = m.pivot,
                    h = c.renderer;
                a.points.forEach(function(f) {
                    var g = f.graphic,
                        e = f.shapeArgs,
                        u = e.d,
                        d = b(m.dial, f.dial);
                    g ? (g.animate(e), e.d = u) : f.graphic = h[f.shapeType](e).attr({
                        rotation: e.rotation,
                        zIndex: 1
                    }).addClass("highcharts-dial").add(a.group);
                    if (!c.styledMode) f.graphic[g ? "animate" : "attr"]({
                        stroke: d.borderColor || "none",
                        "stroke-width": d.borderWidth || 0,
                        fill: d.backgroundColor || "#000000"
                    })
                });
                d ? d.animate({
                    translateX: e[0],
                    translateY: e[1]
                }) : (a.pivot = h.circle(0, 0, g(f.radius, 5)).attr({
                    zIndex: 2
                }).addClass("highcharts-pivot").translate(e[0], e[1]).add(a.group), c.styledMode || a.pivot.attr({
                    "stroke-width": f.borderWidth || 0,
                    stroke: f.borderColor || "#cccccc",
                    fill: f.backgroundColor || "#000000"
                }))
            };
            e.prototype.animate =
                function(b) {
                    var a = this;
                    b || a.points.forEach(function(b) {
                        var g = b.graphic;
                        g && (g.attr({
                            rotation: 180 * a.yAxis.startAngleRad / Math.PI
                        }), g.animate({
                            rotation: b.shapeArgs.rotation
                        }, a.options.animation))
                    })
                };
            e.prototype.render = function() {
                this.group = this.plotGroup("group", "series", this.visible ? "visible" : "hidden", this.options.zIndex, this.chart.seriesGroup);
                t.prototype.render.call(this);
                this.group.clip(this.chart.clipRect)
            };
            e.prototype.setData = function(b, a) {
                t.prototype.setData.call(this, b, !1);
                this.processData();
                this.generatePoints();
                g(a, !0) && this.chart.redraw()
            };
            e.prototype.hasData = function() {
                return !!this.points.length
            };
            e.defaultOptions = b(t.defaultOptions, {
                dataLabels: {
                    borderColor: "#cccccc",
                    borderRadius: 3,
                    borderWidth: 1,
                    crop: !1,
                    defer: !1,
                    enabled: !0,
                    verticalAlign: "top",
                    y: 15,
                    zIndex: 2
                },
                dial: {},
                pivot: {},
                tooltip: {
                    headerFormat: ""
                },
                showInLegend: !1
            });
            return e
        }(t);
        w(a.prototype, {
            angular: !0,
            directTouch: !0,
            drawGraph: e,
            drawTracker: p.prototype.drawTracker,
            fixedBox: !0,
            forceDL: !0,
            noSharedTooltip: !0,
            pointClass: d,
            trackerGroups: ["group",
                "dataLabelsGroup"
            ]
        });
        l.registerSeriesType("gauge", a);
        "";
        return a
    });
    A(d, "Series/PackedBubble/PackedBubblePoint.js", [d["Core/Chart/Chart.js"], d["Core/Series/Point.js"], d["Core/Series/SeriesRegistry.js"]], function(d, e, l) {
        var a = this && this.__extends || function() {
            var a = function(c, e) {
                a = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array && function(a, c) {
                    a.__proto__ = c
                } || function(a, c) {
                    for (var e in c) c.hasOwnProperty(e) && (a[e] = c[e])
                };
                return a(c, e)
            };
            return function(c, e) {
                function d() {
                    this.constructor = c
                }
                a(c, e);
                c.prototype = null === e ? Object.create(e) : (d.prototype = e.prototype, new d)
            }
        }();
        return function(c) {
            function l() {
                var a = null !== c && c.apply(this, arguments) || this;
                a.degree = NaN;
                a.mass = NaN;
                a.radius = NaN;
                a.options = void 0;
                a.series = void 0;
                a.value = null;
                return a
            }
            a(l, c);
            l.prototype.destroy = function() {
                this.series.layout && this.series.layout.removeElementFromCollection(this, this.series.layout.nodes);
                return e.prototype.destroy.apply(this, arguments)
            };
            l.prototype.firePointEvent = function() {
                var a = this.series.options;
                if (this.isParentNode &&
                    a.parentNode) {
                    var c = a.allowPointSelect;
                    a.allowPointSelect = a.parentNode.allowPointSelect;
                    e.prototype.firePointEvent.apply(this, arguments);
                    a.allowPointSelect = c
                } else e.prototype.firePointEvent.apply(this, arguments)
            };
            l.prototype.select = function() {
                var a = this.series.chart;
                this.isParentNode ? (a.getSelectedPoints = a.getSelectedParentNodes, e.prototype.select.apply(this, arguments), a.getSelectedPoints = d.prototype.getSelectedPoints) : e.prototype.select.apply(this, arguments)
            };
            return l
        }(l.seriesTypes.bubble.prototype.pointClass)
    });
    A(d, "Series/Networkgraph/DraggableNodes.js", [d["Core/Chart/Chart.js"], d["Core/Globals.js"], d["Core/Utilities.js"]], function(d, e, l) {
        var a = l.addEvent;
        e.dragNodesMixin = {
            onMouseDown: function(a, e) {
                e = this.chart.pointer.normalize(e);
                a.fixedPosition = {
                    chartX: e.chartX,
                    chartY: e.chartY,
                    plotX: a.plotX,
                    plotY: a.plotY
                };
                a.inDragMode = !0
            },
            onMouseMove: function(a, e) {
                if (a.fixedPosition && a.inDragMode) {
                    var c = this.chart,
                        d = c.pointer.normalize(e);
                    e = a.fixedPosition.chartX - d.chartX;
                    d = a.fixedPosition.chartY - d.chartY;
                    var l = void 0,
                        w = void 0,
                        b = c.graphLayoutsLookup;
                    if (5 < Math.abs(e) || 5 < Math.abs(d)) l = a.fixedPosition.plotX - e, w = a.fixedPosition.plotY - d, c.isInsidePlot(l, w) && (a.plotX = l, a.plotY = w, a.hasDragged = !0, this.redrawHalo(a), b.forEach(function(b) {
                        b.restartSimulation()
                    }))
                }
            },
            onMouseUp: function(a, e) {
                a.fixedPosition && (a.hasDragged && (this.layout.enableSimulation ? this.layout.start() : this.chart.redraw()), a.inDragMode = a.hasDragged = !1, this.options.fixedDraggable || delete a.fixedPosition)
            },
            redrawHalo: function(a) {
                a && this.halo && this.halo.attr({
                    d: a.haloPath(this.options.states.hover.halo.size)
                })
            }
        };
        a(d, "load", function() {
            var c = this,
                e, d, l;
            c.container && (e = a(c.container, "mousedown", function(e) {
                var k = c.hoverPoint;
                k && k.series && k.series.hasDraggableNodes && k.series.options.draggable && (k.series.onMouseDown(k, e), d = a(c.container, "mousemove", function(b) {
                    return k && k.series && k.series.onMouseMove(k, b)
                }), l = a(c.container.ownerDocument, "mouseup", function(b) {
                    d();
                    l();
                    return k && k.series && k.series.onMouseUp(k, b)
                }))
            }));
            a(c, "destroy", function() {
                e()
            })
        })
    });
    A(d, "Series/Networkgraph/Integrations.js", [d["Core/Globals.js"]],
        function(d) {
            d.networkgraphIntegrations = {
                verlet: {
                    attractiveForceFunction: function(e, d) {
                        return (d - e) / e
                    },
                    repulsiveForceFunction: function(e, d) {
                        return (d - e) / e * (d > e ? 1 : 0)
                    },
                    barycenter: function() {
                        var e = this.options.gravitationalConstant,
                            d = this.barycenter.xFactor,
                            a = this.barycenter.yFactor;
                        d = (d - (this.box.left + this.box.width) / 2) * e;
                        a = (a - (this.box.top + this.box.height) / 2) * e;
                        this.nodes.forEach(function(c) {
                            c.fixedPosition || (c.plotX -= d / c.mass / c.degree, c.plotY -= a / c.mass / c.degree)
                        })
                    },
                    repulsive: function(e, d, a) {
                        d = d * this.diffTemperature /
                            e.mass / e.degree;
                        e.fixedPosition || (e.plotX += a.x * d, e.plotY += a.y * d)
                    },
                    attractive: function(e, d, a) {
                        var c = e.getMass(),
                            l = -a.x * d * this.diffTemperature;
                        d = -a.y * d * this.diffTemperature;
                        e.fromNode.fixedPosition || (e.fromNode.plotX -= l * c.fromNode / e.fromNode.degree, e.fromNode.plotY -= d * c.fromNode / e.fromNode.degree);
                        e.toNode.fixedPosition || (e.toNode.plotX += l * c.toNode / e.toNode.degree, e.toNode.plotY += d * c.toNode / e.toNode.degree)
                    },
                    integrate: function(e, d) {
                        var a = -e.options.friction,
                            c = e.options.maxSpeed,
                            l = (d.plotX + d.dispX - d.prevX) *
                            a;
                        a *= d.plotY + d.dispY - d.prevY;
                        var p = Math.abs,
                            k = p(l) / (l || 1);
                        p = p(a) / (a || 1);
                        l = k * Math.min(c, Math.abs(l));
                        a = p * Math.min(c, Math.abs(a));
                        d.prevX = d.plotX + d.dispX;
                        d.prevY = d.plotY + d.dispY;
                        d.plotX += l;
                        d.plotY += a;
                        d.temperature = e.vectorLength({
                            x: l,
                            y: a
                        })
                    },
                    getK: function(e) {
                        return Math.pow(e.box.width * e.box.height / e.nodes.length, .5)
                    }
                },
                euler: {
                    attractiveForceFunction: function(e, d) {
                        return e * e / d
                    },
                    repulsiveForceFunction: function(e, d) {
                        return d * d / e
                    },
                    barycenter: function() {
                        var e = this.options.gravitationalConstant,
                            d = this.barycenter.xFactor,
                            a = this.barycenter.yFactor;
                        this.nodes.forEach(function(c) {
                            if (!c.fixedPosition) {
                                var l = c.getDegree();
                                l *= 1 + l / 2;
                                c.dispX += (d - c.plotX) * e * l / c.degree;
                                c.dispY += (a - c.plotY) * e * l / c.degree
                            }
                        })
                    },
                    repulsive: function(e, d, a, c) {
                        e.dispX += a.x / c * d / e.degree;
                        e.dispY += a.y / c * d / e.degree
                    },
                    attractive: function(e, d, a, c) {
                        var l = e.getMass(),
                            p = a.x / c * d;
                        d *= a.y / c;
                        e.fromNode.fixedPosition || (e.fromNode.dispX -= p * l.fromNode / e.fromNode.degree, e.fromNode.dispY -= d * l.fromNode / e.fromNode.degree);
                        e.toNode.fixedPosition || (e.toNode.dispX += p * l.toNode /
                            e.toNode.degree, e.toNode.dispY += d * l.toNode / e.toNode.degree)
                    },
                    integrate: function(e, d) {
                        d.dispX += d.dispX * e.options.friction;
                        d.dispY += d.dispY * e.options.friction;
                        var a = d.temperature = e.vectorLength({
                            x: d.dispX,
                            y: d.dispY
                        });
                        0 !== a && (d.plotX += d.dispX / a * Math.min(Math.abs(d.dispX), e.temperature), d.plotY += d.dispY / a * Math.min(Math.abs(d.dispY), e.temperature))
                    },
                    getK: function(e) {
                        return Math.pow(e.box.width * e.box.height / e.nodes.length, .3)
                    }
                }
            }
        });
    A(d, "Series/Networkgraph/QuadTree.js", [d["Core/Globals.js"], d["Core/Utilities.js"]],
        function(d, e) {
            e = e.extend;
            var l = d.QuadTreeNode = function(a) {
                this.box = a;
                this.boxSize = Math.min(a.width, a.height);
                this.nodes = [];
                this.body = this.isInternal = !1;
                this.isEmpty = !0
            };
            e(l.prototype, {
                insert: function(a, c) {
                    this.isInternal ? this.nodes[this.getBoxPosition(a)].insert(a, c - 1) : (this.isEmpty = !1, this.body ? c ? (this.isInternal = !0, this.divideBox(), !0 !== this.body && (this.nodes[this.getBoxPosition(this.body)].insert(this.body, c - 1), this.body = !0), this.nodes[this.getBoxPosition(a)].insert(a, c - 1)) : (c = new l({
                        top: a.plotX,
                        left: a.plotY,
                        width: .1,
                        height: .1
                    }), c.body = a, c.isInternal = !1, this.nodes.push(c)) : (this.isInternal = !1, this.body = a))
                },
                updateMassAndCenter: function() {
                    var a = 0,
                        c = 0,
                        e = 0;
                    this.isInternal ? (this.nodes.forEach(function(d) {
                        d.isEmpty || (a += d.mass, c += d.plotX * d.mass, e += d.plotY * d.mass)
                    }), c /= a, e /= a) : this.body && (a = this.body.mass, c = this.body.plotX, e = this.body.plotY);
                    this.mass = a;
                    this.plotX = c;
                    this.plotY = e
                },
                divideBox: function() {
                    var a = this.box.width / 2,
                        c = this.box.height / 2;
                    this.nodes[0] = new l({
                        left: this.box.left,
                        top: this.box.top,
                        width: a,
                        height: c
                    });
                    this.nodes[1] = new l({
                        left: this.box.left + a,
                        top: this.box.top,
                        width: a,
                        height: c
                    });
                    this.nodes[2] = new l({
                        left: this.box.left + a,
                        top: this.box.top + c,
                        width: a,
                        height: c
                    });
                    this.nodes[3] = new l({
                        left: this.box.left,
                        top: this.box.top + c,
                        width: a,
                        height: c
                    })
                },
                getBoxPosition: function(a) {
                    var c = a.plotY < this.box.top + this.box.height / 2;
                    return a.plotX < this.box.left + this.box.width / 2 ? c ? 0 : 3 : c ? 1 : 2
                }
            });
            d = d.QuadTree = function(a, c, e, d) {
                this.box = {
                    left: a,
                    top: c,
                    width: e,
                    height: d
                };
                this.maxDepth = 25;
                this.root = new l(this.box,
                    "0");
                this.root.isInternal = !0;
                this.root.isRoot = !0;
                this.root.divideBox()
            };
            e(d.prototype, {
                insertNodes: function(a) {
                    a.forEach(function(a) {
                        this.root.insert(a, this.maxDepth)
                    }, this)
                },
                visitNodeRecursive: function(a, c, e) {
                    var d;
                    a || (a = this.root);
                    a === this.root && c && (d = c(a));
                    !1 !== d && (a.nodes.forEach(function(a) {
                        if (a.isInternal) {
                            c && (d = c(a));
                            if (!1 === d) return;
                            this.visitNodeRecursive(a, c, e)
                        } else a.body && c && c(a.body);
                        e && e(a)
                    }, this), a === this.root && e && e(a))
                },
                calculateMassAndCenter: function() {
                    this.visitNodeRecursive(null,
                        null,
                        function(a) {
                            a.updateMassAndCenter()
                        })
                }
            })
        });
    A(d, "Series/Networkgraph/Layouts.js", [d["Core/Chart/Chart.js"], d["Core/Animation/AnimationUtilities.js"], d["Core/Globals.js"], d["Core/Utilities.js"]], function(d, e, l, a) {
        var c = e.setAnimation;
        e = a.addEvent;
        var t = a.clamp,
            p = a.defined,
            k = a.extend,
            x = a.isFunction,
            w = a.pick;
        l.layouts = {
            "reingold-fruchterman": function() {}
        };
        k(l.layouts["reingold-fruchterman"].prototype, {
            init: function(b) {
                this.options = b;
                this.nodes = [];
                this.links = [];
                this.series = [];
                this.box = {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                };
                this.setInitialRendering(!0);
                this.integration = l.networkgraphIntegrations[b.integration];
                this.enableSimulation = b.enableSimulation;
                this.attractiveForce = w(b.attractiveForce, this.integration.attractiveForceFunction);
                this.repulsiveForce = w(b.repulsiveForce, this.integration.repulsiveForceFunction);
                this.approximation = b.approximation
            },
            updateSimulation: function(b) {
                this.enableSimulation = w(b, this.options.enableSimulation)
            },
            start: function() {
                var b = this.series,
                    a = this.options;
                this.currentStep = 0;
                this.forces =
                    b[0] && b[0].forces || [];
                this.chart = b[0] && b[0].chart;
                this.initialRendering && (this.initPositions(), b.forEach(function(b) {
                    b.finishedAnimating = !0;
                    b.render()
                }));
                this.setK();
                this.resetSimulation(a);
                this.enableSimulation && this.step()
            },
            step: function() {
                var b = this,
                    a = this.series;
                b.currentStep++;
                "barnes-hut" === b.approximation && (b.createQuadTree(), b.quadTree.calculateMassAndCenter());
                b.forces.forEach(function(a) {
                    b[a + "Forces"](b.temperature)
                });
                b.applyLimits(b.temperature);
                b.temperature = b.coolDown(b.startTemperature,
                    b.diffTemperature, b.currentStep);
                b.prevSystemTemperature = b.systemTemperature;
                b.systemTemperature = b.getSystemTemperature();
                b.enableSimulation && (a.forEach(function(b) {
                    b.chart && b.render()
                }), b.maxIterations-- && isFinite(b.temperature) && !b.isStable() ? (b.simulation && l.win.cancelAnimationFrame(b.simulation), b.simulation = l.win.requestAnimationFrame(function() {
                    b.step()
                })) : b.simulation = !1)
            },
            stop: function() {
                this.simulation && l.win.cancelAnimationFrame(this.simulation)
            },
            setArea: function(b, a, c, e) {
                this.box = {
                    left: b,
                    top: a,
                    width: c,
                    height: e
                }
            },
            setK: function() {
                this.k = this.options.linkLength || this.integration.getK(this)
            },
            addElementsToCollection: function(b, a) {
                b.forEach(function(b) {
                    -1 === a.indexOf(b) && a.push(b)
                })
            },
            removeElementFromCollection: function(b, a) {
                b = a.indexOf(b); - 1 !== b && a.splice(b, 1)
            },
            clear: function() {
                this.nodes.length = 0;
                this.links.length = 0;
                this.series.length = 0;
                this.resetSimulation()
            },
            resetSimulation: function() {
                this.forcedStop = !1;
                this.systemTemperature = 0;
                this.setMaxIterations();
                this.setTemperature();
                this.setDiffTemperature()
            },
            restartSimulation: function() {
                this.simulation ? this.resetSimulation() : (this.setInitialRendering(!1), this.enableSimulation ? this.start() : this.setMaxIterations(1), this.chart && this.chart.redraw(), this.setInitialRendering(!0))
            },
            setMaxIterations: function(b) {
                this.maxIterations = w(b, this.options.maxIterations)
            },
            setTemperature: function() {
                this.temperature = this.startTemperature = Math.sqrt(this.nodes.length)
            },
            setDiffTemperature: function() {
                this.diffTemperature = this.startTemperature / (this.options.maxIterations + 1)
            },
            setInitialRendering: function(b) {
                this.initialRendering = b
            },
            createQuadTree: function() {
                this.quadTree = new l.QuadTree(this.box.left, this.box.top, this.box.width, this.box.height);
                this.quadTree.insertNodes(this.nodes)
            },
            initPositions: function() {
                var b = this.options.initialPositions;
                x(b) ? (b.call(this), this.nodes.forEach(function(b) {
                    p(b.prevX) || (b.prevX = b.plotX);
                    p(b.prevY) || (b.prevY = b.plotY);
                    b.dispX = 0;
                    b.dispY = 0
                })) : "circle" === b ? this.setCircularPositions() : this.setRandomPositions()
            },
            setCircularPositions: function() {
                function b(a) {
                    a.linksFrom.forEach(function(a) {
                        l[a.toNode.id] ||
                            (l[a.toNode.id] = !0, k.push(a.toNode), b(a.toNode))
                    })
                }
                var a = this.box,
                    c = this.nodes,
                    e = 2 * Math.PI / (c.length + 1),
                    d = c.filter(function(b) {
                        return 0 === b.linksTo.length
                    }),
                    k = [],
                    l = {},
                    p = this.options.initialPositionRadius;
                d.forEach(function(a) {
                    k.push(a);
                    b(a)
                });
                k.length ? c.forEach(function(b) {
                    -1 === k.indexOf(b) && k.push(b)
                }) : k = c;
                k.forEach(function(b, c) {
                    b.plotX = b.prevX = w(b.plotX, a.width / 2 + p * Math.cos(c * e));
                    b.plotY = b.prevY = w(b.plotY, a.height / 2 + p * Math.sin(c * e));
                    b.dispX = 0;
                    b.dispY = 0
                })
            },
            setRandomPositions: function() {
                function b(b) {
                    b =
                        b * b / Math.PI;
                    return b -= Math.floor(b)
                }
                var a = this.box,
                    c = this.nodes,
                    e = c.length + 1;
                c.forEach(function(c, g) {
                    c.plotX = c.prevX = w(c.plotX, a.width * b(g));
                    c.plotY = c.prevY = w(c.plotY, a.height * b(e + g));
                    c.dispX = 0;
                    c.dispY = 0
                })
            },
            force: function(b) {
                this.integration[b].apply(this, Array.prototype.slice.call(arguments, 1))
            },
            barycenterForces: function() {
                this.getBarycenter();
                this.force("barycenter")
            },
            getBarycenter: function() {
                var b = 0,
                    a = 0,
                    c = 0;
                this.nodes.forEach(function(g) {
                    a += g.plotX * g.mass;
                    c += g.plotY * g.mass;
                    b += g.mass
                });
                return this.barycenter = {
                    x: a,
                    y: c,
                    xFactor: a / b,
                    yFactor: c / b
                }
            },
            barnesHutApproximation: function(b, a) {
                var c = this.getDistXY(b, a),
                    g = this.vectorLength(c);
                if (b !== a && 0 !== g)
                    if (a.isInternal)
                        if (a.boxSize / g < this.options.theta && 0 !== g) {
                            var e = this.repulsiveForce(g, this.k);
                            this.force("repulsive", b, e * a.mass, c, g);
                            var d = !1
                        } else d = !0;
                else e = this.repulsiveForce(g, this.k), this.force("repulsive", b, e * a.mass, c, g);
                return d
            },
            repulsiveForces: function() {
                var b = this;
                "barnes-hut" === b.approximation ? b.nodes.forEach(function(a) {
                    b.quadTree.visitNodeRecursive(null,
                        function(c) {
                            return b.barnesHutApproximation(a, c)
                        })
                }) : b.nodes.forEach(function(a) {
                    b.nodes.forEach(function(c) {
                        if (a !== c && !a.fixedPosition) {
                            var g = b.getDistXY(a, c);
                            var e = b.vectorLength(g);
                            if (0 !== e) {
                                var d = b.repulsiveForce(e, b.k);
                                b.force("repulsive", a, d * c.mass, g, e)
                            }
                        }
                    })
                })
            },
            attractiveForces: function() {
                var b = this,
                    a, c, e;
                b.links.forEach(function(g) {
                    g.fromNode && g.toNode && (a = b.getDistXY(g.fromNode, g.toNode), c = b.vectorLength(a), 0 !== c && (e = b.attractiveForce(c, b.k), b.force("attractive", g, e, a, c)))
                })
            },
            applyLimits: function() {
                var b =
                    this;
                b.nodes.forEach(function(a) {
                    a.fixedPosition || (b.integration.integrate(b, a), b.applyLimitBox(a, b.box), a.dispX = 0, a.dispY = 0)
                })
            },
            applyLimitBox: function(b, a) {
                var c = b.radius;
                b.plotX = t(b.plotX, a.left + c, a.width - c);
                b.plotY = t(b.plotY, a.top + c, a.height - c)
            },
            coolDown: function(b, a, c) {
                return b - a * c
            },
            isStable: function() {
                return .00001 > Math.abs(this.systemTemperature - this.prevSystemTemperature) || 0 >= this.temperature
            },
            getSystemTemperature: function() {
                return this.nodes.reduce(function(b, a) {
                    return b + a.temperature
                }, 0)
            },
            vectorLength: function(b) {
                return Math.sqrt(b.x * b.x + b.y * b.y)
            },
            getDistR: function(b, a) {
                b = this.getDistXY(b, a);
                return this.vectorLength(b)
            },
            getDistXY: function(b, a) {
                var c = b.plotX - a.plotX;
                b = b.plotY - a.plotY;
                return {
                    x: c,
                    y: b,
                    absX: Math.abs(c),
                    absY: Math.abs(b)
                }
            }
        });
        e(d, "predraw", function() {
            this.graphLayoutsLookup && this.graphLayoutsLookup.forEach(function(b) {
                b.stop()
            })
        });
        e(d, "render", function() {
            function b(b) {
                b.maxIterations-- && isFinite(b.temperature) && !b.isStable() && !b.enableSimulation && (b.beforeStep && b.beforeStep(),
                    b.step(), e = !1, a = !0)
            }
            var a = !1;
            if (this.graphLayoutsLookup) {
                c(!1, this);
                for (this.graphLayoutsLookup.forEach(function(b) {
                        b.start()
                    }); !e;) {
                    var e = !0;
                    this.graphLayoutsLookup.forEach(b)
                }
                a && this.series.forEach(function(b) {
                    b && b.layout && b.render()
                })
            }
        });
        e(d, "beforePrint", function() {
            this.graphLayoutsLookup && (this.graphLayoutsLookup.forEach(function(b) {
                b.updateSimulation(!1)
            }), this.redraw())
        });
        e(d, "afterPrint", function() {
            this.graphLayoutsLookup && this.graphLayoutsLookup.forEach(function(b) {
                b.updateSimulation()
            });
            this.redraw()
        })
    });
    A(d, "Series/PackedBubble/PackedBubbleComposition.js", [d["Core/Chart/Chart.js"], d["Core/Globals.js"], d["Core/Utilities.js"]], function(d, e, l) {
        var a = e.layouts["reingold-fruchterman"],
            c = l.addEvent,
            t = l.extendClass,
            p = l.pick;
        d.prototype.getSelectedParentNodes = function() {
            var a = [];
            this.series.forEach(function(c) {
                c.parentNode && c.parentNode.selected && a.push(c.parentNode)
            });
            return a
        };
        e.networkgraphIntegrations.packedbubble = {
            repulsiveForceFunction: function(a, c, e, b) {
                return Math.min(a, (e.marker.radius +
                    b.marker.radius) / 2)
            },
            barycenter: function() {
                var a = this,
                    c = a.options.gravitationalConstant,
                    e = a.box,
                    b = a.nodes,
                    d, m;
                b.forEach(function(g) {
                    a.options.splitSeries && !g.isParentNode ? (d = g.series.parentNode.plotX, m = g.series.parentNode.plotY) : (d = e.width / 2, m = e.height / 2);
                    g.fixedPosition || (g.plotX -= (g.plotX - d) * c / (g.mass * Math.sqrt(b.length)), g.plotY -= (g.plotY - m) * c / (g.mass * Math.sqrt(b.length)))
                })
            },
            repulsive: function(a, c, e, b) {
                var g = c * this.diffTemperature / a.mass / a.degree;
                c = e.x * g;
                e = e.y * g;
                a.fixedPosition || (a.plotX += c, a.plotY +=
                    e);
                b.fixedPosition || (b.plotX -= c, b.plotY -= e)
            },
            integrate: e.networkgraphIntegrations.verlet.integrate,
            getK: e.noop
        };
        e.layouts.packedbubble = t(a, {
            beforeStep: function() {
                this.options.marker && this.series.forEach(function(a) {
                    a && a.calculateParentRadius()
                })
            },
            isStable: function() {
                var a = Math.abs(this.prevSystemTemperature - this.systemTemperature);
                return 1 > Math.abs(10 * this.systemTemperature / Math.sqrt(this.nodes.length)) && .00001 > a || 0 >= this.temperature
            },
            setCircularPositions: function() {
                var a = this,
                    c = a.box,
                    e = a.nodes,
                    b =
                    2 * Math.PI / (e.length + 1),
                    g, d, n = a.options.initialPositionRadius;
                e.forEach(function(e, k) {
                    a.options.splitSeries && !e.isParentNode ? (g = e.series.parentNode.plotX, d = e.series.parentNode.plotY) : (g = c.width / 2, d = c.height / 2);
                    e.plotX = e.prevX = p(e.plotX, g + n * Math.cos(e.index || k * b));
                    e.plotY = e.prevY = p(e.plotY, d + n * Math.sin(e.index || k * b));
                    e.dispX = 0;
                    e.dispY = 0
                })
            },
            repulsiveForces: function() {
                var a = this,
                    c, e, b, g = a.options.bubblePadding;
                a.nodes.forEach(function(d) {
                    d.degree = d.mass;
                    d.neighbours = 0;
                    a.nodes.forEach(function(k) {
                        c = 0;
                        d === k || d.fixedPosition || !a.options.seriesInteraction && d.series !== k.series || (b = a.getDistXY(d, k), e = a.vectorLength(b) - (d.marker.radius + k.marker.radius + g), 0 > e && (d.degree += .01, d.neighbours++, c = a.repulsiveForce(-e / Math.sqrt(d.neighbours), a.k, d, k)), a.force("repulsive", d, c * k.mass, b, k, e))
                    })
                })
            },
            applyLimitBox: function(c) {
                if (this.options.splitSeries && !c.isParentNode && this.options.parentNodeLimit) {
                    var e = this.getDistXY(c, c.series.parentNode);
                    var d = c.series.parentNodeRadius - c.marker.radius - this.vectorLength(e);
                    0 > d && d > -2 * c.marker.radius && (c.plotX -= .01 * e.x, c.plotY -= .01 * e.y)
                }
                a.prototype.applyLimitBox.apply(this, arguments)
            }
        });
        c(d, "beforeRedraw", function() {
            this.allDataPoints && delete this.allDataPoints
        })
    });
    A(d, "Series/PackedBubble/PackedBubbleSeries.js", [d["Core/Color/Color.js"], d["Core/Globals.js"], d["Series/PackedBubble/PackedBubblePoint.js"], d["Core/Series/SeriesRegistry.js"], d["Core/Utilities.js"]], function(d, e, l, a, c) {
        var t = this && this.__extends || function() {
                var a = function(b, h) {
                    a = Object.setPrototypeOf || {
                        __proto__: []
                    }
                    instanceof
                    Array && function(a, b) {
                        a.__proto__ = b
                    } || function(a, b) {
                        for (var h in b) b.hasOwnProperty(h) && (a[h] = b[h])
                    };
                    return a(b, h)
                };
                return function(b, h) {
                    function f() {
                        this.constructor = b
                    }
                    a(b, h);
                    b.prototype = null === h ? Object.create(h) : (f.prototype = h.prototype, new f)
                }
            }(),
            p = d.parse,
            k = a.series,
            x = a.seriesTypes.bubble,
            w = c.addEvent,
            b = c.clamp,
            g = c.defined,
            m = c.extend,
            n = c.fireEvent,
            q = c.isArray,
            H = c.isNumber,
            A = c.merge,
            I = c.pick,
            y = e.dragNodesMixin;
        d = function(a) {
            function f() {
                var b = null !== a && a.apply(this, arguments) || this;
                b.chart = void 0;
                b.data = void 0;
                b.layout = void 0;
                b.options = void 0;
                b.points = void 0;
                b.xData = void 0;
                return b
            }
            t(f, a);
            f.prototype.accumulateAllPoints = function(a) {
                var b = a.chart,
                    h = [],
                    f, c;
                for (f = 0; f < b.series.length; f++)
                    if (a = b.series[f], a.is("packedbubble") && a.visible || !b.options.chart.ignoreHiddenSeries)
                        for (c = 0; c < a.yData.length; c++) h.push([null, null, a.yData[c], a.index, c, {
                            id: c,
                            marker: {
                                radius: 0
                            }
                        }]);
                return h
            };
            f.prototype.addLayout = function() {
                var a = this.options.layoutAlgorithm,
                    b = this.chart.graphLayoutsStorage,
                    f = this.chart.graphLayoutsLookup,
                    c = this.chart.options.chart;
                b || (this.chart.graphLayoutsStorage = b = {}, this.chart.graphLayoutsLookup = f = []);
                var d = b[a.type];
                d || (a.enableSimulation = g(c.forExport) ? !c.forExport : a.enableSimulation, b[a.type] = d = new e.layouts[a.type], d.init(a), f.splice(d.index, 0, d));
                this.layout = d;
                this.points.forEach(function(a) {
                    a.mass = 2;
                    a.degree = 1;
                    a.collisionNmb = 1
                });
                d.setArea(0, 0, this.chart.plotWidth, this.chart.plotHeight);
                d.addElementsToCollection([this], d.series);
                d.addElementsToCollection(this.points, d.nodes)
            };
            f.prototype.addSeriesLayout =
                function() {
                    var a = this.options.layoutAlgorithm,
                        b = this.chart.graphLayoutsStorage,
                        f = this.chart.graphLayoutsLookup,
                        c = A(a, a.parentNodeOptions, {
                            enableSimulation: this.layout.options.enableSimulation
                        });
                    var d = b[a.type + "-series"];
                    d || (b[a.type + "-series"] = d = new e.layouts[a.type], d.init(c), f.splice(d.index, 0, d));
                    this.parentNodeLayout = d;
                    this.createParentNodes()
                };
            f.prototype.calculateParentRadius = function() {
                var a = this.seriesBox();
                this.parentNodeRadius = b(Math.sqrt(2 * this.parentNodeMass / Math.PI) + 20, 20, a ? Math.max(Math.sqrt(Math.pow(a.width,
                    2) + Math.pow(a.height, 2)) / 2 + 20, 20) : Math.sqrt(2 * this.parentNodeMass / Math.PI) + 20);
                this.parentNode && (this.parentNode.marker.radius = this.parentNode.radius = this.parentNodeRadius)
            };
            f.prototype.calculateZExtremes = function() {
                var a = this.options.zMin,
                    b = this.options.zMax,
                    f = Infinity,
                    c = -Infinity;
                if (a && b) return [a, b];
                this.chart.series.forEach(function(a) {
                    a.yData.forEach(function(a) {
                        g(a) && (a > c && (c = a), a < f && (f = a))
                    })
                });
                a = I(a, f);
                b = I(b, c);
                return [a, b]
            };
            f.prototype.checkOverlap = function(a, b) {
                var h = a[0] - b[0],
                    f = a[1] - b[1];
                return -.001 > Math.sqrt(h * h + f * f) - Math.abs(a[2] + b[2])
            };
            f.prototype.createParentNodes = function() {
                var a = this,
                    b = a.chart,
                    f = a.parentNodeLayout,
                    c, e = a.parentNode,
                    d = a.pointClass,
                    g = a.layout.options,
                    k = {
                        radius: a.parentNodeRadius,
                        lineColor: a.color,
                        fillColor: p(a.color).brighten(.4).get()
                    };
                g.parentNodeOptions && (k = A(g.parentNodeOptions.marker || {}, k));
                a.parentNodeMass = 0;
                a.points.forEach(function(b) {
                    a.parentNodeMass += Math.PI * Math.pow(b.marker.radius, 2)
                });
                a.calculateParentRadius();
                f.nodes.forEach(function(b) {
                    b.seriesIndex ===
                        a.index && (c = !0)
                });
                f.setArea(0, 0, b.plotWidth, b.plotHeight);
                c || (e || (e = (new d).init(this, {
                    mass: a.parentNodeRadius / 2,
                    marker: k,
                    dataLabels: {
                        inside: !1
                    },
                    states: {
                        normal: {
                            marker: k
                        },
                        hover: {
                            marker: k
                        }
                    },
                    dataLabelOnNull: !0,
                    degree: a.parentNodeRadius,
                    isParentNode: !0,
                    seriesIndex: a.index
                })), a.parentNode && (e.plotX = a.parentNode.plotX, e.plotY = a.parentNode.plotY), a.parentNode = e, f.addElementsToCollection([a], f.series), f.addElementsToCollection([e], f.nodes))
            };
            f.prototype.deferLayout = function() {
                var a = this.options.layoutAlgorithm;
                this.visible && (this.addLayout(), a.splitSeries && this.addSeriesLayout())
            };
            f.prototype.destroy = function() {
                this.chart.graphLayoutsLookup && this.chart.graphLayoutsLookup.forEach(function(a) {
                    a.removeElementFromCollection(this, a.series)
                }, this);
                this.parentNode && this.parentNodeLayout && (this.parentNodeLayout.removeElementFromCollection(this.parentNode, this.parentNodeLayout.nodes), this.parentNode.dataLabel && (this.parentNode.dataLabel = this.parentNode.dataLabel.destroy()));
                k.prototype.destroy.apply(this, arguments)
            };
            f.prototype.drawDataLabels = function() {
                var a = this.options.dataLabels.textPath,
                    b = this.points;
                k.prototype.drawDataLabels.apply(this, arguments);
                this.parentNode && (this.parentNode.formatPrefix = "parentNode", this.points = [this.parentNode], this.options.dataLabels.textPath = this.options.dataLabels.parentNodeTextPath, k.prototype.drawDataLabels.apply(this, arguments), this.points = b, this.options.dataLabels.textPath = a)
            };
            f.prototype.drawGraph = function() {
                if (this.layout && this.layout.options.splitSeries) {
                    var a = this.chart;
                    var b = this.layout.options.parentNodeOptions.marker;
                    var f = {
                        fill: b.fillColor || p(this.color).brighten(.4).get(),
                        opacity: b.fillOpacity,
                        stroke: b.lineColor || this.color,
                        "stroke-width": I(b.lineWidth, this.options.lineWidth)
                    };
                    this.parentNodesGroup || (this.parentNodesGroup = this.plotGroup("parentNodesGroup", "parentNode", this.visible ? "inherit" : "hidden", .1, a.seriesGroup), this.group.attr({
                        zIndex: 2
                    }));
                    this.calculateParentRadius();
                    b = A({
                        x: this.parentNode.plotX - this.parentNodeRadius,
                        y: this.parentNode.plotY - this.parentNodeRadius,
                        width: 2 * this.parentNodeRadius,
                        height: 2 * this.parentNodeRadius
                    }, f);
                    this.parentNode.graphic || (this.graph = this.parentNode.graphic = a.renderer.symbol(f.symbol).add(this.parentNodesGroup));
                    this.parentNode.graphic.attr(b)
                }
            };
            f.prototype.drawTracker = function() {
                var b = this.parentNode;
                a.prototype.drawTracker.call(this);
                if (b) {
                    var f = q(b.dataLabels) ? b.dataLabels : b.dataLabel ? [b.dataLabel] : [];
                    b.graphic && (b.graphic.element.point = b);
                    f.forEach(function(a) {
                        a.div ? a.div.point = b : a.element.point = b
                    })
                }
            };
            f.prototype.getPointRadius =
                function() {
                    var a = this,
                        f = a.chart,
                        c = a.options,
                        e = c.useSimulation,
                        d = Math.min(f.plotWidth, f.plotHeight),
                        g = {},
                        k = [],
                        l = f.allDataPoints,
                        n, m, p, z;
                    ["minSize", "maxSize"].forEach(function(a) {
                        var b = parseInt(c[a], 10),
                            f = /%$/.test(c[a]);
                        g[a] = f ? d * b / 100 : b * Math.sqrt(l.length)
                    });
                    f.minRadius = n = g.minSize / Math.sqrt(l.length);
                    f.maxRadius = m = g.maxSize / Math.sqrt(l.length);
                    var q = e ? a.calculateZExtremes() : [n, m];
                    (l || []).forEach(function(f, h) {
                        p = e ? b(f[2], q[0], q[1]) : f[2];
                        z = a.getRadius(q[0], q[1], n, m, p);
                        0 === z && (z = null);
                        l[h][2] = z;
                        k.push(z)
                    });
                    a.radii = k
                };
            f.prototype.init = function() {
                k.prototype.init.apply(this, arguments);
                this.eventsToUnbind.push(w(this, "updatedData", function() {
                    this.chart.series.forEach(function(a) {
                        a.type === this.type && (a.isDirty = !0)
                    }, this)
                }));
                return this
            };
            f.prototype.onMouseUp = function(a) {
                if (a.fixedPosition && !a.removed) {
                    var b, f, h = this.layout,
                        c = this.parentNodeLayout;
                    c && h.options.dragBetweenSeries && c.nodes.forEach(function(c) {
                        a && a.marker && c !== a.series.parentNode && (b = h.getDistXY(a, c), f = h.vectorLength(b) - c.marker.radius - a.marker.radius,
                            0 > f && (c.series.addPoint(A(a.options, {
                                plotX: a.plotX,
                                plotY: a.plotY
                            }), !1), h.removeElementFromCollection(a, h.nodes), a.remove()))
                    });
                    y.onMouseUp.apply(this, arguments)
                }
            };
            f.prototype.placeBubbles = function(a) {
                var b = this.checkOverlap,
                    f = this.positionBubble,
                    c = [],
                    h = 1,
                    e = 0,
                    d = 0;
                var g = [];
                var k;
                a = a.sort(function(a, b) {
                    return b[2] - a[2]
                });
                if (a.length) {
                    c.push([
                        [0, 0, a[0][2], a[0][3], a[0][4]]
                    ]);
                    if (1 < a.length)
                        for (c.push([
                                [0, 0 - a[1][2] - a[0][2], a[1][2], a[1][3], a[1][4]]
                            ]), k = 2; k < a.length; k++) a[k][2] = a[k][2] || 1, g = f(c[h][e], c[h -
                            1][d], a[k]), b(g, c[h][0]) ? (c.push([]), d = 0, c[h + 1].push(f(c[h][e], c[h][0], a[k])), h++, e = 0) : 1 < h && c[h - 1][d + 1] && b(g, c[h - 1][d + 1]) ? (d++, c[h].push(f(c[h][e], c[h - 1][d], a[k])), e++) : (e++, c[h].push(g));
                    this.chart.stages = c;
                    this.chart.rawPositions = [].concat.apply([], c);
                    this.resizeRadius();
                    g = this.chart.rawPositions
                }
                return g
            };
            f.prototype.pointAttribs = function(a, b) {
                var f = this.options,
                    c = f.marker;
                a && a.isParentNode && f.layoutAlgorithm && f.layoutAlgorithm.parentNodeOptions && (c = f.layoutAlgorithm.parentNodeOptions.marker);
                f = c.fillOpacity;
                a = k.prototype.pointAttribs.call(this, a, b);
                1 !== f && (a["fill-opacity"] = f);
                return a
            };
            f.prototype.positionBubble = function(a, b, f) {
                var c = Math.sqrt,
                    h = Math.asin,
                    e = Math.acos,
                    d = Math.pow,
                    g = Math.abs;
                c = c(d(a[0] - b[0], 2) + d(a[1] - b[1], 2));
                e = e((d(c, 2) + d(f[2] + b[2], 2) - d(f[2] + a[2], 2)) / (2 * (f[2] + b[2]) * c));
                h = h(g(a[0] - b[0]) / c);
                a = (0 > a[1] - b[1] ? 0 : Math.PI) + e + h * (0 > (a[0] - b[0]) * (a[1] - b[1]) ? 1 : -1);
                return [b[0] + (b[2] + f[2]) * Math.sin(a), b[1] - (b[2] + f[2]) * Math.cos(a), f[2], f[3], f[4]]
            };
            f.prototype.render = function() {
                var a = [];
                k.prototype.render.apply(this, arguments);
                this.options.dataLabels.allowOverlap || (this.data.forEach(function(b) {
                    q(b.dataLabels) && b.dataLabels.forEach(function(b) {
                        a.push(b)
                    })
                }), this.options.useSimulation && this.chart.hideOverlappingLabels(a))
            };
            f.prototype.resizeRadius = function() {
                var a = this.chart,
                    b = a.rawPositions,
                    f = Math.min,
                    c = Math.max,
                    e = a.plotLeft,
                    d = a.plotTop,
                    g = a.plotHeight,
                    k = a.plotWidth,
                    l, n, m;
                var p = l = Number.POSITIVE_INFINITY;
                var z = n = Number.NEGATIVE_INFINITY;
                for (m = 0; m < b.length; m++) {
                    var q = b[m][2];
                    p = f(p,
                        b[m][0] - q);
                    z = c(z, b[m][0] + q);
                    l = f(l, b[m][1] - q);
                    n = c(n, b[m][1] + q)
                }
                m = [z - p, n - l];
                f = f.apply([], [(k - e) / m[0], (g - d) / m[1]]);
                if (1e-10 < Math.abs(f - 1)) {
                    for (m = 0; m < b.length; m++) b[m][2] *= f;
                    this.placeBubbles(b)
                } else a.diffY = g / 2 + d - l - (n - l) / 2, a.diffX = k / 2 + e - p - (z - p) / 2
            };
            f.prototype.seriesBox = function() {
                var a = this.chart,
                    b = Math.max,
                    f = Math.min,
                    c, e = [a.plotLeft, a.plotLeft + a.plotWidth, a.plotTop, a.plotTop + a.plotHeight];
                this.data.forEach(function(a) {
                    g(a.plotX) && g(a.plotY) && a.marker.radius && (c = a.marker.radius, e[0] = f(e[0], a.plotX - c),
                        e[1] = b(e[1], a.plotX + c), e[2] = f(e[2], a.plotY - c), e[3] = b(e[3], a.plotY + c))
                });
                return H(e.width / e.height) ? e : null
            };
            f.prototype.setVisible = function() {
                var a = this;
                k.prototype.setVisible.apply(a, arguments);
                a.parentNodeLayout && a.graph ? a.visible ? (a.graph.show(), a.parentNode.dataLabel && a.parentNode.dataLabel.show()) : (a.graph.hide(), a.parentNodeLayout.removeElementFromCollection(a.parentNode, a.parentNodeLayout.nodes), a.parentNode.dataLabel && a.parentNode.dataLabel.hide()) : a.layout && (a.visible ? a.layout.addElementsToCollection(a.points,
                    a.layout.nodes) : a.points.forEach(function(b) {
                    a.layout.removeElementFromCollection(b, a.layout.nodes)
                }))
            };
            f.prototype.translate = function() {
                var a = this.chart,
                    b = this.data,
                    f = this.index,
                    c, e = this.options.useSimulation;
                this.processedXData = this.xData;
                this.generatePoints();
                g(a.allDataPoints) || (a.allDataPoints = this.accumulateAllPoints(this), this.getPointRadius());
                if (e) var d = a.allDataPoints;
                else d = this.placeBubbles(a.allDataPoints), this.options.draggable = !1;
                for (c = 0; c < d.length; c++)
                    if (d[c][3] === f) {
                        var k = b[d[c][4]];
                        var l = I(d[c][2], void 0);
                        e || (k.plotX = d[c][0] - a.plotLeft + a.diffX, k.plotY = d[c][1] - a.plotTop + a.diffY);
                        H(l) && (k.marker = m(k.marker, {
                            radius: l,
                            width: 2 * l,
                            height: 2 * l
                        }), k.radius = l)
                    }
                e && this.deferLayout();
                n(this, "afterTranslate")
            };
            f.defaultOptions = A(x.defaultOptions, {
                minSize: "10%",
                maxSize: "50%",
                sizeBy: "area",
                zoneAxis: "y",
                crisp: !1,
                tooltip: {
                    pointFormat: "Value: {point.value}"
                },
                draggable: !0,
                useSimulation: !0,
                parentNode: {
                    allowPointSelect: !1
                },
                dataLabels: {
                    formatter: function() {
                        var a = this.series.chart.numberFormatter,
                            b =
                            this.point.value;
                        return H(b) ? a(b, -1) : ""
                    },
                    parentNodeFormatter: function() {
                        return this.name
                    },
                    parentNodeTextPath: {
                        enabled: !0
                    },
                    padding: 0,
                    style: {
                        transition: "opacity 2000ms"
                    }
                },
                layoutAlgorithm: {
                    initialPositions: "circle",
                    initialPositionRadius: 20,
                    bubblePadding: 5,
                    parentNodeLimit: !1,
                    seriesInteraction: !0,
                    dragBetweenSeries: !1,
                    parentNodeOptions: {
                        maxIterations: 400,
                        gravitationalConstant: .03,
                        maxSpeed: 50,
                        initialPositionRadius: 100,
                        seriesInteraction: !0,
                        marker: {
                            fillColor: null,
                            fillOpacity: 1,
                            lineWidth: null,
                            lineColor: null,
                            symbol: "circle"
                        }
                    },
                    enableSimulation: !0,
                    type: "packedbubble",
                    integration: "packedbubble",
                    maxIterations: 1E3,
                    splitSeries: !1,
                    maxSpeed: 5,
                    gravitationalConstant: .01,
                    friction: -.981
                }
            });
            return f
        }(x);
        m(d.prototype, {
            alignDataLabel: k.prototype.alignDataLabel,
            axisTypes: [],
            directTouch: !0,
            forces: ["barycenter", "repulsive"],
            hasDraggableNodes: !0,
            isCartesian: !1,
            noSharedTooltip: !0,
            onMouseDown: y.onMouseDown,
            onMouseMove: y.onMouseMove,
            pointArrayMap: ["value"],
            pointClass: l,
            pointValKey: "value",
            redrawHalo: y.redrawHalo,
            requireSorting: !1,
            searchPoint: e.noop,
            trackerGroups: ["group", "dataLabelsGroup", "parentNodesGroup"]
        });
        a.registerSeriesType("packedbubble", d);
        "";
        "";
        return d
    });
    A(d, "Series/Polygon/PolygonSeries.js", [d["Core/Globals.js"], d["Core/Legend/LegendSymbol.js"], d["Core/Series/SeriesRegistry.js"], d["Core/Utilities.js"]], function(d, e, l, a) {
        var c = this && this.__extends || function() {
            var a = function(b, c) {
                a = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array && function(a, b) {
                    a.__proto__ = b
                } || function(a, b) {
                    for (var c in b) b.hasOwnProperty(c) &&
                        (a[c] = b[c])
                };
                return a(b, c)
            };
            return function(b, c) {
                function e() {
                    this.constructor = b
                }
                a(b, c);
                b.prototype = null === c ? Object.create(c) : (e.prototype = c.prototype, new e)
            }
        }();
        d = d.noop;
        var t = l.series,
            p = l.seriesTypes,
            k = p.area,
            x = p.line,
            w = p.scatter;
        p = a.extend;
        var b = a.merge;
        a = function(a) {
            function e() {
                var b = null !== a && a.apply(this, arguments) || this;
                b.data = void 0;
                b.options = void 0;
                b.points = void 0;
                return b
            }
            c(e, a);
            e.prototype.getGraphPath = function() {
                for (var a = x.prototype.getGraphPath.call(this), b = a.length + 1; b--;)(b === a.length ||
                    "M" === a[b][0]) && 0 < b && a.splice(b, 0, ["Z"]);
                return this.areaPath = a
            };
            e.prototype.drawGraph = function() {
                this.options.fillColor = this.color;
                k.prototype.drawGraph.call(this)
            };
            e.defaultOptions = b(w.defaultOptions, {
                marker: {
                    enabled: !1,
                    states: {
                        hover: {
                            enabled: !1
                        }
                    }
                },
                stickyTracking: !1,
                tooltip: {
                    followPointer: !0,
                    pointFormat: ""
                },
                trackByArea: !0
            });
            return e
        }(w);
        p(a.prototype, {
            type: "polygon",
            drawLegendSymbol: e.drawRectangle,
            drawTracker: t.prototype.drawTracker,
            setStackedPoints: d
        });
        l.registerSeriesType("polygon", a);
        "";
        return a
    });
    A(d, "Core/Axis/WaterfallAxis.js", [d["Extensions/Stacking.js"], d["Core/Utilities.js"]], function(d, e) {
        var l = e.addEvent,
            a = e.objectEach,
            c;
        (function(c) {
            function e() {
                var a = this.waterfall.stacks;
                a && (a.changed = !1, delete a.alreadyChanged)
            }

            function k() {
                var a = this.options.stackLabels;
                a && a.enabled && this.waterfall.stacks && this.waterfall.renderStackTotals()
            }

            function x() {
                for (var a = this.axes, b = this.series, c = b.length; c--;) b[c].options.stacking && (a.forEach(function(a) {
                        a.isXAxis || (a.waterfall.stacks.changed = !0)
                    }), c =
                    0)
            }

            function w() {
                this.waterfall || (this.waterfall = new b(this))
            }
            var b = function() {
                function b(a) {
                    this.axis = a;
                    this.stacks = {
                        changed: !1
                    }
                }
                b.prototype.renderStackTotals = function() {
                    var b = this.axis,
                        c = b.waterfall.stacks,
                        e = b.stacking && b.stacking.stackTotalGroup,
                        g = new d(b, b.options.stackLabels, !1, 0, void 0);
                    this.dummyStackItem = g;
                    a(c, function(b) {
                        a(b, function(a) {
                            g.total = a.stackTotal;
                            a.label && (g.label = a.label);
                            d.prototype.render.call(g, e);
                            a.label = g.label;
                            delete g.label
                        })
                    });
                    g.total = null
                };
                return b
            }();
            c.Composition = b;
            c.compose = function(a, b) {
                l(a, "init", w);
                l(a, "afterBuildStacks", e);
                l(a, "afterRender", k);
                l(b, "beforeRedraw", x)
            }
        })(c || (c = {}));
        return c
    });
    A(d, "Series/Waterfall/WaterfallPoint.js", [d["Series/Column/ColumnSeries.js"], d["Core/Series/Point.js"], d["Core/Utilities.js"]], function(d, e, l) {
        var a = this && this.__extends || function() {
                var a = function(c, e) {
                    a = Object.setPrototypeOf || {
                        __proto__: []
                    }
                    instanceof Array && function(a, c) {
                        a.__proto__ = c
                    } || function(a, c) {
                        for (var b in c) c.hasOwnProperty(b) && (a[b] = c[b])
                    };
                    return a(c, e)
                };
                return function(c,
                    e) {
                    function d() {
                        this.constructor = c
                    }
                    a(c, e);
                    c.prototype = null === e ? Object.create(e) : (d.prototype = e.prototype, new d)
                }
            }(),
            c = l.isNumber;
        return function(d) {
            function l() {
                var a = null !== d && d.apply(this, arguments) || this;
                a.options = void 0;
                a.series = void 0;
                return a
            }
            a(l, d);
            l.prototype.getClassName = function() {
                var a = e.prototype.getClassName.call(this);
                this.isSum ? a += " highcharts-sum" : this.isIntermediateSum && (a += " highcharts-intermediate-sum");
                return a
            };
            l.prototype.isValid = function() {
                return c(this.y) || this.isSum || !!this.isIntermediateSum
            };
            return l
        }(d.prototype.pointClass)
    });
    A(d, "Series/Waterfall/WaterfallSeries.js", [d["Core/Axis/Axis.js"], d["Core/Chart/Chart.js"], d["Core/Series/SeriesRegistry.js"], d["Core/Utilities.js"], d["Core/Axis/WaterfallAxis.js"], d["Series/Waterfall/WaterfallPoint.js"]], function(d, e, l, a, c, t) {
        var p = this && this.__extends || function() {
                var a = function(b, c) {
                    a = Object.setPrototypeOf || {
                        __proto__: []
                    }
                    instanceof Array && function(a, b) {
                        a.__proto__ = b
                    } || function(a, b) {
                        for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c])
                    };
                    return a(b, c)
                };
                return function(b, c) {
                    function f() {
                        this.constructor = b
                    }
                    a(b, c);
                    b.prototype = null === c ? Object.create(c) : (f.prototype = c.prototype, new f)
                }
            }(),
            k = l.seriesTypes,
            x = k.column,
            w = k.line,
            b = a.arrayMax,
            g = a.arrayMin,
            m = a.correctFloat;
        k = a.extend;
        var n = a.isNumber,
            q = a.merge,
            A = a.objectEach,
            J = a.pick;
        a = function(a) {
            function c() {
                var b = null !== a && a.apply(this, arguments) || this;
                b.chart = void 0;
                b.data = void 0;
                b.options = void 0;
                b.points = void 0;
                b.stackedYNeg = void 0;
                b.stackedYPos = void 0;
                b.stackKey = void 0;
                b.xData = void 0;
                b.yAxis = void 0;
                b.yData =
                    void 0;
                return b
            }
            p(c, a);
            c.prototype.generatePoints = function() {
                var a;
                x.prototype.generatePoints.apply(this);
                var b = 0;
                for (a = this.points.length; b < a; b++) {
                    var c = this.points[b];
                    var e = this.processedYData[b];
                    if (c.isIntermediateSum || c.isSum) c.y = m(e)
                }
            };
            c.prototype.translate = function() {
                var a = this.options,
                    b = this.yAxis,
                    c = J(a.minPointLength, 5),
                    e = c / 2,
                    d = a.threshold || 0,
                    g = d,
                    k = d;
                a = a.stacking;
                var l = b.waterfall.stacks[this.stackKey];
                x.prototype.translate.apply(this);
                for (var m = this.points, p = 0; p < m.length; p++) {
                    var q = m[p];
                    var w = this.processedYData[p];
                    var C = q.shapeArgs;
                    if (C && n(w)) {
                        var t = [0, w];
                        var D = q.y;
                        if (a) {
                            if (l) {
                                t = l[p];
                                if ("overlap" === a) {
                                    var y = t.stackState[t.stateIndex--];
                                    y = 0 <= D ? y : y - D;
                                    Object.hasOwnProperty.call(t, "absolutePos") && delete t.absolutePos;
                                    Object.hasOwnProperty.call(t, "absoluteNeg") && delete t.absoluteNeg
                                } else 0 <= D ? (y = t.threshold + t.posTotal, t.posTotal -= D) : (y = t.threshold + t.negTotal, t.negTotal -= D, y -= D), !t.posTotal && Object.hasOwnProperty.call(t, "absolutePos") && (t.posTotal = t.absolutePos, delete t.absolutePos), !t.negTotal && Object.hasOwnProperty.call(t, "absoluteNeg") && (t.negTotal = t.absoluteNeg, delete t.absoluteNeg);
                                q.isSum || (t.connectorThreshold = t.threshold + t.stackTotal);
                                b.reversed ? (w = 0 <= D ? y - D : y + D, D = y) : (w = y, D = y - D);
                                q.below = w <= d;
                                C.y = b.translate(w, !1, !0, !1, !0) || 0;
                                C.height = Math.abs(C.y - (b.translate(D, !1, !0, !1, !0) || 0));
                                if (D = b.waterfall.dummyStackItem) D.x = p, D.label = l[p].label, D.setOffset(this.pointXOffset || 0, this.barW || 0, this.stackedYNeg[p], this.stackedYPos[p])
                            }
                        } else y = Math.max(g, g + D) + t[0], C.y = b.translate(y, !1, !0, !1, !0) || 0, q.isSum ? (C.y = b.translate(t[1], !1, !0, !1, !0) || 0, C.height = Math.min(b.translate(t[0], !1, !0, !1, !0) || 0, b.len) - C.y, q.below = t[1] <= d) : q.isIntermediateSum ? (0 <= D ? (w = t[1] + k, D = k) : (w = k, D = t[1] + k), b.reversed && (w ^= D, D ^= w, w ^= D), C.y = b.translate(w, !1, !0, !1, !0) || 0, C.height = Math.abs(C.y - Math.min(b.translate(D, !1, !0, !1, !0) || 0, b.len)), k += t[1], q.below = w <= d) : (C.height = 0 < w ? (b.translate(g, !1, !0, !1, !0) || 0) - C.y : (b.translate(g, !1, !0, !1, !0) || 0) - (b.translate(g - w, !1, !0, !1, !0) || 0), g += w, q.below = g < d), 0 > C.height && (C.y += C.height,
                            C.height *= -1);
                        q.plotY = C.y = Math.round(C.y || 0) - this.borderWidth % 2 / 2;
                        C.height = Math.max(Math.round(C.height || 0), .001);
                        q.yBottom = C.y + C.height;
                        C.height <= c && !q.isNull ? (C.height = c, C.y -= e, q.plotY = C.y, q.minPointLengthOffset = 0 > q.y ? -e : e) : (q.isNull && (C.width = 0), q.minPointLengthOffset = 0);
                        D = q.plotY + (q.negative ? C.height : 0);
                        q.below && (q.plotY += C.height);
                        q.tooltipPos && (this.chart.inverted ? q.tooltipPos[0] = b.len - D : q.tooltipPos[1] = D)
                    }
                }
            };
            c.prototype.processData = function(b) {
                var c = this.options,
                    e = this.yData,
                    d = c.data,
                    g = e.length,
                    k = c.threshold || 0,
                    l, n, p, q, t;
                for (t = n = l = p = q = 0; t < g; t++) {
                    var z = e[t];
                    var w = d && d[t] ? d[t] : {};
                    "sum" === z || w.isSum ? e[t] = m(n) : "intermediateSum" === z || w.isIntermediateSum ? (e[t] = m(l), l = 0) : (n += z, l += z);
                    p = Math.min(n, p);
                    q = Math.max(n, q)
                }
                a.prototype.processData.call(this, b);
                c.stacking || (this.dataMin = p + k, this.dataMax = q)
            };
            c.prototype.toYData = function(a) {
                return a.isSum ? "sum" : a.isIntermediateSum ? "intermediateSum" : a.y
            };
            c.prototype.updateParallelArrays = function(b, c) {
                a.prototype.updateParallelArrays.call(this, b, c);
                if ("sum" ===
                    this.yData[0] || "intermediateSum" === this.yData[0]) this.yData[0] = null
            };
            c.prototype.pointAttribs = function(a, b) {
                var c = this.options.upColor;
                c && !a.options.color && (a.color = 0 < a.y ? c : null);
                a = x.prototype.pointAttribs.call(this, a, b);
                delete a.dashstyle;
                return a
            };
            c.prototype.getGraphPath = function() {
                return [
                    ["M", 0, 0]
                ]
            };
            c.prototype.getCrispPath = function() {
                var a = this.data,
                    b = this.yAxis,
                    c = a.length,
                    e = Math.round(this.graph.strokeWidth()) % 2 / 2,
                    d = Math.round(this.borderWidth) % 2 / 2,
                    g = this.xAxis.reversed,
                    k = this.yAxis.reversed,
                    l = this.options.stacking,
                    m = [],
                    n;
                for (n = 1; n < c; n++) {
                    var p = a[n].shapeArgs;
                    var q = a[n - 1];
                    var t = a[n - 1].shapeArgs;
                    var w = b.waterfall.stacks[this.stackKey];
                    var x = 0 < q.y ? -t.height : 0;
                    w && t && p && (w = w[n - 1], l ? (w = w.connectorThreshold, x = Math.round(b.translate(w, 0, 1, 0, 1) + (k ? x : 0)) - e) : x = t.y + q.minPointLengthOffset + d - e, m.push(["M", (t.x || 0) + (g ? 0 : t.width || 0), x], ["L", (p.x || 0) + (g ? p.width || 0 : 0), x]));
                    t && m.length && (!l && 0 > q.y && !k || 0 < q.y && k) && ((q = m[m.length - 2]) && "number" === typeof q[2] && (q[2] += t.height || 0), (q = m[m.length - 1]) && "number" ===
                        typeof q[2] && (q[2] += t.height || 0))
                }
                return m
            };
            c.prototype.drawGraph = function() {
                w.prototype.drawGraph.call(this);
                this.graph.attr({
                    d: this.getCrispPath()
                })
            };
            c.prototype.setStackedPoints = function() {
                function a(a, b, c, f) {
                    if (J)
                        for (c; c < J; c++) A.stackState[c] += f;
                    else A.stackState[0] = a, J = A.stackState.length;
                    A.stackState.push(A.stackState[J - 1] + b)
                }
                var b = this.options,
                    c = this.yAxis.waterfall.stacks,
                    e = b.threshold,
                    d = e || 0,
                    g = d,
                    k = this.stackKey,
                    l = this.xData,
                    m = l.length,
                    n, p, q;
                this.yAxis.stacking.usePercentage = !1;
                var t = p = q =
                    d;
                if (this.visible || !this.chart.options.chart.ignoreHiddenSeries) {
                    var w = c.changed;
                    (n = c.alreadyChanged) && 0 > n.indexOf(k) && (w = !0);
                    c[k] || (c[k] = {});
                    n = c[k];
                    for (var x = 0; x < m; x++) {
                        var y = l[x];
                        if (!n[y] || w) n[y] = {
                            negTotal: 0,
                            posTotal: 0,
                            stackTotal: 0,
                            threshold: 0,
                            stateIndex: 0,
                            stackState: [],
                            label: w && n[y] ? n[y].label : void 0
                        };
                        var A = n[y];
                        var G = this.yData[x];
                        0 <= G ? A.posTotal += G : A.negTotal += G;
                        var F = b.data[x];
                        y = A.absolutePos = A.posTotal;
                        var H = A.absoluteNeg = A.negTotal;
                        A.stackTotal = y + H;
                        var J = A.stackState.length;
                        F && F.isIntermediateSum ?
                            (a(q, p, 0, q), q = p, p = e, d ^= g, g ^= d, d ^= g) : F && F.isSum ? (a(e, t, J), d = e) : (a(d, G, 0, t), F && (t += G, p += G));
                        A.stateIndex++;
                        A.threshold = d;
                        d += A.stackTotal
                    }
                    c.changed = !1;
                    c.alreadyChanged || (c.alreadyChanged = []);
                    c.alreadyChanged.push(k)
                }
            };
            c.prototype.getExtremes = function() {
                var a = this.options.stacking;
                if (a) {
                    var c = this.yAxis;
                    c = c.waterfall.stacks;
                    var e = this.stackedYNeg = [];
                    var d = this.stackedYPos = [];
                    "overlap" === a ? A(c[this.stackKey], function(a) {
                        e.push(g(a.stackState));
                        d.push(b(a.stackState))
                    }) : A(c[this.stackKey], function(a) {
                        e.push(a.negTotal +
                            a.threshold);
                        d.push(a.posTotal + a.threshold)
                    });
                    return {
                        dataMin: g(e),
                        dataMax: b(d)
                    }
                }
                return {
                    dataMin: this.dataMin,
                    dataMax: this.dataMax
                }
            };
            c.defaultOptions = q(x.defaultOptions, {
                dataLabels: {
                    inside: !0
                },
                lineWidth: 1,
                lineColor: "#333333",
                dashStyle: "Dot",
                borderColor: "#333333",
                states: {
                    hover: {
                        lineWidthPlus: 0
                    }
                }
            });
            return c
        }(x);
        k(a.prototype, {
            getZonesGraphs: w.prototype.getZonesGraphs,
            pointValKey: "y",
            showLine: !0,
            pointClass: t
        });
        l.registerSeriesType("waterfall", a);
        c.compose(d, e);
        "";
        return a
    });
    A(d, "Extensions/Polar.js", [d["Core/Animation/AnimationUtilities.js"],
        d["Core/Chart/Chart.js"], d["Core/Globals.js"], d["Extensions/Pane.js"], d["Core/Pointer.js"], d["Core/Series/Series.js"], d["Core/Series/SeriesRegistry.js"], d["Core/Renderer/SVG/SVGRenderer.js"], d["Core/Utilities.js"]
    ], function(d, e, l, a, c, t, p, k, x) {
        var w = d.animObject;
        p = p.seriesTypes;
        var b = x.addEvent,
            g = x.defined,
            m = x.find,
            n = x.isNumber,
            q = x.pick,
            A = x.splat,
            J = x.uniqueKey;
        d = x.wrap;
        var I = t.prototype;
        c = c.prototype;
        I.searchPointByAngle = function(a) {
            var b = this.chart,
                c = this.xAxis.pane.center;
            return this.searchKDTree({
                clientX: 180 +
                    -180 / Math.PI * Math.atan2(a.chartX - c[0] - b.plotLeft, a.chartY - c[1] - b.plotTop)
            })
        };
        I.getConnectors = function(a, b, c, e) {
            var f = e ? 1 : 0;
            var d = 0 <= b && b <= a.length - 1 ? b : 0 > b ? a.length - 1 + b : 0;
            b = 0 > d - 1 ? a.length - (1 + f) : d - 1;
            f = d + 1 > a.length - 1 ? f : d + 1;
            var g = a[b];
            f = a[f];
            var h = g.plotX;
            g = g.plotY;
            var k = f.plotX;
            var l = f.plotY;
            f = a[d].plotX;
            d = a[d].plotY;
            h = (1.5 * f + h) / 2.5;
            g = (1.5 * d + g) / 2.5;
            k = (1.5 * f + k) / 2.5;
            var r = (1.5 * d + l) / 2.5;
            l = Math.sqrt(Math.pow(h - f, 2) + Math.pow(g - d, 2));
            var n = Math.sqrt(Math.pow(k - f, 2) + Math.pow(r - d, 2));
            h = Math.atan2(g - d, h - f);
            r =
                Math.PI / 2 + (h + Math.atan2(r - d, k - f)) / 2;
            Math.abs(h - r) > Math.PI / 2 && (r -= Math.PI);
            h = f + Math.cos(r) * l;
            g = d + Math.sin(r) * l;
            k = f + Math.cos(Math.PI + r) * n;
            r = d + Math.sin(Math.PI + r) * n;
            f = {
                rightContX: k,
                rightContY: r,
                leftContX: h,
                leftContY: g,
                plotX: f,
                plotY: d
            };
            c && (f.prevPointCont = this.getConnectors(a, b, !1, e));
            return f
        };
        I.toXY = function(a) {
            var b = this.chart,
                c = this.xAxis,
                f = this.yAxis,
                d = a.plotX,
                e = a.plotY,
                g = a.series,
                k = b.inverted,
                l = a.y,
                m = k ? d : f.len - e;
            k && g && !g.isRadialBar && (a.plotY = e = "number" === typeof l ? f.translate(l) || 0 : 0);
            a.rectPlotX =
                d;
            a.rectPlotY = e;
            f.center && (m += f.center[3] / 2);
            n(e) && (f = k ? f.postTranslate(e, m) : c.postTranslate(d, m), a.plotX = a.polarPlotX = f.x - b.plotLeft, a.plotY = a.polarPlotY = f.y - b.plotTop);
            this.kdByAngle ? (b = (d / Math.PI * 180 + c.pane.options.startAngle) % 360, 0 > b && (b += 360), a.clientX = b) : a.clientX = a.plotX
        };
        p.spline && (d(p.spline.prototype, "getPointSpline", function(a, b, c, d) {
            this.chart.polar ? d ? (a = this.getConnectors(b, d, !0, this.connectEnds), b = a.prevPointCont && a.prevPointCont.rightContX, c = a.prevPointCont && a.prevPointCont.rightContY,
                a = ["C", n(b) ? b : a.plotX, n(c) ? c : a.plotY, n(a.leftContX) ? a.leftContX : a.plotX, n(a.leftContY) ? a.leftContY : a.plotY, a.plotX, a.plotY]) : a = ["M", c.plotX, c.plotY] : a = a.call(this, b, c, d);
            return a
        }), p.areasplinerange && (p.areasplinerange.prototype.getPointSpline = p.spline.prototype.getPointSpline));
        b(t, "afterTranslate", function() {
            var a = this.chart;
            if (a.polar && this.xAxis) {
                (this.kdByAngle = a.tooltip && a.tooltip.shared) ? this.searchPoint = this.searchPointByAngle: this.options.findNearestPointBy = "xy";
                if (!this.preventPostTranslate)
                    for (var c =
                            this.points, d = c.length; d--;) this.toXY(c[d]), !a.hasParallelCoordinates && !this.yAxis.reversed && c[d].y < this.yAxis.min && (c[d].isNull = !0);
                this.hasClipCircleSetter || (this.hasClipCircleSetter = !!this.eventsToUnbind.push(b(this, "afterRender", function() {
                    if (a.polar) {
                        var b = this.yAxis.pane.center;
                        this.clipCircle ? this.clipCircle.animate({
                            x: b[0],
                            y: b[1],
                            r: b[2] / 2,
                            innerR: b[3] / 2
                        }) : this.clipCircle = a.renderer.clipCircle(b[0], b[1], b[2] / 2, b[3] / 2);
                        this.group.clip(this.clipCircle);
                        this.setClip = l.noop
                    }
                })))
            }
        }, {
            order: 2
        });
        d(p.line.prototype,
            "getGraphPath",
            function(a, b) {
                var c = this,
                    d;
                if (this.chart.polar) {
                    b = b || this.points;
                    for (d = 0; d < b.length; d++)
                        if (!b[d].isNull) {
                            var e = d;
                            break
                        }
                    if (!1 !== this.options.connectEnds && "undefined" !== typeof e) {
                        this.connectEnds = !0;
                        b.splice(b.length, 0, b[e]);
                        var f = !0
                    }
                    b.forEach(function(a) {
                        "undefined" === typeof a.polarPlotY && c.toXY(a)
                    })
                }
                d = a.apply(this, [].slice.call(arguments, 1));
                f && b.pop();
                return d
            });
        var y = function(a, b) {
            var c = this,
                d = this.chart,
                e = this.options.animation,
                f = this.group,
                g = this.markerGroup,
                h = this.xAxis && this.xAxis.center,
                k = d.plotLeft,
                n = d.plotTop,
                m, p, t, x;
            if (d.polar)
                if (c.isRadialBar) b || (c.startAngleRad = q(c.translatedThreshold, c.xAxis.startAngleRad), l.seriesTypes.pie.prototype.animate.call(c, b));
                else {
                    if (d.renderer.isSVG)
                        if (e = w(e), c.is("column")) {
                            if (!b) {
                                var y = h[3] / 2;
                                c.points.forEach(function(a) {
                                    m = a.graphic;
                                    t = (p = a.shapeArgs) && p.r;
                                    x = p && p.innerR;
                                    m && p && (m.attr({
                                        r: y,
                                        innerR: y
                                    }), m.animate({
                                        r: t,
                                        innerR: x
                                    }, c.options.animation))
                                })
                            }
                        } else b ? (a = {
                            translateX: h[0] + k,
                            translateY: h[1] + n,
                            scaleX: .001,
                            scaleY: .001
                        }, f.attr(a), g && g.attr(a)) : (a = {
                            translateX: k,
                            translateY: n,
                            scaleX: 1,
                            scaleY: 1
                        }, f.animate(a, e), g && g.animate(a, e))
                }
            else a.call(this, b)
        };
        d(I, "animate", y);
        if (p.column) {
            var z = p.arearange.prototype;
            p = p.column.prototype;
            p.polarArc = function(a, b, c, d) {
                var e = this.xAxis.center,
                    f = this.yAxis.len,
                    g = e[3] / 2;
                b = f - b + g;
                a = f - q(a, f) + g;
                this.yAxis.reversed && (0 > b && (b = g), 0 > a && (a = g));
                return {
                    x: e[0],
                    y: e[1],
                    r: b,
                    innerR: a,
                    start: c,
                    end: d
                }
            };
            d(p, "animate", y);
            d(p, "translate", function(a) {
                var b = this.options,
                    c = b.stacking,
                    d = this.chart,
                    e = this.xAxis,
                    f = this.yAxis,
                    k = f.reversed,
                    l = f.center,
                    m = e.startAngleRad,
                    p = e.endAngleRad - m;
                this.preventPostTranslate = !0;
                a.call(this);
                if (e.isRadial) {
                    a = this.points;
                    e = a.length;
                    var q = f.translate(f.min);
                    var t = f.translate(f.max);
                    b = b.threshold || 0;
                    if (d.inverted && n(b)) {
                        var w = f.translate(b);
                        g(w) && (0 > w ? w = 0 : w > p && (w = p), this.translatedThreshold = w + m)
                    }
                    for (; e--;) {
                        b = a[e];
                        var y = b.barX;
                        var z = b.x;
                        var A = b.y;
                        b.shapeType = "arc";
                        if (d.inverted) {
                            b.plotY = f.translate(A);
                            if (c && f.stacking) {
                                if (A = f.stacking.stacks[(0 > A ? "-" : "") + this.stackKey], this.visible && A && A[z] && !b.isNull) {
                                    var G =
                                        A[z].points[this.getStackIndicator(void 0, z, this.index).key];
                                    var F = f.translate(G[0]);
                                    G = f.translate(G[1]);
                                    g(F) && (F = x.clamp(F, 0, p))
                                }
                            } else F = w, G = b.plotY;
                            F > G && (G = [F, F = G][0]);
                            if (!k)
                                if (F < q) F = q;
                                else if (G > t) G = t;
                            else {
                                if (G < q || F > t) F = G = 0
                            } else if (G > q) G = q;
                            else if (F < t) F = t;
                            else if (F > q || G < t) F = G = p;
                            f.min > f.max && (F = G = k ? p : 0);
                            F += m;
                            G += m;
                            l && (b.barX = y += l[3] / 2);
                            z = Math.max(y, 0);
                            A = Math.max(y + b.pointWidth, 0);
                            b.shapeArgs = {
                                x: l && l[0],
                                y: l && l[1],
                                r: A,
                                innerR: z,
                                start: F,
                                end: G
                            };
                            b.opacity = F === G ? 0 : void 0;
                            b.plotY = (g(this.translatedThreshold) &&
                                (F < this.translatedThreshold ? F : G)) - m
                        } else F = y + m, b.shapeArgs = this.polarArc(b.yBottom, b.plotY, F, F + b.pointWidth);
                        this.toXY(b);
                        d.inverted ? (y = f.postTranslate(b.rectPlotY, y + b.pointWidth / 2), b.tooltipPos = [y.x - d.plotLeft, y.y - d.plotTop]) : b.tooltipPos = [b.plotX, b.plotY];
                        l && (b.ttBelow = b.plotY > l[1])
                    }
                }
            });
            p.findAlignments = function(a, b) {
                null === b.align && (b.align = 20 < a && 160 > a ? "left" : 200 < a && 340 > a ? "right" : "center");
                null === b.verticalAlign && (b.verticalAlign = 45 > a || 315 < a ? "bottom" : 135 < a && 225 > a ? "top" : "middle");
                return b
            };
            z && (z.findAlignments =
                p.findAlignments);
            d(p, "alignDataLabel", function(a, b, c, d, e, g) {
                var f = this.chart,
                    h = q(d.inside, !!this.options.stacking);
                f.polar ? (a = b.rectPlotX / Math.PI * 180, f.inverted ? (this.forceDL = f.isInsidePlot(b.plotX, Math.round(b.plotY)), h && b.shapeArgs ? (e = b.shapeArgs, e = this.yAxis.postTranslate(((e.start || 0) + (e.end || 0)) / 2 - this.xAxis.startAngleRad, b.barX + b.pointWidth / 2), e = {
                    x: e.x - f.plotLeft,
                    y: e.y - f.plotTop
                }) : b.tooltipPos && (e = {
                    x: b.tooltipPos[0],
                    y: b.tooltipPos[1]
                }), d.align = q(d.align, "center"), d.verticalAlign = q(d.verticalAlign,
                    "middle")) : this.findAlignments && (d = this.findAlignments(a, d)), I.alignDataLabel.call(this, b, c, d, e, g), this.isRadialBar && b.shapeArgs && b.shapeArgs.start === b.shapeArgs.end && c.hide(!0)) : a.call(this, b, c, d, e, g)
            })
        }
        d(c, "getCoordinates", function(a, b) {
            var c = this.chart,
                d = {
                    xAxis: [],
                    yAxis: []
                };
            c.polar ? c.axes.forEach(function(a) {
                var e = a.isXAxis,
                    f = a.center;
                if ("colorAxis" !== a.coll) {
                    var g = b.chartX - f[0] - c.plotLeft;
                    f = b.chartY - f[1] - c.plotTop;
                    d[e ? "xAxis" : "yAxis"].push({
                        axis: a,
                        value: a.translate(e ? Math.PI - Math.atan2(g, f) : Math.sqrt(Math.pow(g,
                            2) + Math.pow(f, 2)), !0)
                    })
                }
            }) : d = a.call(this, b);
            return d
        });
        k.prototype.clipCircle = function(a, b, c, d) {
            var e = J(),
                f = this.createElement("clipPath").attr({
                    id: e
                }).add(this.defs);
            a = d ? this.arc(a, b, c, d, 0, 2 * Math.PI).add(f) : this.circle(a, b, c).add(f);
            a.id = e;
            a.clipPath = f;
            return a
        };
        b(e, "getAxes", function() {
            this.pane || (this.pane = []);
            this.options.pane = A(this.options.pane);
            this.options.pane.forEach(function(b) {
                new a(b, this)
            }, this)
        });
        b(e, "afterDrawChartBox", function() {
            this.pane.forEach(function(a) {
                a.render()
            })
        });
        b(t, "afterInit",
            function() {
                var a = this.chart;
                a.inverted && a.polar && (this.isRadialSeries = !0, this.is("column") && (this.isRadialBar = !0))
            });
        d(e.prototype, "get", function(a, b) {
            return m(this.pane || [], function(a) {
                return a.options.id === b
            }) || a.call(this, b)
        })
    });
    A(d, "masters/highcharts-more.src.js", [d["Core/Globals.js"], d["Core/Axis/RadialAxis.js"], d["Series/Bubble/BubbleSeries.js"]], function(d, e, l) {
        e.compose(d.Axis, d.Tick);
        l.compose(d.Chart, d.Legend, d.Series)
    })
});
//# sourceMappingURL=highcharts-more.js.map

/*
 Highcharts JS v9.3.3 (2022-02-01)

 Data module

 (c) 2012-2021 Torstein Honsi

 License: www.highcharts.com/license
*/
'use strict';
(function(b) {
    "object" === typeof module && module.exports ? (b["default"] = b, module.exports = b) : "function" === typeof define && define.amd ? define("highcharts/modules/data", ["highcharts"], function(p) {
        b(p);
        b.Highcharts = p;
        return b
    }) : b("undefined" !== typeof Highcharts ? Highcharts : void 0)
})(function(b) {
    function p(b, h, w, p) { b.hasOwnProperty(h) || (b[h] = p.apply(null, w)) }
    b = b ? b._modules : {};
    p(b, "Core/HttpUtilities.js", [b["Core/Globals.js"], b["Core/Utilities.js"]], function(b, h) {
        var w = b.doc,
            p = h.createElement,
            v = h.discardElement,
            q = h.merge,
            E = h.objectEach,
            x = {
                ajax: function(b) {
                    var m = q(!0, { url: !1, type: "get", dataType: "json", success: !1, error: !1, data: !1, headers: {} }, b);
                    b = { json: "application/json", xml: "application/xml", text: "text/plain", octet: "application/octet-stream" };
                    var h = new XMLHttpRequest;
                    if (!m.url) return !1;
                    h.open(m.type.toUpperCase(), m.url, !0);
                    m.headers["Content-Type"] || h.setRequestHeader("Content-Type", b[m.dataType] || b.text);
                    E(m.headers, function(b, m) { h.setRequestHeader(m, b) });
                    h.onreadystatechange = function() {
                        if (4 === h.readyState) {
                            if (200 ===
                                h.status) {
                                var b = h.responseText;
                                if ("json" === m.dataType) try { b = JSON.parse(b) } catch (B) { m.error && m.error(h, B); return }
                                return m.success && m.success(b)
                            }
                            m.error && m.error(h, h.responseText)
                        }
                    };
                    try { m.data = JSON.stringify(m.data) } catch (F) {}
                    h.send(m.data || !0)
                },
                getJSON: function(b, h) { x.ajax({ url: b, success: h, dataType: "json", headers: { "Content-Type": "text/plain" } }) },
                post: function(b, h, x) {
                    var m = p("form", q({ method: "post", action: b, enctype: "multipart/form-data" }, x), { display: "none" }, w.body);
                    E(h, function(b, h) {
                        p("input", {
                            type: "hidden",
                            name: h,
                            value: b
                        }, null, m)
                    });
                    m.submit();
                    v(m)
                }
            };
        "";
        return x
    });
    p(b, "Extensions/Data.js", [b["Core/Chart/Chart.js"], b["Core/Globals.js"], b["Core/HttpUtilities.js"], b["Core/Series/Point.js"], b["Core/Series/SeriesRegistry.js"], b["Core/Utilities.js"]], function(b, h, p, H, I, q) {
        var v = h.doc,
            x = p.ajax,
            w = I.seriesTypes;
        p = q.addEvent;
        var m = q.defined,
            J = q.extend,
            F = q.fireEvent,
            B = q.isNumber,
            C = q.merge,
            K = q.objectEach,
            D = q.pick,
            L = q.splat;
        q = function() {
            function b(a, c, g) {
                this.options = this.rawColumns = this.firstRowAsNames = this.chartOptions =
                    this.chart = void 0;
                this.dateFormats = {
                    "YYYY/mm/dd": { regex: /^([0-9]{4})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{1,2})$/, parser: function(a) { return a ? Date.UTC(+a[1], a[2] - 1, +a[3]) : NaN } },
                    "dd/mm/YYYY": { regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{4})$/, parser: function(a) { return a ? Date.UTC(+a[3], a[2] - 1, +a[1]) : NaN }, alternative: "mm/dd/YYYY" },
                    "mm/dd/YYYY": { regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{4})$/, parser: function(a) { return a ? Date.UTC(+a[3], a[1] - 1, +a[2]) : NaN } },
                    "dd/mm/YY": {
                        regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{2})$/,
                        parser: function(a) {
                            if (!a) return NaN;
                            var c = +a[3];
                            c = c > (new Date).getFullYear() - 2E3 ? c + 1900 : c + 2E3;
                            return Date.UTC(c, a[2] - 1, +a[1])
                        },
                        alternative: "mm/dd/YY"
                    },
                    "mm/dd/YY": { regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{2})$/, parser: function(a) { return a ? Date.UTC(+a[3] + 2E3, a[1] - 1, +a[2]) : NaN } }
                };
                this.init(a, c, g)
            }
            b.prototype.init = function(a, c, g) {
                var d = a.decimalPoint;
                c && (this.chartOptions = c);
                g && (this.chart = g);
                "." !== d && "," !== d && (d = void 0);
                this.options = a;
                this.columns = a.columns || this.rowsToColumns(a.rows) || [];
                this.firstRowAsNames = D(a.firstRowAsNames, this.firstRowAsNames, !0);
                this.decimalRegex = d && new RegExp("^(-?[0-9]+)" + d + "([0-9]+)$");
                this.rawColumns = [];
                if (this.columns.length) { this.dataFound(); var e = !0 }
                this.hasURLOption(a) && (clearTimeout(this.liveDataTimeout), e = !1);
                e || (e = this.fetchLiveData());
                e || (e = !!this.parseCSV().length);
                e || (e = !!this.parseTable().length);
                e || (e = this.parseGoogleSpreadsheet());
                !e && a.afterComplete && a.afterComplete()
            };
            b.prototype.hasURLOption = function(a) {
                return !(!a || !(a.rowsURL || a.csvURL ||
                    a.columnsURL))
            };
            b.prototype.getColumnDistribution = function() {
                var a = this.chartOptions,
                    c = this.options,
                    g = [],
                    d = function(a) { return (w[a || "line"].prototype.pointArrayMap || [0]).length },
                    e = a && a.chart && a.chart.type,
                    b = [],
                    l = [],
                    n = 0;
                c = c && c.seriesMapping || a && a.series && a.series.map(function() { return { x: 0 } }) || [];
                var f;
                (a && a.series || []).forEach(function(a) { b.push(d(a.type || e)) });
                c.forEach(function(a) { g.push(a.x || 0) });
                0 === g.length && g.push(0);
                c.forEach(function(c) {
                    var g = new G,
                        k = b[n] || d(e),
                        h = (a && a.series || [])[n] || {},
                        u =
                        w[h.type || e || "line"].prototype.pointArrayMap,
                        p = u || ["y"];
                    (m(c.x) || h.isCartesian || !u) && g.addColumnReader(c.x, "x");
                    K(c, function(a, c) { "x" !== c && g.addColumnReader(a, c) });
                    for (f = 0; f < k; f++) g.hasReader(p[f]) || g.addColumnReader(void 0, p[f]);
                    l.push(g);
                    n++
                });
                c = w[e || "line"].prototype.pointArrayMap;
                "undefined" === typeof c && (c = ["y"]);
                this.valueCount = { global: d(e), xColumns: g, individual: b, seriesBuilders: l, globalPointArrayMap: c }
            };
            b.prototype.dataFound = function() {
                this.options.switchRowsAndColumns && (this.columns = this.rowsToColumns(this.columns));
                this.getColumnDistribution();
                this.parseTypes();
                !1 !== this.parsed() && this.complete()
            };
            b.prototype.parseCSV = function(a) {
                function c(a, c, g, d) {
                    function b(c) {
                        k = a[c];
                        l = a[c - 1];
                        r = a[c + 1]
                    }

                    function e(a) {
                        m.length < y + 1 && m.push([a]);
                        m[y][m[y].length - 1] !== a && m[y].push(a)
                    }

                    function n() { f > t || t > h ? (++t, u = "") : (!isNaN(parseFloat(u)) && isFinite(u) ? (u = parseFloat(u), e("number")) : isNaN(Date.parse(u)) ? e("string") : (u = u.replace(/\//g, "-"), e("date")), p.length < y + 1 && p.push([]), g || (p[y][c] = u), u = "", ++y, ++t) }
                    var z = 0,
                        k = "",
                        l = "",
                        r = "",
                        u = "",
                        t = 0,
                        y = 0;
                    if (a.trim().length && "#" !== a.trim()[0]) {
                        for (; z < a.length; z++)
                            if (b(z), '"' === k)
                                for (b(++z); z < a.length && ('"' !== k || '"' === l || '"' === r);) {
                                    if ('"' !== k || '"' === k && '"' !== l) u += k;
                                    b(++z)
                                } else d && d[k] ? d[k](k, u) && n() : k === q ? n() : u += k;
                        n()
                    }
                }

                function g(a) {
                    var c = 0,
                        g = 0,
                        d = !1;
                    a.some(function(a, d) {
                        var b = !1,
                            e = "";
                        if (13 < d) return !0;
                        for (var k = 0; k < a.length; k++) {
                            d = a[k];
                            var n = a[k + 1];
                            var l = a[k - 1];
                            if ("#" === d) break;
                            if ('"' === d)
                                if (b) {
                                    if ('"' !== l && '"' !== n) {
                                        for (;
                                            " " === n && k < a.length;) n = a[++k];
                                        "undefined" !== typeof t[n] && t[n]++;
                                        b = !1
                                    }
                                } else b = !0;
                            else "undefined" !== typeof t[d] ? (e = e.trim(), isNaN(Date.parse(e)) ? !isNaN(e) && isFinite(e) || t[d]++ : t[d]++, e = "") : e += d;
                            "," === d && g++;
                            "." === d && c++
                        }
                    });
                    d = t[";"] > t[","] ? ";" : ",";
                    b.decimalPoint || (b.decimalPoint = c > g ? "." : ",", e.decimalRegex = new RegExp("^(-?[0-9]+)" + b.decimalPoint + "([0-9]+)$"));
                    return d
                }

                function d(a, c) {
                    var d = [],
                        g = 0,
                        k = !1,
                        n = [],
                        l = [],
                        f;
                    if (!c || c > a.length) c = a.length;
                    for (; g < c; g++)
                        if ("undefined" !== typeof a[g] && a[g] && a[g].length) {
                            var r = a[g].trim().replace(/\//g, " ").replace(/\-/g, " ").replace(/\./g, " ").split(" ");
                            d = ["", "", ""];
                            for (f = 0; f < r.length; f++) f < d.length && (r[f] = parseInt(r[f], 10), r[f] && (l[f] = !l[f] || l[f] < r[f] ? r[f] : l[f], "undefined" !== typeof n[f] ? n[f] !== r[f] && (n[f] = !1) : n[f] = r[f], 31 < r[f] ? d[f] = 100 > r[f] ? "YY" : "YYYY" : 12 < r[f] && 31 >= r[f] ? (d[f] = "dd", k = !0) : d[f].length || (d[f] = "mm")))
                        }
                    if (k) {
                        for (f = 0; f < n.length; f++) !1 !== n[f] ? 12 < l[f] && "YY" !== d[f] && "YYYY" !== d[f] && (d[f] = "YY") : 12 < l[f] && "mm" === d[f] && (d[f] = "dd");
                        3 === d.length && "dd" === d[1] && "dd" === d[2] && (d[2] = "YY");
                        a = d.join("/");
                        return (b.dateFormats || e.dateFormats)[a] ? a : (F("deduceDateFailed"),
                            "YYYY/mm/dd")
                    }
                    return "YYYY/mm/dd"
                }
                var e = this,
                    b = a || this.options,
                    l = b.csv;
                a = "undefined" !== typeof b.startRow && b.startRow ? b.startRow : 0;
                var n = b.endRow || Number.MAX_VALUE,
                    f = "undefined" !== typeof b.startColumn && b.startColumn ? b.startColumn : 0,
                    h = b.endColumn || Number.MAX_VALUE,
                    r = 0,
                    m = [],
                    t = { ",": 0, ";": 0, "\t": 0 };
                var p = this.columns = [];
                l && b.beforeParse && (l = b.beforeParse.call(this, l));
                if (l) {
                    l = l.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split(b.lineDelimiter || "\n");
                    if (!a || 0 > a) a = 0;
                    if (!n || n >= l.length) n = l.length - 1;
                    if (b.itemDelimiter) var q =
                        b.itemDelimiter;
                    else q = null, q = g(l);
                    var A = 0;
                    for (r = a; r <= n; r++) "#" === l[r][0] ? A++ : c(l[r], r - a - A);
                    b.columnTypes && 0 !== b.columnTypes.length || !m.length || !m[0].length || "date" !== m[0][1] || b.dateFormat || (b.dateFormat = d(p[0]));
                    this.dataFound()
                }
                return p
            };
            b.prototype.parseTable = function() {
                var a = this.options,
                    c = a.table,
                    g = this.columns || [],
                    d = a.startRow || 0,
                    b = a.endRow || Number.MAX_VALUE,
                    k = a.startColumn || 0,
                    l = a.endColumn || Number.MAX_VALUE;
                c && ("string" === typeof c && (c = v.getElementById(c)), [].forEach.call(c.getElementsByTagName("tr"),
                    function(a, c) {
                        c >= d && c <= b && [].forEach.call(a.children, function(a, b) {
                            var e = g[b - k],
                                f = 1;
                            if (("TD" === a.tagName || "TH" === a.tagName) && b >= k && b <= l)
                                for (g[b - k] || (g[b - k] = []), g[b - k][c - d] = a.innerHTML; c - d >= f && void 0 === e[c - d - f];) e[c - d - f] = null, f++
                        })
                    }), this.dataFound());
                return g
            };
            b.prototype.fetchLiveData = function() {
                function a(e) {
                    function f(f, n, h) {
                        function r() { k && g.liveDataURL === f && (c.liveDataTimeout = setTimeout(a, l)) }
                        if (!f || !/^(http|\/|\.\/|\.\.\/)/.test(f)) return f && d.error && d.error("Invalid URL"), !1;
                        e && (clearTimeout(c.liveDataTimeout),
                            g.liveDataURL = f);
                        x({
                            url: f,
                            dataType: h || "json",
                            success: function(a) {
                                g && g.series && n(a);
                                r()
                            },
                            error: function(a, c) { 3 > ++b && r(); return d.error && d.error(c, a) }
                        });
                        return !0
                    }
                    f(n.csvURL, function(a) { g.update({ data: { csv: a } }) }, "text") || f(n.rowsURL, function(a) { g.update({ data: { rows: a } }) }) || f(n.columnsURL, function(a) { g.update({ data: { columns: a } }) })
                }
                var c = this,
                    g = this.chart,
                    d = this.options,
                    b = 0,
                    k = d.enablePolling,
                    l = 1E3 * (d.dataRefreshRate || 2),
                    n = C(d);
                if (!this.hasURLOption(d)) return !1;
                1E3 > l && (l = 1E3);
                delete d.csvURL;
                delete d.rowsURL;
                delete d.columnsURL;
                a(!0);
                return this.hasURLOption(d)
            };
            b.prototype.parseGoogleSpreadsheet = function() {
                function a(c) {
                    var b = ["https://sheets.googleapis.com/v4/spreadsheets", d, "values", l(), "?alt=json&majorDimension=COLUMNS&valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING&key=" + g.googleAPIKey].join("/");
                    x({
                        url: b,
                        dataType: "json",
                        success: function(d) {
                            c(d);
                            g.enablePolling && setTimeout(function() { a(c) }, k)
                        },
                        error: function(a, c) { return g.error && g.error(c, a) }
                    })
                }
                var c = this,
                    g = this.options,
                    d = g.googleSpreadsheetKey,
                    b = this.chart,
                    k = Math.max(1E3 * (g.dataRefreshRate || 2), 4E3),
                    l = function() {
                        if (g.googleSpreadsheetRange) return g.googleSpreadsheetRange;
                        var a = ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(g.startColumn || 0) || "A") + ((g.startRow || 0) + 1),
                            c = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(D(g.endColumn, -1)) || "ZZ";
                        m(g.endRow) && (c += g.endRow + 1);
                        return a + ":" + c
                    };
                d && (delete g.googleSpreadsheetKey, a(function(a) {
                    a = a.values;
                    if (!a || 0 === a.length) return !1;
                    var d = a.reduce(function(a, c) { return Math.max(a, c.length) }, 0);
                    a.forEach(function(a) {
                        for (var c =
                                0; c < d; c++) "undefined" === typeof a[c] && (a[c] = null)
                    });
                    b && b.series ? b.update({ data: { columns: a } }) : (c.columns = a, c.dataFound())
                }));
                return !1
            };
            b.prototype.trim = function(a, c) { "string" === typeof a && (a = a.replace(/^\s+|\s+$/g, ""), c && /^[0-9\s]+$/.test(a) && (a = a.replace(/\s/g, "")), this.decimalRegex && (a = a.replace(this.decimalRegex, "$1.$2"))); return a };
            b.prototype.parseTypes = function() { for (var a = this.columns, c = a.length; c--;) this.parseColumn(a[c], c) };
            b.prototype.parseColumn = function(a, c) {
                var b = this.rawColumns,
                    d = this.columns,
                    e = a.length,
                    k = this.firstRowAsNames,
                    l = -1 !== this.valueCount.xColumns.indexOf(c),
                    n, f = [],
                    h = this.chartOptions,
                    m, p = (this.options.columnTypes || [])[c];
                h = l && (h && h.xAxis && "category" === L(h.xAxis)[0].type || "string" === p);
                for (b[c] || (b[c] = []); e--;) {
                    var t = f[e] || a[e];
                    var q = this.trim(t);
                    var A = this.trim(t, !0);
                    var v = parseFloat(A);
                    "undefined" === typeof b[c][e] && (b[c][e] = q);
                    h || 0 === e && k ? a[e] = "" + q : +A === v ? (a[e] = v, 31536E6 < v && "float" !== p ? a.isDatetime = !0 : a.isNumeric = !0, "undefined" !== typeof a[e + 1] && (m = v > a[e + 1])) : (q && q.length &&
                        (n = this.parseDate(t)), l && B(n) && "float" !== p ? (f[e] = t, a[e] = n, a.isDatetime = !0, "undefined" !== typeof a[e + 1] && (t = n > a[e + 1], t !== m && "undefined" !== typeof m && (this.alternativeFormat ? (this.dateFormat = this.alternativeFormat, e = a.length, this.alternativeFormat = this.dateFormats[this.dateFormat].alternative) : a.unsorted = !0), m = t)) : (a[e] = "" === q ? null : q, 0 !== e && (a.isDatetime || a.isNumeric) && (a.mixed = !0)))
                }
                l && a.mixed && (d[c] = b[c]);
                if (l && m && this.options.sort)
                    for (c = 0; c < d.length; c++) d[c].reverse(), k && d[c].unshift(d[c].pop())
            };
            b.prototype.parseDate = function(a) {
                var c = this.options.parseDate,
                    b, d = this.options.dateFormat || this.dateFormat,
                    e;
                if (c) var k = c(a);
                else if ("string" === typeof a) {
                    if (d)(c = this.dateFormats[d]) || (c = this.dateFormats["YYYY/mm/dd"]), (e = a.match(c.regex)) && (k = c.parser(e));
                    else
                        for (b in this.dateFormats)
                            if (c = this.dateFormats[b], e = a.match(c.regex)) {
                                this.dateFormat = b;
                                this.alternativeFormat = c.alternative;
                                k = c.parser(e);
                                break
                            }
                    e || (a.match(/:.+(GMT|UTC|[Z+-])/) && (a = a.replace(/\s*(?:GMT|UTC)?([+-])(\d\d)(\d\d)$/, "$1$2:$3").replace(/(?:\s+|GMT|UTC)([+-])/,
                        "$1").replace(/(\d)\s*(?:GMT|UTC|Z)$/, "$1+00:00")), e = Date.parse(a), "object" === typeof e && null !== e && e.getTime ? k = e.getTime() - 6E4 * e.getTimezoneOffset() : B(e) && (k = e - 6E4 * (new Date(e)).getTimezoneOffset()))
                }
                return k
            };
            b.prototype.rowsToColumns = function(a) { var c, b; if (a) { var d = []; var e = a.length; for (c = 0; c < e; c++) { var k = a[c].length; for (b = 0; b < k; b++) d[b] || (d[b] = []), d[b][c] = a[c][b] } } return d };
            b.prototype.getData = function() { if (this.columns) return this.rowsToColumns(this.columns).slice(1) };
            b.prototype.parsed = function() {
                if (this.options.parsed) return this.options.parsed.call(this,
                    this.columns)
            };
            b.prototype.getFreeIndexes = function(a, c) {
                var b, d = [],
                    e = [];
                for (b = 0; b < a; b += 1) d.push(!0);
                for (a = 0; a < c.length; a += 1) { var k = c[a].getReferencedColumnIndexes(); for (b = 0; b < k.length; b += 1) d[k[b]] = !1 }
                for (b = 0; b < d.length; b += 1) d[b] && e.push(b);
                return e
            };
            b.prototype.complete = function() {
                var a = this.columns,
                    c, b = this.options,
                    d, e, k = [];
                if (b.complete || b.afterComplete) {
                    if (this.firstRowAsNames)
                        for (d = 0; d < a.length; d++) {
                            var l = a[d];
                            m(l.name) || (l.name = D(l.shift(), "").toString())
                        }
                    l = [];
                    var h = this.getFreeIndexes(a.length,
                        this.valueCount.seriesBuilders);
                    for (d = 0; d < this.valueCount.seriesBuilders.length; d++) {
                        var f = this.valueCount.seriesBuilders[d];
                        f.populateColumns(h) && k.push(f)
                    }
                    for (; 0 < h.length;) {
                        f = new G;
                        f.addColumnReader(0, "x");
                        d = h.indexOf(0); - 1 !== d && h.splice(d, 1);
                        for (d = 0; d < this.valueCount.global; d++) f.addColumnReader(void 0, this.valueCount.globalPointArrayMap[d]);
                        f.populateColumns(h) && k.push(f)
                    }
                    0 < k.length && 0 < k[0].readers.length && (f = a[k[0].readers[0].columnIndex], "undefined" !== typeof f && (f.isDatetime ? c = "datetime" : f.isNumeric ||
                        (c = "category")));
                    if ("category" === c)
                        for (d = 0; d < k.length; d++)
                            for (f = k[d], h = 0; h < f.readers.length; h++) "x" === f.readers[h].configName && (f.readers[h].configName = "name");
                    for (d = 0; d < k.length; d++) {
                        f = k[d];
                        h = [];
                        for (e = 0; e < a[0].length; e++) h[e] = f.read(a, e);
                        l[d] = { data: h };
                        f.name && (l[d].name = f.name);
                        "category" === c && (l[d].turboThreshold = 0)
                    }
                    a = { series: l };
                    c && (a.xAxis = { type: c }, "category" === c && (a.xAxis.uniqueNames = !1));
                    b.complete && b.complete(a);
                    b.afterComplete && b.afterComplete(a)
                }
            };
            b.prototype.update = function(a, c) {
                var b = this.chart;
                a && (a.afterComplete = function(a) { a && (a.xAxis && b.xAxis[0] && a.xAxis.type === b.xAxis[0].options.type && delete a.xAxis, b.update(a, c, !0)) }, C(!0, b.options.data, a), this.init(b.options.data))
            };
            return b
        }();
        h.data = function(b, a, c) { return new h.Data(b, a, c) };
        p(b, "init", function(b) {
            var a = this,
                c = b.args[0] || {},
                g = b.args[1];
            c && c.data && !a.hasDataDef && (a.hasDataDef = !0, a.data = new h.Data(J(c.data, {
                afterComplete: function(b) {
                    var d;
                    if (Object.hasOwnProperty.call(c, "series"))
                        if ("object" === typeof c.series)
                            for (d = Math.max(c.series.length,
                                    b && b.series ? b.series.length : 0); d--;) {
                                var k = c.series[d] || {};
                                c.series[d] = C(k, b && b.series ? b.series[d] : {})
                            } else delete c.series;
                    c = C(b, c);
                    a.init(c, g)
                }
            }), c, a), b.preventDefault())
        });
        var G = function() {
            function b() {
                this.readers = [];
                this.pointIsArray = !0;
                this.name = void 0
            }
            b.prototype.populateColumns = function(a) {
                var b = !0;
                this.readers.forEach(function(b) { "undefined" === typeof b.columnIndex && (b.columnIndex = a.shift()) });
                this.readers.forEach(function(a) { "undefined" === typeof a.columnIndex && (b = !1) });
                return b
            };
            b.prototype.read =
                function(a, b) {
                    var c = this.pointIsArray,
                        d = c ? [] : {};
                    this.readers.forEach(function(e) {
                        var g = a[e.columnIndex][b];
                        c ? d.push(g) : 0 < e.configName.indexOf(".") ? H.prototype.setNestedProperty(d, g, e.configName) : d[e.configName] = g
                    });
                    if ("undefined" === typeof this.name && 2 <= this.readers.length) {
                        var e = this.getReferencedColumnIndexes();
                        2 <= e.length && (e.shift(), e.sort(function(a, b) { return a - b }), this.name = a[e.shift()].name)
                    }
                    return d
                };
            b.prototype.addColumnReader = function(a, b) {
                this.readers.push({ columnIndex: a, configName: b });
                "x" !== b && "y" !== b && "undefined" !== typeof b && (this.pointIsArray = !1)
            };
            b.prototype.getReferencedColumnIndexes = function() { var a, b = []; for (a = 0; a < this.readers.length; a += 1) { var g = this.readers[a]; "undefined" !== typeof g.columnIndex && b.push(g.columnIndex) } return b };
            b.prototype.hasReader = function(a) { var b; for (b = 0; b < this.readers.length; b += 1) { var g = this.readers[b]; if (g.configName === a) return !0 } };
            return b
        }();
        h.Data = q;
        return h.Data
    });
    p(b, "masters/modules/data.src.js", [b["Core/Globals.js"], b["Core/HttpUtilities.js"],
        b["Extensions/Data.js"]
    ], function(b, h, p) {
        b.ajax = h.ajax;
        b.getJSON = h.getJSON;
        b.post = h.post;
        b.Data = p;
        b.HttpUtilities = h
    })
});
//# sourceMappingURL=data.js.map

/*
 Highcharts JS v9.3.3 (2022-02-01)

 (c) 2009-2021 Torstein Honsi

 License: www.highcharts.com/license
*/
'use strict';
(function(k) {
    "object" === typeof module && module.exports ? (k["default"] = k, module.exports = k) : "function" === typeof define && define.amd ? define("highcharts/modules/series-label", ["highcharts"], function(u) {
        k(u);
        k.Highcharts = u;
        return k
    }) : k("undefined" !== typeof Highcharts ? Highcharts : void 0)
})(function(k) {
    function u(k, A, y, u) { k.hasOwnProperty(A) || (k[A] = u.apply(null, y)) }
    k = k ? k._modules : {};
    u(k, "Extensions/SeriesLabel.js", [k["Core/Animation/AnimationUtilities.js"], k["Core/Chart/Chart.js"], k["Core/FormatUtilities.js"],
        k["Core/DefaultOptions.js"], k["Core/Series/Series.js"], k["Core/Renderer/SVG/SVGRenderer.js"], k["Core/Utilities.js"]
    ], function(k, u, y, K, E, F, x) {
        function C(b, c, a, f, d, e) { b = (e - c) * (a - b) - (f - c) * (d - b); return 0 < b ? !0 : !(0 > b) }

        function D(b, c, a, f, d, e, r, h) { return C(b, c, d, e, r, h) !== C(a, f, d, e, r, h) && C(b, c, a, f, d, e) !== C(b, c, a, f, r, h) }

        function A(b, c, a, f, d, e, r, h) { return D(b, c, b + a, c, d, e, r, h) || D(b + a, c, b + a, c + f, d, e, r, h) || D(b, c + f, b + a, c + f, d, e, r, h) || D(b, c, b, c + f, d, e, r, h) }

        function I(b) {
            if (this.renderer) {
                var c = this,
                    a = G(c.renderer.globalAnimation).duration;
                c.labelSeries = [];
                c.labelSeriesMaxSum = 0;
                x.clearTimeout(c.seriesLabelTimer);
                c.series.forEach(function(f) {
                    var d = f.options.label,
                        e = f.labelBySeries,
                        r = e && e.closest;
                    d.enabled && f.visible && (f.graph || f.area) && !f.isSeriesBoosting && (c.labelSeries.push(f), d.minFontSize && d.maxFontSize && (f.sum = f.yData.reduce(function(a, b) { return (a || 0) + (b || 0) }, 0), c.labelSeriesMaxSum = Math.max(c.labelSeriesMaxSum, f.sum)), "load" === b.type && (a = Math.max(a, G(f.options.animation).duration)), r && ("undefined" !== typeof r[0].plotX ? e.animate({
                        x: r[0].plotX +
                            r[1],
                        y: r[0].plotY + r[2]
                    }) : e.attr({ opacity: 0 })))
                });
                c.seriesLabelTimer = L(function() { c.series && c.labelSeries && c.drawSeriesLabels() }, c.renderer.forExport || !a ? 0 : a)
            }
        }
        var G = k.animObject,
            M = y.format;
        k = K.setOptions;
        F = F.prototype.symbols;
        y = x.addEvent;
        var J = x.extend,
            N = x.fireEvent,
            H = x.isNumber,
            B = x.pick,
            L = x.syncTimeout;
        "";
        k({
            plotOptions: {
                series: {
                    label: {
                        enabled: !0,
                        connectorAllowed: !1,
                        connectorNeighbourDistance: 24,
                        format: void 0,
                        formatter: void 0,
                        minFontSize: null,
                        maxFontSize: null,
                        onArea: null,
                        style: { fontWeight: "bold" },
                        boxesToAvoid: []
                    }
                }
            }
        });
        F.connector = function(b, c, a, f, d) {
            var e = d && d.anchorX;
            d = d && d.anchorY;
            var r = a / 2;
            if (H(e) && H(d)) {
                var h = [
                    ["M", e, d]
                ];
                var n = c - d;
                0 > n && (n = -f - n);
                n < a && (r = e < b + a / 2 ? n : a - n);
                d > c + f ? h.push(["L", b + r, c + f]) : d < c ? h.push(["L", b + r, c]) : e < b ? h.push(["L", b, c + f / 2]) : e > b + a && h.push(["L", b + a, c + f / 2])
            }
            return h || []
        };
        E.prototype.getPointsOnGraph = function() {
            function b(b) {
                var c = Math.round(b.plotX / 8) + "," + Math.round(b.plotY / 8);
                p[c] || (p[c] = 1, a.push(b))
            }
            if (this.xAxis || this.yAxis) {
                var c = this.points,
                    a = [],
                    f = this.graph || this.area,
                    d = f.element,
                    e = this.chart.inverted,
                    r = this.xAxis,
                    h = this.yAxis,
                    n = e ? h.pos : r.pos;
                e = e ? r.pos : h.pos;
                r = B(this.options.label.onArea, !!this.area);
                h = h.getThreshold(this.options.threshold);
                var p = {},
                    k;
                if (this.getPointSpline && d.getPointAtLength && !r && c.length < this.chart.plotSizeX / 16) {
                    if (f.toD) {
                        var g = f.attr("d");
                        f.attr({ d: f.toD })
                    }
                    var m = d.getTotalLength();
                    for (k = 0; k < m; k += 16) {
                        var l = d.getPointAtLength(k);
                        b({ chartX: n + l.x, chartY: e + l.y, plotX: l.x, plotY: l.y })
                    }
                    g && f.attr({ d: g });
                    l = c[c.length - 1];
                    l.chartX = n + l.plotX;
                    l.chartY = e +
                        l.plotY;
                    b(l)
                } else
                    for (m = c.length, k = 0; k < m; k += 1) {
                        l = c[k];
                        f = c[k - 1];
                        l.chartX = n + l.plotX;
                        l.chartY = e + l.plotY;
                        r && (l.chartCenterY = e + (l.plotY + B(l.yBottom, h)) / 2);
                        if (0 < k && (d = Math.abs(l.chartX - f.chartX), g = Math.abs(l.chartY - f.chartY), d = Math.max(d, g), 16 < d))
                            for (d = Math.ceil(d / 16), g = 1; g < d; g += 1) b({ chartX: f.chartX + g / d * (l.chartX - f.chartX), chartY: f.chartY + g / d * (l.chartY - f.chartY), chartCenterY: f.chartCenterY + g / d * (l.chartCenterY - f.chartCenterY), plotX: f.plotX + g / d * (l.plotX - f.plotX), plotY: f.plotY + g / d * (l.plotY - f.plotY) });
                        H(l.plotY) &&
                            b(l)
                    }
                return a
            }
        };
        E.prototype.labelFontSize = function(b, c) { return b + this.sum / this.chart.labelSeriesMaxSum * (c - b) + "px" };
        E.prototype.checkClearPoint = function(b, c, a, f) {
            var d = this.chart,
                e = B(this.options.label.onArea, !!this.area),
                k = e || this.options.label.connectorAllowed,
                h = Number.MAX_VALUE,
                n = Number.MAX_VALUE,
                p, z;
            for (z = 0; z < d.boxesToAvoid.length; z += 1) { var g = d.boxesToAvoid[z]; var m = b + a.width; var l = c; var t = c + a.height; if (!(b > g.right || m < g.left || l > g.bottom || t < g.top)) return !1 }
            for (z = 0; z < d.series.length; z += 1)
                if (l = d.series[z],
                    g = l.interpolatedPoints, l.visible && g) {
                    for (m = 1; m < g.length; m += 1) {
                        if (g[m].chartX >= b - 16 && g[m - 1].chartX <= b + a.width + 16) {
                            if (A(b, c, a.width, a.height, g[m - 1].chartX, g[m - 1].chartY, g[m].chartX, g[m].chartY)) return !1;
                            this === l && !p && f && (p = A(b - 16, c - 16, a.width + 32, a.height + 32, g[m - 1].chartX, g[m - 1].chartY, g[m].chartX, g[m].chartY))
                        }
                        if ((k || p) && (this !== l || e)) {
                            t = b + a.width / 2 - g[m].chartX;
                            var u = c + a.height / 2 - g[m].chartY;
                            h = Math.min(h, t * t + u * u)
                        }
                    }
                    if (!e && k && this === l && (f && !p || h < Math.pow(this.options.label.connectorNeighbourDistance,
                            2))) {
                        for (m = 1; m < g.length; m += 1)
                            if (p = Math.min(Math.pow(b + a.width / 2 - g[m].chartX, 2) + Math.pow(c + a.height / 2 - g[m].chartY, 2), Math.pow(b - g[m].chartX, 2) + Math.pow(c - g[m].chartY, 2), Math.pow(b + a.width - g[m].chartX, 2) + Math.pow(c - g[m].chartY, 2), Math.pow(b + a.width - g[m].chartX, 2) + Math.pow(c + a.height - g[m].chartY, 2), Math.pow(b - g[m].chartX, 2) + Math.pow(c + a.height - g[m].chartY, 2)), p < n) { n = p; var w = g[m] }
                        p = !0
                    }
                }
            return !f || p ? { x: b, y: c, weight: h - (w ? n : 0), connectorPoint: w } : !1
        };
        u.prototype.drawSeriesLabels = function() {
            var b = this,
                c = this.labelSeries;
            b.boxesToAvoid = [];
            c.forEach(function(a) {
                a.interpolatedPoints = a.getPointsOnGraph();
                (a.options.label.boxesToAvoid || []).forEach(function(a) { b.boxesToAvoid.push(a) })
            });
            b.series.forEach(function(a) {
                function c(a, b, c) {
                    var d = Math.max(u, B(y, -Infinity)),
                        e = Math.min(u + m, B(A, Infinity));
                    return a > d && a <= e - c.width && b >= g && b <= g + l - c.height
                }
                var d = a.options.label;
                if (d && (a.xAxis || a.yAxis)) {
                    var e = "highcharts-color-" + B(a.colorIndex, "none"),
                        k = !a.labelBySeries,
                        h = d.minFontSize,
                        n = d.maxFontSize,
                        p = b.inverted,
                        u = p ? a.yAxis.pos : a.xAxis.pos,
                        g = p ? a.xAxis.pos : a.yAxis.pos,
                        m = b.inverted ? a.yAxis.len : a.xAxis.len,
                        l = b.inverted ? a.xAxis.len : a.yAxis.len,
                        t = a.interpolatedPoints,
                        x = B(d.onArea, !!a.area),
                        w = [],
                        q, v = a.labelBySeries;
                    if (x && !p) { p = [a.xAxis.toPixels(a.xData[0]), a.xAxis.toPixels(a.xData[a.xData.length - 1])]; var y = Math.min.apply(Math, p); var A = Math.max.apply(Math, p) }
                    if (a.visible && !a.isSeriesBoosting && t) {
                        v || (v = a.name, "string" === typeof d.format ? v = M(d.format, a, b) : d.formatter && (v = d.formatter.call(a)), a.labelBySeries = v = b.renderer.label(v, 0, -9999, "connector").addClass("highcharts-series-label highcharts-series-label-" +
                            a.index + " " + (a.options.className || "") + " " + e), b.renderer.styledMode || (v.css(J({ color: x ? b.renderer.getContrast(a.color) : a.color }, d.style || {})), v.attr({ opacity: b.renderer.forExport ? 1 : 0, stroke: a.color, "stroke-width": 1 })), h && n && v.css({ fontSize: a.labelFontSize(h, n) }), v.attr({ padding: 0, zIndex: 3 }).add());
                        e = v.getBBox();
                        e.width = Math.round(e.width);
                        for (p = t.length - 1; 0 < p; --p) x ? (h = t[p].chartX - e.width / 2, n = t[p].chartCenterY - e.height / 2, c(h, n, e) && (q = a.checkClearPoint(h, n, e))) : (h = t[p].chartX + 3, n = t[p].chartY - e.height -
                            3, c(h, n, e) && (q = a.checkClearPoint(h, n, e, !0)), q && w.push(q), h = t[p].chartX + 3, n = t[p].chartY + 3, c(h, n, e) && (q = a.checkClearPoint(h, n, e, !0)), q && w.push(q), h = t[p].chartX - e.width - 3, n = t[p].chartY + 3, c(h, n, e) && (q = a.checkClearPoint(h, n, e, !0)), q && w.push(q), h = t[p].chartX - e.width - 3, n = t[p].chartY - e.height - 3, c(h, n, e) && (q = a.checkClearPoint(h, n, e, !0))), q && w.push(q);
                        if (d.connectorAllowed && !w.length && !x)
                            for (h = u + m - e.width; h >= u; h -= 16)
                                for (n = g; n < g + l - e.height; n += 16)(q = a.checkClearPoint(h, n, e, !0)) && w.push(q);
                        if (w.length) {
                            if (w.sort(function(a,
                                    b) { return b.weight - a.weight }), q = w[0], b.boxesToAvoid.push({ left: q.x, right: q.x + e.width, top: q.y, bottom: q.y + e.height }), (t = Math.sqrt(Math.pow(Math.abs(q.x - (v.x || 0)), 2) + Math.pow(Math.abs(q.y - (v.y || 0)), 2))) && a.labelBySeries && (w = { opacity: b.renderer.forExport ? 1 : 0, x: q.x, y: q.y }, d = { opacity: 1 }, 10 >= t && (d = { x: w.x, y: w.y }, w = {}), t = void 0, k && (t = G(a.options.animation), t.duration *= .2), a.labelBySeries.attr(J(w, { anchorX: q.connectorPoint && q.connectorPoint.plotX + u, anchorY: q.connectorPoint && q.connectorPoint.plotY + g })).animate(d,
                                    t), a.options.kdNow = !0, a.buildKDTree(), a = a.searchPoint({ chartX: q.x, chartY: q.y }, !0))) v.closest = [a, q.x - (a.plotX || 0), q.y - (a.plotY || 0)]
                        } else v && (a.labelBySeries = v.destroy())
                    } else v && (a.labelBySeries = v.destroy())
                }
            });
            N(b, "afterDrawSeriesLabels")
        };
        y(u, "load", I);
        y(u, "redraw", I)
    });
    u(k, "masters/modules/series-label.src.js", [], function() {})
});
//# sourceMappingURL=series-label.js.map


/*
 Highcharts JS v9.3.3 (2022-02-01)

 Accessibility module

 (c) 2010-2021 Highsoft AS
 Author: Oystein Moseng

 License: www.highcharts.com/license
*/
'use strict';
(function(a) {
    "object" === typeof module && module.exports ? (a["default"] = a, module.exports = a) : "function" === typeof define && define.amd ? define("highcharts/modules/accessibility", ["highcharts"], function(x) {
        a(x);
        a.Highcharts = x;
        return a
    }) : a("undefined" !== typeof Highcharts ? Highcharts : void 0)
})(function(a) {
    function x(a, h, t, r) { a.hasOwnProperty(h) || (a[h] = r.apply(null, t)) }
    a = a ? a._modules : {};
    x(a, "Accessibility/A11yI18n.js", [a["Core/FormatUtilities.js"], a["Core/Utilities.js"]], function(a, h) {
        var k = a.format,
            r = h.pick,
            m;
        (function(a) {
            function m(a, c) {
                var e = a.indexOf("#each("),
                    d = a.indexOf("#plural("),
                    b = a.indexOf("["),
                    f = a.indexOf("]");
                if (-1 < e) {
                    f = a.slice(e).indexOf(")") + e;
                    d = a.substring(0, e);
                    b = a.substring(f + 1);
                    f = a.substring(e + 6, f).split(",");
                    e = Number(f[1]);
                    a = "";
                    if (c = c[f[0]])
                        for (e = isNaN(e) ? c.length : e, e = 0 > e ? c.length + e : Math.min(e, c.length), f = 0; f < e; ++f) a += d + c[f] + b;
                    return a.length ? a : ""
                }
                if (-1 < d) {
                    b = a.slice(d).indexOf(")") + d;
                    d = a.substring(d + 8, b).split(",");
                    switch (Number(c[d[0]])) {
                        case 0:
                            a = r(d[4], d[1]);
                            break;
                        case 1:
                            a =
                                r(d[2], d[1]);
                            break;
                        case 2:
                            a = r(d[3], d[1]);
                            break;
                        default:
                            a = d[1]
                    }
                    a ? (c = a, c = c.trim && c.trim() || c.replace(/^\s+|\s+$/g, "")) : c = "";
                    return c
                }
                return -1 < b ? (d = a.substring(0, b), b = Number(a.substring(b + 1, f)), a = void 0, c = c[d], !isNaN(b) && c && (0 > b ? (a = c[c.length + b], "undefined" === typeof a && (a = c[0])) : (a = c[b], "undefined" === typeof a && (a = c[c.length - 1]))), "undefined" !== typeof a ? a : "") : "{" + a + "}"
            }

            function n(a, c, e) {
                var d = function(b, d) {
                        b = b.slice(d || 0);
                        var f = b.indexOf("{"),
                            c = b.indexOf("}");
                        if (-1 < f && c > f) return {
                            statement: b.substring(f +
                                1, c),
                            begin: d + f + 1,
                            end: d + c
                        }
                    },
                    b = [],
                    f = 0;
                do {
                    var u = d(a, f);
                    var v = a.substring(f, u && u.begin - 1);
                    v.length && b.push({ value: v, type: "constant" });
                    u && b.push({ value: u.statement, type: "statement" });
                    f = u ? u.end + 1 : f + 1
                } while (u);
                b.forEach(function(b) { "statement" === b.type && (b.value = m(b.value, c)) });
                return k(b.reduce(function(b, d) { return b + d.value }, ""), c, e)
            }

            function g(a, c) { a = a.split("."); for (var e = this.options.lang, d = 0; d < a.length; ++d) e = e && e[a[d]]; return "string" === typeof e ? n(e, c, this) : "" }
            var q = [];
            a.compose = function(a) {
                -1 === q.indexOf(a) &&
                    (q.push(a), a.prototype.langFormat = g);
                return a
            };
            a.i18nFormat = n
        })(m || (m = {}));
        return m
    });
    x(a, "Accessibility/Utils/HTMLUtilities.js", [a["Core/Globals.js"], a["Core/Utilities.js"]], function(a, h) {
        function k(a) {
            if ("function" === typeof w.MouseEvent) return new w.MouseEvent(a.type, a);
            if (m.createEvent) {
                var n = m.createEvent("MouseEvent");
                if (n.initMouseEvent) return n.initMouseEvent(a.type, a.bubbles, a.cancelable, a.view || w, a.detail, a.screenX, a.screenY, a.clientX, a.clientY, a.ctrlKey, a.altKey, a.shiftKey, a.metaKey, a.button,
                    a.relatedTarget), n
            }
            return r(a.type)
        }

        function r(a, g) { g = g || { x: 0, y: 0 }; if ("function" === typeof w.MouseEvent) return new w.MouseEvent(a, { bubbles: !0, cancelable: !0, composed: !0, view: w, detail: "click" === a ? 1 : 0, screenX: g.x, screenY: g.y, clientX: g.x, clientY: g.y }); if (m.createEvent) { var n = m.createEvent("MouseEvent"); if (n.initMouseEvent) return n.initMouseEvent(a, !0, !0, w, "click" === a ? 1 : 0, g.x, g.y, g.x, g.y, !1, !1, !1, !1, 0, null), n } return { type: a } }
        var m = a.doc,
            w = a.win,
            B = h.css;
        return {
            addClass: function(a, g) {
                a.classList ? a.classList.add(g) :
                    0 > a.className.indexOf(g) && (a.className += " " + g)
            },
            cloneMouseEvent: k,
            cloneTouchEvent: function(a) {
                var g = function(a) {
                    for (var g = [], c = 0; c < a.length; ++c) {
                        var e = a.item(c);
                        e && g.push(e)
                    }
                    return g
                };
                if ("function" === typeof w.TouchEvent) return g = new w.TouchEvent(a.type, { touches: g(a.touches), targetTouches: g(a.targetTouches), changedTouches: g(a.changedTouches), ctrlKey: a.ctrlKey, shiftKey: a.shiftKey, altKey: a.altKey, metaKey: a.metaKey, bubbles: a.bubbles, cancelable: a.cancelable, composed: a.composed, detail: a.detail, view: a.view }),
                    a.defaultPrevented && g.preventDefault(), g;
                g = k(a);
                g.touches = a.touches;
                g.changedTouches = a.changedTouches;
                g.targetTouches = a.targetTouches;
                return g
            },
            escapeStringForHTML: function(a) { return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;") },
            getElement: function(a) { return m.getElementById(a) },
            getFakeMouseEvent: r,
            getHeadingTagNameForElement: function(a) {
                var g = function(a) { a = parseInt(a.slice(1), 10); return "h" + Math.min(6, a + 1) },
                    n = function(a) {
                        var c;
                        a: {
                            for (c = a; c = c.previousSibling;) { var e = c.tagName || ""; if (/H[1-6]/.test(e)) { c = e; break a } }
                            c = ""
                        }
                        if (c) return g(c);
                        a = a.parentElement;
                        if (!a) return "p";
                        c = a.tagName;
                        return /H[1-6]/.test(c) ? g(c) : n(a)
                    };
                return n(a)
            },
            removeChildNodes: function(a) { for (; a.lastChild;) a.removeChild(a.lastChild) },
            removeClass: function(a, g) { a.classList ? a.classList.remove(g) : a.className = a.className.replace(new RegExp(g, "g"), "") },
            removeElement: function(a) { a && a.parentNode && a.parentNode.removeChild(a) },
            reverseChildNodes: function(a) {
                for (var g =
                        a.childNodes.length; g--;) a.appendChild(a.childNodes[g])
            },
            stripHTMLTagsFromString: function(a) { return "string" === typeof a ? a.replace(/<\/?[^>]+(>|$)/g, "") : a },
            visuallyHideElement: function(a) { B(a, { position: "absolute", width: "1px", height: "1px", overflow: "hidden", whiteSpace: "nowrap", clip: "rect(1px, 1px, 1px, 1px)", marginTop: "-3px", "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=1)", filter: "alpha(opacity=1)", opacity: .01 }) }
        }
    });
    x(a, "Accessibility/Utils/ChartUtilities.js", [a["Core/Globals.js"], a["Accessibility/Utils/HTMLUtilities.js"],
        a["Core/Utilities.js"]
    ], function(a, h, t) {
        function k(b, f) {
            var a = f.type,
                c = b.hcEvents;
            q.createEvent && (b.dispatchEvent || b.fireEvent) ? b.dispatchEvent ? b.dispatchEvent(f) : b.fireEvent(a, f) : c && c[a] ? d(b, a, f) : b.element && k(b.element, f)
        }

        function m(b) {
            var d = b.chart,
                a = {},
                c = "Seconds";
            a.Seconds = ((b.max || 0) - (b.min || 0)) / 1E3;
            a.Minutes = a.Seconds / 60;
            a.Hours = a.Minutes / 60;
            a.Days = a.Hours / 24;
            ["Minutes", "Hours", "Days"].forEach(function(b) { 2 < a[b] && (c = b) });
            var e = a[c].toFixed("Seconds" !== c && "Minutes" !== c ? 1 : 0);
            return d.langFormat("accessibility.axis.timeRange" +
                c, { chart: d, axis: b, range: e.replace(".0", "") })
        }

        function w(b) {
            var d = b.chart,
                a = d.options,
                c = a && a.accessibility && a.accessibility.screenReaderSection.axisRangeDateFormat || "";
            a = function(f) { return b.dateTime ? d.time.dateFormat(c, b[f]) : b[f] };
            return d.langFormat("accessibility.axis.rangeFromTo", { chart: d, axis: b, rangeFrom: a("min"), rangeTo: a("max") })
        }

        function B(b) { if (b.points && b.points.length) return (b = e(b.points, function(b) { return !!b.graphic })) && b.graphic && b.graphic.element }

        function n(b) {
            var d = B(b);
            return d && d.parentNode ||
                b.graph && b.graph.element || b.group && b.group.element
        }

        function g(b, d) {
            d.setAttribute("aria-hidden", !1);
            d !== b.renderTo && d.parentNode && d.parentNode !== q.body && (Array.prototype.forEach.call(d.parentNode.childNodes, function(b) { b.hasAttribute("aria-hidden") || b.setAttribute("aria-hidden", !0) }), g(b, d.parentNode))
        }
        var q = a.doc,
            y = h.stripHTMLTagsFromString,
            c = t.defined,
            e = t.find,
            d = t.fireEvent;
        return {
            fireEventOnWrappedOrUnwrappedElement: k,
            getChartTitle: function(b) {
                return y(b.options.title.text || b.langFormat("accessibility.defaultChartTitle", { chart: b }))
            },
            getAxisDescription: function(b) { return b && (b.userOptions && b.userOptions.accessibility && b.userOptions.accessibility.description || b.axisTitle && b.axisTitle.textStr || b.options.id || b.categories && "categories" || b.dateTime && "Time" || "values") },
            getAxisRangeDescription: function(b) {
                var d = b.options || {};
                return d.accessibility && "undefined" !== typeof d.accessibility.rangeDescription ? d.accessibility.rangeDescription : b.categories ? (d = b.chart, b = b.dataMax && b.dataMin ? d.langFormat("accessibility.axis.rangeCategories", { chart: d, axis: b, numCategories: b.dataMax - b.dataMin + 1 }) : "", b) : !b.dateTime || 0 !== b.min && 0 !== b.dataMin ? w(b) : m(b)
            },
            getPointFromXY: function(b, d, a) {
                for (var f = b.length, c; f--;)
                    if (c = e(b[f].points || [], function(b) { return b.x === d && b.y === a })) return c
            },
            getSeriesFirstPointElement: B,
            getSeriesFromName: function(b, d) { return d ? (b.series || []).filter(function(b) { return b.name === d }) : b.series },
            getSeriesA11yElement: n,
            unhideChartElementFromAT: g,
            hideSeriesFromAT: function(b) {
                (b = n(b)) && b.setAttribute("aria-hidden", !0)
            },
            scrollToPoint: function(b) {
                var a =
                    b.series.xAxis,
                    e = b.series.yAxis,
                    v = a && a.scrollbar ? a : e;
                if ((a = v && v.scrollbar) && c(a.to) && c(a.from)) {
                    e = a.to - a.from;
                    if (c(v.dataMin) && c(v.dataMax)) {
                        var g = v.toPixels(v.dataMin),
                            y = v.toPixels(v.dataMax);
                        b = (v.toPixels(b["xAxis" === v.coll ? "x" : "y"] || 0) - g) / (y - g)
                    } else b = 0;
                    a.updatePosition(b - e / 2, b + e / 2);
                    d(a, "changed", { from: a.from, to: a.to, trigger: "scrollbar", DOMEvent: null })
                }
            }
        }
    });
    x(a, "Accessibility/Utils/DOMElementProvider.js", [a["Core/Globals.js"], a["Accessibility/Utils/HTMLUtilities.js"]], function(a, h) {
        var k = a.doc,
            r = h.removeElement;
        return function() {
            function a() { this.elements = [] }
            a.prototype.createElement = function() {
                var a = k.createElement.apply(k, arguments);
                this.elements.push(a);
                return a
            };
            a.prototype.destroyCreatedElements = function() {
                this.elements.forEach(function(a) { r(a) });
                this.elements = []
            };
            return a
        }()
    });
    x(a, "Accessibility/Utils/EventProvider.js", [a["Core/Globals.js"], a["Core/Utilities.js"]], function(a, h) {
        var k = h.addEvent;
        return function() {
            function h() { this.eventRemovers = [] }
            h.prototype.addEvent = function() {
                var h =
                    k.apply(a, arguments);
                this.eventRemovers.push(h);
                return h
            };
            h.prototype.removeAddedEvents = function() {
                this.eventRemovers.forEach(function(a) { return a() });
                this.eventRemovers = []
            };
            return h
        }()
    });
    x(a, "Accessibility/AccessibilityComponent.js", [a["Accessibility/Utils/ChartUtilities.js"], a["Accessibility/Utils/DOMElementProvider.js"], a["Accessibility/Utils/EventProvider.js"], a["Accessibility/Utils/HTMLUtilities.js"], a["Core/Utilities.js"]], function(a, h, t, r, m) {
        var k = a.fireEventOnWrappedOrUnwrappedElement,
            B = r.getFakeMouseEvent;
        a = m.extend;
        r = function() {
            function a() { this.proxyProvider = this.keyCodes = this.eventProvider = this.domElementProvider = this.chart = void 0 }
            a.prototype.initBase = function(a, q) {
                this.chart = a;
                this.eventProvider = new t;
                this.domElementProvider = new h;
                this.proxyProvider = q;
                this.keyCodes = { left: 37, right: 39, up: 38, down: 40, enter: 13, space: 32, esc: 27, tab: 9, pageUp: 33, pageDown: 34, end: 35, home: 36 }
            };
            a.prototype.addEvent = function(a, q, y, c) { return this.eventProvider.addEvent(a, q, y, c) };
            a.prototype.createElement = function(a, q) {
                return this.domElementProvider.createElement(a,
                    q)
            };
            a.prototype.fakeClickEvent = function(a) {
                var g = B("click");
                k(a, g)
            };
            a.prototype.destroyBase = function() {
                this.domElementProvider.destroyCreatedElements();
                this.eventProvider.removeAddedEvents()
            };
            return a
        }();
        a(r.prototype, { init: function() {}, getKeyboardNavigation: function() {}, onChartUpdate: function() {}, onChartRender: function() {}, destroy: function() {} });
        return r
    });
    x(a, "Accessibility/KeyboardNavigationHandler.js", [a["Core/Utilities.js"]], function(a) {
        var h = a.find;
        a = function() {
            function a(a, h) {
                this.chart = a;
                this.keyCodeMap = h.keyCodeMap || [];
                this.validate = h.validate;
                this.init = h.init;
                this.terminate = h.terminate;
                this.response = { success: 1, prev: 2, next: 3, noHandler: 4, fail: 5 }
            }
            a.prototype.run = function(a) {
                var k = a.which || a.keyCode,
                    w = this.response.noHandler,
                    t = h(this.keyCodeMap, function(a) { return -1 < a[0].indexOf(k) });
                t ? w = t[1].call(this, k, a) : 9 === k && (w = this.response[a.shiftKey ? "prev" : "next"]);
                return w
            };
            return a
        }();
        "";
        return a
    });
    x(a, "Accessibility/Components/ContainerComponent.js", [a["Accessibility/AccessibilityComponent.js"],
        a["Accessibility/KeyboardNavigationHandler.js"], a["Accessibility/Utils/ChartUtilities.js"], a["Core/Globals.js"], a["Accessibility/Utils/HTMLUtilities.js"]
    ], function(a, h, t, r, m) {
        var k = this && this.__extends || function() {
                var a = function(c, e) {
                    a = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(d, b) { d.__proto__ = b } || function(d, b) { for (var a in b) b.hasOwnProperty(a) && (d[a] = b[a]) };
                    return a(c, e)
                };
                return function(c, e) {
                    function d() { this.constructor = c }
                    a(c, e);
                    c.prototype = null === e ? Object.create(e) : (d.prototype =
                        e.prototype, new d)
                }
            }(),
            B = t.unhideChartElementFromAT,
            n = t.getChartTitle,
            g = r.doc,
            q = m.stripHTMLTagsFromString;
        return function(a) {
            function c() { return null !== a && a.apply(this, arguments) || this }
            k(c, a);
            c.prototype.onChartUpdate = function() {
                this.handleSVGTitleElement();
                this.setSVGContainerLabel();
                this.setGraphicContainerAttrs();
                this.setRenderToAttrs();
                this.makeCreditsAccessible()
            };
            c.prototype.handleSVGTitleElement = function() {
                var a = this.chart,
                    d = "highcharts-title-" + a.index,
                    b = q(a.langFormat("accessibility.svgContainerTitle", { chartTitle: n(a) }));
                if (b.length) {
                    var c = this.svgTitleElement = this.svgTitleElement || g.createElementNS("http://www.w3.org/2000/svg", "title");
                    c.textContent = b;
                    c.id = d;
                    a.renderTo.insertBefore(c, a.renderTo.firstChild)
                }
            };
            c.prototype.setSVGContainerLabel = function() {
                var a = this.chart,
                    d = a.langFormat("accessibility.svgContainerLabel", { chartTitle: n(a) });
                a.renderer.box && d.length && a.renderer.box.setAttribute("aria-label", d)
            };
            c.prototype.setGraphicContainerAttrs = function() {
                var a = this.chart,
                    d = a.langFormat("accessibility.graphicContainerLabel", { chartTitle: n(a) });
                d.length && a.container.setAttribute("aria-label", d)
            };
            c.prototype.setRenderToAttrs = function() {
                var a = this.chart;
                "disabled" !== a.options.accessibility.landmarkVerbosity ? a.renderTo.setAttribute("role", "region") : a.renderTo.removeAttribute("role");
                a.renderTo.setAttribute("aria-label", a.langFormat("accessibility.chartContainerLabel", { title: n(a), chart: a }))
            };
            c.prototype.makeCreditsAccessible = function() {
                var a = this.chart,
                    d = a.credits;
                d && (d.textStr && d.element.setAttribute("aria-label", a.langFormat("accessibility.credits", { creditsStr: q(d.textStr) })), B(a, d.element))
            };
            c.prototype.getKeyboardNavigation = function() {
                var a = this.chart;
                return new h(a, {
                    keyCodeMap: [],
                    validate: function() { return !0 },
                    init: function() {
                        var d = a.accessibility;
                        d && d.keyboardNavigation.tabindexContainer.focus()
                    }
                })
            };
            c.prototype.destroy = function() { this.chart.renderTo.setAttribute("aria-hidden", !0) };
            return c
        }(a)
    });
    x(a, "Accessibility/FocusBorder.js", [a["Core/Renderer/SVG/SVGLabel.js"], a["Core/Utilities.js"]], function(a, h) {
        var k = h.addEvent,
            r = h.pick,
            m;
        (function(h) {
            function m() {
                var a =
                    this.focusElement,
                    b = this.options.accessibility.keyboardNavigation.focusBorder;
                a && (a.removeFocusBorder(), b.enabled && a.addFocusBorder(b.margin, { stroke: b.style.color, strokeWidth: b.style.lineWidth, r: b.style.borderRadius }))
            }

            function n(a, b) {
                var d = this.options.accessibility.keyboardNavigation.focusBorder;
                (b = b || a.element) && b.focus && (b.hcEvents && b.hcEvents.focusin || k(b, "focusin", function() {}), b.focus(), d.hideBrowserFocusOutline && (b.style.outline = "none"));
                this.focusElement && this.focusElement.removeFocusBorder();
                this.focusElement = a;
                this.renderFocusBorder()
            }

            function g(a) {
                if (!a.focusBorderDestroyHook) {
                    var b = a.destroy;
                    a.destroy = function() { a.focusBorder && a.focusBorder.destroy && a.focusBorder.destroy(); return b.apply(a, arguments) };
                    a.focusBorderDestroyHook = b
                }
            }

            function q(b, d) {
                this.focusBorder && this.removeFocusBorder();
                var c = this.getBBox(),
                    f = r(b, 3);
                c.x += this.translateX ? this.translateX : 0;
                c.y += this.translateY ? this.translateY : 0;
                var e = c.x - f,
                    u = c.y - f,
                    z = c.width + 2 * f,
                    D = c.height + 2 * f,
                    q = this instanceof a;
                if ("text" === this.element.nodeName ||
                    q) {
                    var h = !!this.rotation;
                    if (q) var n = { x: h ? 1 : 0, y: 0 };
                    else {
                        var k = n = 0;
                        "middle" === this.attr("text-anchor") ? n = k = .5 : this.rotation ? n = .25 : k = .75;
                        n = { x: n, y: k }
                    }
                    k = +this.attr("x");
                    var l = +this.attr("y");
                    isNaN(k) || (e = k - c.width * n.x - f);
                    isNaN(l) || (u = l - c.height * n.y - f);
                    q && h && (q = z, z = D, D = q, isNaN(k) || (e = k - c.height * n.x - f), isNaN(l) || (u = l - c.width * n.y - f))
                }
                this.focusBorder = this.renderer.rect(e, u, z, D, parseInt((d && d.r || 0).toString(), 10)).addClass("highcharts-focus-border").attr({ zIndex: 99 }).add(this.parentGroup);
                this.renderer.styledMode ||
                    this.focusBorder.attr({ stroke: d && d.stroke, "stroke-width": d && d.strokeWidth });
                y(this, b, d);
                g(this)
            }

            function y(a) {
                for (var d = [], c = 1; c < arguments.length; c++) d[c - 1] = arguments[c];
                a.focusBorderUpdateHooks || (a.focusBorderUpdateHooks = {}, b.forEach(function(b) {
                    b += "Setter";
                    var c = a[b] || a._defaultSetter;
                    a.focusBorderUpdateHooks[b] = c;
                    a[b] = function() {
                        var b = c.apply(a, arguments);
                        a.addFocusBorder.apply(a, d);
                        return b
                    }
                }))
            }

            function c() {
                e(this);
                this.focusBorderDestroyHook && (this.destroy = this.focusBorderDestroyHook, delete this.focusBorderDestroyHook);
                this.focusBorder && (this.focusBorder.destroy(), delete this.focusBorder)
            }

            function e(a) {
                a.focusBorderUpdateHooks && (Object.keys(a.focusBorderUpdateHooks).forEach(function(b) {
                    var d = a.focusBorderUpdateHooks[b];
                    d === a._defaultSetter ? delete a[b] : a[b] = d
                }), delete a.focusBorderUpdateHooks)
            }
            var d = [],
                b = "x y transform width height r d stroke-width".split(" ");
            h.compose = function(a, b) {
                -1 === d.indexOf(a) && (d.push(a), a = a.prototype, a.renderFocusBorder = m, a.setFocusToElement = n); - 1 === d.indexOf(b) && (d.push(b), b = b.prototype,
                    b.addFocusBorder = q, b.removeFocusBorder = c)
            }
        })(m || (m = {}));
        return m
    });
    x(a, "Accessibility/Utils/Announcer.js", [a["Core/Renderer/HTML/AST.js"], a["Accessibility/Utils/DOMElementProvider.js"], a["Core/Globals.js"], a["Accessibility/Utils/HTMLUtilities.js"], a["Core/Utilities.js"]], function(a, h, t, r, m) {
        var k = t.doc,
            B = r.addClass,
            n = r.visuallyHideElement,
            g = m.attr;
        return function() {
            function q(a, c) {
                this.chart = a;
                this.domElementProvider = new h;
                this.announceRegion = this.addAnnounceRegion(c)
            }
            q.prototype.destroy = function() { this.domElementProvider.destroyCreatedElements() };
            q.prototype.announce = function(g) {
                var c = this;
                a.setElementHTML(this.announceRegion, g);
                this.clearAnnouncementRegionTimer && clearTimeout(this.clearAnnouncementRegionTimer);
                this.clearAnnouncementRegionTimer = setTimeout(function() {
                    c.announceRegion.innerHTML = a.emptyHTML;
                    delete c.clearAnnouncementRegionTimer
                }, 1E3)
            };
            q.prototype.addAnnounceRegion = function(a) {
                var c = this.chart.announcerContainer || this.createAnnouncerContainer(),
                    e = this.domElementProvider.createElement("div");
                g(e, { "aria-hidden": !1, "aria-live": a });
                this.chart.styledMode ? B(e, "highcharts-visually-hidden") : n(e);
                c.appendChild(e);
                return e
            };
            q.prototype.createAnnouncerContainer = function() {
                var a = this.chart,
                    c = k.createElement("div");
                g(c, { "aria-hidden": !1, "class": "highcharts-announcer-container" });
                c.style.position = "relative";
                a.renderTo.insertBefore(c, a.renderTo.firstChild);
                return a.announcerContainer = c
            };
            return q
        }()
    });
    x(a, "Accessibility/Components/AnnotationsA11y.js", [a["Accessibility/Utils/HTMLUtilities.js"]], function(a) {
        function h(a) {
            return (a.annotations || []).reduce(function(a, q) { q.options && !1 !== q.options.visible && (a = a.concat(q.labels)); return a }, [])
        }

        function k(a) { return a.options && a.options.accessibility && a.options.accessibility.description || a.graphic && a.graphic.text && a.graphic.text.textStr || "" }

        function r(a) {
            var g = a.options && a.options.accessibility && a.options.accessibility.description;
            if (g) return g;
            g = a.chart;
            var q = k(a),
                h = a.points.filter(function(a) { return !!a.graphic }).map(function(a) {
                    var b = a.accessibility && a.accessibility.valueDescription || a.graphic &&
                        a.graphic.element && a.graphic.element.getAttribute("aria-label") || "";
                    a = a && a.series.name || "";
                    return (a ? a + ", " : "") + "data point " + b
                }).filter(function(a) { return !!a }),
                c = h.length,
                e = "accessibility.screenReaderSection.annotations.description" + (1 < c ? "MultiplePoints" : c ? "SinglePoint" : "NoPoints");
            a = { annotationText: q, annotation: a, numPoints: c, annotationPoint: h[0], additionalAnnotationPoints: h.slice(1) };
            return g.langFormat(e, a)
        }

        function m(a) { return h(a).map(function(a) { return (a = w(B(r(a)))) ? "<li>" + a + "</li>" : "" }) }
        var w =
            a.escapeStringForHTML,
            B = a.stripHTMLTagsFromString;
        return { getAnnotationsInfoHTML: function(a) { var g = a.annotations; return g && g.length ? '<ul style="list-style-type: none">' + m(a).join(" ") + "</ul>" : "" }, getAnnotationLabelDescription: r, getAnnotationListItems: m, getPointAnnotationTexts: function(a) { var g = h(a.series.chart).filter(function(g) { return -1 < g.points.indexOf(a) }); return g.length ? g.map(function(a) { return "" + k(a) }) : [] } }
    });
    x(a, "Accessibility/Components/InfoRegionsComponent.js", [a["Accessibility/A11yI18n.js"],
        a["Accessibility/AccessibilityComponent.js"], a["Accessibility/Utils/Announcer.js"], a["Accessibility/Components/AnnotationsA11y.js"], a["Core/Renderer/HTML/AST.js"], a["Accessibility/Utils/ChartUtilities.js"], a["Core/FormatUtilities.js"], a["Core/Globals.js"], a["Accessibility/Utils/HTMLUtilities.js"], a["Core/Utilities.js"]
    ], function(a, h, t, r, m, w, B, n, g, q) {
        function y(a, b) {
            var d = b[0],
                c = a.series && a.series[0] || {};
            c = { numSeries: a.series.length, numPoints: c.points && c.points.length, chart: a, mapTitle: c.mapTitle };
            if (!d) return a.langFormat("accessibility.chartTypes.emptyChart", c);
            if ("map" === d) return c.mapTitle ? a.langFormat("accessibility.chartTypes.mapTypeDescription", c) : a.langFormat("accessibility.chartTypes.unknownMap", c);
            if (1 < a.types.length) return a.langFormat("accessibility.chartTypes.combinationChart", c);
            b = b[0];
            d = a.langFormat("accessibility.seriesTypeDescriptions." + b, c);
            var e = a.series && 2 > a.series.length ? "Single" : "Multiple";
            return (a.langFormat("accessibility.chartTypes." + b + e, c) || a.langFormat("accessibility.chartTypes.default" +
                e, c)) + (d ? " " + d : "")
        }
        var c = this && this.__extends || function() {
                var a = function(b, d) {
                    a = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(a, b) { a.__proto__ = b } || function(a, b) { for (var d in b) b.hasOwnProperty(d) && (a[d] = b[d]) };
                    return a(b, d)
                };
                return function(b, d) {
                    function c() { this.constructor = b }
                    a(b, d);
                    b.prototype = null === d ? Object.create(d) : (c.prototype = d.prototype, new c)
                }
            }(),
            e = r.getAnnotationsInfoHTML,
            d = w.getAxisDescription,
            b = w.getAxisRangeDescription,
            f = w.getChartTitle,
            u = w.unhideChartElementFromAT,
            v = B.format,
            k = n.doc,
            E = g.addClass,
            G = g.getElement,
            z = g.getHeadingTagNameForElement,
            D = g.stripHTMLTagsFromString,
            F = g.visuallyHideElement,
            C = q.attr,
            H = q.pick;
        return function(g) {
            function l() {
                var a = null !== g && g.apply(this, arguments) || this;
                a.announcer = void 0;
                a.screenReaderSections = {};
                return a
            }
            c(l, g);
            l.prototype.init = function() {
                var a = this.chart,
                    b = this;
                this.initRegionsDefinitions();
                this.addEvent(a, "aftergetTableAST", function(a) { b.onDataTableCreated(a) });
                this.addEvent(a, "afterViewData", function(a) {
                    b.dataTableDiv =
                        a;
                    setTimeout(function() { b.focusDataTable() }, 300)
                });
                this.announcer = new t(a, "assertive")
            };
            l.prototype.initRegionsDefinitions = function() {
                var a = this;
                this.screenReaderSections = {
                    before: {
                        element: null,
                        buildContent: function(b) { var d = b.options.accessibility.screenReaderSection.beforeChartFormatter; return d ? d(b) : a.defaultBeforeChartFormatter(b) },
                        insertIntoDOM: function(a, b) { b.renderTo.insertBefore(a, b.renderTo.firstChild) },
                        afterInserted: function() {
                            "undefined" !== typeof a.sonifyButtonId && a.initSonifyButton(a.sonifyButtonId);
                            "undefined" !== typeof a.dataTableButtonId && a.initDataTableButton(a.dataTableButtonId)
                        }
                    },
                    after: { element: null, buildContent: function(b) { var d = b.options.accessibility.screenReaderSection.afterChartFormatter; return d ? d(b) : a.defaultAfterChartFormatter() }, insertIntoDOM: function(a, b) { b.renderTo.insertBefore(a, b.container.nextSibling) }, afterInserted: function() { a.chart.accessibility && a.chart.accessibility.keyboardNavigation.updateExitAnchor() } }
                }
            };
            l.prototype.onChartRender = function() {
                var a = this;
                this.linkedDescriptionElement =
                    this.getLinkedDescriptionElement();
                this.setLinkedDescriptionAttrs();
                Object.keys(this.screenReaderSections).forEach(function(b) { a.updateScreenReaderSection(b) })
            };
            l.prototype.getLinkedDescriptionElement = function() {
                var a = this.chart.options.accessibility.linkedDescription;
                if (a) {
                    if ("string" !== typeof a) return a;
                    a = v(a, this.chart);
                    a = k.querySelectorAll(a);
                    if (1 === a.length) return a[0]
                }
            };
            l.prototype.setLinkedDescriptionAttrs = function() {
                var a = this.linkedDescriptionElement;
                a && (a.setAttribute("aria-hidden", "true"),
                    E(a, "highcharts-linked-description"))
            };
            l.prototype.updateScreenReaderSection = function(a) {
                var b = this.chart,
                    d = this.screenReaderSections[a],
                    c = d.buildContent(b),
                    p = d.element = d.element || this.createElement("div"),
                    e = p.firstChild || this.createElement("div");
                c ? (this.setScreenReaderSectionAttribs(p, a), m.setElementHTML(e, c), p.appendChild(e), d.insertIntoDOM(p, b), b.styledMode ? E(e, "highcharts-visually-hidden") : F(e), u(b, e), d.afterInserted && d.afterInserted()) : (p.parentNode && p.parentNode.removeChild(p), delete d.element)
            };
            l.prototype.setScreenReaderSectionAttribs = function(a, b) {
                var d = this.chart,
                    c = d.langFormat("accessibility.screenReaderSection." + b + "RegionLabel", { chart: d, chartTitle: f(d) });
                C(a, { id: "highcharts-screen-reader-region-" + b + "-" + d.index, "aria-label": c });
                a.style.position = "relative";
                "all" === d.options.accessibility.landmarkVerbosity && c && a.setAttribute("role", "region")
            };
            l.prototype.defaultBeforeChartFormatter = function() {
                var b = this.chart,
                    d = b.options.accessibility.screenReaderSection.beforeChartFormat;
                if (!d) return "";
                var c = this.getAxesDescription(),
                    M = b.sonify && b.options.sonification && b.options.sonification.enabled,
                    I = "highcharts-a11y-sonify-data-btn-" + b.index,
                    l = "hc-linkto-highcharts-data-table-" + b.index,
                    u = e(b),
                    v = b.langFormat("accessibility.screenReaderSection.annotations.heading", { chart: b });
                c = {
                    headingTagName: z(b.renderTo),
                    chartTitle: f(b),
                    typeDescription: this.getTypeDescriptionText(),
                    chartSubtitle: this.getSubtitleText(),
                    chartLongdesc: this.getLongdescText(),
                    xAxisDescription: c.xAxis,
                    yAxisDescription: c.yAxis,
                    playAsSoundButton: M ?
                        this.getSonifyButtonText(I) : "",
                    viewTableButton: b.getCSV ? this.getDataTableButtonText(l) : "",
                    annotationsTitle: u ? v : "",
                    annotationsList: u
                };
                b = a.i18nFormat(d, c, b);
                this.dataTableButtonId = l;
                this.sonifyButtonId = I;
                return b.replace(/<(\w+)[^>]*?>\s*<\/\1>/g, "")
            };
            l.prototype.defaultAfterChartFormatter = function() {
                var b = this.chart,
                    d = b.options.accessibility.screenReaderSection.afterChartFormat;
                if (!d) return "";
                var c = { endOfChartMarker: this.getEndOfChartMarkerText() };
                return a.i18nFormat(d, c, b).replace(/<(\w+)[^>]*?>\s*<\/\1>/g,
                    "")
            };
            l.prototype.getLinkedDescription = function() { var a = this.linkedDescriptionElement; return D(a && a.innerHTML || "") };
            l.prototype.getLongdescText = function() {
                var a = this.chart.options,
                    b = a.caption;
                b = b && b.text;
                var d = this.getLinkedDescription();
                return a.accessibility.description || d || b || ""
            };
            l.prototype.getTypeDescriptionText = function() { var a = this.chart; return a.types ? a.options.accessibility.typeDescription || y(a, a.types) : "" };
            l.prototype.getDataTableButtonText = function(a) {
                var b = this.chart;
                b = b.langFormat("accessibility.table.viewAsDataTableButtonText", { chart: b, chartTitle: f(b) });
                return '<button id="' + a + '">' + b + "</button>"
            };
            l.prototype.getSonifyButtonText = function(a) {
                var b = this.chart;
                if (b.options.sonification && !1 === b.options.sonification.enabled) return "";
                b = b.langFormat("accessibility.sonification.playAsSoundButtonText", { chart: b, chartTitle: f(b) });
                return '<button id="' + a + '">' + b + "</button>"
            };
            l.prototype.getSubtitleText = function() { var a = this.chart.options.subtitle; return D(a && a.text || "") };
            l.prototype.getEndOfChartMarkerText = function() {
                var a = this.chart,
                    b = a.langFormat("accessibility.screenReaderSection.endOfChartMarker", { chart: a });
                return '<div id="highcharts-end-of-chart-marker-' + a.index + '">' + b + "</div>"
            };
            l.prototype.onDataTableCreated = function(a) {
                var b = this.chart;
                if (b.options.accessibility.enabled) {
                    this.viewDataTableButton && this.viewDataTableButton.setAttribute("aria-expanded", "true");
                    var d = a.tree.attributes || {};
                    d.tabindex = -1;
                    d.summary = b.langFormat("accessibility.table.tableSummary", { chart: b });
                    a.tree.attributes = d
                }
            };
            l.prototype.focusDataTable = function() {
                var a =
                    this.dataTableDiv;
                (a = a && a.getElementsByTagName("table")[0]) && a.focus && a.focus()
            };
            l.prototype.initSonifyButton = function(a) {
                var b = this,
                    d = this.sonifyButton = G(a),
                    c = this.chart,
                    e = function(a) {
                        d && (d.setAttribute("aria-hidden", "true"), d.setAttribute("aria-label", ""));
                        a.preventDefault();
                        a.stopPropagation();
                        a = c.langFormat("accessibility.sonification.playAsSoundClickAnnouncement", { chart: c });
                        b.announcer.announce(a);
                        setTimeout(function() {
                            d && (d.removeAttribute("aria-hidden"), d.removeAttribute("aria-label"));
                            c.sonify &&
                                c.sonify()
                        }, 1E3)
                    };
                d && c && (d.setAttribute("tabindex", -1), d.onclick = function(a) {
                    (c.options.accessibility && c.options.accessibility.screenReaderSection.onPlayAsSoundClick || e).call(this, a, c)
                })
            };
            l.prototype.initDataTableButton = function(a) {
                var b = this.viewDataTableButton = G(a),
                    d = this.chart;
                a = a.replace("hc-linkto-", "");
                b && (C(b, { tabindex: -1, "aria-expanded": !!G(a) }), b.onclick = d.options.accessibility.screenReaderSection.onViewDataTableClick || function() { d.viewData() })
            };
            l.prototype.getAxesDescription = function() {
                var a =
                    this.chart,
                    b = function(b, d) { b = a[b]; return 1 < b.length || b[0] && H(b[0].options.accessibility && b[0].options.accessibility.enabled, d) },
                    d = !!a.types && 0 > a.types.indexOf("map"),
                    c = !!a.hasCartesianSeries,
                    e = b("xAxis", !a.angular && c && d);
                b = b("yAxis", c && d);
                d = {};
                e && (d.xAxis = this.getAxisDescriptionText("xAxis"));
                b && (d.yAxis = this.getAxisDescriptionText("yAxis"));
                return d
            };
            l.prototype.getAxisDescriptionText = function(a) {
                var c = this.chart,
                    e = c[a];
                return c.langFormat("accessibility.axis." + a + "Description" + (1 < e.length ? "Plural" :
                    "Singular"), { chart: c, names: e.map(function(a) { return d(a) }), ranges: e.map(function(a) { return b(a) }), numAxes: e.length })
            };
            l.prototype.destroy = function() { this.announcer && this.announcer.destroy() };
            return l
        }(h)
    });
    x(a, "Accessibility/Components/MenuComponent.js", [a["Core/Chart/Chart.js"], a["Core/Utilities.js"], a["Accessibility/AccessibilityComponent.js"], a["Accessibility/KeyboardNavigationHandler.js"], a["Accessibility/Utils/ChartUtilities.js"], a["Accessibility/Utils/HTMLUtilities.js"]], function(a, h, t, r, m,
        w) {
        var k = this && this.__extends || function() {
                var a = function(c, d) {
                    a = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(a, d) { a.__proto__ = d } || function(a, d) { for (var b in d) d.hasOwnProperty(b) && (a[b] = d[b]) };
                    return a(c, d)
                };
                return function(c, d) {
                    function b() { this.constructor = c }
                    a(c, d);
                    c.prototype = null === d ? Object.create(d) : (b.prototype = d.prototype, new b)
                }
            }(),
            n = h.attr,
            g = m.getChartTitle,
            q = m.unhideChartElementFromAT,
            y = w.getFakeMouseEvent;
        h = function(a) {
            function c() {
                return null !== a && a.apply(this, arguments) ||
                    this
            }
            k(c, a);
            c.prototype.init = function() {
                var a = this.chart,
                    b = this;
                this.addEvent(a, "exportMenuShown", function() { b.onMenuShown() });
                this.addEvent(a, "exportMenuHidden", function() { b.onMenuHidden() });
                this.createProxyGroup()
            };
            c.prototype.onMenuHidden = function() {
                var a = this.chart.exportContextMenu;
                a && a.setAttribute("aria-hidden", "true");
                this.isExportMenuShown = !1;
                this.setExportButtonExpandedState("false")
            };
            c.prototype.onMenuShown = function() {
                var a = this.chart,
                    b = a.exportContextMenu;
                b && (this.addAccessibleContextMenuAttribs(),
                    q(a, b));
                this.isExportMenuShown = !0;
                this.setExportButtonExpandedState("true")
            };
            c.prototype.setExportButtonExpandedState = function(a) { this.exportButtonProxy && this.exportButtonProxy.buttonElement.setAttribute("aria-expanded", a) };
            c.prototype.onChartRender = function() {
                var a = this.chart,
                    b = a.focusElement,
                    c = a.accessibility;
                this.proxyProvider.clearGroup("chartMenu");
                this.proxyMenuButton();
                this.exportButtonProxy && b && b === a.exportingGroup && (b.focusBorder ? a.setFocusToElement(b, this.exportButtonProxy.buttonElement) :
                    c && c.keyboardNavigation.tabindexContainer.focus())
            };
            c.prototype.proxyMenuButton = function() {
                var a = this.chart,
                    b = this.proxyProvider,
                    c = a.exportSVGElements && a.exportSVGElements[0],
                    e = a.options.exporting,
                    v = a.exportSVGElements && a.exportSVGElements[0];
                e && !1 !== e.enabled && e.accessibility && e.accessibility.enabled && v && v.element && c && (this.exportButtonProxy = b.addProxyElement("chartMenu", { click: c }, { "aria-label": a.langFormat("accessibility.exporting.menuButtonLabel", { chart: a, chartTitle: g(a) }), "aria-expanded": !1 }))
            };
            c.prototype.createProxyGroup = function() { this.chart && this.proxyProvider && this.proxyProvider.addGroup("chartMenu", "div") };
            c.prototype.addAccessibleContextMenuAttribs = function() {
                var a = this.chart,
                    b = a.exportDivElements;
                b && b.length && (b.forEach(function(a) { a && ("LI" !== a.tagName || a.children && a.children.length ? a.setAttribute("aria-hidden", "true") : a.setAttribute("tabindex", -1)) }), (b = b[0] && b[0].parentNode) && n(b, {
                    "aria-hidden": void 0,
                    "aria-label": a.langFormat("accessibility.exporting.chartMenuLabel", { chart: a }),
                    role: "list"
                }))
            };
            c.prototype.getKeyboardNavigation = function() {
                var a = this.keyCodes,
                    b = this.chart,
                    c = this;
                return new r(b, {
                    keyCodeMap: [
                        [
                            [a.left, a.up],
                            function() { return c.onKbdPrevious(this) }
                        ],
                        [
                            [a.right, a.down],
                            function() { return c.onKbdNext(this) }
                        ],
                        [
                            [a.enter, a.space],
                            function() { return c.onKbdClick(this) }
                        ]
                    ],
                    validate: function() { return !!b.exporting && !1 !== b.options.exporting.enabled && !1 !== b.options.exporting.accessibility.enabled },
                    init: function() {
                        var a = c.exportButtonProxy,
                            d = c.chart.exportingGroup;
                        a && d && b.setFocusToElement(d,
                            a.buttonElement)
                    },
                    terminate: function() { b.hideExportMenu() }
                })
            };
            c.prototype.onKbdPrevious = function(a) {
                var b = this.chart,
                    d = b.options.accessibility;
                a = a.response;
                for (var c = b.highlightedExportItemIx || 0; c--;)
                    if (b.highlightExportItem(c)) return a.success;
                return d.keyboardNavigation.wrapAround ? (b.highlightLastExportItem(), a.success) : a.prev
            };
            c.prototype.onKbdNext = function(a) {
                var b = this.chart,
                    d = b.options.accessibility;
                a = a.response;
                for (var c = (b.highlightedExportItemIx || 0) + 1; c < b.exportDivElements.length; ++c)
                    if (b.highlightExportItem(c)) return a.success;
                return d.keyboardNavigation.wrapAround ? (b.highlightExportItem(0), a.success) : a.next
            };
            c.prototype.onKbdClick = function(a) {
                var b = this.chart,
                    d = b.exportDivElements[b.highlightedExportItemIx],
                    c = (b.exportSVGElements && b.exportSVGElements[0]).element;
                this.isExportMenuShown ? this.fakeClickEvent(d) : (this.fakeClickEvent(c), b.highlightExportItem(0));
                return a.response.success
            };
            return c
        }(t);
        (function(c) {
            function e() { var a = this.exportSVGElements && this.exportSVGElements[0]; if (a && (a = a.element, a.onclick)) a.onclick(y("click")) }

            function d() {
                var a = this.exportDivElements;
                a && this.exportContextMenu && (a.forEach(function(a) { if (a && "highcharts-menu-item" === a.className && a.onmouseout) a.onmouseout(y("mouseout")) }), this.highlightedExportItemIx = 0, this.exportContextMenu.hideMenu(), this.container.focus())
            }

            function b(a) {
                var b = this.exportDivElements && this.exportDivElements[a],
                    d = this.exportDivElements && this.exportDivElements[this.highlightedExportItemIx];
                if (b && "LI" === b.tagName && (!b.children || !b.children.length)) {
                    var c = !!(this.renderTo.getElementsByTagName("g")[0] || {}).focus;
                    b.focus && c && b.focus();
                    if (d && d.onmouseout) d.onmouseout(y("mouseout"));
                    if (b.onmouseover) b.onmouseover(y("mouseover"));
                    this.highlightedExportItemIx = a;
                    return !0
                }
                return !1
            }

            function f() {
                if (this.exportDivElements)
                    for (var a = this.exportDivElements.length; a--;)
                        if (this.highlightExportItem(a)) return !0;
                return !1
            }
            var u = [];
            c.compose = function(c) {-1 === u.indexOf(c) && (u.push(c), c = a.prototype, c.hideExportMenu = d, c.highlightExportItem = b, c.highlightLastExportItem = f, c.showExportMenu = e) }
        })(h || (h = {}));
        return h
    });
    x(a,
        "Accessibility/KeyboardNavigation.js", [a["Core/Globals.js"], a["Accessibility/Components/MenuComponent.js"], a["Core/Utilities.js"], a["Accessibility/Utils/EventProvider.js"], a["Accessibility/Utils/HTMLUtilities.js"]],
        function(a, h, t, r, m) {
            var k = a.doc,
                B = a.win,
                n = t.addEvent,
                g = t.fireEvent,
                q = m.getElement;
            t = function() {
                function a(a, e) {
                    this.components = this.chart = void 0;
                    this.currentModuleIx = NaN;
                    this.exitAnchor = this.eventProvider = void 0;
                    this.modules = [];
                    this.tabindexContainer = void 0;
                    this.init(a, e)
                }
                a.prototype.init =
                    function(a, e) {
                        var d = this,
                            b = this.eventProvider = new r;
                        this.chart = a;
                        this.components = e;
                        this.modules = [];
                        this.currentModuleIx = 0;
                        this.update();
                        b.addEvent(this.tabindexContainer, "keydown", function(a) { return d.onKeydown(a) });
                        b.addEvent(this.tabindexContainer, "focus", function(a) { return d.onFocus(a) });
                        ["mouseup", "touchend"].forEach(function(a) { return b.addEvent(k, a, function() { return d.onMouseUp() }) });
                        ["mousedown", "touchstart"].forEach(function(c) { return b.addEvent(a.renderTo, c, function() { d.isClickingChart = !0 }) });
                        b.addEvent(a.renderTo, "mouseover", function() { d.pointerIsOverChart = !0 });
                        b.addEvent(a.renderTo, "mouseout", function() { d.pointerIsOverChart = !1 })
                    };
                a.prototype.update = function(a) {
                    var c = this.chart.options.accessibility;
                    c = c && c.keyboardNavigation;
                    var d = this.components;
                    this.updateContainerTabindex();
                    c && c.enabled && a && a.length ? (this.modules = a.reduce(function(a, c) { c = d[c].getKeyboardNavigation(); return a.concat(c) }, []), this.updateExitAnchor()) : (this.modules = [], this.currentModuleIx = 0, this.removeExitAnchor())
                };
                a.prototype.onFocus =
                    function(a) {
                        var c = this.chart;
                        a = a.relatedTarget && c.container.contains(a.relatedTarget);
                        this.exiting || this.tabbingInBackwards || this.isClickingChart || a || !this.modules[0] || this.modules[0].init(1);
                        this.exiting = !1
                    };
                a.prototype.onMouseUp = function() {
                    delete this.isClickingChart;
                    if (!this.keyboardReset && !this.pointerIsOverChart) {
                        var a = this.chart,
                            e = this.modules && this.modules[this.currentModuleIx || 0];
                        e && e.terminate && e.terminate();
                        a.focusElement && a.focusElement.removeFocusBorder();
                        this.currentModuleIx = 0;
                        this.keyboardReset = !0
                    }
                };
                a.prototype.onKeydown = function(a) {
                    a = a || B.event;
                    var c = this.modules && this.modules.length && this.modules[this.currentModuleIx],
                        d;
                    this.exiting = this.keyboardReset = !1;
                    if (c) {
                        var b = c.run(a);
                        b === c.response.success ? d = !0 : b === c.response.prev ? d = this.prev() : b === c.response.next && (d = this.next());
                        d && (a.preventDefault(), a.stopPropagation())
                    }
                };
                a.prototype.prev = function() { return this.move(-1) };
                a.prototype.next = function() { return this.move(1) };
                a.prototype.move = function(a) {
                    var c = this.modules && this.modules[this.currentModuleIx];
                    c && c.terminate && c.terminate(a);
                    this.chart.focusElement && this.chart.focusElement.removeFocusBorder();
                    this.currentModuleIx += a;
                    if (c = this.modules && this.modules[this.currentModuleIx]) { if (c.validate && !c.validate()) return this.move(a); if (c.init) return c.init(a), !0 }
                    this.currentModuleIx = 0;
                    this.exiting = !0;
                    0 < a ? this.exitAnchor.focus() : this.tabindexContainer.focus();
                    return !1
                };
                a.prototype.updateExitAnchor = function() {
                    var a = q("highcharts-end-of-chart-marker-" + this.chart.index);
                    this.removeExitAnchor();
                    a ? (this.makeElementAnExitAnchor(a),
                        this.exitAnchor = a) : this.createExitAnchor()
                };
                a.prototype.updateContainerTabindex = function() {
                    var a = this.chart.options.accessibility;
                    a = a && a.keyboardNavigation;
                    a = !(a && !1 === a.enabled);
                    var e = this.chart,
                        d = e.container;
                    e.renderTo.hasAttribute("tabindex") && (d.removeAttribute("tabindex"), d = e.renderTo);
                    this.tabindexContainer = d;
                    var b = d.getAttribute("tabindex");
                    a && !b ? d.setAttribute("tabindex", "0") : a || e.container.removeAttribute("tabindex")
                };
                a.prototype.makeElementAnExitAnchor = function(a) {
                    var c = this.tabindexContainer.getAttribute("tabindex") ||
                        0;
                    a.setAttribute("class", "highcharts-exit-anchor");
                    a.setAttribute("tabindex", c);
                    a.setAttribute("aria-hidden", !1);
                    this.addExitAnchorEventsToEl(a)
                };
                a.prototype.createExitAnchor = function() {
                    var a = this.chart,
                        e = this.exitAnchor = k.createElement("div");
                    a.renderTo.appendChild(e);
                    this.makeElementAnExitAnchor(e)
                };
                a.prototype.removeExitAnchor = function() { this.exitAnchor && this.exitAnchor.parentNode && (this.exitAnchor.parentNode.removeChild(this.exitAnchor), delete this.exitAnchor) };
                a.prototype.addExitAnchorEventsToEl =
                    function(a) {
                        var c = this.chart,
                            d = this;
                        this.eventProvider.addEvent(a, "focus", function(a) {
                            a = a || B.event;
                            a.relatedTarget && c.container.contains(a.relatedTarget) || d.exiting ? d.exiting = !1 : (d.tabbingInBackwards = !0, d.tabindexContainer.focus(), delete d.tabbingInBackwards, a.preventDefault(), d.modules && d.modules.length && (d.currentModuleIx = d.modules.length - 1, (a = d.modules[d.currentModuleIx]) && a.validate && !a.validate() ? d.prev() : a && a.init(-1)))
                        })
                    };
                a.prototype.destroy = function() {
                    this.removeExitAnchor();
                    this.eventProvider.removeAddedEvents();
                    this.chart.container.removeAttribute("tabindex")
                };
                return a
            }();
            (function(q) {
                function c() {
                    var a = this;
                    g(this, "dismissPopupContent", {}, function() {
                        a.tooltip && a.tooltip.hide(0);
                        a.hideExportMenu()
                    })
                }

                function e(b) { 27 === (b.which || b.keyCode) && a.charts && a.charts.forEach(function(a) { a && a.dismissPopupContent && a.dismissPopupContent() }) }
                var d = [];
                q.compose = function(a) { h.compose(a); - 1 === d.indexOf(a) && (d.push(a), a.prototype.dismissPopupContent = c); - 1 === d.indexOf(k) && (d.push(k), n(k, "keydown", e)); return a }
            })(t || (t = {}));
            return t
        });
    x(a, "Accessibility/Components/LegendComponent.js", [a["Core/Animation/AnimationUtilities.js"], a["Core/Globals.js"], a["Core/Legend/Legend.js"], a["Core/Utilities.js"], a["Accessibility/AccessibilityComponent.js"], a["Accessibility/KeyboardNavigationHandler.js"], a["Accessibility/Utils/ChartUtilities.js"], a["Accessibility/Utils/HTMLUtilities.js"]], function(a, h, t, r, m, w, B, n) {
        function g(a) {
            var b = a.legend && a.legend.allItems,
                d = a.options.legend.accessibility || {};
            return !(!b || !b.length || a.colorAxis &&
                a.colorAxis.length || !1 === d.enabled)
        }
        var q = this && this.__extends || function() {
                var a = function(b, d) {
                    a = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(a, b) { a.__proto__ = b } || function(a, b) { for (var d in b) b.hasOwnProperty(d) && (a[d] = b[d]) };
                    return a(b, d)
                };
                return function(b, d) {
                    function c() { this.constructor = b }
                    a(b, d);
                    b.prototype = null === d ? Object.create(d) : (c.prototype = d.prototype, new c)
                }
            }(),
            k = a.animObject,
            c = r.addEvent,
            e = r.fireEvent,
            d = r.isNumber,
            b = r.pick,
            f = r.syncTimeout,
            u = B.getChartTitle,
            v = n.stripHTMLTagsFromString,
            K = n.addClass,
            E = n.removeClass;
        a = function(a) {
            function d() {
                var b = null !== a && a.apply(this, arguments) || this;
                b.highlightedLegendItemIx = NaN;
                return b
            }
            q(d, a);
            d.prototype.init = function() {
                var a = this;
                this.recreateProxies();
                this.addEvent(t, "afterScroll", function() { this.chart === a.chart && (a.proxyProvider.updateGroupProxyElementPositions("legend"), a.updateLegendItemProxyVisibility(), -1 < a.highlightedLegendItemIx && this.chart.highlightLegendItem(a.highlightedLegendItemIx)) });
                this.addEvent(t, "afterPositionItem", function(b) {
                    this.chart ===
                        a.chart && this.chart.renderer && a.updateProxyPositionForItem(b.item)
                });
                this.addEvent(t, "afterRender", function() { this.chart === a.chart && this.chart.renderer && a.recreateProxies() && f(function() { return a.proxyProvider.updateGroupProxyElementPositions("legend") }, k(b(this.chart.renderer.globalAnimation, !0)).duration) })
            };
            d.prototype.updateLegendItemProxyVisibility = function() {
                var a = this.chart,
                    b = a.legend,
                    d = b.currentPage || 1,
                    c = b.clipHeight || 0;
                (b.allItems || []).forEach(function(e) {
                    if (e.a11yProxyElement) {
                        var f = e.a11yProxyElement.element,
                            p = !1;
                        if (b.pages && b.pages.length) {
                            p = e.pageIx || 0;
                            var A = e._legendItemPos ? e._legendItemPos[1] : 0;
                            e = e.legendItem ? Math.round(e.legendItem.getBBox().height) : 0;
                            p = A + e - b.pages[p] > c || p !== d - 1
                        }
                        p ? a.styledMode ? K(f, "highcharts-a11y-invisible") : f.style.visibility = "hidden" : (E(f, "highcharts-a11y-invisible"), f.style.visibility = "")
                    }
                })
            };
            d.prototype.onChartRender = function() { g(this.chart) || this.removeProxies() };
            d.prototype.highlightAdjacentLegendPage = function(a) {
                var b = this.chart,
                    d = b.legend;
                a = (d.currentPage || 1) + a;
                var c = d.pages || [];
                if (0 < a && a <= c.length) {
                    c = d.allItems.length;
                    for (var e = 0; e < c; ++e)
                        if (d.allItems[e].pageIx + 1 === a) { b.highlightLegendItem(e) && (this.highlightedLegendItemIx = e); break }
                }
            };
            d.prototype.updateProxyPositionForItem = function(a) { a.a11yProxyElement && a.a11yProxyElement.refreshPosition() };
            d.prototype.recreateProxies = function() { this.removeProxies(); return g(this.chart) ? (this.addLegendProxyGroup(), this.proxyLegendItems(), this.updateLegendItemProxyVisibility(), this.updateLegendTitle(), !0) : !1 };
            d.prototype.removeProxies =
                function() { this.proxyProvider.removeGroup("legend") };
            d.prototype.updateLegendTitle = function() {
                var a = this.chart,
                    b = v((a.legend && a.legend.options.title && a.legend.options.title.text || "").replace(/<br ?\/?>/g, " "));
                a = a.langFormat("accessibility.legend.legendLabel" + (b ? "" : "NoTitle"), { chart: a, legendTitle: b, chartTitle: u(a) });
                this.proxyProvider.updateGroupAttrs("legend", { "aria-label": a })
            };
            d.prototype.addLegendProxyGroup = function() {
                this.proxyProvider.addGroup("legend", "ul", {
                    "aria-label": "_placeholder_",
                    role: "all" ===
                        this.chart.options.accessibility.landmarkVerbosity ? "region" : null
                })
            };
            d.prototype.proxyLegendItems = function() {
                var a = this;
                (this.chart.legend && this.chart.legend.allItems || []).forEach(function(b) { b.legendItem && b.legendItem.element && a.proxyLegendItem(b) })
            };
            d.prototype.proxyLegendItem = function(a) {
                if (a.legendItem && a.legendGroup) {
                    var b = this.chart.langFormat("accessibility.legend.legendItem", { chart: this.chart, itemName: v(a.name), item: a });
                    a.a11yProxyElement = this.proxyProvider.addProxyElement("legend", {
                        click: a.legendItem,
                        visual: (a.legendGroup.div ? a.legendItem : a.legendGroup).element
                    }, { tabindex: -1, "aria-pressed": a.visible, "aria-label": b })
                }
            };
            d.prototype.getKeyboardNavigation = function() {
                var a = this.keyCodes,
                    b = this,
                    d = this.chart;
                return new w(d, {
                    keyCodeMap: [
                        [
                            [a.left, a.right, a.up, a.down],
                            function(a) { return b.onKbdArrowKey(this, a) }
                        ],
                        [
                            [a.enter, a.space],
                            function(d) { return h.isFirefox && d === a.space ? this.response.success : b.onKbdClick(this) }
                        ],
                        [
                            [a.pageDown, a.pageUp],
                            function(d) { b.highlightAdjacentLegendPage(d === a.pageDown ? 1 : -1); return this.response.success }
                        ]
                    ],
                    validate: function() { return b.shouldHaveLegendNavigation() },
                    init: function(a) { return b.onKbdNavigationInit(a) },
                    terminate: function() {
                        b.highlightedLegendItemIx = -1;
                        d.legend.allItems.forEach(function(a) { return a.setState("", !0) })
                    }
                })
            };
            d.prototype.onKbdArrowKey = function(a, b) {
                var d = this.keyCodes,
                    c = a.response,
                    e = this.chart,
                    f = e.options.accessibility,
                    p = e.legend.allItems.length;
                b = b === d.left || b === d.up ? -1 : 1;
                return e.highlightLegendItem(this.highlightedLegendItemIx + b) ? (this.highlightedLegendItemIx += b, c.success) : 1 <
                    p && f.keyboardNavigation.wrapAround ? (a.init(b), c.success) : c[0 < b ? "next" : "prev"]
            };
            d.prototype.onKbdClick = function(a) {
                var b = this.chart.legend.allItems[this.highlightedLegendItemIx];
                b && b.a11yProxyElement && b.a11yProxyElement.click();
                return a.response.success
            };
            d.prototype.shouldHaveLegendNavigation = function() {
                var a = this.chart,
                    b = a.colorAxis && a.colorAxis.length,
                    d = (a.options.legend || {}).accessibility || {};
                return !!(a.legend && a.legend.allItems && a.legend.display && !b && d.enabled && d.keyboardNavigation && d.keyboardNavigation.enabled)
            };
            d.prototype.onKbdNavigationInit = function(a) {
                var b = this.chart,
                    d = b.legend.allItems.length - 1;
                a = 0 < a ? 0 : d;
                b.highlightLegendItem(a);
                this.highlightedLegendItemIx = a
            };
            return d
        }(m);
        (function(a) {
            function b(a) {
                var b = this.legend.allItems,
                    c = this.accessibility && this.accessibility.components.legend.highlightedLegendItemIx,
                    f = b[a];
                return f ? (d(c) && b[c] && e(b[c].legendGroup.element, "mouseout"), b = this.legend, a = b.allItems[a].pageIx, c = b.currentPage, "undefined" !== typeof a && a + 1 !== c && b.scroll(1 + a - c), a = f.legendItem, b = f.a11yProxyElement &&
                    f.a11yProxyElement.buttonElement, a && a.element && b && this.setFocusToElement(a, b), f.legendGroup && e(f.legendGroup.element, "mouseover"), !0) : !1
            }

            function f(a) {
                var b = a.item;
                this.chart.options.accessibility.enabled && b && b.a11yProxyElement && b.a11yProxyElement.buttonElement.setAttribute("aria-pressed", a.visible ? "true" : "false")
            }
            var u = [];
            a.compose = function(a, d) {-1 === u.indexOf(a) && (u.push(a), a.prototype.highlightLegendItem = b); - 1 === u.indexOf(d) && (u.push(d), c(d, "afterColorizeItem", f)) }
        })(a || (a = {}));
        return a
    });
    x(a,
        "Accessibility/Components/SeriesComponent/SeriesDescriber.js", [a["Accessibility/Components/AnnotationsA11y.js"], a["Accessibility/Utils/ChartUtilities.js"], a["Core/FormatUtilities.js"], a["Accessibility/Utils/HTMLUtilities.js"], a["Core/Utilities.js"]],
        function(a, h, t, r, m) {
            function k(a) { var b = a.index; return a.series && a.series.data && p(b) ? x(a.series.data, function(a) { return !!(a && "undefined" !== typeof a.index && a.index > b && a.graphic && a.graphic.element) }) || null : null }

            function B(a) {
                var b = a.chart.options.accessibility.series.pointDescriptionEnabledThreshold;
                return !!(!1 !== b && a.points && a.points.length >= b)
            }

            function n(a) { var b = a.options.accessibility || {}; return !B(a) && !b.exposeAsGroupOnly }

            function g(a) { var b = a.chart.options.accessibility.keyboardNavigation.seriesNavigation; return !(!a.points || !(a.points.length < b.pointNavigationEnabledThreshold || !1 === b.pointNavigationEnabledThreshold)) }

            function q(a, b) {
                var d = a.series,
                    c = d.chart;
                a = c.options.accessibility.point || {};
                var e = d.options.accessibility && d.options.accessibility.point || {};
                d = d.tooltipOptions || {};
                c = c.options.lang;
                return L(b) ? D(b, e.valueDecimals || a.valueDecimals || d.valueDecimals || -1, c.decimalPoint, c.accessibility.thousandsSep || c.thousandsSep) : b
            }

            function y(a) { var b = (a.options.accessibility || {}).description; return b && a.chart.langFormat("accessibility.series.description", { description: b, series: a }) || "" }

            function c(a, b) { return a.chart.langFormat("accessibility.series." + b + "Description", { name: v(a[b]), series: a }) }

            function e(a, b, d) {
                var c = b || "",
                    e = d || "";
                return a.series.pointArrayMap.reduce(function(b, d) {
                    b += b.length ? ", " :
                        "";
                    var p = q(a, l(a[d], a.options[d]));
                    return b + (d + ": " + c + p + e)
                }, "")
            }

            function d(a) {
                var b = a.series,
                    d = b.chart,
                    c = a.series;
                var f = c.chart;
                var A = c.options.accessibility;
                A = A && A.point && A.point.valueDescriptionFormat || f.options.accessibility.point.valueDescriptionFormat;
                c = l(c.xAxis && c.xAxis.options.accessibility && c.xAxis.options.accessibility.enabled, !f.angular);
                if (c) {
                    var g = a.series;
                    var v = g.chart;
                    var h = g.options.accessibility && g.options.accessibility.point || {},
                        k = v.options.accessibility.point || {};
                    (g = g.xAxis && g.xAxis.dateTime) ?
                    (g = g.getXDateFormat(a.x || 0, v.options.tooltip.dateTimeLabelFormats), h = h.dateFormatter && h.dateFormatter(a) || k.dateFormatter && k.dateFormatter(a) || h.dateFormat || k.dateFormat || g, v = v.time.dateFormat(h, a.x || 0, void 0)) : v = void 0;
                    h = (a.series.xAxis || {}).categories && p(a.category) && ("" + a.category).replace("<br/>", " ");
                    k = a.id && 0 > a.id.indexOf("highcharts-");
                    g = "x, " + a.x;
                    v = a.name || v || h || (k ? a.id : g)
                } else v = "";
                h = p(a.index) ? a.index + 1 : "";
                k = a.series;
                var m = k.chart.options.accessibility.point || {},
                    y = k.chart.options.accessibility &&
                    k.chart.options.accessibility.point || {},
                    n = k.tooltipOptions || {};
                g = y.valuePrefix || m.valuePrefix || n.valuePrefix || "";
                m = y.valueSuffix || m.valueSuffix || n.valueSuffix || "";
                y = q(a, a["undefined" !== typeof a.value ? "value" : "y"]);
                k = a.isNull ? k.chart.langFormat("accessibility.series.nullPointValue", { point: a }) : k.pointArrayMap ? e(a, g, m) : g + y + m;
                f = z(A, { point: a, index: h, xDescription: v, value: k, separator: c ? ", " : "" }, f);
                A = (A = a.options && a.options.accessibility && a.options.accessibility.description) ? " " + A : "";
                b = 1 < d.series.length &&
                    b.name ? " " + b.name + "." : "";
                d = a.series.chart;
                c = u(a);
                v = { point: a, annotations: c };
                d = c.length ? d.langFormat("accessibility.series.pointAnnotationsDescription", v) : "";
                a.accessibility = a.accessibility || {};
                a.accessibility.valueDescription = f;
                return f + A + b + (d ? " " + d : "")
            }

            function b(a) {
                var b = n(a),
                    c = g(a);
                (b || c) && a.points.forEach(function(c) {
                    var e;
                    if (!(e = c.graphic && c.graphic.element) && (e = c.series && c.series.is("sunburst"), e = c.isNull && !e)) {
                        var p = c.series,
                            f = k(c);
                        p = (e = f && f.graphic) ? e.parentGroup : p.graph || p.group;
                        f = f ? {
                            x: l(c.plotX,
                                f.plotX, 0),
                            y: l(c.plotY, f.plotY, 0)
                        } : { x: l(c.plotX, 0), y: l(c.plotY, 0) };
                        f = c.series.chart.renderer.rect(f.x, f.y, 1, 1);
                        f.attr({ "class": "highcharts-a11y-dummy-point", fill: "none", opacity: 0, "fill-opacity": 0, "stroke-opacity": 0 });
                        p && p.element ? (c.graphic = f, c.hasDummyGraphic = !0, f.add(p), p.element.insertBefore(f.element, e ? e.element : null), e = f.element) : e = void 0
                    }
                    p = c.options && c.options.accessibility && !1 === c.options.accessibility.enabled;
                    e && (e.setAttribute("tabindex", "-1"), a.chart.styledMode || (e.style.outline = "none"),
                        b && !p ? (f = c.series, p = f.chart.options.accessibility.point || {}, f = f.options.accessibility && f.options.accessibility.point || {}, c = C(f.descriptionFormatter && f.descriptionFormatter(c) || p.descriptionFormatter && p.descriptionFormatter(c) || d(c)), e.setAttribute("role", "img"), e.setAttribute("aria-label", c)) : e.setAttribute("aria-hidden", !0))
                })
            }

            function f(a) {
                var b = a.chart,
                    d = b.types || [],
                    e = y(a),
                    f = function(d) { return b[d] && 1 < b[d].length && a[d] },
                    p = c(a, "xAxis"),
                    A = c(a, "yAxis"),
                    l = {
                        name: a.name || "",
                        ix: a.index + 1,
                        numSeries: b.series &&
                            b.series.length,
                        numPoints: a.points && a.points.length,
                        series: a
                    };
                d = 1 < d.length ? "Combination" : "";
                return (b.langFormat("accessibility.series.summary." + a.type + d, l) || b.langFormat("accessibility.series.summary.default" + d, l)) + (e ? " " + e : "") + (f("yAxis") ? " " + A : "") + (f("xAxis") ? " " + p : "")
            }
            var u = a.getPointAnnotationTexts,
                v = h.getAxisDescription,
                K = h.getSeriesFirstPointElement,
                E = h.getSeriesA11yElement,
                G = h.unhideChartElementFromAT,
                z = t.format,
                D = t.numberFormat,
                F = r.reverseChildNodes,
                C = r.stripHTMLTagsFromString,
                x = m.find,
                L =
                m.isNumber,
                l = m.pick,
                p = m.defined;
            return {
                defaultPointDescriptionFormatter: d,
                defaultSeriesDescriptionFormatter: f,
                describeSeries: function(a) {
                    var d = a.chart,
                        c = K(a),
                        e = E(a),
                        p = d.is3d && d.is3d();
                    if (e) {
                        e.lastChild !== c || p || F(e);
                        b(a);
                        G(d, e);
                        p = a.chart;
                        d = p.options.chart;
                        c = 1 < p.series.length;
                        p = p.options.accessibility.series.describeSingleSeries;
                        var l = (a.options.accessibility || {}).exposeAsGroupOnly;
                        d.options3d && d.options3d.enabled && c || !(c || p || l || B(a)) ? e.setAttribute("aria-label", "") : (d = a.chart.options.accessibility,
                            c = d.landmarkVerbosity, (a.options.accessibility || {}).exposeAsGroupOnly ? e.setAttribute("role", "img") : "all" === c && e.setAttribute("role", "region"), e.setAttribute("tabindex", "-1"), a.chart.styledMode || (e.style.outline = "none"), e.setAttribute("aria-label", C(d.series.descriptionFormatter && d.series.descriptionFormatter(a) || f(a))))
                    }
                }
            }
        });
    x(a, "Accessibility/Components/SeriesComponent/NewDataAnnouncer.js", [a["Core/Globals.js"], a["Core/Utilities.js"], a["Accessibility/Utils/Announcer.js"], a["Accessibility/Utils/ChartUtilities.js"],
        a["Accessibility/Utils/EventProvider.js"], a["Accessibility/Components/SeriesComponent/SeriesDescriber.js"]
    ], function(a, h, t, r, m, w) {
        function k(a) { var b = a.series.data.filter(function(b) { return a.x === b.x && a.y === b.y }); return 1 === b.length ? b[0] : a }

        function n(a, b) { var d = (a || []).concat(b || []).reduce(function(a, b) { a[b.name + b.index] = b; return a }, {}); return Object.keys(d).map(function(a) { return d[a] }) }
        var g = h.addEvent,
            q = h.defined,
            y = r.getChartTitle,
            c = w.defaultPointDescriptionFormatter,
            e = w.defaultSeriesDescriptionFormatter;
        h = function() {
            function d(a) {
                this.announcer = void 0;
                this.dirty = { allSeries: {} };
                this.eventProvider = void 0;
                this.lastAnnouncementTime = 0;
                this.chart = a
            }
            d.prototype.init = function() {
                var a = this.chart,
                    d = a.options.accessibility.announceNewData.interruptUser ? "assertive" : "polite";
                this.lastAnnouncementTime = 0;
                this.dirty = { allSeries: {} };
                this.eventProvider = new m;
                this.announcer = new t(a, d);
                this.addEventListeners()
            };
            d.prototype.destroy = function() {
                this.eventProvider.removeAddedEvents();
                this.announcer.destroy()
            };
            d.prototype.addEventListeners =
                function() {
                    var a = this,
                        d = this.chart,
                        c = this.eventProvider;
                    c.addEvent(d, "afterDrilldown", function() { a.lastAnnouncementTime = 0 });
                    c.addEvent(d, "afterAddSeries", function(b) { a.onSeriesAdded(b.series) });
                    c.addEvent(d, "redraw", function() { a.announceDirtyData() })
                };
            d.prototype.onSeriesAdded = function(a) { this.chart.options.accessibility.announceNewData.enabled && (this.dirty.hasDirty = !0, this.dirty.allSeries[a.name + a.index] = a, this.dirty.newSeries = q(this.dirty.newSeries) ? void 0 : a) };
            d.prototype.announceDirtyData = function() {
                var a =
                    this;
                if (this.chart.options.accessibility.announceNewData && this.dirty.hasDirty) {
                    var d = this.dirty.newPoint;
                    d && (d = k(d));
                    this.queueAnnouncement(Object.keys(this.dirty.allSeries).map(function(b) { return a.dirty.allSeries[b] }), this.dirty.newSeries, d);
                    this.dirty = { allSeries: {} }
                }
            };
            d.prototype.queueAnnouncement = function(a, d, c) {
                var b = this,
                    e = this.chart.options.accessibility.announceNewData;
                if (e.enabled) {
                    var f = +new Date;
                    e = Math.max(0, e.minAnnounceInterval - (f - this.lastAnnouncementTime));
                    a = n(this.queuedAnnouncement &&
                        this.queuedAnnouncement.series, a);
                    if (d = this.buildAnnouncementMessage(a, d, c)) this.queuedAnnouncement && clearTimeout(this.queuedAnnouncementTimer), this.queuedAnnouncement = { time: f, message: d, series: a }, this.queuedAnnouncementTimer = setTimeout(function() { b && b.announcer && (b.lastAnnouncementTime = +new Date, b.announcer.announce(b.queuedAnnouncement.message), delete b.queuedAnnouncement, delete b.queuedAnnouncementTimer) }, e)
                }
            };
            d.prototype.buildAnnouncementMessage = function(b, d, g) {
                var f = this.chart,
                    u = f.options.accessibility.announceNewData;
                if (u.announcementFormatter && (b = u.announcementFormatter(b, d, g), !1 !== b)) return b.length ? b : null;
                b = a.charts && 1 < a.charts.length ? "Multiple" : "Single";
                b = d ? "newSeriesAnnounce" + b : g ? "newPointAnnounce" + b : "newDataAnnounce";
                u = y(f);
                return f.langFormat("accessibility.announceNewData." + b, { chartTitle: u, seriesDesc: d ? e(d) : null, pointDesc: g ? c(g) : null, point: g, series: d })
            };
            return d
        }();
        (function(a) {
            function b(a) {
                var b = this.chart,
                    d = this.newDataAnnouncer;
                d && d.chart === b && b.options.accessibility.announceNewData.enabled && (d.dirty.newPoint =
                    q(d.dirty.newPoint) ? void 0 : a.point)
            }

            function d() {
                var a = this.chart,
                    b = this.newDataAnnouncer;
                b && b.chart === a && a.options.accessibility.announceNewData.enabled && (b.dirty.hasDirty = !0, b.dirty.allSeries[this.name + this.index] = this)
            }
            a.composedClasses = [];
            a.compose = function(c) {-1 === a.composedClasses.indexOf(c) && (a.composedClasses.push(c), g(c, "addPoint", b), g(c, "updatedData", d)) }
        })(h || (h = {}));
        return h
    });
    x(a, "Accessibility/ProxyElement.js", [a["Core/Globals.js"], a["Core/Utilities.js"], a["Accessibility/Utils/EventProvider.js"],
        a["Accessibility/Utils/ChartUtilities.js"], a["Accessibility/Utils/HTMLUtilities.js"]
    ], function(a, h, t, r, m) {
        var k = a.doc,
            B = h.attr,
            n = h.css,
            g = h.merge,
            q = r.fireEventOnWrappedOrUnwrappedElement,
            y = m.cloneMouseEvent,
            c = m.cloneTouchEvent,
            e = m.getFakeMouseEvent,
            d = m.removeElement;
        return function() {
            function a(a, b, d, c) {
                this.chart = a;
                this.target = b;
                this.groupType = d;
                d = "ul" === d;
                this.eventProvider = new t;
                var e = d ? k.createElement("li") : null,
                    f = this.buttonElement = k.createElement("button");
                a.styledMode || this.hideButtonVisually(f);
                e ? (d && !a.styledMode && (e.style.listStyle = "none"), e.appendChild(f), this.element = e) : this.element = f;
                this.updateTarget(b, c)
            }
            a.prototype.click = function() {
                var a = this.getTargetPosition();
                a.x += a.width / 2;
                a.y += a.height / 2;
                a = e("click", a);
                q(this.target.click, a)
            };
            a.prototype.updateTarget = function(a, b) {
                this.target = a;
                this.updateCSSClassName();
                B(this.buttonElement, g({ "aria-label": this.getTargetAttr(a.click, "aria-label") }, b));
                this.eventProvider.removeAddedEvents();
                this.addProxyEventsToButton(this.buttonElement, a.click);
                this.refreshPosition()
            };
            a.prototype.refreshPosition = function() {
                var a = this.getTargetPosition();
                n(this.buttonElement, { width: (a.width || 1) + "px", height: (a.height || 1) + "px", left: (Math.round(a.x) || 0) + "px", top: (Math.round(a.y) || 0) + "px" })
            };
            a.prototype.remove = function() {
                this.eventProvider.removeAddedEvents();
                d(this.element)
            };
            a.prototype.updateCSSClassName = function() {
                var a = this.chart.legend;
                a = a.group && a.group.div;
                a = -1 < (a && a.className || "").indexOf("highcharts-no-tooltip");
                var b = -1 < (this.getTargetAttr(this.target.click,
                    "class") || "").indexOf("highcharts-no-tooltip");
                this.buttonElement.className = a || b ? "highcharts-a11y-proxy-button highcharts-no-tooltip" : "highcharts-a11y-proxy-button"
            };
            a.prototype.addProxyEventsToButton = function(a, b) {
                var d = this;
                "click touchstart touchend touchcancel touchmove mouseover mouseenter mouseleave mouseout".split(" ").forEach(function(e) {
                    var f = 0 === e.indexOf("touch");
                    d.eventProvider.addEvent(a, e, function(a) {
                        var d = f ? c(a) : y(a);
                        b && q(b, d);
                        a.stopPropagation();
                        f || a.preventDefault()
                    }, { passive: !1 })
                })
            };
            a.prototype.hideButtonVisually = function(a) { n(a, { borderWidth: 0, backgroundColor: "transparent", cursor: "pointer", outline: "none", opacity: .001, filter: "alpha(opacity=1)", zIndex: 999, overflow: "hidden", padding: 0, margin: 0, display: "block", position: "absolute", "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=1)" }) };
            a.prototype.getTargetPosition = function() {
                var a = this.target.click;
                a = a.element ? a.element : a;
                var b = this.target.visual || a;
                return (a = this.chart.renderTo) && b && b.getBoundingClientRect ? (b = b.getBoundingClientRect(),
                    a = a.getBoundingClientRect(), { x: b.left - a.left, y: b.top - a.top, width: b.right - b.left, height: b.bottom - b.top }) : { x: 0, y: 0, width: 1, height: 1 }
            };
            a.prototype.getTargetAttr = function(a, b) { return a.element ? a.element.getAttribute(b) : a.getAttribute(b) };
            return a
        }()
    });
    x(a, "Accessibility/ProxyProvider.js", [a["Core/Globals.js"], a["Core/Utilities.js"], a["Accessibility/Utils/ChartUtilities.js"], a["Accessibility/Utils/DOMElementProvider.js"], a["Accessibility/Utils/HTMLUtilities.js"], a["Accessibility/ProxyElement.js"]], function(a,
        h, t, r, m, w) {
        var k = a.doc,
            n = h.attr,
            g = h.css,
            q = t.unhideChartElementFromAT,
            y = m.removeElement,
            c = m.removeChildNodes;
        return function() {
            function a(a) {
                this.chart = a;
                this.domElementProvider = new r;
                this.groups = {};
                this.groupOrder = [];
                this.beforeChartProxyPosContainer = this.createProxyPosContainer("before");
                this.afterChartProxyPosContainer = this.createProxyPosContainer("after");
                this.update()
            }
            a.prototype.addProxyElement = function(a, b, c) {
                var d = this.groups[a];
                if (!d) throw Error("ProxyProvider.addProxyElement: Invalid group key " +
                    a);
                a = new w(this.chart, b, d.type, c);
                d.proxyContainerElement.appendChild(a.element);
                d.proxyElements.push(a);
                return a
            };
            a.prototype.addGroup = function(a, b, c) {
                if (!this.groups[a]) {
                    var d = this.domElementProvider.createElement(b);
                    if (c && c.role && "div" !== b) {
                        var e = this.domElementProvider.createElement("div");
                        e.appendChild(d)
                    } else e = d;
                    e.className = "highcharts-a11y-proxy-group highcharts-a11y-proxy-group-" + a.replace(/\W/g, "-");
                    this.groups[a] = { proxyContainerElement: d, groupElement: e, type: b, proxyElements: [] };
                    n(e, c || {});
                    "ul" === b && d.setAttribute("role", "list");
                    this.afterChartProxyPosContainer.appendChild(e);
                    this.updateGroupOrder(this.groupOrder)
                }
            };
            a.prototype.updateGroupAttrs = function(a, b) {
                var d = this.groups[a];
                if (!d) throw Error("ProxyProvider.updateGroupAttrs: Invalid group key " + a);
                n(d.groupElement, b)
            };
            a.prototype.updateGroupOrder = function(a) {
                var b = this;
                this.groupOrder = a.slice();
                if (!this.isDOMOrderGroupOrder()) {
                    var d = a.indexOf("series"),
                        e = -1 < d ? a.slice(0, d) : a,
                        g = -1 < d ? a.slice(d + 1) : [];
                    a = k.activeElement;
                    ["before", "after"].forEach(function(a) {
                        var d =
                            b["before" === a ? "beforeChartProxyPosContainer" : "afterChartProxyPosContainer"];
                        a = "before" === a ? e : g;
                        c(d);
                        a.forEach(function(a) {
                            (a = b.groups[a]) && d.appendChild(a.groupElement)
                        })
                    });
                    (this.beforeChartProxyPosContainer.contains(a) || this.afterChartProxyPosContainer.contains(a)) && a && a.focus && a.focus()
                }
            };
            a.prototype.clearGroup = function(a) {
                var b = this.groups[a];
                if (!b) throw Error("ProxyProvider.clearGroup: Invalid group key " + a);
                c(b.proxyContainerElement)
            };
            a.prototype.removeGroup = function(a) {
                var b = this.groups[a];
                b && (y(b.groupElement), delete this.groups[a])
            };
            a.prototype.update = function() {
                this.updatePosContainerPositions();
                this.updateGroupOrder(this.groupOrder);
                this.updateProxyElementPositions()
            };
            a.prototype.updateProxyElementPositions = function() { Object.keys(this.groups).forEach(this.updateGroupProxyElementPositions.bind(this)) };
            a.prototype.updateGroupProxyElementPositions = function(a) {
                (a = this.groups[a]) && a.proxyElements.forEach(function(a) { return a.refreshPosition() })
            };
            a.prototype.destroy = function() { this.domElementProvider.destroyCreatedElements() };
            a.prototype.createProxyPosContainer = function(a) {
                var b = this.domElementProvider.createElement("div");
                b.setAttribute("aria-hidden", "false");
                b.className = "highcharts-a11y-proxy-container" + (a ? "-" + a : "");
                g(b, { top: "0", left: "0" });
                this.chart.styledMode || (b.style.whiteSpace = "nowrap", b.style.position = "absolute");
                return b
            };
            a.prototype.getCurrentGroupOrderInDOM = function() {
                var a = this,
                    b = function(b) {
                        var d = [];
                        b = b.children;
                        for (var c = 0; c < b.length; ++c) {
                            a: {
                                var e = b[c];
                                for (var f = Object.keys(a.groups), g = f.length; g--;) {
                                    var h =
                                        f[g],
                                        q = a.groups[h];
                                    if (q && e === q.groupElement) { e = h; break a }
                                }
                                e = void 0
                            }
                            e && d.push(e)
                        }
                        return d
                    },
                    c = b(this.beforeChartProxyPosContainer);
                b = b(this.afterChartProxyPosContainer);
                c.push("series");
                return c.concat(b)
            };
            a.prototype.isDOMOrderGroupOrder = function() {
                var a = this,
                    b = this.getCurrentGroupOrderInDOM(),
                    c = this.groupOrder.filter(function(b) { return "series" === b || !!a.groups[b] }),
                    e = b.length;
                if (e !== c.length) return !1;
                for (; e--;)
                    if (b[e] !== c[e]) return !1;
                return !0
            };
            a.prototype.updatePosContainerPositions = function() {
                var a =
                    this.chart,
                    b = a.renderer.box;
                a.container.insertBefore(this.afterChartProxyPosContainer, b.nextSibling);
                a.container.insertBefore(this.beforeChartProxyPosContainer, b);
                q(this.chart, this.afterChartProxyPosContainer);
                q(this.chart, this.beforeChartProxyPosContainer)
            };
            return a
        }()
    });
    x(a, "Extensions/RangeSelector.js", [a["Core/Axis/Axis.js"], a["Core/Chart/Chart.js"], a["Core/Globals.js"], a["Core/DefaultOptions.js"], a["Core/Renderer/SVG/SVGElement.js"], a["Core/Utilities.js"]], function(a, h, t, r, m, w) {
        function k(a) {
            if (-1 !==
                a.indexOf("%L")) return "text";
            var b = "aAdewbBmoyY".split("").some(function(b) { return -1 !== a.indexOf("%" + b) }),
                d = "HkIlMS".split("").some(function(b) { return -1 !== a.indexOf("%" + b) });
            return b && d ? "datetime-local" : b ? "date" : d ? "time" : "text"
        }
        var n = r.defaultOptions,
            g = w.addEvent,
            q = w.createElement,
            y = w.css,
            c = w.defined,
            e = w.destroyObjectProperties,
            d = w.discardElement,
            b = w.extend,
            f = w.find,
            u = w.fireEvent,
            v = w.isNumber,
            x = w.merge,
            E = w.objectEach,
            G = w.pad,
            z = w.pick,
            D = w.pInt,
            F = w.splat;
        b(n, {
            rangeSelector: {
                allButtonsEnabled: !1,
                buttons: void 0,
                buttonSpacing: 5,
                dropdown: "responsive",
                enabled: void 0,
                verticalAlign: "top",
                buttonTheme: { width: 28, height: 18, padding: 2, zIndex: 7 },
                floating: !1,
                x: 0,
                y: 0,
                height: void 0,
                inputBoxBorderColor: "none",
                inputBoxHeight: 17,
                inputBoxWidth: void 0,
                inputDateFormat: "%b %e, %Y",
                inputDateParser: void 0,
                inputEditDateFormat: "%Y-%m-%d",
                inputEnabled: !0,
                inputPosition: { align: "right", x: 0, y: 0 },
                inputSpacing: 5,
                selected: void 0,
                buttonPosition: { align: "left", x: 0, y: 0 },
                inputStyle: { color: "#335cad", cursor: "pointer" },
                labelStyle: { color: "#666666" }
            }
        });
        b(n.lang, { rangeSelectorZoom: "Zoom", rangeSelectorFrom: "", rangeSelectorTo: "\u2192" });
        var C = function() {
            function f(a) {
                this.buttons = void 0;
                this.buttonOptions = f.prototype.defaultButtons;
                this.initialButtonGroupWidth = 0;
                this.options = void 0;
                this.chart = a;
                this.init(a)
            }
            f.prototype.clickButton = function(b, d) {
                var e = this.chart,
                    p = this.buttonOptions[b],
                    f = e.xAxis[0],
                    A = e.scroller && e.scroller.getUnionExtremes() || f || {},
                    l = A.dataMin,
                    h = A.dataMax,
                    q = f && Math.round(Math.min(f.max, z(h, f.max))),
                    k = p.type;
                A = p._range;
                var m, y = p.dataGrouping;
                if (null !== l && null !== h) {
                    e.fixedRange = A;
                    this.setSelected(b);
                    y && (this.forcedDataGrouping = !0, a.prototype.setDataGrouping.call(f || { chart: this.chart }, y, !1), this.frozenStates = p.preserveDataGrouping);
                    if ("month" === k || "year" === k)
                        if (f) {
                            k = { range: p, max: q, chart: e, dataMin: l, dataMax: h };
                            var n = f.minFromRange.call(k);
                            v(k.newMax) && (q = k.newMax)
                        } else A = p;
                    else if (A) n = Math.max(q - A, l), q = Math.min(n + A, h);
                    else if ("ytd" === k)
                        if (f) "undefined" === typeof h && (l = Number.MAX_VALUE, h = Number.MIN_VALUE, e.series.forEach(function(a) {
                            a = a.xData;
                            l = Math.min(a[0], l);
                            h = Math.max(a[a.length - 1], h)
                        }), d = !1), q = this.getYTDExtremes(h, l, e.time.useUTC), n = m = q.min, q = q.max;
                        else { this.deferredYTDClick = b; return }
                    else "all" === k && f && (e.navigator && e.navigator.baseSeries[0] && (e.navigator.baseSeries[0].xAxis.options.range = void 0), n = l, q = h);
                    c(n) && (n += p._offsetMin);
                    c(q) && (q += p._offsetMax);
                    this.dropdown && (this.dropdown.selectedIndex = b + 1);
                    if (f) f.setExtremes(n, q, z(d, !0), void 0, { trigger: "rangeSelectorButton", rangeSelectorButton: p });
                    else {
                        var t = F(e.options.xAxis)[0];
                        var r =
                            t.range;
                        t.range = A;
                        var w = t.min;
                        t.min = m;
                        g(e, "load", function() {
                            t.range = r;
                            t.min = w
                        })
                    }
                    u(this, "afterBtnClick")
                }
            };
            f.prototype.setSelected = function(a) { this.selected = this.options.selected = a };
            f.prototype.init = function(a) {
                var b = this,
                    d = a.options.rangeSelector,
                    c = d.buttons || b.defaultButtons.slice(),
                    e = d.selected,
                    p = function() {
                        var a = b.minInput,
                            d = b.maxInput;
                        a && a.blur && u(a, "blur");
                        d && d.blur && u(d, "blur")
                    };
                b.chart = a;
                b.options = d;
                b.buttons = [];
                b.buttonOptions = c;
                this.eventsToUnbind = [];
                this.eventsToUnbind.push(g(a.container,
                    "mousedown", p));
                this.eventsToUnbind.push(g(a, "resize", p));
                c.forEach(b.computeButtonRange);
                "undefined" !== typeof e && c[e] && this.clickButton(e, !1);
                this.eventsToUnbind.push(g(a, "load", function() { a.xAxis && a.xAxis[0] && g(a.xAxis[0], "setExtremes", function(d) { this.max - this.min !== a.fixedRange && "rangeSelectorButton" !== d.trigger && "updatedData" !== d.trigger && b.forcedDataGrouping && !b.frozenStates && this.setDataGrouping(!1, !1) }) }))
            };
            f.prototype.updateButtonStates = function() {
                var a = this,
                    b = this.chart,
                    d = this.dropdown,
                    c = b.xAxis[0],
                    e = Math.round(c.max - c.min),
                    f = !c.hasVisibleSeries,
                    g = b.scroller && b.scroller.getUnionExtremes() || c,
                    l = g.dataMin,
                    h = g.dataMax;
                b = a.getYTDExtremes(h, l, b.time.useUTC);
                var q = b.min,
                    k = b.max,
                    u = a.selected,
                    z = v(u),
                    m = a.options.allButtonsEnabled,
                    n = a.buttons;
                a.buttonOptions.forEach(function(b, p) {
                    var g = b._range,
                        A = b.type,
                        I = b.count || 1,
                        M = n[p],
                        J = 0,
                        N = b._offsetMax - b._offsetMin;
                    b = p === u;
                    var v = g > h - l,
                        y = g < c.minRange,
                        t = !1,
                        r = !1;
                    g = g === e;
                    ("month" === A || "year" === A) && e + 36E5 >= 864E5 * { month: 28, year: 365 }[A] * I - N && e - 36E5 <= 864E5 * { month: 31, year: 366 }[A] * I + N ? g = !0 : "ytd" === A ? (g = k - q + N === e, t = !b) : "all" === A && (g = c.max - c.min >= h - l, r = !b && z && g);
                    A = !m && (v || y || r || f);
                    I = b && g || g && !z && !t || b && a.frozenStates;
                    A ? J = 3 : I && (z = !0, J = 2);
                    M.state !== J && (M.setState(J), d && (d.options[p + 1].disabled = A, 2 === J && (d.selectedIndex = p + 1)), 0 === J && u === p && a.setSelected())
                })
            };
            f.prototype.computeButtonRange = function(a) {
                var b = a.type,
                    d = a.count || 1,
                    c = { millisecond: 1, second: 1E3, minute: 6E4, hour: 36E5, day: 864E5, week: 6048E5 };
                if (c[b]) a._range = c[b] * d;
                else if ("month" === b || "year" === b) a._range =
                    864E5 * { month: 30, year: 365 }[b] * d;
                a._offsetMin = z(a.offsetMin, 0);
                a._offsetMax = z(a.offsetMax, 0);
                a._range += a._offsetMax - a._offsetMin
            };
            f.prototype.getInputValue = function(a) {
                a = "min" === a ? this.minInput : this.maxInput;
                var b = this.chart.options.rangeSelector,
                    d = this.chart.time;
                return a ? ("text" === a.type && b.inputDateParser || this.defaultInputDateParser)(a.value, d.useUTC, d) : 0
            };
            f.prototype.setInputValue = function(a, b) {
                var d = this.options,
                    e = this.chart.time,
                    p = "min" === a ? this.minInput : this.maxInput;
                a = "min" === a ? this.minDateBox :
                    this.maxDateBox;
                if (p) {
                    var f = p.getAttribute("data-hc-time");
                    f = c(f) ? Number(f) : void 0;
                    c(b) && (c(f) && p.setAttribute("data-hc-time-previous", f), p.setAttribute("data-hc-time", b), f = b);
                    p.value = e.dateFormat(this.inputTypeFormats[p.type] || d.inputEditDateFormat, f);
                    a && a.attr({ text: e.dateFormat(d.inputDateFormat, f) })
                }
            };
            f.prototype.setInputExtremes = function(a, b, d) {
                if (a = "min" === a ? this.minInput : this.maxInput) {
                    var c = this.inputTypeFormats[a.type],
                        e = this.chart.time;
                    c && (b = e.dateFormat(c, b), a.min !== b && (a.min = b), d = e.dateFormat(c,
                        d), a.max !== d && (a.max = d))
                }
            };
            f.prototype.showInput = function(a) {
                var b = "min" === a ? this.minDateBox : this.maxDateBox;
                if ((a = "min" === a ? this.minInput : this.maxInput) && b && this.inputGroup) {
                    var d = "text" === a.type,
                        c = this.inputGroup,
                        e = c.translateX;
                    c = c.translateY;
                    var f = this.options.inputBoxWidth;
                    y(a, { width: d ? b.width + (f ? -2 : 20) + "px" : "auto", height: d ? b.height - 2 + "px" : "auto", border: "2px solid silver" });
                    d && f ? y(a, { left: e + b.x + "px", top: c + "px" }) : y(a, {
                        left: Math.min(Math.round(b.x + e - (a.offsetWidth - b.width) / 2), this.chart.chartWidth -
                            a.offsetWidth) + "px",
                        top: c - (a.offsetHeight - b.height) / 2 + "px"
                    })
                }
            };
            f.prototype.hideInput = function(a) {
                (a = "min" === a ? this.minInput : this.maxInput) && y(a, { top: "-9999em", border: 0, width: "1px", height: "1px" })
            };
            f.prototype.defaultInputDateParser = function(a, b, d) {
                var c = a.split("/").join("-").split(" ").join("T"); - 1 === c.indexOf("T") && (c += "T00:00");
                if (b) c += "Z";
                else {
                    var e;
                    if (e = t.isSafari) e = c, e = !(6 < e.length && (e.lastIndexOf("-") === e.length - 6 || e.lastIndexOf("+") === e.length - 6));
                    e && (e = (new Date(c)).getTimezoneOffset() / 60,
                        c += 0 >= e ? "+" + G(-e) + ":00" : "-" + G(e) + ":00")
                }
                c = Date.parse(c);
                v(c) || (a = a.split("-"), c = Date.UTC(D(a[0]), D(a[1]) - 1, D(a[2])));
                d && b && v(c) && (c += d.getTimezoneOffset(c));
                return c
            };
            f.prototype.drawInput = function(a) {
                function d() {
                    var b = p.getInputValue(a),
                        d = c.xAxis[0],
                        e = c.scroller && c.scroller.xAxis ? c.scroller.xAxis : d,
                        f = e.dataMin;
                    e = e.dataMax;
                    var g = p.maxInput,
                        l = p.minInput;
                    b !== Number(m.getAttribute("data-hc-time-previous")) && v(b) && (m.setAttribute("data-hc-time-previous", b), u && g && v(f) ? b > Number(g.getAttribute("data-hc-time")) ?
                        b = void 0 : b < f && (b = f) : l && v(e) && (b < Number(l.getAttribute("data-hc-time")) ? b = void 0 : b > e && (b = e)), "undefined" !== typeof b && d.setExtremes(u ? b : d.min, u ? d.max : b, void 0, void 0, { trigger: "rangeSelectorInput" }))
                }
                var c = this.chart,
                    e = this.div,
                    f = this.inputGroup,
                    p = this,
                    g = c.renderer.style || {},
                    l = c.renderer,
                    h = c.options.rangeSelector,
                    u = "min" === a,
                    z = n.lang[u ? "rangeSelectorFrom" : "rangeSelectorTo"] || "";
                z = l.label(z, 0).addClass("highcharts-range-label").attr({ padding: z ? 2 : 0, height: z ? h.inputBoxHeight : 0 }).add(f);
                l = l.label("", 0).addClass("highcharts-range-input").attr({
                    padding: 2,
                    width: h.inputBoxWidth,
                    height: h.inputBoxHeight,
                    "text-align": "center"
                }).on("click", function() {
                    p.showInput(a);
                    p[a + "Input"].focus()
                });
                c.styledMode || l.attr({ stroke: h.inputBoxBorderColor, "stroke-width": 1 });
                l.add(f);
                var m = q("input", { name: a, className: "highcharts-range-selector" }, void 0, e);
                m.setAttribute("type", k(h.inputDateFormat || "%b %e, %Y"));
                c.styledMode || (z.css(x(g, h.labelStyle)), l.css(x({ color: "#333333" }, g, h.inputStyle)), y(m, b({
                    position: "absolute",
                    border: 0,
                    boxShadow: "0 0 15px rgba(0,0,0,0.3)",
                    width: "1px",
                    height: "1px",
                    padding: 0,
                    textAlign: "center",
                    fontSize: g.fontSize,
                    fontFamily: g.fontFamily,
                    top: "-9999em"
                }, h.inputStyle)));
                m.onfocus = function() { p.showInput(a) };
                m.onblur = function() {
                    m === t.doc.activeElement && d();
                    p.hideInput(a);
                    p.setInputValue(a);
                    m.blur()
                };
                var r = !1;
                m.onchange = function() { r || (d(), p.hideInput(a), m.blur()) };
                m.onkeypress = function(a) { 13 === a.keyCode && d() };
                m.onkeydown = function(a) {
                    r = !0;
                    38 !== a.keyCode && 40 !== a.keyCode || d()
                };
                m.onkeyup = function() { r = !1 };
                return { dateBox: l, input: m, label: z }
            };
            f.prototype.getPosition =
                function() {
                    var a = this.chart,
                        b = a.options.rangeSelector;
                    a = "top" === b.verticalAlign ? a.plotTop - a.axisOffset[0] : 0;
                    return { buttonTop: a + b.buttonPosition.y, inputTop: a + b.inputPosition.y - 10 }
                };
            f.prototype.getYTDExtremes = function(a, b, d) {
                var c = this.chart.time,
                    e = new c.Date(a),
                    f = c.get("FullYear", e);
                d = d ? c.Date.UTC(f, 0, 1) : +new c.Date(f, 0, 1);
                b = Math.max(b, d);
                e = e.getTime();
                return { max: Math.min(a || e, e), min: b }
            };
            f.prototype.render = function(a, b) {
                var d = this.chart,
                    e = d.renderer,
                    f = d.container,
                    p = d.options,
                    g = p.rangeSelector,
                    l = z(p.chart.style &&
                        p.chart.style.zIndex, 0) + 1;
                p = g.inputEnabled;
                if (!1 !== g.enabled) {
                    this.rendered || (this.group = e.g("range-selector-group").attr({ zIndex: 7 }).add(), this.div = q("div", void 0, { position: "relative", height: 0, zIndex: l }), this.buttonOptions.length && this.renderButtons(), f.parentNode && f.parentNode.insertBefore(this.div, f), p && (this.inputGroup = e.g("input-group").add(this.group), e = this.drawInput("min"), this.minDateBox = e.dateBox, this.minLabel = e.label, this.minInput = e.input, e = this.drawInput("max"), this.maxDateBox = e.dateBox,
                        this.maxLabel = e.label, this.maxInput = e.input));
                    if (p && (this.setInputValue("min", a), this.setInputValue("max", b), a = d.scroller && d.scroller.getUnionExtremes() || d.xAxis[0] || {}, c(a.dataMin) && c(a.dataMax) && (d = d.xAxis[0].minRange || 0, this.setInputExtremes("min", a.dataMin, Math.min(a.dataMax, this.getInputValue("max")) - d), this.setInputExtremes("max", Math.max(a.dataMin, this.getInputValue("min")) + d, a.dataMax)), this.inputGroup)) {
                        var h = 0;
                        [this.minLabel, this.minDateBox, this.maxLabel, this.maxDateBox].forEach(function(a) {
                            if (a) {
                                var b =
                                    a.getBBox().width;
                                b && (a.attr({ x: h }), h += b + g.inputSpacing)
                            }
                        })
                    }
                    this.alignElements();
                    this.rendered = !0
                }
            };
            f.prototype.renderButtons = function() {
                var a = this,
                    b = this.buttons,
                    d = this.options,
                    c = n.lang,
                    e = this.chart.renderer,
                    f = x(d.buttonTheme),
                    l = f && f.states,
                    h = f.width || 28;
                delete f.width;
                delete f.states;
                this.buttonGroup = e.g("range-selector-buttons").add(this.group);
                var k = this.dropdown = q("select", void 0, { position: "absolute", width: "1px", height: "1px", padding: 0, border: 0, top: "-9999em", cursor: "pointer", opacity: .0001 }, this.div);
                g(k, "touchstart", function() { k.style.fontSize = "16px" });
                [
                    [t.isMS ? "mouseover" : "mouseenter"],
                    [t.isMS ? "mouseout" : "mouseleave"],
                    ["change", "click"]
                ].forEach(function(d) {
                    var c = d[0],
                        e = d[1];
                    g(k, c, function() {
                        var d = b[a.currentButtonIndex()];
                        d && u(d.element, e || c)
                    })
                });
                this.zoomText = e.label(c && c.rangeSelectorZoom || "", 0).attr({ padding: d.buttonTheme.padding, height: d.buttonTheme.height, paddingLeft: 0, paddingRight: 0 }).add(this.buttonGroup);
                this.chart.styledMode || (this.zoomText.css(d.labelStyle), f["stroke-width"] = z(f["stroke-width"],
                    0));
                q("option", { textContent: this.zoomText.textStr, disabled: !0 }, void 0, k);
                this.buttonOptions.forEach(function(d, c) {
                    q("option", { textContent: d.title || d.text }, void 0, k);
                    b[c] = e.button(d.text, 0, 0, function(b) {
                        var e = d.events && d.events.click,
                            f;
                        e && (f = e.call(d, b));
                        !1 !== f && a.clickButton(c);
                        a.isActive = !0
                    }, f, l && l.hover, l && l.select, l && l.disabled).attr({ "text-align": "center", width: h }).add(a.buttonGroup);
                    d.title && b[c].attr("title", d.title)
                })
            };
            f.prototype.alignElements = function() {
                var a = this,
                    b = this.buttonGroup,
                    d = this.buttons,
                    c = this.chart,
                    e = this.group,
                    f = this.inputGroup,
                    g = this.options,
                    l = this.zoomText,
                    h = c.options,
                    q = h.exporting && !1 !== h.exporting.enabled && h.navigation && h.navigation.buttonOptions;
                h = g.buttonPosition;
                var k = g.inputPosition,
                    m = g.verticalAlign,
                    u = function(b, d) { return q && a.titleCollision(c) && "top" === m && "right" === d.align && d.y - b.getBBox().height - 12 < (q.y || 0) + (q.height || 0) + c.spacing[0] ? -40 : 0 },
                    v = c.plotLeft;
                if (e && h && k) {
                    var n = h.x - c.spacing[3];
                    if (b) {
                        this.positionButtons();
                        if (!this.initialButtonGroupWidth) {
                            var y = 0;
                            l && (y += l.getBBox().width +
                                5);
                            d.forEach(function(a, b) {
                                y += a.width;
                                b !== d.length - 1 && (y += g.buttonSpacing)
                            });
                            this.initialButtonGroupWidth = y
                        }
                        v -= c.spacing[3];
                        this.updateButtonStates();
                        l = u(b, h);
                        this.alignButtonGroup(l);
                        e.placed = b.placed = c.hasLoaded
                    }
                    b = 0;
                    f && (b = u(f, k), "left" === k.align ? n = v : "right" === k.align && (n = -Math.max(c.axisOffset[1], -b)), f.align({ y: k.y, width: f.getBBox().width, align: k.align, x: k.x + n - 2 }, !0, c.spacingBox), f.placed = c.hasLoaded);
                    this.handleCollision(b);
                    e.align({ verticalAlign: m }, !0, c.spacingBox);
                    f = e.alignAttr.translateY;
                    b =
                        e.getBBox().height + 20;
                    u = 0;
                    "bottom" === m && (u = (u = c.legend && c.legend.options) && "bottom" === u.verticalAlign && u.enabled && !u.floating ? c.legend.legendHeight + z(u.margin, 10) : 0, b = b + u - 20, u = f - b - (g.floating ? 0 : g.y) - (c.titleOffset ? c.titleOffset[2] : 0) - 10);
                    if ("top" === m) g.floating && (u = 0), c.titleOffset && c.titleOffset[0] && (u = c.titleOffset[0]), u += c.margin[0] - c.spacing[0] || 0;
                    else if ("middle" === m)
                        if (k.y === h.y) u = f;
                        else if (k.y || h.y) u = 0 > k.y || 0 > h.y ? u - Math.min(k.y, h.y) : f - b;
                    e.translate(g.x, g.y + Math.floor(u));
                    h = this.minInput;
                    k =
                        this.maxInput;
                    f = this.dropdown;
                    g.inputEnabled && h && k && (h.style.marginTop = e.translateY + "px", k.style.marginTop = e.translateY + "px");
                    f && (f.style.marginTop = e.translateY + "px")
                }
            };
            f.prototype.alignButtonGroup = function(a, b) {
                var d = this.chart,
                    c = this.buttonGroup,
                    e = this.options.buttonPosition,
                    f = d.plotLeft - d.spacing[3],
                    g = e.x - d.spacing[3];
                "right" === e.align ? g += a - f : "center" === e.align && (g -= f / 2);
                c && c.align({ y: e.y, width: z(b, this.initialButtonGroupWidth), align: e.align, x: g }, !0, d.spacingBox)
            };
            f.prototype.positionButtons = function() {
                var a =
                    this.buttons,
                    b = this.chart,
                    d = this.options,
                    c = this.zoomText,
                    e = b.hasLoaded ? "animate" : "attr",
                    f = d.buttonPosition,
                    g = b.plotLeft,
                    l = g;
                c && "hidden" !== c.visibility && (c[e]({ x: z(g + f.x, g) }), l += f.x + c.getBBox().width + 5);
                this.buttonOptions.forEach(function(b, c) {
                    if ("hidden" !== a[c].visibility) a[c][e]({ x: l }), l += a[c].width + d.buttonSpacing;
                    else a[c][e]({ x: g })
                })
            };
            f.prototype.handleCollision = function(a) {
                var b = this,
                    d = this.chart,
                    c = this.buttonGroup,
                    e = this.inputGroup,
                    f = this.options,
                    g = f.buttonPosition,
                    p = f.dropdown,
                    l = f.inputPosition;
                f = function() {
                    var a = 0;
                    b.buttons.forEach(function(b) {
                        b = b.getBBox();
                        b.width > a && (a = b.width)
                    });
                    return a
                };
                var h = function(b) {
                        if (e && c) {
                            var d = e.alignAttr.translateX + e.alignOptions.x - a + e.getBBox().x + 2,
                                f = e.alignOptions.width,
                                p = c.alignAttr.translateX + c.getBBox().x;
                            return p + b > d && d + f > p && g.y < l.y + e.getBBox().height
                        }
                        return !1
                    },
                    k = function() { e && c && e.attr({ translateX: e.alignAttr.translateX + (d.axisOffset[1] >= -a ? 0 : -a), translateY: e.alignAttr.translateY + c.getBBox().height + 10 }) };
                if (c) {
                    if ("always" === p) {
                        this.collapseButtons(a);
                        h(f()) && k();
                        return
                    }
                    "never" === p && this.expandButtons()
                }
                e && c ? l.align === g.align || h(this.initialButtonGroupWidth + 20) ? "responsive" === p ? (this.collapseButtons(a), h(f()) && k()) : k() : "responsive" === p && this.expandButtons() : c && "responsive" === p && (this.initialButtonGroupWidth > d.plotWidth ? this.collapseButtons(a) : this.expandButtons())
            };
            f.prototype.collapseButtons = function(a) {
                var b = this.buttons,
                    d = this.buttonOptions,
                    c = this.chart,
                    e = this.dropdown,
                    f = this.options,
                    g = this.zoomText,
                    p = c.userOptions.rangeSelector && c.userOptions.rangeSelector.buttonTheme || {},
                    l = function(a) { return { text: a ? a + " \u25be" : "\u25be", width: "auto", paddingLeft: z(f.buttonTheme.paddingLeft, p.padding, 8), paddingRight: z(f.buttonTheme.paddingRight, p.padding, 8) } };
                g && g.hide();
                var h = !1;
                d.forEach(function(a, d) {
                    d = b[d];
                    2 !== d.state ? d.hide() : (d.show(), d.attr(l(a.text)), h = !0)
                });
                h || (e && (e.selectedIndex = 0), b[0].show(), b[0].attr(l(this.zoomText && this.zoomText.textStr)));
                d = f.buttonPosition.align;
                this.positionButtons();
                "right" !== d && "center" !== d || this.alignButtonGroup(a, b[this.currentButtonIndex()].getBBox().width);
                this.showDropdown()
            };
            f.prototype.expandButtons = function() {
                var a = this.buttons,
                    b = this.buttonOptions,
                    d = this.options,
                    c = this.zoomText;
                this.hideDropdown();
                c && c.show();
                b.forEach(function(b, c) {
                    c = a[c];
                    c.show();
                    c.attr({ text: b.text, width: d.buttonTheme.width || 28, paddingLeft: z(d.buttonTheme.paddingLeft, "unset"), paddingRight: z(d.buttonTheme.paddingRight, "unset") });
                    2 > c.state && c.setState(0)
                });
                this.positionButtons()
            };
            f.prototype.currentButtonIndex = function() {
                var a = this.dropdown;
                return a && 0 < a.selectedIndex ? a.selectedIndex -
                    1 : 0
            };
            f.prototype.showDropdown = function() {
                var a = this.buttonGroup,
                    b = this.buttons,
                    d = this.chart,
                    c = this.dropdown;
                if (a && c) {
                    var e = a.translateX;
                    a = a.translateY;
                    b = b[this.currentButtonIndex()].getBBox();
                    y(c, { left: d.plotLeft + e + "px", top: a + .5 + "px", width: b.width + "px", height: b.height + "px" });
                    this.hasVisibleDropdown = !0
                }
            };
            f.prototype.hideDropdown = function() {
                var a = this.dropdown;
                a && (y(a, { top: "-9999em", width: "1px", height: "1px" }), this.hasVisibleDropdown = !1)
            };
            f.prototype.getHeight = function() {
                var a = this.options,
                    b = this.group,
                    d = a.y,
                    c = a.buttonPosition.y,
                    e = a.inputPosition.y;
                if (a.height) return a.height;
                this.alignElements();
                a = b ? b.getBBox(!0).height + 13 + d : 0;
                b = Math.min(e, c);
                if (0 > e && 0 > c || 0 < e && 0 < c) a += Math.abs(b);
                return a
            };
            f.prototype.titleCollision = function(a) { return !(a.options.title.text || a.options.subtitle.text) };
            f.prototype.update = function(a) {
                var b = this.chart;
                x(!0, b.options.rangeSelector, a);
                this.destroy();
                this.init(b);
                this.render()
            };
            f.prototype.destroy = function() {
                var a = this,
                    b = a.minInput,
                    c = a.maxInput;
                a.eventsToUnbind && (a.eventsToUnbind.forEach(function(a) { return a() }),
                    a.eventsToUnbind = void 0);
                e(a.buttons);
                b && (b.onfocus = b.onblur = b.onchange = null);
                c && (c.onfocus = c.onblur = c.onchange = null);
                E(a, function(b, c) {
                    b && "chart" !== c && (b instanceof m ? b.destroy() : b instanceof window.HTMLElement && d(b));
                    b !== f.prototype[c] && (a[c] = null)
                }, this)
            };
            return f
        }();
        C.prototype.defaultButtons = [{ type: "month", count: 1, text: "1m", title: "View 1 month" }, { type: "month", count: 3, text: "3m", title: "View 3 months" }, { type: "month", count: 6, text: "6m", title: "View 6 months" }, { type: "ytd", text: "YTD", title: "View year to date" },
            { type: "year", count: 1, text: "1y", title: "View 1 year" }, { type: "all", text: "All", title: "View all" }
        ];
        C.prototype.inputTypeFormats = { "datetime-local": "%Y-%m-%dT%H:%M:%S", date: "%Y-%m-%d", time: "%H:%M:%S" };
        a.prototype.minFromRange = function() {
            var a = this.range,
                b = a.type,
                d = this.max,
                c = this.chart.time,
                e = function(a, d) {
                    var e = "year" === b ? "FullYear" : "Month",
                        f = new c.Date(a),
                        g = c.get(e, f);
                    c.set(e, f, g + d);
                    g === c.get(e, f) && c.set("Date", f, 0);
                    return f.getTime() - a
                };
            if (v(a)) { var f = d - a; var g = a } else f = d + e(d, -a.count), this.chart && (this.chart.fixedRange =
                d - f);
            var h = z(this.dataMin, Number.MIN_VALUE);
            v(f) || (f = h);
            f <= h && (f = h, "undefined" === typeof g && (g = e(f, a.count)), this.newMax = Math.min(f + g, this.dataMax));
            v(d) || (f = void 0);
            return f
        };
        if (!t.RangeSelector) {
            var H = [],
                L = function(a) {
                    function b() { c && (d = a.xAxis[0].getExtremes(), e = a.legend, h = c && c.options.verticalAlign, v(d.min) && c.render(d.min, d.max), e.display && "top" === h && h === e.options.verticalAlign && (l = x(a.spacingBox), l.y = "vertical" === e.options.layout ? a.plotTop : l.y + c.getHeight(), e.group.placed = !1, e.align(l))) }
                    var d,
                        c = a.rangeSelector,
                        e, l, h;
                    c && (f(H, function(b) { return b[0] === a }) || H.push([a, [g(a.xAxis[0], "afterSetExtremes", function(a) { c && c.render(a.min, a.max) }), g(a, "redraw", b)]]), b())
                };
            g(h, "afterGetContainer", function() { this.options.rangeSelector && this.options.rangeSelector.enabled && (this.rangeSelector = new C(this)) });
            g(h, "beforeRender", function() {
                var a = this.axes,
                    b = this.rangeSelector;
                b && (v(b.deferredYTDClick) && (b.clickButton(b.deferredYTDClick), delete b.deferredYTDClick), a.forEach(function(a) {
                        a.updateNames();
                        a.setScale()
                    }),
                    this.getAxisMargins(), b.render(), a = b.options.verticalAlign, b.options.floating || ("bottom" === a ? this.extraBottomMargin = !0 : "middle" !== a && (this.extraTopMargin = !0)))
            });
            g(h, "update", function(a) {
                var b = a.options.rangeSelector;
                a = this.rangeSelector;
                var d = this.extraBottomMargin,
                    e = this.extraTopMargin;
                b && b.enabled && !c(a) && this.options.rangeSelector && (this.options.rangeSelector.enabled = !0, this.rangeSelector = a = new C(this));
                this.extraTopMargin = this.extraBottomMargin = !1;
                a && (L(this), b = b && b.verticalAlign || a.options &&
                    a.options.verticalAlign, a.options.floating || ("bottom" === b ? this.extraBottomMargin = !0 : "middle" !== b && (this.extraTopMargin = !0)), this.extraBottomMargin !== d || this.extraTopMargin !== e) && (this.isDirtyBox = !0)
            });
            g(h, "render", function() {
                var a = this.rangeSelector;
                a && !a.options.floating && (a.render(), a = a.options.verticalAlign, "bottom" === a ? this.extraBottomMargin = !0 : "middle" !== a && (this.extraTopMargin = !0))
            });
            g(h, "getMargins", function() {
                var a = this.rangeSelector;
                a && (a = a.getHeight(), this.extraTopMargin && (this.plotTop +=
                    a), this.extraBottomMargin && (this.marginBottom += a))
            });
            h.prototype.callbacks.push(L);
            g(h, "destroy", function() {
                for (var a = 0; a < H.length; a++) {
                    var b = H[a];
                    if (b[0] === this) {
                        b[1].forEach(function(a) { return a() });
                        H.splice(a, 1);
                        break
                    }
                }
            });
            t.RangeSelector = C
        }
        return C
    });
    x(a, "Accessibility/Components/RangeSelectorComponent.js", [a["Extensions/RangeSelector.js"], a["Accessibility/AccessibilityComponent.js"], a["Accessibility/Utils/ChartUtilities.js"], a["Accessibility/Utils/Announcer.js"], a["Accessibility/KeyboardNavigationHandler.js"],
        a["Core/Utilities.js"]
    ], function(a, h, t, r, m, w) {
        var k = this && this.__extends || function() {
                var a = function(c, d) {
                    a = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(a, d) { a.__proto__ = d } || function(a, d) { for (var b in d) d.hasOwnProperty(b) && (a[b] = d[b]) };
                    return a(c, d)
                };
                return function(c, d) {
                    function b() { this.constructor = c }
                    a(c, d);
                    c.prototype = null === d ? Object.create(d) : (b.prototype = d.prototype, new b)
                }
            }(),
            n = t.unhideChartElementFromAT,
            g = t.getAxisRangeDescription,
            q = w.addEvent,
            y = w.attr;
        h = function(a) {
            function c() {
                var d =
                    null !== a && a.apply(this, arguments) || this;
                d.announcer = void 0;
                return d
            }
            k(c, a);
            c.prototype.init = function() { this.announcer = new r(this.chart, "polite") };
            c.prototype.onChartUpdate = function() {
                var a = this.chart,
                    b = this,
                    c = a.rangeSelector;
                c && (this.updateSelectorVisibility(), this.setDropdownAttrs(), c.buttons && c.buttons.length && c.buttons.forEach(function(a) { b.setRangeButtonAttrs(a) }), c.maxInput && c.minInput && ["minInput", "maxInput"].forEach(function(d, e) {
                    if (d = c[d]) n(a, d), b.setRangeInputAttrs(d, "accessibility.rangeSelector." +
                        (e ? "max" : "min") + "InputLabel")
                }))
            };
            c.prototype.updateSelectorVisibility = function() {
                var a = this.chart,
                    b = a.rangeSelector,
                    c = b && b.dropdown,
                    e = b && b.buttons || [];
                b && b.hasVisibleDropdown && c ? (n(a, c), e.forEach(function(a) { return a.element.setAttribute("aria-hidden", !0) })) : (c && c.setAttribute("aria-hidden", !0), e.forEach(function(b) { return n(a, b.element) }))
            };
            c.prototype.setDropdownAttrs = function() {
                var a = this.chart,
                    b = a.rangeSelector && a.rangeSelector.dropdown;
                b && (a = a.langFormat("accessibility.rangeSelector.dropdownLabel", { rangeTitle: a.options.lang.rangeSelectorZoom }), b.setAttribute("aria-label", a), b.setAttribute("tabindex", -1))
            };
            c.prototype.setRangeButtonAttrs = function(a) { y(a.element, { tabindex: -1, role: "button" }) };
            c.prototype.setRangeInputAttrs = function(a, b) {
                var c = this.chart;
                y(a, { tabindex: -1, "aria-label": c.langFormat(b, { chart: c }) })
            };
            c.prototype.onButtonNavKbdArrowKey = function(a, b) {
                var c = a.response,
                    d = this.keyCodes,
                    e = this.chart,
                    g = e.options.accessibility.keyboardNavigation.wrapAround;
                b = b === d.left || b === d.up ? -1 : 1;
                return e.highlightRangeSelectorButton(e.highlightedRangeSelectorItemIx +
                    b) ? c.success : g ? (a.init(b), c.success) : c[0 < b ? "next" : "prev"]
            };
            c.prototype.onButtonNavKbdClick = function(a) {
                a = a.response;
                var b = this.chart;
                3 !== b.oldRangeSelectorItemState && this.fakeClickEvent(b.rangeSelector.buttons[b.highlightedRangeSelectorItemIx].element);
                return a.success
            };
            c.prototype.onAfterBtnClick = function() {
                var a = this.chart,
                    b = g(a.xAxis[0]);
                (a = a.langFormat("accessibility.rangeSelector.clickButtonAnnouncement", { chart: a, axisRangeDescription: b })) && this.announcer.announce(a)
            };
            c.prototype.onInputKbdMove =
                function(a) {
                    var b = this.chart,
                        c = b.rangeSelector,
                        d = b.highlightedInputRangeIx = (b.highlightedInputRangeIx || 0) + a;
                    1 < d || 0 > d ? b.accessibility && (b.accessibility.keyboardNavigation.tabindexContainer.focus(), b.accessibility.keyboardNavigation[0 > a ? "prev" : "next"]()) : c && (a = c[d ? "maxDateBox" : "minDateBox"], c = c[d ? "maxInput" : "minInput"], a && c && b.setFocusToElement(a, c))
                };
            c.prototype.onInputNavInit = function(a) {
                var b = this,
                    c = this,
                    d = this.chart,
                    e = 0 < a ? 0 : 1,
                    g = d.rangeSelector,
                    h = g && g[e ? "maxDateBox" : "minDateBox"];
                a = g && g.minInput;
                g = g && g.maxInput;
                d.highlightedInputRangeIx = e;
                if (h && a && g) {
                    d.setFocusToElement(h, e ? g : a);
                    this.removeInputKeydownHandler && this.removeInputKeydownHandler();
                    d = function(a) {
                        (a.which || a.keyCode) === b.keyCodes.tab && (a.preventDefault(), a.stopPropagation(), c.onInputKbdMove(a.shiftKey ? -1 : 1))
                    };
                    var k = q(a, "keydown", d),
                        m = q(g, "keydown", d);
                    this.removeInputKeydownHandler = function() {
                        k();
                        m()
                    }
                }
            };
            c.prototype.onInputNavTerminate = function() {
                var a = this.chart.rangeSelector || {};
                a.maxInput && a.hideInput("max");
                a.minInput && a.hideInput("min");
                this.removeInputKeydownHandler && (this.removeInputKeydownHandler(), delete this.removeInputKeydownHandler)
            };
            c.prototype.initDropdownNav = function() {
                var a = this,
                    b = this.chart,
                    c = b.rangeSelector,
                    e = c && c.dropdown;
                c && e && (b.setFocusToElement(c.buttonGroup, e), this.removeDropdownKeydownHandler && this.removeDropdownKeydownHandler(), this.removeDropdownKeydownHandler = q(e, "keydown", function(c) {
                    var d = b.accessibility;
                    (c.which || c.keyCode) === a.keyCodes.tab && (c.preventDefault(), c.stopPropagation(), d && (d.keyboardNavigation.tabindexContainer.focus(),
                        d.keyboardNavigation[c.shiftKey ? "prev" : "next"]()))
                }))
            };
            c.prototype.getRangeSelectorButtonNavigation = function() {
                var a = this.chart,
                    b = this.keyCodes,
                    c = this;
                return new m(a, {
                    keyCodeMap: [
                        [
                            [b.left, b.right, b.up, b.down],
                            function(a) { return c.onButtonNavKbdArrowKey(this, a) }
                        ],
                        [
                            [b.enter, b.space],
                            function() { return c.onButtonNavKbdClick(this) }
                        ]
                    ],
                    validate: function() { return !!(a.rangeSelector && a.rangeSelector.buttons && a.rangeSelector.buttons.length) },
                    init: function(b) {
                        var d = a.rangeSelector;
                        d && d.hasVisibleDropdown ? c.initDropdownNav() :
                            d && (d = d.buttons.length - 1, a.highlightRangeSelectorButton(0 < b ? 0 : d))
                    },
                    terminate: function() { c.removeDropdownKeydownHandler && (c.removeDropdownKeydownHandler(), delete c.removeDropdownKeydownHandler) }
                })
            };
            c.prototype.getRangeSelectorInputNavigation = function() {
                var a = this.chart,
                    b = this;
                return new m(a, {
                    keyCodeMap: [],
                    validate: function() {
                        return !!(a.rangeSelector && a.rangeSelector.inputGroup && "hidden" !== a.rangeSelector.inputGroup.element.style.visibility && !1 !== a.options.rangeSelector.inputEnabled && a.rangeSelector.minInput &&
                            a.rangeSelector.maxInput)
                    },
                    init: function(a) { b.onInputNavInit(a) },
                    terminate: function() { b.onInputNavTerminate() }
                })
            };
            c.prototype.getKeyboardNavigation = function() { return [this.getRangeSelectorButtonNavigation(), this.getRangeSelectorInputNavigation()] };
            c.prototype.destroy = function() {
                this.removeDropdownKeydownHandler && this.removeDropdownKeydownHandler();
                this.removeInputKeydownHandler && this.removeInputKeydownHandler();
                this.announcer && this.announcer.destroy()
            };
            return c
        }(h);
        (function(c) {
            function e(a) {
                var b =
                    this.rangeSelector && this.rangeSelector.buttons || [],
                    c = this.highlightedRangeSelectorItemIx,
                    d = this.rangeSelector && this.rangeSelector.selected;
                "undefined" !== typeof c && b[c] && c !== d && b[c].setState(this.oldRangeSelectorItemState || 0);
                this.highlightedRangeSelectorItemIx = a;
                return b[a] ? (this.setFocusToElement(b[a].box, b[a].element), a !== d && (this.oldRangeSelectorItemState = b[a].state, b[a].setState(1)), !0) : !1
            }

            function d() { var a = this.chart.accessibility; if (a && a.components.rangeSelector) return a.components.rangeSelector.onAfterBtnClick() }
            var b = [];
            c.compose = function(c, g) {-1 === b.indexOf(c) && (b.push(c), c.prototype.highlightRangeSelectorButton = e); - 1 === b.indexOf(g) && (b.push(g), q(a, "afterBtnClick", d)) }
        })(h || (h = {}));
        return h
    });
    x(a, "Accessibility/Components/SeriesComponent/ForcedMarkers.js", [a["Core/Utilities.js"]], function(a) {
        var h = a.addEvent,
            k = a.merge,
            r;
        (function(a) {
            function m(a) { k(!0, a, { marker: { enabled: !0, states: { normal: { opacity: 0 } } } }) }

            function r(a) { return a.marker.states && a.marker.states.normal && a.marker.states.normal.opacity }

            function n() {
                if (this.chart.styledMode) {
                    if (this.markerGroup) this.markerGroup[this.a11yMarkersForced ?
                        "addClass" : "removeClass"]("highcharts-a11y-markers-hidden");
                    this._hasPointMarkers && this.points && this.points.length && this.points.forEach(function(a) { a.graphic && (a.graphic[a.hasForcedA11yMarker ? "addClass" : "removeClass"]("highcharts-a11y-marker-hidden"), a.graphic[!1 === a.hasForcedA11yMarker ? "addClass" : "removeClass"]("highcharts-a11y-marker-visible")) })
                }
            }

            function g(a) { this.resetA11yMarkerOptions = k(a.options.marker || {}, this.userOptions.marker || {}) }

            function q() {
                var a = this.options,
                    e = !1 !== (this.options.accessibility &&
                        this.options.accessibility.enabled);
                if (e = this.chart.options.accessibility.enabled && e) e = this.chart.options.accessibility, e = this.points.length < e.series.pointDescriptionEnabledThreshold || !1 === e.series.pointDescriptionEnabledThreshold;
                if (e) {
                    if (a.marker && !1 === a.marker.enabled && (this.a11yMarkersForced = !0, m(this.options)), this._hasPointMarkers && this.points && this.points.length)
                        for (a = this.points.length; a--;) {
                            e = this.points[a];
                            var d = e.options,
                                b = e.hasForcedA11yMarker;
                            delete e.hasForcedA11yMarker;
                            d.marker && (b =
                                b && 0 === r(d), d.marker.enabled && !b ? (k(!0, d.marker, { states: { normal: { opacity: r(d) || 1 } } }), e.hasForcedA11yMarker = !1) : !1 === d.marker.enabled && (m(d), e.hasForcedA11yMarker = !0))
                        }
                } else this.a11yMarkersForced && (delete this.a11yMarkersForced, (a = this.resetA11yMarkerOptions) && k(!0, this.options, { marker: { enabled: a.enabled, states: { normal: { opacity: a.states && a.states.normal && a.states.normal.opacity } } } }))
            }
            var y = [];
            a.compose = function(a) {
                -1 === y.indexOf(a) && (y.push(a), h(a, "afterSetOptions", g), h(a, "render", q), h(a, "afterRender",
                    n))
            }
        })(r || (r = {}));
        return r
    });
    x(a, "Accessibility/Components/SeriesComponent/SeriesKeyboardNavigation.js", [a["Core/Series/Point.js"], a["Core/Series/Series.js"], a["Core/Series/SeriesRegistry.js"], a["Core/Globals.js"], a["Core/Utilities.js"], a["Accessibility/KeyboardNavigationHandler.js"], a["Accessibility/Utils/EventProvider.js"], a["Accessibility/Utils/ChartUtilities.js"]], function(a, h, t, r, m, w, x, n) {
        function g(a) {
            var b = a.index,
                c = a.series.points,
                d = c.length;
            if (c[b] !== a)
                for (; d--;) { if (c[d] === a) return d } else return b
        }

        function k(a) {
            var b = a.chart.options.accessibility.keyboardNavigation.seriesNavigation,
                c = a.options.accessibility || {},
                d = c.keyboardNavigation;
            return d && !1 === d.enabled || !1 === c.enabled || !1 === a.options.enableMouseTracking || !a.visible || b.pointNavigationEnabledThreshold && b.pointNavigationEnabledThreshold <= a.points.length
        }

        function y(a) {
            var b = a.series.chart.options.accessibility,
                c = a.options.accessibility && !1 === a.options.accessibility.enabled;
            return a.isNull && b.keyboardNavigation.seriesNavigation.skipNullPoints ||
                !1 === a.visible || !1 === a.isInside || c || k(a.series)
        }

        function c(a) {
            var b = !1;
            delete a.highlightedPoint;
            return b = a.series.reduce(function(a, b) { return a || b.highlightFirstValidPoint() }, !1)
        }
        var e = t.seriesTypes,
            d = r.doc,
            b = m.defined,
            f = m.fireEvent,
            u = n.getPointFromXY,
            v = n.getSeriesFromName,
            B = n.scrollToPoint;
        t = function() {
            function e(a, b) {
                this.keyCodes = b;
                this.chart = a
            }
            e.prototype.init = function() {
                var b = this,
                    e = this.chart,
                    f = this.eventProvider = new x;
                f.addEvent(h, "destroy", function() { return b.onSeriesDestroy(this) });
                f.addEvent(e,
                    "afterDrilldown",
                    function() {
                        c(this);
                        this.focusElement && this.focusElement.removeFocusBorder()
                    });
                f.addEvent(e, "drilldown", function(a) {
                    a = a.point;
                    var c = a.series;
                    b.lastDrilledDownPoint = { x: a.x, y: a.y, seriesName: c ? c.name : "" }
                });
                f.addEvent(e, "drillupall", function() { setTimeout(function() { b.onDrillupAll() }, 10) });
                f.addEvent(a, "afterSetState", function() {
                    var a = this.graphic && this.graphic.element,
                        b = d.activeElement,
                        c = b && b.getAttribute("class");
                    c = c && -1 < c.indexOf("highcharts-a11y-proxy-button");
                    e.highlightedPoint ===
                        this && b !== a && !c && a && a.focus && a.focus()
                })
            };
            e.prototype.onDrillupAll = function() {
                var a = this.lastDrilledDownPoint,
                    c = this.chart,
                    d = a && v(c, a.seriesName),
                    e;
                a && d && b(a.x) && b(a.y) && (e = u(d, a.x, a.y));
                c.container && c.container.focus();
                e && e.highlight && e.highlight();
                c.focusElement && c.focusElement.removeFocusBorder()
            };
            e.prototype.getKeyboardNavigationHandler = function() {
                var a = this,
                    b = this.keyCodes,
                    d = this.chart,
                    e = d.inverted;
                return new w(d, {
                    keyCodeMap: [
                        [e ? [b.up, b.down] : [b.left, b.right], function(b) {
                            return a.onKbdSideways(this,
                                b)
                        }],
                        [e ? [b.left, b.right] : [b.up, b.down], function(b) { return a.onKbdVertical(this, b) }],
                        [
                            [b.enter, b.space],
                            function(a, b) { if (a = d.highlightedPoint) b.point = a, f(a.series, "click", b), a.firePointEvent("click"); return this.response.success }
                        ],
                        [
                            [b.home],
                            function() { c(d); return this.response.success }
                        ],
                        [
                            [b.end],
                            function() { for (var a = d.series.length, b; a-- && !(d.highlightedPoint = d.series[a].points[d.series[a].points.length - 1], b = d.series[a].highlightFirstValidPoint());); return this.response.success }
                        ],
                        [
                            [b.pageDown, b.pageUp],
                            function(a) { d.highlightAdjacentSeries(a === b.pageDown); return this.response.success }
                        ]
                    ],
                    init: function() { c(d); return this.response.success },
                    terminate: function() { return a.onHandlerTerminate() }
                })
            };
            e.prototype.onKbdSideways = function(a, b) { var c = this.keyCodes; return this.attemptHighlightAdjacentPoint(a, b === c.right || b === c.down) };
            e.prototype.onKbdVertical = function(a, b) {
                var c = this.chart,
                    d = this.keyCodes;
                b = b === d.down || b === d.right;
                d = c.options.accessibility.keyboardNavigation.seriesNavigation;
                if (d.mode && "serialize" ===
                    d.mode) return this.attemptHighlightAdjacentPoint(a, b);
                c[c.highlightedPoint && c.highlightedPoint.series.keyboardMoveVertical ? "highlightAdjacentPointVertical" : "highlightAdjacentSeries"](b);
                return a.response.success
            };
            e.prototype.onHandlerTerminate = function() {
                var a = this.chart;
                a.tooltip && a.tooltip.hide(0);
                var b = a.highlightedPoint && a.highlightedPoint.series;
                if (b && b.onMouseOut) b.onMouseOut();
                if (a.highlightedPoint && a.highlightedPoint.onMouseOut) a.highlightedPoint.onMouseOut();
                delete a.highlightedPoint
            };
            e.prototype.attemptHighlightAdjacentPoint =
                function(a, b) {
                    var c = this.chart,
                        d = c.options.accessibility.keyboardNavigation.wrapAround;
                    return c.highlightAdjacentPoint(b) ? a.response.success : d ? a.init(b ? 1 : -1) : a.response[b ? "next" : "prev"]
                };
            e.prototype.onSeriesDestroy = function(a) {
                var b = this.chart;
                b.highlightedPoint && b.highlightedPoint.series === a && (delete b.highlightedPoint, b.focusElement && b.focusElement.removeFocusBorder())
            };
            e.prototype.destroy = function() { this.eventProvider.removeAddedEvents() };
            return e
        }();
        (function(a) {
            function c(a) {
                var b = this.series,
                    c = this.highlightedPoint,
                    d = c && g(c) || 0,
                    e = c && c.series.points || [],
                    f = this.series && this.series[this.series.length - 1];
                f = f && f.points && f.points[f.points.length - 1];
                if (!b[0] || !b[0].points) return !1;
                if (c) { if (b = b[c.series.index + (a ? 1 : -1)], d = e[d + (a ? 1 : -1)], !d && b && (d = b.points[a ? 0 : b.points.length - 1]), !d) return !1 } else d = a ? b[0].points[0] : f;
                return y(d) ? (b = d.series, k(b) ? this.highlightedPoint = a ? b.points[b.points.length - 1] : b.points[0] : this.highlightedPoint = d, this.highlightAdjacentPoint(a)) : d.highlight()
            }

            function d(a) {
                var c =
                    this.highlightedPoint,
                    d = Infinity,
                    e;
                if (!b(c.plotX) || !b(c.plotY)) return !1;
                this.series.forEach(function(f) {
                    k(f) || f.points.forEach(function(g) {
                        if (b(g.plotY) && b(g.plotX) && g !== c) {
                            var h = g.plotY - c.plotY,
                                k = Math.abs(g.plotX - c.plotX);
                            k = Math.abs(h) * Math.abs(h) + k * k * 4;
                            f.yAxis && f.yAxis.reversed && (h *= -1);
                            !(0 >= h && a || 0 <= h && !a || 5 > k || y(g)) && k < d && (d = k, e = g)
                        }
                    })
                });
                return e ? e.highlight() : !1
            }

            function f(a) {
                var b = this.highlightedPoint,
                    c = this.series && this.series[this.series.length - 1],
                    d = c && c.points && c.points[c.points.length - 1];
                if (!this.highlightedPoint) return c = a ? this.series && this.series[0] : c, (d = a ? c && c.points && c.points[0] : d) ? d.highlight() : !1;
                c = this.series[b.series.index + (a ? -1 : 1)];
                if (!c) return !1;
                d = h(b, c, 4);
                if (!d) return !1;
                if (k(c)) return d.highlight(), a = this.highlightAdjacentSeries(a), a ? a : (b.highlight(), !1);
                d.highlight();
                return d.series.highlightFirstValidPoint()
            }

            function h(a, c, d, e) {
                var f = Infinity,
                    g = c.points.length,
                    h = function(a) { return !(b(a.plotX) && b(a.plotY)) };
                if (!h(a)) {
                    for (; g--;) {
                        var k = c.points[g];
                        if (!h(k) && (k = (a.plotX -
                                k.plotX) * (a.plotX - k.plotX) * (d || 1) + (a.plotY - k.plotY) * (a.plotY - k.plotY) * (e || 1), k < f)) { f = k; var l = g }
                    }
                    return b(l) ? c.points[l] : void 0
                }
            }

            function q() {
                var a = this.series.chart;
                if (this.isNull) a.tooltip && a.tooltip.hide(0);
                else this.onMouseOver();
                B(this);
                this.graphic && a.setFocusToElement(this.graphic);
                a.highlightedPoint = this;
                return this
            }

            function m() {
                var a = this.chart.highlightedPoint,
                    b = (a && a.series) === this ? g(a) : 0;
                a = this.points;
                var c = a.length;
                if (a && c) {
                    for (var d = b; d < c; ++d)
                        if (!y(a[d])) return a[d].highlight();
                    for (; 0 <=
                        b; --b)
                        if (!y(a[b])) return a[b].highlight()
                }
                return !1
            }
            var n = [];
            a.compose = function(a, b, g) {-1 === n.indexOf(a) && (n.push(a), a = a.prototype, a.highlightAdjacentPoint = c, a.highlightAdjacentPointVertical = d, a.highlightAdjacentSeries = f); - 1 === n.indexOf(b) && (n.push(b), b.prototype.highlight = q); - 1 === n.indexOf(g) && (n.push(g), b = g.prototype, b.keyboardMoveVertical = !0, ["column", "gantt", "pie"].forEach(function(a) { e[a] && (e[a].prototype.keyboardMoveVertical = !1) }), b.highlightFirstValidPoint = m) }
        })(t || (t = {}));
        return t
    });
    x(a, "Accessibility/Components/SeriesComponent/SeriesComponent.js", [a["Accessibility/AccessibilityComponent.js"], a["Accessibility/Utils/ChartUtilities.js"], a["Accessibility/Components/SeriesComponent/ForcedMarkers.js"], a["Accessibility/Components/SeriesComponent/NewDataAnnouncer.js"], a["Accessibility/Components/SeriesComponent/SeriesDescriber.js"], a["Accessibility/Components/SeriesComponent/SeriesKeyboardNavigation.js"], a["Core/Tooltip.js"]], function(a, h, t, r, m, w, x) {
        var k = this && this.__extends || function() {
                var a = function(c, e) {
                    a = Object.setPrototypeOf || { __proto__: [] }
                    instanceof
                    Array && function(a, b) { a.__proto__ = b } || function(a, b) { for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]) };
                    return a(c, e)
                };
                return function(c, e) {
                    function d() { this.constructor = c }
                    a(c, e);
                    c.prototype = null === e ? Object.create(e) : (d.prototype = e.prototype, new d)
                }
            }(),
            g = h.hideSeriesFromAT,
            q = m.describeSeries;
        return function(a) {
            function c() { return null !== a && a.apply(this, arguments) || this }
            k(c, a);
            c.compose = function(a, c, b) {
                r.compose(b);
                t.compose(b);
                w.compose(a, c, b)
            };
            c.prototype.init = function() {
                this.newDataAnnouncer = new r(this.chart);
                this.newDataAnnouncer.init();
                this.keyboardNavigation = new w(this.chart, this.keyCodes);
                this.keyboardNavigation.init();
                this.hideTooltipFromATWhenShown();
                this.hideSeriesLabelsFromATWhenShown()
            };
            c.prototype.hideTooltipFromATWhenShown = function() {
                var a = this;
                this.addEvent(x, "refresh", function() { this.chart === a.chart && this.label && this.label.element && this.label.element.setAttribute("aria-hidden", !0) })
            };
            c.prototype.hideSeriesLabelsFromATWhenShown = function() {
                this.addEvent(this.chart, "afterDrawSeriesLabels", function() {
                    this.series.forEach(function(a) {
                        a.labelBySeries &&
                            a.labelBySeries.attr("aria-hidden", !0)
                    })
                })
            };
            c.prototype.onChartRender = function() { this.chart.series.forEach(function(a) {!1 !== (a.options.accessibility && a.options.accessibility.enabled) && a.visible ? q(a) : g(a) }) };
            c.prototype.getKeyboardNavigation = function() { return this.keyboardNavigation.getKeyboardNavigationHandler() };
            c.prototype.destroy = function() {
                this.newDataAnnouncer.destroy();
                this.keyboardNavigation.destroy()
            };
            return c
        }(a)
    });
    x(a, "Accessibility/Components/ZoomComponent.js", [a["Accessibility/AccessibilityComponent.js"],
        a["Accessibility/Utils/ChartUtilities.js"], a["Core/Globals.js"], a["Accessibility/KeyboardNavigationHandler.js"], a["Core/Utilities.js"]
    ], function(a, h, t, r, m) {
        var k = this && this.__extends || function() {
                var a = function(g, c) {
                    a = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(a, c) { a.__proto__ = c } || function(a, c) { for (var b in c) c.hasOwnProperty(b) && (a[b] = c[b]) };
                    return a(g, c)
                };
                return function(g, c) {
                    function e() { this.constructor = g }
                    a(g, c);
                    g.prototype = null === c ? Object.create(c) : (e.prototype = c.prototype,
                        new e)
                }
            }(),
            x = h.unhideChartElementFromAT,
            n = m.attr,
            g = m.pick;
        a = function(a) {
            function h() {
                var c = null !== a && a.apply(this, arguments) || this;
                c.focusedMapNavButtonIx = -1;
                return c
            }
            k(h, a);
            h.prototype.init = function() {
                var a = this,
                    e = this.chart;
                this.proxyProvider.addGroup("zoom", "div");
                ["afterShowResetZoom", "afterDrilldown", "drillupall"].forEach(function(c) { a.addEvent(e, c, function() { a.updateProxyOverlays() }) })
            };
            h.prototype.onChartUpdate = function() {
                var a = this.chart,
                    e = this;
                a.mapNavButtons && a.mapNavButtons.forEach(function(c,
                    b) {
                    x(a, c.element);
                    e.setMapNavButtonAttrs(c.element, "accessibility.zoom.mapZoom" + (b ? "Out" : "In"))
                })
            };
            h.prototype.setMapNavButtonAttrs = function(a, e) {
                var c = this.chart;
                e = c.langFormat(e, { chart: c });
                n(a, { tabindex: -1, role: "button", "aria-label": e })
            };
            h.prototype.onChartRender = function() { this.updateProxyOverlays() };
            h.prototype.updateProxyOverlays = function() {
                var a = this.chart;
                this.proxyProvider.clearGroup("zoom");
                a.resetZoomButton && this.createZoomProxyButton(a.resetZoomButton, "resetZoomProxyButton", a.langFormat("accessibility.zoom.resetZoomButton", { chart: a }));
                a.drillUpButton && this.createZoomProxyButton(a.drillUpButton, "drillUpProxyButton", a.langFormat("accessibility.drillUpButton", { chart: a, buttonText: a.getDrilldownBackText() }))
            };
            h.prototype.createZoomProxyButton = function(a, e, d) { this[e] = this.proxyProvider.addProxyElement("zoom", { click: a }, { "aria-label": d, tabindex: -1 }) };
            h.prototype.getMapZoomNavigation = function() {
                var a = this.keyCodes,
                    e = this.chart,
                    d = this;
                return new r(e, {
                    keyCodeMap: [
                        [
                            [a.up, a.down, a.left, a.right],
                            function(a) {
                                return d.onMapKbdArrow(this,
                                    a)
                            }
                        ],
                        [
                            [a.tab],
                            function(a, c) { return d.onMapKbdTab(this, c) }
                        ],
                        [
                            [a.space, a.enter],
                            function() { return d.onMapKbdClick(this) }
                        ]
                    ],
                    validate: function() { return !!(e.mapZoom && e.mapNavButtons && e.mapNavButtons.length) },
                    init: function(a) { return d.onMapNavInit(a) }
                })
            };
            h.prototype.onMapKbdArrow = function(a, e) {
                var c = this.keyCodes;
                this.chart[e === c.up || e === c.down ? "yAxis" : "xAxis"][0].panStep(e === c.left || e === c.up ? -1 : 1);
                return a.response.success
            };
            h.prototype.onMapKbdTab = function(a, e) {
                var c = this.chart;
                a = a.response;
                var b = (e = e.shiftKey) &&
                    !this.focusedMapNavButtonIx || !e && this.focusedMapNavButtonIx;
                c.mapNavButtons[this.focusedMapNavButtonIx].setState(0);
                if (b) return c.mapZoom(), a[e ? "prev" : "next"];
                this.focusedMapNavButtonIx += e ? -1 : 1;
                e = c.mapNavButtons[this.focusedMapNavButtonIx];
                c.setFocusToElement(e.box, e.element);
                e.setState(2);
                return a.success
            };
            h.prototype.onMapKbdClick = function(a) { this.fakeClickEvent(this.chart.mapNavButtons[this.focusedMapNavButtonIx].element); return a.response.success };
            h.prototype.onMapNavInit = function(a) {
                var c = this.chart,
                    d = c.mapNavButtons[0],
                    b = c.mapNavButtons[1];
                d = 0 < a ? d : b;
                c.setFocusToElement(d.box, d.element);
                d.setState(2);
                this.focusedMapNavButtonIx = 0 < a ? 0 : 1
            };
            h.prototype.simpleButtonNavigation = function(a, e, d) {
                var b = this.keyCodes,
                    c = this,
                    h = this.chart;
                return new r(h, {
                    keyCodeMap: [
                        [
                            [b.tab, b.up, b.down, b.left, b.right],
                            function(a, c) { return this.response[a === b.tab && c.shiftKey || a === b.left || a === b.up ? "prev" : "next"] }
                        ],
                        [
                            [b.space, b.enter],
                            function() { var a = d(this, h); return g(a, this.response.success) }
                        ]
                    ],
                    validate: function() {
                        return h[a] &&
                            h[a].box && c[e].buttonElement
                    },
                    init: function() { h.setFocusToElement(h[a].box, c[e].buttonElement) }
                })
            };
            h.prototype.getKeyboardNavigation = function() { return [this.simpleButtonNavigation("resetZoomButton", "resetZoomProxyButton", function(a, e) { e.zoomOut() }), this.simpleButtonNavigation("drillUpButton", "drillUpProxyButton", function(a, e) { e.drillUp(); return a.response.prev }), this.getMapZoomNavigation()] };
            return h
        }(a);
        (function(a) {
            function g(a, e) {
                var c = e || 3;
                e = this.getExtremes();
                var b = (e.max - e.min) / c * a;
                c = e.max + b;
                b = e.min + b;
                var f = c - b;
                0 > a && b < e.dataMin ? (b = e.dataMin, c = b + f) : 0 < a && c > e.dataMax && (c = e.dataMax, b = c - f);
                this.setExtremes(b, c)
            }
            a.composedClasses = [];
            a.compose = function(c) {-1 === a.composedClasses.indexOf(c) && (a.composedClasses.push(c), c.prototype.panStep = g) }
        })(a || (a = {}));
        return a
    });
    x(a, "Accessibility/HighContrastMode.js", [a["Core/Globals.js"]], function(a) {
        var h = a.doc,
            k = a.isMS,
            r = a.win;
        return {
            isHighContrastModeActive: function() {
                var a = /(Edg)/.test(r.navigator.userAgent);
                if (r.matchMedia && a) return r.matchMedia("(-ms-high-contrast: active)").matches;
                if (k && r.getComputedStyle) {
                    a = h.createElement("div");
                    a.style.backgroundImage = "url(data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==)";
                    h.body.appendChild(a);
                    var t = (a.currentStyle || r.getComputedStyle(a)).backgroundImage;
                    h.body.removeChild(a);
                    return "none" === t
                }
                return !1
            },
            setHighContrastTheme: function(a) {
                a.highContrastModeActive = !0;
                var h = a.options.accessibility.highContrastTheme;
                a.update(h, !1);
                a.series.forEach(function(a) {
                    var k = h.plotOptions[a.type] || {};
                    a.update({
                        color: k.color || "windowText",
                        colors: [k.color || "windowText"],
                        borderColor: k.borderColor || "window"
                    });
                    a.points.forEach(function(a) { a.options && a.options.color && a.update({ color: k.color || "windowText", borderColor: k.borderColor || "window" }, !1) })
                });
                a.redraw()
            }
        }
    });
    x(a, "Accessibility/HighContrastTheme.js", [], function() {
        return {
            chart: { backgroundColor: "window" },
            title: { style: { color: "windowText" } },
            subtitle: { style: { color: "windowText" } },
            colorAxis: { minColor: "windowText", maxColor: "windowText", stops: [] },
            colors: ["windowText"],
            xAxis: {
                gridLineColor: "windowText",
                labels: { style: { color: "windowText" } },
                lineColor: "windowText",
                minorGridLineColor: "windowText",
                tickColor: "windowText",
                title: { style: { color: "windowText" } }
            },
            yAxis: { gridLineColor: "windowText", labels: { style: { color: "windowText" } }, lineColor: "windowText", minorGridLineColor: "windowText", tickColor: "windowText", title: { style: { color: "windowText" } } },
            tooltip: { backgroundColor: "window", borderColor: "windowText", style: { color: "windowText" } },
            plotOptions: {
                series: {
                    lineColor: "windowText",
                    fillColor: "window",
                    borderColor: "windowText",
                    edgeColor: "windowText",
                    borderWidth: 1,
                    dataLabels: { connectorColor: "windowText", color: "windowText", style: { color: "windowText", textOutline: "none" } },
                    marker: { lineColor: "windowText", fillColor: "windowText" }
                },
                pie: { color: "window", colors: ["window"], borderColor: "windowText", borderWidth: 1 },
                boxplot: { fillColor: "window" },
                candlestick: { lineColor: "windowText", fillColor: "window" },
                errorbar: { fillColor: "window" }
            },
            legend: {
                backgroundColor: "window",
                itemStyle: { color: "windowText" },
                itemHoverStyle: { color: "windowText" },
                itemHiddenStyle: { color: "#555" },
                title: { style: { color: "windowText" } }
            },
            credits: { style: { color: "windowText" } },
            labels: { style: { color: "windowText" } },
            drilldown: { activeAxisLabelStyle: { color: "windowText" }, activeDataLabelStyle: { color: "windowText" } },
            navigation: { buttonOptions: { symbolStroke: "windowText", theme: { fill: "window" } } },
            rangeSelector: {
                buttonTheme: { fill: "window", stroke: "windowText", style: { color: "windowText" }, states: { hover: { fill: "window", stroke: "windowText", style: { color: "windowText" } }, select: { fill: "#444", stroke: "windowText", style: { color: "windowText" } } } },
                inputBoxBorderColor: "windowText",
                inputStyle: { backgroundColor: "window", color: "windowText" },
                labelStyle: { color: "windowText" }
            },
            navigator: { handles: { backgroundColor: "window", borderColor: "windowText" }, outlineColor: "windowText", maskFill: "transparent", series: { color: "windowText", lineColor: "windowText" }, xAxis: { gridLineColor: "windowText" } },
            scrollbar: {
                barBackgroundColor: "#444",
                barBorderColor: "windowText",
                buttonArrowColor: "windowText",
                buttonBackgroundColor: "window",
                buttonBorderColor: "windowText",
                rifleColor: "windowText",
                trackBackgroundColor: "window",
                trackBorderColor: "windowText"
            }
        }
    });
    x(a, "Accessibility/Options/Options.js", [], function() {
        return {
            accessibility: {
                enabled: !0,
                screenReaderSection: {
                    beforeChartFormat: "<{headingTagName}>{chartTitle}</{headingTagName}><div>{typeDescription}</div><div>{chartSubtitle}</div><div>{chartLongdesc}</div><div>{playAsSoundButton}</div><div>{viewTableButton}</div><div>{xAxisDescription}</div><div>{yAxisDescription}</div><div>{annotationsTitle}{annotationsList}</div>",
                    afterChartFormat: "{endOfChartMarker}",
                    axisRangeDateFormat: "%Y-%m-%d %H:%M:%S"
                },
                series: { describeSingleSeries: !1, pointDescriptionEnabledThreshold: 200 },
                point: { valueDescriptionFormat: "{index}. {xDescription}{separator}{value}." },
                landmarkVerbosity: "all",
                linkedDescription: '*[data-highcharts-chart="{index}"] + .highcharts-description',
                keyboardNavigation: {
                    enabled: !0,
                    focusBorder: { enabled: !0, hideBrowserFocusOutline: !0, style: { color: "#335cad", lineWidth: 2, borderRadius: 3 }, margin: 2 },
                    order: ["series", "zoom", "rangeSelector", "legend", "chartMenu"],
                    wrapAround: !0,
                    seriesNavigation: { skipNullPoints: !0, pointNavigationEnabledThreshold: !1 }
                },
                announceNewData: { enabled: !1, minAnnounceInterval: 5E3, interruptUser: !1 }
            },
            legend: { accessibility: { enabled: !0, keyboardNavigation: { enabled: !0 } } },
            exporting: { accessibility: { enabled: !0 } }
        }
    });
    x(a, "Accessibility/Options/LangOptions.js", [], function() {
        return {
            accessibility: {
                defaultChartTitle: "Chart",
                chartContainerLabel: "{title}. Highcharts interactive chart.",
                svgContainerLabel: "Interactive chart",
                drillUpButton: "{buttonText}",
                credits: "Chart credits: {creditsStr}",
                thousandsSep: ",",
                svgContainerTitle: "",
                graphicContainerLabel: "",
                screenReaderSection: { beforeRegionLabel: "Chart screen reader information, {chartTitle}.", afterRegionLabel: "", annotations: { heading: "Chart annotations summary", descriptionSinglePoint: "{annotationText}. Related to {annotationPoint}", descriptionMultiplePoints: "{annotationText}. Related to {annotationPoint}{ Also related to, #each(additionalAnnotationPoints)}", descriptionNoPoints: "{annotationText}" }, endOfChartMarker: "End of interactive chart." },
                sonification: { playAsSoundButtonText: "Play as sound, {chartTitle}", playAsSoundClickAnnouncement: "Play" },
                legend: { legendLabelNoTitle: "Toggle series visibility, {chartTitle}", legendLabel: "Chart legend: {legendTitle}", legendItem: "Show {itemName}" },
                zoom: { mapZoomIn: "Zoom chart", mapZoomOut: "Zoom out chart", resetZoomButton: "Reset zoom" },
                rangeSelector: { dropdownLabel: "{rangeTitle}", minInputLabel: "Select start date.", maxInputLabel: "Select end date.", clickButtonAnnouncement: "Viewing {axisRangeDescription}" },
                table: {
                    viewAsDataTableButtonText: "View as data table, {chartTitle}",
                    tableSummary: "Table representation of chart."
                },
                announceNewData: { newDataAnnounce: "Updated data for chart {chartTitle}", newSeriesAnnounceSingle: "New data series: {seriesDesc}", newPointAnnounceSingle: "New data point: {pointDesc}", newSeriesAnnounceMultiple: "New data series in chart {chartTitle}: {seriesDesc}", newPointAnnounceMultiple: "New data point in chart {chartTitle}: {pointDesc}" },
                seriesTypeDescriptions: {
                    boxplot: "Box plot charts are typically used to display groups of statistical data. Each data point in the chart can have up to 5 values: minimum, lower quartile, median, upper quartile, and maximum.",
                    arearange: "Arearange charts are line charts displaying a range between a lower and higher value for each point.",
                    areasplinerange: "These charts are line charts displaying a range between a lower and higher value for each point.",
                    bubble: "Bubble charts are scatter charts where each data point also has a size value.",
                    columnrange: "Columnrange charts are column charts displaying a range between a lower and higher value for each point.",
                    errorbar: "Errorbar series are used to display the variability of the data.",
                    funnel: "Funnel charts are used to display reduction of data in stages.",
                    pyramid: "Pyramid charts consist of a single pyramid with item heights corresponding to each point value.",
                    waterfall: "A waterfall chart is a column chart where each column contributes towards a total end value."
                },
                chartTypes: {
                    emptyChart: "Empty chart",
                    mapTypeDescription: "Map of {mapTitle} with {numSeries} data series.",
                    unknownMap: "Map of unspecified region with {numSeries} data series.",
                    combinationChart: "Combination chart with {numSeries} data series.",
                    defaultSingle: "Chart with {numPoints} data {#plural(numPoints, points, point)}.",
                    defaultMultiple: "Chart with {numSeries} data series.",
                    splineSingle: "Line chart with {numPoints} data {#plural(numPoints, points, point)}.",
                    splineMultiple: "Line chart with {numSeries} lines.",
                    lineSingle: "Line chart with {numPoints} data {#plural(numPoints, points, point)}.",
                    lineMultiple: "Line chart with {numSeries} lines.",
                    columnSingle: "Bar chart with {numPoints} {#plural(numPoints, bars, bar)}.",
                    columnMultiple: "Bar chart with {numSeries} data series.",
                    barSingle: "Bar chart with {numPoints} {#plural(numPoints, bars, bar)}.",
                    barMultiple: "Bar chart with {numSeries} data series.",
                    pieSingle: "Pie chart with {numPoints} {#plural(numPoints, slices, slice)}.",
                    pieMultiple: "Pie chart with {numSeries} pies.",
                    scatterSingle: "Scatter chart with {numPoints} {#plural(numPoints, points, point)}.",
                    scatterMultiple: "Scatter chart with {numSeries} data series.",
                    boxplotSingle: "Boxplot with {numPoints} {#plural(numPoints, boxes, box)}.",
                    boxplotMultiple: "Boxplot with {numSeries} data series.",
                    bubbleSingle: "Bubble chart with {numPoints} {#plural(numPoints, bubbles, bubble)}.",
                    bubbleMultiple: "Bubble chart with {numSeries} data series."
                },
                axis: {
                    xAxisDescriptionSingular: "The chart has 1 X axis displaying {names[0]}. {ranges[0]}",
                    xAxisDescriptionPlural: "The chart has {numAxes} X axes displaying {#each(names, -1) }and {names[-1]}.",
                    yAxisDescriptionSingular: "The chart has 1 Y axis displaying {names[0]}. {ranges[0]}",
                    yAxisDescriptionPlural: "The chart has {numAxes} Y axes displaying {#each(names, -1) }and {names[-1]}.",
                    timeRangeDays: "Range: {range} days.",
                    timeRangeHours: "Range: {range} hours.",
                    timeRangeMinutes: "Range: {range} minutes.",
                    timeRangeSeconds: "Range: {range} seconds.",
                    rangeFromTo: "Range: {rangeFrom} to {rangeTo}.",
                    rangeCategories: "Range: {numCategories} categories."
                },
                exporting: { chartMenuLabel: "Chart menu", menuButtonLabel: "View chart menu, {chartTitle}" },
                series: {
                    summary: {
                        "default": "{name}, series {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.",
                        defaultCombination: "{name}, series {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.",
                        line: "{name}, line {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.",
                        lineCombination: "{name}, series {ix} of {numSeries}. Line with {numPoints} data {#plural(numPoints, points, point)}.",
                        spline: "{name}, line {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.",
                        splineCombination: "{name}, series {ix} of {numSeries}. Line with {numPoints} data {#plural(numPoints, points, point)}.",
                        column: "{name}, bar series {ix} of {numSeries} with {numPoints} {#plural(numPoints, bars, bar)}.",
                        columnCombination: "{name}, series {ix} of {numSeries}. Bar series with {numPoints} {#plural(numPoints, bars, bar)}.",
                        bar: "{name}, bar series {ix} of {numSeries} with {numPoints} {#plural(numPoints, bars, bar)}.",
                        barCombination: "{name}, series {ix} of {numSeries}. Bar series with {numPoints} {#plural(numPoints, bars, bar)}.",
                        pie: "{name}, pie {ix} of {numSeries} with {numPoints} {#plural(numPoints, slices, slice)}.",
                        pieCombination: "{name}, series {ix} of {numSeries}. Pie with {numPoints} {#plural(numPoints, slices, slice)}.",
                        scatter: "{name}, scatter plot {ix} of {numSeries} with {numPoints} {#plural(numPoints, points, point)}.",
                        scatterCombination: "{name}, series {ix} of {numSeries}, scatter plot with {numPoints} {#plural(numPoints, points, point)}.",
                        boxplot: "{name}, boxplot {ix} of {numSeries} with {numPoints} {#plural(numPoints, boxes, box)}.",
                        boxplotCombination: "{name}, series {ix} of {numSeries}. Boxplot with {numPoints} {#plural(numPoints, boxes, box)}.",
                        bubble: "{name}, bubble series {ix} of {numSeries} with {numPoints} {#plural(numPoints, bubbles, bubble)}.",
                        bubbleCombination: "{name}, series {ix} of {numSeries}. Bubble series with {numPoints} {#plural(numPoints, bubbles, bubble)}.",
                        map: "{name}, map {ix} of {numSeries} with {numPoints} {#plural(numPoints, areas, area)}.",
                        mapCombination: "{name}, series {ix} of {numSeries}. Map with {numPoints} {#plural(numPoints, areas, area)}.",
                        mapline: "{name}, line {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.",
                        maplineCombination: "{name}, series {ix} of {numSeries}. Line with {numPoints} data {#plural(numPoints, points, point)}.",
                        mapbubble: "{name}, bubble series {ix} of {numSeries} with {numPoints} {#plural(numPoints, bubbles, bubble)}.",
                        mapbubbleCombination: "{name}, series {ix} of {numSeries}. Bubble series with {numPoints} {#plural(numPoints, bubbles, bubble)}."
                    },
                    description: "{description}",
                    xAxisDescription: "X axis, {name}",
                    yAxisDescription: "Y axis, {name}",
                    nullPointValue: "No value",
                    pointAnnotationsDescription: "{Annotation: #each(annotations). }"
                }
            }
        }
    });
    x(a, "Accessibility/Options/DeprecatedOptions.js", [a["Core/Utilities.js"]],
        function(a) {
            function h(a, h, k) {
                for (var c, e = 0; e < h.length - 1; ++e) c = h[e], a = a[c] = n(a[c], {});
                a[h[h.length - 1]] = k
            }

            function k(a, k, m, c) {
                function e(a, b) { return b.reduce(function(a, b) { return a[b] }, a) }
                var d = e(a.options, k),
                    b = e(a.options, m);
                Object.keys(c).forEach(function(e) { var f, g = d[e]; "undefined" !== typeof g && (h(b, c[e], g), x(32, !1, a, (f = {}, f[k.join(".") + "." + e] = m.join(".") + "." + c[e].join("."), f))) })
            }

            function r(a) {
                var g = a.options.chart,
                    h = a.options.accessibility || {};
                ["description", "typeDescription"].forEach(function(c) {
                    var e;
                    g[c] && (h[c] = g[c], x(32, !1, a, (e = {}, e["chart." + c] = "use accessibility." + c, e)))
                })
            }

            function m(a) {
                a.axes.forEach(function(g) {
                    (g = g.options) && g.description && (g.accessibility = g.accessibility || {}, g.accessibility.description = g.description, x(32, !1, a, { "axis.description": "use axis.accessibility.description" }))
                })
            }

            function w(a) {
                var g = {
                    description: ["accessibility", "description"],
                    exposeElementToA11y: ["accessibility", "exposeAsGroupOnly"],
                    pointDescriptionFormatter: ["accessibility", "point", "descriptionFormatter"],
                    skipKeyboardNavigation: ["accessibility",
                        "keyboardNavigation", "enabled"
                    ],
                    "accessibility.pointDescriptionFormatter": ["accessibility", "point", "descriptionFormatter"]
                };
                a.series.forEach(function(k) { Object.keys(g).forEach(function(c) { var e, d = k.options[c]; "accessibility.pointDescriptionFormatter" === c && (d = k.options.accessibility && k.options.accessibility.pointDescriptionFormatter); "undefined" !== typeof d && (h(k.options, g[c], "skipKeyboardNavigation" === c ? !d : d), x(32, !1, a, (e = {}, e["series." + c] = "series." + g[c].join("."), e))) }) })
            }
            var x = a.error,
                n = a.pick;
            return function(a) {
                r(a);
                m(a);
                a.series && w(a);
                k(a, ["accessibility"], ["accessibility"], {
                    pointDateFormat: ["point", "dateFormat"],
                    pointDateFormatter: ["point", "dateFormatter"],
                    pointDescriptionFormatter: ["point", "descriptionFormatter"],
                    pointDescriptionThreshold: ["series", "pointDescriptionEnabledThreshold"],
                    pointNavigationThreshold: ["keyboardNavigation", "seriesNavigation", "pointNavigationEnabledThreshold"],
                    pointValueDecimals: ["point", "valueDecimals"],
                    pointValuePrefix: ["point", "valuePrefix"],
                    pointValueSuffix: ["point", "valueSuffix"],
                    screenReaderSectionFormatter: ["screenReaderSection", "beforeChartFormatter"],
                    describeSingleSeries: ["series", "describeSingleSeries"],
                    seriesDescriptionFormatter: ["series", "descriptionFormatter"],
                    onTableAnchorClick: ["screenReaderSection", "onViewDataTableClick"],
                    axisRangeDateFormat: ["screenReaderSection", "axisRangeDateFormat"]
                });
                k(a, ["accessibility", "keyboardNavigation"], ["accessibility", "keyboardNavigation", "seriesNavigation"], { skipNullPoints: ["skipNullPoints"], mode: ["mode"] });
                k(a, ["lang", "accessibility"], ["lang", "accessibility"], {
                    legendItem: ["legend", "legendItem"],
                    legendLabel: ["legend", "legendLabel"],
                    mapZoomIn: ["zoom", "mapZoomIn"],
                    mapZoomOut: ["zoom", "mapZoomOut"],
                    resetZoomButton: ["zoom", "resetZoomButton"],
                    screenReaderRegionLabel: ["screenReaderSection", "beforeRegionLabel"],
                    rangeSelectorButton: ["rangeSelector", "buttonText"],
                    rangeSelectorMaxInput: ["rangeSelector", "maxInputLabel"],
                    rangeSelectorMinInput: ["rangeSelector", "minInputLabel"],
                    svgContainerEnd: ["screenReaderSection", "endOfChartMarker"],
                    viewAsDataTable: ["table",
                        "viewAsDataTableButtonText"
                    ],
                    tableSummary: ["table", "tableSummary"]
                })
            }
        });
    x(a, "Accessibility/Accessibility.js", [a["Core/DefaultOptions.js"], a["Core/Globals.js"], a["Core/Utilities.js"], a["Accessibility/A11yI18n.js"], a["Accessibility/Components/ContainerComponent.js"], a["Accessibility/FocusBorder.js"], a["Accessibility/Components/InfoRegionsComponent.js"], a["Accessibility/KeyboardNavigation.js"], a["Accessibility/Components/LegendComponent.js"], a["Accessibility/Components/MenuComponent.js"], a["Accessibility/Components/SeriesComponent/NewDataAnnouncer.js"],
        a["Accessibility/ProxyProvider.js"], a["Accessibility/Components/RangeSelectorComponent.js"], a["Accessibility/Components/SeriesComponent/SeriesComponent.js"], a["Accessibility/Components/ZoomComponent.js"], a["Accessibility/HighContrastMode.js"], a["Accessibility/HighContrastTheme.js"], a["Accessibility/Options/Options.js"], a["Accessibility/Options/LangOptions.js"], a["Accessibility/Options/DeprecatedOptions.js"]
    ], function(a, h, t, r, m, w, x, n, g, q, y, c, e, d, b, f, u, v, K, E) {
        a = a.defaultOptions;
        var k = h.doc,
            z = t.addEvent,
            B = t.extend,
            F = t.fireEvent,
            C = t.merge;
        h = function() {
            function a(a) {
                this.proxyProvider = this.keyboardNavigation = this.components = this.chart = void 0;
                this.init(a)
            }
            a.prototype.init = function(a) {
                this.chart = a;
                k.addEventListener && a.renderer.isSVG ? (E(a), this.proxyProvider = new c(this.chart), this.initComponents(), this.keyboardNavigation = new n(a, this.components)) : (this.zombie = !0, this.components = {}, a.renderTo.setAttribute("aria-hidden", !0))
            };
            a.prototype.initComponents = function() {
                var a = this.chart,
                    c = this.proxyProvider,
                    f = a.options.accessibility;
                this.components = { container: new m, infoRegions: new x, legend: new g, chartMenu: new q, rangeSelector: new e, series: new d, zoom: new b };
                f.customComponents && B(this.components, f.customComponents);
                var h = this.components;
                this.getComponentOrder().forEach(function(b) {
                    h[b].initBase(a, c);
                    h[b].init()
                })
            };
            a.prototype.getComponentOrder = function() {
                if (!this.components) return [];
                if (!this.components.series) return Object.keys(this.components);
                var a = Object.keys(this.components).filter(function(a) {
                    return "series" !==
                        a
                });
                return ["series"].concat(a)
            };
            a.prototype.update = function() {
                var a = this.components,
                    b = this.chart,
                    c = b.options.accessibility;
                F(b, "beforeA11yUpdate");
                b.types = this.getChartTypes();
                c = c.keyboardNavigation.order;
                this.proxyProvider.updateGroupOrder(c);
                this.getComponentOrder().forEach(function(c) {
                    a[c].onChartUpdate();
                    F(b, "afterA11yComponentUpdate", { name: c, component: a[c] })
                });
                this.keyboardNavigation.update(c);
                !b.highContrastModeActive && f.isHighContrastModeActive() && f.setHighContrastTheme(b);
                F(b, "afterA11yUpdate", { accessibility: this })
            };
            a.prototype.destroy = function() {
                var a = this.chart || {},
                    b = this.components;
                Object.keys(b).forEach(function(a) {
                    b[a].destroy();
                    b[a].destroyBase()
                });
                this.proxyProvider && this.proxyProvider.destroy();
                this.keyboardNavigation && this.keyboardNavigation.destroy();
                a.renderTo && a.renderTo.setAttribute("aria-hidden", !0);
                a.focusElement && a.focusElement.removeFocusBorder()
            };
            a.prototype.getChartTypes = function() {
                var a = {};
                this.chart.series.forEach(function(b) { a[b.type] = 1 });
                return Object.keys(a)
            };
            return a
        }();
        (function(a) {
            function c() { this.accessibility && this.accessibility.destroy() }

            function f() {
                this.a11yDirty && this.renderTo && (delete this.a11yDirty, this.updateA11yEnabled());
                var a = this.accessibility;
                a && !a.zombie && (a.proxyProvider.updateProxyElementPositions(), a.getComponentOrder().forEach(function(b) { a.components[b].onChartRender() }))
            }

            function h(a) {
                if (a = a.options.accessibility) a.customComponents && (this.options.accessibility.customComponents = a.customComponents, delete a.customComponents), C(!0, this.options.accessibility,
                    a), this.accessibility && this.accessibility.destroy && (this.accessibility.destroy(), delete this.accessibility);
                this.a11yDirty = !0
            }

            function k() {
                var b = this.accessibility,
                    c = this.options.accessibility;
                c && c.enabled ? b && !b.zombie ? b.update() : (this.accessibility = b = new a(this), !b.zombie) && b.update() : b ? (b.destroy && b.destroy(), delete this.accessibility) : this.renderTo.setAttribute("aria-hidden", !0)
            }

            function m() { this.series.chart.accessibility && (this.series.chart.a11yDirty = !0) }
            var t = [];
            a.i18nFormat = r.i18nFormat;
            a.compose =
                function(a, l, p, u, v, x, A) {
                    n.compose(l);
                    y.compose(v);
                    g.compose(l, p);
                    q.compose(l);
                    d.compose(l, u, v);
                    b.compose(a);
                    r.compose(l);
                    w.compose(l, x);
                    A && e.compose(l, A); - 1 === t.indexOf(l) && (t.push(l), l.prototype.updateA11yEnabled = k, z(l, "destroy", c), z(l, "render", f), z(l, "update", h), ["addSeries", "init"].forEach(function(a) { z(l, a, function() { this.a11yDirty = !0 }) }), ["afterDrilldown", "drillupall"].forEach(function(a) {
                        z(l, a, function() {
                            var a = this.accessibility;
                            a && !a.zombie && a.update()
                        })
                    })); - 1 === t.indexOf(u) && (t.push(u), z(u,
                        "update", m)); - 1 === t.indexOf(v) && (t.push(v), ["update", "updatedData", "remove"].forEach(function(a) { z(v, a, function() { this.chart.accessibility && (this.chart.a11yDirty = !0) }) }))
                }
        })(h || (h = {}));
        C(!0, a, v, { accessibility: { highContrastTheme: u }, lang: K });
        return h
    });
    x(a, "masters/modules/accessibility.src.js", [a["Core/Globals.js"], a["Accessibility/Accessibility.js"], a["Accessibility/AccessibilityComponent.js"], a["Accessibility/Utils/ChartUtilities.js"], a["Accessibility/Utils/HTMLUtilities.js"], a["Accessibility/KeyboardNavigationHandler.js"],
        a["Accessibility/Components/SeriesComponent/SeriesDescriber.js"]
    ], function(a, h, t, r, m, w, x) {
        a.i18nFormat = h.i18nFormat;
        a.A11yChartUtilities = r;
        a.A11yHTMLUtilities = m;
        a.AccessibilityComponent = t;
        a.KeyboardNavigationHandler = w;
        a.SeriesAccessibilityDescriber = x;
        h.compose(a.Axis, a.Chart, a.Legend, a.Point, a.Series, a.SVGElement, a.RangeSelector)
    })
});
//# sourceMappingURL=accessibility.js.map