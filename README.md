# Scroll Motion Images — React

A reusable React component that creates scroll-driven image sequence animations — similar to the effect used on Apple product pages where scrolling through the page animates a frame-by-frame image sequence.

## Live Demo

[https://majidgdotcom.github.io/scroll-motion-images-react/](https://majidgdotcom.github.io/scroll-motion-images-react/)

## Features

- **Scroll-driven animation** — displays the correct frame based on the user's scroll position
- **Preloads all images** before starting, so playback is smooth with no mid-scroll loading gaps
- **Responsive** — configurable image width for mobile and desktop breakpoints
- **Full-screen support** — option to fill the entire viewport
- **Throttled listeners** — scroll and resize handlers are throttled for performance

## Installation

```bash
git clone https://github.com/majidgdotcom/scroll-motion-images-react.git
cd scroll-motion-images-react
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

### 1. Prepare your images

Place sequentially numbered images in a subfolder under `public/`:

```
public/
└── myAnimation/
    ├── 0.jpg
    ├── 1.jpg
    ├── 2.jpg
    └── ...
```

### 2. Use the component

Pass `scrollY` and `windowSize` from the parent — see `home.tsx` for a full example using the `useScrollY` and `useWindowSize` custom hooks.

```tsx
<ScrollMotionImageSequence
  id="myAnimation"
  folder="myAnimation"
  length={60}
  distance={50}
  fileFormat=".jpg"
  fullScreen={true}
  scrollY={scrollY}
  windowSize={windowSize}
/>
```

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✅ | Unique identifier for this instance |
| `folder` | `string` | ✅ | Subfolder name under `public/` where images are stored |
| `length` | `number` | ✅ | Total number of frames |
| `distance` | `number` | ✅ | Pixels to scroll per frame change |
| `fileFormat` | `string` | ✅ | File extension, e.g. `'.jpg'` or `'.png'` |
| `scrollY` | `number` | ✅ | Current scroll position (from parent) |
| `windowSize` | `{ width: number, height: number }` | ✅ | Current window dimensions (from parent) |
| `fullScreen` | `boolean` | — | Fill the full viewport |
| `widthSize` | `{ before768: string, after768: string }` | — | Image width at mobile / desktop breakpoints |
| `backColor` | `string` | — | Background color of the container |

## Scripts

```bash
npm start       # dev server
npm test        # run tests
npm run build   # production build
npm run deploy  # deploy to GitHub Pages
```

## Project Structure

```
src/
├── motionImagesWithScroll/
│   ├── MotionImagesWithScroll.tsx   # main component
│   └── MotionImagesWithScroll.test.tsx
└── home/
    ├── home.tsx                     # example usage with custom hooks
    └── home.css
```
