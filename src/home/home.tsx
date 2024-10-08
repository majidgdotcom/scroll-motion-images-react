import { useEffect, useState } from 'react';
import MotionImagesWithScroll from '../motionImagesWithScroll/MotionImagesWithScroll';
import './home.css';

const Home: React.FC = () => {
  const [scrollY, setScrollY] = useState<number>(window.scrollY);
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleResize = () => setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <MotionImagesWithScroll
        id='majidTemplate'
        folder='majidTemplate'
        length={51}
        distance={50}
        fileFormat='.jpg'
        fullScreen={true}
        scrollY={scrollY}
        windowSize={windowSize}
      />
      <MotionImagesWithScroll
        id='mickyTemplate'
        folder='mickyTemplate'
        length={128}
        distance={25}
        fileFormat='.jpg'
        widthSize={{ after768: '350px', befor768: '300px' }}
        scrollY={scrollY}
        windowSize={windowSize}
      />
    </>
  );
};

export default Home;