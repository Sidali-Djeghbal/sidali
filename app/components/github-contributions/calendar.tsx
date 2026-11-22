'use client';

import classNames from 'classnames';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import ActivityTooltip from './activity-tooltip';
import type { ContributionCalendar } from './github';

interface Props {
	contributions: ContributionCalendar;
}

interface HoveredCell {
	count: number;
	date: Date;
	x: number;
	y: number;
}

export default function Calendar({ contributions }: Props) {
	const { weeks, months, colors } = contributions;
	const [hoveredCell, setHoveredCell] = useState<HoveredCell | null>(null);
	const gridRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const grid = gridRef.current;
		if (!grid) return;

		const handleMouseOver = (e: MouseEvent) => {
			const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
				'[data-date]',
			);
			if (!target) return;
			const date = target.dataset.date;
			const count = Number(target.dataset.count);
			if (!date || Number.isNaN(count)) return;
			const cellRect = target.getBoundingClientRect();
			setHoveredCell({
				count,
				date: new Date(date),
				x: cellRect.left + cellRect.width / 2,
				y: cellRect.top,
			});
		};

		const handleMouseLeave = () => setHoveredCell(null);

		grid.addEventListener('mouseover', handleMouseOver);
		grid.addEventListener('mouseleave', handleMouseLeave);
		return () => {
			grid.removeEventListener('mouseover', handleMouseOver);
			grid.removeEventListener('mouseleave', handleMouseLeave);
		};
	}, []);

	return (
		<div className='relative flex flex-col space-y-2 w-[calc(100%-53px)] md:w-160 lg:w-200'>
			<ul className='flex justify-end gap-0.75 overflow-hidden text-xs dark:text-neutral-400 md:justify-start'>
				{months.map((month) => (
					<li
						key={month.firstDay}
						className={classNames(`${month.totalWeeks < 2 ? 'invisible' : ''}`)}
						style={{ minWidth: 14.3 * month.totalWeeks }}
					>
						{month.name}
					</li>
				))}
			</ul>

			<section
				ref={gridRef}
				aria-label='Contribution grid'
				className='flex justify-start gap-0.75 overflow-hidden'
			>
				{weeks?.map((week) => (
					<div key={week.firstDay}>
						{week.contributionDays.map((contribution) => {
							const backgroundColor =
								contribution.contributionCount > 0 && contribution.color;

							return (
								<span
									key={contribution.date}
									data-date={contribution.date}
									data-count={contribution.contributionCount}
									className='my-0.5 block h-3 w-3 rounded-xs bg-neutral-200 dark:bg-[#161B22] cursor-default'
									style={backgroundColor ? { backgroundColor } : undefined}
								/>
							);
						})}
					</div>
				))}
			</section>

			<div className='flex flex-wrap items-center justify-between gap-2'>
				<div className='flex items-center gap-2 text-sm'>
					<span className='dark:text-neutral-400'>Less</span>
					<ul className='flex gap-1'>
						<motion.li className='h-2.5 w-2.5 rounded-xs bg-neutral-300 dark:bg-neutral-800' />
						{colors.map((item, index) => (
							<motion.li
								key={item}
								initial='initial'
								animate='animate'
								variants={{
									initial: { opacity: 0 },
									animate: {
										opacity: 1,
										transition: { delay: index * 0.06 },
									},
								}}
								className='h-2.5 w-2.5 rounded-xs'
								style={{ backgroundColor: item }}
							/>
						))}
					</ul>
					<span>More</span>
				</div>
			</div>

			<AnimatePresence>
				{hoveredCell && (
					<ActivityTooltip
						key='activity-tooltip'
						count={hoveredCell.count}
						date={hoveredCell.date}
						x={hoveredCell.x}
						y={hoveredCell.y}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}
