const WAKATIME_EMBED_URL =
	'https://wakatime.com/share/@sidali_djeghbal/cc9ad65d-48ad-4f60-83b0-938cb60cf280.svg';

export default function WakaStats() {
	return (
		<section className='space-y-4 mt-7'>
			<div>
				<h2 className='text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100'>
					Wakatime
				</h2>
				<p className='text-gray-500 dark:text-gray-400 leading-4'>
					Coding Stats
				</p>
			</div>
			<figure className='overflow-hidden rounded-xl border border-gray-200 bg-white p-2 sm:p-4 dark:border-gray-800'>
				<embed
					src={WAKATIME_EMBED_URL}
					type='image/svg+xml'
					title='WakaTime coding stats'
					className='block aspect-4/3 w-full'
				/>
			</figure>
		</section>
	);
}
