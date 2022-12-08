const buttons = document.querySelectorAll('.calculator-buttons');
const calculatedResult = document.querySelector('.calculator-result');

type calculateHistoryForm = {
  value: number;
  cur_mode: '+' | '-' | 'X' | '/' | '%' | 'none';
  temp_value?: number;
};

const calculateHistory: calculateHistoryForm = {
  value: 0,
  cur_mode: 'none',
  temp_value: undefined,
};

/**
 * @description 웹페이지 접근시 이벤트 등록 및 화면을 초기화하는 함수.
 */

function init() {
  if (buttons)
    buttons.forEach((button) => {
      button.addEventListener('click', onClickButton);
    });

  rendering(0);
}

/**
 * @description 계산기 버튼을 클릭하면 발생하는 함수. 어떤 버튼을 클릭했냐에 따라 로직이 분기됨.
 */

function onClickButton(event) {
  const { textContent } = event.target;

  console.log(textContent, textContent.length);
  if (textContent.length > 10) return; // 공백 클릭했을 때는 return;
  if (/[0-9]/.test(textContent)) {
    // 숫자라면
    addNumber(Number(textContent));
    console.log(calculateHistory);
    return;
  } else if (textContent === '=') {
    if (calculateHistory.cur_mode !== 'none' && calculateHistory.cur_mode !== '%') {
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
    div100();
    console.log(calculateHistory);
    return;
  } else if (textContent === '.') {
    addDot();
    console.log(calculateHistory);
    return;
  }

  addSubMulDiv(textContent);
  console.log(calculateHistory);
}

/**
 * @description 숫자가 입력 및 변경됐을 때 화면을 랜더링하는 함수.
 */

function rendering<T>(value: T) {
  let displayNum: any;
  if (Number.isInteger(Number(value))) {
    displayNum = value;
  } else {
    // TODO : 실수 소수점의 자릿수가 커질 떄, 지수로 표현되면 안됨.
    displayNum = Number(value);
  }
  if (calculatedResult) calculatedResult.textContent = `${displayNum}`;
}

/**
 * @description AC 버튼을 눌렀을때 작동하는 함수. calculateHistory를 초기화 하고, 0으로 랜더링한다.
 */

function reset() {
  calculateHistory.value = 0;
  calculateHistory.cur_mode = 'none';
  calculateHistory.temp_value = undefined;
  rendering(calculateHistory.value);
}

/**
 * @description 현재 등록된 mode에 따라 연산처리 하기.
 */

function calculate(mode: '+' | '-' | 'X' | '/') {
  switch (mode) {
    case '+':
      // NOTE : temp_value를 초기화 하지 않는 이유는 calculate를 계속 눌렀을 때 동일한 피연산자로 동일한 연산을 해야하기 때문.
      if (calculateHistory.temp_value) {
        if (isValidNumber(calculateHistory.value + calculateHistory.temp_value))
          calculateHistory.value += calculateHistory.temp_value;
      } else {
        if (isValidNumber(calculateHistory.value + calculateHistory.value)) {
          calculateHistory.temp_value = calculateHistory.value;
          calculateHistory.value += calculateHistory.value;
        }
      }

      rendering(calculateHistory.value);
      break;
    case '-':
      if (calculateHistory.temp_value) {
        if (isValidNumber(calculateHistory.value - calculateHistory.temp_value)) {
          calculateHistory.value -= calculateHistory.temp_value;
        }
      } else {
        if (isValidNumber(calculateHistory.value - calculateHistory.value)) {
          calculateHistory.temp_value = calculateHistory.value;
          calculateHistory.value -= calculateHistory.value;
        }
      }
      rendering(calculateHistory.value);
      break;
    case 'X':
      if (calculateHistory.temp_value) {
        if (isValidNumber(calculateHistory.value * calculateHistory.temp_value)) {
          calculateHistory.value *= calculateHistory.temp_value;
        }
      } else {
        if (isValidNumber(calculateHistory.value * calculateHistory.value)) {
          calculateHistory.temp_value = calculateHistory.value;
          calculateHistory.value *= calculateHistory.value;
        }
      }
      rendering(calculateHistory.value);
      break;
    case '/':
      if (calculateHistory.temp_value) {
        if (isValidNumber(calculateHistory.value / calculateHistory.temp_value)) {
          calculateHistory.value /= calculateHistory.temp_value;
        }
      } else {
        if (isValidNumber(calculateHistory.value / calculateHistory.value)) {
          calculateHistory.temp_value = calculateHistory.value;
          calculateHistory.value /= calculateHistory.value;
        }
      }
      rendering(calculateHistory.value);
      break;
  }
}

/**
 * @description 두번째 피연산자가 있으면 그 값을 -1 없다면 첫번쨰 피연산자를 -1 곱해주는 함수.
 */

function changePositiveNegativeOfNumber() {
  if (calculateHistory.cur_mode !== 'none' && calculateHistory.cur_mode !== '%') {
    calculateHistory.value *= -1;
    rendering(calculateHistory.value);
    return;
  }
  if (calculateHistory.temp_value) {
    calculateHistory.temp_value *= -1;
    rendering(calculateHistory.temp_value);
  } else {
    calculateHistory.value *= -1;
    rendering(calculateHistory.value);
  }
}

/**
 * @description cur_mode의 분기에 따라 display되는 숫자 로직 처리하는 함수.
 */

function addNumber(num: number) {
  if (calculatedResult && calculatedResult.textContent) {
    // 현재 사칙연산 모드가 선택된 경우
    if (calculateHistory.cur_mode !== 'none') {
      if (!calculateHistory.temp_value) {
        rendering(num);
      } else {
        rendering(`${calculatedResult.textContent}${num}`);
      }
      calculateHistory.temp_value = Number(calculatedResult.textContent);
    } else {
      // 아닌 경우
      const displayedNum = calculatedResult.textContent;
      if (displayedNum === '0') {
        rendering(num);
      } else {
        rendering(`${calculatedResult.textContent}${num}`);
      }
      calculateHistory.value = Number(calculatedResult.textContent);
    }
  }
}

/**
 * @description 현재 cur_mode의 분기에 따라 cur_mode를 추가하거나 calculate 함수를 호출
 */

function addSubMulDiv(mode: '+' | '-' | 'X' | '/') {
  if (calculateHistory.temp_value) {
    calculateHistory.temp_value = undefined;
  }
  calculateHistory.cur_mode = mode;
}

/**
 * @description calculateHistory.value를 100으로 나누고 rendering 함수 호출.
 */

function div100() {
  calculateHistory.value /= 100;
  calculateHistory.cur_mode = '%';
  rendering(calculateHistory.value);
}

/**
 * @description 현재 표시되있는 숫자에 .표시 만약 표시되있다면 return
 */

function addDot() {
  if (calculatedResult && calculatedResult.textContent) {
    if (calculatedResult.textContent.includes('.')) return;
    rendering(`${calculatedResult.textContent}.`);
  }
}

/**
 * @description 입력값이 js에서 표현가능한 최대값 혹은 최소값을 넘어가는지 판별.
 */

function isValidNumber(value: number) {
  if (value > Number.MAX_VALUE || value < Number.MIN_VALUE) return false;
  return true;
}

// 초기화.
init();

// functions
// - 기본 사칙 연산 : 완료
// - 리셋 기능 : 완료
// - 부호 기능 :
//    - 계산하고 나서 부호를 붙이면 계산된 변수에 부호처리가 되야함. (완료))
//    - 두번째 피연산자가 없을경우에 부호를 누르면 -0으로 표시되야함..?
// - % :
//    - %를 누른 상태에서 다른 숫자를 누르면 그 숫자로 대체 되야함. (완료)
// - . :
//    - 두번째 연산자를 누른상태에서 .을 누르면 그 값에 .이 표시되야함. (완료)
// - 실제 버튼이 아닌 공백 공간을 클릭했을 때 아무것도 동작 안하도록 해야함. (완료)
// - 지수 표현 안하게 해야함. 혹은 무한대일때를 설정하기.
