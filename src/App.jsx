/* eslint-disable no-alert, no-new, react/jsx-one-expression-per-line,
react/no-array-index-key,no-nested-ternary, indent  */

import React, { useState, useRef } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer } from 'react-toastify';
// import scrollbar from 'smooth-scrollbar';

import useScrollFadeIn from './hooks/useScrollFadeIn';
import useBodyScrollLock from './hooks/useBodyScrollLock';

import Account from './components/Account';
import Calendar from './components/Calendar';
import DDay from './components/DDay';
import Information from './components/Information';
import Location from './components/Location';
import RsvpModal from './components/RsvpModal';
import Gallery from './components/Gallery';
import ImageSlide from './components/ImageSlide';
import Quiz from './components/Quiz';
// import GuestBook from './components/GuestBook';
import WriteModal from './components/GuestBook/WriteModal';
import DeleteModal from './components/GuestBook/DeleteModal';

import mainImg from './assets/photo/main3.jpg';
import linkIcon from './assets/icons/link.png';
import kakaoIcon from './assets/icons/kakao-talk.png';
import leafIcon from './assets/icons/green-tea.png';

import purpleImg from './assets/background/purple.png';
// import leafImg from './assets/background/leaf.png';
// import basketImg from './assets/background/pink.png';

import './style.scss';
import 'react-toastify/dist/ReactToastify.css';

export const shareKakao = () => {
  if (window.Kakao) {
    const kakao = window.Kakao;
    if (!kakao.isInitialized()) {
      kakao.init(process.env.REACT_APP_KAKAO_KEY);
    }

    kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '정원식 ♥ 이세인의 결혼식에 초대합니다.',
        description: '26.03.28 PM 1:30 · 더파티움여의도',
        imageUrl: 'https://i.postimg.cc/6Wr3MfXf/kakaoshare.jpg', // FIXME
        link: {
          mobileWebUrl: process.env.REACT_APP_MAIN_LINK,
          webUrl: process.env.REACT_APP_MAIN_LINK,
        },
      },
      buttons: [
        {
          title: '지금 확인하기',
          link: {
            mobileWebUrl: process.env.REACT_APP_MAIN_LINK,
            webUrl: process.env.REACT_APP_MAIN_LINK,
          },
        },
        {
          title: '위치보기',
          link: {
            mobileWebUrl:
              'https://map.naver.com/p/entry/place/1018318622?c=15.00,0,0,0',
            webUrl:
              'https://map.naver.com/p/entry/place/1018318622?c=15.00,0,0,0',
          },
        },
      ],
    });
  }
};

function App() {
  const inviteRef = useRef(null);
  useScrollFadeIn(inviteRef);

  const { lockScroll, openScroll } = useBodyScrollLock();

  const [loading, setLoading] = useState(true);

  const [copyModal, setCopyModal] = useState('');
  const [rsvpModal, setRsvpModal] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [writeModal, setWriteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState('');
  const [quizModal, setQuizModal] = useState(false);

  const [guestbookList, setGuestbookList] = useState([]);

  // useEffect(() => {
  //   const contentDiv = document.querySelector('#smooth-scroll');
  //   if (contentDiv && !isAndroid && !isIOS) {
  //     scrollbar.init(contentDiv, {
  //       damping: 0.02,
  //     });
  //   }
  // }, []);

  const handleCopyOk = () => {
    setCopyModal('link');
  };

  const handleCloseLinkModal = () => {
    setCopyModal('');
  };

  const handleClickImage = (key) => {
    setImageModal(key);
    lockScroll();
  };

  const handleCloseImageModal = () => {
    setImageModal('');
    openScroll();
  };

  // const handleClickQuiz = () => {
  //   setQuizModal(true);
  //   lockScroll();
  // };

  const handleCloseQuiz = () => {
    setQuizModal(false);
    openScroll();
  };

  setTimeout(() => {
    setLoading(false);
  }, 2500);

  // const handleClickRsvp = () => {
  //   setRsvpModal(true);
  //   lockScroll();
  // };

  const handleCloseRsvpModal = () => {
    setRsvpModal(false);
    openScroll();
  };

  const handleWriteModal = (flag) => {
    if (flag === 'open') {
      setWriteModal(true);
      lockScroll();
    } else {
      setWriteModal(false);
      openScroll();
    }
  };

  const handleDeleteModal = (index) => {
    if (index !== undefined) {
      setDeleteModal(index);
      lockScroll();
    } else {
      setDeleteModal('');
      openScroll();
    }
  };

  return (
    <div className="invitation">
      {loading && (
        <div className="loading">
          <div className="decoration">Our Wedding Day</div>
          <div className="loading-content">세인 ♥ 원식</div>
        </div>
      )}
      <div className="header">
        <div className="title">SEIN & WONSIK</div>
        <div className="buttons">
          <CopyToClipboard
            text={process.env.REACT_APP_MAIN_LINK}
            onCopy={handleCopyOk}
          >
            <img src={linkIcon} alt="" />
          </CopyToClipboard>
          <div onClick={shareKakao} aria-hidden="true">
            <img src={kakaoIcon} alt="" />
          </div>
        </div>
      </div>
      <div className="content" id="smooth-scroll">
        <div className="main">
          <img className="main-img" src={mainImg} alt="" />
          <div className="invite-text">
            <img src={leafIcon} alt="" />
            <p>저희 두 사람의 특별한 시작을</p>
            <p>소중한 분들과 함께하고 싶습니다.</p>
          </div>
        </div>
        <div className="invite" ref={inviteRef}>
          {/* <div className="title">Invitation</div> */}
          <div className="text">
            <img src={purpleImg} alt="" />
            <p>10년지기 친구에서 연인으로,</p>
            <p>이제는 연인에서 부부로</p>
            <p>새로운 시작을 함께하려고 합니다.</p>
            <br />
            <p>늘 같은 마음으로 서로를 아끼며</p>
            <p>사랑과 믿음으로 함께 걸어가겠습니다.</p>
            <br />
            <p>따뜻한 발걸음으로</p>
            <p>저희의 새로운 시작을</p>
            <p>함께해 주시면 감사하겠습니다.</p>
          </div>
          <div className="line" />
          <div className="name-wrapper">
            <div className="name">
              <strong>정동명 · 이기옥</strong>의 <div className="sub">아들</div>
              <span>원식</span>
            </div>
            <div className="name">
              <strong>이형찬 · 김미경</strong>의 <div className="sub">딸</div>
              <span>세인</span>
            </div>
          </div>
        </div>
        {/* <Contact /> */}
        <Calendar />
        <DDay />
        <Gallery handleClickImage={handleClickImage} />
        <Information />
        <Location />
        <Account setCopyModal={setCopyModal} />
        <div className="thanks">
          <div className="title">Thanks To</div>
          <div className="thanks-wrapper">
            <div>언제나 곁을 따뜻하게 지켜주시고</div>
            <div>사랑으로 응원해주신</div>
            <div>모든 분들께 감사드립니다.</div>
          </div>
          <div className="copyright">
            Designed & Developed by Yujeong, Jihwan
          </div>
        </div>
      </div>
      {copyModal && (
        <div className="link-copy-modal">
          {copyModal === 'link' ? '링크' : '계좌번호'}가 복사되었습니다.
          <button type="button" onClick={handleCloseLinkModal}>
            확인
          </button>
        </div>
      )}
      {rsvpModal && <RsvpModal handleCloseRsvpModal={handleCloseRsvpModal} />}
      {imageModal && (
        <ImageSlide
          imageModal={imageModal}
          handleCloseImageModal={handleCloseImageModal}
        />
      )}
      {writeModal && (
        <WriteModal
          handleWriteModal={handleWriteModal}
          setGuestbookList={setGuestbookList}
        />
      )}
      {deleteModal !== '' && (
        <DeleteModal
          deleteModal={deleteModal}
          handleDeleteModal={handleDeleteModal}
          guestbookList={guestbookList}
          setGuestbookList={setGuestbookList}
        />
      )}
      {quizModal && <Quiz handleCloseQuiz={handleCloseQuiz} />}
      <ToastContainer />
    </div>
  );
}

export default App;
