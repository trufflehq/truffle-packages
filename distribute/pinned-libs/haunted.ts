// the default lit import by haunted has some issues with ssr
// SyntaxError: Detected cycle while resolving name '_$LE' in '/v86/lit-element@3.2.1/X-ZC9yZWFjdC1kb21AMC4wLjAtZXhwZXJpbWVudGFsLTMwZWIyNjdhYi0yMDIyMDcwOCxyZWFjdEAwLjAuMC1leHBlcmltZW50YWwtMzBlYjI2N2FiLTIwMjIwNzA4/es2015/lit-element.js'
// it's an esm.sh issue, but using skypack this fixes for now
export * from "https://cdn.skypack.dev/haunted@5";
