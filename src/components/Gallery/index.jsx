/* eslint-disable no-nested-ternary, react/jsx-one-expression-per-line,
react/jsx-props-no-spreading, react/prop-types, indent */
import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import ScrollContainer from 'react-indiana-drag-scroll';

import arrowIcon from '../../assets/icons/arrow.png';
import arrowUpIcon from '../../assets/icons/arrow-up.png';
import scrollIcon from '../../assets/icons/scroll.png';
import photoList from './photo';

function Gallery({ handleClickImage }) {
  const [showMore, setShowMore] = useState(false);

  const temp = {};

  Object.keys(photoList).forEach((key) => {
    const page = key.split('-')[0];
    if (temp[page]) {
      temp[page].push({
        key,
        src: photoList[key],
      });
    } else {
      temp[page] = [
        {
          key,
          src: photoList[key],
        },
      ];
    }
  });

  return (
    <div className="gallery">
      <div className="title">갤러리</div>
      {isMobile ? (
        <>
          <ScrollContainer className="scroll-container">
            <div className="photo-wrapper">
              {Object.keys(temp).map((page) => (
                <div key={page} className="photo-page">
                  {temp[page].map((photo) => (
                    <div
                      className="mobile-photo-item"
                      key={`photo_${photo.key}`}
                      onClick={() => handleClickImage(photo.key)}
                      aria-hidden="true"
                    >
                      <img
                        src={photoList[photo.key]}
                        alt=""
                        style={{
                          objectPosition:
                            photo.key === '7-2'
                              ? '-80px'
                              : photo.key === '8-1'
                              ? '-92px'
                              : photo.key === '8-3'
                              ? '-42px'
                              : 'center',
                        }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </ScrollContainer>
          <div className="scroll-info">
            <img src={scrollIcon} alt="" /> 좌우로 스크롤하시면 더 많은 사진을
            볼 수 있습니다.
          </div>
        </>
      ) : (
        <>
          <div className="gallery-grid">
            {Object.keys(photoList)
              .slice(0, showMore ? Object.keys(photoList).length : 12)
              .map((photo) => (
                <div
                  className="photo-item"
                  key={`photo_${photo}`}
                  onClick={() => handleClickImage(photo)}
                  aria-hidden="true"
                >
                  <img src={photoList[photo]} alt="" />
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
        </>
      )}
    </div>
  );
}

export default Gallery;
