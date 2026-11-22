'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import useBreakpoint from 'use-breakpoint';
import { projects } from './constants';
import ProjectItem from './project-item';
import ProjectPreview from './project-preview';
import type { ProjectModal } from './types';

const BREAKPOINTS = { mobile: 0, tablet: 768, desktop: 1280 };

export default function Projects() {
	const prefersReducedMotion = useReducedMotion();
	const { breakpoint } = useBreakpoint(BREAKPOINTS);
	const [modal, setModal] = useState<ProjectModal>({ active: false, index: 0 });

	return (
		<>
			{projects.map((project, index) => (
				<motion.div
					key={project.title}
					initial={{
						scale: prefersReducedMotion ? 1 : 0.97,
						opacity: 0,
					}}
					animate={{ scale: 1, opacity: 1 }}
					transition={{
						duration: prefersReducedMotion ? 0.15 : 0.25,
						delay: prefersReducedMotion ? 0 : Math.min(index * 0.03, 0.18),
					}}
				>
					<ProjectItem
						index={index}
						title={project.title}
						description={project.description}
						url={project.url}
						githubUrl={project.githubUrl}
						role={project.role}
						date={project.date}
						tags={project.tags}
						setModal={setModal}
					/>
				</motion.div>
			))}
			{breakpoint === 'desktop' && (
				<ProjectPreview modal={modal} projects={projects} />
			)}
		</>
	);
}
