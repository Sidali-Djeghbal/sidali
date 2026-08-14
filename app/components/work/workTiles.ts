export type WorkTile = {
	title: string;
	description: string;
	image: {
		src: string;
		width: number;
		height: number;
	};
};

export const workTiles: WorkTile[] = [
	{
		description: `Here are things`,
		title: `I've worked on`,
		image: {
			src: '/static/images/aphex-apps.webp',
			width: 600,
			height: 770,
		},
	},
	{
		description: 'I built',
		title: 'Bunian — Official Website',
		image: {
			src: '/static/images/field-app.webp',
			width: 600,
			height: 554,
		},
	},
	{
		description: `I built`,
		title: 'Daad Blockly',
		image: {
			src: '/static/images/planner-app.webp',
			width: 600,
			height: 717,
		},
	},
	{
		description: `I built`,
		title: 'HaramFilter',
		image: {
			src: '/static/images/publication-app.webp',
			width: 600,
			height: 717,
		},
	},
];
