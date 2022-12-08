const buttons = document.querySelectorAll('.calculator-buttons');
const calculatedResult = document.querySelector('.calculator-result');

type calculateHistoryForm = {
  value: number;
  cur_mode: '+' | '-' | 'X' | '/' | 'none';
  temp_value: number;
};

const calculateHistory: calculateHistoryForm = {
  value: 0,
  cur_mode: 'none',
  temp_value: 0,
};

/**
 * @description 웹페이지 접근시 이벤트 등록 및 화면을 초기화하는 함수.
 */

function init() {
  if (buttons)
    buttons.forEach((button) => {
      button.addEventListener('click', onClickButton);
    });

  if (calculatedResult) calculatedResult.textContent = '0';
}

/**
 * @description 계산기 버튼을 클릭하면 발생하는 함수. 어떤 버튼을 클릭했냐에 따라 로직이 분기됨.
 */

function onClickButton(event) {
  const { textContent } = event.target;

  console.log(textContent);
  // 숫자라면
  if (/[0-9]/.test(textContent)) {
    addNumber(Number(textContent));
    console.log(calculateHistory);
    return;
  } else if (textContent === '=') {
    if (calculateHistory.cur_mode !== 'none') {
      calculate(calculateHistory.cur_mode);
      console.log(calculateHistory);
    }
    return;
  } else if (textContent === 'C') {
    reset();
    console.log(calculateHistory);
    return;
  } else if (textContent === '+/-') {
    changePositiveNegativeOfNumber();
    console.log(calculateHistory);
    return;
  } else if (textContent === '%') {
    console.log(calculateHistory);
    return;
  }

  addSubMulDiv(textContent);
  console.log(calculateHistory);
}

/**
 * @description 연산이나 숫자가 입력 및 변경됐을 때 화면을 랜더링하는 함수.
 */

function rendering<T>(value: T) {
  let displayNum: any;
  if (Number.isInteger(Number(value))) {
    displayNum = value;
  } else {
    displayNum = Number(value).toFixed(6);
  }
  if (calculatedResult && calculatedResult.textContent)
    calculatedResult.textContent = `${displayNum}`;
}

/**
 * @description AC 버튼을 눌렀을때 작동하는 함수. calculateHistory를 초기화 하고, 0으로 랜더링한다.
 */

function reset() {
  calculateHistory.value = 0;
  calculateHistory.cur_mode = 'none';
  calculateHistory.temp_value = 0;
  rendering(calculateHistory.value);
}

/**
 * @description 현재 등록된 mode에 따라 연산처리 하기.
 */

function calculate(mode: '+' | '-' | 'X' | '/') {
  switch (mode) {
    case '+':
      //  temp_value를 초기화 하지 않는 이유는 calculate를 계속 눌렀을 때 동일한 피연산자로 동일한 연산을 해야하기 때문.
      calculateHistory.value += calculateHistory.temp_value;
      rendering(calculateHistory.value);
      break;
    case '-':
      calculateHistory.value -= calculateHistory.temp_value;
      rendering(calculateHistory.value);
      break;
    case 'X':
      calculateHistory.value *= calculateHistory.temp_value;
      rendering(calculateHistory.value);
      break;
    case '/':
      calculateHistory.value /= calculateHistory.temp_value;
      rendering(calculateHistory.value);
      break;
  }
}

function changePositiveNegativeOfNumber() {
  if (calculateHistory.temp_value) {
    calculateHistory.temp_value *= -1;
    rendering(calculateHistory.temp_value);
  } else {
    calculateHistory.value *= -1;
    rendering(calculateHistory.value);
  }
}

function addNumber(num: number) {
  if (calculatedResult && calculatedResult.textContent) {
    // 현재 사칙연산 모드가 선택된 경우
    if (calculateHistory.cur_mode !== 'none') {
      calculateHistory.temp_value = num;
      rendering(calculateHistory.temp_value);
    } else {
      // 아닌 경우

      let displayedNum = Number(calculatedResult.textContent);
      console.log('displayedNum: ', displayedNum);
      if (displayedNum === 0) {
        rendering(num);
      } else {
        rendering(`${calculatedResult.textContent}${num}`);
      }
      calculateHistory.value = Number(calculatedResult.textContent);
    }
  }
}

function addSubMulDiv(mode: '+' | '-' | 'X' | '/') {
  if (calculateHistory.cur_mode !== 'none') {
    // 연산 해줘야함.
    calculate(mode);
    return;
  }

  calculateHistory.cur_mode = mode;
}

// 초기화.
init();
