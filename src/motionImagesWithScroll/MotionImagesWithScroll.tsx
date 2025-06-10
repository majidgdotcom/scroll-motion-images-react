import { useEffect, useState, useMemo } from 'react';

export interface MotionImagesWithScrollProps {
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

export const loadImage = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => setTimeout(() => resolve(url), 2000);
    img.onerror = (err) => reject(err);
  });
};

const MotionImagesWithScroll: React.FC<MotionImagesWithScrollProps> = ({
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
  const [imgsLoaded, setImgsLoaded] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [itemPosition, setItemPosition] = useState<'relative' | 'fixed'>('relative');
  const [containerJustifyContent, setContainerJustifyContent] = useState<'flex-start' | 'flex-end'>('flex-start');

  const height = useMemo(() => (length * distance) - distance, [length, distance]);
  const idSelector = `imageItem${id}`;

  const startItem = (): number => document.getElementById(idSelector)?.offsetTop ?? 0;
  const endItem = (): number => startItem() + height;

  const lastImageIndex = useMemo(() => Math.floor(length - 1), [length]);

  const currentImageIndex = (): number => {
    const index = Math.floor((scrollY - startItem()) / distance);
    return index < 0 ? 0 : index;
  };

  useEffect(() => {
    if (!imgsLoaded) {
      const imagePromises = Array.from({ length }, (_, i) =>
        loadImage(`${process.env.PUBLIC_URL}/${folder}/${i}${fileFormat}`)
      );
      Promise.all(imagePromises)
        .then(() => setImgsLoaded(true))
        .catch((err) => console.error('Failed to load images', err));
    }
  }, [imgsLoaded, folder, length, fileFormat]);

  useEffect(() => {
    const start = startItem();
    const end = endItem();

    if (scrollY < start) {
      setImageIndex(0);
      setItemPosition('relative');
      setContainerJustifyContent('flex-start');
    } else if (scrollY > end) {
      setImageIndex(lastImageIndex);
      setItemPosition('relative');
      setContainerJustifyContent('flex-end');
    } else {
      setImageIndex(currentImageIndex());
      setItemPosition('fixed');
      setContainerJustifyContent('flex-start');
    }
  }, [scrollY, windowSize.height, height, imgsLoaded, lastImageIndex]);

  return (
    <div
      className='MotionImagesWithScrollContainer'
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: containerJustifyContent,
        height: height + windowSize.height,
        minHeight: height + windowSize.height,
      }}
      id={idSelector}
    >
      <div
        className='MotionImagesWithScrollHeader'
        style={{
          position: containerJustifyContent === 'flex-end' ? 'relative' : 'absolute',
          zIndex: 2,
          marginLeft: '50px',
          marginTop: '50px',
        }}
      >
        {!imgsLoaded && <h2>Loading...</h2>}
      </div>
      <div
        className='MotionImagesWithScrollItem'
        style={{
          position: itemPosition,
          top: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {imgsLoaded && (
          <img
            key={imageIndex}
            style={{
              width: fullScreen
                ? '100vw'
                : (windowSize.width > 768
                    ? (widthSize?.after768 ?? '100vw')
                    : (widthSize?.befor768 ?? '80vw')),
              height: fullScreen ? '100vh' : 'auto',
              objectFit: 'cover',
            }}
            src={`${process.env.PUBLIC_URL}/${folder}/${imageIndex}${fileFormat}`}
            alt={`Frame ${imageIndex}`}
          />
        )}
      </div>
    </div>
  );
};

export default MotionImagesWithScroll;
