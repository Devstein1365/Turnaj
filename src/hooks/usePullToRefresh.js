// Custom Pull-to-Refresh Hook
import { useEffect, useRef, useState } from "react";

export const usePullToRefresh = (onRefresh) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const containerRef = useRef(null);

  const threshold = 80; // Minimum pull distance to trigger refresh

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartY = 0;
    let touchMoveY = 0;

    const handleTouchStart = (e) => {
      // Only trigger if scrolled to top
      if (container.scrollTop === 0) {
        touchStartY = e.touches[0].clientY;
        startY.current = touchStartY;
      }
    };

    const handleTouchMove = (e) => {
      if (startY.current === 0) return;

      touchMoveY = e.touches[0].clientY;
      const distance = touchMoveY - startY.current;

      // Only pull down
      if (distance > 0 && container.scrollTop === 0) {
        e.preventDefault();
        const dampedDistance = Math.min(distance * 0.5, threshold * 1.5);
        setPullDistance(dampedDistance);
        setIsPulling(dampedDistance >= threshold);
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance >= threshold) {
        setIsPulling(true);
        try {
          await onRefresh();
        } finally {
          setIsPulling(false);
          setPullDistance(0);
        }
      } else {
        setPullDistance(0);
        setIsPulling(false);
      }
      startY.current = 0;
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onRefresh, pullDistance]);

  return {
    containerRef,
    isPulling,
    pullDistance,
  };
};
