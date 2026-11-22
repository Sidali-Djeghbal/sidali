export interface Project {
	title: string;
	description: string;
	src: string;
	color: string;
	url?: string;
	githubUrl?: string;
	role: string;
	date?: string;
	tags?: string[];
}

export interface ProjectModal {
	active: boolean;
	index: number;
}
