#!/usr/bin/env node
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  'app/lang/backup.tsx',
  'app/course/lesson.tsx',
  'app/conversations/emma.tsx',
  'app/conversations/human/[conversationId].tsx',
  'app/placement.tsx',
  'app/lang/index.tsx',
  'app/lang/supplement.tsx',
  'app/lang/quiz.tsx',
  'app/lang/library.tsx',
  'app/personal-sync.tsx',
  'components/EnglishSentenceBuilder.tsx',
  'components/EnglishDialoguePractice.tsx',
  'components/EnglishSupplementTask.tsx',
  'components/EnglishUI.tsx',
];
const problems = [];
let checks = 0;
const roleValues = new Set(['button', 'radio', 'checkbox']);

function attr(opening, source, name) {
  return opening.attributes.properties.find(item => ts.isJsxAttribute(item) && item.name.getText(source) === name);
}
function hasTextDescendant(node, source) {
  let found = false;
  function walk(child) {
    if (child !== node && (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child))) {
      const name = ts.isJsxElement(child) ? child.openingElement.tagName : child.tagName;
      if (name.getText(source) === 'Text') found = true;
    }
    ts.forEachChild(child, walk);
  }
  walk(node);
  return found;
}
function stateHasProperty(stateAttr, source, property) {
  if (!stateAttr?.initializer || !ts.isJsxExpression(stateAttr.initializer) || !stateAttr.initializer.expression) return false;
  const expression = stateAttr.initializer.expression;
  if (!ts.isObjectLiteralExpression(expression)) return false;
  return expression.properties.some(item => {
    if (!ts.isPropertyAssignment(item)) return false;
    const name = ts.isIdentifier(item.name) || ts.isStringLiteral(item.name) ? item.name.text : '';
    return name === property;
  });
}

for (const relativePath of files) {
  const fullPath = path.join(root, relativePath);
  const text = readFileSync(fullPath, 'utf8');
  const source = ts.createSourceFile(fullPath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  for (const diagnostic of source.parseDiagnostics) {
    problems.push(`${relativePath}: TSX parse error: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')}`);
  }
  function visit(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(source);
      if (tag === 'Pressable') {
        const roleAttr = attr(node, source, 'accessibilityRole');
        const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
        if (!roleAttr) problems.push(`${relativePath}:${line} Pressable has no accessibilityRole`);
        else {
          checks += 1;
          if (ts.isStringLiteral(roleAttr.initializer) && !roleValues.has(roleAttr.initializer.text)) {
            problems.push(`${relativePath}:${line} uses an unexpected interactive role`);
          }
        }
        if (!attr(node, source, 'accessibilityLabel') && !hasTextDescendant(node.parent, source)) {
          problems.push(`${relativePath}:${line} icon-only Pressable has no accessibilityLabel`);
        } else checks += 1;
        const stateAttr = attr(node, source, 'accessibilityState');
        const disabledAttr = attr(node, source, 'disabled');
        if (disabledAttr && !stateHasProperty(stateAttr, source, 'disabled')) {
          problems.push(`${relativePath}:${line} disabled Pressable does not expose disabled state`);
        } else if (disabledAttr) checks += 1;
        if (roleAttr?.initializer && ts.isStringLiteral(roleAttr.initializer)
          && ['radio', 'checkbox'].includes(roleAttr.initializer.text)
          && !stateHasProperty(stateAttr, source, 'checked')) {
          problems.push(`${relativePath}:${line} ${roleAttr.initializer.text} Pressable has no checked state`);
        } else if (roleAttr?.initializer && ts.isStringLiteral(roleAttr.initializer)
          && ['radio', 'checkbox'].includes(roleAttr.initializer.text)) checks += 1;
      }
      if (tag === 'TextInput') {
        const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
        if (!attr(node, source, 'accessibilityLabel')) problems.push(`${relativePath}:${line} TextInput has no accessibilityLabel`);
        else checks += 1;
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}

const backup = readFileSync(path.join(root, 'app/lang/backup.tsx'), 'utf8');
if (!/accessibilityRole="header"[^>]*>پشتیبان پیشرفت انگلیسی/.test(backup)) problems.push('English backup screen title is not exposed as a semantic heading');
else checks += 1;
if (!/accessibilityLiveRegion="polite"[^>]*style=\{styles\.status\}/.test(backup)) problems.push('English backup status is not announced politely');
else checks += 1;
if (!/accessibilityRole="alert"[^>]*style=\{styles\.error\}/.test(backup)) problems.push('English backup errors are not exposed as alerts');
else checks += 1;

if (problems.length) {
  console.error(problems.map(item => `FAIL  ${item}`).join('\n'));
  process.exit(1);
}
console.log(`${checks} static accessibility checks passed across ${files.length} English learning, conversation, backup and placement screens/components. No screen-reader or physical-device test is implied.`);
