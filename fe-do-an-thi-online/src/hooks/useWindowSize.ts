// hooks/useWindowSize.ts
import { useState, useEffect } from 'react';

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Gọi handleResize một lần khi component mount
    handleResize();

    // Lắng nghe sự kiện thay đổi kích thước cửa sổ
    window.addEventListener('resize', handleResize);

    // Dọn dẹp sự kiện khi component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
