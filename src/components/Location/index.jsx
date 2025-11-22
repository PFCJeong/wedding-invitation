/* eslint-disable no-alert, no-new, react/jsx-one-expression-per-line,operator-linebreak */
import React, { useEffect, useRef } from 'react';
import { isIOS, isAndroid } from 'react-device-detect';

import kakaoIcon from '../../assets/icons/kakaonavi.png';
import naverIcon from '../../assets/icons/navermap.png';
import tmapIcon from '../../assets/icons/tmap.png';
import mapMarkerIcon from '../../assets/icons/map-marker-custom.png';

const URL_ENCODED_HOTEL =
  '%eb%8d%94%ed%8c%8c%ed%8b%b0%ec%9b%80';

function Location() {
  const mapElement = useRef(null);
  const { naver } = window;

  useEffect(() => {
    if (!mapElement.current || !naver) return;

    // 지도에 표시할 위치의 위도와 경도 좌표를 파라미터로 넣어줍니다.
    const location = new naver.maps.LatLng(37.5279175, 126.9225461);
    const mapOptions = {
      center: location,
      zoom: 14,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT,
      },
    };
    const map = new naver.maps.Map(mapElement.current, mapOptions);

    new naver.maps.Marker({
      position: location,
      map,
    });
  }, []);

  const handleClickNaverMap = () => {
    if (isIOS) {
      window.location.replace(
        `nmap://search?query=${URL_ENCODED_HOTEL}&appname=${process.env.REACT_APP_MAIN_LINK}`,
      );
    } else if (isAndroid) {
      window.location.replace(
        `intent://search?query=${URL_ENCODED_HOTEL}&appname=${process.env.REACT_APP_MAIN_LINK}#Intent;scheme=nmap;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.nhn.android.nmap;end`,
      );
    } else {
      window.open(
        'https://map.naver.com/p/entry/place/1018318622?c=15.00,0,0,0',
      );
    }
  };

  const handleClickKakaoMap = () => {
    window.open('https://kko.kakao.com/l_KPH_lBVp');

    // if (isIOS || isAndroid) {
    //   if (window.Kakao) {
    //     const kakao = window.Kakao;
    //     if (!kakao.isInitialized()) {
    //       kakao.init(process.env.REACT_APP_KAKAO_KEY);
    //     }
    //     kakao.Navi.start({
    //       name: '더파티움',
    //       x: 126.9225461,
    //       y: 37.5279175,
    //       coordType: 'wgs84',
    //     });
    //   }
    // } else {
    //   window.open('https://kko.kakao.com/l_KPH_lBVp');
    // }
  };

  const handleClickTMap = () => {
    window.open('https://tmap.life/df3c8d01');
    // if (isIOS || isAndroid) {
    //   window.location.replace('tmap://search?name=더파티움 여의도');
    // } else {
    //   window.open('https://tmap.life/df3c8d01');
    // }
  };

  return (
    <div className="map">
      <div className="title">오시는 길</div>
      <div className="map-element" ref={mapElement} />
      <div className="location-wrapper">
        <div className="venue">
          <img src={mapMarkerIcon} alt="" />
          더파티 여의도 파티움홀 (2F)
        </div>
        <div className="venue-info">
          <span>서울 영등포구 은행로 30 2층</span>
          <span> 02&#41;&nbsp;784-0000</span>
        </div>
      </div>
      <div className="location-info">
        <div className="info-item">
          <div className="label">내비게이션</div>
          <div className="app-list">
            <div
              className="app"
              aria-hidden="true"
              onClick={handleClickNaverMap}
            >
              <img src={naverIcon} alt="" />
              네이버 지도
            </div>
            <div
              className="app"
              aria-hidden="true"
              onClick={handleClickKakaoMap}
            >
              <img src={kakaoIcon} alt="" />
              카카오 내비
            </div>
            <div className="app" aria-hidden="true" onClick={handleClickTMap}>
              <img src={tmapIcon} alt="" />
              티맵
            </div>
          </div>
        </div>
        <div className="info-item">
          <div className="label">지하철</div>
          <div>
            <span className="nine">9호선 국회의사당역</span>
          </div>
          <div>
            - [3번 출구] 도보 5분
          </div>
          <div>
            <span className="five">5호선 여의나루역</span>
          </div>
          <div>
            - [1번 출구] 무료 셔틀버스 이용
          </div>
          <div>
            - [2번 출구] 마을버스 10번 승차 기계회관 정류장 하차
          </div>
        </div>
        <div className="info-item">
          <div className="label">주차 안내</div>
          <div>
            <strong>제1주차장</strong>
          </div>
          <div>
            - 더파티움여의도 본관 주차장 (중소기업중앙회)
          </div>
          <div>
            <strong>제2주차장</strong>
          </div>
          <div>
            - 제2주차장 이용 시, 반드시 본관에 들러 직원 안내를 받으셔야 주차
            등록 및 혜택이 가능합니다. (주차등록은 직원이 진행)
          </div>
        </div>
      </div>
    </div>
  );
}

export default Location;
