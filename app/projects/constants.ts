import type { Project } from './types';

export const projects: Project[] = [
	{
		title: 'FELLAHTECH — Geospatial Crop-Rotation Workspace',
		description:
			'Trilingual (EN/FR/AR with full RTL mirroring) Next.js 15 & TypeScript workspace on Cloudflare Workers integrating a Turf.js satellite CAD polygon editor, MapLibre GL 3D terrain, NASA GIBS raster overlays, and a Zod-validated TanStack Query AI Intelligence Studio.',
		src: 'fellahtech.webp',
		color: '#dce8df',
		url: 'https://fieldshift-planner.sidalidjeghbal.workers.dev',
		githubUrl:
			'https://github.com/Sidali-Djeghbal/Fellahtech-fieldshift-planner',
		role: 'Author & Maintainer',
		date: 'Nov 2026',
		tags: [
			'Next.js 15',
			'TypeScript',
			'Turf.js',
			'MapLibre GL',
			'TanStack Query',
			'Cloudflare Workers',
		],
	},
	{
		title: 'Bunian — Official Website',
		description:
			'Responsive, bidirectional (RTL/LTR) Next.js public web platform built with Algerian Tech Makers (the tech branch of Bunian) using React Server Components, structured JSON-LD metadata, and dynamic sitemaps.',
		src: 'bunianlandingpage.webp',
		color: '#e8e8e8',
		url: 'https://bunian.online',
		role: 'Frontend Engineer (Full Stack)',
		tags: ['Next.js', 'React RSC', 'TypeScript', 'RTL/LTR', 'JSON-LD'],
	},
	{
		title: 'Bunian — CMS',
		description:
			'Custom React-Admin CMS and drag-and-drop block newsletter composer built with Algerian Tech Makers for Bunian, featuring live template previews, image uploads, and quota tracking.',
		src: 'bunianCMS.webp',
		color: '#dddddd',
		role: 'Frontend Engineer (Full Stack)',
		tags: ['React-Admin', 'TypeScript', 'RTL', 'Newsletter Builder'],
	},
	{
		title: 'Hodory — Attendance System',
		description:
			'Student mobile client in React Native (Expo Router) with absence-justification flows alongside Next.js admin and teacher dashboards packaged as cross-platform Electron desktop apps, backed by a FastAPI + JWT API.',
		src: 'hodoryteacher.webp',
		color: '#d2d2d2',
		githubUrl: 'https://github.com/Sidali-Djeghbal/hodory-attendance-system',
		role: 'Author & Maintainer',
		date: 'Jan 2026',
		tags: ['React Native', 'Expo Router', 'Next.js', 'Electron', 'FastAPI'],
	},
	{
		title: 'Daad Blockly',
		description:
			'Custom visual-to-source code generator and 50+ custom Blockly definitions backed by a DOM-free core state layer unit-tested headlessly with Vitest, with automated multi-OS Electron builds via GitHub Actions.',
		src: 'daadblockly.webp',
		color: '#dddddd',
		githubUrl: 'https://github.com/daadLang/daad-blockly',
		role: 'Author & Maintainer',
		date: 'May – Aug 2025',
		tags: ['Blockly', 'TypeScript', 'Vitest', 'Electron', 'GitHub Actions'],
	},
	{
		title: 'SolveIt 3.0',
		description:
			'Interactive learning interface engineered at TechGeeks featuring an embedded code editor, 3D dashboard, side-by-side Blockly-to-C visual code generator, and step-by-step algorithm walkthroughs.',
		src: 'solveit3landingpage.webp',
		color: '#c2c2c2',
		url: 'https://solve-it-black-hole-edition.vercel.app/',
		role: 'Frontend Engineer',
		tags: ['React', 'Three.js', 'Blockly', 'TypeScript'],
	},
	{
		title: 'TG Blocks',
		description:
			'A lightweight digital toy for experimenting with modular block-based interactions.',
		src: 'tgblocks.webp',
		color: '#c9c9c9',
		url: 'https://tgblocks.netlify.app',
		role: 'Frontend Developer',
	},
	{
		title: 'Mohasabat al-Nafs',
		description:
			'A reflective self-awareness app designed to support personal habit and mindset tracking.',
		src: 'mouhasabatnafs.webp',
		color: '#e8e8e8',
		url: 'https://mouhasabat-nafs.netlify.app',
		role: 'Author & Maintainer',
	},
	{
		title: 'UDEMIHA',
		description:
			'A study-focused digital platform for learning resources and educational discovery.',
		src: 'udemiha.webp',
		color: '#c9c9c9',
		url: 'https://udemiha.netlify.app',
		role: 'Author',
	},
	{
		title: 'SuperMarket Management',
		description:
			'A storefront management tool for streamlined sales and inventory workflows.',
		src: 'hypermarketsalesmanagement.webp',
		color: '#d2d2d2',
		githubUrl: 'https://github.com/Sidali-Djeghbal/SuperMarketManagement',
		role: 'Frontend Developer',
	},
	{
		title: 'hyperland-waybar-prayertimes',
		description:
			'A desktop widget that displays prayer times directly in the Linux Hyprland bar.',
		src: 'hyperlandprayertimes.webp',
		color: '#e8e8e8',
		githubUrl:
			'https://github.com/Sidali-Djeghbal/hyperland-waybar-prayertimes',
		role: 'Author',
	},
];
