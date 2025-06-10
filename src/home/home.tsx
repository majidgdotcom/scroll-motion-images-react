import { useEffect, useState } from 'react';
import ScrollMotionImageSequence from '../motionImagesWithScroll/MotionImagesWithScroll';
import './home.css';
import throttle from 'lodash.throttle';

// Custom hook for window size
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = throttle(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 100);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Custom hook for scroll position
const useScrollY = () => {
  const [scrollY, setScrollY] = useState(window.scrollY);

  useEffect(() => {
    const handleScroll = throttle(() => {
      setScrollY(window.scrollY);
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY;
};

const Home: React.FC = () => {
  const scrollY = useScrollY();
  const windowSize = useWindowSize();

  return (
    <>
      <ScrollMotionImageSequence
        id="majidTemplate"
        folder="majidTemplate"
        length={51}
        distance={50}
        fileFormat=".jpg"
        fullScreen={true}
        scrollY={scrollY}
        windowSize={windowSize}
      />

      <ScrollMotionImageSequence
        id="mickyTemplate"
        folder="mickyTemplate"
        length={128}
        distance={25}
        fileFormat=".jpg"
        widthSize={{ after768: '350px', before768: '300px' }}
        scrollY={scrollY}
        windowSize={windowSize}
      />

    </>
  );
};

export default Home;