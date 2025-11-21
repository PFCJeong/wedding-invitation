/* eslint-disable no-alert, no-new, react/jsx-one-expression-per-line,
react/destructuring-assignment, react/prop-types */
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import kakaopayIcon from '../../assets/icons/kakaopay.png';
import groomDownIcon from '../../assets/icons/chevron-down-groom.png';
import brideDownIcon from '../../assets/icons/chevron-down-bride.png';

const accountInfo = {
  groom: {
    type: '신랑측',
    list: [
      {
        type: '신랑',
        name: '정원식',
        bank: '농협은행',
        account: '302-0860-5280-71',
        kakao: 'https://qr.kakaopay.com/Ej7kn0DoK',
      },
      {
        type: '아버지',
        name: '정동명',
        bank: '신한은행',
        account: '577-06-000606',
        kakao: 'https://qr.kakaopay.com/FYysFddA1',
      },
      {
        type: '어머니',
        name: '이기옥',
        bank: '신한은행',
        account: '110-325-774667',
        kakao: 'https://qr.kakaopay.com/FEhonaYzK',
      },
    ],
  },
  bride: {
    type: '신부측',
    list: [
      {
        type: '신부',
        name: '이세인',
        bank: '하나은행',
        account: '415-910602-20507',
        kakao: 'https://qr.kakaopay.com/Ej7wwYIgL',
      },
      {
        type: '아버지',
        name: '이형찬',
        bank: '신한은행',
        account: '577-06-000606',
        kakao: 'https://qr.kakaopay.com/FYysFddA1',
      },
      {
        type: '어머니',
        name: '김미경',
        bank: '신한은행',
        account: '110-325-774667',
        kakao: 'https://qr.kakaopay.com/FEhonaYzK',
      },
    ],
  },
};

function Account(props) {
  const [accountOpen, setAccountOpen] = useState({
    groom: false,
    bride: false,
  });

  const handleOpenAccount = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setAccountOpen((curOpen) => {
      const newOpen = { ...curOpen };
      newOpen[type] = !curOpen[type];
      return newOpen;
    });
  };

  const handleClickKakaoPay = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(item.kakao);
  };

  const handleCopyAccount = () => {
    props.setCopyModal('account');
  };

  return (
    <div className="account">
      <div className="title">마음 전하실 곳</div>
      <div className="description">
        <p>저희 두 사람의 소중한 시작을</p>
        <p>함께 해주시는 모든 분들게 감사드리며,</p>
        <p>전해주시는 따뜻한 진심을 배워</p>
        <p>오래도록 행복하게 잘 살겠습니다.</p>
      </div>
      <div className="account-wrapper">
        {Object.keys(accountInfo).map((type) => (
          <div
            key={type}
            className={`account-item ${type} ${
              accountOpen[type] ? 'open' : ''
            }`}
          >
            <div
              className="account-title"
              aria-hidden="true"
              onClick={(e) => handleOpenAccount(e, type)}
            >
              ♥ &nbsp;
              {accountInfo[type].type}
              <img
                src={type === 'groom' ? groomDownIcon : brideDownIcon}
                alt=""
              />
            </div>
            <div className={`account-content ${type}`}>
              {accountInfo[type].list.map((item) => (
                <div className="account-content-item" key={item.name}>
                  <div className="top">
                    <div className="name">
                      {item.type} <span>{item.name}</span>
                    </div>
                    <div className="account-num">
                      <span>{item.bank}</span>
                      {item.account}
                    </div>
                  </div>
                  <div className="bottom">
                    <div
                      className="kakao"
                      onClick={(e) => handleClickKakaoPay(e, item)}
                      aria-hidden="true"
                      style={{
                        visibility:
                          item.bank === '우리은행' ? 'hidden' : 'visible',
                      }}
                    >
                      <img src={kakaopayIcon} alt="" /> 송금
                    </div>
                    <CopyToClipboard
                      text={item.account}
                      onCopy={handleCopyAccount}
                    >
                      <div className="copy">계좌번호 복사</div>
                    </CopyToClipboard>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Account;
