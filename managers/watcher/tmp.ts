// TMP imported from old projects
// Will be replaced by a surperior method involving tokenizers and lexing
export const ScriptImportLine: RegExp =
	/^import\s*(?:{\s*(?<import>(?:\n\s*.*\s*?)*?|(?:.*(?=})))\s*}|(?:.*) as (?:.+))\s*from\s*["'](?<path>[.@]*\/?.+)["'];?/

export function getAllImportPaths(ns: NS, path: string, maxLines = -1, history: string[] = []): string[] {
	const scriptContent = ns.read(path);
	const scriptImportLines = scriptContent.match(new RegExp(ScriptImportLine, 'gm')) as RegExpMatchArray ?? [];

	const pathList: string[] = [];
	for (let i = 0; i < scriptImportLines.length; i++) {
		if (maxLines > 0 && i >= maxLines) { break; }

		const line = scriptImportLines[i];
		const match = new RegExp(ScriptImportLine).exec(line) as RegExpExecArray;
		let importPath = match?.groups?.path ?? null;

		if (match == null || importPath == null) continue;
		importPath = resolvePath(path, importPath)
		if (!ns.fileExists(importPath) || pathList.includes(importPath) || history.includes(importPath)) continue;

		pathList.push(importPath);
		history.push(...pathList);
		pathList.push(...getAllImportPaths(ns, importPath, maxLines, history));
	}

	let ret: string[] = [];
	pathList.forEach(p => {
		if (ret.includes(p)) {
			return
		}

		ret.push(p);
	})

	return ret;
}

/** Resolves a path relative to another file path
 * @param relative The file path relative to the path that needs to resolve.
 * This is expected to end in a file
*/
function resolvePath(relative: string, path: string): string {
	const parts: string[] = relative.split('/')
	parts.pop() // exclude the file

	for (const dir of path.split('/')) {
		if (dir == '.') {
			continue
		} else if (dir == '..') {
			parts.pop()
			continue
		}

		parts.push(dir)
	}

	const final = parts.join('/')

	return final
}
