import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { Resvg } from '@resvg/resvg-js'
import type { APIRoute } from 'astro'
import satori from 'satori'

const CACHE_DIR = join(process.cwd(), '.cache', 'ogp-fonts')
const BOLD_FONT_PATH = join(CACHE_DIR, 'noto-sans-jp-700.woff')
const FAVICON_PATH = join(process.cwd(), 'public', 'favicon.svg')
const FAVICON_CACHE_DIR = join(process.cwd(), 'dist', '.cache', 'favicon-png')

async function loadFont() {
  if (!existsSync(CACHE_DIR)) {
    await mkdir(CACHE_DIR, { recursive: true })
  }

  if (existsSync(BOLD_FONT_PATH)) {
    const buffer = await readFile(BOLD_FONT_PATH)
    return new Uint8Array(buffer).buffer
  }

  const response = await fetch(
    'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5.0.0/files/noto-sans-jp-japanese-700-normal.woff'
  )
  const bold = await response.arrayBuffer()
  await writeFile(BOLD_FONT_PATH, new Uint8Array(bold))
  return bold
}

async function loadFavicon(): Promise<Uint8Array> {
  if (!existsSync(FAVICON_CACHE_DIR)) {
    await mkdir(FAVICON_CACHE_DIR, { recursive: true })
  }

  const cachedPath = join(FAVICON_CACHE_DIR, 'favicon-120.png')

  if (existsSync(cachedPath)) {
    const buffer = await readFile(cachedPath)
    return new Uint8Array(buffer)
  }

  let svgContent: string
  if (existsSync(FAVICON_PATH)) {
    svgContent = await readFile(FAVICON_PATH, 'utf8')
  } else {
    svgContent = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="#1a1a1a"/>
      <text x="200" y="280" font-size="200" font-weight="bold" fill="white" text-anchor="middle">H</text>
    </svg>`
  }

  const resvg = new Resvg(svgContent, {
    fitTo: {
      mode: 'width',
      value: 120,
    },
  })

  const pngData = resvg.render()
  const pngBuffer = pngData.asPng()
  await writeFile(cachedPath, new Uint8Array(pngBuffer))

  return new Uint8Array(pngBuffer)
}

export const GET: APIRoute = async () => {
  const bold = await loadFont()
  const faviconPng = await loadFavicon()

  // PNGをBase64に変換してimageとして使う
  const faviconBase64 = Buffer.from(faviconPng).toString('base64')
  const faviconDataUrl = `data:image/png;base64,${faviconBase64}`

  const svg = await satori(
    {
      props: {
        children: [
          {
            props: {
              alt: 'HALQME',
              height: 120,
              src: faviconDataUrl,
              style: {
                marginBottom: '40px',
              },
              width: 120,
            },
            type: 'img',
          },
          {
            props: {
              children: 'HALQME',
              style: {
                color: '#ffffff',
                fontSize: '72px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                margin: 0,
              },
            },
            type: 'h1',
          },
          {
            props: {
              children: 'Portfolio & Blog',
              style: {
                color: '#999999',
                fontSize: '32px',
                marginBottom: 0,
                marginTop: '20px',
              },
            },
            type: 'p',
          },
          {
            props: {
              children: '0w0.foo',
              style: {
                bottom: '40px',
                color: '#666666',
                fontSize: '24px',
                position: 'absolute',
              },
            },
            type: 'div',
          },
        ],
        style: {
          alignItems: 'center',
          backgroundColor: '#1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Noto Sans JP',
          height: '100%',
          justifyContent: 'center',
          padding: '60px',
          width: '100%',
        },
      },
      type: 'div',
    },
    {
      fonts: [
        {
          data: bold,
          name: 'Noto Sans JP',
          style: 'normal',
          weight: 700,
        },
      ],
      height: 630,
      width: 1200,
    }
  )

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  })

  const pngData = resvg.render()
  const pngBuffer = pngData.asPng()

  // @ts-expect-error - Buffer is valid for Response body
  return new Response(pngBuffer, {
    headers: {
      'Cache-Control': 'public, max-age=86400',
      'Content-Type': 'image/png',
    },
  })
}
