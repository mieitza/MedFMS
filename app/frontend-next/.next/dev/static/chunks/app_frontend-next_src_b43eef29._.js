(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/frontend-next/src/components/ui/table.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Table",
    ()=>Table,
    "TableBody",
    ()=>TableBody,
    "TableCaption",
    ()=>TableCaption,
    "TableCell",
    ()=>TableCell,
    "TableFooter",
    ()=>TableFooter,
    "TableHead",
    ()=>TableHead,
    "TableHeader",
    ()=>TableHeader,
    "TableRow",
    ()=>TableRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
function Table({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "table-container",
        className: "relative w-full overflow-x-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            "data-slot": "table",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full caption-bottom text-sm", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/app/frontend-next/src/components/ui/table.tsx",
            lineNumber: 13,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/table.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c = Table;
function TableHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
        "data-slot": "table-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_tr]:border-b", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/table.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_c1 = TableHeader;
function TableBody({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
        "data-slot": "table-body",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_tr:last-child]:border-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/table.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_c2 = TableBody;
function TableFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tfoot", {
        "data-slot": "table-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/table.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_c3 = TableFooter;
function TableRow({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        "data-slot": "table-row",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/table.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_c4 = TableRow;
function TableHead({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
        "data-slot": "table-head",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/table.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_c5 = TableHead;
function TableCell({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
        "data-slot": "table-cell",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/table.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
_c6 = TableCell;
function TableCaption({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("caption", {
        "data-slot": "table-caption",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground mt-4 text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/table.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
_c7 = TableCaption;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "Table");
__turbopack_context__.k.register(_c1, "TableHeader");
__turbopack_context__.k.register(_c2, "TableBody");
__turbopack_context__.k.register(_c3, "TableFooter");
__turbopack_context__.k.register(_c4, "TableRow");
__turbopack_context__.k.register(_c5, "TableHead");
__turbopack_context__.k.register(_c6, "TableCell");
__turbopack_context__.k.register(_c7, "TableCaption");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/components/ui/select.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Select",
    ()=>Select,
    "SelectContent",
    ()=>SelectContent,
    "SelectGroup",
    ()=>SelectGroup,
    "SelectItem",
    ()=>SelectItem,
    "SelectLabel",
    ()=>SelectLabel,
    "SelectScrollDownButton",
    ()=>SelectScrollDownButton,
    "SelectScrollUpButton",
    ()=>SelectScrollUpButton,
    "SelectSeparator",
    ()=>SelectSeparator,
    "SelectTrigger",
    ()=>SelectTrigger,
    "SelectValue",
    ()=>SelectValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@radix-ui/react-select/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as CheckIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDownIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUpIcon$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUpIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function Select({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "select",
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = Select;
function SelectGroup({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
        "data-slot": "select-group",
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, this);
}
_c1 = SelectGroup;
function SelectValue({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Value"], {
        "data-slot": "select-value",
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, this);
}
_c2 = SelectValue;
function SelectTrigger({ className, size = "default", children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "select-trigger",
        "data-size": size,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
                    className: "size-4 opacity-50"
                }, void 0, false, {
                    fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c3 = SelectTrigger;
function SelectContent({ className, children, position = "popper", align = "center", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            "data-slot": "select-content",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
            position: position,
            align: align,
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollUpButton, {}, void 0, false, {
                    fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"),
                    children: children
                }, void 0, false, {
                    fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
                    lineNumber: 75,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollDownButton, {}, void 0, false, {
                    fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
                    lineNumber: 84,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
            lineNumber: 62,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
_c4 = SelectContent;
function SelectLabel({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
        "data-slot": "select-label",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground px-2 py-1.5 text-xs", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_c5 = SelectLabel;
function SelectItem({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        "data-slot": "select-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute right-2 flex size-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__["CheckIcon"], {
                        className: "size-4"
                    }, void 0, false, {
                        fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
                        lineNumber: 119,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
                    lineNumber: 118,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemText"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
_c6 = SelectItem;
function SelectSeparator({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        "data-slot": "select-separator",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-border pointer-events-none -mx-1 my-1 h-px", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
        lineNumber: 132,
        columnNumber: 5
    }, this);
}
_c7 = SelectSeparator;
function SelectScrollUpButton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"], {
        "data-slot": "select-scroll-up-button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUpIcon$3e$__["ChevronUpIcon"], {
            className: "size-4"
        }, void 0, false, {
            fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
            lineNumber: 153,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
        lineNumber: 145,
        columnNumber: 5
    }, this);
}
_c8 = SelectScrollUpButton;
function SelectScrollDownButton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"], {
        "data-slot": "select-scroll-down-button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
            className: "size-4"
        }, void 0, false, {
            fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
            lineNumber: 171,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/select.tsx",
        lineNumber: 163,
        columnNumber: 5
    }, this);
}
_c9 = SelectScrollDownButton;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Select");
__turbopack_context__.k.register(_c1, "SelectGroup");
__turbopack_context__.k.register(_c2, "SelectValue");
__turbopack_context__.k.register(_c3, "SelectTrigger");
__turbopack_context__.k.register(_c4, "SelectContent");
__turbopack_context__.k.register(_c5, "SelectLabel");
__turbopack_context__.k.register(_c6, "SelectItem");
__turbopack_context__.k.register(_c7, "SelectSeparator");
__turbopack_context__.k.register(_c8, "SelectScrollUpButton");
__turbopack_context__.k.register(_c9, "SelectScrollDownButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/components/shared/data-table.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataTable",
    ()=>DataTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-table/build/lib/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/table-core/build/lib/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/components/ui/table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/components/ui/skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsLeft$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/lucide-react/dist/esm/icons/chevrons-left.js [app-client] (ecmascript) <export default as ChevronsLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsRight$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/lucide-react/dist/esm/icons/chevrons-right.js [app-client] (ecmascript) <export default as ChevronsRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
function DataTable({ columns, data, loading = false, searchKey, searchPlaceholder = 'Căutare...', showColumnToggle = true, showExport = false, onExport, pageSize: initialPageSize = 10, pageSizeOptions = [
    10,
    20,
    30,
    50,
    100
], serverSide = false, totalItems, currentPage = 1, onPageChange, onPageSizeChange, onSearchChange, onSortChange }) {
    _s();
    const [sorting, setSorting] = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    const [columnFilters, setColumnFilters] = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    const [columnVisibility, setColumnVisibility] = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({});
    const [rowSelection, setRowSelection] = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({});
    const [globalFilter, setGlobalFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('');
    const [pageSize, setPageSize] = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](initialPageSize);
    const table = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useReactTable"])({
        data,
        columns,
        getCoreRowModel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCoreRowModel"])(),
        getPaginationRowModel: serverSide ? undefined : (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPaginationRowModel"])(),
        getSortedRowModel: serverSide ? undefined : (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSortedRowModel"])(),
        getFilteredRowModel: serverSide ? undefined : (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFilteredRowModel"])(),
        onSortingChange: {
            "DataTable.useReactTable[table]": (updater)=>{
                const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
                setSorting(newSorting);
                if (serverSide && onSortChange && newSorting.length > 0) {
                    onSortChange(newSorting[0].id, newSorting[0].desc ? 'desc' : 'asc');
                }
            }
        }["DataTable.useReactTable[table]"],
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
            pagination: serverSide ? undefined : {
                pageIndex: currentPage - 1,
                pageSize
            }
        },
        manualPagination: serverSide,
        manualSorting: serverSide,
        manualFiltering: serverSide,
        pageCount: serverSide && totalItems ? Math.ceil(totalItems / pageSize) : undefined
    });
    // Handle search with debounce for server-side
    const handleSearchChange = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "DataTable.useCallback[handleSearchChange]": (value)=>{
            setGlobalFilter(value);
            if (serverSide && onSearchChange) {
                onSearchChange(value);
            }
        }
    }["DataTable.useCallback[handleSearchChange]"], [
        serverSide,
        onSearchChange
    ]);
    // Handle page size change
    const handlePageSizeChange = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "DataTable.useCallback[handlePageSizeChange]": (newSize)=>{
            setPageSize(newSize);
            if (!serverSide) {
                table.setPageSize(newSize);
            }
            if (serverSide && onPageSizeChange) {
                onPageSizeChange(newSize);
            }
        }
    }["DataTable.useCallback[handlePageSizeChange]"], [
        serverSide,
        onPageSizeChange,
        table
    ]);
    // Calculate pagination info
    const pageCount = serverSide ? Math.ceil((totalItems || 0) / pageSize) : table.getPageCount();
    const canPreviousPage = serverSide ? currentPage > 1 : table.getCanPreviousPage();
    const canNextPage = serverSide ? currentPage < pageCount : table.getCanNextPage();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative w-full sm:max-w-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                            }, void 0, false, {
                                fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                lineNumber: 169,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                placeholder: searchPlaceholder,
                                value: globalFilter,
                                onChange: (e)=>handleSearchChange(e.target.value),
                                className: "pl-9"
                            }, void 0, false, {
                                fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                lineNumber: 170,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            showExport && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                onClick: onExport,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                        className: "mr-2 h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                        lineNumber: 182,
                                        columnNumber: 15
                                    }, this),
                                    "Export"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                lineNumber: 181,
                                columnNumber: 13
                            }, this),
                            showColumnToggle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                        asChild: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "outline",
                                            size: "sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                                    className: "mr-2 h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                                    lineNumber: 191,
                                                    columnNumber: 19
                                                }, this),
                                                "Coloane"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                            lineNumber: 190,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                        lineNumber: 189,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                        align: "end",
                                        className: "w-[200px]",
                                        children: table.getAllColumns().filter((column)=>column.getCanHide()).map((column)=>{
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuCheckboxItem"], {
                                                className: "capitalize",
                                                checked: column.getIsVisible(),
                                                onCheckedChange: (value)=>column.toggleVisibility(!!value),
                                                children: column.id
                                            }, column.id, false, {
                                                fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                                lineNumber: 201,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                        lineNumber: 195,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                lineNumber: 188,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                lineNumber: 166,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg border border-slate-200 dark:border-slate-800",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHeader"], {
                            children: table.getHeaderGroups().map((headerGroup)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                    children: headerGroup.headers.map((header)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                            className: "whitespace-nowrap",
                                            children: header.isPlaceholder ? null : (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["flexRender"])(header.column.columnDef.header, header.getContext())
                                        }, header.id, false, {
                                            fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                            lineNumber: 224,
                                            columnNumber: 19
                                        }, this))
                                }, headerGroup.id, false, {
                                    fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                    lineNumber: 222,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                            lineNumber: 220,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
                            children: loading ? // Loading skeleton
                            Array.from({
                                length: pageSize
                            }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                    children: columns.map((_, j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                className: "h-5 w-full"
                                            }, void 0, false, {
                                                fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                                lineNumber: 240,
                                                columnNumber: 23
                                            }, this)
                                        }, j, false, {
                                            fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                            lineNumber: 239,
                                            columnNumber: 21
                                        }, this))
                                }, i, false, {
                                    fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                    lineNumber: 237,
                                    columnNumber: 17
                                }, this)) : table.getRowModel().rows?.length ? table.getRowModel().rows.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                    "data-state": row.getIsSelected() && 'selected',
                                    className: "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                                    children: row.getVisibleCells().map((cell)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["flexRender"])(cell.column.columnDef.cell, cell.getContext())
                                        }, cell.id, false, {
                                            fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                            lineNumber: 253,
                                            columnNumber: 21
                                        }, this))
                                }, row.id, false, {
                                    fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                    lineNumber: 247,
                                    columnNumber: 17
                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                    colSpan: columns.length,
                                    className: "h-24 text-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col items-center justify-center text-slate-500",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                className: "mb-2 h-8 w-8"
                                            }, void 0, false, {
                                                fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                                lineNumber: 263,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Nu au fost găsite rezultate."
                                            }, void 0, false, {
                                                fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                                lineNumber: 264,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                        lineNumber: 262,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                    lineNumber: 261,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                lineNumber: 260,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                            lineNumber: 233,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                    lineNumber: 219,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                lineNumber: 218,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-slate-500",
                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                            className: "h-5 w-40"
                        }, void 0, false, {
                            fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                            lineNumber: 278,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: serverSide ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    "Se afișează ",
                                    (currentPage - 1) * pageSize + 1,
                                    " -",
                                    ' ',
                                    Math.min(currentPage * pageSize, totalItems || 0),
                                    " din ",
                                    totalItems || 0,
                                    " rezultate"
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    table.getFilteredSelectedRowModel().rows.length,
                                    " din",
                                    ' ',
                                    table.getFilteredRowModel().rows.length,
                                    " rând(uri) selectat(e)"
                                ]
                            }, void 0, true)
                        }, void 0, false)
                    }, void 0, false, {
                        fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                        lineNumber: 276,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-slate-500",
                                        children: "Rânduri:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                        lineNumber: 300,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                        value: String(pageSize),
                                        onValueChange: (value)=>handlePageSizeChange(Number(value)),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                className: "h-8 w-[70px]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                    placeholder: pageSize
                                                }, void 0, false, {
                                                    fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                                    lineNumber: 306,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                                lineNumber: 305,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                children: pageSizeOptions.map((size)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: String(size),
                                                        children: size
                                                    }, size, false, {
                                                        fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                                        lineNumber: 310,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                                lineNumber: 308,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                        lineNumber: 301,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                lineNumber: 299,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm text-slate-500",
                                children: [
                                    "Pagina ",
                                    serverSide ? currentPage : table.getState().pagination.pageIndex + 1,
                                    " din",
                                    ' ',
                                    pageCount || 1
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                lineNumber: 319,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "icon",
                                        className: "h-8 w-8",
                                        onClick: ()=>{
                                            if (serverSide && onPageChange) {
                                                onPageChange(1);
                                            } else {
                                                table.setPageIndex(0);
                                            }
                                        },
                                        disabled: !canPreviousPage,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsLeft$3e$__["ChevronsLeft"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                            lineNumber: 339,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                        lineNumber: 326,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "icon",
                                        className: "h-8 w-8",
                                        onClick: ()=>{
                                            if (serverSide && onPageChange) {
                                                onPageChange(currentPage - 1);
                                            } else {
                                                table.previousPage();
                                            }
                                        },
                                        disabled: !canPreviousPage,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                            lineNumber: 354,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                        lineNumber: 341,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "icon",
                                        className: "h-8 w-8",
                                        onClick: ()=>{
                                            if (serverSide && onPageChange) {
                                                onPageChange(currentPage + 1);
                                            } else {
                                                table.nextPage();
                                            }
                                        },
                                        disabled: !canNextPage,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                            lineNumber: 369,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                        lineNumber: 356,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "icon",
                                        className: "h-8 w-8",
                                        onClick: ()=>{
                                            if (serverSide && onPageChange) {
                                                onPageChange(pageCount);
                                            } else {
                                                table.setPageIndex(pageCount - 1);
                                            }
                                        },
                                        disabled: !canNextPage,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsRight$3e$__["ChevronsRight"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                            lineNumber: 384,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                        lineNumber: 371,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                                lineNumber: 325,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                        lineNumber: 297,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
                lineNumber: 274,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/frontend-next/src/components/shared/data-table.tsx",
        lineNumber: 164,
        columnNumber: 5
    }, this);
}
_s(DataTable, "D3P8pB+ECp25aufoAYForJMB4T4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useReactTable"]
    ];
});
_c = DataTable;
var _c;
__turbopack_context__.k.register(_c, "DataTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/components/ui/alert-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertDialog",
    ()=>AlertDialog,
    "AlertDialogAction",
    ()=>AlertDialogAction,
    "AlertDialogCancel",
    ()=>AlertDialogCancel,
    "AlertDialogContent",
    ()=>AlertDialogContent,
    "AlertDialogDescription",
    ()=>AlertDialogDescription,
    "AlertDialogFooter",
    ()=>AlertDialogFooter,
    "AlertDialogHeader",
    ()=>AlertDialogHeader,
    "AlertDialogOverlay",
    ()=>AlertDialogOverlay,
    "AlertDialogPortal",
    ()=>AlertDialogPortal,
    "AlertDialogTitle",
    ()=>AlertDialogTitle,
    "AlertDialogTrigger",
    ()=>AlertDialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@radix-ui/react-alert-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/components/ui/button.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
function AlertDialog({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "alert-dialog",
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/alert-dialog.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = AlertDialog;
function AlertDialogTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "alert-dialog-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/alert-dialog.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_c1 = AlertDialogTrigger;
function AlertDialogPortal({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        "data-slot": "alert-dialog-portal",
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/alert-dialog.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c2 = AlertDialogPortal;
function AlertDialogOverlay({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        "data-slot": "alert-dialog-overlay",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/alert-dialog.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c3 = AlertDialogOverlay;
function AlertDialogContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDialogOverlay, {}, void 0, false, {
                fileName: "[project]/app/frontend-next/src/components/ui/alert-dialog.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                "data-slot": "alert-dialog-content",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg", className),
                ...props
            }, void 0, false, {
                fileName: "[project]/app/frontend-next/src/components/ui/alert-dialog.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/frontend-next/src/components/ui/alert-dialog.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c4 = AlertDialogContent;
function AlertDialogHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "alert-dialog-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col gap-2 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/alert-dialog.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
_c5 = AlertDialogHeader;
function AlertDialogFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "alert-dialog-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/alert-dialog.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_c6 = AlertDialogFooter;
function AlertDialogTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        "data-slot": "alert-dialog-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/alert-dialog.tsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
_c7 = AlertDialogTitle;
function AlertDialogDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        "data-slot": "alert-dialog-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/alert-dialog.tsx",
        lineNumber: 113,
        columnNumber: 5
    }, this);
}
_c8 = AlertDialogDescription;
function AlertDialogAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Action"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buttonVariants"])(), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/alert-dialog.tsx",
        lineNumber: 126,
        columnNumber: 5
    }, this);
}
_c9 = AlertDialogAction;
function AlertDialogCancel({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cancel"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buttonVariants"])({
            variant: "outline"
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/alert-dialog.tsx",
        lineNumber: 138,
        columnNumber: 5
    }, this);
}
_c10 = AlertDialogCancel;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10;
__turbopack_context__.k.register(_c, "AlertDialog");
__turbopack_context__.k.register(_c1, "AlertDialogTrigger");
__turbopack_context__.k.register(_c2, "AlertDialogPortal");
__turbopack_context__.k.register(_c3, "AlertDialogOverlay");
__turbopack_context__.k.register(_c4, "AlertDialogContent");
__turbopack_context__.k.register(_c5, "AlertDialogHeader");
__turbopack_context__.k.register(_c6, "AlertDialogFooter");
__turbopack_context__.k.register(_c7, "AlertDialogTitle");
__turbopack_context__.k.register(_c8, "AlertDialogDescription");
__turbopack_context__.k.register(_c9, "AlertDialogAction");
__turbopack_context__.k.register(_c10, "AlertDialogCancel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardAction",
    ()=>CardAction,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/utils.ts [app-client] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Card;
function CardHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c1 = CardHeader;
function CardTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("leading-none font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c2 = CardTitle;
function CardDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_c3 = CardDescription;
function CardAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_c4 = CardAction;
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_c5 = CardContent;
function CardFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center px-6 [.border-t]:pt-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/frontend-next/src/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_c6 = CardFooter;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
__turbopack_context__.k.register(_c2, "CardTitle");
__turbopack_context__.k.register(_c3, "CardDescription");
__turbopack_context__.k.register(_c4, "CardAction");
__turbopack_context__.k.register(_c5, "CardContent");
__turbopack_context__.k.register(_c6, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/lib/api/vehicles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "vehiclesApi",
    ()=>vehiclesApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/client.ts [app-client] (ecmascript)");
;
const vehiclesApi = {
    // Get paginated list of vehicles
    getAll: async (filters = {})=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/vehicles', filters);
    },
    // Get single vehicle by ID
    getById: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/vehicles/${id}`);
    },
    // Create new vehicle
    create: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/vehicles', data);
    },
    // Update vehicle
    update: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/vehicles/${id}`, data);
    },
    // Delete (soft delete) vehicle
    delete: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/vehicles/${id}`);
    },
    // Upload ANMDM document
    uploadAnmdmDocument: async (id, file)=>{
        const formData = new FormData();
        formData.append('document', file);
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].upload(`/vehicles/${id}/anmdm-document`, formData);
    },
    // Upload vehicle photos
    uploadPhotos: async (id, files)=>{
        const formData = new FormData();
        files.forEach((file)=>formData.append('photos', file));
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].upload(`/vehicles/${id}/photos`, formData);
    },
    // Delete vehicle photo
    deletePhoto: async (id, photoId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/vehicles/${id}/photos/${photoId}`);
    },
    // Get vehicle documents
    getDocuments: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/vehicles/${id}/documents`);
    },
    // Upload vehicle document
    uploadDocument: async (id, file, documentType)=>{
        const formData = new FormData();
        formData.append('document', file);
        if (documentType) {
            formData.append('documentType', documentType);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].upload(`/vehicles/${id}/documents`, formData);
    },
    // Reference data
    getBrands: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/system/brands');
    },
    getModels: async (brandId)=>{
        const params = brandId ? {
            brandId
        } : {};
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/system/models', params);
    },
    getVehicleTypes: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/system/vehicle-types');
    },
    getVehicleStatuses: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/system/vehicle-statuses');
    }
};
const __TURBOPACK__default__export__ = vehiclesApi;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/lib/api/drivers.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "driversApi",
    ()=>driversApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/client.ts [app-client] (ecmascript)");
;
const driversApi = {
    // Get paginated list of drivers
    getAll: async (filters = {})=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/drivers', filters);
    },
    // Get single driver by ID
    getById: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/drivers/${id}`);
    },
    // Create new driver
    create: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/drivers', data);
    },
    // Update driver
    update: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/drivers/${id}`, data);
    },
    // Delete driver
    delete: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/drivers/${id}`);
    },
    // Get driver documents
    getDocuments: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/drivers/${id}/documents`);
    },
    // Upload driver document
    uploadDocument: async (id, file, documentType)=>{
        const formData = new FormData();
        formData.append('document', file);
        if (documentType) {
            formData.append('documentType', documentType);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].upload(`/drivers/${id}/documents`, formData);
    },
    // Get drivers expiring licenses
    getExpiringLicenses: async (daysAhead = 30)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/drivers/expiring-licenses', {
            daysAhead
        });
    }
};
const __TURBOPACK__default__export__ = driversApi;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/lib/api/fuel.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "fuelApi",
    ()=>fuelApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/app/frontend-next/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/client.ts [app-client] (ecmascript)");
;
const fuelApi = {
    // Get paginated list of fuel transactions
    getAll: async (filters = {})=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/fuel/transactions', filters);
    },
    // Get single fuel transaction by ID
    getById: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/fuel/transactions/${id}`);
    },
    // Create new fuel transaction
    create: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/fuel/transactions', data);
    },
    // Update fuel transaction
    update: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/fuel/transactions/${id}`, data);
    },
    // Delete fuel transaction
    delete: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/fuel/transactions/${id}`);
    },
    // Get fuel statistics
    getStats: async (filters)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/fuel/transactions/stats', filters);
    },
    // Import fuel transactions from CSV
    importCsv: async (file)=>{
        const formData = new FormData();
        formData.append('file', file);
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].upload('/fuel/transactions/import', formData);
    },
    // Export fuel transactions to CSV
    exportCsv: async (filters)=>{
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value])=>{
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }
        const response = await fetch(`${("TURBOPACK compile-time value", "http://localhost:3000/api")}/fuel/transactions/export?${params}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.blob();
    },
    // Reference data
    getFuelTypes: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/fuel/types');
    },
    getFuelStations: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/fuel/stations');
    }
};
const __TURBOPACK__default__export__ = fuelApi;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/lib/api/maintenance.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "maintenanceApi",
    ()=>maintenanceApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/client.ts [app-client] (ecmascript)");
;
const maintenanceApi = {
    // Get paginated list of work orders
    getAll: async (filters = {})=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/maintenance/work-orders', filters);
    },
    // Get single work order by ID
    getById: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/maintenance/work-orders/${id}`);
    },
    // Create new work order
    create: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/maintenance/work-orders', data);
    },
    // Update work order
    update: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/maintenance/work-orders/${id}`, data);
    },
    // Delete work order
    delete: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/maintenance/work-orders/${id}`);
    },
    // Get maintenance statistics
    getStats: async (filters)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/maintenance/work-orders/stats', filters);
    },
    // Update work order status
    updateStatus: async (id, status)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/maintenance/work-orders/${id}/status`, {
            status
        });
    },
    // Reference data
    getMaintenanceTypes: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/maintenance/types');
    },
    // Get work orders pending approval (managers/admins only)
    // Note: Backend returns plain array, not paginated response
    getPendingApproval: async (filters = {})=>{
        const data = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/maintenance/work-orders/pending-approval', filters);
        return {
            data
        };
    },
    // Approve work order
    approve: async (id, notes)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/maintenance/work-orders/${id}/status`, {
            status: 'approved',
            notes
        });
    },
    // Reject work order
    reject: async (id, notes)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/maintenance/work-orders/${id}/status`, {
            status: 'cancelled',
            notes
        });
    }
};
const __TURBOPACK__default__export__ = maintenanceApi;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/lib/api/warehouse.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "warehouseApi",
    ()=>warehouseApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/client.ts [app-client] (ecmascript)");
;
const warehouseApi = {
    // Materials CRUD - backend uses /materials endpoint
    getMaterials: async (filters = {})=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/materials', filters);
    },
    getMaterialById: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/materials/${id}`);
    },
    createMaterial: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/materials', data);
    },
    updateMaterial: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/materials/${id}`, data);
    },
    deleteMaterial: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/materials/${id}`);
    },
    // Import materials from CSV
    importMaterials: async (file)=>{
        const formData = new FormData();
        formData.append('file', file);
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].upload('/materials/import', formData);
    },
    // Transfer Requests CRUD - backend uses /materials/transfer-requests
    getTransferRequests: async (filters = {})=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/materials/transfer-requests', filters);
    },
    getTransferRequestById: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/materials/transfer-requests/${id}`);
    },
    createTransferRequest: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/materials/transfer-requests', data);
    },
    updateTransferStatus: async (id, status)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/materials/transfer-requests/${id}/status`, {
            status
        });
    },
    // Additional transfer request actions
    approveTransfer: async (id, notes)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(`/materials/transfer-requests/${id}/approve`, {
            notes
        });
    },
    rejectTransfer: async (id, notes)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(`/materials/transfer-requests/${id}/reject`, {
            notes
        });
    },
    completeTransfer: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(`/materials/transfer-requests/${id}/complete`, {});
    },
    getPendingApprovalTransfers: async (filters = {})=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/materials/transfer-requests/pending-approval', filters);
    },
    // Reference data - backend uses /materials/warehouses and /materials/units
    getWarehouses: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/materials/warehouses');
    },
    getWarehouseById: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/materials/warehouses/${id}`);
    },
    createWarehouse: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/materials/warehouses', data);
    },
    updateWarehouse: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/materials/warehouses/${id}`, data);
    },
    deleteWarehouse: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/materials/warehouses/${id}`);
    },
    getMaterialUnits: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/materials/units');
    },
    createMaterialUnit: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/materials/units', data);
    },
    updateMaterialUnit: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/materials/units/${id}`, data);
    },
    // Low stock materials
    getLowStockMaterials: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/materials/low-stock');
    },
    // Reports
    getStockReport: async (filters)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/materials/reports/stock', filters);
    },
    getPricingReport: async (filters)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/materials/reports/pricing', filters);
    },
    getTransfersReport: async (filters)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/materials/reports/transfers', filters);
    },
    getExpirationReport: async (filters)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/materials/reports/expiration', filters);
    },
    getUsageReport: async (filters)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/materials/reports/usage', filters);
    }
};
const __TURBOPACK__default__export__ = warehouseApi;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/lib/api/admin.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adminApi",
    ()=>adminApi,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/client.ts [app-client] (ecmascript)");
;
const adminApi = {
    // ========================
    // Users
    // ========================
    getUsers: async ()=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/users');
        return response.data;
    },
    getUser: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/users/${id}`);
    },
    createUser: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/users', data);
    },
    updateUser: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/users/${id}`, data);
    },
    deleteUser: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/users/${id}`);
    },
    activateUser: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(`/users/${id}/activate`, {});
    },
    deactivateUser: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(`/users/${id}/deactivate`, {});
    },
    resetUserPin: async (id, pin)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(`/users/${id}/reset-pin`, {
            pin
        });
    },
    // ========================
    // Generic Reference Data
    // ========================
    getReferenceData: async (type)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/system/${type}`);
    },
    getReferenceDataItem: async (type, id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/system/${type}/${id}`);
    },
    createReferenceData: async (type, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(`/system/${type}`, data);
    },
    updateReferenceData: async (type, id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/system/${type}/${id}`, data);
    },
    deleteReferenceData: async (type, id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/system/${type}/${id}`);
    },
    // ========================
    // Specific Reference Data Endpoints
    // ========================
    // Brands
    getBrands: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/system/brands');
    },
    createBrand: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/system/brands', data);
    },
    updateBrand: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/system/brands/${id}`, data);
    },
    deleteBrand: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/system/brands/${id}`);
    },
    // Models
    getModels: async (brandId)=>{
        const params = brandId ? {
            brandId
        } : {};
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/system/models', params);
    },
    createModel: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/system/models', data);
    },
    updateModel: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/system/models/${id}`, data);
    },
    deleteModel: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/system/models/${id}`);
    },
    // Vehicle Types
    getVehicleTypes: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/system/vehicle-types');
    },
    createVehicleType: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/system/vehicle-types', data);
    },
    updateVehicleType: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/system/vehicle-types/${id}`, data);
    },
    deleteVehicleType: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/system/vehicle-types/${id}`);
    },
    // Vehicle Statuses
    getVehicleStatuses: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/system/vehicle-statuses');
    },
    createVehicleStatus: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/system/vehicle-statuses', data);
    },
    updateVehicleStatus: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/system/vehicle-statuses/${id}`, data);
    },
    deleteVehicleStatus: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/system/vehicle-statuses/${id}`);
    },
    // Fuel Types
    getFuelTypes: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/system/fuel-types');
    },
    createFuelType: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/system/fuel-types', data);
    },
    updateFuelType: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/system/fuel-types/${id}`, data);
    },
    deleteFuelType: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/system/fuel-types/${id}`);
    },
    // Fuel Stations
    getFuelStations: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/system/fuel-stations');
    },
    createFuelStation: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/system/fuel-stations', data);
    },
    updateFuelStation: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/system/fuel-stations/${id}`, data);
    },
    deleteFuelStation: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/system/fuel-stations/${id}`);
    },
    // Maintenance Types
    getMaintenanceTypes: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/system/maintenance-types');
    },
    createMaintenanceType: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/system/maintenance-types', data);
    },
    updateMaintenanceType: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/system/maintenance-types/${id}`, data);
    },
    deleteMaintenanceType: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/system/maintenance-types/${id}`);
    },
    // Departments
    getDepartments: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/system/departments');
    },
    createDepartment: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/system/departments', data);
    },
    updateDepartment: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/system/departments/${id}`, data);
    },
    deleteDepartment: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/system/departments/${id}`);
    },
    // Locations
    getLocations: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/system/locations');
    },
    createLocation: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/system/locations', data);
    },
    updateLocation: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/system/locations/${id}`, data);
    },
    deleteLocation: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/system/locations/${id}`);
    },
    // Cities
    getCities: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/system/cities');
    },
    createCity: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/system/cities', data);
    },
    updateCity: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/system/cities/${id}`, data);
    },
    deleteCity: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/system/cities/${id}`);
    },
    // Suppliers
    getSuppliers: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/system/suppliers');
    },
    createSupplier: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/system/suppliers', data);
    },
    updateSupplier: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/system/suppliers/${id}`, data);
    },
    deleteSupplier: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/system/suppliers/${id}`);
    },
    // Material Units
    getMaterialUnits: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/system/material-units');
    },
    createMaterialUnit: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/system/material-units', data);
    },
    updateMaterialUnit: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/system/material-units/${id}`, data);
    },
    deleteMaterialUnit: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/system/material-units/${id}`);
    },
    // Material Categories
    getMaterialCategories: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/system/material-categories');
    },
    createMaterialCategory: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/system/material-categories', data);
    },
    updateMaterialCategory: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/system/material-categories/${id}`, data);
    },
    deleteMaterialCategory: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/system/material-categories/${id}`);
    },
    // Positions
    getPositions: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/system/positions');
    },
    createPosition: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/system/positions', data);
    },
    updatePosition: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/system/positions/${id}`, data);
    },
    deletePosition: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/system/positions/${id}`);
    },
    // License Types
    getLicenseTypes: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/system/license-types');
    },
    createLicenseType: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/system/license-types', data);
    },
    updateLicenseType: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/system/license-types/${id}`, data);
    },
    deleteLicenseType: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/system/license-types/${id}`);
    },
    // Inspection Types
    getInspectionTypes: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/system/inspection-types');
    },
    createInspectionType: async (data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/system/inspection-types', data);
    },
    updateInspectionType: async (id, data)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/system/inspection-types/${id}`, data);
    },
    deleteInspectionType: async (id)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/system/inspection-types/${id}`);
    }
};
const __TURBOPACK__default__export__ = adminApi;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/lib/api/chat.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "chatApi",
    ()=>chatApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/app/frontend-next/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/client.ts [app-client] (ecmascript)");
;
const chatApi = {
    // Check LLM service health
    getHealth: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/chat/health');
    },
    // Get LLM configuration (admin only)
    getConfig: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/chat/config');
    },
    // Send chat message (non-streaming)
    sendMessage: async (messages)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/chat', {
            messages,
            stream: false
        });
    },
    // Get available tools
    getTools: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/chat/tools');
    },
    // Test a specific tool (admin only)
    testTool: async (name, args)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(`/chat/tools/${name}/test`, args);
    },
    // Stream chat message
    streamMessage: async (messages, onEvent, onError)=>{
        const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:3000/api") || 'http://localhost:3000/api';
        const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('auth_token') : "TURBOPACK unreachable";
        try {
            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...token ? {
                        Authorization: `Bearer ${token}`
                    } : {}
                },
                body: JSON.stringify({
                    messages,
                    stream: true
                })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({
                        error: {
                            message: 'Unknown error'
                        }
                    }));
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`);
            }
            const reader = response.body?.getReader();
            if (!reader) throw new Error('No response body');
            const decoder = new TextDecoder();
            let buffer = '';
            while(true){
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, {
                    stream: true
                });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines){
                    if (!line.startsWith('data: ')) continue;
                    const data = line.slice(6);
                    try {
                        const event = JSON.parse(data);
                        onEvent(event);
                    } catch  {
                    // Skip invalid JSON
                    }
                }
            }
        } catch (error) {
            onError(error instanceof Error ? error : new Error('Unknown error'));
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/lib/api/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/vehicles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$drivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/drivers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$dashboard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/dashboard.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$fuel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/fuel.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$maintenance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/maintenance.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/warehouse.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/admin.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$chat$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/chat.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/lib/hooks/use-vehicles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBrands",
    ()=>useBrands,
    "useCreateVehicle",
    ()=>useCreateVehicle,
    "useDeleteVehicle",
    ()=>useDeleteVehicle,
    "useModels",
    ()=>useModels,
    "useUpdateVehicle",
    ()=>useUpdateVehicle,
    "useUploadAnmdmDocument",
    ()=>useUploadAnmdmDocument,
    "useUploadVehiclePhotos",
    ()=>useUploadVehiclePhotos,
    "useVehicle",
    ()=>useVehicle,
    "useVehicleStatuses",
    ()=>useVehicleStatuses,
    "useVehicleTypes",
    ()=>useVehicleTypes,
    "useVehicles",
    ()=>useVehicles,
    "vehicleKeys",
    ()=>vehicleKeys
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/vehicles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature(), _s9 = __turbopack_context__.k.signature(), _s10 = __turbopack_context__.k.signature();
'use client';
;
;
;
const vehicleKeys = {
    all: [
        'vehicles'
    ],
    lists: ()=>[
            ...vehicleKeys.all,
            'list'
        ],
    list: (filters)=>[
            ...vehicleKeys.lists(),
            filters
        ],
    details: ()=>[
            ...vehicleKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...vehicleKeys.details(),
            id
        ],
    brands: [
        'brands'
    ],
    models: (brandId)=>[
            'models',
            brandId
        ],
    vehicleTypes: [
        'vehicleTypes'
    ],
    vehicleStatuses: [
        'vehicleStatuses'
    ]
};
function useVehicles(filters = {}) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: vehicleKeys.list(filters),
        queryFn: {
            "useVehicles.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["vehiclesApi"].getAll(filters)
        }["useVehicles.useQuery"],
        placeholderData: {
            "useVehicles.useQuery": (previousData)=>previousData
        }["useVehicles.useQuery"]
    });
}
_s(useVehicles, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useVehicle(id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: vehicleKeys.detail(id),
        queryFn: {
            "useVehicle.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["vehiclesApi"].getById(id)
        }["useVehicle.useQuery"],
        enabled: !!id
    });
}
_s1(useVehicle, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateVehicle() {
    _s2();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateVehicle.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["vehiclesApi"].create(data)
        }["useCreateVehicle.useMutation"],
        onSuccess: {
            "useCreateVehicle.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: vehicleKeys.lists()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Vehiculul a fost creat cu succes');
            }
        }["useCreateVehicle.useMutation"],
        onError: {
            "useCreateVehicle.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea vehiculului: ${error.message}`);
            }
        }["useCreateVehicle.useMutation"]
    });
}
_s2(useCreateVehicle, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateVehicle() {
    _s3();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateVehicle.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["vehiclesApi"].update(id, data)
        }["useUpdateVehicle.useMutation"],
        onSuccess: {
            "useUpdateVehicle.useMutation": (vehicle)=>{
                queryClient.invalidateQueries({
                    queryKey: vehicleKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: vehicleKeys.detail(vehicle.id)
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Vehiculul a fost actualizat cu succes');
            }
        }["useUpdateVehicle.useMutation"],
        onError: {
            "useUpdateVehicle.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea vehiculului: ${error.message}`);
            }
        }["useUpdateVehicle.useMutation"]
    });
}
_s3(useUpdateVehicle, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteVehicle() {
    _s4();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteVehicle.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["vehiclesApi"].delete(id)
        }["useDeleteVehicle.useMutation"],
        onSuccess: {
            "useDeleteVehicle.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: vehicleKeys.lists()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Vehiculul a fost șters cu succes');
            }
        }["useDeleteVehicle.useMutation"],
        onError: {
            "useDeleteVehicle.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea vehiculului: ${error.message}`);
            }
        }["useDeleteVehicle.useMutation"]
    });
}
_s4(useDeleteVehicle, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUploadAnmdmDocument() {
    _s5();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUploadAnmdmDocument.useMutation": ({ id, file })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["vehiclesApi"].uploadAnmdmDocument(id, file)
        }["useUploadAnmdmDocument.useMutation"],
        onSuccess: {
            "useUploadAnmdmDocument.useMutation": (vehicle)=>{
                queryClient.invalidateQueries({
                    queryKey: vehicleKeys.detail(vehicle.id)
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Documentul ANMDM a fost încărcat cu succes');
            }
        }["useUploadAnmdmDocument.useMutation"],
        onError: {
            "useUploadAnmdmDocument.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la încărcarea documentului: ${error.message}`);
            }
        }["useUploadAnmdmDocument.useMutation"]
    });
}
_s5(useUploadAnmdmDocument, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUploadVehiclePhotos() {
    _s6();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUploadVehiclePhotos.useMutation": ({ id, files })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["vehiclesApi"].uploadPhotos(id, files)
        }["useUploadVehiclePhotos.useMutation"],
        onSuccess: {
            "useUploadVehiclePhotos.useMutation": (_, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: vehicleKeys.detail(variables.id)
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Fotografiile au fost încărcate cu succes');
            }
        }["useUploadVehiclePhotos.useMutation"],
        onError: {
            "useUploadVehiclePhotos.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la încărcarea fotografiilor: ${error.message}`);
            }
        }["useUploadVehiclePhotos.useMutation"]
    });
}
_s6(useUploadVehiclePhotos, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useBrands() {
    _s7();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: vehicleKeys.brands,
        queryFn: {
            "useBrands.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["vehiclesApi"].getBrands()
        }["useBrands.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s7(useBrands, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useModels(brandId) {
    _s8();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: vehicleKeys.models(brandId),
        queryFn: {
            "useModels.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["vehiclesApi"].getModels(brandId)
        }["useModels.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s8(useModels, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useVehicleTypes() {
    _s9();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: vehicleKeys.vehicleTypes,
        queryFn: {
            "useVehicleTypes.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["vehiclesApi"].getVehicleTypes()
        }["useVehicleTypes.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s9(useVehicleTypes, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useVehicleStatuses() {
    _s10();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: vehicleKeys.vehicleStatuses,
        queryFn: {
            "useVehicleStatuses.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["vehiclesApi"].getVehicleStatuses()
        }["useVehicleStatuses.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s10(useVehicleStatuses, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/lib/hooks/use-drivers.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "driverKeys",
    ()=>driverKeys,
    "useCreateDriver",
    ()=>useCreateDriver,
    "useDeleteDriver",
    ()=>useDeleteDriver,
    "useDriver",
    ()=>useDriver,
    "useDrivers",
    ()=>useDrivers,
    "useExpiringLicenses",
    ()=>useExpiringLicenses,
    "useUpdateDriver",
    ()=>useUpdateDriver
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$drivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/drivers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature();
'use client';
;
;
;
const driverKeys = {
    all: [
        'drivers'
    ],
    lists: ()=>[
            ...driverKeys.all,
            'list'
        ],
    list: (filters)=>[
            ...driverKeys.lists(),
            filters
        ],
    details: ()=>[
            ...driverKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...driverKeys.details(),
            id
        ],
    expiringLicenses: (daysAhead)=>[
            ...driverKeys.all,
            'expiring',
            daysAhead
        ]
};
function useDrivers(filters = {}) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: driverKeys.list(filters),
        queryFn: {
            "useDrivers.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$drivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["driversApi"].getAll(filters)
        }["useDrivers.useQuery"],
        placeholderData: {
            "useDrivers.useQuery": (previousData)=>previousData
        }["useDrivers.useQuery"]
    });
}
_s(useDrivers, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useDriver(id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: driverKeys.detail(id),
        queryFn: {
            "useDriver.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$drivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["driversApi"].getById(id)
        }["useDriver.useQuery"],
        enabled: !!id
    });
}
_s1(useDriver, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateDriver() {
    _s2();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateDriver.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$drivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["driversApi"].create(data)
        }["useCreateDriver.useMutation"],
        onSuccess: {
            "useCreateDriver.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: driverKeys.lists()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Șoferul a fost creat cu succes');
            }
        }["useCreateDriver.useMutation"],
        onError: {
            "useCreateDriver.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea șoferului: ${error.message}`);
            }
        }["useCreateDriver.useMutation"]
    });
}
_s2(useCreateDriver, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateDriver() {
    _s3();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateDriver.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$drivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["driversApi"].update(id, data)
        }["useUpdateDriver.useMutation"],
        onSuccess: {
            "useUpdateDriver.useMutation": (driver)=>{
                queryClient.invalidateQueries({
                    queryKey: driverKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: driverKeys.detail(driver.id)
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Șoferul a fost actualizat cu succes');
            }
        }["useUpdateDriver.useMutation"],
        onError: {
            "useUpdateDriver.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea șoferului: ${error.message}`);
            }
        }["useUpdateDriver.useMutation"]
    });
}
_s3(useUpdateDriver, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteDriver() {
    _s4();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteDriver.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$drivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["driversApi"].delete(id)
        }["useDeleteDriver.useMutation"],
        onSuccess: {
            "useDeleteDriver.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: driverKeys.lists()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Șoferul a fost șters cu succes');
            }
        }["useDeleteDriver.useMutation"],
        onError: {
            "useDeleteDriver.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea șoferului: ${error.message}`);
            }
        }["useDeleteDriver.useMutation"]
    });
}
_s4(useDeleteDriver, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useExpiringLicenses(daysAhead = 30) {
    _s5();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: driverKeys.expiringLicenses(daysAhead),
        queryFn: {
            "useExpiringLicenses.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$drivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["driversApi"].getExpiringLicenses(daysAhead)
        }["useExpiringLicenses.useQuery"]
    });
}
_s5(useExpiringLicenses, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/lib/hooks/use-fuel.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fuelKeys",
    ()=>fuelKeys,
    "useCreateFuelTransaction",
    ()=>useCreateFuelTransaction,
    "useDeleteFuelTransaction",
    ()=>useDeleteFuelTransaction,
    "useFuelStations",
    ()=>useFuelStations,
    "useFuelStats",
    ()=>useFuelStats,
    "useFuelTransaction",
    ()=>useFuelTransaction,
    "useFuelTransactions",
    ()=>useFuelTransactions,
    "useFuelTypes",
    ()=>useFuelTypes,
    "useImportFuelCsv",
    ()=>useImportFuelCsv,
    "useUpdateFuelTransaction",
    ()=>useUpdateFuelTransaction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$fuel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/fuel.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature();
'use client';
;
;
;
const fuelKeys = {
    all: [
        'fuel'
    ],
    lists: ()=>[
            ...fuelKeys.all,
            'list'
        ],
    list: (filters)=>[
            ...fuelKeys.lists(),
            filters
        ],
    details: ()=>[
            ...fuelKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...fuelKeys.details(),
            id
        ],
    stats: (filters)=>[
            ...fuelKeys.all,
            'stats',
            filters
        ],
    fuelTypes: [
        'fuelTypes'
    ],
    fuelStations: [
        'fuelStations'
    ]
};
function useFuelTransactions(filters = {}) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: fuelKeys.list(filters),
        queryFn: {
            "useFuelTransactions.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$fuel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fuelApi"].getAll(filters)
        }["useFuelTransactions.useQuery"],
        placeholderData: {
            "useFuelTransactions.useQuery": (previousData)=>previousData
        }["useFuelTransactions.useQuery"]
    });
}
_s(useFuelTransactions, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useFuelTransaction(id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: fuelKeys.detail(id),
        queryFn: {
            "useFuelTransaction.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$fuel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fuelApi"].getById(id)
        }["useFuelTransaction.useQuery"],
        enabled: !!id
    });
}
_s1(useFuelTransaction, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useFuelStats(filters) {
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: fuelKeys.stats(filters),
        queryFn: {
            "useFuelStats.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$fuel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fuelApi"].getStats(filters)
        }["useFuelStats.useQuery"]
    });
}
_s2(useFuelStats, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateFuelTransaction() {
    _s3();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateFuelTransaction.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$fuel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fuelApi"].create(data)
        }["useCreateFuelTransaction.useMutation"],
        onSuccess: {
            "useCreateFuelTransaction.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: fuelKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: fuelKeys.stats()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Alimentarea a fost înregistrată cu succes');
            }
        }["useCreateFuelTransaction.useMutation"],
        onError: {
            "useCreateFuelTransaction.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la înregistrarea alimentării: ${error.message}`);
            }
        }["useCreateFuelTransaction.useMutation"]
    });
}
_s3(useCreateFuelTransaction, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateFuelTransaction() {
    _s4();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateFuelTransaction.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$fuel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fuelApi"].update(id, data)
        }["useUpdateFuelTransaction.useMutation"],
        onSuccess: {
            "useUpdateFuelTransaction.useMutation": (transaction)=>{
                queryClient.invalidateQueries({
                    queryKey: fuelKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: fuelKeys.detail(transaction.id)
                });
                queryClient.invalidateQueries({
                    queryKey: fuelKeys.stats()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Alimentarea a fost actualizată cu succes');
            }
        }["useUpdateFuelTransaction.useMutation"],
        onError: {
            "useUpdateFuelTransaction.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea alimentării: ${error.message}`);
            }
        }["useUpdateFuelTransaction.useMutation"]
    });
}
_s4(useUpdateFuelTransaction, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteFuelTransaction() {
    _s5();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteFuelTransaction.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$fuel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fuelApi"].delete(id)
        }["useDeleteFuelTransaction.useMutation"],
        onSuccess: {
            "useDeleteFuelTransaction.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: fuelKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: fuelKeys.stats()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Alimentarea a fost ștearsă cu succes');
            }
        }["useDeleteFuelTransaction.useMutation"],
        onError: {
            "useDeleteFuelTransaction.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea alimentării: ${error.message}`);
            }
        }["useDeleteFuelTransaction.useMutation"]
    });
}
_s5(useDeleteFuelTransaction, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useImportFuelCsv() {
    _s6();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useImportFuelCsv.useMutation": (file)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$fuel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fuelApi"].importCsv(file)
        }["useImportFuelCsv.useMutation"],
        onSuccess: {
            "useImportFuelCsv.useMutation": (result)=>{
                queryClient.invalidateQueries({
                    queryKey: fuelKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: fuelKeys.stats()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`S-au importat ${result.imported} tranzacții`);
                if (result.errors.length > 0) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].warning(`${result.errors.length} erori la import`);
                }
            }
        }["useImportFuelCsv.useMutation"],
        onError: {
            "useImportFuelCsv.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la importul fișierului: ${error.message}`);
            }
        }["useImportFuelCsv.useMutation"]
    });
}
_s6(useImportFuelCsv, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useFuelTypes() {
    _s7();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: fuelKeys.fuelTypes,
        queryFn: {
            "useFuelTypes.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$fuel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fuelApi"].getFuelTypes()
        }["useFuelTypes.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s7(useFuelTypes, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useFuelStations() {
    _s8();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: fuelKeys.fuelStations,
        queryFn: {
            "useFuelStations.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$fuel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fuelApi"].getFuelStations()
        }["useFuelStations.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s8(useFuelStations, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/lib/hooks/use-maintenance.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "maintenanceKeys",
    ()=>maintenanceKeys,
    "useCreateMaintenanceWorkOrder",
    ()=>useCreateMaintenanceWorkOrder,
    "useDeleteMaintenanceWorkOrder",
    ()=>useDeleteMaintenanceWorkOrder,
    "useMaintenanceStats",
    ()=>useMaintenanceStats,
    "useMaintenanceTypes",
    ()=>useMaintenanceTypes,
    "useMaintenanceWorkOrder",
    ()=>useMaintenanceWorkOrder,
    "useMaintenanceWorkOrders",
    ()=>useMaintenanceWorkOrders,
    "useUpdateMaintenanceWorkOrder",
    ()=>useUpdateMaintenanceWorkOrder,
    "useUpdateWorkOrderStatus",
    ()=>useUpdateWorkOrderStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$maintenance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/maintenance.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature();
'use client';
;
;
;
const maintenanceKeys = {
    all: [
        'maintenance'
    ],
    lists: ()=>[
            ...maintenanceKeys.all,
            'list'
        ],
    list: (filters)=>[
            ...maintenanceKeys.lists(),
            filters
        ],
    details: ()=>[
            ...maintenanceKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...maintenanceKeys.details(),
            id
        ],
    stats: (filters)=>[
            ...maintenanceKeys.all,
            'stats',
            filters
        ],
    maintenanceTypes: [
        'maintenanceTypes'
    ]
};
function useMaintenanceWorkOrders(filters = {}) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: maintenanceKeys.list(filters),
        queryFn: {
            "useMaintenanceWorkOrders.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$maintenance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["maintenanceApi"].getAll(filters)
        }["useMaintenanceWorkOrders.useQuery"],
        placeholderData: {
            "useMaintenanceWorkOrders.useQuery": (previousData)=>previousData
        }["useMaintenanceWorkOrders.useQuery"]
    });
}
_s(useMaintenanceWorkOrders, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useMaintenanceWorkOrder(id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: maintenanceKeys.detail(id),
        queryFn: {
            "useMaintenanceWorkOrder.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$maintenance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["maintenanceApi"].getById(id)
        }["useMaintenanceWorkOrder.useQuery"],
        enabled: !!id
    });
}
_s1(useMaintenanceWorkOrder, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useMaintenanceStats(filters) {
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: maintenanceKeys.stats(filters),
        queryFn: {
            "useMaintenanceStats.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$maintenance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["maintenanceApi"].getStats(filters)
        }["useMaintenanceStats.useQuery"]
    });
}
_s2(useMaintenanceStats, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateMaintenanceWorkOrder() {
    _s3();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateMaintenanceWorkOrder.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$maintenance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["maintenanceApi"].create(data)
        }["useCreateMaintenanceWorkOrder.useMutation"],
        onSuccess: {
            "useCreateMaintenanceWorkOrder.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: maintenanceKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: maintenanceKeys.stats()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Comanda de lucru a fost creată cu succes');
            }
        }["useCreateMaintenanceWorkOrder.useMutation"],
        onError: {
            "useCreateMaintenanceWorkOrder.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea comenzii de lucru: ${error.message}`);
            }
        }["useCreateMaintenanceWorkOrder.useMutation"]
    });
}
_s3(useCreateMaintenanceWorkOrder, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateMaintenanceWorkOrder() {
    _s4();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateMaintenanceWorkOrder.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$maintenance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["maintenanceApi"].update(id, data)
        }["useUpdateMaintenanceWorkOrder.useMutation"],
        onSuccess: {
            "useUpdateMaintenanceWorkOrder.useMutation": (workOrder)=>{
                queryClient.invalidateQueries({
                    queryKey: maintenanceKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: maintenanceKeys.detail(workOrder.id)
                });
                queryClient.invalidateQueries({
                    queryKey: maintenanceKeys.stats()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Comanda de lucru a fost actualizată cu succes');
            }
        }["useUpdateMaintenanceWorkOrder.useMutation"],
        onError: {
            "useUpdateMaintenanceWorkOrder.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea comenzii de lucru: ${error.message}`);
            }
        }["useUpdateMaintenanceWorkOrder.useMutation"]
    });
}
_s4(useUpdateMaintenanceWorkOrder, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteMaintenanceWorkOrder() {
    _s5();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteMaintenanceWorkOrder.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$maintenance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["maintenanceApi"].delete(id)
        }["useDeleteMaintenanceWorkOrder.useMutation"],
        onSuccess: {
            "useDeleteMaintenanceWorkOrder.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: maintenanceKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: maintenanceKeys.stats()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Comanda de lucru a fost ștearsă cu succes');
            }
        }["useDeleteMaintenanceWorkOrder.useMutation"],
        onError: {
            "useDeleteMaintenanceWorkOrder.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea comenzii de lucru: ${error.message}`);
            }
        }["useDeleteMaintenanceWorkOrder.useMutation"]
    });
}
_s5(useDeleteMaintenanceWorkOrder, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateWorkOrderStatus() {
    _s6();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateWorkOrderStatus.useMutation": ({ id, status })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$maintenance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["maintenanceApi"].updateStatus(id, status)
        }["useUpdateWorkOrderStatus.useMutation"],
        onSuccess: {
            "useUpdateWorkOrderStatus.useMutation": (workOrder)=>{
                queryClient.invalidateQueries({
                    queryKey: maintenanceKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: maintenanceKeys.detail(workOrder.id)
                });
                queryClient.invalidateQueries({
                    queryKey: maintenanceKeys.stats()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Statusul comenzii a fost actualizat');
            }
        }["useUpdateWorkOrderStatus.useMutation"],
        onError: {
            "useUpdateWorkOrderStatus.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea statusului: ${error.message}`);
            }
        }["useUpdateWorkOrderStatus.useMutation"]
    });
}
_s6(useUpdateWorkOrderStatus, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useMaintenanceTypes() {
    _s7();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: maintenanceKeys.maintenanceTypes,
        queryFn: {
            "useMaintenanceTypes.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$maintenance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["maintenanceApi"].getMaintenanceTypes()
        }["useMaintenanceTypes.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s7(useMaintenanceTypes, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/lib/hooks/use-warehouse.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useApproveTransfer",
    ()=>useApproveTransfer,
    "useCompleteTransfer",
    ()=>useCompleteTransfer,
    "useCreateMaterial",
    ()=>useCreateMaterial,
    "useCreateTransferRequest",
    ()=>useCreateTransferRequest,
    "useCreateWarehouse",
    ()=>useCreateWarehouse,
    "useDeleteMaterial",
    ()=>useDeleteMaterial,
    "useDeleteWarehouse",
    ()=>useDeleteWarehouse,
    "useLowStockMaterials",
    ()=>useLowStockMaterials,
    "useMaterial",
    ()=>useMaterial,
    "useMaterialUnits",
    ()=>useMaterialUnits,
    "useMaterials",
    ()=>useMaterials,
    "usePendingApprovalTransfers",
    ()=>usePendingApprovalTransfers,
    "useRejectTransfer",
    ()=>useRejectTransfer,
    "useTransferRequest",
    ()=>useTransferRequest,
    "useTransferRequests",
    ()=>useTransferRequests,
    "useUpdateMaterial",
    ()=>useUpdateMaterial,
    "useUpdateTransferStatus",
    ()=>useUpdateTransferStatus,
    "useUpdateWarehouse",
    ()=>useUpdateWarehouse,
    "useWarehouse",
    ()=>useWarehouse,
    "useWarehouses",
    ()=>useWarehouses,
    "warehouseKeys",
    ()=>warehouseKeys
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/warehouse.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature(), _s9 = __turbopack_context__.k.signature(), _s10 = __turbopack_context__.k.signature(), _s11 = __turbopack_context__.k.signature(), _s12 = __turbopack_context__.k.signature(), _s13 = __turbopack_context__.k.signature(), _s14 = __turbopack_context__.k.signature(), _s15 = __turbopack_context__.k.signature(), _s16 = __turbopack_context__.k.signature(), _s17 = __turbopack_context__.k.signature(), _s18 = __turbopack_context__.k.signature(), _s19 = __turbopack_context__.k.signature();
'use client';
;
;
;
const warehouseKeys = {
    all: [
        'warehouse'
    ],
    materials: ()=>[
            ...warehouseKeys.all,
            'materials'
        ],
    materialsList: (filters)=>[
            ...warehouseKeys.materials(),
            'list',
            filters
        ],
    materialDetail: (id)=>[
            ...warehouseKeys.materials(),
            'detail',
            id
        ],
    transfers: ()=>[
            ...warehouseKeys.all,
            'transfers'
        ],
    transfersList: (filters)=>[
            ...warehouseKeys.transfers(),
            'list',
            filters
        ],
    transferDetail: (id)=>[
            ...warehouseKeys.transfers(),
            'detail',
            id
        ],
    stats: ()=>[
            ...warehouseKeys.all,
            'stats'
        ],
    warehouses: [
        'warehouses'
    ],
    warehouseDetail: (id)=>[
            'warehouses',
            'detail',
            id
        ],
    materialUnits: [
        'materialUnits'
    ],
    materialCategories: [
        'materialCategories'
    ]
};
function useMaterials(filters = {}) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: warehouseKeys.materialsList(filters),
        queryFn: {
            "useMaterials.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warehouseApi"].getMaterials(filters)
        }["useMaterials.useQuery"],
        placeholderData: {
            "useMaterials.useQuery": (previousData)=>previousData
        }["useMaterials.useQuery"]
    });
}
_s(useMaterials, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useMaterial(id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: warehouseKeys.materialDetail(id),
        queryFn: {
            "useMaterial.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warehouseApi"].getMaterialById(id)
        }["useMaterial.useQuery"],
        enabled: !!id
    });
}
_s1(useMaterial, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateMaterial() {
    _s2();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateMaterial.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warehouseApi"].createMaterial(data)
        }["useCreateMaterial.useMutation"],
        onSuccess: {
            "useCreateMaterial.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.materials()
                });
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.stats()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Materialul a fost creat cu succes');
            }
        }["useCreateMaterial.useMutation"],
        onError: {
            "useCreateMaterial.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea materialului: ${error.message}`);
            }
        }["useCreateMaterial.useMutation"]
    });
}
_s2(useCreateMaterial, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateMaterial() {
    _s3();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateMaterial.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warehouseApi"].updateMaterial(id, data)
        }["useUpdateMaterial.useMutation"],
        onSuccess: {
            "useUpdateMaterial.useMutation": (material)=>{
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.materials()
                });
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.materialDetail(material.id)
                });
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.stats()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Materialul a fost actualizat cu succes');
            }
        }["useUpdateMaterial.useMutation"],
        onError: {
            "useUpdateMaterial.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea materialului: ${error.message}`);
            }
        }["useUpdateMaterial.useMutation"]
    });
}
_s3(useUpdateMaterial, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteMaterial() {
    _s4();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteMaterial.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warehouseApi"].deleteMaterial(id)
        }["useDeleteMaterial.useMutation"],
        onSuccess: {
            "useDeleteMaterial.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.materials()
                });
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.stats()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Materialul a fost șters cu succes');
            }
        }["useDeleteMaterial.useMutation"],
        onError: {
            "useDeleteMaterial.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea materialului: ${error.message}`);
            }
        }["useDeleteMaterial.useMutation"]
    });
}
_s4(useDeleteMaterial, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useTransferRequests(filters = {}) {
    _s5();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: warehouseKeys.transfersList(filters),
        queryFn: {
            "useTransferRequests.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warehouseApi"].getTransferRequests(filters)
        }["useTransferRequests.useQuery"],
        placeholderData: {
            "useTransferRequests.useQuery": (previousData)=>previousData
        }["useTransferRequests.useQuery"]
    });
}
_s5(useTransferRequests, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useTransferRequest(id) {
    _s6();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: warehouseKeys.transferDetail(id),
        queryFn: {
            "useTransferRequest.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warehouseApi"].getTransferRequestById(id)
        }["useTransferRequest.useQuery"],
        enabled: !!id
    });
}
_s6(useTransferRequest, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateTransferRequest() {
    _s7();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateTransferRequest.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warehouseApi"].createTransferRequest(data)
        }["useCreateTransferRequest.useMutation"],
        onSuccess: {
            "useCreateTransferRequest.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.transfers()
                });
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.stats()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Cererea de transfer a fost creată cu succes');
            }
        }["useCreateTransferRequest.useMutation"],
        onError: {
            "useCreateTransferRequest.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea cererii: ${error.message}`);
            }
        }["useCreateTransferRequest.useMutation"]
    });
}
_s7(useCreateTransferRequest, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateTransferStatus() {
    _s8();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateTransferStatus.useMutation": ({ id, status })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warehouseApi"].updateTransferStatus(id, status)
        }["useUpdateTransferStatus.useMutation"],
        onSuccess: {
            "useUpdateTransferStatus.useMutation": (transfer)=>{
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.transfers()
                });
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.transferDetail(transfer.id)
                });
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.stats()
                });
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.materials()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Statusul cererii a fost actualizat');
            }
        }["useUpdateTransferStatus.useMutation"],
        onError: {
            "useUpdateTransferStatus.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea statusului: ${error.message}`);
            }
        }["useUpdateTransferStatus.useMutation"]
    });
}
_s8(useUpdateTransferStatus, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useLowStockMaterials() {
    _s9();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            ...warehouseKeys.all,
            'lowStock'
        ],
        queryFn: {
            "useLowStockMaterials.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warehouseApi"].getLowStockMaterials()
        }["useLowStockMaterials.useQuery"]
    });
}
_s9(useLowStockMaterials, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useWarehouses() {
    _s10();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: warehouseKeys.warehouses,
        queryFn: {
            "useWarehouses.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warehouseApi"].getWarehouses()
        }["useWarehouses.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s10(useWarehouses, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useWarehouse(id) {
    _s11();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: warehouseKeys.warehouseDetail(id),
        queryFn: {
            "useWarehouse.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warehouseApi"].getWarehouseById(id)
        }["useWarehouse.useQuery"],
        enabled: !!id
    });
}
_s11(useWarehouse, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useUpdateWarehouse() {
    _s12();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateWarehouse.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warehouseApi"].updateWarehouse(id, data)
        }["useUpdateWarehouse.useMutation"],
        onSuccess: {
            "useUpdateWarehouse.useMutation": (warehouse)=>{
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.warehouses
                });
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.warehouseDetail(warehouse.id)
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Depozitul a fost actualizat cu succes');
            }
        }["useUpdateWarehouse.useMutation"],
        onError: {
            "useUpdateWarehouse.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea depozitului: ${error.message}`);
            }
        }["useUpdateWarehouse.useMutation"]
    });
}
_s12(useUpdateWarehouse, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useCreateWarehouse() {
    _s13();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateWarehouse.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warehouseApi"].createWarehouse(data)
        }["useCreateWarehouse.useMutation"],
        onSuccess: {
            "useCreateWarehouse.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.warehouses
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Depozitul a fost creat cu succes');
            }
        }["useCreateWarehouse.useMutation"],
        onError: {
            "useCreateWarehouse.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea depozitului: ${error.message}`);
            }
        }["useCreateWarehouse.useMutation"]
    });
}
_s13(useCreateWarehouse, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteWarehouse() {
    _s14();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteWarehouse.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warehouseApi"].deleteWarehouse(id)
        }["useDeleteWarehouse.useMutation"],
        onSuccess: {
            "useDeleteWarehouse.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.warehouses
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Depozitul a fost șters cu succes');
            }
        }["useDeleteWarehouse.useMutation"],
        onError: {
            "useDeleteWarehouse.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea depozitului: ${error.message}`);
            }
        }["useDeleteWarehouse.useMutation"]
    });
}
_s14(useDeleteWarehouse, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useMaterialUnits() {
    _s15();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: warehouseKeys.materialUnits,
        queryFn: {
            "useMaterialUnits.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warehouseApi"].getMaterialUnits()
        }["useMaterialUnits.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s15(useMaterialUnits, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function usePendingApprovalTransfers(filters = {}) {
    _s16();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            ...warehouseKeys.transfers(),
            'pending-approval',
            filters
        ],
        queryFn: {
            "usePendingApprovalTransfers.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warehouseApi"].getPendingApprovalTransfers(filters)
        }["usePendingApprovalTransfers.useQuery"],
        placeholderData: {
            "usePendingApprovalTransfers.useQuery": (previousData)=>previousData
        }["usePendingApprovalTransfers.useQuery"]
    });
}
_s16(usePendingApprovalTransfers, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useApproveTransfer() {
    _s17();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useApproveTransfer.useMutation": ({ id, notes })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warehouseApi"].approveTransfer(id, notes)
        }["useApproveTransfer.useMutation"],
        onSuccess: {
            "useApproveTransfer.useMutation": (transfer)=>{
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.transfers()
                });
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.transferDetail(transfer.id)
                });
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.materials()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Transferul a fost aprobat');
            }
        }["useApproveTransfer.useMutation"],
        onError: {
            "useApproveTransfer.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la aprobare: ${error.message}`);
            }
        }["useApproveTransfer.useMutation"]
    });
}
_s17(useApproveTransfer, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useRejectTransfer() {
    _s18();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useRejectTransfer.useMutation": ({ id, notes })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warehouseApi"].rejectTransfer(id, notes)
        }["useRejectTransfer.useMutation"],
        onSuccess: {
            "useRejectTransfer.useMutation": (transfer)=>{
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.transfers()
                });
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.transferDetail(transfer.id)
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Transferul a fost respins');
            }
        }["useRejectTransfer.useMutation"],
        onError: {
            "useRejectTransfer.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la respingere: ${error.message}`);
            }
        }["useRejectTransfer.useMutation"]
    });
}
_s18(useRejectTransfer, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useCompleteTransfer() {
    _s19();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCompleteTransfer.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warehouseApi"].completeTransfer(id)
        }["useCompleteTransfer.useMutation"],
        onSuccess: {
            "useCompleteTransfer.useMutation": (transfer)=>{
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.transfers()
                });
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.transferDetail(transfer.id)
                });
                queryClient.invalidateQueries({
                    queryKey: warehouseKeys.materials()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Transferul a fost finalizat');
            }
        }["useCompleteTransfer.useMutation"],
        onError: {
            "useCompleteTransfer.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la finalizare: ${error.message}`);
            }
        }["useCompleteTransfer.useMutation"]
    });
}
_s19(useCompleteTransfer, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/lib/hooks/use-admin.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adminKeys",
    ()=>adminKeys,
    "useActivateUser",
    ()=>useActivateUser,
    "useAdminBrands",
    ()=>useAdminBrands,
    "useAdminCities",
    ()=>useAdminCities,
    "useAdminDepartments",
    ()=>useAdminDepartments,
    "useAdminFuelStations",
    ()=>useAdminFuelStations,
    "useAdminFuelTypes",
    ()=>useAdminFuelTypes,
    "useAdminInspectionTypes",
    ()=>useAdminInspectionTypes,
    "useAdminLicenseTypes",
    ()=>useAdminLicenseTypes,
    "useAdminLocations",
    ()=>useAdminLocations,
    "useAdminMaintenanceTypes",
    ()=>useAdminMaintenanceTypes,
    "useAdminMaterialCategories",
    ()=>useAdminMaterialCategories,
    "useAdminMaterialUnits",
    ()=>useAdminMaterialUnits,
    "useAdminModels",
    ()=>useAdminModels,
    "useAdminPositions",
    ()=>useAdminPositions,
    "useAdminSuppliers",
    ()=>useAdminSuppliers,
    "useAdminVehicleStatuses",
    ()=>useAdminVehicleStatuses,
    "useAdminVehicleTypes",
    ()=>useAdminVehicleTypes,
    "useCreateBrand",
    ()=>useCreateBrand,
    "useCreateCity",
    ()=>useCreateCity,
    "useCreateDepartment",
    ()=>useCreateDepartment,
    "useCreateFuelStation",
    ()=>useCreateFuelStation,
    "useCreateFuelType",
    ()=>useCreateFuelType,
    "useCreateInspectionType",
    ()=>useCreateInspectionType,
    "useCreateLicenseType",
    ()=>useCreateLicenseType,
    "useCreateLocation",
    ()=>useCreateLocation,
    "useCreateMaintenanceType",
    ()=>useCreateMaintenanceType,
    "useCreateMaterialCategory",
    ()=>useCreateMaterialCategory,
    "useCreateMaterialUnit",
    ()=>useCreateMaterialUnit,
    "useCreateModel",
    ()=>useCreateModel,
    "useCreatePosition",
    ()=>useCreatePosition,
    "useCreateSupplier",
    ()=>useCreateSupplier,
    "useCreateUser",
    ()=>useCreateUser,
    "useCreateVehicleStatus",
    ()=>useCreateVehicleStatus,
    "useCreateVehicleType",
    ()=>useCreateVehicleType,
    "useDeactivateUser",
    ()=>useDeactivateUser,
    "useDeleteBrand",
    ()=>useDeleteBrand,
    "useDeleteCity",
    ()=>useDeleteCity,
    "useDeleteDepartment",
    ()=>useDeleteDepartment,
    "useDeleteFuelStation",
    ()=>useDeleteFuelStation,
    "useDeleteFuelType",
    ()=>useDeleteFuelType,
    "useDeleteInspectionType",
    ()=>useDeleteInspectionType,
    "useDeleteLicenseType",
    ()=>useDeleteLicenseType,
    "useDeleteLocation",
    ()=>useDeleteLocation,
    "useDeleteMaintenanceType",
    ()=>useDeleteMaintenanceType,
    "useDeleteMaterialCategory",
    ()=>useDeleteMaterialCategory,
    "useDeleteMaterialUnit",
    ()=>useDeleteMaterialUnit,
    "useDeleteModel",
    ()=>useDeleteModel,
    "useDeletePosition",
    ()=>useDeletePosition,
    "useDeleteSupplier",
    ()=>useDeleteSupplier,
    "useDeleteUser",
    ()=>useDeleteUser,
    "useDeleteVehicleStatus",
    ()=>useDeleteVehicleStatus,
    "useDeleteVehicleType",
    ()=>useDeleteVehicleType,
    "useResetUserPin",
    ()=>useResetUserPin,
    "useUpdateBrand",
    ()=>useUpdateBrand,
    "useUpdateCity",
    ()=>useUpdateCity,
    "useUpdateDepartment",
    ()=>useUpdateDepartment,
    "useUpdateFuelStation",
    ()=>useUpdateFuelStation,
    "useUpdateFuelType",
    ()=>useUpdateFuelType,
    "useUpdateInspectionType",
    ()=>useUpdateInspectionType,
    "useUpdateLicenseType",
    ()=>useUpdateLicenseType,
    "useUpdateLocation",
    ()=>useUpdateLocation,
    "useUpdateMaintenanceType",
    ()=>useUpdateMaintenanceType,
    "useUpdateMaterialCategory",
    ()=>useUpdateMaterialCategory,
    "useUpdateMaterialUnit",
    ()=>useUpdateMaterialUnit,
    "useUpdateModel",
    ()=>useUpdateModel,
    "useUpdatePosition",
    ()=>useUpdatePosition,
    "useUpdateSupplier",
    ()=>useUpdateSupplier,
    "useUpdateUser",
    ()=>useUpdateUser,
    "useUpdateVehicleStatus",
    ()=>useUpdateVehicleStatus,
    "useUpdateVehicleType",
    ()=>useUpdateVehicleType,
    "useUser",
    ()=>useUser,
    "useUsers",
    ()=>useUsers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/admin.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature(), _s9 = __turbopack_context__.k.signature(), _s10 = __turbopack_context__.k.signature(), _s11 = __turbopack_context__.k.signature(), _s12 = __turbopack_context__.k.signature(), _s13 = __turbopack_context__.k.signature(), _s14 = __turbopack_context__.k.signature(), _s15 = __turbopack_context__.k.signature(), _s16 = __turbopack_context__.k.signature(), _s17 = __turbopack_context__.k.signature(), _s18 = __turbopack_context__.k.signature(), _s19 = __turbopack_context__.k.signature(), _s20 = __turbopack_context__.k.signature(), _s21 = __turbopack_context__.k.signature(), _s22 = __turbopack_context__.k.signature(), _s23 = __turbopack_context__.k.signature(), _s24 = __turbopack_context__.k.signature(), _s25 = __turbopack_context__.k.signature(), _s26 = __turbopack_context__.k.signature(), _s27 = __turbopack_context__.k.signature(), _s28 = __turbopack_context__.k.signature(), _s29 = __turbopack_context__.k.signature(), _s30 = __turbopack_context__.k.signature(), _s31 = __turbopack_context__.k.signature(), _s32 = __turbopack_context__.k.signature(), _s33 = __turbopack_context__.k.signature(), _s34 = __turbopack_context__.k.signature(), _s35 = __turbopack_context__.k.signature(), _s36 = __turbopack_context__.k.signature(), _s37 = __turbopack_context__.k.signature(), _s38 = __turbopack_context__.k.signature(), _s39 = __turbopack_context__.k.signature(), _s40 = __turbopack_context__.k.signature(), _s41 = __turbopack_context__.k.signature(), _s42 = __turbopack_context__.k.signature(), _s43 = __turbopack_context__.k.signature(), _s44 = __turbopack_context__.k.signature(), _s45 = __turbopack_context__.k.signature(), _s46 = __turbopack_context__.k.signature(), _s47 = __turbopack_context__.k.signature(), _s48 = __turbopack_context__.k.signature(), _s49 = __turbopack_context__.k.signature(), _s50 = __turbopack_context__.k.signature(), _s51 = __turbopack_context__.k.signature(), _s52 = __turbopack_context__.k.signature(), _s53 = __turbopack_context__.k.signature(), _s54 = __turbopack_context__.k.signature(), _s55 = __turbopack_context__.k.signature(), _s56 = __turbopack_context__.k.signature(), _s57 = __turbopack_context__.k.signature(), _s58 = __turbopack_context__.k.signature(), _s59 = __turbopack_context__.k.signature(), _s60 = __turbopack_context__.k.signature(), _s61 = __turbopack_context__.k.signature(), _s62 = __turbopack_context__.k.signature(), _s63 = __turbopack_context__.k.signature(), _s64 = __turbopack_context__.k.signature(), _s65 = __turbopack_context__.k.signature(), _s66 = __turbopack_context__.k.signature(), _s67 = __turbopack_context__.k.signature(), _s68 = __turbopack_context__.k.signature(), _s69 = __turbopack_context__.k.signature(), _s70 = __turbopack_context__.k.signature(), _s71 = __turbopack_context__.k.signature();
'use client';
;
;
;
const adminKeys = {
    all: [
        'admin'
    ],
    users: ()=>[
            ...adminKeys.all,
            'users'
        ],
    user: (id)=>[
            ...adminKeys.users(),
            id
        ],
    referenceData: (type)=>[
            ...adminKeys.all,
            'reference',
            type
        ],
    brands: ()=>[
            ...adminKeys.all,
            'brands'
        ],
    models: (brandId)=>[
            ...adminKeys.all,
            'models',
            brandId
        ],
    vehicleTypes: ()=>[
            ...adminKeys.all,
            'vehicle-types'
        ],
    vehicleStatuses: ()=>[
            ...adminKeys.all,
            'vehicle-statuses'
        ],
    fuelTypes: ()=>[
            ...adminKeys.all,
            'fuel-types'
        ],
    fuelStations: ()=>[
            ...adminKeys.all,
            'fuel-stations'
        ],
    maintenanceTypes: ()=>[
            ...adminKeys.all,
            'maintenance-types'
        ],
    departments: ()=>[
            ...adminKeys.all,
            'departments'
        ],
    locations: ()=>[
            ...adminKeys.all,
            'locations'
        ],
    cities: ()=>[
            ...adminKeys.all,
            'cities'
        ],
    suppliers: ()=>[
            ...adminKeys.all,
            'suppliers'
        ],
    materialUnits: ()=>[
            ...adminKeys.all,
            'material-units'
        ],
    materialCategories: ()=>[
            ...adminKeys.all,
            'material-categories'
        ],
    positions: ()=>[
            ...adminKeys.all,
            'positions'
        ],
    licenseTypes: ()=>[
            ...adminKeys.all,
            'license-types'
        ],
    inspectionTypes: ()=>[
            ...adminKeys.all,
            'inspection-types'
        ]
};
function useUsers() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminKeys.users(),
        queryFn: {
            "useUsers.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].getUsers()
        }["useUsers.useQuery"],
        staleTime: 1000 * 60 * 5
    });
}
_s(useUsers, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useUser(id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminKeys.user(id),
        queryFn: {
            "useUser.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].getUser(id)
        }["useUser.useQuery"],
        enabled: !!id
    });
}
_s1(useUser, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateUser() {
    _s2();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateUser.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].createUser(data)
        }["useCreateUser.useMutation"],
        onSuccess: {
            "useCreateUser.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.users()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Utilizatorul a fost creat cu succes');
            }
        }["useCreateUser.useMutation"],
        onError: {
            "useCreateUser.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea utilizatorului: ${error.message}`);
            }
        }["useCreateUser.useMutation"]
    });
}
_s2(useCreateUser, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateUser() {
    _s3();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateUser.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].updateUser(id, data)
        }["useUpdateUser.useMutation"],
        onSuccess: {
            "useUpdateUser.useMutation": (user)=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.users()
                });
                queryClient.invalidateQueries({
                    queryKey: adminKeys.user(user.id)
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Utilizatorul a fost actualizat cu succes');
            }
        }["useUpdateUser.useMutation"],
        onError: {
            "useUpdateUser.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea utilizatorului: ${error.message}`);
            }
        }["useUpdateUser.useMutation"]
    });
}
_s3(useUpdateUser, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteUser() {
    _s4();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteUser.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].deleteUser(id)
        }["useDeleteUser.useMutation"],
        onSuccess: {
            "useDeleteUser.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.users()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Utilizatorul a fost șters cu succes');
            }
        }["useDeleteUser.useMutation"],
        onError: {
            "useDeleteUser.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea utilizatorului: ${error.message}`);
            }
        }["useDeleteUser.useMutation"]
    });
}
_s4(useDeleteUser, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useActivateUser() {
    _s5();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useActivateUser.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].activateUser(id)
        }["useActivateUser.useMutation"],
        onSuccess: {
            "useActivateUser.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.users()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Utilizatorul a fost activat');
            }
        }["useActivateUser.useMutation"],
        onError: {
            "useActivateUser.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la activarea utilizatorului: ${error.message}`);
            }
        }["useActivateUser.useMutation"]
    });
}
_s5(useActivateUser, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeactivateUser() {
    _s6();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeactivateUser.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].deactivateUser(id)
        }["useDeactivateUser.useMutation"],
        onSuccess: {
            "useDeactivateUser.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.users()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Utilizatorul a fost dezactivat');
            }
        }["useDeactivateUser.useMutation"],
        onError: {
            "useDeactivateUser.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la dezactivarea utilizatorului: ${error.message}`);
            }
        }["useDeactivateUser.useMutation"]
    });
}
_s6(useDeactivateUser, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useResetUserPin() {
    _s7();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useResetUserPin.useMutation": ({ id, pin })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].resetUserPin(id, pin)
        }["useResetUserPin.useMutation"],
        onSuccess: {
            "useResetUserPin.useMutation": ()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('PIN-ul a fost resetat cu succes');
            }
        }["useResetUserPin.useMutation"],
        onError: {
            "useResetUserPin.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la resetarea PIN-ului: ${error.message}`);
            }
        }["useResetUserPin.useMutation"]
    });
}
_s7(useResetUserPin, "wwwtpB20p0aLiHIvSy5P98MwIUg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useAdminBrands() {
    _s8();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminKeys.brands(),
        queryFn: {
            "useAdminBrands.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].getBrands()
        }["useAdminBrands.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s8(useAdminBrands, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateBrand() {
    _s9();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateBrand.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].createBrand(data)
        }["useCreateBrand.useMutation"],
        onSuccess: {
            "useCreateBrand.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.brands()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Marca a fost creată cu succes');
            }
        }["useCreateBrand.useMutation"],
        onError: {
            "useCreateBrand.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea mărcii: ${error.message}`);
            }
        }["useCreateBrand.useMutation"]
    });
}
_s9(useCreateBrand, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateBrand() {
    _s10();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateBrand.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].updateBrand(id, data)
        }["useUpdateBrand.useMutation"],
        onSuccess: {
            "useUpdateBrand.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.brands()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Marca a fost actualizată cu succes');
            }
        }["useUpdateBrand.useMutation"],
        onError: {
            "useUpdateBrand.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea mărcii: ${error.message}`);
            }
        }["useUpdateBrand.useMutation"]
    });
}
_s10(useUpdateBrand, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteBrand() {
    _s11();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteBrand.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].deleteBrand(id)
        }["useDeleteBrand.useMutation"],
        onSuccess: {
            "useDeleteBrand.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.brands()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Marca a fost ștearsă cu succes');
            }
        }["useDeleteBrand.useMutation"],
        onError: {
            "useDeleteBrand.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea mărcii: ${error.message}`);
            }
        }["useDeleteBrand.useMutation"]
    });
}
_s11(useDeleteBrand, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useAdminModels(brandId) {
    _s12();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminKeys.models(brandId),
        queryFn: {
            "useAdminModels.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].getModels(brandId)
        }["useAdminModels.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s12(useAdminModels, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateModel() {
    _s13();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateModel.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].createModel(data)
        }["useCreateModel.useMutation"],
        onSuccess: {
            "useCreateModel.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.models()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Modelul a fost creat cu succes');
            }
        }["useCreateModel.useMutation"],
        onError: {
            "useCreateModel.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea modelului: ${error.message}`);
            }
        }["useCreateModel.useMutation"]
    });
}
_s13(useCreateModel, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateModel() {
    _s14();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateModel.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].updateModel(id, data)
        }["useUpdateModel.useMutation"],
        onSuccess: {
            "useUpdateModel.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.models()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Modelul a fost actualizat cu succes');
            }
        }["useUpdateModel.useMutation"],
        onError: {
            "useUpdateModel.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea modelului: ${error.message}`);
            }
        }["useUpdateModel.useMutation"]
    });
}
_s14(useUpdateModel, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteModel() {
    _s15();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteModel.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].deleteModel(id)
        }["useDeleteModel.useMutation"],
        onSuccess: {
            "useDeleteModel.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.models()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Modelul a fost șters cu succes');
            }
        }["useDeleteModel.useMutation"],
        onError: {
            "useDeleteModel.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea modelului: ${error.message}`);
            }
        }["useDeleteModel.useMutation"]
    });
}
_s15(useDeleteModel, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useAdminVehicleTypes() {
    _s16();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminKeys.vehicleTypes(),
        queryFn: {
            "useAdminVehicleTypes.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].getVehicleTypes()
        }["useAdminVehicleTypes.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s16(useAdminVehicleTypes, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateVehicleType() {
    _s17();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateVehicleType.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].createVehicleType(data)
        }["useCreateVehicleType.useMutation"],
        onSuccess: {
            "useCreateVehicleType.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.vehicleTypes()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Tipul de vehicul a fost creat cu succes');
            }
        }["useCreateVehicleType.useMutation"],
        onError: {
            "useCreateVehicleType.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea tipului de vehicul: ${error.message}`);
            }
        }["useCreateVehicleType.useMutation"]
    });
}
_s17(useCreateVehicleType, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateVehicleType() {
    _s18();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateVehicleType.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].updateVehicleType(id, data)
        }["useUpdateVehicleType.useMutation"],
        onSuccess: {
            "useUpdateVehicleType.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.vehicleTypes()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Tipul de vehicul a fost actualizat cu succes');
            }
        }["useUpdateVehicleType.useMutation"],
        onError: {
            "useUpdateVehicleType.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea tipului de vehicul: ${error.message}`);
            }
        }["useUpdateVehicleType.useMutation"]
    });
}
_s18(useUpdateVehicleType, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteVehicleType() {
    _s19();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteVehicleType.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].deleteVehicleType(id)
        }["useDeleteVehicleType.useMutation"],
        onSuccess: {
            "useDeleteVehicleType.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.vehicleTypes()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Tipul de vehicul a fost șters cu succes');
            }
        }["useDeleteVehicleType.useMutation"],
        onError: {
            "useDeleteVehicleType.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea tipului de vehicul: ${error.message}`);
            }
        }["useDeleteVehicleType.useMutation"]
    });
}
_s19(useDeleteVehicleType, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useAdminVehicleStatuses() {
    _s20();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminKeys.vehicleStatuses(),
        queryFn: {
            "useAdminVehicleStatuses.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].getVehicleStatuses()
        }["useAdminVehicleStatuses.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s20(useAdminVehicleStatuses, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateVehicleStatus() {
    _s21();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateVehicleStatus.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].createVehicleStatus(data)
        }["useCreateVehicleStatus.useMutation"],
        onSuccess: {
            "useCreateVehicleStatus.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.vehicleStatuses()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Statusul vehiculului a fost creat cu succes');
            }
        }["useCreateVehicleStatus.useMutation"],
        onError: {
            "useCreateVehicleStatus.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea statusului: ${error.message}`);
            }
        }["useCreateVehicleStatus.useMutation"]
    });
}
_s21(useCreateVehicleStatus, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateVehicleStatus() {
    _s22();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateVehicleStatus.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].updateVehicleStatus(id, data)
        }["useUpdateVehicleStatus.useMutation"],
        onSuccess: {
            "useUpdateVehicleStatus.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.vehicleStatuses()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Statusul vehiculului a fost actualizat cu succes');
            }
        }["useUpdateVehicleStatus.useMutation"],
        onError: {
            "useUpdateVehicleStatus.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea statusului: ${error.message}`);
            }
        }["useUpdateVehicleStatus.useMutation"]
    });
}
_s22(useUpdateVehicleStatus, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteVehicleStatus() {
    _s23();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteVehicleStatus.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].deleteVehicleStatus(id)
        }["useDeleteVehicleStatus.useMutation"],
        onSuccess: {
            "useDeleteVehicleStatus.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.vehicleStatuses()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Statusul vehiculului a fost șters cu succes');
            }
        }["useDeleteVehicleStatus.useMutation"],
        onError: {
            "useDeleteVehicleStatus.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea statusului: ${error.message}`);
            }
        }["useDeleteVehicleStatus.useMutation"]
    });
}
_s23(useDeleteVehicleStatus, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useAdminFuelTypes() {
    _s24();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminKeys.fuelTypes(),
        queryFn: {
            "useAdminFuelTypes.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].getFuelTypes()
        }["useAdminFuelTypes.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s24(useAdminFuelTypes, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateFuelType() {
    _s25();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateFuelType.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].createFuelType(data)
        }["useCreateFuelType.useMutation"],
        onSuccess: {
            "useCreateFuelType.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.fuelTypes()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Tipul de combustibil a fost creat cu succes');
            }
        }["useCreateFuelType.useMutation"],
        onError: {
            "useCreateFuelType.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea tipului de combustibil: ${error.message}`);
            }
        }["useCreateFuelType.useMutation"]
    });
}
_s25(useCreateFuelType, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateFuelType() {
    _s26();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateFuelType.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].updateFuelType(id, data)
        }["useUpdateFuelType.useMutation"],
        onSuccess: {
            "useUpdateFuelType.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.fuelTypes()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Tipul de combustibil a fost actualizat cu succes');
            }
        }["useUpdateFuelType.useMutation"],
        onError: {
            "useUpdateFuelType.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea tipului de combustibil: ${error.message}`);
            }
        }["useUpdateFuelType.useMutation"]
    });
}
_s26(useUpdateFuelType, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteFuelType() {
    _s27();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteFuelType.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].deleteFuelType(id)
        }["useDeleteFuelType.useMutation"],
        onSuccess: {
            "useDeleteFuelType.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.fuelTypes()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Tipul de combustibil a fost șters cu succes');
            }
        }["useDeleteFuelType.useMutation"],
        onError: {
            "useDeleteFuelType.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea tipului de combustibil: ${error.message}`);
            }
        }["useDeleteFuelType.useMutation"]
    });
}
_s27(useDeleteFuelType, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useAdminFuelStations() {
    _s28();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminKeys.fuelStations(),
        queryFn: {
            "useAdminFuelStations.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].getFuelStations()
        }["useAdminFuelStations.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s28(useAdminFuelStations, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateFuelStation() {
    _s29();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateFuelStation.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].createFuelStation(data)
        }["useCreateFuelStation.useMutation"],
        onSuccess: {
            "useCreateFuelStation.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.fuelStations()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Stația de combustibil a fost creată cu succes');
            }
        }["useCreateFuelStation.useMutation"],
        onError: {
            "useCreateFuelStation.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea stației: ${error.message}`);
            }
        }["useCreateFuelStation.useMutation"]
    });
}
_s29(useCreateFuelStation, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateFuelStation() {
    _s30();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateFuelStation.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].updateFuelStation(id, data)
        }["useUpdateFuelStation.useMutation"],
        onSuccess: {
            "useUpdateFuelStation.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.fuelStations()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Stația de combustibil a fost actualizată cu succes');
            }
        }["useUpdateFuelStation.useMutation"],
        onError: {
            "useUpdateFuelStation.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea stației: ${error.message}`);
            }
        }["useUpdateFuelStation.useMutation"]
    });
}
_s30(useUpdateFuelStation, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteFuelStation() {
    _s31();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteFuelStation.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].deleteFuelStation(id)
        }["useDeleteFuelStation.useMutation"],
        onSuccess: {
            "useDeleteFuelStation.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.fuelStations()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Stația de combustibil a fost ștearsă cu succes');
            }
        }["useDeleteFuelStation.useMutation"],
        onError: {
            "useDeleteFuelStation.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea stației: ${error.message}`);
            }
        }["useDeleteFuelStation.useMutation"]
    });
}
_s31(useDeleteFuelStation, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useAdminMaintenanceTypes() {
    _s32();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminKeys.maintenanceTypes(),
        queryFn: {
            "useAdminMaintenanceTypes.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].getMaintenanceTypes()
        }["useAdminMaintenanceTypes.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s32(useAdminMaintenanceTypes, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateMaintenanceType() {
    _s33();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateMaintenanceType.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].createMaintenanceType(data)
        }["useCreateMaintenanceType.useMutation"],
        onSuccess: {
            "useCreateMaintenanceType.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.maintenanceTypes()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Tipul de mentenanță a fost creat cu succes');
            }
        }["useCreateMaintenanceType.useMutation"],
        onError: {
            "useCreateMaintenanceType.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea tipului de mentenanță: ${error.message}`);
            }
        }["useCreateMaintenanceType.useMutation"]
    });
}
_s33(useCreateMaintenanceType, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateMaintenanceType() {
    _s34();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateMaintenanceType.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].updateMaintenanceType(id, data)
        }["useUpdateMaintenanceType.useMutation"],
        onSuccess: {
            "useUpdateMaintenanceType.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.maintenanceTypes()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Tipul de mentenanță a fost actualizat cu succes');
            }
        }["useUpdateMaintenanceType.useMutation"],
        onError: {
            "useUpdateMaintenanceType.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea tipului de mentenanță: ${error.message}`);
            }
        }["useUpdateMaintenanceType.useMutation"]
    });
}
_s34(useUpdateMaintenanceType, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteMaintenanceType() {
    _s35();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteMaintenanceType.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].deleteMaintenanceType(id)
        }["useDeleteMaintenanceType.useMutation"],
        onSuccess: {
            "useDeleteMaintenanceType.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.maintenanceTypes()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Tipul de mentenanță a fost șters cu succes');
            }
        }["useDeleteMaintenanceType.useMutation"],
        onError: {
            "useDeleteMaintenanceType.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea tipului de mentenanță: ${error.message}`);
            }
        }["useDeleteMaintenanceType.useMutation"]
    });
}
_s35(useDeleteMaintenanceType, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useAdminDepartments() {
    _s36();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminKeys.departments(),
        queryFn: {
            "useAdminDepartments.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].getDepartments()
        }["useAdminDepartments.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s36(useAdminDepartments, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateDepartment() {
    _s37();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateDepartment.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].createDepartment(data)
        }["useCreateDepartment.useMutation"],
        onSuccess: {
            "useCreateDepartment.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.departments()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Departamentul a fost creat cu succes');
            }
        }["useCreateDepartment.useMutation"],
        onError: {
            "useCreateDepartment.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea departamentului: ${error.message}`);
            }
        }["useCreateDepartment.useMutation"]
    });
}
_s37(useCreateDepartment, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateDepartment() {
    _s38();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateDepartment.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].updateDepartment(id, data)
        }["useUpdateDepartment.useMutation"],
        onSuccess: {
            "useUpdateDepartment.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.departments()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Departamentul a fost actualizat cu succes');
            }
        }["useUpdateDepartment.useMutation"],
        onError: {
            "useUpdateDepartment.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea departamentului: ${error.message}`);
            }
        }["useUpdateDepartment.useMutation"]
    });
}
_s38(useUpdateDepartment, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteDepartment() {
    _s39();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteDepartment.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].deleteDepartment(id)
        }["useDeleteDepartment.useMutation"],
        onSuccess: {
            "useDeleteDepartment.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.departments()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Departamentul a fost șters cu succes');
            }
        }["useDeleteDepartment.useMutation"],
        onError: {
            "useDeleteDepartment.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea departamentului: ${error.message}`);
            }
        }["useDeleteDepartment.useMutation"]
    });
}
_s39(useDeleteDepartment, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useAdminLocations() {
    _s40();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminKeys.locations(),
        queryFn: {
            "useAdminLocations.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].getLocations()
        }["useAdminLocations.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s40(useAdminLocations, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateLocation() {
    _s41();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateLocation.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].createLocation(data)
        }["useCreateLocation.useMutation"],
        onSuccess: {
            "useCreateLocation.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.locations()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Locația a fost creată cu succes');
            }
        }["useCreateLocation.useMutation"],
        onError: {
            "useCreateLocation.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea locației: ${error.message}`);
            }
        }["useCreateLocation.useMutation"]
    });
}
_s41(useCreateLocation, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateLocation() {
    _s42();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateLocation.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].updateLocation(id, data)
        }["useUpdateLocation.useMutation"],
        onSuccess: {
            "useUpdateLocation.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.locations()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Locația a fost actualizată cu succes');
            }
        }["useUpdateLocation.useMutation"],
        onError: {
            "useUpdateLocation.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea locației: ${error.message}`);
            }
        }["useUpdateLocation.useMutation"]
    });
}
_s42(useUpdateLocation, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteLocation() {
    _s43();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteLocation.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].deleteLocation(id)
        }["useDeleteLocation.useMutation"],
        onSuccess: {
            "useDeleteLocation.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.locations()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Locația a fost ștearsă cu succes');
            }
        }["useDeleteLocation.useMutation"],
        onError: {
            "useDeleteLocation.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea locației: ${error.message}`);
            }
        }["useDeleteLocation.useMutation"]
    });
}
_s43(useDeleteLocation, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useAdminCities() {
    _s44();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminKeys.cities(),
        queryFn: {
            "useAdminCities.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].getCities()
        }["useAdminCities.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s44(useAdminCities, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateCity() {
    _s45();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateCity.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].createCity(data)
        }["useCreateCity.useMutation"],
        onSuccess: {
            "useCreateCity.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.cities()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Orașul a fost creat cu succes');
            }
        }["useCreateCity.useMutation"],
        onError: {
            "useCreateCity.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea orașului: ${error.message}`);
            }
        }["useCreateCity.useMutation"]
    });
}
_s45(useCreateCity, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateCity() {
    _s46();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateCity.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].updateCity(id, data)
        }["useUpdateCity.useMutation"],
        onSuccess: {
            "useUpdateCity.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.cities()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Orașul a fost actualizat cu succes');
            }
        }["useUpdateCity.useMutation"],
        onError: {
            "useUpdateCity.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea orașului: ${error.message}`);
            }
        }["useUpdateCity.useMutation"]
    });
}
_s46(useUpdateCity, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteCity() {
    _s47();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteCity.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].deleteCity(id)
        }["useDeleteCity.useMutation"],
        onSuccess: {
            "useDeleteCity.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.cities()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Orașul a fost șters cu succes');
            }
        }["useDeleteCity.useMutation"],
        onError: {
            "useDeleteCity.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea orașului: ${error.message}`);
            }
        }["useDeleteCity.useMutation"]
    });
}
_s47(useDeleteCity, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useAdminSuppliers() {
    _s48();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminKeys.suppliers(),
        queryFn: {
            "useAdminSuppliers.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].getSuppliers()
        }["useAdminSuppliers.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s48(useAdminSuppliers, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateSupplier() {
    _s49();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateSupplier.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].createSupplier(data)
        }["useCreateSupplier.useMutation"],
        onSuccess: {
            "useCreateSupplier.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.suppliers()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Furnizorul a fost creat cu succes');
            }
        }["useCreateSupplier.useMutation"],
        onError: {
            "useCreateSupplier.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea furnizorului: ${error.message}`);
            }
        }["useCreateSupplier.useMutation"]
    });
}
_s49(useCreateSupplier, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateSupplier() {
    _s50();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateSupplier.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].updateSupplier(id, data)
        }["useUpdateSupplier.useMutation"],
        onSuccess: {
            "useUpdateSupplier.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.suppliers()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Furnizorul a fost actualizat cu succes');
            }
        }["useUpdateSupplier.useMutation"],
        onError: {
            "useUpdateSupplier.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea furnizorului: ${error.message}`);
            }
        }["useUpdateSupplier.useMutation"]
    });
}
_s50(useUpdateSupplier, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteSupplier() {
    _s51();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteSupplier.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].deleteSupplier(id)
        }["useDeleteSupplier.useMutation"],
        onSuccess: {
            "useDeleteSupplier.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.suppliers()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Furnizorul a fost șters cu succes');
            }
        }["useDeleteSupplier.useMutation"],
        onError: {
            "useDeleteSupplier.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea furnizorului: ${error.message}`);
            }
        }["useDeleteSupplier.useMutation"]
    });
}
_s51(useDeleteSupplier, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useAdminMaterialUnits() {
    _s52();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminKeys.materialUnits(),
        queryFn: {
            "useAdminMaterialUnits.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].getMaterialUnits()
        }["useAdminMaterialUnits.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s52(useAdminMaterialUnits, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateMaterialUnit() {
    _s53();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateMaterialUnit.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].createMaterialUnit(data)
        }["useCreateMaterialUnit.useMutation"],
        onSuccess: {
            "useCreateMaterialUnit.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.materialUnits()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Unitatea de măsură a fost creată cu succes');
            }
        }["useCreateMaterialUnit.useMutation"],
        onError: {
            "useCreateMaterialUnit.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea unității de măsură: ${error.message}`);
            }
        }["useCreateMaterialUnit.useMutation"]
    });
}
_s53(useCreateMaterialUnit, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateMaterialUnit() {
    _s54();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateMaterialUnit.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].updateMaterialUnit(id, data)
        }["useUpdateMaterialUnit.useMutation"],
        onSuccess: {
            "useUpdateMaterialUnit.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.materialUnits()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Unitatea de măsură a fost actualizată cu succes');
            }
        }["useUpdateMaterialUnit.useMutation"],
        onError: {
            "useUpdateMaterialUnit.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea unității de măsură: ${error.message}`);
            }
        }["useUpdateMaterialUnit.useMutation"]
    });
}
_s54(useUpdateMaterialUnit, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteMaterialUnit() {
    _s55();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteMaterialUnit.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].deleteMaterialUnit(id)
        }["useDeleteMaterialUnit.useMutation"],
        onSuccess: {
            "useDeleteMaterialUnit.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.materialUnits()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Unitatea de măsură a fost ștearsă cu succes');
            }
        }["useDeleteMaterialUnit.useMutation"],
        onError: {
            "useDeleteMaterialUnit.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea unității de măsură: ${error.message}`);
            }
        }["useDeleteMaterialUnit.useMutation"]
    });
}
_s55(useDeleteMaterialUnit, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useAdminMaterialCategories() {
    _s56();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminKeys.materialCategories(),
        queryFn: {
            "useAdminMaterialCategories.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].getMaterialCategories()
        }["useAdminMaterialCategories.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s56(useAdminMaterialCategories, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateMaterialCategory() {
    _s57();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateMaterialCategory.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].createMaterialCategory(data)
        }["useCreateMaterialCategory.useMutation"],
        onSuccess: {
            "useCreateMaterialCategory.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.materialCategories()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Categoria de materiale a fost creată cu succes');
            }
        }["useCreateMaterialCategory.useMutation"],
        onError: {
            "useCreateMaterialCategory.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea categoriei: ${error.message}`);
            }
        }["useCreateMaterialCategory.useMutation"]
    });
}
_s57(useCreateMaterialCategory, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateMaterialCategory() {
    _s58();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateMaterialCategory.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].updateMaterialCategory(id, data)
        }["useUpdateMaterialCategory.useMutation"],
        onSuccess: {
            "useUpdateMaterialCategory.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.materialCategories()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Categoria de materiale a fost actualizată cu succes');
            }
        }["useUpdateMaterialCategory.useMutation"],
        onError: {
            "useUpdateMaterialCategory.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea categoriei: ${error.message}`);
            }
        }["useUpdateMaterialCategory.useMutation"]
    });
}
_s58(useUpdateMaterialCategory, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteMaterialCategory() {
    _s59();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteMaterialCategory.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].deleteMaterialCategory(id)
        }["useDeleteMaterialCategory.useMutation"],
        onSuccess: {
            "useDeleteMaterialCategory.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.materialCategories()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Categoria de materiale a fost ștearsă cu succes');
            }
        }["useDeleteMaterialCategory.useMutation"],
        onError: {
            "useDeleteMaterialCategory.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea categoriei: ${error.message}`);
            }
        }["useDeleteMaterialCategory.useMutation"]
    });
}
_s59(useDeleteMaterialCategory, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useAdminPositions() {
    _s60();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminKeys.positions(),
        queryFn: {
            "useAdminPositions.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].getPositions()
        }["useAdminPositions.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s60(useAdminPositions, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreatePosition() {
    _s61();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreatePosition.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].createPosition(data)
        }["useCreatePosition.useMutation"],
        onSuccess: {
            "useCreatePosition.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.positions()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Poziția a fost creată cu succes');
            }
        }["useCreatePosition.useMutation"],
        onError: {
            "useCreatePosition.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea poziției: ${error.message}`);
            }
        }["useCreatePosition.useMutation"]
    });
}
_s61(useCreatePosition, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdatePosition() {
    _s62();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdatePosition.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].updatePosition(id, data)
        }["useUpdatePosition.useMutation"],
        onSuccess: {
            "useUpdatePosition.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.positions()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Poziția a fost actualizată cu succes');
            }
        }["useUpdatePosition.useMutation"],
        onError: {
            "useUpdatePosition.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea poziției: ${error.message}`);
            }
        }["useUpdatePosition.useMutation"]
    });
}
_s62(useUpdatePosition, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeletePosition() {
    _s63();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeletePosition.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].deletePosition(id)
        }["useDeletePosition.useMutation"],
        onSuccess: {
            "useDeletePosition.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.positions()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Poziția a fost ștearsă cu succes');
            }
        }["useDeletePosition.useMutation"],
        onError: {
            "useDeletePosition.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea poziției: ${error.message}`);
            }
        }["useDeletePosition.useMutation"]
    });
}
_s63(useDeletePosition, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useAdminLicenseTypes() {
    _s64();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminKeys.licenseTypes(),
        queryFn: {
            "useAdminLicenseTypes.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].getLicenseTypes()
        }["useAdminLicenseTypes.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s64(useAdminLicenseTypes, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateLicenseType() {
    _s65();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateLicenseType.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].createLicenseType(data)
        }["useCreateLicenseType.useMutation"],
        onSuccess: {
            "useCreateLicenseType.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.licenseTypes()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Tipul de licență a fost creat cu succes');
            }
        }["useCreateLicenseType.useMutation"],
        onError: {
            "useCreateLicenseType.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea tipului de licență: ${error.message}`);
            }
        }["useCreateLicenseType.useMutation"]
    });
}
_s65(useCreateLicenseType, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateLicenseType() {
    _s66();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateLicenseType.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].updateLicenseType(id, data)
        }["useUpdateLicenseType.useMutation"],
        onSuccess: {
            "useUpdateLicenseType.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.licenseTypes()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Tipul de licență a fost actualizat cu succes');
            }
        }["useUpdateLicenseType.useMutation"],
        onError: {
            "useUpdateLicenseType.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea tipului de licență: ${error.message}`);
            }
        }["useUpdateLicenseType.useMutation"]
    });
}
_s66(useUpdateLicenseType, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteLicenseType() {
    _s67();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteLicenseType.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].deleteLicenseType(id)
        }["useDeleteLicenseType.useMutation"],
        onSuccess: {
            "useDeleteLicenseType.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.licenseTypes()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Tipul de licență a fost șters cu succes');
            }
        }["useDeleteLicenseType.useMutation"],
        onError: {
            "useDeleteLicenseType.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea tipului de licență: ${error.message}`);
            }
        }["useDeleteLicenseType.useMutation"]
    });
}
_s67(useDeleteLicenseType, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useAdminInspectionTypes() {
    _s68();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminKeys.inspectionTypes(),
        queryFn: {
            "useAdminInspectionTypes.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].getInspectionTypes()
        }["useAdminInspectionTypes.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s68(useAdminInspectionTypes, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateInspectionType() {
    _s69();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateInspectionType.useMutation": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].createInspectionType(data)
        }["useCreateInspectionType.useMutation"],
        onSuccess: {
            "useCreateInspectionType.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.inspectionTypes()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Tipul de inspecție a fost creat cu succes');
            }
        }["useCreateInspectionType.useMutation"],
        onError: {
            "useCreateInspectionType.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la crearea tipului de inspecție: ${error.message}`);
            }
        }["useCreateInspectionType.useMutation"]
    });
}
_s69(useCreateInspectionType, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateInspectionType() {
    _s70();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateInspectionType.useMutation": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].updateInspectionType(id, data)
        }["useUpdateInspectionType.useMutation"],
        onSuccess: {
            "useUpdateInspectionType.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.inspectionTypes()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Tipul de inspecție a fost actualizat cu succes');
            }
        }["useUpdateInspectionType.useMutation"],
        onError: {
            "useUpdateInspectionType.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la actualizarea tipului de inspecție: ${error.message}`);
            }
        }["useUpdateInspectionType.useMutation"]
    });
}
_s70(useUpdateInspectionType, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteInspectionType() {
    _s71();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteInspectionType.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].deleteInspectionType(id)
        }["useDeleteInspectionType.useMutation"],
        onSuccess: {
            "useDeleteInspectionType.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: adminKeys.inspectionTypes()
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Tipul de inspecție a fost șters cu succes');
            }
        }["useDeleteInspectionType.useMutation"],
        onError: {
            "useDeleteInspectionType.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea tipului de inspecție: ${error.message}`);
            }
        }["useDeleteInspectionType.useMutation"]
    });
}
_s71(useDeleteInspectionType, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/lib/api/documents.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "documentsApi",
    ()=>documentsApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/app/frontend-next/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/client.ts [app-client] (ecmascript)");
;
const API_BASE = ("TURBOPACK compile-time value", "http://localhost:3000/api") || 'http://localhost:3000/api';
const documentsApi = {
    // Get document categories
    getCategories: async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/documents/categories');
    },
    // Get documents for an entity
    getDocuments: async (entityType, entityId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/documents/${entityType}/${entityId}`);
    },
    // Upload document
    uploadDocument: async (file, data)=>{
        const formData = new FormData();
        formData.append('document', file);
        formData.append('documentName', data.documentName);
        formData.append('entityType', data.entityType);
        formData.append('entityId', String(data.entityId));
        if (data.categoryId) formData.append('categoryId', String(data.categoryId));
        if (data.description) formData.append('description', data.description);
        if (data.expiryDate) formData.append('expiryDate', data.expiryDate);
        if (data.isPublic !== undefined) formData.append('isPublic', String(data.isPublic));
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].upload('/documents/upload', formData);
    },
    // Delete document
    deleteDocument: async (id)=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/documents/${id}`);
    },
    // Get document download URL
    getDownloadUrl: (id)=>{
        const token = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].getToken();
        return `${API_BASE}/documents/download/${id}${token ? `?token=${token}` : ''}`;
    },
    // Get photos for an entity
    getPhotos: async (entityType, entityId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/documents/photos/${entityType}/${entityId}`);
    },
    // Upload photo
    uploadPhoto: async (file, data)=>{
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('photoName', data.photoName);
        formData.append('entityType', data.entityType);
        formData.append('entityId', String(data.entityId));
        if (data.description) formData.append('description', data.description);
        if (data.isPrimary !== undefined) formData.append('isPrimary', String(data.isPrimary));
        return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].upload('/documents/photos/upload', formData);
    },
    // Delete photo
    deletePhoto: async (id)=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/documents/photos/${id}`);
    },
    // Get photo view URL
    getPhotoUrl: (id)=>{
        return `${API_BASE}/documents/photos/view/${id}`;
    },
    // Get photo download URL
    getPhotoDownloadUrl: (id)=>{
        const token = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].getToken();
        return `${API_BASE}/documents/photos/download/${id}${token ? `?token=${token}` : ''}`;
    }
};
const __TURBOPACK__default__export__ = documentsApi;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/lib/hooks/use-documents.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "documentKeys",
    ()=>documentKeys,
    "useDeleteDocument",
    ()=>useDeleteDocument,
    "useDeletePhoto",
    ()=>useDeletePhoto,
    "useDocumentCategories",
    ()=>useDocumentCategories,
    "useDocuments",
    ()=>useDocuments,
    "usePhotos",
    ()=>usePhotos,
    "useUploadDocument",
    ()=>useUploadDocument,
    "useUploadPhoto",
    ()=>useUploadPhoto
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$documents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/api/documents.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature();
'use client';
;
;
;
const documentKeys = {
    all: [
        'documents'
    ],
    categories: ()=>[
            ...documentKeys.all,
            'categories'
        ],
    documents: (entityType, entityId)=>[
            ...documentKeys.all,
            entityType,
            entityId
        ],
    photos: (entityType, entityId)=>[
            'photos',
            entityType,
            entityId
        ]
};
function useDocumentCategories() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: documentKeys.categories(),
        queryFn: {
            "useDocumentCategories.useQuery": async ()=>{
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$documents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["documentsApi"].getCategories();
                return result ?? [];
            }
        }["useDocumentCategories.useQuery"],
        staleTime: 1000 * 60 * 10
    });
}
_s(useDocumentCategories, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useDocuments(entityType, entityId) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: documentKeys.documents(entityType, entityId),
        queryFn: {
            "useDocuments.useQuery": async ()=>{
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$documents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["documentsApi"].getDocuments(entityType, entityId);
                return result ?? [];
            }
        }["useDocuments.useQuery"],
        enabled: !!entityId
    });
}
_s1(useDocuments, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useUploadDocument() {
    _s2();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUploadDocument.useMutation": ({ file, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$documents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["documentsApi"].uploadDocument(file, data)
        }["useUploadDocument.useMutation"],
        onSuccess: {
            "useUploadDocument.useMutation": (_, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: documentKeys.documents(variables.data.entityType, variables.data.entityId)
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Documentul a fost încărcat cu succes');
            }
        }["useUploadDocument.useMutation"],
        onError: {
            "useUploadDocument.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la încărcarea documentului: ${error.message}`);
            }
        }["useUploadDocument.useMutation"]
    });
}
_s2(useUploadDocument, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteDocument() {
    _s3();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteDocument.useMutation": ({ id, entityType, entityId })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$documents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["documentsApi"].deleteDocument(id)
        }["useDeleteDocument.useMutation"],
        onSuccess: {
            "useDeleteDocument.useMutation": (_, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: documentKeys.documents(variables.entityType, variables.entityId)
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Documentul a fost șters');
            }
        }["useDeleteDocument.useMutation"],
        onError: {
            "useDeleteDocument.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea documentului: ${error.message}`);
            }
        }["useDeleteDocument.useMutation"]
    });
}
_s3(useDeleteDocument, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function usePhotos(entityType, entityId) {
    _s4();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: documentKeys.photos(entityType, entityId),
        queryFn: {
            "usePhotos.useQuery": async ()=>{
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$documents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["documentsApi"].getPhotos(entityType, entityId);
                return result ?? [];
            }
        }["usePhotos.useQuery"],
        enabled: !!entityId
    });
}
_s4(usePhotos, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useUploadPhoto() {
    _s5();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUploadPhoto.useMutation": ({ file, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$documents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["documentsApi"].uploadPhoto(file, data)
        }["useUploadPhoto.useMutation"],
        onSuccess: {
            "useUploadPhoto.useMutation": (_, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: documentKeys.photos(variables.data.entityType, variables.data.entityId)
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Fotografia a fost încărcată cu succes');
            }
        }["useUploadPhoto.useMutation"],
        onError: {
            "useUploadPhoto.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la încărcarea fotografiei: ${error.message}`);
            }
        }["useUploadPhoto.useMutation"]
    });
}
_s5(useUploadPhoto, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeletePhoto() {
    _s6();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeletePhoto.useMutation": ({ id, entityType, entityId })=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$api$2f$documents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["documentsApi"].deletePhoto(id)
        }["useDeletePhoto.useMutation"],
        onSuccess: {
            "useDeletePhoto.useMutation": (_, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: documentKeys.photos(variables.entityType, variables.entityId)
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Fotografia a fost ștearsă');
            }
        }["useDeletePhoto.useMutation"],
        onError: {
            "useDeletePhoto.useMutation": (error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Eroare la ștergerea fotografiei: ${error.message}`);
            }
        }["useDeletePhoto.useMutation"]
    });
}
_s6(useDeletePhoto, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/lib/hooks/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$hooks$2f$use$2d$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/hooks/use-vehicles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$hooks$2f$use$2d$drivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/hooks/use-drivers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$hooks$2f$use$2d$fuel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/hooks/use-fuel.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$hooks$2f$use$2d$maintenance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/hooks/use-maintenance.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$hooks$2f$use$2d$warehouse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/hooks/use-warehouse.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$hooks$2f$use$2d$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/hooks/use-admin.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$hooks$2f$use$2d$documents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/hooks/use-documents.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VehiclesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$shared$2f$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/components/shared/data-table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/components/ui/alert-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/lucide-react/dist/esm/icons/pencil.js [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/lucide-react/dist/esm/icons/car.js [app-client] (ecmascript) <export default as Car>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/lucide-react/dist/esm/icons/funnel.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/lucide-react/dist/esm/icons/arrow-up-down.js [app-client] (ecmascript) <export default as ArrowUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/hooks/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$hooks$2f$use$2d$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/hooks/use-vehicles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/frontend-next/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
function VehiclesPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [filters, setFilters] = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        page: 1,
        pageSize: 10
    });
    const [showFilters, setShowFilters] = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [deleteId, setDeleteId] = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    // Queries
    const { data, isLoading, isError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$hooks$2f$use$2d$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useVehicles"])(filters);
    const { data: brands } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$hooks$2f$use$2d$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBrands"])();
    const { data: vehicleTypes } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$hooks$2f$use$2d$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useVehicleTypes"])();
    const { data: statuses } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$hooks$2f$use$2d$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useVehicleStatuses"])();
    const deleteVehicle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$hooks$2f$use$2d$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeleteVehicle"])();
    // Table columns
    const columns = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "VehiclesPage.useMemo[columns]": ()=>[
                {
                    accessorKey: 'vehicleCode',
                    header: {
                        "VehiclesPage.useMemo[columns]": ({ column })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                className: "-ml-3 h-8",
                                onClick: {
                                    "VehiclesPage.useMemo[columns]": ()=>column.toggleSorting(column.getIsSorted() === 'asc')
                                }["VehiclesPage.useMemo[columns]"],
                                children: [
                                    "Cod",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"], {
                                        className: "ml-2 h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                        lineNumber: 86,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                lineNumber: 79,
                                columnNumber: 11
                            }, this)
                    }["VehiclesPage.useMemo[columns]"],
                    cell: {
                        "VehiclesPage.useMemo[columns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-medium text-slate-900 dark:text-slate-100",
                                children: row.getValue('vehicleCode')
                            }, void 0, false, {
                                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this)
                    }["VehiclesPage.useMemo[columns]"]
                },
                {
                    accessorKey: 'licensePlate',
                    header: 'Nr. Inmatriculare',
                    cell: {
                        "VehiclesPage.useMemo[columns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-mono text-sm",
                                children: row.getValue('licensePlate')
                            }, void 0, false, {
                                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this)
                    }["VehiclesPage.useMemo[columns]"]
                },
                {
                    id: 'brandModel',
                    header: 'Marca / Model',
                    cell: {
                        "VehiclesPage.useMemo[columns]": ({ row })=>{
                            const vehicle = row.original;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "font-medium",
                                        children: vehicle.brand?.name || '-'
                                    }, void 0, false, {
                                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                        lineNumber: 109,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-slate-500",
                                        children: vehicle.model?.name || '-'
                                    }, void 0, false, {
                                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                        lineNumber: 110,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                lineNumber: 108,
                                columnNumber: 13
                            }, this);
                        }
                    }["VehiclesPage.useMemo[columns]"]
                },
                {
                    accessorKey: 'year',
                    header: 'An',
                    cell: {
                        "VehiclesPage.useMemo[columns]": ({ row })=>row.getValue('year') || '-'
                    }["VehiclesPage.useMemo[columns]"]
                },
                {
                    accessorKey: 'vehicleType',
                    header: 'Tip',
                    cell: {
                        "VehiclesPage.useMemo[columns]": ({ row })=>{
                            const vehicle = row.original;
                            return vehicle.vehicleType?.name || '-';
                        }
                    }["VehiclesPage.useMemo[columns]"]
                },
                {
                    accessorKey: 'status',
                    header: 'Status',
                    cell: {
                        "VehiclesPage.useMemo[columns]": ({ row })=>{
                            const vehicle = row.original;
                            const status = vehicle.status;
                            if (!status) return '-';
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "outline",
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('border-transparent', status.color && `bg-[${status.color}]/10 text-[${status.color}]`),
                                style: {
                                    backgroundColor: status.color ? `${status.color}20` : undefined,
                                    color: status.color || undefined,
                                    borderColor: status.color || undefined
                                },
                                children: status.name
                            }, void 0, false, {
                                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                lineNumber: 136,
                                columnNumber: 13
                            }, this);
                        }
                    }["VehiclesPage.useMemo[columns]"]
                },
                {
                    accessorKey: 'department',
                    header: 'Departament',
                    cell: {
                        "VehiclesPage.useMemo[columns]": ({ row })=>{
                            const vehicle = row.original;
                            return vehicle.department?.name || '-';
                        }
                    }["VehiclesPage.useMemo[columns]"]
                },
                {
                    accessorKey: 'odometer',
                    header: 'Kilometraj',
                    cell: {
                        "VehiclesPage.useMemo[columns]": ({ row })=>{
                            const odometer = row.getValue('odometer');
                            return odometer ? `${odometer.toLocaleString('ro-RO')} km` : '-';
                        }
                    }["VehiclesPage.useMemo[columns]"]
                },
                {
                    accessorKey: 'isActive',
                    header: 'Activ',
                    cell: {
                        "VehiclesPage.useMemo[columns]": ({ row })=>{
                            const isActive = row.getValue('isActive');
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: isActive ? 'default' : 'secondary',
                                children: isActive ? 'Activ' : 'Inactiv'
                            }, void 0, false, {
                                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                lineNumber: 172,
                                columnNumber: 13
                            }, this);
                        }
                    }["VehiclesPage.useMemo[columns]"]
                },
                {
                    id: 'actions',
                    header: '',
                    cell: {
                        "VehiclesPage.useMemo[columns]": ({ row })=>{
                            const vehicle = row.original;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                        asChild: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "icon",
                                            className: "h-8 w-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                    lineNumber: 187,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "sr-only",
                                                    children: "Deschide meniu"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                    lineNumber: 188,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                            lineNumber: 186,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                        lineNumber: 185,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                        align: "end",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                                                children: "Acțiuni"
                                            }, void 0, false, {
                                                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                lineNumber: 192,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                lineNumber: 193,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                onClick: {
                                                    "VehiclesPage.useMemo[columns]": ()=>router.push(`/vehicles/${vehicle.id}`)
                                                }["VehiclesPage.useMemo[columns]"],
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                        lineNumber: 195,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Vizualizare"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                lineNumber: 194,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                onClick: {
                                                    "VehiclesPage.useMemo[columns]": ()=>router.push(`/vehicles/${vehicle.id}/edit`)
                                                }["VehiclesPage.useMemo[columns]"],
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                        lineNumber: 199,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Editare"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                lineNumber: 198,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                onClick: {
                                                    "VehiclesPage.useMemo[columns]": ()=>router.push(`/vehicles/${vehicle.id}/documents`)
                                                }["VehiclesPage.useMemo[columns]"],
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                        lineNumber: 203,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Documente"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                lineNumber: 202,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                lineNumber: 206,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                onClick: {
                                                    "VehiclesPage.useMemo[columns]": ()=>setDeleteId(vehicle.id)
                                                }["VehiclesPage.useMemo[columns]"],
                                                className: "text-red-600 focus:text-red-600",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                        lineNumber: 211,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Șterge"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                lineNumber: 207,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                        lineNumber: 191,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                lineNumber: 184,
                                columnNumber: 13
                            }, this);
                        }
                    }["VehiclesPage.useMemo[columns]"]
                }
            ]
    }["VehiclesPage.useMemo[columns]"], [
        router
    ]);
    // Filter handlers
    const handleFilterChange = (key, value)=>{
        setFilters((prev)=>({
                ...prev,
                [key]: value === 'all' ? undefined : value,
                page: 1
            }));
    };
    const clearFilters = ()=>{
        setFilters({
            page: 1,
            pageSize: filters.pageSize
        });
    };
    const hasActiveFilters = filters.brandId || filters.vehicleTypeId || filters.statusId || filters.search;
    // Handle delete
    const handleDelete = async ()=>{
        if (!deleteId) return;
        await deleteVehicle.mutateAsync(deleteId);
        setDeleteId(null);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100",
                                children: "Vehicule"
                            }, void 0, false, {
                                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                lineNumber: 251,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-slate-500",
                                children: "Gestionează flota de vehicule a companiei"
                            }, void 0, false, {
                                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                lineNumber: 254,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                        lineNumber: 250,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                onClick: ()=>setShowFilters(!showFilters),
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(hasActiveFilters && 'border-blue-500 text-blue-600'),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                        className: "mr-2 h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                        lineNumber: 265,
                                        columnNumber: 13
                                    }, this),
                                    "Filtre",
                                    hasActiveFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                        variant: "secondary",
                                        className: "ml-2 h-5 px-1.5",
                                        children: [
                                            filters.brandId,
                                            filters.vehicleTypeId,
                                            filters.statusId,
                                            filters.search
                                        ].filter(Boolean).length
                                    }, void 0, false, {
                                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                        lineNumber: 268,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                lineNumber: 259,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: ()=>router.push('/vehicles/new'),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        className: "mr-2 h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                        lineNumber: 274,
                                        columnNumber: 13
                                    }, this),
                                    "Vehicul nou"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                lineNumber: 273,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                        lineNumber: 258,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                lineNumber: 249,
                columnNumber: 7
            }, this),
            showFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                        className: "pb-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                    className: "text-base",
                                    children: "Filtre"
                                }, void 0, false, {
                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                    lineNumber: 285,
                                    columnNumber: 15
                                }, this),
                                hasActiveFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "sm",
                                    onClick: clearFilters,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "mr-2 h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                            lineNumber: 288,
                                            columnNumber: 19
                                        }, this),
                                        "Resetează"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                    lineNumber: 287,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                            lineNumber: 284,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                        lineNumber: 283,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-medium text-slate-700 dark:text-slate-300",
                                            children: "Marca"
                                        }, void 0, false, {
                                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                            lineNumber: 297,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                            value: filters.brandId?.toString() || 'all',
                                            onValueChange: (value)=>handleFilterChange('brandId', value === 'all' ? undefined : parseInt(value)),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                        placeholder: "Toate mărcile"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                        lineNumber: 305,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                    lineNumber: 304,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                            value: "all",
                                                            children: "Toate mărcile"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                            lineNumber: 308,
                                                            columnNumber: 21
                                                        }, this),
                                                        brands?.map((brand)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: brand.id.toString(),
                                                                children: brand.name
                                                            }, brand.id, false, {
                                                                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                                lineNumber: 310,
                                                                columnNumber: 23
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                    lineNumber: 307,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                            lineNumber: 300,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                    lineNumber: 296,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-medium text-slate-700 dark:text-slate-300",
                                            children: "Tip vehicul"
                                        }, void 0, false, {
                                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                            lineNumber: 319,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                            value: filters.vehicleTypeId?.toString() || 'all',
                                            onValueChange: (value)=>handleFilterChange('vehicleTypeId', value === 'all' ? undefined : parseInt(value)),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                        placeholder: "Toate tipurile"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                        lineNumber: 327,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                    lineNumber: 326,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                            value: "all",
                                                            children: "Toate tipurile"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                            lineNumber: 330,
                                                            columnNumber: 21
                                                        }, this),
                                                        vehicleTypes?.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: type.id.toString(),
                                                                children: type.name
                                                            }, type.id, false, {
                                                                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                                lineNumber: 332,
                                                                columnNumber: 23
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                    lineNumber: 329,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                            lineNumber: 322,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                    lineNumber: 318,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-medium text-slate-700 dark:text-slate-300",
                                            children: "Status"
                                        }, void 0, false, {
                                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                            lineNumber: 341,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                            value: filters.statusId?.toString() || 'all',
                                            onValueChange: (value)=>handleFilterChange('statusId', value === 'all' ? undefined : parseInt(value)),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                        placeholder: "Toate statusurile"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                        lineNumber: 349,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                    lineNumber: 348,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                            value: "all",
                                                            children: "Toate statusurile"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                            lineNumber: 352,
                                                            columnNumber: 21
                                                        }, this),
                                                        statuses?.map((status)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: status.id.toString(),
                                                                children: status.name
                                                            }, status.id, false, {
                                                                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                                lineNumber: 354,
                                                                columnNumber: 23
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                    lineNumber: 351,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                            lineNumber: 344,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                    lineNumber: 340,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-medium text-slate-700 dark:text-slate-300",
                                            children: "Stare"
                                        }, void 0, false, {
                                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                            lineNumber: 363,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                            value: filters.isActive?.toString() || 'all',
                                            onValueChange: (value)=>handleFilterChange('isActive', value === 'all' ? undefined : value === 'true'),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                        placeholder: "Toate"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                        lineNumber: 371,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                    lineNumber: 370,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                            value: "all",
                                                            children: "Toate"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                            lineNumber: 374,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                            value: "true",
                                                            children: "Active"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                            lineNumber: 375,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                            value: "false",
                                                            children: "Inactive"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                            lineNumber: 376,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                                    lineNumber: 373,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                            lineNumber: 366,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                    lineNumber: 362,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                            lineNumber: 295,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                        lineNumber: 294,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                lineNumber: 282,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "pt-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__["Car"], {
                                        className: "h-5 w-5 text-blue-600 dark:text-blue-400"
                                    }, void 0, false, {
                                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                        lineNumber: 391,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                    lineNumber: 390,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-slate-500",
                                            children: "Total vehicule"
                                        }, void 0, false, {
                                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                            lineNumber: 394,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-2xl font-bold",
                                            children: isLoading ? '-' : data?.pagination.totalItems || 0
                                        }, void 0, false, {
                                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                            lineNumber: 395,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                    lineNumber: 393,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                            lineNumber: 389,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                        lineNumber: 388,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                    lineNumber: 387,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                lineNumber: 386,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                    className: "pt-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$shared$2f$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTable"], {
                        columns: columns,
                        data: data?.data || [],
                        loading: isLoading,
                        searchPlaceholder: "Caută după cod, nr. înmatriculare...",
                        serverSide: true,
                        totalItems: data?.pagination.totalItems,
                        currentPage: filters.page || 1,
                        pageSize: filters.pageSize || 10,
                        onPageChange: (page)=>setFilters((prev)=>({
                                    ...prev,
                                    page
                                })),
                        onPageSizeChange: (pageSize)=>setFilters((prev)=>({
                                    ...prev,
                                    pageSize,
                                    page: 1
                                })),
                        onSearchChange: (search)=>setFilters((prev)=>({
                                    ...prev,
                                    search,
                                    page: 1
                                })),
                        onSortChange: (sortBy, sortOrder)=>setFilters((prev)=>({
                                    ...prev,
                                    sortBy,
                                    sortOrder
                                }))
                    }, void 0, false, {
                        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                        lineNumber: 407,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                    lineNumber: 406,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                lineNumber: 405,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialog"], {
                open: !!deleteId,
                onOpenChange: (open)=>!open && setDeleteId(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                    children: "Ești sigur că vrei să ștergi acest vehicul?"
                                }, void 0, false, {
                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                    lineNumber: 428,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                    children: "Această acțiune nu poate fi anulată. Vehiculul va fi marcat ca inactiv și nu va mai apărea în listele active."
                                }, void 0, false, {
                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                    lineNumber: 429,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                            lineNumber: 427,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    children: "Anulează"
                                }, void 0, false, {
                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                    lineNumber: 435,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    onClick: handleDelete,
                                    className: "bg-red-600 hover:bg-red-700",
                                    children: "Șterge"
                                }, void 0, false, {
                                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                                    lineNumber: 436,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                            lineNumber: 434,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                    lineNumber: 426,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
                lineNumber: 425,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/frontend-next/src/app/(dashboard)/vehicles/page.tsx",
        lineNumber: 247,
        columnNumber: 5
    }, this);
}
_s(VehiclesPage, "aYMJOvi1s0ws5psY3Qc5761b1kQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$hooks$2f$use$2d$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useVehicles"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$hooks$2f$use$2d$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBrands"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$hooks$2f$use$2d$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useVehicleTypes"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$hooks$2f$use$2d$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useVehicleStatuses"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$frontend$2d$next$2f$src$2f$lib$2f$hooks$2f$use$2d$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeleteVehicle"]
    ];
});
_c = VehiclesPage;
var _c;
__turbopack_context__.k.register(_c, "VehiclesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_frontend-next_src_b43eef29._.js.map