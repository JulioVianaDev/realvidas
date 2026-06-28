/* @ds-bundle: {"format":3,"namespace":"RealVidasDesignSystem_066fed","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"ThemeToggle","sourcePath":"components/actions/ThemeToggle.jsx"},{"name":"EmergencyCTA","sourcePath":"components/brand/EmergencyCTA.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"PlanCard","sourcePath":"components/brand/PlanCard.jsx"},{"name":"ServiceCard","sourcePath":"components/brand/ServiceCard.jsx"},{"name":"LOGO_SRC","sourcePath":"components/brand/logoImage.js"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Stat","sourcePath":"components/display/Stat.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"Spinner","sourcePath":"components/feedback/Spinner.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Icon","sourcePath":"components/icon/Icon.jsx"},{"name":"Breadcrumb","sourcePath":"components/navigation/Breadcrumb.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"585210bfd875","components/actions/IconButton.jsx":"5424f23825af","components/actions/ThemeToggle.jsx":"34a9e92a8b69","components/brand/EmergencyCTA.jsx":"d6e31b43def5","components/brand/Logo.jsx":"331b91c7ee76","components/brand/PlanCard.jsx":"77c7396919ec","components/brand/ServiceCard.jsx":"c08f33955cbf","components/brand/logoImage.js":"3be8124acf02","components/display/Avatar.jsx":"74af682043ee","components/display/Badge.jsx":"03a247395ef2","components/display/Card.jsx":"8facdf0f6be4","components/display/Stat.jsx":"7c140cd63c5a","components/display/Tag.jsx":"a41e3415677b","components/feedback/Alert.jsx":"87e68e651ac9","components/feedback/ProgressBar.jsx":"be9b05e4b2c5","components/feedback/Spinner.jsx":"7e0bf96b44bd","components/forms/Checkbox.jsx":"1d7deffc4fa9","components/forms/Field.jsx":"0a21c62242e2","components/forms/Input.jsx":"fc55a28176ff","components/forms/Select.jsx":"fdc5d75f2d5c","components/forms/Switch.jsx":"0f5f7b028fa8","components/forms/Textarea.jsx":"951b11e97dcd","components/icon/Icon.jsx":"0225c33b60d5","components/navigation/Breadcrumb.jsx":"eca2c229fddd","components/navigation/Tabs.jsx":"d72068094d95","ui_kits/website/AboutSection.jsx":"5ba9a6fbbdca","ui_kits/website/FloatingActions.jsx":"78b2ff30e7af","ui_kits/website/Footer.jsx":"506f727faf27","ui_kits/website/Hero.jsx":"f462a74a5d48","ui_kits/website/PlansSection.jsx":"a5803a6ad447","ui_kits/website/QuoteForm.jsx":"7ed9bc821dda","ui_kits/website/ServicesSection.jsx":"eacb9861ec23","ui_kits/website/SiteHeader.jsx":"1b65fc6664c2"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {
    const __ds_ns = (window.RealVidasDesignSystem_066fed =
        window.RealVidasDesignSystem_066fed || {});

    const __ds_scope = {};

    __ds_ns.__errors = __ds_ns.__errors || [];

    // components/actions/Button.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Real Vidas Button.
   variant: primary | secondary | accent | outline | ghost | danger | whatsapp
   size: sm | md | lg  ·  optional leftIcon / rightIcon (ReactNode)
   Renders an <a> when `href` is set, otherwise a <button>. */

            const SIZES = {
                sm: {
                    height: "var(--control-sm)",
                    padding: "0 var(--space-4)",
                    font: "var(--text-sm)",
                    gap: "var(--space-2)",
                    radius: "var(--radius-sm)",
                },
                md: {
                    height: "var(--control-md)",
                    padding: "0 var(--space-5)",
                    font: "var(--text-base)",
                    gap: "var(--space-2)",
                    radius: "var(--radius-md)",
                },
                lg: {
                    height: "var(--control-lg)",
                    padding: "0 var(--space-8)",
                    font: "var(--text-md)",
                    gap: "var(--space-3)",
                    radius: "var(--radius-md)",
                },
            };
            const VARIANTS = {
                primary: {
                    bg: "var(--brand)",
                    color: "var(--on-brand)",
                    border: "transparent",
                    shadow: "var(--shadow-sm)",
                    hoverBg: "var(--brand-hover)",
                },
                secondary: {
                    bg: "var(--secondary)",
                    color: "var(--on-secondary)",
                    border: "transparent",
                    shadow: "var(--shadow-sm)",
                    hoverBg: "var(--secondary-hover)",
                },
                accent: {
                    bg: "var(--accent)",
                    color: "var(--on-accent)",
                    border: "transparent",
                    shadow: "var(--shadow-sm)",
                    hoverBg: "var(--accent-hover)",
                },
                danger: {
                    bg: "var(--danger)",
                    color: "#fff",
                    border: "transparent",
                    shadow: "var(--shadow-sm)",
                    hoverBg: "var(--brand-active)",
                },
                outline: {
                    bg: "transparent",
                    color: "var(--text-strong)",
                    border: "var(--border-strong)",
                    shadow: "none",
                    hoverBg: "var(--surface-hover)",
                },
                ghost: {
                    bg: "transparent",
                    color: "var(--text-body)",
                    border: "transparent",
                    shadow: "none",
                    hoverBg: "var(--surface-hover)",
                },
                whatsapp: {
                    bg: "#25D366",
                    color: "#04301a",
                    border: "transparent",
                    shadow: "var(--shadow-sm)",
                    hoverBg: "#1ebe5a",
                },
            };
            function Button({
                children,
                variant = "primary",
                size = "md",
                leftIcon,
                rightIcon,
                fullWidth = false,
                disabled = false,
                loading = false,
                href,
                type = "button",
                style,
                onMouseEnter,
                onMouseLeave,
                ...rest
            }) {
                const [hover, setHover] = React.useState(false);
                const s = SIZES[size] || SIZES.md;
                const v = VARIANTS[variant] || VARIANTS.primary;
                const isDisabled = disabled || loading;
                const css = {
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: s.gap,
                    height: s.height,
                    padding: s.padding,
                    width: fullWidth ? "100%" : "auto",
                    fontFamily: "var(--font-display)",
                    fontWeight: "var(--fw-semibold)",
                    fontSize: s.font,
                    lineHeight: 1,
                    letterSpacing: "0.01em",
                    color: v.color,
                    background:
                        hover && !isDisabled ? v.hoverBg : v.bg,
                    border: `var(--border-w) solid ${v.border}`,
                    borderRadius: s.radius,
                    boxShadow:
                        variant === "outline" || variant === "ghost"
                            ? "none"
                            : v.shadow,
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    opacity: isDisabled ? 0.55 : 1,
                    transform:
                        hover && !isDisabled
                            ? "translateY(-1px)"
                            : "translateY(0)",
                    transition:
                        "background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    userSelect: "none",
                    ...style,
                };
                const enter = (e) => {
                    setHover(true);
                    onMouseEnter && onMouseEnter(e);
                };
                const leave = (e) => {
                    setHover(false);
                    onMouseLeave && onMouseLeave(e);
                };
                const inner = /*#__PURE__*/ React.createElement(
                    React.Fragment,
                    null,
                    loading &&
                        /*#__PURE__*/ React.createElement(
                            Spinner,
                            null,
                        ),
                    !loading && leftIcon,
                    children &&
                        /*#__PURE__*/ React.createElement(
                            "span",
                            null,
                            children,
                        ),
                    !loading && rightIcon,
                );
                if (href && !isDisabled) {
                    return /*#__PURE__*/ React.createElement(
                        "a",
                        _extends(
                            {
                                href: href,
                                style: css,
                                onMouseEnter: enter,
                                onMouseLeave: leave,
                            },
                            rest,
                        ),
                        inner,
                    );
                }
                return /*#__PURE__*/ React.createElement(
                    "button",
                    _extends(
                        {
                            type: type,
                            disabled: isDisabled,
                            style: css,
                            onMouseEnter: enter,
                            onMouseLeave: leave,
                        },
                        rest,
                    ),
                    inner,
                );
            }
            function Spinner() {
                return /*#__PURE__*/ React.createElement("span", {
                    style: {
                        width: "1em",
                        height: "1em",
                        borderRadius: "50%",
                        border: "2px solid color-mix(in srgb, currentColor 35%, transparent)",
                        borderTopColor: "currentColor",
                        display: "inline-block",
                        animation: "rv-spin 0.7s linear infinite",
                    },
                });
            }
            Object.assign(__ds_scope, { Button });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/actions/Button.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/actions/IconButton.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Square icon-only button. Same variants as Button, plus a `round` flag
   for the floating WhatsApp / call bubbles Real Vidas uses. */

            const SIZES = {
                sm: 34,
                md: 42,
                lg: 52,
            };
            const VARIANTS = {
                primary: {
                    bg: "var(--brand)",
                    color: "var(--on-brand)",
                    border: "transparent",
                    hoverBg: "var(--brand-hover)",
                },
                secondary: {
                    bg: "var(--secondary)",
                    color: "var(--on-secondary)",
                    border: "transparent",
                    hoverBg: "var(--secondary-hover)",
                },
                accent: {
                    bg: "var(--accent)",
                    color: "var(--on-accent)",
                    border: "transparent",
                    hoverBg: "var(--accent-hover)",
                },
                whatsapp: {
                    bg: "#25D366",
                    color: "#04301a",
                    border: "transparent",
                    hoverBg: "#1ebe5a",
                },
                outline: {
                    bg: "transparent",
                    color: "var(--text-strong)",
                    border: "var(--border-strong)",
                    hoverBg: "var(--surface-hover)",
                },
                ghost: {
                    bg: "transparent",
                    color: "var(--text-muted)",
                    border: "transparent",
                    hoverBg: "var(--surface-hover)",
                },
                soft: {
                    bg: "var(--brand-soft)",
                    color: "var(--brand)",
                    border: "transparent",
                    hoverBg: "var(--brand-soft-2)",
                },
            };
            function IconButton({
                icon,
                label,
                variant = "ghost",
                size = "md",
                round = false,
                disabled = false,
                style,
                ...rest
            }) {
                const [hover, setHover] = React.useState(false);
                const dim = SIZES[size] || SIZES.md;
                const v = VARIANTS[variant] || VARIANTS.ghost;
                const css = {
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: dim,
                    height: dim,
                    padding: 0,
                    color: v.color,
                    background: hover && !disabled ? v.hoverBg : v.bg,
                    border: `var(--border-w) solid ${v.border}`,
                    borderRadius: round
                        ? "var(--radius-pill)"
                        : "var(--radius-md)",
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.55 : 1,
                    boxShadow:
                        variant === "whatsapp" ||
                        variant === "primary"
                            ? "var(--shadow-sm)"
                            : "none",
                    transition:
                        "background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)",
                    transform:
                        hover && !disabled
                            ? "translateY(-1px)"
                            : "none",
                    ...style,
                };
                return /*#__PURE__*/ React.createElement(
                    "button",
                    _extends(
                        {
                            type: "button",
                            "aria-label": label,
                            title: label,
                            disabled: disabled,
                            style: css,
                            onMouseEnter: () => setHover(true),
                            onMouseLeave: () => setHover(false),
                        },
                        rest,
                    ),
                    icon,
                );
            }
            Object.assign(__ds_scope, { IconButton });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/actions/IconButton.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/brand/PlanCard.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Membership plan card (Plano Ouro / Prata / Bronze / Personalizado).
   tier sets the metal accent. `featured` raises it with a brand ring. */

            const TIERS = {
                ouro: {
                    color: "var(--tier-ouro)",
                    label: "Ouro",
                },
                prata: {
                    color: "var(--tier-prata)",
                    label: "Prata",
                },
                bronze: {
                    color: "var(--tier-bronze)",
                    label: "Bronze",
                },
                custom: {
                    color: "var(--secondary)",
                    label: "Personalizado",
                },
            };
            function PlanCard({
                tier = "ouro",
                name,
                coverage,
                price,
                features = [],
                featured = false,
                cta = "Conheça em detalhes",
                onSelect,
                href,
                style,
                ...rest
            }) {
                const [hover, setHover] = React.useState(false);
                const t = TIERS[tier] || TIERS.custom;
                return /*#__PURE__*/ React.createElement(
                    "div",
                    _extends(
                        {
                            onMouseEnter: () => setHover(true),
                            onMouseLeave: () => setHover(false),
                            style: {
                                position: "relative",
                                display: "flex",
                                flexDirection: "column",
                                background: "var(--surface)",
                                borderRadius: "var(--radius-xl)",
                                border: `var(--border-w) solid ${featured ? "var(--brand-border)" : "var(--border)"}`,
                                boxShadow: featured
                                    ? "var(--shadow-lg)"
                                    : hover
                                      ? "var(--shadow-md)"
                                      : "var(--shadow-sm)",
                                overflow: "hidden",
                                transform: hover
                                    ? "translateY(-4px)"
                                    : "none",
                                transition:
                                    "transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
                                ...style,
                            },
                        },
                        rest,
                    ),
                    /*#__PURE__*/ React.createElement("div", {
                        style: {
                            height: 6,
                            background: `linear-gradient(90deg, ${t.color}, color-mix(in srgb, ${t.color} 55%, #000))`,
                        },
                    }),
                    /*#__PURE__*/ React.createElement(
                        "div",
                        {
                            style: {
                                padding: "var(--space-6)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--space-4)",
                                flex: 1,
                            },
                        },
                        /*#__PURE__*/ React.createElement(
                            "div",
                            {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                },
                            },
                            /*#__PURE__*/ React.createElement(
                                "span",
                                {
                                    style: {
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "var(--space-2)",
                                        fontFamily:
                                            "var(--font-display)",
                                        fontWeight: "var(--fw-bold)",
                                        fontSize: "var(--text-xs)",
                                        letterSpacing: "0.12em",
                                        textTransform: "uppercase",
                                        color: t.color,
                                    },
                                },
                                /*#__PURE__*/ React.createElement(
                                    "span",
                                    {
                                        style: {
                                            width: 9,
                                            height: 9,
                                            borderRadius: "50%",
                                            background: t.color,
                                        },
                                    },
                                ),
                                "Plano ",
                                t.label,
                            ),
                            featured &&
                                /*#__PURE__*/ React.createElement(
                                    "span",
                                    {
                                        style: {
                                            background:
                                                "var(--brand)",
                                            color: "var(--on-brand)",
                                            borderRadius:
                                                "var(--radius-pill)",
                                            padding:
                                                "2px var(--space-3)",
                                            fontFamily:
                                                "var(--font-display)",
                                            fontSize:
                                                "var(--text-2xs)",
                                            fontWeight:
                                                "var(--fw-bold)",
                                            letterSpacing: "0.08em",
                                            textTransform:
                                                "uppercase",
                                        },
                                    },
                                    "Mais escolhido",
                                ),
                        ),
                        /*#__PURE__*/ React.createElement(
                            "div",
                            null,
                            /*#__PURE__*/ React.createElement(
                                "h3",
                                {
                                    style: {
                                        fontFamily:
                                            "var(--font-display)",
                                        fontWeight:
                                            "var(--fw-extrabold)",
                                        fontSize: "var(--text-xl)",
                                        color: "var(--text-strong)",
                                        margin: 0,
                                    },
                                },
                                name,
                            ),
                            coverage &&
                                /*#__PURE__*/ React.createElement(
                                    "p",
                                    {
                                        style: {
                                            fontFamily:
                                                "var(--font-body)",
                                            fontSize:
                                                "var(--text-sm)",
                                            color: "var(--text-muted)",
                                            margin: "4px 0 0",
                                        },
                                    },
                                    coverage,
                                ),
                        ),
                        price &&
                            /*#__PURE__*/ React.createElement(
                                "div",
                                {
                                    style: {
                                        display: "flex",
                                        alignItems: "baseline",
                                        gap: 4,
                                    },
                                },
                                /*#__PURE__*/ React.createElement(
                                    "span",
                                    {
                                        style: {
                                            fontFamily:
                                                "var(--font-display)",
                                            fontWeight:
                                                "var(--fw-extrabold)",
                                            fontSize:
                                                "var(--text-2xl)",
                                            color: "var(--text-strong)",
                                        },
                                    },
                                    price,
                                ),
                            ),
                        /*#__PURE__*/ React.createElement(
                            "ul",
                            {
                                style: {
                                    listStyle: "none",
                                    margin: 0,
                                    padding: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "var(--space-2)",
                                    flex: 1,
                                },
                            },
                            features.map((f, i) =>
                                /*#__PURE__*/ React.createElement(
                                    "li",
                                    {
                                        key: i,
                                        style: {
                                            display: "flex",
                                            gap: "var(--space-2)",
                                            alignItems: "flex-start",
                                            fontFamily:
                                                "var(--font-body)",
                                            fontSize:
                                                "var(--text-sm)",
                                            color: "var(--text-body)",
                                        },
                                    },
                                    /*#__PURE__*/ React.createElement(
                                        "svg",
                                        {
                                            width: "18",
                                            height: "18",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "var(--accent)",
                                            strokeWidth: "2.6",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            style: {
                                                flexShrink: 0,
                                                marginTop: 1,
                                            },
                                        },
                                        /*#__PURE__*/ React.createElement(
                                            "path",
                                            {
                                                d: "M20 6 9 17l-5-5",
                                            },
                                        ),
                                    ),
                                    /*#__PURE__*/ React.createElement(
                                        "span",
                                        null,
                                        f,
                                    ),
                                ),
                            ),
                        ),
                        /*#__PURE__*/ React.createElement(
                            "a",
                            {
                                href: href,
                                onClick: onSelect,
                                style: {
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "var(--space-2)",
                                    height: "var(--control-md)",
                                    borderRadius: "var(--radius-md)",
                                    textDecoration: "none",
                                    background: featured
                                        ? "var(--brand)"
                                        : "transparent",
                                    color: featured
                                        ? "var(--on-brand)"
                                        : "var(--text-strong)",
                                    border: featured
                                        ? "none"
                                        : "var(--border-w) solid var(--border-strong)",
                                    fontFamily: "var(--font-display)",
                                    fontWeight: "var(--fw-semibold)",
                                    fontSize: "var(--text-sm)",
                                    boxShadow: featured
                                        ? "var(--shadow-sm)"
                                        : "none",
                                    cursor: "pointer",
                                },
                            },
                            cta,
                        ),
                    ),
                );
            }
            Object.assign(__ds_scope, { PlanCard });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/brand/PlanCard.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/brand/logoImage.js
    try {
        (() => {
            // Real Vidas full-lockup logo (orange + blue), embedded as a data URI
            // so it resolves from the bundle at any path. Source: uploads/logo.webp
            const LOGO_SRC =
                "data:image/webp;base64,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";
            Object.assign(__ds_scope, { LOGO_SRC });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/brand/logoImage.js",
            error: String((e && e.message) || e),
        });
    }

    // components/brand/Logo.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Real Vidas logo.
   variant: "full" | "wordmark" (the real lockup image) | "mark" (cropped mark)
   tone: "color" (real logo) | "mono" (white typographic — for dark/brand surfaces)
   `size` = lockup height in px. */

            const ASPECT = 700 / 181; // full image
            const MARK_W = 150 / 181; // mark occupies the left ~150px of the 181-tall art

            function Logo({
                variant = "full",
                tone = "color",
                size = 40,
                showTagline = true,
                style,
                ...rest
            }) {
                const mono = tone === "mono";
                const h = Math.round(size * 1.15);

                /* White typographic lockup for dark/brand backgrounds (no white asset exists). */
                if (mono) {
                    return /*#__PURE__*/ React.createElement(
                        "span",
                        _extends(
                            {
                                style: {
                                    display: "inline-flex",
                                    flexDirection: "column",
                                    lineHeight: 1,
                                    color: "#fff",
                                    ...style,
                                },
                            },
                            rest,
                        ),
                        /*#__PURE__*/ React.createElement(
                            "span",
                            {
                                style: {
                                    fontFamily: "var(--font-display)",
                                    fontWeight: "var(--fw-extrabold)",
                                    fontSize: size * 0.62,
                                    letterSpacing: "-0.01em",
                                    textTransform: "uppercase",
                                },
                            },
                            "Real Vidas",
                        ),
                        showTagline &&
                            variant !== "mark" &&
                            /*#__PURE__*/ React.createElement(
                                "span",
                                {
                                    style: {
                                        fontFamily:
                                            "var(--font-body)",
                                        fontSize: size * 0.21,
                                        fontWeight:
                                            "var(--fw-semibold)",
                                        letterSpacing: "0.18em",
                                        textTransform: "uppercase",
                                        marginTop: size * 0.12,
                                        opacity: 0.82,
                                    },
                                },
                                "Remo\xE7\xF5es e Emerg\xEAncias 24h",
                            ),
                    );
                }
                if (variant === "mark") {
                    return /*#__PURE__*/ React.createElement(
                        "span",
                        _extends(
                            {
                                style: {
                                    display: "inline-block",
                                    width: Math.round(h * MARK_W),
                                    height: h,
                                    overflow: "hidden",
                                    ...style,
                                },
                            },
                            rest,
                        ),
                        /*#__PURE__*/ React.createElement("img", {
                            src: __ds_scope.LOGO_SRC,
                            alt: "Real Vidas",
                            style: {
                                height: h,
                                width: h * ASPECT,
                                maxWidth: "none",
                                objectFit: "cover",
                                objectPosition: "left center",
                                display: "block",
                            },
                        }),
                    );
                }
                return /*#__PURE__*/ React.createElement(
                    "img",
                    _extends(
                        {
                            src: __ds_scope.LOGO_SRC,
                            alt: "Real Vidas \u2014 Remo\xE7\xF5es e Emerg\xEAncias 24h",
                            style: {
                                height: h,
                                width: "auto",
                                display: "block",
                                ...style,
                            },
                        },
                        rest,
                    ),
                );
            }
            Object.assign(__ds_scope, { Logo });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/brand/Logo.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/display/Avatar.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Avatar: image, or initials fallback. Optional status ring. */

            const SIZES = {
                sm: 32,
                md: 42,
                lg: 56,
                xl: 72,
            };
            function Avatar({
                src,
                name = "",
                size = "md",
                status,
                style,
                ...rest
            }) {
                const dim =
                    SIZES[size] ||
                    (typeof size === "number" ? size : 42);
                const initials = name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase();
                const statusColor =
                    status === "online"
                        ? "var(--success)"
                        : status === "busy"
                          ? "var(--danger)"
                          : "var(--text-subtle)";
                return /*#__PURE__*/ React.createElement(
                    "span",
                    _extends(
                        {
                            style: {
                                position: "relative",
                                display: "inline-flex",
                                width: dim,
                                height: dim,
                                ...style,
                            },
                        },
                        rest,
                    ),
                    src
                        ? /*#__PURE__*/ React.createElement("img", {
                              src: src,
                              alt: name,
                              style: {
                                  width: dim,
                                  height: dim,
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  border: "var(--border-w-2) solid var(--surface)",
                                  boxShadow: "var(--shadow-xs)",
                              },
                          })
                        : /*#__PURE__*/ React.createElement(
                              "span",
                              {
                                  style: {
                                      width: dim,
                                      height: dim,
                                      borderRadius: "50%",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      background: "var(--secondary)",
                                      color: "var(--on-secondary)",
                                      fontFamily:
                                          "var(--font-display)",
                                      fontWeight: "var(--fw-bold)",
                                      fontSize: dim * 0.38,
                                      letterSpacing: "0.02em",
                                  },
                              },
                              initials || "?",
                          ),
                    status &&
                        /*#__PURE__*/ React.createElement("span", {
                            style: {
                                position: "absolute",
                                right: 0,
                                bottom: 0,
                                width: dim * 0.28,
                                height: dim * 0.28,
                                borderRadius: "50%",
                                background: statusColor,
                                border: "2px solid var(--surface)",
                            },
                        }),
                );
            }
            Object.assign(__ds_scope, { Avatar });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/display/Avatar.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/display/Badge.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Small status pill. tone: neutral | brand | success | warning | danger | info | secondary
   `dot` adds a leading status dot; `pulse` animates it (for 24h / "ao vivo"). */

            const TONES = {
                neutral: {
                    bg: "var(--bg-subtle)",
                    color: "var(--text-muted)",
                    dot: "var(--text-subtle)",
                },
                brand: {
                    bg: "var(--brand-soft)",
                    color: "var(--danger-text)",
                    dot: "var(--brand)",
                },
                secondary: {
                    bg: "var(--secondary-soft)",
                    color: "var(--info-text)",
                    dot: "var(--secondary)",
                },
                success: {
                    bg: "var(--success-soft)",
                    color: "var(--success-text)",
                    dot: "var(--success)",
                },
                warning: {
                    bg: "var(--warning-soft)",
                    color: "var(--warning-text)",
                    dot: "var(--warning)",
                },
                danger: {
                    bg: "var(--danger-soft)",
                    color: "var(--danger-text)",
                    dot: "var(--danger)",
                },
                info: {
                    bg: "var(--info-soft)",
                    color: "var(--info-text)",
                    dot: "var(--info)",
                },
                solid: {
                    bg: "var(--brand)",
                    color: "var(--on-brand)",
                    dot: "#fff",
                },
            };
            function Badge({
                tone = "neutral",
                dot = false,
                pulse = false,
                children,
                style,
                ...rest
            }) {
                const t = TONES[tone] || TONES.neutral;
                return /*#__PURE__*/ React.createElement(
                    "span",
                    _extends(
                        {
                            style: {
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "var(--space-2)",
                                padding: "3px var(--space-3)",
                                borderRadius: "var(--radius-pill)",
                                background: t.bg,
                                color: t.color,
                                fontFamily: "var(--font-display)",
                                fontSize: "var(--text-xs)",
                                fontWeight: "var(--fw-semibold)",
                                letterSpacing: "0.02em",
                                lineHeight: 1.6,
                                whiteSpace: "nowrap",
                                ...style,
                            },
                        },
                        rest,
                    ),
                    dot &&
                        /*#__PURE__*/ React.createElement(
                            "span",
                            {
                                style: {
                                    position: "relative",
                                    display: "inline-flex",
                                },
                            },
                            /*#__PURE__*/ React.createElement(
                                "span",
                                {
                                    style: {
                                        width: 7,
                                        height: 7,
                                        borderRadius: "50%",
                                        background: t.dot,
                                        display: "block",
                                    },
                                },
                            ),
                            pulse &&
                                /*#__PURE__*/ React.createElement(
                                    "span",
                                    {
                                        style: {
                                            position: "absolute",
                                            inset: 0,
                                            borderRadius: "50%",
                                            background: t.dot,
                                            animation:
                                                "rv-ping 1.6s var(--ease-out) infinite",
                                        },
                                    },
                                ),
                        ),
                    children,
                );
            }
            Object.assign(__ds_scope, { Badge });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/display/Badge.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/display/Card.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Surface container. variant: elevated | outlined | soft | brand
   `accentBar` adds the brand top/left accent stripe Real Vidas uses on service cards. */

            const VARIANTS = {
                elevated: {
                    bg: "var(--surface)",
                    border: "transparent",
                    shadow: "var(--shadow-md)",
                },
                outlined: {
                    bg: "var(--surface)",
                    border: "var(--border)",
                    shadow: "none",
                },
                soft: {
                    bg: "var(--bg-subtle)",
                    border: "transparent",
                    shadow: "none",
                },
                brand: {
                    bg: "var(--brand-soft)",
                    border: "var(--brand-border)",
                    shadow: "none",
                },
            };
            function Card({
                variant = "elevated",
                padding = "var(--space-6)",
                accentBar = false,
                interactive = false,
                children,
                style,
                ...rest
            }) {
                const [hover, setHover] = React.useState(false);
                const v = VARIANTS[variant] || VARIANTS.elevated;
                return /*#__PURE__*/ React.createElement(
                    "div",
                    _extends(
                        {
                            onMouseEnter: () =>
                                interactive && setHover(true),
                            onMouseLeave: () =>
                                interactive && setHover(false),
                            style: {
                                position: "relative",
                                background: v.bg,
                                border: `var(--border-w) solid ${v.border}`,
                                borderRadius: "var(--radius-lg)",
                                padding,
                                boxShadow:
                                    interactive && hover
                                        ? "var(--shadow-lg)"
                                        : v.shadow,
                                transform:
                                    interactive && hover
                                        ? "translateY(-3px)"
                                        : "none",
                                transition:
                                    "transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
                                cursor: interactive
                                    ? "pointer"
                                    : "default",
                                overflow: "hidden",
                                ...style,
                            },
                        },
                        rest,
                    ),
                    accentBar &&
                        /*#__PURE__*/ React.createElement("span", {
                            style: {
                                position: "absolute",
                                insetInlineStart: 0,
                                top: 0,
                                bottom: 0,
                                width: "var(--border-w-accent)",
                                background: "var(--grad-emergency)",
                            },
                        }),
                    children,
                );
            }
            Object.assign(__ds_scope, { Card });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/display/Card.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/brand/ServiceCard.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Service tile — icon, title, description, "Saiba mais" link.
   Mirrors the Real Vidas services grid. */

            function ServiceCard({
                icon,
                title,
                description,
                href,
                cta = "Saiba mais",
                style,
                ...rest
            }) {
                const [hover, setHover] = React.useState(false);
                return /*#__PURE__*/ React.createElement(
                    __ds_scope.Card,
                    _extends(
                        {
                            variant: "outlined",
                            interactive: true,
                            padding: "var(--space-6)",
                            onMouseEnter: () => setHover(true),
                            onMouseLeave: () => setHover(false),
                            style: {
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--space-4)",
                                height: "100%",
                                ...style,
                            },
                        },
                        rest,
                    ),
                    /*#__PURE__*/ React.createElement(
                        "span",
                        {
                            style: {
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 56,
                                height: 56,
                                borderRadius: "var(--radius-md)",
                                background: hover
                                    ? "var(--brand)"
                                    : "var(--brand-soft)",
                                color: hover
                                    ? "var(--on-brand)"
                                    : "var(--brand)",
                                transition:
                                    "background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)",
                            },
                        },
                        icon,
                    ),
                    /*#__PURE__*/ React.createElement(
                        "div",
                        {
                            style: {
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--space-2)",
                                flex: 1,
                            },
                        },
                        /*#__PURE__*/ React.createElement(
                            "h3",
                            {
                                style: {
                                    fontFamily: "var(--font-display)",
                                    fontWeight: "var(--fw-bold)",
                                    fontSize: "var(--text-lg)",
                                    color: "var(--text-strong)",
                                    margin: 0,
                                    lineHeight: "var(--leading-snug)",
                                },
                            },
                            title,
                        ),
                        description &&
                            /*#__PURE__*/ React.createElement(
                                "p",
                                {
                                    style: {
                                        fontFamily:
                                            "var(--font-body)",
                                        fontSize: "var(--text-sm)",
                                        color: "var(--text-muted)",
                                        margin: 0,
                                        lineHeight:
                                            "var(--leading-normal)",
                                    },
                                },
                                description,
                            ),
                    ),
                    href &&
                        /*#__PURE__*/ React.createElement(
                            "a",
                            {
                                href: href,
                                style: {
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "var(--space-2)",
                                    color: "var(--brand)",
                                    fontFamily: "var(--font-display)",
                                    fontWeight: "var(--fw-semibold)",
                                    fontSize: "var(--text-sm)",
                                    textDecoration: "none",
                                },
                            },
                            cta,
                            /*#__PURE__*/ React.createElement(
                                "svg",
                                {
                                    width: "16",
                                    height: "16",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "2.2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    style: {
                                        transform: hover
                                            ? "translateX(3px)"
                                            : "none",
                                        transition:
                                            "transform var(--dur-fast) var(--ease-out)",
                                    },
                                },
                                /*#__PURE__*/ React.createElement(
                                    "path",
                                    {
                                        d: "M5 12h14",
                                    },
                                ),
                                /*#__PURE__*/ React.createElement(
                                    "path",
                                    {
                                        d: "m12 5 7 7-7 7",
                                    },
                                ),
                            ),
                        ),
                );
            }
            Object.assign(__ds_scope, { ServiceCard });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/brand/ServiceCard.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/display/Stat.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Headline metric block (e.g. "24h cobertura", "+10 anos"). */

            function Stat({
                value,
                label,
                icon,
                accent = "brand",
                align = "start",
                style,
                ...rest
            }) {
                const color =
                    accent === "brand"
                        ? "var(--brand)"
                        : accent === "accent"
                          ? "var(--accent)"
                          : accent === "secondary"
                            ? "var(--secondary)"
                            : "var(--text-strong)";
                return /*#__PURE__*/ React.createElement(
                    "div",
                    _extends(
                        {
                            style: {
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--space-1)",
                                alignItems:
                                    align === "center"
                                        ? "center"
                                        : "flex-start",
                                textAlign:
                                    align === "center"
                                        ? "center"
                                        : "start",
                                ...style,
                            },
                        },
                        rest,
                    ),
                    icon &&
                        /*#__PURE__*/ React.createElement(
                            "span",
                            {
                                style: {
                                    color,
                                    display: "flex",
                                    marginBottom: "var(--space-1)",
                                },
                            },
                            icon,
                        ),
                    /*#__PURE__*/ React.createElement(
                        "span",
                        {
                            style: {
                                fontFamily: "var(--font-display)",
                                fontWeight: "var(--fw-extrabold)",
                                fontSize: "var(--text-2xl)",
                                lineHeight: 1,
                                color,
                                letterSpacing:
                                    "var(--tracking-tight)",
                            },
                        },
                        value,
                    ),
                    /*#__PURE__*/ React.createElement(
                        "span",
                        {
                            style: {
                                fontFamily: "var(--font-body)",
                                fontSize: "var(--text-sm)",
                                color: "var(--text-muted)",
                                lineHeight: "var(--leading-snug)",
                            },
                        },
                        label,
                    ),
                );
            }
            Object.assign(__ds_scope, { Stat });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/display/Stat.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/display/Tag.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Tag / chip with optional leading icon and removable X.
   Used for service categories & filters. tone like Badge but squarer. */

            const TONES = {
                neutral: {
                    bg: "var(--surface)",
                    border: "var(--border)",
                    color: "var(--text-body)",
                },
                brand: {
                    bg: "var(--brand-soft)",
                    border: "var(--brand-border)",
                    color: "var(--danger-text)",
                },
                secondary: {
                    bg: "var(--secondary-soft)",
                    border: "var(--secondary-border)",
                    color: "var(--info-text)",
                },
                success: {
                    bg: "var(--success-soft)",
                    border: "transparent",
                    color: "var(--success-text)",
                },
            };
            function Tag({
                tone = "neutral",
                icon,
                onRemove,
                children,
                style,
                ...rest
            }) {
                const t = TONES[tone] || TONES.neutral;
                return /*#__PURE__*/ React.createElement(
                    "span",
                    _extends(
                        {
                            style: {
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "var(--space-2)",
                                padding: "5px var(--space-3)",
                                borderRadius: "var(--radius-sm)",
                                background: t.bg,
                                border: `var(--border-w) solid ${t.border}`,
                                color: t.color,
                                fontFamily: "var(--font-body)",
                                fontSize: "var(--text-sm)",
                                fontWeight: "var(--fw-medium)",
                                lineHeight: 1.4,
                                whiteSpace: "nowrap",
                                ...style,
                            },
                        },
                        rest,
                    ),
                    icon &&
                        /*#__PURE__*/ React.createElement(
                            "span",
                            {
                                style: {
                                    display: "flex",
                                },
                            },
                            icon,
                        ),
                    children,
                    onRemove &&
                        /*#__PURE__*/ React.createElement(
                            "button",
                            {
                                type: "button",
                                "aria-label": "Remover",
                                onClick: onRemove,
                                style: {
                                    display: "inline-flex",
                                    border: "none",
                                    background: "transparent",
                                    color: "inherit",
                                    cursor: "pointer",
                                    padding: 0,
                                    marginInlineStart: 2,
                                    opacity: 0.7,
                                },
                            },
                            /*#__PURE__*/ React.createElement(
                                "svg",
                                {
                                    width: "13",
                                    height: "13",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "2.4",
                                    strokeLinecap: "round",
                                },
                                /*#__PURE__*/ React.createElement(
                                    "path",
                                    {
                                        d: "M18 6 6 18M6 6l12 12",
                                    },
                                ),
                            ),
                        ),
                );
            }
            Object.assign(__ds_scope, { Tag });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/display/Tag.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/feedback/Alert.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Inline alert / callout. tone: info | success | warning | danger | brand */

            const TONES = {
                info: {
                    bg: "var(--info-soft)",
                    bar: "var(--info)",
                    color: "var(--info-text)",
                    icon: "info",
                },
                success: {
                    bg: "var(--success-soft)",
                    bar: "var(--success)",
                    color: "var(--success-text)",
                    icon: "check-circle",
                },
                warning: {
                    bg: "var(--warning-soft)",
                    bar: "var(--warning)",
                    color: "var(--warning-text)",
                    icon: "alert-triangle",
                },
                danger: {
                    bg: "var(--danger-soft)",
                    bar: "var(--danger)",
                    color: "var(--danger-text)",
                    icon: "alert-triangle",
                },
                brand: {
                    bg: "var(--brand-soft)",
                    bar: "var(--brand)",
                    color: "var(--danger-text)",
                    icon: "heart-pulse",
                },
            };
            function Glyph({ name }) {
                const paths = {
                    info: [
                        "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20",
                        "M12 16v-4",
                        "M12 8h.01",
                    ],
                    "check-circle": [
                        "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
                        "m9 12 2 2 4-4",
                    ],
                    "alert-triangle": [
                        "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
                        "M12 9v4",
                        "M12 17h.01",
                    ],
                    "heart-pulse": [
                        "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
                        "M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27",
                    ],
                }[name];
                return /*#__PURE__*/ React.createElement(
                    "svg",
                    {
                        width: "18",
                        height: "18",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                    },
                    paths.map((d, i) =>
                        /*#__PURE__*/ React.createElement("path", {
                            key: i,
                            d: d,
                        }),
                    ),
                );
            }
            function Alert({
                tone = "info",
                title,
                children,
                style,
                ...rest
            }) {
                const t = TONES[tone] || TONES.info;
                return /*#__PURE__*/ React.createElement(
                    "div",
                    _extends(
                        {
                            role: "status",
                            style: {
                                display: "flex",
                                gap: "var(--space-3)",
                                padding: "var(--space-4)",
                                background: t.bg,
                                borderRadius: "var(--radius-md)",
                                borderInlineStart: `var(--border-w-accent) solid ${t.bar}`,
                                color: "var(--text-body)",
                                ...style,
                            },
                        },
                        rest,
                    ),
                    /*#__PURE__*/ React.createElement(
                        "span",
                        {
                            style: {
                                color: t.bar,
                                flexShrink: 0,
                                marginTop: 1,
                            },
                        },
                        /*#__PURE__*/ React.createElement(Glyph, {
                            name: t.icon,
                        }),
                    ),
                    /*#__PURE__*/ React.createElement(
                        "div",
                        {
                            style: {
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            },
                        },
                        title &&
                            /*#__PURE__*/ React.createElement(
                                "strong",
                                {
                                    style: {
                                        fontFamily:
                                            "var(--font-display)",
                                        fontSize: "var(--text-sm)",
                                        color: t.color,
                                    },
                                },
                                title,
                            ),
                        children &&
                            /*#__PURE__*/ React.createElement(
                                "span",
                                {
                                    style: {
                                        fontSize: "var(--text-sm)",
                                        color: "var(--text-muted)",
                                        lineHeight:
                                            "var(--leading-snug)",
                                    },
                                },
                                children,
                            ),
                    ),
                );
            }
            Object.assign(__ds_scope, { Alert });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/feedback/Alert.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/feedback/ProgressBar.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Determinate progress bar. value 0–100. tone sets fill. */

            function ProgressBar({
                value = 0,
                tone = "brand",
                label,
                showValue = false,
                style,
                ...rest
            }) {
                const pct = Math.max(0, Math.min(100, value));
                const fill =
                    tone === "secondary"
                        ? "var(--secondary)"
                        : tone === "accent"
                          ? "var(--accent)"
                          : "var(--grad-emergency)";
                return /*#__PURE__*/ React.createElement(
                    "div",
                    _extends(
                        {
                            style: {
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--space-2)",
                                ...style,
                            },
                        },
                        rest,
                    ),
                    (label || showValue) &&
                        /*#__PURE__*/ React.createElement(
                            "div",
                            {
                                style: {
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "var(--text-xs)",
                                    color: "var(--text-muted)",
                                    fontFamily: "var(--font-display)",
                                    fontWeight: "var(--fw-semibold)",
                                },
                            },
                            label &&
                                /*#__PURE__*/ React.createElement(
                                    "span",
                                    null,
                                    label,
                                ),
                            showValue &&
                                /*#__PURE__*/ React.createElement(
                                    "span",
                                    null,
                                    Math.round(pct),
                                    "%",
                                ),
                        ),
                    /*#__PURE__*/ React.createElement(
                        "div",
                        {
                            role: "progressbar",
                            "aria-valuenow": pct,
                            "aria-valuemin": 0,
                            "aria-valuemax": 100,
                            style: {
                                height: 8,
                                background: "var(--bg-inset)",
                                borderRadius: "var(--radius-pill)",
                                overflow: "hidden",
                            },
                        },
                        /*#__PURE__*/ React.createElement("div", {
                            style: {
                                width: `${pct}%`,
                                height: "100%",
                                background: fill,
                                borderRadius: "var(--radius-pill)",
                                transition:
                                    "width var(--dur-slow) var(--ease-out)",
                            },
                        }),
                    ),
                );
            }
            Object.assign(__ds_scope, { ProgressBar });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/feedback/ProgressBar.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/feedback/Spinner.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Spinner. size in px, tone sets the active arc color. */

            function Spinner({
                size = 22,
                tone = "brand",
                thickness,
                style,
                ...rest
            }) {
                const color =
                    tone === "brand"
                        ? "var(--brand)"
                        : tone === "secondary"
                          ? "var(--secondary)"
                          : tone === "accent"
                            ? "var(--accent)"
                            : "currentColor";
                const bw =
                    thickness || Math.max(2, Math.round(size / 10));
                return /*#__PURE__*/ React.createElement(
                    "span",
                    _extends(
                        {
                            role: "status",
                            "aria-label": "Carregando",
                            style: {
                                display: "inline-block",
                                width: size,
                                height: size,
                                border: `${bw}px solid color-mix(in srgb, ${color} 22%, transparent)`,
                                borderTopColor: color,
                                borderRadius: "50%",
                                animation:
                                    "rv-spin 0.7s linear infinite",
                                ...style,
                            },
                        },
                        rest,
                    ),
                );
            }
            Object.assign(__ds_scope, { Spinner });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/feedback/Spinner.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/forms/Checkbox.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Custom checkbox. Controlled via `checked`/`onChange` or uncontrolled. */

            function Checkbox({
                checked,
                defaultChecked,
                onChange,
                label,
                disabled = false,
                invalid = false,
                style,
                ...rest
            }) {
                const isControlled = checked !== undefined;
                const [internal, setInternal] =
                    React.useState(!!defaultChecked);
                const on = isControlled ? checked : internal;
                const toggle = (e) => {
                    if (disabled) return;
                    if (!isControlled) setInternal(e.target.checked);
                    onChange && onChange(e);
                };
                return /*#__PURE__*/ React.createElement(
                    "label",
                    {
                        style: {
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "var(--space-2)",
                            cursor: disabled
                                ? "not-allowed"
                                : "pointer",
                            opacity: disabled ? 0.6 : 1,
                            fontFamily: "var(--font-body)",
                            fontSize: "var(--text-base)",
                            color: "var(--text-body)",
                            userSelect: "none",
                            ...style,
                        },
                    },
                    /*#__PURE__*/ React.createElement(
                        "input",
                        _extends(
                            {
                                type: "checkbox",
                                checked: isControlled
                                    ? checked
                                    : undefined,
                                defaultChecked: isControlled
                                    ? undefined
                                    : defaultChecked,
                                onChange: toggle,
                                disabled: disabled,
                            },
                            rest,
                            {
                                style: {
                                    position: "absolute",
                                    opacity: 0,
                                    width: 0,
                                    height: 0,
                                },
                            },
                        ),
                    ),
                    /*#__PURE__*/ React.createElement(
                        "span",
                        {
                            style: {
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 20,
                                height: 20,
                                flexShrink: 0,
                                borderRadius: "var(--radius-xs)",
                                border: `var(--border-w-2) solid ${on ? "var(--brand)" : invalid ? "var(--danger)" : "var(--border-strong)"}`,
                                background: on
                                    ? "var(--brand)"
                                    : "var(--surface)",
                                color: "var(--on-brand)",
                                transition:
                                    "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)",
                            },
                        },
                        on &&
                            /*#__PURE__*/ React.createElement(
                                "svg",
                                {
                                    width: "14",
                                    height: "14",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "3.2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                },
                                /*#__PURE__*/ React.createElement(
                                    "path",
                                    {
                                        d: "M20 6 9 17l-5-5",
                                    },
                                ),
                            ),
                    ),
                    label &&
                        /*#__PURE__*/ React.createElement(
                            "span",
                            null,
                            label,
                        ),
                );
            }
            Object.assign(__ds_scope, { Checkbox });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/forms/Checkbox.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/forms/Field.jsx
    try {
        (() => {
            /* Form field wrapper: label, optional required mark, helper / error text. */

            function Field({
                label,
                htmlFor,
                required = false,
                hint,
                error,
                children,
                style,
            }) {
                return /*#__PURE__*/ React.createElement(
                    "div",
                    {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--space-2)",
                            ...style,
                        },
                    },
                    label &&
                        /*#__PURE__*/ React.createElement(
                            "label",
                            {
                                htmlFor: htmlFor,
                                style: {
                                    fontFamily: "var(--font-display)",
                                    fontSize: "var(--text-sm)",
                                    fontWeight: "var(--fw-semibold)",
                                    color: "var(--text-strong)",
                                    display: "inline-flex",
                                    gap: 4,
                                },
                            },
                            label,
                            required &&
                                /*#__PURE__*/ React.createElement(
                                    "span",
                                    {
                                        style: {
                                            color: "var(--brand)",
                                        },
                                    },
                                    "*",
                                ),
                        ),
                    children,
                    error
                        ? /*#__PURE__*/ React.createElement(
                              "span",
                              {
                                  style: {
                                      fontSize: "var(--text-xs)",
                                      color: "var(--danger-text)",
                                      fontFamily: "var(--font-body)",
                                  },
                              },
                              error,
                          )
                        : hint
                          ? /*#__PURE__*/ React.createElement(
                                "span",
                                {
                                    style: {
                                        fontSize: "var(--text-xs)",
                                        color: "var(--text-subtle)",
                                        fontFamily:
                                            "var(--font-body)",
                                    },
                                },
                                hint,
                            )
                          : null,
                );
            }
            Object.assign(__ds_scope, { Field });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/forms/Field.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/forms/Input.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Text input. Optional leftIcon/rightIcon, error state, sizes sm|md|lg. */

            const SIZES = {
                sm: {
                    height: "var(--control-sm)",
                    font: "var(--text-sm)",
                    pad: "0 var(--space-3)",
                },
                md: {
                    height: "var(--control-md)",
                    font: "var(--text-base)",
                    pad: "0 var(--space-4)",
                },
                lg: {
                    height: "var(--control-lg)",
                    font: "var(--text-md)",
                    pad: "0 var(--space-5)",
                },
            };
            function Input({
                size = "md",
                leftIcon,
                rightIcon,
                invalid = false,
                disabled = false,
                style,
                ...rest
            }) {
                const [focus, setFocus] = React.useState(false);
                const s = SIZES[size] || SIZES.md;
                const borderColor = invalid
                    ? "var(--danger)"
                    : focus
                      ? "var(--ring)"
                      : "var(--border-strong)";
                return /*#__PURE__*/ React.createElement(
                    "div",
                    {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--space-2)",
                            height: s.height,
                            padding: s.pad,
                            background: disabled
                                ? "var(--surface-sunken)"
                                : "var(--surface)",
                            border: `var(--border-w) solid ${borderColor}`,
                            borderRadius: "var(--radius-md)",
                            boxShadow: focus
                                ? `0 0 0 3px color-mix(in srgb, ${invalid ? "var(--danger)" : "var(--ring)"} 22%, transparent)`
                                : "var(--shadow-inset)",
                            transition:
                                "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
                            opacity: disabled ? 0.6 : 1,
                            color: "var(--text-muted)",
                            ...style,
                        },
                    },
                    leftIcon &&
                        /*#__PURE__*/ React.createElement(
                            "span",
                            {
                                style: {
                                    display: "flex",
                                    color: focus
                                        ? "var(--brand)"
                                        : "var(--text-subtle)",
                                },
                            },
                            leftIcon,
                        ),
                    /*#__PURE__*/ React.createElement(
                        "input",
                        _extends(
                            {
                                disabled: disabled,
                                onFocus: (e) => {
                                    setFocus(true);
                                    rest.onFocus && rest.onFocus(e);
                                },
                                onBlur: (e) => {
                                    setFocus(false);
                                    rest.onBlur && rest.onBlur(e);
                                },
                            },
                            rest,
                            {
                                style: {
                                    flex: 1,
                                    minWidth: 0,
                                    height: "100%",
                                    border: "none",
                                    outline: "none",
                                    background: "transparent",
                                    color: "var(--text-body)",
                                    fontFamily: "var(--font-body)",
                                    fontSize: s.font,
                                },
                            },
                        ),
                    ),
                    rightIcon &&
                        /*#__PURE__*/ React.createElement(
                            "span",
                            {
                                style: {
                                    display: "flex",
                                    color: "var(--text-subtle)",
                                },
                            },
                            rightIcon,
                        ),
                );
            }
            Object.assign(__ds_scope, { Input });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/forms/Input.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/forms/Select.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Styled native <select> with a chevron. Pass `options` [{value,label}] or children. */

            const SIZES = {
                sm: {
                    height: "var(--control-sm)",
                    font: "var(--text-sm)",
                    pad: "0 var(--space-8) 0 var(--space-3)",
                },
                md: {
                    height: "var(--control-md)",
                    font: "var(--text-base)",
                    pad: "0 var(--space-10) 0 var(--space-4)",
                },
                lg: {
                    height: "var(--control-lg)",
                    font: "var(--text-md)",
                    pad: "0 var(--space-10) 0 var(--space-5)",
                },
            };
            function Select({
                size = "md",
                options,
                invalid = false,
                disabled = false,
                children,
                style,
                ...rest
            }) {
                const [focus, setFocus] = React.useState(false);
                const s = SIZES[size] || SIZES.md;
                const borderColor = invalid
                    ? "var(--danger)"
                    : focus
                      ? "var(--ring)"
                      : "var(--border-strong)";
                return /*#__PURE__*/ React.createElement(
                    "div",
                    {
                        style: {
                            position: "relative",
                            display: "inline-flex",
                            width: style?.width || "100%",
                        },
                    },
                    /*#__PURE__*/ React.createElement(
                        "select",
                        _extends(
                            {
                                disabled: disabled,
                                onFocus: () => setFocus(true),
                                onBlur: () => setFocus(false),
                            },
                            rest,
                            {
                                style: {
                                    width: "100%",
                                    height: s.height,
                                    padding: s.pad,
                                    appearance: "none",
                                    WebkitAppearance: "none",
                                    background: disabled
                                        ? "var(--surface-sunken)"
                                        : "var(--surface)",
                                    border: `var(--border-w) solid ${borderColor}`,
                                    borderRadius: "var(--radius-md)",
                                    boxShadow: focus
                                        ? `0 0 0 3px color-mix(in srgb, ${invalid ? "var(--danger)" : "var(--ring)"} 22%, transparent)`
                                        : "var(--shadow-inset)",
                                    color: "var(--text-body)",
                                    fontFamily: "var(--font-body)",
                                    fontSize: s.font,
                                    cursor: disabled
                                        ? "not-allowed"
                                        : "pointer",
                                    outline: "none",
                                    transition:
                                        "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
                                    opacity: disabled ? 0.6 : 1,
                                    ...style,
                                },
                            },
                        ),
                        options
                            ? options.map((o) =>
                                  /*#__PURE__*/ React.createElement(
                                      "option",
                                      {
                                          key: o.value,
                                          value: o.value,
                                      },
                                      o.label,
                                  ),
                              )
                            : children,
                    ),
                    /*#__PURE__*/ React.createElement(
                        "span",
                        {
                            "aria-hidden": "true",
                            style: {
                                position: "absolute",
                                right: "var(--space-3)",
                                top: "50%",
                                transform: "translateY(-50%)",
                                pointerEvents: "none",
                                color: "var(--text-subtle)",
                                display: "flex",
                            },
                        },
                        /*#__PURE__*/ React.createElement(
                            "svg",
                            {
                                width: "16",
                                height: "16",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2.2",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                            },
                            /*#__PURE__*/ React.createElement(
                                "path",
                                {
                                    d: "m6 9 6 6 6-6",
                                },
                            ),
                        ),
                    ),
                );
            }
            Object.assign(__ds_scope, { Select });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/forms/Select.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/forms/Switch.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Toggle switch. Controlled or uncontrolled. */

            function Switch({
                checked,
                defaultChecked,
                onChange,
                label,
                disabled = false,
                size = "md",
                style,
                ...rest
            }) {
                const isControlled = checked !== undefined;
                const [internal, setInternal] =
                    React.useState(!!defaultChecked);
                const on = isControlled ? checked : internal;
                const W = size === "sm" ? 36 : 44;
                const H = size === "sm" ? 20 : 26;
                const knob = H - 6;
                const toggle = (e) => {
                    if (disabled) return;
                    if (!isControlled) setInternal(e.target.checked);
                    onChange && onChange(e);
                };
                return /*#__PURE__*/ React.createElement(
                    "label",
                    {
                        style: {
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "var(--space-3)",
                            cursor: disabled
                                ? "not-allowed"
                                : "pointer",
                            opacity: disabled ? 0.6 : 1,
                            fontFamily: "var(--font-body)",
                            fontSize: "var(--text-base)",
                            color: "var(--text-body)",
                            userSelect: "none",
                            ...style,
                        },
                    },
                    /*#__PURE__*/ React.createElement(
                        "input",
                        _extends(
                            {
                                type: "checkbox",
                                checked: isControlled
                                    ? checked
                                    : undefined,
                                defaultChecked: isControlled
                                    ? undefined
                                    : defaultChecked,
                                onChange: toggle,
                                disabled: disabled,
                            },
                            rest,
                            {
                                style: {
                                    position: "absolute",
                                    opacity: 0,
                                    width: 0,
                                    height: 0,
                                },
                            },
                        ),
                    ),
                    /*#__PURE__*/ React.createElement(
                        "span",
                        {
                            style: {
                                position: "relative",
                                width: W,
                                height: H,
                                flexShrink: 0,
                                borderRadius: "var(--radius-pill)",
                                background: on
                                    ? "var(--accent)"
                                    : "var(--border-strong)",
                                transition:
                                    "background var(--dur-base) var(--ease-out)",
                            },
                        },
                        /*#__PURE__*/ React.createElement("span", {
                            style: {
                                position: "absolute",
                                top: 3,
                                left: on ? W - knob - 3 : 3,
                                width: knob,
                                height: knob,
                                borderRadius: "50%",
                                background: "#fff",
                                boxShadow: "var(--shadow-sm)",
                                transition:
                                    "left var(--dur-base) var(--ease-out)",
                            },
                        }),
                    ),
                    label &&
                        /*#__PURE__*/ React.createElement(
                            "span",
                            null,
                            label,
                        ),
                );
            }
            Object.assign(__ds_scope, { Switch });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/forms/Switch.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/forms/Textarea.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Multi-line text input matching Input styling. */

            function Textarea({
                invalid = false,
                disabled = false,
                rows = 4,
                style,
                ...rest
            }) {
                const [focus, setFocus] = React.useState(false);
                const borderColor = invalid
                    ? "var(--danger)"
                    : focus
                      ? "var(--ring)"
                      : "var(--border-strong)";
                return /*#__PURE__*/ React.createElement(
                    "textarea",
                    _extends(
                        {
                            rows: rows,
                            disabled: disabled,
                            onFocus: (e) => {
                                setFocus(true);
                                rest.onFocus && rest.onFocus(e);
                            },
                            onBlur: (e) => {
                                setFocus(false);
                                rest.onBlur && rest.onBlur(e);
                            },
                        },
                        rest,
                        {
                            style: {
                                width: "100%",
                                padding:
                                    "var(--space-3) var(--space-4)",
                                background: disabled
                                    ? "var(--surface-sunken)"
                                    : "var(--surface)",
                                border: `var(--border-w) solid ${borderColor}`,
                                borderRadius: "var(--radius-md)",
                                boxShadow: focus
                                    ? `0 0 0 3px color-mix(in srgb, ${invalid ? "var(--danger)" : "var(--ring)"} 22%, transparent)`
                                    : "var(--shadow-inset)",
                                color: "var(--text-body)",
                                fontFamily: "var(--font-body)",
                                fontSize: "var(--text-base)",
                                lineHeight: "var(--leading-normal)",
                                resize: "vertical",
                                outline: "none",
                                transition:
                                    "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
                                opacity: disabled ? 0.6 : 1,
                                ...style,
                            },
                        },
                    ),
                );
            }
            Object.assign(__ds_scope, { Textarea });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/forms/Textarea.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/icon/Icon.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Real Vidas icon set.
   Stroke icons use Lucide geometry (ISC/MIT) — 24×24, currentColor,
   2px round strokes — to match a clean, medical-grade UI.
   Brand glyphs (whatsapp) are filled. Pass `name`, `size`, `strokeWidth`. */

            const STROKE = {
                phone: [
                    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
                ],
                mail: [
                    "M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z",
                    "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",
                ],
                "map-pin": [
                    "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
                    "M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4",
                ],
                clock: [
                    "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20",
                    "M12 6v6l4 2",
                ],
                "heart-pulse": [
                    "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
                    "M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27",
                ],
                activity: [
                    "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
                ],
                shield: [
                    "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
                ],
                "shield-check": [
                    "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
                    "m9 12 2 2 4-4",
                ],
                user: [
                    "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
                    "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
                ],
                users: [
                    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
                    "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
                    "M22 21v-2a4 4 0 0 0-3-3.87",
                    "M16 3.13a4 4 0 0 1 0 7.75",
                ],
                menu: ["M4 6h16", "M4 12h16", "M4 18h16"],
                x: ["M18 6 6 18", "m6 6 12 12"],
                check: ["M20 6 9 17l-5-5"],
                "check-circle": [
                    "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
                    "m9 12 2 2 4-4",
                ],
                "chevron-down": ["m6 9 6 6 6-6"],
                "chevron-right": ["m9 18 6-6-6-6"],
                "arrow-right": ["M5 12h14", "m12 5 7 7-7 7"],
                plus: ["M12 5v14", "M5 12h14"],
                minus: ["M5 12h14"],
                search: [
                    "M21 21l-4.34-4.34",
                    "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16",
                ],
                "alert-triangle": [
                    "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
                    "M12 9v4",
                    "M12 17h.01",
                ],
                info: [
                    "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20",
                    "M12 16v-4",
                    "M12 8h.01",
                ],
                calendar: [
                    "M8 2v4",
                    "M16 2v4",
                    "M3 10h18",
                    "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
                ],
                star: [
                    "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
                ],
                "map-pinned": [
                    "M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0",
                    "M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4",
                    "M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712",
                ],
                truck: [
                    "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",
                    "M15 18H9",
                    "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
                    "M5 18a2 2 0 1 0 4 0 2 2 0 1 0-4 0",
                    "M15 18a2 2 0 1 0 4 0 2 2 0 1 0-4 0",
                ],
                plane: [
                    "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",
                ],
                flame: [
                    "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
                ],
                "graduation-cap": [
                    "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",
                    "M22 10v6",
                    "M6 12.5V16a6 3 0 0 0 12 0v-3.5",
                ],
                "file-text": [
                    "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z",
                    "M14 2v4a2 2 0 0 0 2 2h4",
                    "M10 9H8",
                    "M16 13H8",
                    "M16 17H8",
                ],
                "credit-card": [
                    "M3 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z",
                    "M1 10h22",
                ],
                sun: [
                    "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
                    "M12 2v2",
                    "M12 20v2",
                    "m4.93 4.93 1.41 1.41",
                    "m17.66 17.66 1.41 1.41",
                    "M2 12h2",
                    "M20 12h2",
                    "m6.34 17.66-1.41 1.41",
                    "m19.07 4.93-1.41 1.41",
                ],
                moon: ["M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"],
                "external-link": [
                    "M15 3h6v6",
                    "M10 14 21 3",
                    "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
                ],
                send: [
                    "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
                    "m21.854 2.147-10.94 10.939",
                ],
            };
            const FILL = {
                whatsapp: [
                    "M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z",
                ],
            };
            function Icon({
                name,
                size = 20,
                strokeWidth = 2,
                style,
                ...rest
            }) {
                const fill = FILL[name];
                if (fill) {
                    return /*#__PURE__*/ React.createElement(
                        "svg",
                        _extends(
                            {
                                width: size,
                                height: size,
                                viewBox: "0 0 24 24",
                                fill: "currentColor",
                                "aria-hidden": "true",
                                style: {
                                    flexShrink: 0,
                                    display: "block",
                                    ...style,
                                },
                            },
                            rest,
                        ),
                        fill.map((d, i) =>
                            /*#__PURE__*/ React.createElement(
                                "path",
                                {
                                    key: i,
                                    d: d,
                                },
                            ),
                        ),
                    );
                }
                const paths = STROKE[name] || STROKE["info"];
                return /*#__PURE__*/ React.createElement(
                    "svg",
                    _extends(
                        {
                            width: size,
                            height: size,
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: strokeWidth,
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            "aria-hidden": "true",
                            style: {
                                flexShrink: 0,
                                display: "block",
                                ...style,
                            },
                        },
                        rest,
                    ),
                    paths.map((d, i) =>
                        /*#__PURE__*/ React.createElement("path", {
                            key: i,
                            d: d,
                        }),
                    ),
                );
            }
            Object.assign(__ds_scope, { Icon });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/icon/Icon.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/actions/ThemeToggle.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Light/dark switch. Reads & writes data-theme on <html> and persists to
   localStorage under "rv-theme". Drop one in any header. */

            function getInitial() {
                if (typeof document === "undefined") return "light";
                const attr =
                    document.documentElement.getAttribute(
                        "data-theme",
                    );
                if (attr === "light" || attr === "dark") return attr;
                const stored =
                    typeof localStorage !== "undefined"
                        ? localStorage.getItem("rv-theme")
                        : null;
                if (stored === "light" || stored === "dark")
                    return stored;
                return window.matchMedia &&
                    window.matchMedia("(prefers-color-scheme: dark)")
                        .matches
                    ? "dark"
                    : "light";
            }
            function ThemeToggle({ size = "md", style, ...rest }) {
                const [theme, setTheme] = React.useState(getInitial);
                const [hover, setHover] = React.useState(false);
                React.useEffect(() => {
                    document.documentElement.setAttribute(
                        "data-theme",
                        theme,
                    );
                    try {
                        localStorage.setItem("rv-theme", theme);
                    } catch (e) {}
                }, [theme]);
                const dim =
                    size === "sm" ? 34 : size === "lg" ? 52 : 42;
                const isDark = theme === "dark";
                return /*#__PURE__*/ React.createElement(
                    "button",
                    _extends(
                        {
                            type: "button",
                            "aria-label": isDark
                                ? "Ativar tema claro"
                                : "Ativar tema escuro",
                            "aria-pressed": isDark,
                            title: isDark
                                ? "Tema claro"
                                : "Tema escuro",
                            onClick: () =>
                                setTheme(isDark ? "light" : "dark"),
                            onMouseEnter: () => setHover(true),
                            onMouseLeave: () => setHover(false),
                            style: {
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: dim,
                                height: dim,
                                borderRadius: "var(--radius-pill)",
                                border: "var(--border-w) solid var(--border)",
                                background: hover
                                    ? "var(--surface-hover)"
                                    : "var(--surface)",
                                color: "var(--text-body)",
                                cursor: "pointer",
                                transition:
                                    "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
                                ...style,
                            },
                        },
                        rest,
                    ),
                    /*#__PURE__*/ React.createElement(
                        __ds_scope.Icon,
                        {
                            name: isDark ? "sun" : "moon",
                            size: size === "sm" ? 16 : 18,
                        },
                    ),
                );
            }
            Object.assign(__ds_scope, { ThemeToggle });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/actions/ThemeToggle.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/brand/EmergencyCTA.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Signature emergency call band — brand-red gradient with phone + WhatsApp.
   The recurring "Pensou em remoções ou emergências? Fale com a Real Vidas" CTA. */

            function EmergencyCTA({
                title = "Pensou em Remoções ou Emergências?",
                subtitle = "Fale com a Real Vidas — atendimento 24 horas, todos os dias.",
                phone = "(12) 99715-1128",
                phoneHref = "tel:+5512997151128",
                whatsappHref = "https://api.whatsapp.com/send?phone=5512997151128",
                style,
                ...rest
            }) {
                return /*#__PURE__*/ React.createElement(
                    "div",
                    _extends(
                        {
                            style: {
                                position: "relative",
                                overflow: "hidden",
                                background: "var(--grad-emergency)",
                                color: "#fff",
                                borderRadius: "var(--radius-xl)",
                                padding: "var(--space-8)",
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "var(--space-6)",
                                boxShadow: "var(--shadow-brand)",
                                ...style,
                            },
                        },
                        rest,
                    ),
                    /*#__PURE__*/ React.createElement(
                        "svg",
                        {
                            viewBox: "0 0 400 80",
                            preserveAspectRatio: "none",
                            "aria-hidden": "true",
                            style: {
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                opacity: 0.12,
                                pointerEvents: "none",
                            },
                        },
                        /*#__PURE__*/ React.createElement("path", {
                            d: "M0 40 H120 L140 14 L168 66 L188 30 L205 40 H400",
                            fill: "none",
                            stroke: "#fff",
                            strokeWidth: "3",
                        }),
                    ),
                    /*#__PURE__*/ React.createElement(
                        "div",
                        {
                            style: {
                                position: "relative",
                                maxWidth: 520,
                            },
                        },
                        /*#__PURE__*/ React.createElement(
                            "h2",
                            {
                                style: {
                                    fontFamily: "var(--font-display)",
                                    fontWeight: "var(--fw-extrabold)",
                                    fontSize: "var(--text-2xl)",
                                    margin: 0,
                                    lineHeight:
                                        "var(--leading-tight)",
                                    color: "#fff",
                                },
                            },
                            title,
                        ),
                        /*#__PURE__*/ React.createElement(
                            "p",
                            {
                                style: {
                                    fontFamily: "var(--font-body)",
                                    fontSize: "var(--text-md)",
                                    margin: "var(--space-3) 0 0",
                                    color: "rgba(255,255,255,0.92)",
                                },
                            },
                            subtitle,
                        ),
                    ),
                    /*#__PURE__*/ React.createElement(
                        "div",
                        {
                            style: {
                                position: "relative",
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--space-3)",
                                minWidth: 230,
                            },
                        },
                        /*#__PURE__*/ React.createElement(
                            "a",
                            {
                                href: phoneHref,
                                style: {
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "var(--space-3)",
                                    background: "#fff",
                                    color: "var(--brand)",
                                    borderRadius: "var(--radius-md)",
                                    padding:
                                        "var(--space-3) var(--space-5)",
                                    textDecoration: "none",
                                    fontFamily: "var(--font-display)",
                                    fontWeight: "var(--fw-bold)",
                                    fontSize: "var(--text-lg)",
                                    boxShadow: "var(--shadow-md)",
                                },
                            },
                            /*#__PURE__*/ React.createElement(
                                __ds_scope.Icon,
                                {
                                    name: "phone",
                                    size: 22,
                                },
                            ),
                            phone,
                        ),
                        /*#__PURE__*/ React.createElement(
                            "a",
                            {
                                href: whatsappHref,
                                style: {
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "var(--space-2)",
                                    background: "#25D366",
                                    color: "#04301a",
                                    borderRadius: "var(--radius-md)",
                                    padding:
                                        "var(--space-3) var(--space-5)",
                                    textDecoration: "none",
                                    fontFamily: "var(--font-display)",
                                    fontWeight: "var(--fw-bold)",
                                    fontSize: "var(--text-base)",
                                },
                            },
                            /*#__PURE__*/ React.createElement(
                                __ds_scope.Icon,
                                {
                                    name: "whatsapp",
                                    size: 20,
                                },
                            ),
                            "WhatsApp 24h",
                        ),
                    ),
                );
            }
            Object.assign(__ds_scope, { EmergencyCTA });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/brand/EmergencyCTA.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/navigation/Breadcrumb.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* Breadcrumb. items: [{label, href?}]. Last item is the current page. */

            function Breadcrumb({ items = [], style, ...rest }) {
                return /*#__PURE__*/ React.createElement(
                    "nav",
                    _extends(
                        {
                            "aria-label": "Breadcrumb",
                            style: {
                                ...style,
                            },
                        },
                        rest,
                    ),
                    /*#__PURE__*/ React.createElement(
                        "ol",
                        {
                            style: {
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                gap: "var(--space-2)",
                                listStyle: "none",
                                margin: 0,
                                padding: 0,
                                fontFamily: "var(--font-body)",
                                fontSize: "var(--text-sm)",
                            },
                        },
                        items.map((it, i) => {
                            const last = i === items.length - 1;
                            return /*#__PURE__*/ React.createElement(
                                "li",
                                {
                                    key: i,
                                    style: {
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "var(--space-2)",
                                    },
                                },
                                last || !it.href
                                    ? /*#__PURE__*/ React.createElement(
                                          "span",
                                          {
                                              "aria-current": last
                                                  ? "page"
                                                  : undefined,
                                              style: {
                                                  color: last
                                                      ? "var(--text-strong)"
                                                      : "var(--text-muted)",
                                                  fontWeight: last
                                                      ? "var(--fw-semibold)"
                                                      : "var(--fw-regular)",
                                              },
                                          },
                                          it.label,
                                      )
                                    : /*#__PURE__*/ React.createElement(
                                          "a",
                                          {
                                              href: it.href,
                                              style: {
                                                  color: "var(--text-muted)",
                                                  textDecoration:
                                                      "none",
                                              },
                                          },
                                          it.label,
                                      ),
                                !last &&
                                    /*#__PURE__*/ React.createElement(
                                        "svg",
                                        {
                                            width: "14",
                                            height: "14",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "var(--text-subtle)",
                                            strokeWidth: "2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            "aria-hidden": "true",
                                        },
                                        /*#__PURE__*/ React.createElement(
                                            "path",
                                            {
                                                d: "m9 18 6-6-6-6",
                                            },
                                        ),
                                    ),
                            );
                        }),
                    ),
                );
            }
            Object.assign(__ds_scope, { Breadcrumb });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/navigation/Breadcrumb.jsx",
            error: String((e && e.message) || e),
        });
    }

    // components/navigation/Tabs.jsx
    try {
        (() => {
            /* Tabs. items: [{id,label,icon?}]. Controlled via value/onChange or uncontrolled.
   variant: underline | pill */

            function Tabs({
                items = [],
                value,
                defaultValue,
                onChange,
                variant = "underline",
                style,
            }) {
                const isControlled = value !== undefined;
                const [internal, setInternal] = React.useState(
                    defaultValue ?? (items[0] && items[0].id),
                );
                const active = isControlled ? value : internal;
                const select = (id) => {
                    if (!isControlled) setInternal(id);
                    onChange && onChange(id);
                };
                if (variant === "pill") {
                    return /*#__PURE__*/ React.createElement(
                        "div",
                        {
                            role: "tablist",
                            style: {
                                display: "inline-flex",
                                gap: 4,
                                padding: 4,
                                background: "var(--bg-inset)",
                                borderRadius: "var(--radius-pill)",
                                ...style,
                            },
                        },
                        items.map((it) => {
                            const on = it.id === active;
                            return /*#__PURE__*/ React.createElement(
                                "button",
                                {
                                    key: it.id,
                                    role: "tab",
                                    "aria-selected": on,
                                    onClick: () => select(it.id),
                                    style: {
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "var(--space-2)",
                                        padding:
                                            "var(--space-2) var(--space-4)",
                                        border: "none",
                                        borderRadius:
                                            "var(--radius-pill)",
                                        cursor: "pointer",
                                        background: on
                                            ? "var(--surface)"
                                            : "transparent",
                                        color: on
                                            ? "var(--brand)"
                                            : "var(--text-muted)",
                                        boxShadow: on
                                            ? "var(--shadow-sm)"
                                            : "none",
                                        fontFamily:
                                            "var(--font-display)",
                                        fontSize: "var(--text-sm)",
                                        fontWeight:
                                            "var(--fw-semibold)",
                                        transition:
                                            "color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)",
                                    },
                                },
                                it.icon,
                                it.label,
                            );
                        }),
                    );
                }
                return /*#__PURE__*/ React.createElement(
                    "div",
                    {
                        role: "tablist",
                        style: {
                            display: "flex",
                            gap: "var(--space-6)",
                            borderBottom:
                                "var(--border-w) solid var(--border)",
                            ...style,
                        },
                    },
                    items.map((it) => {
                        const on = it.id === active;
                        return /*#__PURE__*/ React.createElement(
                            "button",
                            {
                                key: it.id,
                                role: "tab",
                                "aria-selected": on,
                                onClick: () => select(it.id),
                                style: {
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "var(--space-2)",
                                    padding: "var(--space-3) 2px",
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                    color: on
                                        ? "var(--text-strong)"
                                        : "var(--text-muted)",
                                    fontFamily: "var(--font-display)",
                                    fontSize: "var(--text-base)",
                                    fontWeight: "var(--fw-semibold)",
                                    borderBottom: `var(--border-w-accent) solid ${on ? "var(--brand)" : "transparent"}`,
                                    marginBottom: -1,
                                    transition:
                                        "color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)",
                                },
                            },
                            it.icon,
                            it.label,
                        );
                    }),
                );
            }
            Object.assign(__ds_scope, { Tabs });
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "components/navigation/Tabs.jsx",
            error: String((e && e.message) || e),
        });
    }

    // ui_kits/website/AboutSection.jsx
    try {
        (() => {
            /* AboutSection — "Quem somos" + padrões de segurança (safety standards). */
            const { Stat, Icon, Card } =
                window.RealVidasDesignSystem_066fed;
            const STANDARDS = [
                "Equipe profissional e experiente",
                "Treinamentos seguindo protocolos internacionais de resgate",
                "Ambulâncias com tecnologia de última geração",
                "Normas de segurança para remoção de pacientes",
                "Certificações de atendimento ao trauma",
                "Atendimento personalizado, ágil e humanizado",
            ];
            function AboutSection() {
                return /*#__PURE__*/ React.createElement(
                    "section",
                    {
                        style: {
                            background: "var(--bg-subtle)",
                            padding:
                                "clamp(3rem,6vw,5rem) var(--gutter)",
                        },
                    },
                    /*#__PURE__*/ React.createElement(
                        "div",
                        {
                            style: {
                                maxWidth: "var(--container-xl)",
                                margin: "0 auto",
                                display: "grid",
                                gridTemplateColumns:
                                    "minmax(0,1fr) minmax(0,1fr)",
                                gap: "var(--space-12)",
                                alignItems: "center",
                            },
                            className: "rv-about-grid",
                        },
                        /*#__PURE__*/ React.createElement(
                            "div",
                            {
                                style: {
                                    position: "relative",
                                    aspectRatio: "5/4",
                                    borderRadius: "var(--radius-2xl)",
                                    overflow: "hidden",
                                    background:
                                        "var(--grad-institutional)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "var(--shadow-lg)",
                                },
                            },
                            /*#__PURE__*/ React.createElement(
                                "div",
                                {
                                    style: {
                                        color: "rgba(255,255,255,0.8)",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "var(--space-2)",
                                    },
                                },
                                /*#__PURE__*/ React.createElement(
                                    Icon,
                                    {
                                        name: "users",
                                        size: 56,
                                    },
                                ),
                                /*#__PURE__*/ React.createElement(
                                    "span",
                                    {
                                        style: {
                                            fontFamily:
                                                "var(--font-display)",
                                            fontSize:
                                                "var(--text-sm)",
                                            letterSpacing: "0.04em",
                                            textTransform:
                                                "uppercase",
                                        },
                                    },
                                    "Foto da equipe",
                                ),
                            ),
                            /*#__PURE__*/ React.createElement(
                                "div",
                                {
                                    style: {
                                        position: "absolute",
                                        bottom: "var(--space-5)",
                                        left: "var(--space-5)",
                                        right: "var(--space-5)",
                                        display: "flex",
                                        gap: "var(--space-6)",
                                        background:
                                            "rgba(255,255,255,0.96)",
                                        borderRadius:
                                            "var(--radius-lg)",
                                        padding:
                                            "var(--space-4) var(--space-5)",
                                        boxShadow: "var(--shadow-md)",
                                    },
                                },
                                /*#__PURE__*/ React.createElement(
                                    Stat,
                                    {
                                        value: "24h",
                                        label: "Atendimento",
                                        icon: /*#__PURE__*/ React.createElement(
                                            Icon,
                                            {
                                                name: "clock",
                                                size: 22,
                                            },
                                        ),
                                    },
                                ),
                                /*#__PURE__*/ React.createElement(
                                    Stat,
                                    {
                                        value: "+10",
                                        label: "Anos de atua\xE7\xE3o",
                                        accent: "secondary",
                                        icon: /*#__PURE__*/ React.createElement(
                                            Icon,
                                            {
                                                name: "shield",
                                                size: 22,
                                            },
                                        ),
                                    },
                                ),
                                /*#__PURE__*/ React.createElement(
                                    Stat,
                                    {
                                        value: "6",
                                        label: "Certifica\xE7\xF5es",
                                        accent: "accent",
                                        icon: /*#__PURE__*/ React.createElement(
                                            Icon,
                                            {
                                                name: "star",
                                                size: 22,
                                            },
                                        ),
                                    },
                                ),
                            ),
                        ),
                        /*#__PURE__*/ React.createElement(
                            "div",
                            null,
                            /*#__PURE__*/ React.createElement(
                                "span",
                                {
                                    className: "rv-eyebrow",
                                },
                                "Quem somos",
                            ),
                            /*#__PURE__*/ React.createElement(
                                "h2",
                                {
                                    style: {
                                        fontFamily:
                                            "var(--font-display)",
                                        fontWeight:
                                            "var(--fw-extrabold)",
                                        fontSize: "var(--text-2xl)",
                                        color: "var(--text-strong)",
                                        margin: "var(--space-3) 0 var(--space-4)",
                                    },
                                },
                                "Oriunda da consultoria e do treinamento em sa\xFAde",
                            ),
                            /*#__PURE__*/ React.createElement(
                                "p",
                                {
                                    className: "rv-body",
                                    style: {
                                        color: "var(--text-muted)",
                                        marginBottom:
                                            "var(--space-6)",
                                    },
                                },
                                "A Real Vidas foi criada para prestar servi\xE7os de alt\xEDssima qualidade no atendimento e remo\xE7\xE3o de pacientes de urg\xEAncia e emerg\xEAncia \u2014 com equipe treinada constantemente e t\xE9cnicas atualizadas de resgate.",
                            ),
                            /*#__PURE__*/ React.createElement(
                                "div",
                                {
                                    style: {
                                        display: "grid",
                                        gridTemplateColumns:
                                            "1fr 1fr",
                                        gap: "var(--space-3)",
                                    },
                                    className: "rv-std-grid",
                                },
                                STANDARDS.map((t) =>
                                    /*#__PURE__*/ React.createElement(
                                        "div",
                                        {
                                            key: t,
                                            style: {
                                                display: "flex",
                                                gap: "var(--space-2)",
                                                alignItems:
                                                    "flex-start",
                                            },
                                        },
                                        /*#__PURE__*/ React.createElement(
                                            "span",
                                            {
                                                style: {
                                                    color: "var(--accent)",
                                                    flexShrink: 0,
                                                    marginTop: 1,
                                                },
                                            },
                                            /*#__PURE__*/ React.createElement(
                                                Icon,
                                                {
                                                    name: "check-circle",
                                                    size: 18,
                                                },
                                            ),
                                        ),
                                        /*#__PURE__*/ React.createElement(
                                            "span",
                                            {
                                                style: {
                                                    fontFamily:
                                                        "var(--font-body)",
                                                    fontSize:
                                                        "var(--text-sm)",
                                                    color: "var(--text-body)",
                                                },
                                            },
                                            t,
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                );
            }
            window.AboutSection = AboutSection;
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "ui_kits/website/AboutSection.jsx",
            error: String((e && e.message) || e),
        });
    }

    // ui_kits/website/FloatingActions.jsx
    try {
        (() => {
            /* FloatingActions — fixed WhatsApp + call bubbles (bottom-right). */
            const { IconButton, Icon } =
                window.RealVidasDesignSystem_066fed;
            function FloatingActions() {
                return /*#__PURE__*/ React.createElement(
                    "div",
                    {
                        style: {
                            position: "fixed",
                            right: "var(--space-5)",
                            bottom: "var(--space-5)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--space-3)",
                            zIndex: "var(--z-sticky)",
                        },
                    },
                    /*#__PURE__*/ React.createElement(
                        "a",
                        {
                            href: "tel:+5512997151128",
                            "aria-label": "Ligar",
                            style: {
                                textDecoration: "none",
                            },
                        },
                        /*#__PURE__*/ React.createElement(
                            "span",
                            {
                                style: {
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 52,
                                    height: 52,
                                    borderRadius:
                                        "var(--radius-pill)",
                                    background: "var(--brand)",
                                    color: "#fff",
                                    boxShadow: "var(--shadow-brand)",
                                },
                            },
                            /*#__PURE__*/ React.createElement(Icon, {
                                name: "phone",
                                size: 22,
                            }),
                        ),
                    ),
                    /*#__PURE__*/ React.createElement(
                        "a",
                        {
                            href: "https://api.whatsapp.com/send?phone=5512997151128",
                            "aria-label": "WhatsApp",
                            style: {
                                textDecoration: "none",
                                position: "relative",
                            },
                        },
                        /*#__PURE__*/ React.createElement("span", {
                            style: {
                                position: "absolute",
                                inset: 0,
                                borderRadius: "var(--radius-pill)",
                                background: "#25D366",
                                animation:
                                    "rv-ping 2s var(--ease-out) infinite",
                            },
                        }),
                        /*#__PURE__*/ React.createElement(
                            "span",
                            {
                                style: {
                                    position: "relative",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 56,
                                    height: 56,
                                    borderRadius:
                                        "var(--radius-pill)",
                                    background: "#25D366",
                                    color: "#04301a",
                                    boxShadow: "var(--shadow-lg)",
                                },
                            },
                            /*#__PURE__*/ React.createElement(Icon, {
                                name: "whatsapp",
                                size: 26,
                            }),
                        ),
                    ),
                );
            }
            window.FloatingActions = FloatingActions;
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "ui_kits/website/FloatingActions.jsx",
            error: String((e && e.message) || e),
        });
    }

    // ui_kits/website/Footer.jsx
    try {
        (() => {
            /* Footer + the recurring EmergencyCTA band above it. */
            const { Logo, EmergencyCTA, Icon } =
                window.RealVidasDesignSystem_066fed;
            function Footer({ onNavigate }) {
                return /*#__PURE__*/ React.createElement(
                    React.Fragment,
                    null,
                    /*#__PURE__*/ React.createElement(
                        "div",
                        {
                            style: {
                                background: "var(--bg-canvas)",
                                padding:
                                    "0 var(--gutter) clamp(2rem,5vw,4rem)",
                            },
                        },
                        /*#__PURE__*/ React.createElement(
                            "div",
                            {
                                style: {
                                    maxWidth: "var(--container-xl)",
                                    margin: "0 auto",
                                },
                            },
                            /*#__PURE__*/ React.createElement(
                                EmergencyCTA,
                                null,
                            ),
                        ),
                    ),
                    /*#__PURE__*/ React.createElement(
                        "footer",
                        {
                            style: {
                                background: "var(--secondary)",
                                color: "rgba(255,255,255,0.82)",
                            },
                        },
                        /*#__PURE__*/ React.createElement(
                            "div",
                            {
                                style: {
                                    maxWidth: "var(--container-xl)",
                                    margin: "0 auto",
                                    padding:
                                        "clamp(2.5rem,5vw,3.5rem) var(--gutter)",
                                    display: "grid",
                                    gridTemplateColumns:
                                        "1.4fr 1fr 1.2fr",
                                    gap: "var(--space-10)",
                                },
                                className: "rv-footer-grid",
                            },
                            /*#__PURE__*/ React.createElement(
                                "div",
                                null,
                                /*#__PURE__*/ React.createElement(
                                    Logo,
                                    {
                                        variant: "full",
                                        tone: "mono",
                                        size: 40,
                                    },
                                ),
                                /*#__PURE__*/ React.createElement(
                                    "p",
                                    {
                                        style: {
                                            fontFamily:
                                                "var(--font-body)",
                                            fontSize:
                                                "var(--text-sm)",
                                            lineHeight:
                                                "var(--leading-relaxed)",
                                            marginTop:
                                                "var(--space-4)",
                                            maxWidth: 320,
                                        },
                                    },
                                    "Servi\xE7os de alt\xEDssima qualidade no atendimento e remo\xE7\xE3o de pacientes de urg\xEAncia e emerg\xEAncia.",
                                ),
                            ),
                            /*#__PURE__*/ React.createElement(
                                "div",
                                null,
                                /*#__PURE__*/ React.createElement(
                                    "div",
                                    {
                                        style: {
                                            fontFamily:
                                                "var(--font-display)",
                                            fontWeight:
                                                "var(--fw-bold)",
                                            color: "#fff",
                                            fontSize:
                                                "var(--text-sm)",
                                            letterSpacing: "0.08em",
                                            textTransform:
                                                "uppercase",
                                            marginBottom:
                                                "var(--space-4)",
                                        },
                                    },
                                    "Navega\xE7\xE3o",
                                ),
                                /*#__PURE__*/ React.createElement(
                                    "div",
                                    {
                                        style: {
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "var(--space-2)",
                                        },
                                    },
                                    [
                                        ["inicio", "Início"],
                                        ["servicos", "Serviços"],
                                        ["planos", "Associe-se"],
                                        ["contato", "Fale Conosco"],
                                    ].map(([id, l]) =>
                                        /*#__PURE__*/ React.createElement(
                                            "button",
                                            {
                                                key: id,
                                                onClick: () =>
                                                    onNavigate(id),
                                                style: {
                                                    textAlign: "left",
                                                    border: "none",
                                                    background:
                                                        "transparent",
                                                    color: "rgba(255,255,255,0.82)",
                                                    cursor: "pointer",
                                                    padding: 0,
                                                    fontFamily:
                                                        "var(--font-body)",
                                                    fontSize:
                                                        "var(--text-sm)",
                                                },
                                            },
                                            l,
                                        ),
                                    ),
                                ),
                            ),
                            /*#__PURE__*/ React.createElement(
                                "div",
                                null,
                                /*#__PURE__*/ React.createElement(
                                    "div",
                                    {
                                        style: {
                                            fontFamily:
                                                "var(--font-display)",
                                            fontWeight:
                                                "var(--fw-bold)",
                                            color: "#fff",
                                            fontSize:
                                                "var(--text-sm)",
                                            letterSpacing: "0.08em",
                                            textTransform:
                                                "uppercase",
                                            marginBottom:
                                                "var(--space-4)",
                                        },
                                    },
                                    "Contato",
                                ),
                                /*#__PURE__*/ React.createElement(
                                    "div",
                                    {
                                        style: {
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "var(--space-3)",
                                            fontSize:
                                                "var(--text-sm)",
                                        },
                                    },
                                    /*#__PURE__*/ React.createElement(
                                        "a",
                                        {
                                            href: "tel:+5512997151128",
                                            style: {
                                                color: "#fff",
                                                display:
                                                    "inline-flex",
                                                gap: 8,
                                                alignItems: "center",
                                                textDecoration:
                                                    "none",
                                                fontWeight:
                                                    "var(--fw-semibold)",
                                            },
                                        },
                                        /*#__PURE__*/ React.createElement(
                                            Icon,
                                            {
                                                name: "phone",
                                                size: 16,
                                            },
                                        ),
                                        "(12) 99715-1128",
                                    ),
                                    /*#__PURE__*/ React.createElement(
                                        "a",
                                        {
                                            href: "tel:+551235221128",
                                            style: {
                                                color: "rgba(255,255,255,0.82)",
                                                display:
                                                    "inline-flex",
                                                gap: 8,
                                                alignItems: "center",
                                                textDecoration:
                                                    "none",
                                            },
                                        },
                                        /*#__PURE__*/ React.createElement(
                                            Icon,
                                            {
                                                name: "phone",
                                                size: 16,
                                            },
                                        ),
                                        "(12) 3522-1128",
                                    ),
                                    /*#__PURE__*/ React.createElement(
                                        "a",
                                        {
                                            href: "mailto:faleconosco@realvidas.com.br",
                                            style: {
                                                color: "rgba(255,255,255,0.82)",
                                                display:
                                                    "inline-flex",
                                                gap: 8,
                                                alignItems: "center",
                                                textDecoration:
                                                    "none",
                                            },
                                        },
                                        /*#__PURE__*/ React.createElement(
                                            Icon,
                                            {
                                                name: "mail",
                                                size: 16,
                                            },
                                        ),
                                        "faleconosco@realvidas.com.br",
                                    ),
                                    /*#__PURE__*/ React.createElement(
                                        "span",
                                        {
                                            style: {
                                                display:
                                                    "inline-flex",
                                                gap: 8,
                                                alignItems: "center",
                                            },
                                        },
                                        /*#__PURE__*/ React.createElement(
                                            Icon,
                                            {
                                                name: "map-pin",
                                                size: 16,
                                            },
                                        ),
                                        "Pindamonhangaba \xB7 SP",
                                    ),
                                ),
                            ),
                        ),
                        /*#__PURE__*/ React.createElement(
                            "div",
                            {
                                style: {
                                    borderTop:
                                        "1px solid rgba(255,255,255,0.16)",
                                },
                            },
                            /*#__PURE__*/ React.createElement(
                                "div",
                                {
                                    style: {
                                        maxWidth:
                                            "var(--container-xl)",
                                        margin: "0 auto",
                                        padding:
                                            "var(--space-4) var(--gutter)",
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        flexWrap: "wrap",
                                        gap: "var(--space-2)",
                                        fontSize: "var(--text-xs)",
                                        color: "rgba(255,255,255,0.6)",
                                    },
                                },
                                /*#__PURE__*/ React.createElement(
                                    "span",
                                    null,
                                    "\xA9 2026 Real Vidas \xB7 Remo\xE7\xF5es e Emerg\xEAncias 24h",
                                ),
                                /*#__PURE__*/ React.createElement(
                                    "span",
                                    null,
                                    "Recria\xE7\xE3o de UI para o design system",
                                ),
                            ),
                        ),
                    ),
                );
            }
            window.Footer = Footer;
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "ui_kits/website/Footer.jsx",
            error: String((e && e.message) || e),
        });
    }

    // ui_kits/website/Hero.jsx
    try {
        (() => {
            /* Hero — rotating institutional banner (two slides), navy gradient + ECG motif.
   Image placeholders mark where the brand photography (ambulances, equipe) goes. */
            const { Button, Icon, Badge } =
                window.RealVidasDesignSystem_066fed;
            const SLIDES = [
                {
                    eyebrow: "Remoções e emergências 24h",
                    title: "Sua vida, nossa missão.",
                    body: "Emergências médicas, ambulâncias, remoção de pacientes e atendimento domiciliar — agilidade e segurança a qualquer hora.",
                    primary: "Solicite um orçamento",
                    grad: "var(--grad-institutional)",
                },
                {
                    eyebrow: "UTI móvel para eventos",
                    title: "Cobertura de eventos de todos os portes.",
                    body: "De encontros empresariais a shows e jogos de futebol — equipe médica preparada para urgência e emergência clínica.",
                    primary: "Ver planos",
                    grad: "linear-gradient(160deg, var(--orange-600) 0%, var(--blue-950) 100%)",
                },
            ];
            function Hero({ onNavigate }) {
                const [i, setI] = React.useState(0);
                React.useEffect(() => {
                    const t = setInterval(
                        () => setI((p) => (p + 1) % SLIDES.length),
                        6000,
                    );
                    return () => clearInterval(t);
                }, []);
                const s = SLIDES[i];
                return /*#__PURE__*/ React.createElement(
                    "section",
                    {
                        style: {
                            position: "relative",
                            background: s.grad,
                            color: "#fff",
                            overflow: "hidden",
                            transition:
                                "background var(--dur-slower) var(--ease-in-out)",
                        },
                    },
                    /*#__PURE__*/ React.createElement(
                        "svg",
                        {
                            viewBox: "0 0 1200 300",
                            preserveAspectRatio: "none",
                            "aria-hidden": "true",
                            style: {
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                opacity: 0.1,
                            },
                        },
                        /*#__PURE__*/ React.createElement("path", {
                            d: "M0 160 H360 L410 60 L470 250 L520 120 L560 160 H1200",
                            fill: "none",
                            stroke: "#fff",
                            strokeWidth: "3",
                        }),
                    ),
                    /*#__PURE__*/ React.createElement(
                        "div",
                        {
                            style: {
                                position: "relative",
                                maxWidth: "var(--container-xl)",
                                margin: "0 auto",
                                padding:
                                    "clamp(3rem,7vw,6rem) var(--gutter)",
                                display: "grid",
                                gridTemplateColumns:
                                    "minmax(0,1.1fr) minmax(0,0.9fr)",
                                gap: "var(--space-12)",
                                alignItems: "center",
                            },
                            className: "rv-hero-grid",
                        },
                        /*#__PURE__*/ React.createElement(
                            "div",
                            null,
                            /*#__PURE__*/ React.createElement(
                                Badge,
                                {
                                    tone: "solid",
                                    dot: true,
                                    pulse: true,
                                    style: {
                                        marginBottom:
                                            "var(--space-5)",
                                    },
                                },
                                s.eyebrow,
                            ),
                            /*#__PURE__*/ React.createElement(
                                "h1",
                                {
                                    style: {
                                        fontFamily:
                                            "var(--font-display)",
                                        fontWeight:
                                            "var(--fw-extrabold)",
                                        fontSize:
                                            "clamp(2.25rem,5vw,3.75rem)",
                                        lineHeight:
                                            "var(--leading-tight)",
                                        letterSpacing:
                                            "var(--tracking-tight)",
                                        margin: 0,
                                        color: "#fff",
                                        textWrap: "balance",
                                    },
                                },
                                s.title,
                            ),
                            /*#__PURE__*/ React.createElement(
                                "p",
                                {
                                    style: {
                                        fontFamily:
                                            "var(--font-body)",
                                        fontSize: "var(--text-md)",
                                        lineHeight:
                                            "var(--leading-relaxed)",
                                        color: "rgba(255,255,255,0.9)",
                                        margin: "var(--space-5) 0 var(--space-8)",
                                        maxWidth: 520,
                                    },
                                },
                                s.body,
                            ),
                            /*#__PURE__*/ React.createElement(
                                "div",
                                {
                                    style: {
                                        display: "flex",
                                        gap: "var(--space-3)",
                                        flexWrap: "wrap",
                                    },
                                },
                                /*#__PURE__*/ React.createElement(
                                    Button,
                                    {
                                        variant: "primary",
                                        size: "lg",
                                        leftIcon:
                                            /*#__PURE__*/ React.createElement(
                                                Icon,
                                                {
                                                    name: "whatsapp",
                                                    size: 20,
                                                },
                                            ),
                                        href: "https://api.whatsapp.com/send?phone=5512997151128",
                                    },
                                    s.primary,
                                ),
                                /*#__PURE__*/ React.createElement(
                                    Button,
                                    {
                                        variant: "outline",
                                        size: "lg",
                                        onClick: () =>
                                            onNavigate("servicos"),
                                        style: {
                                            color: "#fff",
                                            borderColor:
                                                "rgba(255,255,255,0.5)",
                                        },
                                        rightIcon:
                                            /*#__PURE__*/ React.createElement(
                                                Icon,
                                                {
                                                    name: "arrow-right",
                                                    size: 18,
                                                },
                                            ),
                                    },
                                    "Nossos servi\xE7os",
                                ),
                            ),
                            /*#__PURE__*/ React.createElement(
                                "div",
                                {
                                    style: {
                                        display: "flex",
                                        gap: 8,
                                        marginTop: "var(--space-8)",
                                    },
                                },
                                SLIDES.map((_, idx) =>
                                    /*#__PURE__*/ React.createElement(
                                        "button",
                                        {
                                            key: idx,
                                            "aria-label": `Slide ${idx + 1}`,
                                            onClick: () => setI(idx),
                                            style: {
                                                width:
                                                    idx === i
                                                        ? 28
                                                        : 10,
                                                height: 10,
                                                borderRadius:
                                                    "var(--radius-pill)",
                                                border: "none",
                                                background:
                                                    idx === i
                                                        ? "#fff"
                                                        : "rgba(255,255,255,0.45)",
                                                cursor: "pointer",
                                                transition:
                                                    "width var(--dur-base) var(--ease-out)",
                                            },
                                        },
                                    ),
                                ),
                            ),
                        ),
                        /*#__PURE__*/ React.createElement(
                            "div",
                            {
                                className: "rv-hide-md",
                                style: {
                                    position: "relative",
                                    aspectRatio: "4/3",
                                    borderRadius: "var(--radius-2xl)",
                                    background:
                                        "rgba(255,255,255,0.08)",
                                    border: "1px solid rgba(255,255,255,0.18)",
                                    backdropFilter:
                                        "blur(var(--blur-sm))",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "var(--space-3)",
                                    color: "rgba(255,255,255,0.78)",
                                },
                            },
                            /*#__PURE__*/ React.createElement(Icon, {
                                name: "truck",
                                size: 64,
                            }),
                            /*#__PURE__*/ React.createElement(
                                "span",
                                {
                                    style: {
                                        fontFamily:
                                            "var(--font-display)",
                                        fontWeight:
                                            "var(--fw-semibold)",
                                        fontSize: "var(--text-sm)",
                                        letterSpacing: "0.04em",
                                        textTransform: "uppercase",
                                    },
                                },
                                "Foto da frota / equipe",
                            ),
                            /*#__PURE__*/ React.createElement(
                                "span",
                                {
                                    style: {
                                        fontFamily:
                                            "var(--font-body)",
                                        fontSize: "var(--text-xs)",
                                        opacity: 0.7,
                                    },
                                },
                                "placeholder \u2014 inserir imagem real",
                            ),
                        ),
                    ),
                );
            }
            window.Hero = Hero;
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "ui_kits/website/Hero.jsx",
            error: String((e && e.message) || e),
        });
    }

    // ui_kits/website/PlansSection.jsx
    try {
        (() => {
            function _extends() {
                return (
                    (_extends = Object.assign
                        ? Object.assign.bind()
                        : function (n) {
                              for (
                                  var e = 1;
                                  e < arguments.length;
                                  e++
                              ) {
                                  var t = arguments[e];
                                  for (var r in t)
                                      ({}).hasOwnProperty.call(
                                          t,
                                          r,
                                      ) && (n[r] = t[r]);
                              }
                              return n;
                          }),
                    _extends.apply(null, arguments)
                );
            }
            /* PlansSection — Associe-se: the four membership offerings. */
            const { PlanCard, Icon } =
                window.RealVidasDesignSystem_066fed;
            const PLANS = [
                {
                    tier: "bronze",
                    name: "Plano Bronze",
                    coverage: "08 horas de cobertura",
                    features: [
                        "Remoções simples",
                        "Enfermagem a bordo",
                        "Agendamento por WhatsApp",
                    ],
                },
                {
                    tier: "prata",
                    name: "Plano Prata",
                    coverage: "12 horas de cobertura",
                    features: [
                        "Tudo do Bronze",
                        "Remoção emergencial",
                        "Equipe de plantão",
                    ],
                },
                {
                    tier: "ouro",
                    name: "Plano Ouro",
                    coverage: "24 horas de cobertura",
                    featured: true,
                    features: [
                        "Tudo do Prata",
                        "UTI móvel 24h",
                        "Cobertura de eventos",
                        "Atendimento prioritário",
                    ],
                },
                {
                    tier: "custom",
                    name: "Remoções particulares",
                    coverage: "Emergência e hora marcada",
                    features: [
                        "Sob demanda",
                        "Orçamento personalizado",
                        "Pagamento em até 12x",
                    ],
                },
            ];
            function PlansSection() {
                return /*#__PURE__*/ React.createElement(
                    "section",
                    {
                        style: {
                            background: "var(--bg-canvas)",
                            padding:
                                "clamp(3rem,6vw,5rem) var(--gutter)",
                        },
                    },
                    /*#__PURE__*/ React.createElement(
                        "div",
                        {
                            style: {
                                maxWidth: "var(--container-xl)",
                                margin: "0 auto",
                            },
                        },
                        /*#__PURE__*/ React.createElement(
                            "div",
                            {
                                style: {
                                    textAlign: "center",
                                    maxWidth: 640,
                                    margin: "0 auto var(--space-12)",
                                },
                            },
                            /*#__PURE__*/ React.createElement(
                                "span",
                                {
                                    className: "rv-eyebrow",
                                },
                                "Associe-se",
                            ),
                            /*#__PURE__*/ React.createElement(
                                "h2",
                                {
                                    style: {
                                        fontFamily:
                                            "var(--font-display)",
                                        fontWeight:
                                            "var(--fw-extrabold)",
                                        fontSize: "var(--text-2xl)",
                                        color: "var(--text-strong)",
                                        margin: "var(--space-3) 0 var(--space-3)",
                                    },
                                },
                                "Planos que se adaptam \xE0 sua necessidade",
                            ),
                            /*#__PURE__*/ React.createElement(
                                "p",
                                {
                                    className: "rv-lead",
                                    style: {
                                        margin: 0,
                                    },
                                },
                                "Modelos de servi\xE7o e atendimento para diferentes aplica\xE7\xF5es. Conhe\xE7a os detalhes e fale com a gente.",
                            ),
                        ),
                        /*#__PURE__*/ React.createElement(
                            "div",
                            {
                                style: {
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(240px, 1fr))",
                                    gap: "var(--space-5)",
                                    alignItems: "stretch",
                                },
                            },
                            PLANS.map((p) =>
                                /*#__PURE__*/ React.createElement(
                                    PlanCard,
                                    _extends(
                                        {
                                            key: p.name,
                                        },
                                        p,
                                        {
                                            cta: "Conhe\xE7a em detalhes",
                                            href: "#",
                                        },
                                    ),
                                ),
                            ),
                        ),
                    ),
                );
            }
            window.PlansSection = PlansSection;
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "ui_kits/website/PlansSection.jsx",
            error: String((e && e.message) || e),
        });
    }

    // ui_kits/website/QuoteForm.jsx
    try {
        (() => {
            /* QuoteForm — "Solicite seu orçamento". Interactive: validates required
   fields and shows a success Alert on submit. */
            const {
                Field,
                Input,
                Select,
                Textarea,
                Checkbox,
                Button,
                Alert,
                Icon,
                Card,
            } = window.RealVidasDesignSystem_066fed;
            const UF = ["SP", "RJ", "MG", "ES", "PR"].map((v) => ({
                value: v,
                label: v,
            }));
            function QuoteForm() {
                const [sent, setSent] = React.useState(false);
                const [errs, setErrs] = React.useState({});
                const [form, setForm] = React.useState({
                    nome: "",
                    email: "",
                    tel: "",
                    cidadeO: "",
                    ufO: "SP",
                    endO: "",
                    data: "",
                    hora: "",
                    cidadeD: "",
                    ufD: "SP",
                    endD: "",
                    obs: "",
                });
                const set = (k) => (e) =>
                    setForm({
                        ...form,
                        [k]: e.target.value,
                    });
                const submit = (e) => {
                    e.preventDefault();
                    const req = [
                        "nome",
                        "email",
                        "tel",
                        "cidadeO",
                        "cidadeD",
                    ];
                    const next = {};
                    req.forEach((k) => {
                        if (!form[k].trim())
                            next[k] = "Campo obrigatório";
                    });
                    setErrs(next);
                    if (Object.keys(next).length === 0) {
                        setSent(true);
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                        });
                    }
                };
                return /*#__PURE__*/ React.createElement(
                    "section",
                    {
                        style: {
                            background: "var(--bg-subtle)",
                            padding:
                                "clamp(3rem,6vw,5rem) var(--gutter)",
                        },
                    },
                    /*#__PURE__*/ React.createElement(
                        "div",
                        {
                            style: {
                                maxWidth: "var(--container-lg)",
                                margin: "0 auto",
                            },
                        },
                        /*#__PURE__*/ React.createElement(
                            "div",
                            {
                                style: {
                                    textAlign: "center",
                                    maxWidth: 600,
                                    margin: "0 auto var(--space-8)",
                                },
                            },
                            /*#__PURE__*/ React.createElement(
                                "span",
                                {
                                    className: "rv-eyebrow",
                                },
                                "Fale conosco",
                            ),
                            /*#__PURE__*/ React.createElement(
                                "h2",
                                {
                                    style: {
                                        fontFamily:
                                            "var(--font-display)",
                                        fontWeight:
                                            "var(--fw-extrabold)",
                                        fontSize: "var(--text-2xl)",
                                        color: "var(--text-strong)",
                                        margin: "var(--space-3) 0 var(--space-3)",
                                    },
                                },
                                "Solicite seu or\xE7amento",
                            ),
                            /*#__PURE__*/ React.createElement(
                                "p",
                                {
                                    className: "rv-lead",
                                    style: {
                                        margin: 0,
                                    },
                                },
                                "Para remo\xE7\xF5es, preencha os dados abaixo. Para outros servi\xE7os, fale com a gente pelo WhatsApp.",
                            ),
                        ),
                        /*#__PURE__*/ React.createElement(
                            Card,
                            {
                                variant: "elevated",
                                padding: "clamp(1.5rem,4vw,2.5rem)",
                            },
                            sent &&
                                /*#__PURE__*/ React.createElement(
                                    Alert,
                                    {
                                        tone: "success",
                                        title: "Or\xE7amento enviado!",
                                        style: {
                                            marginBottom:
                                                "var(--space-6)",
                                        },
                                    },
                                    "Recebemos sua solicita\xE7\xE3o. Nossa equipe retornar\xE1 em instantes pelo telefone ou WhatsApp informado.",
                                ),
                            /*#__PURE__*/ React.createElement(
                                "form",
                                {
                                    onSubmit: submit,
                                    style: {
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "var(--space-6)",
                                    },
                                },
                                /*#__PURE__*/ React.createElement(
                                    "div",
                                    {
                                        className: "rv-form-grid",
                                        style: {
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(3, 1fr)",
                                            gap: "var(--space-4)",
                                        },
                                    },
                                    /*#__PURE__*/ React.createElement(
                                        Field,
                                        {
                                            label: "Seu nome",
                                            htmlFor: "q-nome",
                                            required: true,
                                            error: errs.nome,
                                        },
                                        /*#__PURE__*/ React.createElement(
                                            Input,
                                            {
                                                id: "q-nome",
                                                value: form.nome,
                                                onChange: set("nome"),
                                                invalid: !!errs.nome,
                                                placeholder:
                                                    "Nome completo",
                                            },
                                        ),
                                    ),
                                    /*#__PURE__*/ React.createElement(
                                        Field,
                                        {
                                            label: "E-mail",
                                            htmlFor: "q-email",
                                            required: true,
                                            error: errs.email,
                                        },
                                        /*#__PURE__*/ React.createElement(
                                            Input,
                                            {
                                                id: "q-email",
                                                type: "email",
                                                value: form.email,
                                                onChange:
                                                    set("email"),
                                                invalid: !!errs.email,
                                                placeholder:
                                                    "voce@email.com",
                                            },
                                        ),
                                    ),
                                    /*#__PURE__*/ React.createElement(
                                        Field,
                                        {
                                            label: "Telefone / Celular",
                                            htmlFor: "q-tel",
                                            required: true,
                                            error: errs.tel,
                                        },
                                        /*#__PURE__*/ React.createElement(
                                            Input,
                                            {
                                                id: "q-tel",
                                                value: form.tel,
                                                onChange: set("tel"),
                                                invalid: !!errs.tel,
                                                leftIcon:
                                                    /*#__PURE__*/ React.createElement(
                                                        Icon,
                                                        {
                                                            name: "phone",
                                                            size: 16,
                                                        },
                                                    ),
                                                placeholder:
                                                    "(12) 99715-1128",
                                            },
                                        ),
                                    ),
                                ),
                                /*#__PURE__*/ React.createElement(
                                    "div",
                                    null,
                                    /*#__PURE__*/ React.createElement(
                                        "div",
                                        {
                                            className: "rv-eyebrow",
                                            style: {
                                                color: "var(--secondary)",
                                                marginBottom:
                                                    "var(--space-3)",
                                            },
                                        },
                                        "Origem",
                                    ),
                                    /*#__PURE__*/ React.createElement(
                                        "div",
                                        {
                                            className:
                                                "rv-form-grid3",
                                            style: {
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "2fr 1fr 3fr",
                                                gap: "var(--space-4)",
                                            },
                                        },
                                        /*#__PURE__*/ React.createElement(
                                            Field,
                                            {
                                                label: "Cidade",
                                                htmlFor: "q-co",
                                                required: true,
                                                error: errs.cidadeO,
                                            },
                                            /*#__PURE__*/ React.createElement(
                                                Input,
                                                {
                                                    id: "q-co",
                                                    value: form.cidadeO,
                                                    onChange:
                                                        set(
                                                            "cidadeO",
                                                        ),
                                                    invalid:
                                                        !!errs.cidadeO,
                                                    placeholder:
                                                        "Pindamonhangaba",
                                                },
                                            ),
                                        ),
                                        /*#__PURE__*/ React.createElement(
                                            Field,
                                            {
                                                label: "Estado",
                                                htmlFor: "q-ufo",
                                            },
                                            /*#__PURE__*/ React.createElement(
                                                Select,
                                                {
                                                    id: "q-ufo",
                                                    options: UF,
                                                    value: form.ufO,
                                                    onChange:
                                                        set("ufO"),
                                                },
                                            ),
                                        ),
                                        /*#__PURE__*/ React.createElement(
                                            Field,
                                            {
                                                label: "Endere\xE7o completo",
                                                htmlFor: "q-eo",
                                            },
                                            /*#__PURE__*/ React.createElement(
                                                Input,
                                                {
                                                    id: "q-eo",
                                                    value: form.endO,
                                                    onChange:
                                                        set("endO"),
                                                    placeholder:
                                                        "Rua, n\xBA, bairro",
                                                },
                                            ),
                                        ),
                                    ),
                                    /*#__PURE__*/ React.createElement(
                                        "div",
                                        {
                                            style: {
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "1fr 1fr",
                                                gap: "var(--space-4)",
                                                marginTop:
                                                    "var(--space-4)",
                                            },
                                        },
                                        /*#__PURE__*/ React.createElement(
                                            Field,
                                            {
                                                label: "Data para remo\xE7\xE3o",
                                                htmlFor: "q-data",
                                            },
                                            /*#__PURE__*/ React.createElement(
                                                Input,
                                                {
                                                    id: "q-data",
                                                    type: "date",
                                                    value: form.data,
                                                    onChange:
                                                        set("data"),
                                                },
                                            ),
                                        ),
                                        /*#__PURE__*/ React.createElement(
                                            Field,
                                            {
                                                label: "Hora",
                                                htmlFor: "q-hora",
                                            },
                                            /*#__PURE__*/ React.createElement(
                                                Input,
                                                {
                                                    id: "q-hora",
                                                    type: "time",
                                                    value: form.hora,
                                                    onChange:
                                                        set("hora"),
                                                },
                                            ),
                                        ),
                                    ),
                                ),
                                /*#__PURE__*/ React.createElement(
                                    "div",
                                    null,
                                    /*#__PURE__*/ React.createElement(
                                        "div",
                                        {
                                            className: "rv-eyebrow",
                                            style: {
                                                color: "var(--secondary)",
                                                marginBottom:
                                                    "var(--space-3)",
                                            },
                                        },
                                        "Destino",
                                    ),
                                    /*#__PURE__*/ React.createElement(
                                        "div",
                                        {
                                            className:
                                                "rv-form-grid3",
                                            style: {
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "2fr 1fr 3fr",
                                                gap: "var(--space-4)",
                                            },
                                        },
                                        /*#__PURE__*/ React.createElement(
                                            Field,
                                            {
                                                label: "Cidade",
                                                htmlFor: "q-cd",
                                                required: true,
                                                error: errs.cidadeD,
                                            },
                                            /*#__PURE__*/ React.createElement(
                                                Input,
                                                {
                                                    id: "q-cd",
                                                    value: form.cidadeD,
                                                    onChange:
                                                        set(
                                                            "cidadeD",
                                                        ),
                                                    invalid:
                                                        !!errs.cidadeD,
                                                    placeholder:
                                                        "S\xE3o Jos\xE9 dos Campos",
                                                },
                                            ),
                                        ),
                                        /*#__PURE__*/ React.createElement(
                                            Field,
                                            {
                                                label: "Estado",
                                                htmlFor: "q-ufd",
                                            },
                                            /*#__PURE__*/ React.createElement(
                                                Select,
                                                {
                                                    id: "q-ufd",
                                                    options: UF,
                                                    value: form.ufD,
                                                    onChange:
                                                        set("ufD"),
                                                },
                                            ),
                                        ),
                                        /*#__PURE__*/ React.createElement(
                                            Field,
                                            {
                                                label: "Endere\xE7o completo",
                                                htmlFor: "q-ed",
                                            },
                                            /*#__PURE__*/ React.createElement(
                                                Input,
                                                {
                                                    id: "q-ed",
                                                    value: form.endD,
                                                    onChange:
                                                        set("endD"),
                                                    placeholder:
                                                        "Hospital, unidade\u2026",
                                                },
                                            ),
                                        ),
                                    ),
                                ),
                                /*#__PURE__*/ React.createElement(
                                    Field,
                                    {
                                        label: "Observa\xE7\xF5es extras",
                                        htmlFor: "q-obs",
                                    },
                                    /*#__PURE__*/ React.createElement(
                                        Textarea,
                                        {
                                            id: "q-obs",
                                            rows: 3,
                                            value: form.obs,
                                            onChange: set("obs"),
                                            placeholder:
                                                "Condi\xE7\xE3o do paciente, necessidade de UTI, acompanhantes\u2026",
                                        },
                                    ),
                                ),
                                /*#__PURE__*/ React.createElement(
                                    Checkbox,
                                    {
                                        label: "Autorizo o contato pelo WhatsApp informado.",
                                        defaultChecked: true,
                                    },
                                ),
                                /*#__PURE__*/ React.createElement(
                                    "div",
                                    {
                                        style: {
                                            display: "flex",
                                            gap: "var(--space-3)",
                                            flexWrap: "wrap",
                                        },
                                    },
                                    /*#__PURE__*/ React.createElement(
                                        Button,
                                        {
                                            type: "submit",
                                            variant: "primary",
                                            size: "lg",
                                            leftIcon:
                                                /*#__PURE__*/ React.createElement(
                                                    Icon,
                                                    {
                                                        name: "send",
                                                        size: 18,
                                                    },
                                                ),
                                        },
                                        "Enviar solicita\xE7\xE3o",
                                    ),
                                    /*#__PURE__*/ React.createElement(
                                        Button,
                                        {
                                            type: "button",
                                            variant: "whatsapp",
                                            size: "lg",
                                            leftIcon:
                                                /*#__PURE__*/ React.createElement(
                                                    Icon,
                                                    {
                                                        name: "whatsapp",
                                                        size: 20,
                                                    },
                                                ),
                                            href: "https://api.whatsapp.com/send?phone=5512997151128",
                                        },
                                        "Falar no WhatsApp",
                                    ),
                                ),
                            ),
                        ),
                    ),
                );
            }
            window.QuoteForm = QuoteForm;
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "ui_kits/website/QuoteForm.jsx",
            error: String((e && e.message) || e),
        });
    }

    // ui_kits/website/ServicesSection.jsx
    try {
        (() => {
            /* ServicesSection — the nine Real Vidas services as ServiceCards. */
            const { ServiceCard, Icon } =
                window.RealVidasDesignSystem_066fed;
            const SERVICES = [
                {
                    icon: "truck",
                    title: "Transporte terrestre de pacientes",
                    description:
                        "Transferência segura e eficiente em ambulâncias equipadas — emergências, acidentes e remoções hospitalares.",
                },
                {
                    icon: "plane",
                    title: "Transporte aéreo em UTI",
                    description:
                        "Aeronaves com suporte avançado de vida e tripulação de médicos e enfermeiros especializados.",
                },
                {
                    icon: "heart-pulse",
                    title: "Resgate 24 horas",
                    description:
                        "Atendimento de emergência médica disponível 24h por dia, todos os dias da semana.",
                },
                {
                    icon: "users",
                    title: "Cobertura de eventos",
                    description:
                        "Atendimento imediato por profissional especializado em qualquer situação de urgência.",
                },
                {
                    icon: "shield-check",
                    title: "Postos médicos",
                    description:
                        "Montagem e gestão de ambulatórios pontuais ou permanentes para sua empresa.",
                },
                {
                    icon: "graduation-cap",
                    title: "Educação continuada",
                    description:
                        "Capacitação atualizada para técnicos, enfermeiros e médicos.",
                },
                {
                    icon: "file-text",
                    title: "Planos de emergência",
                    description:
                        "Elaboração e execução de PAE com procedimentos estruturados de resposta.",
                },
                {
                    icon: "flame",
                    title: "Bombeiros profissionais",
                    description:
                        "Equipes civis para proteção de pessoas e patrimônios contra riscos de acidentes.",
                },
                {
                    icon: "star",
                    title: "Certificações",
                    description:
                        "PHTLS · ACLS · ATLS · PALS · AMLS · BLS — treinamento e atualização.",
                },
            ];
            function ServicesSection({ compact }) {
                return /*#__PURE__*/ React.createElement(
                    "section",
                    {
                        style: {
                            background: "var(--bg-canvas)",
                            padding:
                                "clamp(3rem,6vw,5rem) var(--gutter)",
                        },
                    },
                    /*#__PURE__*/ React.createElement(
                        "div",
                        {
                            style: {
                                maxWidth: "var(--container-xl)",
                                margin: "0 auto",
                            },
                        },
                        /*#__PURE__*/ React.createElement(
                            "div",
                            {
                                style: {
                                    textAlign: "center",
                                    maxWidth: 640,
                                    margin: "0 auto var(--space-12)",
                                },
                            },
                            /*#__PURE__*/ React.createElement(
                                "span",
                                {
                                    className: "rv-eyebrow",
                                },
                                "O que fazemos",
                            ),
                            /*#__PURE__*/ React.createElement(
                                "h2",
                                {
                                    style: {
                                        fontFamily:
                                            "var(--font-display)",
                                        fontWeight:
                                            "var(--fw-extrabold)",
                                        fontSize: "var(--text-2xl)",
                                        color: "var(--text-strong)",
                                        margin: "var(--space-3) 0 var(--space-3)",
                                    },
                                },
                                "Servi\xE7os de emerg\xEAncia e remo\xE7\xE3o",
                            ),
                            /*#__PURE__*/ React.createElement(
                                "p",
                                {
                                    className: "rv-lead",
                                    style: {
                                        margin: 0,
                                    },
                                },
                                "Estrutura completa para urg\xEAncia e emerg\xEAncia m\xE9dica, com equipe treinada e equipamentos de \xFAltima gera\xE7\xE3o.",
                            ),
                        ),
                        /*#__PURE__*/ React.createElement(
                            "div",
                            {
                                style: {
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fill, minmax(280px, 1fr))",
                                    gap: "var(--space-5)",
                                },
                            },
                            (compact
                                ? SERVICES.slice(0, 6)
                                : SERVICES
                            ).map((s) =>
                                /*#__PURE__*/ React.createElement(
                                    ServiceCard,
                                    {
                                        key: s.title,
                                        icon: /*#__PURE__*/ React.createElement(
                                            Icon,
                                            {
                                                name: s.icon,
                                                size: 26,
                                            },
                                        ),
                                        title: s.title,
                                        description: s.description,
                                        href: "#",
                                    },
                                ),
                            ),
                        ),
                    ),
                );
            }
            window.ServicesSection = ServicesSection;
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "ui_kits/website/ServicesSection.jsx",
            error: String((e && e.message) || e),
        });
    }

    // ui_kits/website/SiteHeader.jsx
    try {
        (() => {
            /* SiteHeader — contact strip + main nav + theme toggle + WhatsApp CTA.
   Drives the single-page kit via onNavigate(pageId). */
            const {
                Logo,
                Button,
                IconButton,
                ThemeToggle,
                Icon,
                Badge,
            } = window.RealVidasDesignSystem_066fed;
            function SiteHeader({ page, onNavigate }) {
                const [open, setOpen] = React.useState(false);
                const nav = [
                    {
                        id: "inicio",
                        label: "Início",
                    },
                    {
                        id: "empresa",
                        label: "A Empresa",
                    },
                    {
                        id: "servicos",
                        label: "Serviços",
                    },
                    {
                        id: "planos",
                        label: "Associe-se",
                    },
                    {
                        id: "contato",
                        label: "Fale Conosco",
                    },
                ];
                return /*#__PURE__*/ React.createElement(
                    "header",
                    {
                        style: {
                            position: "sticky",
                            top: 0,
                            zIndex: "var(--z-header)",
                        },
                    },
                    /*#__PURE__*/ React.createElement(
                        "div",
                        {
                            style: {
                                background: "var(--secondary)",
                                color: "#fff",
                            },
                        },
                        /*#__PURE__*/ React.createElement(
                            "div",
                            {
                                style: {
                                    maxWidth: "var(--container-xl)",
                                    margin: "0 auto",
                                    padding: "7px var(--gutter)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "var(--space-4)",
                                    fontSize: "var(--text-sm)",
                                },
                            },
                            /*#__PURE__*/ React.createElement(
                                "div",
                                {
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "var(--space-2)",
                                        opacity: 0.92,
                                    },
                                },
                                /*#__PURE__*/ React.createElement(
                                    Icon,
                                    {
                                        name: "map-pin",
                                        size: 15,
                                    },
                                ),
                                /*#__PURE__*/ React.createElement(
                                    "span",
                                    null,
                                    "Pindamonhangaba \xB7 S\xE3o Paulo",
                                ),
                            ),
                            /*#__PURE__*/ React.createElement(
                                "div",
                                {
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "var(--space-5)",
                                    },
                                },
                                /*#__PURE__*/ React.createElement(
                                    "a",
                                    {
                                        href: "tel:+5512997151128",
                                        style: {
                                            color: "#fff",
                                            display: "inline-flex",
                                            gap: 6,
                                            alignItems: "center",
                                            textDecoration: "none",
                                            fontWeight:
                                                "var(--fw-semibold)",
                                        },
                                    },
                                    /*#__PURE__*/ React.createElement(
                                        Icon,
                                        {
                                            name: "phone",
                                            size: 15,
                                        },
                                    ),
                                    "(12) 99715-1128",
                                ),
                                /*#__PURE__*/ React.createElement(
                                    "a",
                                    {
                                        href: "mailto:faleconosco@realvidas.com.br",
                                        style: {
                                            color: "#fff",
                                            display: "inline-flex",
                                            gap: 6,
                                            alignItems: "center",
                                            textDecoration: "none",
                                            opacity: 0.92,
                                        },
                                    },
                                    /*#__PURE__*/ React.createElement(
                                        Icon,
                                        {
                                            name: "mail",
                                            size: 15,
                                        },
                                    ),
                                    /*#__PURE__*/ React.createElement(
                                        "span",
                                        {
                                            className: "rv-hide-sm",
                                        },
                                        "faleconosco@realvidas.com.br",
                                    ),
                                ),
                            ),
                        ),
                    ),
                    /*#__PURE__*/ React.createElement(
                        "div",
                        {
                            style: {
                                background: "var(--surface)",
                                borderBottom:
                                    "var(--border-w) solid var(--border)",
                                boxShadow: "var(--shadow-xs)",
                            },
                        },
                        /*#__PURE__*/ React.createElement(
                            "div",
                            {
                                style: {
                                    maxWidth: "var(--container-xl)",
                                    margin: "0 auto",
                                    padding:
                                        "var(--space-3) var(--gutter)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "var(--space-4)",
                                },
                            },
                            /*#__PURE__*/ React.createElement(
                                "button",
                                {
                                    onClick: () =>
                                        onNavigate("inicio"),
                                    style: {
                                        border: "none",
                                        background: "transparent",
                                        cursor: "pointer",
                                        padding: 0,
                                    },
                                    "aria-label": "In\xEDcio",
                                },
                                /*#__PURE__*/ React.createElement(
                                    Logo,
                                    {
                                        variant: "full",
                                        size: 40,
                                    },
                                ),
                            ),
                            /*#__PURE__*/ React.createElement(
                                "nav",
                                {
                                    className: "rv-nav",
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "var(--space-6)",
                                    },
                                },
                                nav.map((n) => {
                                    const active = n.id === page;
                                    return /*#__PURE__*/ React.createElement(
                                        "button",
                                        {
                                            key: n.id,
                                            onClick: () =>
                                                onNavigate(n.id),
                                            style: {
                                                border: "none",
                                                background:
                                                    "transparent",
                                                cursor: "pointer",
                                                padding:
                                                    "var(--space-2) 0",
                                                fontFamily:
                                                    "var(--font-display)",
                                                fontWeight:
                                                    "var(--fw-semibold)",
                                                fontSize:
                                                    "var(--text-base)",
                                                color: active
                                                    ? "var(--brand)"
                                                    : "var(--text-body)",
                                                borderBottom: `2px solid ${active ? "var(--brand)" : "transparent"}`,
                                                transition:
                                                    "color var(--dur-fast) var(--ease-out)",
                                            },
                                        },
                                        n.label,
                                    );
                                }),
                            ),
                            /*#__PURE__*/ React.createElement(
                                "div",
                                {
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "var(--space-2)",
                                    },
                                },
                                /*#__PURE__*/ React.createElement(
                                    ThemeToggle,
                                    null,
                                ),
                                /*#__PURE__*/ React.createElement(
                                    "div",
                                    {
                                        className: "rv-hide-sm",
                                    },
                                    /*#__PURE__*/ React.createElement(
                                        Button,
                                        {
                                            variant: "whatsapp",
                                            leftIcon:
                                                /*#__PURE__*/ React.createElement(
                                                    Icon,
                                                    {
                                                        name: "whatsapp",
                                                        size: 18,
                                                    },
                                                ),
                                            href: "https://api.whatsapp.com/send?phone=5512997151128",
                                        },
                                        "Or\xE7amento",
                                    ),
                                ),
                                /*#__PURE__*/ React.createElement(
                                    "div",
                                    {
                                        className: "rv-show-sm",
                                    },
                                    /*#__PURE__*/ React.createElement(
                                        IconButton,
                                        {
                                            icon: /*#__PURE__*/ React.createElement(
                                                Icon,
                                                {
                                                    name: open
                                                        ? "x"
                                                        : "menu",
                                                },
                                            ),
                                            label: "Menu",
                                            variant: "outline",
                                            onClick: () =>
                                                setOpen(!open),
                                        },
                                    ),
                                ),
                            ),
                        ),
                        open &&
                            /*#__PURE__*/ React.createElement(
                                "nav",
                                {
                                    className: "rv-show-sm",
                                    style: {
                                        borderTop:
                                            "var(--border-w) solid var(--border)",
                                        padding:
                                            "var(--space-2) var(--gutter) var(--space-4)",
                                        display: "flex",
                                        flexDirection: "column",
                                    },
                                },
                                nav.map((n) =>
                                    /*#__PURE__*/ React.createElement(
                                        "button",
                                        {
                                            key: n.id,
                                            onClick: () => {
                                                onNavigate(n.id);
                                                setOpen(false);
                                            },
                                            style: {
                                                textAlign: "left",
                                                border: "none",
                                                background:
                                                    "transparent",
                                                cursor: "pointer",
                                                padding:
                                                    "var(--space-3) 0",
                                                fontFamily:
                                                    "var(--font-display)",
                                                fontWeight:
                                                    "var(--fw-semibold)",
                                                fontSize:
                                                    "var(--text-md)",
                                                color:
                                                    n.id === page
                                                        ? "var(--brand)"
                                                        : "var(--text-body)",
                                                borderBottom:
                                                    "var(--border-w) solid var(--border-subtle)",
                                            },
                                        },
                                        n.label,
                                    ),
                                ),
                            ),
                    ),
                );
            }
            window.SiteHeader = SiteHeader;
        })();
    } catch (e) {
        __ds_ns.__errors.push({
            path: "ui_kits/website/SiteHeader.jsx",
            error: String((e && e.message) || e),
        });
    }

    __ds_ns.Button = __ds_scope.Button;

    __ds_ns.IconButton = __ds_scope.IconButton;

    __ds_ns.ThemeToggle = __ds_scope.ThemeToggle;

    __ds_ns.EmergencyCTA = __ds_scope.EmergencyCTA;

    __ds_ns.Logo = __ds_scope.Logo;

    __ds_ns.PlanCard = __ds_scope.PlanCard;

    __ds_ns.ServiceCard = __ds_scope.ServiceCard;

    __ds_ns.LOGO_SRC = __ds_scope.LOGO_SRC;

    __ds_ns.Avatar = __ds_scope.Avatar;

    __ds_ns.Badge = __ds_scope.Badge;

    __ds_ns.Card = __ds_scope.Card;

    __ds_ns.Stat = __ds_scope.Stat;

    __ds_ns.Tag = __ds_scope.Tag;

    __ds_ns.Alert = __ds_scope.Alert;

    __ds_ns.ProgressBar = __ds_scope.ProgressBar;

    __ds_ns.Spinner = __ds_scope.Spinner;

    __ds_ns.Checkbox = __ds_scope.Checkbox;

    __ds_ns.Field = __ds_scope.Field;

    __ds_ns.Input = __ds_scope.Input;

    __ds_ns.Select = __ds_scope.Select;

    __ds_ns.Switch = __ds_scope.Switch;

    __ds_ns.Textarea = __ds_scope.Textarea;

    __ds_ns.Icon = __ds_scope.Icon;

    __ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

    __ds_ns.Tabs = __ds_scope.Tabs;
})();
