export interface Project {
	title: string;
	description: string;
	src: string;
	color: string;
	url?: string;
	role: string;
}

export interface ProjectModal {
	active: boolean;
	index: number;
}
