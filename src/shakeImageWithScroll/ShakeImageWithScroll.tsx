import { useEffect, useState } from 'react';
import { ShakeImageWithScrollProps } from './IShakeImageWithScroll';

const ShakeImageWithScroll: React.FC<ShakeImageWithScrollProps> = (props) => {

  const [imgsLoaded, setImgsLoaded] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [itemPosition, setItemPosition] = useState<'relative' | 'fixed'>('relative');
  const [containerJustifyContent, setContainerJustifyContent] = useState<'flex-start' | 'flex-end'>('flex-start');

  const height = ((props.length * props.distance) - props.distance);

  const setId = (): string => {
    return `imageItem${props.id}`;
  };

  const startItem = (): number => {
    return document.getElementById(setId())?.offsetTop ?? 0;
  };

  const endItem = (): number => {
    return startItem() + height;
  };

  const itemScrollHeight = (): number => {
    return height + props.windowSize.height;
  };

  const lastImage = (): number => {
    return Math.floor(props.length - 1);
  };

  const setImage = (): number => {
    const r = Math.floor((props.scrollY - startItem()) / props.distance);
    return r < 0 ? 0 : r;
  };

  const loadImage = (image: { url: string }): Promise<string> => {
    return new Promise((resolve, reject) => {
      const loadImg = new Image();
      loadImg.src = image.url;
      loadImg.onload = () => setTimeout(() => resolve(image.url), 2000);
      loadImg.onerror = (err) => reject(err);
    });
  };

  const images = (): JSX.Element => {
    const menuItems = [];

    for (let i = 0; i < props.length; i++) {
      menuItems.push(
        <img
          key={i}
          style={{
            display: imageIndex !== i ? 'none' : 'inline-block',
            width: props.fullScreen ? '100vw' : (props.windowSize.width > 768 ? (props.widthSize?.after768 ?? '100vw') : (props.widthSize?.befor768 ?? '80vw')),
            height: props.fullScreen ? '100vh' : 'auto',
            objectFit: 'cover',
          }}
          src={process.env.PUBLIC_URL + `${props.folder}/${i}${props.fileFormat}`}
          alt={`Image ${i}`}
        />
      );
    }

    return <div>{menuItems}</div>;
  };

  useEffect(() => {
    if (!imgsLoaded) {
      const IMAGES = [];
      for (let i = 0; i < props.length; i++) {
        IMAGES.push({ url: process.env.PUBLIC_URL + `${props.folder}/${i}${props.fileFormat}` });
      }
      Promise.all(IMAGES.map((image) => loadImage(image)))
        .then(() => setImgsLoaded(true))
        .catch((err) => console.error('Failed to load images', err));
    }
  }, []);

  useEffect(() => {
    const start = startItem();
    const end = endItem();

    if (props.scrollY < start) {
      setImageIndex(0);
      setItemPosition('relative');
      setContainerJustifyContent('flex-start');
    } else if (props.scrollY > end) {
      setImageIndex(lastImage());
      setItemPosition('relative');
      setContainerJustifyContent('flex-end');
    } else {
      setImageIndex(setImage());
      setItemPosition('fixed');
      setContainerJustifyContent('flex-start');
    }
  }, [props.scrollY, props.windowSize, height, imgsLoaded]);

  return (
    <div
      className='ShakeImageWithScrollContainer sectionColor'
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: containerJustifyContent,
        height: itemScrollHeight(),
        minHeight: itemScrollHeight(),
        backgroundColor: props.backColor,
      }}
      id={setId()}
    >
      <div
        className='ShakeImageWithScrollHeader'
        style={{
          position: containerJustifyContent === 'flex-end' ? 'relative' : 'absolute',
          zIndex: 2,
          marginLeft: '50px',
          marginTop: '50px',
        }}
      >
        {!imgsLoaded ? (<h2>Loading...</h2>) : null}
      </div>
      <div
        className='ShakeImageWithScrollItem'
        style={{
          top: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          position: itemPosition,
          zIndex: 1,
        }}
      >
        {imgsLoaded ? images() : null}
      </div>
    </div>
  );
};

export default ShakeImageWithScroll;