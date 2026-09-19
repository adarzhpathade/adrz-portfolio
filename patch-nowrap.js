const fs = require('fs');

const path = 'src/components/originkit/ui/dynamic-weight.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Change fontSize type to number | string
content = content.replace(
    'fontSize: number',
    'fontSize: number | string'
);

// 2. Add whiteSpace nowrap to innerSpanStyle
const innerSpanStyleTarget = `    const innerSpanStyle: React.CSSProperties = {
        fontFamily: VARIABLE_FONT_STACK,
        fontSize,
        color,
        textAlign: "center",
        display: "block",
        width: "100%",
        lineHeight: 1.1,
    }`;

const innerSpanStyleReplacement = `    const innerSpanStyle: React.CSSProperties = {
        fontFamily: VARIABLE_FONT_STACK,
        fontSize,
        color,
        textAlign: "center",
        display: "block",
        width: "100%",
        lineHeight: 1.1,
        whiteSpace: "nowrap",
    }`;

content = content.replace(innerSpanStyleTarget, innerSpanStyleReplacement);

fs.writeFileSync(path, content);
console.log('Patched dynamic-weight.tsx for single line responsive text successfully');
