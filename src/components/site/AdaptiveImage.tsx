import { useState, ImgHTMLAttributes, CSSProperties } from 'react';

type Mode = 'fit' | 'cover-smart';

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onLoad'> {
  src: string;
  alt: string;
  /**
   * fit — контейнер сам подстраивается под реальные пропорции фото (без обрезки).
   * cover-smart — контейнер с фиксированным aspect-ratio (задаётся снаружи), но
   *   object-position автоматически подбирается под ориентацию фото, чтобы
   *   вертикальные кадры меньше обрезались сверху/снизу.
   */
  mode?: Mode;
  /** Только для mode=fit: максимальная высота контейнера, чтобы портретные фото не вытягивались. */
  maxHeightClass?: string;
  /** Цвет/класс плейсхолдера (пока фото грузится). */
  placeholderClass?: string;
  wrapperClassName?: string;
}

const AdaptiveImage = ({
  src,
  alt,
  mode = 'fit',
  maxHeightClass = 'max-h-[70vh]',
  placeholderClass = 'bg-muted/40',
  wrapperClassName = '',
  className = '',
  style,
  ...rest
}: Props) => {
  const [ratio, setRatio] = useState<number | null>(null);

  const onLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setRatio(img.naturalWidth / img.naturalHeight);
    }
  };

  if (mode === 'fit') {
    const wrapperStyle: CSSProperties = ratio ? { aspectRatio: `${ratio}` } : { aspectRatio: '16 / 9' };
    return (
      <div
        className={`relative w-full mx-auto overflow-hidden ${maxHeightClass} ${placeholderClass} ${wrapperClassName}`}
        style={wrapperStyle}
      >
        <img
          src={src}
          alt={alt}
          onLoad={onLoad}
          className={`w-full h-full object-contain ${className}`}
          style={style}
          {...rest}
        />
      </div>
    );
  }

  const isPortrait = ratio !== null && ratio < 0.9;
  const objectPosition = isPortrait ? 'center 25%' : 'center center';
  return (
    <img
      src={src}
      alt={alt}
      onLoad={onLoad}
      className={`w-full h-full object-cover ${className}`}
      style={{ objectPosition, ...style }}
      {...rest}
    />
  );
};

export default AdaptiveImage;
