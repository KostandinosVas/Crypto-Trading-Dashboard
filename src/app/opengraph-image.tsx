import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0B0D0F',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: '#2F6FED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
            }}
          >
            ↗
          </div>
          <span style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2 }}>
            CRYPTO/
          </span>
        </div>
        <span style={{ fontSize: 28, color: '#8B9199', marginTop: 24 }}>
          Live prices · Charts · AI-powered chat
        </span>
      </div>
    ),
    { ...size }
  );
}