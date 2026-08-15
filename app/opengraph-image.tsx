import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt =
	'Sidali DJEGHBAL — AI Engineering Undergrad & Full-Stack Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
	return new ImageResponse(
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				padding: '72px 80px',
				backgroundColor: '#000000',
				color: '#ffffff',
				backgroundImage:
					'radial-gradient(circle at 88% -10%, rgba(255,255,255,0.18), transparent 55%), radial-gradient(circle at -8% 112%, rgba(255,255,255,0.08), transparent 50%)',
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
				<span
					style={{
						width: '12px',
						height: '12px',
						borderRadius: '9999px',
						backgroundColor: '#ffffff',
					}}
				/>
				<span style={{ fontSize: '28px', letterSpacing: '2px' }}>
					sidali-djeghbal.dev
				</span>
			</div>

			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<span
					style={{
						fontSize: '108px',
						letterSpacing: '6px',
						fontWeight: 700,
						lineHeight: 1.05,
					}}
				>
					SIDALI
				</span>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<span
						style={{
							fontSize: '108px',
							letterSpacing: '6px',
							fontWeight: 700,
							lineHeight: 1.05,
						}}
					>
						DJEGHBAL
					</span>
					<div
						style={{
							width: '220px',
							height: '8px',
							marginTop: '24px',
							backgroundColor: '#ffffff',
						}}
					/>
				</div>
			</div>

			<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
				<span
					style={{
						fontSize: '36px',
						letterSpacing: '1px',
						color: 'rgba(255,255,255,0.92)',
					}}
				>
					AI Engineering Undergrad &amp; Full-Stack Developer
				</span>
				<span style={{ fontSize: '28px', color: 'rgba(255,255,255,0.6)' }}>
					Building accessible, scalable web platforms that matter.
				</span>
			</div>
		</div>,
		{ ...size },
	);
}
