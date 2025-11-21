/* eslint-disable no-nested-ternary, react/jsx-one-expression-per-line,
react/jsx-props-no-spreading, react/prop-types, indent */
import React, { useState } from 'react';

import arrowIcon from '../../assets/icons/arrow.png';
import arrowUpIcon from '../../assets/icons/arrow-up.png';
import photoList from './photo';

function Gallery({ handleClickImage }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="gallery">
      <div className="title">갤러리</div>
      <div className="gallery-grid">
        {Object.keys(photoList)
          .slice(0, showMore ? Object.keys(photoList).length : 9)
          .map((photo) => (
            <div
              className="photo-item"
              key={`photo_${photo}`}
              onClick={() => handleClickImage(photo)}
              aria-hidden="true"
            >
              <img
                src={photoList[photo]}
                alt=""
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          ))}
      </div>
      {showMore ? (
        <div
          className="more-icon"
          aria-hidden="true"
          onClick={() => setShowMore(false)}
        >
          <img src={arrowUpIcon} alt="" />
          사진 접기
        </div>
      ) : (
        <div
          className="more-icon"
          aria-hidden="true"
          onClick={() => setShowMore(true)}
        >
          <img src={arrowIcon} alt="" />
          사진 더보기
        </div>
      )}
    </div>
  );
}

export default Gallery;
