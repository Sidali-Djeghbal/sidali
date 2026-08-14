import fs from 'node:fs';
import matter from 'gray-matter';

export function readMDXFile(filePath: string) {
	const rawContent = fs.readFileSync(filePath, 'utf-8');
	const { data, content } = matter(rawContent);
	return { metadata: data, content: content.trim() };
}
