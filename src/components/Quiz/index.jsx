/* eslint-disable indent, react/jsx-one-expression-per-line */
/* eslint-disable react/prop-types, no-unused-vars, no-underscore-dangle,
react/no-array-index-key,no-nested-ternary, operator-linebreak */

import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { quizList } from './data';

import playIcon from '../../assets/icons/play-button.png';
import closeIcon from '../../assets/icons/close.png';
import correctIcon from '../../assets/icons/correct.png';
import wrongIcon from '../../assets/icons/wrong.png';
import mainImg from '../../assets/photo/main3.webp';

import useGoogleSheet, { getGoogleSheet } from '../../hooks/useGoogleSheet';

export default function Quiz({ handleCloseQuiz }) {
  const googleRows = useRef(null);
  const [rows] = useGoogleSheet('1748559023');

  const [current, setCurrent] = useState(0);
  const [data, setData] = useState({
    name: '',
    phone: '',
    score: 0,
  });
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [inputCheck, setInputCheck] = useState('');

  useEffect(() => {
    googleRows.current = rows;
  }, [rows]);

  const handleAddRow = async () => {
    if (
      rows.findIndex(
        (row) => row.name === data.name && row.phone === data.phone,
      ) > -1
    ) {
      toast.error('이미 제출하셨습니다.', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (!data.name || data.name.length < 2) {
      setInputCheck('name');
    } else if (!data.phone || data.phone.length !== 4 || !Number(data.phone)) {
      setInputCheck('phone');
    } else {
      setLoading(true);
      const googleSheet = await getGoogleSheet();
      const sheetsByIdElement = googleSheet.sheetsById[1748559023];
      const result = await sheetsByIdElement.addRow({
        name: data.name,
        phone: data.phone,
        score: 0,
      });
      googleRows.current = await result._sheet.getRows();
      setLoading(false);
      setCurrent((cur) => cur + 1);
    }
  };

  const handleChangeData = (key, value) => {
    setData((curData) => {
      const newData = { ...curData };
      newData[key] = value;
      return newData;
    });
  };

  const startPage = (
    <div className="quiz-page start">
      <div className="title">유정 ♥ 지환 퀴즈</div>
      <div className="desc">
        <div>신랑신부에 대한 퀴즈를 풀어보세요!</div>
        <div>참여자와 고득점자에겐 결혼식 당일 2부에서</div>
        <div>추첨을 통해 상품을 증정합니다!</div>
      </div>
      <img src={mainImg} alt="" className="main-img" />
      <button
        className="next-button"
        type="button"
        onClick={() => setCurrent((cur) => cur + 1)}
      >
        <img src={playIcon} alt="" />
        테스트 시작하기
      </button>
    </div>
  );

  const infoPage = (
    <div className="quiz-page start">
      <div className="quiz-question">안내사항</div>
      <div className="desc info">
        <div>✔ 중복 제출은 가능하지만,</div>
        <div>첫번째 기록으로 점수가 측정됩니다.</div>
        <div>✔ 중간에 퀴즈를 닫으셔도</div>
        <div>푼 문제까지 점수로 제출됩니다.</div>
        <div>✔ 주변에 정답을 공유하지 말고,</div>
        <div>혼자서 풀어주시길 부탁드립니다🤍</div>
      </div>
      <button
        className="next-button"
        type="button"
        onClick={(e) => setCurrent((cur) => cur + 1)}
      >
        다음
      </button>
    </div>
  );

  const inputPage = (
    <div className="quiz-page start">
      {loading ? (
        <div className="loading-wrapper">
          <div className="loader" />
          <div className="loading-text">퀴즈를 준비중입니다.</div>
        </div>
      ) : (
        <>
          <div className="quiz-question">
            이름과 휴대전화 뒷번호를 알려주세요!
          </div>
          <div className="desc info">
            <div>경품을 추첨하고,</div>
            <div>동명이인을 방지하기 위해 수집합니다</div>
          </div>
          <div className="quiz-content info">
            <input
              type="text"
              placeholder="홍길동"
              onChange={(e) => handleChangeData('name', e.target.value)}
            />
            <input
              type="text"
              placeholder="1234"
              maxLength={4}
              onChange={(e) => handleChangeData('phone', e.target.value)}
            />
          </div>
          <div className="input-check">
            {inputCheck === 'name'
              ? '이름을 정확히 입력해주세요'
              : inputCheck === 'phone'
              ? '휴대전화 뒷번호를 정확히 입력해주세요! (4자리 숫자)'
              : ''}
          </div>
          <button className="next-button" type="button" onClick={handleAddRow}>
            다음
          </button>
        </>
      )}
    </div>
  );

  const resultPage = (
    <div className="quiz-page final">
      {loading ? (
        <div className="loading-wrapper">
          <div className="loader" />
          <div className="loading-text">결과를 분석중입니다.</div>
        </div>
      ) : (
        <>
          <div className="result-background">
            <span>
              <strong>{data.score}</strong>
            </span>
          </div>
          <div className="result-content">
            <div className="result-title">
              {data.score > 70
                ? '전문가시군요😎'
                : data.score > 40
                ? '가까운 사이시군요🤗'
                : data.score > 10
                ? '조금 더 친해져요😉'
                : '앞으로 알아갈 사이😍'}
            </div>
            <div className="result-description">
              {data.score > 70 ? (
                <div>
                  신랑신부에 대해 아주 잘 알고 계시네요! 앞으로도 저희와 가깝게
                  친하게 지내보아요🙌🏻
                </div>
              ) : data.score > 40 ? (
                <div>
                  신랑신부에 대해 잘 알고 계시네요! 앞으로도 저희와 가깝게
                  친하게 지내보아요🙌🏻
                </div>
              ) : data.score > 10 ? (
                <div>
                  신랑신부와 아직 알아가는 사이시군요! 저희 더 가까워지기로
                  약속해요🤙🏻
                </div>
              ) : (
                <div>
                  앞으로 신랑신부와 많이 알아갈 사이시군요! 저희 더 가까워지기로
                  약속해요🤙🏻
                </div>
              )}
            </div>
            <button
              className="next-button"
              type="button"
              onClick={handleCloseQuiz}
            >
              종료하기
            </button>
          </div>
        </>
      )}
    </div>
  );

  const [status, setStatus] = useState('default');

  const handleAnswerQuiz = async (num, index) => {
    setAnswers((curObj) => {
      const newObj = { ...curObj };
      newObj[num] = index;
      return newObj;
    });
    if (quizList[num].answer === index) {
      setData((curData) => {
        const newData = { ...curData };
        newData.score = curData.score + 10;
        return newData;
      });
    }
    setStatus('result');
    if (quizList[num].answer === index) {
      const rowIndex = googleRows.current.findIndex(
        (o) => o.name === data.name && o.phone === data.phone,
      );
      if (googleRows.current[rowIndex].score) {
        googleRows.current[rowIndex].score =
          Number(googleRows.current[rowIndex].score) + 10;
      } else {
        googleRows.current[rowIndex].score = 10;
      }

      await googleRows.current[rowIndex].save();
    }

    if (num === 10) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  useEffect(() => {
    if (status === 'result') {
      setTimeout(() => {
        setStatus('answered');
      }, 600);
    } else if (status === 'answered') {
      setTimeout(() => {
        setCurrent((cur) => cur + 1);
        setStatus('waiting');
      }, 1000);
    } else if (status === 'waiting') {
      setTimeout(() => {
        setStatus('default');
      }, 1000);
    }
  }, [status]);

  const quizItem = (num) => {
    const answeredList = Object.keys(num);

    return (
      <div className={`quiz-page ${status}`}>
        <div className="quiz-num">{`Q${num}`}</div>
        <div className="quiz-question">
          {quizList[num].question.includes('!')
            ? quizList[num].question
                .split('!')
                .map((o, index) => (
                  <div key={o}>
                    {`${quizList[num].question.split('!')[index]}${
                      index === 0 ? '!' : ''
                    }`}
                  </div>
                ))
            : quizList[num].question}
        </div>
        <div className="quiz-content">
          {quizList[num].answerList.map((o, index) => (
            <div
              aria-hidden="true"
              onClick={() => handleAnswerQuiz(num, index)}
              className={`answer-item ${
                status === 'result' || status === 'answered'
                  ? index === quizList[num].answer
                    ? 'correct'
                    : index === answers[num]
                    ? 'wrong-shake'
                    : 'wrong'
                  : 'default'
              }`}
              key={`answer_${index}`}
            >
              {o}
              {status === 'result' ? (
                index === quizList[num].answer ? (
                  <img src={correctIcon} alt="" />
                ) : (
                  <img src={wrongIcon} alt="" />
                )
              ) : (
                ''
              )}
            </div>
          ))}
        </div>
        <div className="quiz-slider-wrapper">
          <div className="quiz-current">
            {status === 'result' || status === 'answered' ? num : num - 1}/10
          </div>
          <div className="quiz-slider">
            <div
              className={`quiz-slider-inner percent${
                status === 'result' || status === 'answered' ? num : num - 1
              }`}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="quiz-modal-wrapper">
      <div
        className="close-icon-wrapper"
        aria-hidden="true"
        onClick={handleCloseQuiz}
      >
        <img src={closeIcon} alt="" />
      </div>
      {
        {
          0: startPage,
          1: infoPage,
          2: inputPage,
          3: quizItem(1),
          4: quizItem(2),
          5: quizItem(3),
          6: quizItem(4),
          7: quizItem(5),
          8: quizItem(6),
          9: quizItem(7),
          10: quizItem(8),
          11: quizItem(9),
          12: quizItem(10),
          13: resultPage,
        }[current]
      }
    </div>
  );
}
