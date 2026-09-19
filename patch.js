const fs = require('fs');

const path = 'src/components/originkit/ui/dynamic-weight.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add charStyles to Props
content = content.replace(
    'style?: React.CSSProperties\r\n}',
    'style?: React.CSSProperties\r\n    charStyles?: (char: string, index: number) => React.CSSProperties\r\n}'
);
content = content.replace(
    'style?: React.CSSProperties\n}',
    'style?: React.CSSProperties\n    charStyles?: (char: string, index: number) => React.CSSProperties\n}'
);

// 2. Add it to the motion.span
const targetSpanStyle = `                                                style={{
                                                    display: "inline-block",
                                                    fontVariationSettings:
                                                        fromSettings,
                                                }}`;
const replacementSpanStyle = `                                                style={{
                                                    display: "inline-block",
                                                    fontVariationSettings:
                                                        fromSettings,
                                                    ...(props.charStyles ? props.charStyles(letter, idx) : {}),
                                                }}`;

content = content.replace(targetSpanStyle, replacementSpanStyle);

fs.writeFileSync(path, content);
console.log('Patched dynamic-weight.tsx successfully');
