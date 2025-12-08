/* eslint-disable no-nested-ternary, react/jsx-one-expression-per-line,
react/jsx-props-no-spreading, react/prop-types, indent */
import React, { useState, useRef } from 'react';
import Slider from 'react-slick';

import photoList from './photo';

function Gallery() {
  const sliderRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [isLandscape, setIsLandscape] = useState(false);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    swipeToSlide: true,
    swipe: true,
    arrows: false,
    beforeChange: (slide, newSlide) => setCurrent(newSlide),
  };

  const handlePrevious = () => {
    sliderRef.current.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current.slickNext();
  };

  const handleImageLoad = (e) => {
    const img = e.target;
    const isWide = img.naturalWidth > img.naturalHeight;
    setIsLandscape(isWide);
  };

  return (
    <div className={`gallery ${isLandscape ? 'landscape-mode' : ''}`}>
      <div className="title">갤러리</div>
      <div className="gallery-slider-wrapper">
        <Slider ref={sliderRef} {...settings}>
          {Object.keys(photoList).map((photo) => (
            <div
              className="photo-slide"
              key={`photo_${photo}`}
            >
              <img
                src={photoList[photo]}
                alt=""
                onLoad={handleImageLoad}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          ))}
        </Slider>
        <div className="gallery-arrows">
          <button
            type="button"
            className="arrow-btn prev"
            onClick={handlePrevious}
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            className="arrow-btn next"
            onClick={handleNext}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      </div>
      <div className="gallery-controls">
        <div className="gallery-index">
          <span>{current + 1}</span> / <span>{Object.keys(photoList).length}</span>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
