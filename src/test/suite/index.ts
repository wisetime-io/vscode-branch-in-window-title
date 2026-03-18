import * as path from 'path';
import * as Mocha from 'mocha';
import * as fs from 'fs';

export function run(): Promise<void> {
	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		color: true,
	});

	const testsRoot = path.resolve(__dirname, '..');

	return new Promise((c, e) => {
		try {
			const suiteDir = path.resolve(testsRoot, 'suite');
			const files = fs.readdirSync(suiteDir).filter(f => f.endsWith('.test.js'));

			// Add files to the test suite
			files.forEach(f => mocha.addFile(path.resolve(suiteDir, f)));

			// Run the mocha test
			mocha.run(failures => {
				if (failures > 0) {
					e(new Error(`${failures} tests failed.`));
				} else {
					c();
				}
			});
		} catch (err) {
			console.error(err);
			e(err);
		}
	});
}
