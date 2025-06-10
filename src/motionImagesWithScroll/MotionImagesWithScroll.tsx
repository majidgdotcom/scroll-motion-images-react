import { useEffect, useState, useMemo } from 'react';

export interface ScrollMotionImageSequenceProps {
  id: string;
  folder: string;
  length: number;
  distance: number;
  fileFormat: string;
  backColor?: string;
  fullScreen?: boolean;
  widthSize?: {
    befor768: string;
    after768: string;
  };
  scrollY: number;
  windowSize: {
    width: number;
    height: number;
  };
}

// Preload an image with artificial delay (simulating loading time)
export const preloadImageWithDelay = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => setTimeout(() => resolve(url), 2000); // Adjust delay as needed
    img.onerror = (err) => reject(err);
  });
};

const ScrollMotionImageSequence: React.FC<ScrollMotionImageSequenceProps> = ({
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
  const containerElementId = `imageItem${id}`;

  const getElementTopOffset = (): number =>
    document.getElementById(containerElementId)?.offsetTop ?? 0;

  const getElementBottomOffset = (): number => getElementTopOffset() + scrollTrackHeight;

  const lastImageIndex = useMemo(() => Math.floor(length - 1), [length]);

  const calculateImageIndex = (): number => {
    const index = Math.floor((scrollY - getElementTopOffset()) / distance);
    return Math.max(0, index);
  };

  // Preload all images once
  useEffect(() => {
    if (!allImagesLoaded) {
      const imagePromises = Array.from({ length }, (_, i) =>
        preloadImageWithDelay(`${process.env.PUBLIC_URL}/${folder}/${i}${fileFormat}`)
      );
      Promise.all(imagePromises)
        .then(() => setAllImagesLoaded(true))
        .catch((err) => console.error('Failed to load images', err));
    }
  }, [allImagesLoaded, folder, length, fileFormat]);

  // Determine current image and layout position based on scroll
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
                : widthSize?.befor768 ?? '80vw',
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