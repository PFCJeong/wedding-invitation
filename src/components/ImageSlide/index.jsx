/* eslint-disable react/jsx-props-no-spreading,operator-linebreak,
react/prop-types, react/jsx-one-expression-per-line */
import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';

import photoList from '../Gallery/photo';
import closeIcon from '../../assets/icons/close-light.png';

function ImageSlide({ imageModal, handleCloseImageModal }) {
  const sliderRef = useRef(null);
  const [current, setCurrent] = useState(0);

  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    swipeToSlide: true,
    swipe: true,
    arrows: false,
    beforeChange: (slide, newSlide) => setCurrent(newSlide),
  };

  useEffect(() => {
    if (imageModal) {
      const index = Object.keys(photoList).findIndex((o) => o === imageModal);
      sliderRef.current.slickGoTo(index, true);
      setCurrent(index);
    }
  }, [imageModal]);

  const handleClickBackground = () => {
    handleCloseImageModal();
  };

  const handleClickSlider = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-wrapper">
      <div
        className="modal-background"
        onClick={handleClickBackground}
        aria-hidden="true"
      >
        <div className="image-modal">
          <div
            className="close-btn"
            onClick={handleCloseImageModal}
            aria-hidden="true"
          >
            <img src={closeIcon} alt="" />
          </div>
          <div className="index-wrapper">
            <span>{current + 1}</span>/
            <span>{Object.keys(photoList).length}</span>
          </div>
          <div
            className="image-slider"
            onClick={handleClickSlider}
            aria-hidden="true"
          >
            <Slider ref={sliderRef} {...settings}>
              {Object.keys(photoList).map((photo) => (
                <img
                  src={photoList[photo]}
                  alt=""
                  key={`photo_${photo}`}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageSlide;
