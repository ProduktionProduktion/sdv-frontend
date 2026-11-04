// import { Logo } from '@/components/Logo';
import { ImageResponse } from 'next/og';
// import '@/styles/variables.css';

const ICON_SIZES = { favicon: 32, apple: 180, 192: 192, 512: 512 };

export default async function handler(req, res) {
    const size = ICON_SIZES[req.query.size] ?? 32;
    const img = new ImageResponse(
        <div
            style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                margin: 0,
                padding: 0,
                backgroundColor: '#7700ff',
                borderRadius: req.query.size === 'apple' ? 0 : size * 0.2,
                // alignItems: 'center',
                // justifyContent: 'center',
                // color: '#cad2d8',
                // fontSize: size * 0.35,
            }}
        />,
        // or: <img src={`${process.env.NEXT_PUBLIC_SITE_URL}/icon.svg`} width={size} height={size} />
        { width: size, height: size },
    );
    res.setHeader('Content-Type', 'image/png');
    // res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(Buffer.from(await img.arrayBuffer()));
}
