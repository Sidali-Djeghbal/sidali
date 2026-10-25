import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'dev.sidalidjeghbal.commandcenter',
	appName: 'Command Center',
	webDir: 'www',
	server: {
		url: 'https://tools.sidali-djeghbal.dev',
		cleartext: false,
		allowNavigation: [
			'tools.sidali-djeghbal.dev',
			'*.tools.sidali-djeghbal.dev',
			'github.com',
			'*.github.com',
			'*.githubusercontent.com',
		],
	},
	android: {
		allowMixedContent: false,
		captureInput: true,
		webContentsDebuggingEnabled: false,
	},
};

export default config;
