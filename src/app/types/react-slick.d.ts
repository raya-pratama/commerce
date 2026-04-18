declare module 'react-slick' {
  import type { ComponentType, HTMLAttributes } from 'react';

  export interface Settings {
    dots?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    autoplay?: boolean;
    autoplaySpeed?: number;
    responsive?: Array<{
      breakpoint: number;
      settings: Partial<Settings>;
    }>;
    [key: string]: unknown;
  }

  const Slider: ComponentType<HTMLAttributes<HTMLElement> & { children?: React.ReactNode; } & { [key: string]: unknown }>;
  export default Slider;
}
