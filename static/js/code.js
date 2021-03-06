/* PrismJS 1.15.0
https://prismjs.com/download.html#themes=prism&languages=markup+css+clike+javascript+c+csharp+bash+cpp+aspnet+dart+docker+markup-templating+erlang+go+groovy+java+json+kotlin+markdown+lua+objectivec+php+python+r+yaml+toml&plugins=line-numbers+highlight-keywords */
var _self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {}
  , Prism = function() {
    var e = /\blang(?:uage)?-([\w-]+)\b/i
      , t = 0
      , n = _self.Prism = {
        manual: _self.Prism && _self.Prism.manual,
        disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
        util: {
            encode: function(e) {
                return e instanceof a ? new a(e.type,n.util.encode(e.content),e.alias) : "Array" === n.util.type(e) ? e.map(n.util.encode) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ")
            },
            type: function(e) {
                return Object.prototype.toString.call(e).slice(8, -1)
            },
            objId: function(e) {
                return e.__id || Object.defineProperty(e, "__id", {
                    value: ++t
                }),
                e.__id
            },
            clone: function(e, t) {
                var a = n.util.type(e);
                switch (t = t || {},
                a) {
                case "Object":
                    if (t[n.util.objId(e)])
                        return t[n.util.objId(e)];
                    var r = {};
                    t[n.util.objId(e)] = r;
                    for (var l in e)
                        e.hasOwnProperty(l) && (r[l] = n.util.clone(e[l], t));
                    return r;
                case "Array":
                    if (t[n.util.objId(e)])
                        return t[n.util.objId(e)];
                    var r = [];
                    return t[n.util.objId(e)] = r,
                    e.forEach(function(e, a) {
                        r[a] = n.util.clone(e, t)
                    }),
                    r
                }
                return e
            }
        },
        languages: {
            extend: function(e, t) {
                var a = n.util.clone(n.languages[e]);
                for (var r in t)
                    a[r] = t[r];
                return a
            },
            insertBefore: function(e, t, a, r) {
                r = r || n.languages;
                var l = r[e]
                  , i = {};
                for (var o in l)
                    if (l.hasOwnProperty(o)) {
                        if (o == t)
                            for (var s in a)
                                a.hasOwnProperty(s) && (i[s] = a[s]);
                        a.hasOwnProperty(o) || (i[o] = l[o])
                    }
                var u = r[e];
                return r[e] = i,
                n.languages.DFS(n.languages, function(t, n) {
                    n === u && t != e && (this[t] = i)
                }),
                i
            },
            DFS: function(e, t, a, r) {
                r = r || {};
                for (var l in e)
                    e.hasOwnProperty(l) && (t.call(e, l, e[l], a || l),
                    "Object" !== n.util.type(e[l]) || r[n.util.objId(e[l])] ? "Array" !== n.util.type(e[l]) || r[n.util.objId(e[l])] || (r[n.util.objId(e[l])] = !0,
                    n.languages.DFS(e[l], t, l, r)) : (r[n.util.objId(e[l])] = !0,
                    n.languages.DFS(e[l], t, null, r)))
            }
        },
        plugins: {},
        highlightAll: function(e, t) {
            n.highlightAllUnder(document, e, t)
        },
        highlightAllUnder: function(e, t, a) {
            var r = {
                callback: a,
                selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
            };
            n.hooks.run("before-highlightall", r);
            for (var l, i = r.elements || e.querySelectorAll(r.selector), o = 0; l = i[o++]; )
                n.highlightElement(l, t === !0, r.callback)
        },
        highlightElement: function(t, a, r) {
            for (var l, i, o = t; o && !e.test(o.className); )
                o = o.parentNode;
            o && (l = (o.className.match(e) || [, ""])[1].toLowerCase(),
            i = n.languages[l]),
            t.className = t.className.replace(e, "").replace(/\s+/g, " ") + " language-" + l,
            t.parentNode && (o = t.parentNode,
            /pre/i.test(o.nodeName) && (o.className = o.className.replace(e, "").replace(/\s+/g, " ") + " language-" + l));
            var s = t.textContent
              , u = {
                element: t,
                language: l,
                grammar: i,
                code: s
            };
            if (n.hooks.run("before-sanity-check", u),
            !u.code || !u.grammar)
                return u.code && (n.hooks.run("before-highlight", u),
                u.element.textContent = u.code,
                n.hooks.run("after-highlight", u)),
                n.hooks.run("complete", u),
                void 0;
            if (n.hooks.run("before-highlight", u),
            a && _self.Worker) {
                var g = new Worker(n.filename);
                g.onmessage = function(e) {
                    u.highlightedCode = e.data,
                    n.hooks.run("before-insert", u),
                    u.element.innerHTML = u.highlightedCode,
                    n.hooks.run("after-highlight", u),
                    n.hooks.run("complete", u),
                    r && r.call(u.element)
                }
                ,
                g.postMessage(JSON.stringify({
                    language: u.language,
                    code: u.code,
                    immediateClose: !0
                }))
            } else
                u.highlightedCode = n.highlight(u.code, u.grammar, u.language),
                n.hooks.run("before-insert", u),
                u.element.innerHTML = u.highlightedCode,
                n.hooks.run("after-highlight", u),
                n.hooks.run("complete", u),
                r && r.call(t)
        },
        highlight: function(e, t, r) {
            var l = {
                code: e,
                grammar: t,
                language: r
            };
            return n.hooks.run("before-tokenize", l),
            l.tokens = n.tokenize(l.code, l.grammar),
            n.hooks.run("after-tokenize", l),
            a.stringify(n.util.encode(l.tokens), l.language)
        },
        matchGrammar: function(e, t, a, r, l, i, o) {
            var s = n.Token;
            for (var u in a)
                if (a.hasOwnProperty(u) && a[u]) {
                    if (u == o)
                        return;
                    var g = a[u];
                    g = "Array" === n.util.type(g) ? g : [g];
                    for (var c = 0; c < g.length; ++c) {
                        var h = g[c]
                          , f = h.inside
                          , d = !!h.lookbehind
                          , m = !!h.greedy
                          , p = 0
                          , y = h.alias;
                        if (m && !h.pattern.global) {
                            var v = h.pattern.toString().match(/[imuy]*$/)[0];
                            h.pattern = RegExp(h.pattern.source, v + "g")
                        }
                        h = h.pattern || h;
                        for (var b = r, k = l; b < t.length; k += t[b].length,
                        ++b) {
                            var w = t[b];
                            if (t.length > e.length)
                                return;
                            if (!(w instanceof s)) {
                                if (m && b != t.length - 1) {
                                    h.lastIndex = k;
                                    var _ = h.exec(e);
                                    if (!_)
                                        break;
                                    for (var j = _.index + (d ? _[1].length : 0), P = _.index + _[0].length, A = b, x = k, O = t.length; O > A && (P > x || !t[A].type && !t[A - 1].greedy); ++A)
                                        x += t[A].length,
                                        j >= x && (++b,
                                        k = x);
                                    if (t[b]instanceof s)
                                        continue;
                                    I = A - b,
                                    w = e.slice(k, x),
                                    _.index -= k
                                } else {
                                    h.lastIndex = 0;
                                    var _ = h.exec(w)
                                      , I = 1
                                }
                                if (_) {
                                    d && (p = _[1] ? _[1].length : 0);
                                    var j = _.index + p
                                      , _ = _[0].slice(p)
                                      , P = j + _.length
                                      , N = w.slice(0, j)
                                      , S = w.slice(P)
                                      , C = [b, I];
                                    N && (++b,
                                    k += N.length,
                                    C.push(N));
                                    var E = new s(u,f ? n.tokenize(_, f) : _,y,_,m);
                                    if (C.push(E),
                                    S && C.push(S),
                                    Array.prototype.splice.apply(t, C),
                                    1 != I && n.matchGrammar(e, t, a, b, k, !0, u),
                                    i)
                                        break
                                } else if (i)
                                    break
                            }
                        }
                    }
                }
        },
        tokenize: function(e, t) {
            var a = [e]
              , r = t.rest;
            if (r) {
                for (var l in r)
                    t[l] = r[l];
                delete t.rest
            }
            return n.matchGrammar(e, a, t, 0, 0, !1),
            a
        },
        hooks: {
            all: {},
            add: function(e, t) {
                var a = n.hooks.all;
                a[e] = a[e] || [],
                a[e].push(t)
            },
            run: function(e, t) {
                var a = n.hooks.all[e];
                if (a && a.length)
                    for (var r, l = 0; r = a[l++]; )
                        r(t)
            }
        }
    }
      , a = n.Token = function(e, t, n, a, r) {
        this.type = e,
        this.content = t,
        this.alias = n,
        this.length = 0 | (a || "").length,
        this.greedy = !!r
    }
    ;
    if (a.stringify = function(e, t, r) {
        if ("string" == typeof e)
            return e;
        if ("Array" === n.util.type(e))
            return e.map(function(n) {
                return a.stringify(n, t, e)
            }).join("");
        var l = {
            type: e.type,
            content: a.stringify(e.content, t, r),
            tag: "span",
            classes: ["token", e.type],
            attributes: {},
            language: t,
            parent: r
        };
        if (e.alias) {
            var i = "Array" === n.util.type(e.alias) ? e.alias : [e.alias];
            Array.prototype.push.apply(l.classes, i)
        }
        n.hooks.run("wrap", l);
        var o = Object.keys(l.attributes).map(function(e) {
            return e + '="' + (l.attributes[e] || "").replace(/"/g, "&quot;") + '"'
        }).join(" ");
        return "<" + l.tag + ' class="' + l.classes.join(" ") + '"' + (o ? " " + o : "") + ">" + l.content + "</" + l.tag + ">"
    }
    ,
    !_self.document)
        return _self.addEventListener ? (n.disableWorkerMessageHandler || _self.addEventListener("message", function(e) {
            var t = JSON.parse(e.data)
              , a = t.language
              , r = t.code
              , l = t.immediateClose;
            _self.postMessage(n.highlight(r, n.languages[a], a)),
            l && _self.close()
        }, !1),
        _self.Prism) : _self.Prism;
    var r = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();
    return r && (n.filename = r.src,
    n.manual || r.hasAttribute("data-manual") || ("loading" !== document.readyState ? window.requestAnimationFrame ? window.requestAnimationFrame(n.highlightAll) : window.setTimeout(n.highlightAll, 16) : document.addEventListener("DOMContentLoaded", n.highlightAll))),
    _self.Prism
}();
"undefined" != typeof module && module.exports && (module.exports = Prism),
"undefined" != typeof global && (global.Prism = Prism);
Prism.languages.markup = {
    comment: /<!--[\s\S]*?-->/,
    prolog: /<\?[\s\S]+?\?>/,
    doctype: /<!DOCTYPE[\s\S]+?>/i,
    cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
    tag: {
        pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
        greedy: !0,
        inside: {
            tag: {
                pattern: /^<\/?[^\s>\/]+/i,
                inside: {
                    punctuation: /^<\/?/,
                    namespace: /^[^\s>\/:]+:/
                }
            },
            "attr-value": {
                pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,
                inside: {
                    punctuation: [/^=/, {
                        pattern: /(^|[^\\])["']/,
                        lookbehind: !0
                    }]
                }
            },
            punctuation: /\/?>/,
            "attr-name": {
                pattern: /[^\s>\/]+/,
                inside: {
                    namespace: /^[^\s>\/:]+:/
                }
            }
        }
    },
    entity: /&#?[\da-z]{1,8};/i
},
Prism.languages.markup.tag.inside["attr-value"].inside.entity = Prism.languages.markup.entity,
Prism.hooks.add("wrap", function(a) {
    "entity" === a.type && (a.attributes.title = a.content.replace(/&amp;/, "&"))
}),
Prism.languages.xml = Prism.languages.markup,
Prism.languages.html = Prism.languages.markup,
Prism.languages.mathml = Prism.languages.markup,
Prism.languages.svg = Prism.languages.markup;
Prism.languages.css = {
    comment: /\/\*[\s\S]*?\*\//,
    atrule: {
        pattern: /@[\w-]+?.*?(?:;|(?=\s*\{))/i,
        inside: {
            rule: /@[\w-]+/
        }
    },
    url: /url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
    selector: /[^{}\s][^{};]*?(?=\s*\{)/,
    string: {
        pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: !0
    },
    property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
    important: /!important\b/i,
    "function": /[-a-z0-9]+(?=\()/i,
    punctuation: /[(){};:,]/
},
Prism.languages.css.atrule.inside.rest = Prism.languages.css,
Prism.languages.markup && (Prism.languages.insertBefore("markup", "tag", {
    style: {
        pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
        lookbehind: !0,
        inside: Prism.languages.css,
        alias: "language-css",
        greedy: !0
    }
}),
Prism.languages.insertBefore("inside", "attr-value", {
    "style-attr": {
        pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
        inside: {
            "attr-name": {
                pattern: /^\s*style/i,
                inside: Prism.languages.markup.tag.inside
            },
            punctuation: /^\s*=\s*['"]|['"]\s*$/,
            "attr-value": {
                pattern: /.+/i,
                inside: Prism.languages.css
            }
        },
        alias: "language-css"
    }
}, Prism.languages.markup.tag));
Prism.languages.clike = {
    comment: [{
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: !0
    }, {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: !0,
        greedy: !0
    }],
    string: {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: !0
    },
    "class-name": {
        pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
        lookbehind: !0,
        inside: {
            punctuation: /[.\\]/
        }
    },
    keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    "boolean": /\b(?:true|false)\b/,
    "function": /\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
    punctuation: /[{}[\];(),.:]/
};
Prism.languages.javascript = Prism.languages.extend("clike", {
    "class-name": [Prism.languages.clike["class-name"], {
        pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
        lookbehind: !0
    }],
    keyword: [{
        pattern: /((?:^|})\s*)(?:catch|finally)\b/,
        lookbehind: !0
    }, /\b(?:as|async|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/],
    number: /\b(?:(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+)n?|\d+n|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
    "function": /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\(|\.(?:apply|bind|call)\()/,
    operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
}),
Prism.languages.javascript["class-name"][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/,
Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
        pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^\/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,
        lookbehind: !0,
        greedy: !0
    },
    "function-variable": {
        pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,
        alias: "function"
    },
    parameter: [{
        pattern: /(function(?:\s+[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)[^\s()][^()]*?(?=\s*\))/,
        lookbehind: !0,
        inside: Prism.languages.javascript
    }, {
        pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/,
        inside: Prism.languages.javascript
    }, {
        pattern: /(\(\s*)[^\s()][^()]*?(?=\s*\)\s*=>)/,
        lookbehind: !0,
        inside: Prism.languages.javascript
    }, {
        pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)[^\s()][^()]*?(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: Prism.languages.javascript
    }],
    constant: /\b[A-Z][A-Z\d_]*\b/
}),
Prism.languages.insertBefore("javascript", "string", {
    "template-string": {
        pattern: /`(?:\\[\s\S]|\${[^}]+}|[^\\`])*`/,
        greedy: !0,
        inside: {
            interpolation: {
                pattern: /\${[^}]+}/,
                inside: {
                    "interpolation-punctuation": {
                        pattern: /^\${|}$/,
                        alias: "punctuation"
                    },
                    rest: Prism.languages.javascript
                }
            },
            string: /[\s\S]+/
        }
    }
}),
Prism.languages.markup && Prism.languages.insertBefore("markup", "tag", {
    script: {
        pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
        lookbehind: !0,
        inside: Prism.languages.javascript,
        alias: "language-javascript",
        greedy: !0
    }
}),
Prism.languages.js = Prism.languages.javascript;
Prism.languages.c = Prism.languages.extend("clike", {
    keyword: /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/,
    operator: />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*\/%&|^!=<>]=?/,
    number: /(?:\b0x[\da-f]+|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?)[ful]*/i
}),
Prism.languages.insertBefore("c", "string", {
    macro: {
        pattern: /(^\s*)#\s*[a-z]+(?:[^\r\n\\]|\\(?:\r\n|[\s\S]))*/im,
        lookbehind: !0,
        alias: "property",
        inside: {
            string: {
                pattern: /(#\s*include\s*)(?:<.+?>|("|')(?:\\?.)+?\2)/,
                lookbehind: !0
            },
            directive: {
                pattern: /(#\s*)\b(?:define|defined|elif|else|endif|error|ifdef|ifndef|if|import|include|line|pragma|undef|using)\b/,
                lookbehind: !0,
                alias: "keyword"
            }
        }
    },
    constant: /\b(?:__FILE__|__LINE__|__DATE__|__TIME__|__TIMESTAMP__|__func__|EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|stdin|stdout|stderr)\b/
}),
delete Prism.languages.c["class-name"],
delete Prism.languages.c["boolean"];
Prism.languages.csharp = Prism.languages.extend("clike", {
    keyword: /\b(?:abstract|add|alias|as|ascending|async|await|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|descending|do|double|dynamic|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|from|get|global|goto|group|if|implicit|in|int|interface|internal|into|is|join|let|lock|long|namespace|new|null|object|operator|orderby|out|override|params|partial|private|protected|public|readonly|ref|remove|return|sbyte|sealed|select|set|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|value|var|virtual|void|volatile|where|while|yield)\b/,
    string: [{
        pattern: /@("|')(?:\1\1|\\[\s\S]|(?!\1)[^\\])*\1/,
        greedy: !0
    }, {
        pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*?\1/,
        greedy: !0
    }],
    "class-name": [{
        pattern: /\b[A-Z]\w*(?:\.\w+)*\b(?=\s+\w+)/,
        inside: {
            punctuation: /\./
        }
    }, {
        pattern: /(\[)[A-Z]\w*(?:\.\w+)*\b/,
        lookbehind: !0,
        inside: {
            punctuation: /\./
        }
    }, {
        pattern: /(\b(?:class|interface)\s+[A-Z]\w*(?:\.\w+)*\s*:\s*)[A-Z]\w*(?:\.\w+)*\b/,
        lookbehind: !0,
        inside: {
            punctuation: /\./
        }
    }, {
        pattern: /((?:\b(?:class|interface|new)\s+)|(?:catch\s+\())[A-Z]\w*(?:\.\w+)*\b/,
        lookbehind: !0,
        inside: {
            punctuation: /\./
        }
    }],
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)f?/i,
    operator: />>=?|<<=?|[-=]>|([-+&|?])\1|~|[-+*\/%&|^!=<>]=?/,
    punctuation: /\?\.?|::|[{}[\];(),.:]/
}),
Prism.languages.insertBefore("csharp", "class-name", {
    "generic-method": {
        pattern: /\w+\s*<[^>\r\n]+?>\s*(?=\()/,
        inside: {
            "function": /^\w+/,
            "class-name": {
                pattern: /\b[A-Z]\w*(?:\.\w+)*\b/,
                inside: {
                    punctuation: /\./
                }
            },
            keyword: Prism.languages.csharp.keyword,
            punctuation: /[<>(),.:]/
        }
    },
    preprocessor: {
        pattern: /(^\s*)#.*/m,
        lookbehind: !0,
        alias: "property",
        inside: {
            directive: {
                pattern: /(\s*#)\b(?:define|elif|else|endif|endregion|error|if|line|pragma|region|undef|warning)\b/,
                lookbehind: !0,
                alias: "keyword"
            }
        }
    }
}),
Prism.languages.dotnet = Prism.languages.csharp;
!function(e) {
    var t = {
        variable: [{
            pattern: /\$?\(\([\s\S]+?\)\)/,
            inside: {
                variable: [{
                    pattern: /(^\$\(\([\s\S]+)\)\)/,
                    lookbehind: !0
                }, /^\$\(\(/],
                number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee]-?\d+)?/,
                operator: /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,
                punctuation: /\(\(?|\)\)?|,|;/
            }
        }, {
            pattern: /\$\([^)]+\)|`[^`]+`/,
            greedy: !0,
            inside: {
                variable: /^\$\(|^`|\)$|`$/
            }
        }, /\$(?:[\w#?*!@]+|\{[^}]+\})/i]
    };
    e.languages.bash = {
        shebang: {
            pattern: /^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/,
            alias: "important"
        },
        comment: {
            pattern: /(^|[^"{\\])#.*/,
            lookbehind: !0
        },
        string: [{
            pattern: /((?:^|[^<])<<\s*)["']?(\w+?)["']?\s*\r?\n(?:[\s\S])*?\r?\n\2/,
            lookbehind: !0,
            greedy: !0,
            inside: t
        }, {
            pattern: /(["'])(?:\\[\s\S]|\$\([^)]+\)|`[^`]+`|(?!\1)[^\\])*\1/,
            greedy: !0,
            inside: t
        }],
        variable: t.variable,
        "function": {
            pattern: /(^|[\s;|&])(?:alias|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|hash|head|help|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|jobs|join|kill|killall|less|link|ln|locate|logname|logout|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|tail|tar|tee|test|time|timeout|times|top|touch|tr|traceroute|trap|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip|zypper)(?=$|[\s;|&])/,
            lookbehind: !0
        },
        keyword: {
            pattern: /(^|[\s;|&])(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|[\s;|&])/,
            lookbehind: !0
        },
        "boolean": {
            pattern: /(^|[\s;|&])(?:true|false)(?=$|[\s;|&])/,
            lookbehind: !0
        },
        operator: /&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/,
        punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];]/
    };
    var a = t.variable[1].inside;
    a.string = e.languages.bash.string,
    a["function"] = e.languages.bash["function"],
    a.keyword = e.languages.bash.keyword,
    a["boolean"] = e.languages.bash["boolean"],
    a.operator = e.languages.bash.operator,
    a.punctuation = e.languages.bash.punctuation,
    e.languages.shell = e.languages.bash
}(Prism);
Prism.languages.cpp = Prism.languages.extend("c", {
    keyword: /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|class|compl|const|constexpr|const_cast|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|float|for|friend|goto|if|inline|int|int8_t|int16_t|int32_t|int64_t|uint8_t|uint16_t|uint32_t|uint64_t|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/,
    "boolean": /\b(?:true|false)\b/,
    operator: />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*\/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/
}),
Prism.languages.insertBefore("cpp", "keyword", {
    "class-name": {
        pattern: /(class\s+)\w+/i,
        lookbehind: !0
    }
}),
Prism.languages.insertBefore("cpp", "string", {
    "raw-string": {
        pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,
        alias: "string",
        greedy: !0
    }
});
Prism.languages.aspnet = Prism.languages.extend("markup", {
    "page-directive tag": {
        pattern: /<%\s*@.*%>/i,
        inside: {
            "page-directive tag": /<%\s*@\s*(?:Assembly|Control|Implements|Import|Master(?:Type)?|OutputCache|Page|PreviousPageType|Reference|Register)?|%>/i,
            rest: Prism.languages.markup.tag.inside
        }
    },
    "directive tag": {
        pattern: /<%.*%>/i,
        inside: {
            "directive tag": /<%\s*?[$=%#:]{0,2}|%>/i,
            rest: Prism.languages.csharp
        }
    }
}),
Prism.languages.aspnet.tag.pattern = /<(?!%)\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
Prism.languages.insertBefore("inside", "punctuation", {
    "directive tag": Prism.languages.aspnet["directive tag"]
}, Prism.languages.aspnet.tag.inside["attr-value"]),
Prism.languages.insertBefore("aspnet", "comment", {
    "asp comment": /<%--[\s\S]*?--%>/
}),
Prism.languages.insertBefore("aspnet", Prism.languages.javascript ? "script" : "tag", {
    "asp script": {
        pattern: /(<script(?=.*runat=['"]?server['"]?)[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
        lookbehind: !0,
        inside: Prism.languages.csharp || {}
    }
});
Prism.languages.dart = Prism.languages.extend("clike", {
    string: [{
        pattern: /r?("""|''')[\s\S]*?\1/,
        greedy: !0
    }, {
        pattern: /r?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
        greedy: !0
    }],
    keyword: [/\b(?:async|sync|yield)\*/, /\b(?:abstract|assert|async|await|break|case|catch|class|const|continue|default|deferred|do|dynamic|else|enum|export|external|extends|factory|final|finally|for|get|if|implements|import|in|library|new|null|operator|part|rethrow|return|set|static|super|switch|this|throw|try|typedef|var|void|while|with|yield)\b/],
    operator: /\bis!|\b(?:as|is)\b|\+\+|--|&&|\|\||<<=?|>>=?|~(?:\/=?)?|[+\-*\/%&^|=!<>]=?|\?/
}),
Prism.languages.insertBefore("dart", "function", {
    metadata: {
        pattern: /@\w+/,
        alias: "symbol"
    }
});
Prism.languages.docker = {
    keyword: {
        pattern: /(^\s*)(?:ADD|ARG|CMD|COPY|ENTRYPOINT|ENV|EXPOSE|FROM|HEALTHCHECK|LABEL|MAINTAINER|ONBUILD|RUN|SHELL|STOPSIGNAL|USER|VOLUME|WORKDIR)(?=\s)/im,
        lookbehind: !0
    },
    string: /("|')(?:(?!\1)[^\\\r\n]|\\(?:\r\n|[\s\S]))*\1/,
    comment: /#.*/,
    punctuation: /---|\.\.\.|[:[\]{}\-,|>?]/
},
Prism.languages.dockerfile = Prism.languages.docker;
Prism.languages["markup-templating"] = {},
Object.defineProperties(Prism.languages["markup-templating"], {
    buildPlaceholders: {
        value: function(e, t, n, a) {
            e.language === t && (e.tokenStack = [],
            e.code = e.code.replace(n, function(n) {
                if ("function" == typeof a && !a(n))
                    return n;
                for (var r = e.tokenStack.length; -1 !== e.code.indexOf("___" + t.toUpperCase() + r + "___"); )
                    ++r;
                return e.tokenStack[r] = n,
                "___" + t.toUpperCase() + r + "___"
            }),
            e.grammar = Prism.languages.markup)
        }
    },
    tokenizePlaceholders: {
        value: function(e, t) {
            if (e.language === t && e.tokenStack) {
                e.grammar = Prism.languages[t];
                var n = 0
                  , a = Object.keys(e.tokenStack)
                  , r = function(o) {
                    if (!(n >= a.length))
                        for (var i = 0; i < o.length; i++) {
                            var g = o[i];
                            if ("string" == typeof g || g.content && "string" == typeof g.content) {
                                var c = a[n]
                                  , s = e.tokenStack[c]
                                  , l = "string" == typeof g ? g : g.content
                                  , p = l.indexOf("___" + t.toUpperCase() + c + "___");
                                if (p > -1) {
                                    ++n;
                                    var f, u = l.substring(0, p), _ = new Prism.Token(t,Prism.tokenize(s, e.grammar, t),"language-" + t,s), k = l.substring(p + ("___" + t.toUpperCase() + c + "___").length);
                                    if (u || k ? (f = [u, _, k].filter(function(e) {
                                        return !!e
                                    }),
                                    r(f)) : f = _,
                                    "string" == typeof g ? Array.prototype.splice.apply(o, [i, 1].concat(f)) : g.content = f,
                                    n >= a.length)
                                        break
                                }
                            } else
                                g.content && "string" != typeof g.content && r(g.content)
                        }
                };
                r(e.tokens)
            }
        }
    }
});
Prism.languages.erlang = {
    comment: /%.+/,
    string: {
        pattern: /"(?:\\.|[^\\"\r\n])*"/,
        greedy: !0
    },
    "quoted-function": {
        pattern: /'(?:\\.|[^\\'\r\n])+'(?=\()/,
        alias: "function"
    },
    "quoted-atom": {
        pattern: /'(?:\\.|[^\\'\r\n])+'/,
        alias: "atom"
    },
    "boolean": /\b(?:true|false)\b/,
    keyword: /\b(?:fun|when|case|of|end|if|receive|after|try|catch)\b/,
    number: [/\$\\?./, /\d+#[a-z0-9]+/i, /(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i],
    "function": /\b[a-z][\w@]*(?=\()/,
    variable: {
        pattern: /(^|[^@])(?:\b|\?)[A-Z_][\w@]*/,
        lookbehind: !0
    },
    operator: [/[=\/<>:]=|=[:\/]=|\+\+?|--?|[=*\/!]|\b(?:bnot|div|rem|band|bor|bxor|bsl|bsr|not|and|or|xor|orelse|andalso)\b/, {
        pattern: /(^|[^<])<(?!<)/,
        lookbehind: !0
    }, {
        pattern: /(^|[^>])>(?!>)/,
        lookbehind: !0
    }],
    atom: /\b[a-z][\w@]*/,
    punctuation: /[()[\]{}:;,.#|]|<<|>>/
};
Prism.languages.go = Prism.languages.extend("clike", {
    keyword: /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(?:to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,
    builtin: /\b(?:bool|byte|complex(?:64|128)|error|float(?:32|64)|rune|string|u?int(?:8|16|32|64)?|uintptr|append|cap|close|complex|copy|delete|imag|len|make|new|panic|print(?:ln)?|real|recover)\b/,
    "boolean": /\b(?:_|iota|nil|true|false)\b/,
    operator: /[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
    number: /(?:\b0x[a-f\d]+|(?:\b\d+\.?\d*|\B\.\d+)(?:e[-+]?\d+)?)i?/i,
    string: {
        pattern: /(["'`])(\\[\s\S]|(?!\1)[^\\])*\1/,
        greedy: !0
    }
}),
delete Prism.languages.go["class-name"];
Prism.languages.groovy = Prism.languages.extend("clike", {
    keyword: /\b(?:as|def|in|abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|trait|transient|try|void|volatile|while)\b/,
    string: [{
        pattern: /("""|''')[\s\S]*?\1|(?:\$\/)(?:\$\/\$|[\s\S])*?\/\$/,
        greedy: !0
    }, {
        pattern: /(["'\/])(?:\\.|(?!\1)[^\\\r\n])*\1/,
        greedy: !0
    }],
    number: /\b(?:0b[01_]+|0x[\da-f_]+(?:\.[\da-f_p\-]+)?|[\d_]+(?:\.[\d_]+)?(?:e[+-]?[\d]+)?)[glidf]?\b/i,
    operator: {
        pattern: /(^|[^.])(?:~|==?~?|\?[.:]?|\*(?:[.=]|\*=?)?|\.[@&]|\.\.<|\.{1,2}(?!\.)|-[-=>]?|\+[+=]?|!=?|<(?:<=?|=>?)?|>(?:>>?=?|=)?|&[&=]?|\|[|=]?|\/=?|\^=?|%=?)/,
        lookbehind: !0
    },
    punctuation: /\.+|[{}[\];(),:$]/
}),
Prism.languages.insertBefore("groovy", "string", {
    shebang: {
        pattern: /#!.+/,
        alias: "comment"
    }
}),
Prism.languages.insertBefore("groovy", "punctuation", {
    "spock-block": /\b(?:setup|given|when|then|and|cleanup|expect|where):/
}),
Prism.languages.insertBefore("groovy", "function", {
    annotation: {
        alias: "punctuation",
        pattern: /(^|[^.])@\w+/,
        lookbehind: !0
    }
}),
Prism.hooks.add("wrap", function(e) {
    if ("groovy" === e.language && "string" === e.type) {
        var t = e.content[0];
        if ("'" != t) {
            var n = /([^\\])(?:\$(?:\{.*?\}|[\w.]+))/;
            "$" === t && (n = /([^\$])(?:\$(?:\{.*?\}|[\w.]+))/),
            e.content = e.content.replace(/&lt;/g, "<").replace(/&amp;/g, "&"),
            e.content = Prism.highlight(e.content, {
                expression: {
                    pattern: n,
                    lookbehind: !0,
                    inside: Prism.languages.groovy
                }
            }),
            e.classes.push("/" === t ? "regex" : "gstring")
        }
    }
});
!function(a) {
    var e = /\b(?:abstract|continue|for|new|switch|assert|default|goto|package|synchronized|boolean|do|if|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while|var|null)\b/
      , t = /\b[A-Z](?:\w*[a-z]\w*)?\b/;
    a.languages.java = a.languages.extend("clike", {
        "class-name": [t, /\b[A-Z]\w*(?=\s+\w+\s*[;,=())])/],
        keyword: e,
        "function": [a.languages.clike.function, {
            pattern: /(\:\:)[a-z_]\w*/,
            lookbehind: !0
        }],
        number: /\b0b[01][01_]*L?\b|\b0x[\da-f_]*\.?[\da-f_p+-]+\b|(?:\b\d[\d_]*\.?[\d_]*|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
        operator: {
            pattern: /(^|[^.])(?:<<=?|>>>?=?|->|([-+&|])\2|[?:~]|[-+*\/%&|^!=<>]=?)/m,
            lookbehind: !0
        }
    }),
    a.languages.insertBefore("java", "class-name", {
        annotation: {
            alias: "punctuation",
            pattern: /(^|[^.])@\w+/,
            lookbehind: !0
        },
        namespace: {
            pattern: /\b(package\s+|import\s+(?:static\s+)?)[a-z]\w*(\.[a-z]\w*)+/,
            lookbehind: !0,
            inside: {
                punctuation: /\./
            }
        },
        generics: {
            pattern: /<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<[\w\s,.&?]*>)*>)*>)*>/,
            inside: {
                "class-name": t,
                keyword: e,
                punctuation: /[<>(),.:]/,
                operator: /[?&|]/
            }
        }
    })
}(Prism);
Prism.languages.json = {
    comment: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
    property: {
        pattern: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
        greedy: !0
    },
    string: {
        pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
        greedy: !0
    },
    number: /-?\d+\.?\d*(e[+-]?\d+)?/i,
    punctuation: /[{}[\],]/,
    operator: /:/,
    "boolean": /\b(?:true|false)\b/,
    "null": /\bnull\b/
},
Prism.languages.jsonp = Prism.languages.json;
!function(e) {
    e.languages.kotlin = e.languages.extend("clike", {
        keyword: {
            pattern: /(^|[^.])\b(?:abstract|actual|annotation|as|break|by|catch|class|companion|const|constructor|continue|crossinline|data|do|dynamic|else|enum|expect|external|final|finally|for|fun|get|if|import|in|infix|init|inline|inner|interface|internal|is|lateinit|noinline|null|object|open|operator|out|override|package|private|protected|public|reified|return|sealed|set|super|suspend|tailrec|this|throw|to|try|typealias|val|var|vararg|when|where|while)\b/,
            lookbehind: !0
        },
        "function": [/\w+(?=\s*\()/, {
            pattern: /(\.)\w+(?=\s*\{)/,
            lookbehind: !0
        }],
        number: /\b(?:0[xX][\da-fA-F]+(?:_[\da-fA-F]+)*|0[bB][01]+(?:_[01]+)*|\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?[fFL]?)\b/,
        operator: /\+[+=]?|-[-=>]?|==?=?|!(?:!|==?)?|[\/*%<>]=?|[?:]:?|\.\.|&&|\|\||\b(?:and|inv|or|shl|shr|ushr|xor)\b/
    }),
    delete e.languages.kotlin["class-name"],
    e.languages.insertBefore("kotlin", "string", {
        "raw-string": {
            pattern: /("""|''')[\s\S]*?\1/,
            alias: "string"
        }
    }),
    e.languages.insertBefore("kotlin", "keyword", {
        annotation: {
            pattern: /\B@(?:\w+:)?(?:[A-Z]\w*|\[[^\]]+\])/,
            alias: "builtin"
        }
    }),
    e.languages.insertBefore("kotlin", "function", {
        label: {
            pattern: /\w+@|@\w+/,
            alias: "symbol"
        }
    });
    var n = [{
        pattern: /\$\{[^}]+\}/,
        inside: {
            delimiter: {
                pattern: /^\$\{|\}$/,
                alias: "variable"
            },
            rest: e.languages.kotlin
        }
    }, {
        pattern: /\$\w+/,
        alias: "variable"
    }];
    e.languages.kotlin.string.inside = e.languages.kotlin["raw-string"].inside = {
        interpolation: n
    }
}(Prism);
Prism.languages.markdown = Prism.languages.extend("markup", {}),
Prism.languages.insertBefore("markdown", "prolog", {
    blockquote: {
        pattern: /^>(?:[\t ]*>)*/m,
        alias: "punctuation"
    },
    code: [{
        pattern: /^(?: {4}|\t).+/m,
        alias: "keyword"
    }, {
        pattern: /``.+?``|`[^`\n]+`/,
        alias: "keyword"
    }, {
        pattern: /^```[\s\S]*?^```$/m,
        greedy: !0,
        inside: {
            "code-block": {
                pattern: /^(```.*(?:\r?\n|\r))[\s\S]+?(?=(?:\r?\n|\r)^```$)/m,
                lookbehind: !0
            },
            "code-language": {
                pattern: /^(```).+/,
                lookbehind: !0
            },
            punctuation: /```/
        }
    }],
    title: [{
        pattern: /\S.*(?:\r?\n|\r)(?:==+|--+)/,
        alias: "important",
        inside: {
            punctuation: /==+$|--+$/
        }
    }, {
        pattern: /(^\s*)#+.+/m,
        lookbehind: !0,
        alias: "important",
        inside: {
            punctuation: /^#+|#+$/
        }
    }],
    hr: {
        pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
        lookbehind: !0,
        alias: "punctuation"
    },
    list: {
        pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
        lookbehind: !0,
        alias: "punctuation"
    },
    "url-reference": {
        pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
        inside: {
            variable: {
                pattern: /^(!?\[)[^\]]+/,
                lookbehind: !0
            },
            string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
            punctuation: /^[\[\]!:]|[<>]/
        },
        alias: "url"
    },
    bold: {
        pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
        lookbehind: !0,
        greedy: !0,
        inside: {
            punctuation: /^\*\*|^__|\*\*$|__$/
        }
    },
    italic: {
        pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
        lookbehind: !0,
        greedy: !0,
        inside: {
            punctuation: /^[*_]|[*_]$/
        }
    },
    strike: {
        pattern: /(^|[^\\])(~~?)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
        lookbehind: !0,
        greedy: !0,
        inside: {
            punctuation: /^~~?|~~?$/
        }
    },
    url: {
        pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
        inside: {
            variable: {
                pattern: /(!?\[)[^\]]+(?=\]$)/,
                lookbehind: !0
            },
            string: {
                pattern: /"(?:\\.|[^"\\])*"(?=\)$)/
            }
        }
    }
}),
Prism.languages.markdown.bold.inside.url = Prism.languages.markdown.url,
Prism.languages.markdown.italic.inside.url = Prism.languages.markdown.url,
Prism.languages.markdown.strike.inside.url = Prism.languages.markdown.url,
Prism.languages.markdown.bold.inside.italic = Prism.languages.markdown.italic,
Prism.languages.markdown.bold.inside.strike = Prism.languages.markdown.strike,
Prism.languages.markdown.italic.inside.bold = Prism.languages.markdown.bold,
Prism.languages.markdown.italic.inside.strike = Prism.languages.markdown.strike,
Prism.languages.markdown.strike.inside.bold = Prism.languages.markdown.bold,
Prism.languages.markdown.strike.inside.italic = Prism.languages.markdown.italic,
Prism.hooks.add("after-tokenize", function(a) {
    function n(a) {
        if (a && "string" != typeof a)
            for (var e = 0, i = a.length; i > e; e++) {
                var r = a[e];
                if ("code" === r.type) {
                    var t = r.content[1]
                      , s = r.content[3];
                    if (t && s && "code-language" === t.type && "code-block" === s.type && "string" == typeof t.content) {
                        var o = "language-" + t.content.trim().split(/\s+/)[0].toLowerCase();
                        s.alias ? "string" == typeof s.alias ? s.alias = [s.alias, o] : s.alias.push(o) : s.alias = [o]
                    }
                } else
                    n(r.content)
            }
    }
    "markdown" === a.language && n(a.tokens)
}),
Prism.hooks.add("wrap", function(a) {
    if ("code-block" === a.type) {
        for (var n = "", e = 0, i = a.classes.length; i > e; e++) {
            var r = a.classes[e]
              , t = /language-(\w+)/.exec(r);
            if (t) {
                n = t[1];
                break
            }
        }
        var s = Prism.languages[n];
        if (s) {
            var o = a.content.replace(/&lt;/g, "<").replace(/&amp;/g, "&");
            a.content = Prism.highlight(o, s, n)
        }
    }
}),
Prism.languages.md = Prism.languages.markdown;
Prism.languages.lua = {
    comment: /^#!.+|--(?:\[(=*)\[[\s\S]*?\]\1\]|.*)/m,
    string: {
        pattern: /(["'])(?:(?!\1)[^\\\r\n]|\\z(?:\r\n|\s)|\\(?:\r\n|[\s\S]))*\1|\[(=*)\[[\s\S]*?\]\2\]/,
        greedy: !0
    },
    number: /\b0x[a-f\d]+\.?[a-f\d]*(?:p[+-]?\d+)?\b|\b\d+(?:\.\B|\.?\d*(?:e[+-]?\d+)?\b)|\B\.\d+(?:e[+-]?\d+)?\b/i,
    keyword: /\b(?:and|break|do|else|elseif|end|false|for|function|goto|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/,
    "function": /(?!\d)\w+(?=\s*(?:[({]))/,
    operator: [/[-+*%^&|#]|\/\/?|<[<=]?|>[>=]?|[=~]=?/, {
        pattern: /(^|[^.])\.\.(?!\.)/,
        lookbehind: !0
    }],
    punctuation: /[\[\](){},;]|\.+|:+/
};
Prism.languages.objectivec = Prism.languages.extend("c", {
    keyword: /\b(?:asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|in|self|super)\b|(?:@interface|@end|@implementation|@protocol|@class|@public|@protected|@private|@property|@try|@catch|@finally|@throw|@synthesize|@dynamic|@selector)\b/,
    string: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|@"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
    operator: /-[->]?|\+\+?|!=?|<<?=?|>>?=?|==?|&&?|\|\|?|[~^%?*\/@]/
});
!function(e) {
    e.languages.php = e.languages.extend("clike", {
        keyword: /\b(?:and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/i,
        constant: /\b[A-Z0-9_]{2,}\b/,
        comment: {
            pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
            lookbehind: !0
        }
    }),
    e.languages.insertBefore("php", "string", {
        "shell-comment": {
            pattern: /(^|[^\\])#.*/,
            lookbehind: !0,
            alias: "comment"
        }
    }),
    e.languages.insertBefore("php", "keyword", {
        delimiter: {
            pattern: /\?>|<\?(?:php|=)?/i,
            alias: "important"
        },
        variable: /\$+(?:\w+\b|(?={))/i,
        "package": {
            pattern: /(\\|namespace\s+|use\s+)[\w\\]+/,
            lookbehind: !0,
            inside: {
                punctuation: /\\/
            }
        }
    }),
    e.languages.insertBefore("php", "operator", {
        property: {
            pattern: /(->)[\w]+/,
            lookbehind: !0
        }
    });
    var n = {
        pattern: /{\$(?:{(?:{[^{}]+}|[^{}]+)}|[^{}])+}|(^|[^\\{])\$+(?:\w+(?:\[.+?]|->\w+)*)/,
        lookbehind: !0,
        inside: {
            rest: e.languages.php
        }
    };
    e.languages.insertBefore("php", "string", {
        "nowdoc-string": {
            pattern: /<<<'([^']+)'(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\1;/,
            greedy: !0,
            alias: "string",
            inside: {
                delimiter: {
                    pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
                    alias: "symbol",
                    inside: {
                        punctuation: /^<<<'?|[';]$/
                    }
                }
            }
        },
        "heredoc-string": {
            pattern: /<<<(?:"([^"]+)"(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\1;|([a-z_]\w*)(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\2;)/i,
            greedy: !0,
            alias: "string",
            inside: {
                delimiter: {
                    pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
                    alias: "symbol",
                    inside: {
                        punctuation: /^<<<"?|[";]$/
                    }
                },
                interpolation: n
            }
        },
        "single-quoted-string": {
            pattern: /'(?:\\[\s\S]|[^\\'])*'/,
            greedy: !0,
            alias: "string"
        },
        "double-quoted-string": {
            pattern: /"(?:\\[\s\S]|[^\\"])*"/,
            greedy: !0,
            alias: "string",
            inside: {
                interpolation: n
            }
        }
    }),
    delete e.languages.php.string,
    e.hooks.add("before-tokenize", function(n) {
        if (/(?:<\?php|<\?)/gi.test(n.code)) {
            var t = /(?:<\?php|<\?)[\s\S]*?(?:\?>|$)/gi;
            e.languages["markup-templating"].buildPlaceholders(n, "php", t)
        }
    }),
    e.hooks.add("after-tokenize", function(n) {
        e.languages["markup-templating"].tokenizePlaceholders(n, "php")
    })
}(Prism);
Prism.languages.python = {
    comment: {
        pattern: /(^|[^\\])#.*/,
        lookbehind: !0
    },
    "string-interpolation": {
        pattern: /(?:f|rf|fr)(?:("""|''')[\s\S]+?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
        greedy: !0,
        inside: {
            interpolation: {
                pattern: /((?:^|[^{])(?:{{)*){(?!{)(?:[^{}]|{(?!{)(?:[^{}]|{(?!{)(?:[^{}])+})+})+}/,
                lookbehind: !0,
                inside: {
                    "format-spec": {
                        pattern: /(:)[^:(){}]+(?=}$)/,
                        lookbehind: !0
                    },
                    "conversion-option": {
                        pattern: /![sra](?=[:}]$)/,
                        alias: "punctuation"
                    },
                    rest: null
                }
            },
            string: /[\s\S]+/
        }
    },
    "triple-quoted-string": {
        pattern: /(?:[rub]|rb|br)?("""|''')[\s\S]+?\1/i,
        greedy: !0,
        alias: "string"
    },
    string: {
        pattern: /(?:[rub]|rb|br)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
        greedy: !0
    },
    "function": {
        pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
        lookbehind: !0
    },
    "class-name": {
        pattern: /(\bclass\s+)\w+/i,
        lookbehind: !0
    },
    decorator: {
        pattern: /(^\s*)@\w+(?:\.\w+)*/i,
        lookbehind: !0,
        alias: ["annotation", "punctuation"],
        inside: {
            punctuation: /\./
        }
    },
    keyword: /\b(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
    builtin: /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
    "boolean": /\b(?:True|False|None)\b/,
    number: /(?:\b(?=\d)|\B(?=\.))(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i,
    operator: /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
    punctuation: /[{}[\];(),.:]/
},
Prism.languages.python["string-interpolation"].inside.interpolation.inside.rest = Prism.languages.python,
Prism.languages.py = Prism.languages.python;
Prism.languages.r = {
    comment: /#.*/,
    string: {
        pattern: /(['"])(?:\\.|(?!\1)[^\\\r\n])*\1/,
        greedy: !0
    },
    "percent-operator": {
        pattern: /%[^%\s]*%/,
        alias: "operator"
    },
    "boolean": /\b(?:TRUE|FALSE)\b/,
    ellipsis: /\.\.(?:\.|\d+)/,
    number: [/\b(?:NaN|Inf)\b/, /(?:\b0x[\dA-Fa-f]+(?:\.\d*)?|\b\d+\.?\d*|\B\.\d+)(?:[EePp][+-]?\d+)?[iL]?/],
    keyword: /\b(?:if|else|repeat|while|function|for|in|next|break|NULL|NA|NA_integer_|NA_real_|NA_complex_|NA_character_)\b/,
    operator: /->?>?|<(?:=|<?-)?|[>=!]=?|::?|&&?|\|\|?|[+*\/^$@~]/,
    punctuation: /[(){}\[\],;]/
};
Prism.languages.yaml = {
    scalar: {
        pattern: /([\-:]\s*(?:![^\s]+)?[ \t]*[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)[^\r\n]+(?:\2[^\r\n]+)*)/,
        lookbehind: !0,
        alias: "string"
    },
    comment: /#.*/,
    key: {
        pattern: /(\s*(?:^|[:\-,[{\r\n?])[ \t]*(?:![^\s]+)?[ \t]*)[^\r\n{[\]},#\s]+?(?=\s*:\s)/,
        lookbehind: !0,
        alias: "atrule"
    },
    directive: {
        pattern: /(^[ \t]*)%.+/m,
        lookbehind: !0,
        alias: "important"
    },
    datetime: {
        pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)(?:\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?)?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?)(?=[ \t]*(?:$|,|]|}))/m,
        lookbehind: !0,
        alias: "number"
    },
    "boolean": {
        pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)(?:true|false)[ \t]*(?=$|,|]|})/im,
        lookbehind: !0,
        alias: "important"
    },
    "null": {
        pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)(?:null|~)[ \t]*(?=$|,|]|})/im,
        lookbehind: !0,
        alias: "important"
    },
    string: {
        pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)("|')(?:(?!\2)[^\\\r\n]|\\.)*\2(?=[ \t]*(?:$|,|]|}|\s*#))/m,
        lookbehind: !0,
        greedy: !0
    },
    number: {
        pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+\.?\d*|\.?\d+)(?:e[+-]?\d+)?|\.inf|\.nan)[ \t]*(?=$|,|]|})/im,
        lookbehind: !0
    },
    tag: /![^\s]+/,
    important: /[&*][\w]+/,
    punctuation: /---|[:[\]{}\-,|>?]|\.\.\./
},
Prism.languages.yml = Prism.languages.yaml;
!function(e) {
    var d = "(?:[\\w-]+|'[^'\n\r]*'|\"(?:\\.|[^\\\\\"\r\n])*\")";
    e.languages.toml = {
        comment: {
            pattern: /#.*/,
            greedy: !0
        },
        table: {
            pattern: RegExp("(\\[\\s*)" + d + "(?:\\s*\\.\\s*" + d + ")*(?=\\s*\\])"),
            lookbehind: !0,
            greedy: !0,
            alias: "class-name"
        },
        key: {
            pattern: RegExp("(^\\s*|[{,]\\s*)" + d + "(?:\\s*\\.\\s*" + d + ")*(?=\\s*=)", "m"),
            lookbehind: !0,
            greedy: !0,
            alias: "property"
        },
        string: {
            pattern: /"""(?:\\[\s\S]|[^\\])*?"""|'''[\s\S]*?'''|'[^'\n\r]*'|"(?:\\.|[^\\"\r\n])*"/,
            greedy: !0
        },
        date: [{
            pattern: /\d{4}-\d{2}-\d{2}(?:[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?/i,
            alias: "number"
        }, {
            pattern: /\d{2}:\d{2}:\d{2}(?:\.\d+)?/i,
            alias: "number"
        }],
        number: /(?:\b0(?:x[\da-zA-Z]+(?:_[\da-zA-Z]+)*|o[0-7]+(?:_[0-7]+)*|b[10]+(?:_[10]+)*))\b|[-+]?\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?\b|[-+]?(?:inf|nan)\b/,
        "boolean": /\b(?:true|false)\b/,
        punctuation: /[.,=[\]{}]/
    }
}(Prism);
!function() {
    if ("undefined" != typeof self && self.Prism && self.document) {
        var e = "line-numbers"
          , t = /\n(?!$)/g
          , n = function(e) {
            var n = r(e)
              , s = n["white-space"];
            if ("pre-wrap" === s || "pre-line" === s) {
                var l = e.querySelector("code")
                  , i = e.querySelector(".line-numbers-rows")
                  , a = e.querySelector(".line-numbers-sizer")
                  , o = l.textContent.split(t);
                a || (a = document.createElement("span"),
                a.className = "line-numbers-sizer",
                l.appendChild(a)),
                a.style.display = "block",
                o.forEach(function(e, t) {
                    a.textContent = e || "\n";
                    var n = a.getBoundingClientRect().height;
                    i.children[t].style.height = n + "px"
                }),
                a.textContent = "",
                a.style.display = "none"
            }
        }
          , r = function(e) {
            return e ? window.getComputedStyle ? getComputedStyle(e) : e.currentStyle || null : null
        };
        window.addEventListener("resize", function() {
            Array.prototype.forEach.call(document.querySelectorAll("pre." + e), n)
        }),
        Prism.hooks.add("complete", function(e) {
            if (e.code) {
                var r = e.element.parentNode
                  , s = /\s*\bline-numbers\b\s*/;
                if (r && /pre/i.test(r.nodeName) && (s.test(r.className) || s.test(e.element.className)) && !e.element.querySelector(".line-numbers-rows")) {
                    s.test(e.element.className) && (e.element.className = e.element.className.replace(s, " ")),
                    s.test(r.className) || (r.className += " line-numbers");
                    var l, i = e.code.match(t), a = i ? i.length + 1 : 1, o = new Array(a + 1);
                    o = o.join("<span></span>"),
                    l = document.createElement("span"),
                    l.setAttribute("aria-hidden", "true"),
                    l.className = "line-numbers-rows",
                    l.innerHTML = o,
                    r.hasAttribute("data-start") && (r.style.counterReset = "linenumber " + (parseInt(r.getAttribute("data-start"), 10) - 1)),
                    e.element.appendChild(l),
                    n(r),
                    Prism.hooks.run("line-numbers", e)
                }
            }
        }),
        Prism.hooks.add("line-numbers", function(e) {
            e.plugins = e.plugins || {},
            e.plugins.lineNumbers = !0
        }),
        Prism.plugins.lineNumbers = {
            getLine: function(t, n) {
                if ("PRE" === t.tagName && t.classList.contains(e)) {
                    var r = t.querySelector(".line-numbers-rows")
                      , s = parseInt(t.getAttribute("data-start"), 10) || 1
                      , l = s + (r.children.length - 1);
                    s > n && (n = s),
                    n > l && (n = l);
                    var i = n - s;
                    return r.children[i]
                }
            }
        }
    }
}();
!function() {
    "undefined" != typeof self && !self.Prism || "undefined" != typeof global && !global.Prism || Prism.hooks.add("wrap", function(e) {
        "keyword" === e.type && e.classes.push("keyword-" + e.content)
    })
}();
