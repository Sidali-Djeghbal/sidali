import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { merryWeather, mukta } from '../fonts';

export default function Header({ title }: { title: string }) {
	return (
		<Link
			href='/'
			className={classNames(
				'flex gap-2 items-center text-primary-500 mb-12 outline-0',
				mukta.className,
			)}
		>
			<div className='flex items-center gap-2'>
				<Image
					src='/static/images/logo-white.svg'
					alt='Sidali DJEGHBAL logo'
					width={40}
					height={40}
					className='hidden rounded-full dark:block'
				/>
				<Image
					src='/static/images/logo-dark.svg'
					alt='Sidali DJEGHBAL logo'
					width={40}
					height={40}
					className='rounded-full dark:hidden'
				/>
				<span className='font-bold'>Home</span>
			</div>
			<div className='mx-1 w-full border-b border-primary-500' />
			<span
				className={classNames(
					'text-black dark:text-white text-lg md:text-4xl',
					merryWeather.className,
				)}
			>
				{title}
			</span>
		</Link>
	);
}
