/* eslint-disable no-nested-ternary, react/jsx-one-expression-per-line,
react/jsx-props-no-spreading,operator-linebreak */
import React, { useState, useRef } from 'react';
import Slider from 'react-slick';

import parkingImg from '../../assets/photo/parking.jpg';
import noticeImg from '../../assets/photo/invitation.jpg';
import diningImg from '../../assets/photo/dining.jpg';

const informationData = {
  notice: {
    name: '예식 안내',
    img: noticeImg,
    content1:
      '예식이 진행되는 중간 자리로 식사가 서빙되는 동시예식으로 진행됩니다.',
    content2:
      '1부 예식 이후 식사와 함께 2부가 준비되어 있으니 즐거운 마음으로 함께 해 주시길 부탁드립니다.',
    content3:
      '원활한 좌석 배치와 식사 준비를 위해 다소 번거로우시겠지만 참석여부와 동반인원수를 미리 말씀해주시면 감사하겠습니다.',
  },
  parking: {
    name: '주차 안내',
    img: parkingImg,
    content1: '예식장 내 주차장에 자가 주차가 가능합니다. ',
    content2:
      '주차 공간이 부족할 경우 인근 다른 주차장으로 안내될 수 있는 점 양해 부탁드립니다.',
    content3: '무료 주차는 2시간 제공됩니다.',
  },
  dining: {
    name: '식사 안내',
    img: diningImg,
    content1: '스테이크가 서빙되는 양식 코스로 진행됩니다. ',
    content2:
      '먼저 식사를 원하시는 분들께서는 7층 서브룸에서 예식을 영상으로 함께 하시며 미리 식사하실 수 있습니다.',
    content3:
      '식사를 못하고 가시는 분들께서는 잊지 마시고 1층 로비에서 식권을 답례품으로 교환해 가시기 바랍니다.',
  },
};

function Information() {
  const sliderRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState('notice');

  const handleClickTab = (e, tab, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedTab !== tab) {
      setSelectedTab(tab);
      sliderRef.current.slickGoTo(index);
    }
  };

  const settings = {
    initialSlide: 0,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    swipeToSlide: true,
    swipe: true,
    arrows: false,
    beforeChange: (index, newIndex) => {
      const newTab =
        newIndex === 0 ? 'notice' : newIndex === 1 ? 'parking' : 'dining';
      setSelectedTab(newTab);
    },
  };

  return (
    <div className="information">
      <div className="sub-title">INFORMATION</div>
      <div className="tabs">
        {Object.keys(informationData).map((tab, index) => (
          <div
            key={tab}
            className={`tab ${selectedTab === tab ? 'active' : ''}`}
            onClick={(e) => handleClickTab(e, tab, index)}
            aria-hidden="true"
          >
            {selectedTab === tab && <span>♥</span>}
            {informationData[tab].name}
          </div>
        ))}
      </div>
      <div className="contents">
        <Slider ref={sliderRef} {...settings}>
          {Object.keys(informationData).map((tab) => (
            <div className="information-content" key={tab}>
              <img src={informationData[tab].img} alt="" />
              <div className="information-title">
                {informationData[tab].name}
                <span>/ &nbsp; {tab.toUpperCase()}</span>
              </div>
              <div className="content-description">
                <ul>
                  <li>{informationData[tab].content1}</li>
                  <li> {informationData[tab].content2}</li>
                  <li> {informationData[tab].content3}</li>
                </ul>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Information;
