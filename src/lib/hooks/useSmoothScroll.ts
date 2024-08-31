'use client';

import { useEffect, useCallback } from 'react';

interface SmoothScrollOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
}

const defaultOptions: SmoothScrollOptions = {
  behavior: 'smooth',
  block: 'start',
  inline: 'nearest',
};

export const useSmoothScroll = (options: SmoothScrollOptions = defaultOptions) => {
  const handleClick = useCallback((event: MouseEvent) => {
    if (!window) return;

    const target = event.target as HTMLElement;
    const link = target.closest('a');

    if (!link) return;

    const url = new URL(link.href, window.location.origin);

    if (url.origin !== window.location.origin || !url.hash) return;

    event.preventDefault();

    const decodedHash = decodeURIComponent(url.hash);
    const targetId = decodedHash.slice(1);
    console.log(targetId);
    const targetElement = document.getElementById(targetId);
    console.log(targetElement);

    if (targetElement) {
      targetElement.scrollIntoView(options);
    }
  }, [options]);

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick]);
};

export default useSmoothScroll;