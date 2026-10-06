import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const canonical = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/essential504.json'), 'utf8'));
const files = fs.readdirSync(path.join(root, 'lib'))
  .filter((name) => /^courseContent.*\.ts$/.test(name))
  .map((name) => fs.readFileSync(path.join(root, 'lib', name), 'utf8'))
  .join('\n');

const tagged = [...files.matchAll(/word: '([^']+)', meaning: '(?:\\'|[^'])*', essential504: true/g)]
  .map((match) => match[1]);
const lessons = [...files.matchAll(/id:\s*'([^']+)'\s*,\s*levelId:\s*[0-4]\s*,\s*order:\s*(\d+)/g)]
  .map((match) => ({ id: match[1], order: Number(match[2]) }));
const canonicalSet = new Set(canonical);
const duplicateWords = [...new Set(tagged.filter((word, index) => tagged.indexOf(word) !== index))];
const outside = tagged.filter((word) => !canonicalSet.has(word));
const missing = canonical.filter((word) => !tagged.includes(word));
const duplicateLessonIds = [...new Set(lessons.map((lesson) => lesson.id)
  .filter((id, index, ids) => ids.indexOf(id) !== index))];
const duplicateOrders = [...new Set(lessons.map((lesson) => lesson.order)
  .filter((order, index, orders) => orders.indexOf(order) !== index))];
const lessonOrders = lessons.map((lesson) => lesson.order).sort((a, b) => a - b);
const expectedOrders = Array.from({ length: 129 }, (_, index) => index + 1);
const hasExactOrders = JSON.stringify(lessonOrders) === JSON.stringify(expectedOrders);

console.log(`Lessons: ${lessons.length}/129`);
console.log(`Canonical 504 coverage: ${tagged.length}/504`);
console.log(`Remaining: ${missing.length}`);

const problems = [];
if (duplicateWords.length) problems.push(`Duplicate tagged words: ${duplicateWords.join(', ')}`);
if (outside.length) problems.push(`Words outside canonical list: ${outside.join(', ')}`);
if (missing.length) problems.push(`Missing canonical words: ${missing.join(', ')}`);
if (duplicateLessonIds.length) problems.push(`Duplicate lesson IDs: ${duplicateLessonIds.join(', ')}`);
if (duplicateOrders.length) problems.push(`Duplicate lesson orders: ${duplicateOrders.join(', ')}`);
if (!hasExactOrders) problems.push('Lesson orders must be exactly 1 through 129.');
if (tagged.length !== 504) problems.push(`Expected exactly 504 tagged words, found ${tagged.length}.`);
if (lessons.length !== 129) problems.push(`Expected exactly 129 lessons, found ${lessons.length}.`);

if (problems.length) {
  for (const problem of problems) console.error(problem);
  process.exit(1);
}

console.log('Curriculum integrity: PASS');
