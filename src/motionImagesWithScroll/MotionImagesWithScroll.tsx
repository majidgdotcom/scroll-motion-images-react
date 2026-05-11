import { FC, useEffect, useState, useMemo } from 'react';

export interface ScrollMotionImageSequenceProps {
  id: string;
  folder: string;
  length: number;       // total number of frames/images
  distance: number;     // pixels to scroll per frame change
  fileFormat: string;   // e.g. '.jpg', '.png'

  backColor?: string;
  fullScreen?: boolean;

  widthSize?: {
    before768: string;  // image width on screens narrower than 768px
    after768: string;   // image width on screens wider than 768px
  };

  scrollY: number;
  windowSize: {
    width: number;
    height: number;
  };
}

// Preload a single image URL, resolving when the browser has loaded it.
const preloadImage = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(url);
    img.onerror = (err) => reject(err);
  });

const ScrollMotionImageSequence: FC<ScrollMotionImageSequenceProps> = ({
  id,
  folder,
  length,
  distance,
  fileFormat,
  fullScreen,
  widthSize,
  scrollY,
  windowSize,
}) => {
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imagePositionStyle, setImagePositionStyle] = useState<'relative' | 'fixed'>('relative');
  const [containerAlignment, setContainerAlignment] = useState<'flex-start' | 'flex-end'>('flex-start');

  const scrollTrackHeight = useMemo(() => length * distance - distance, [length, distance]);
  const lastImageIndex = useMemo(() => length - 1, [length]);
  const containerElementId = `imageItem${id}`;

  const getElementTopOffset = (): number =>
    document.getElementById(containerElementId)?.offsetTop ?? 0;

  const getElementBottomOffset = (): number =>
    getElementTopOffset() + scrollTrackHeight;

  const calculateImageIndex = (): number => {
    const index = Math.floor((scrollY - getElementTopOffset()) / distance);
    return Math.max(0, index);
  };

  // Preload all images once on mount
  useEffect(() => {
    const imageUrls = Array.from({ length }, (_, i) =>
      `${process.env.PUBLIC_URL}/${folder}/${i}${fileFormat}`
    );

    Promise.all(imageUrls.map(preloadImage))
      .then(() => setAllImagesLoaded(true))
      .catch((err) => console.error('Failed to preload images:', err));
  }, [folder, length, fileFormat]);

  // Update active image and layout position based on scroll
  useEffect(() => {
    const start = getElementTopOffset();
    const end = getElementBottomOffset();

    if (scrollY < start) {
      setActiveImageIndex(0);
      setImagePositionStyle('relative');
      setContainerAlignment('flex-start');
    } else if (scrollY > end) {
      setActiveImageIndex(lastImageIndex);
      setImagePositionStyle('relative');
      setContainerAlignment('flex-end');
    } else {
      setActiveImageIndex(calculateImageIndex());
      setImagePositionStyle('fixed');
      setContainerAlignment('flex-start');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollY, windowSize.height, scrollTrackHeight, allImagesLoaded, lastImageIndex]);

  return (
    <div
      className="ScrollMotionImageSequenceContainer"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: containerAlignment,
        height: scrollTrackHeight + windowSize.height,
        minHeight: scrollTrackHeight + windowSize.height,
      }}
      id={containerElementId}
    >
      <div
        className="ScrollMotionImageSequenceHeader"
        style={{
          position: containerAlignment === 'flex-end' ? 'relative' : 'absolute',
          zIndex: 2,
          marginLeft: '50px',
          marginTop: '50px',
        }}
      >
        {!allImagesLoaded && <h2>Loading...</h2>}
      </div>

      <div
        className="ScrollMotionImageSequenceItem"
        style={{
          position: imagePositionStyle,
          top: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {allImagesLoaded && (
          <img
            key={activeImageIndex}
            src={`${process.env.PUBLIC_URL}/${folder}/${activeImageIndex}${fileFormat}`}
            alt={`Frame ${activeImageIndex}`}
            style={{
              width: fullScreen
                ? '100vw'
                : windowSize.width > 768
                ? widthSize?.after768 ?? '100vw'
                : widthSize?.before768 ?? '80vw',
              height: fullScreen ? '100vh' : 'auto',
              objectFit: 'cover',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ScrollMotionImageSequence;
