const buttons = document.querySelectorAll('.calculator-buttons');
const calculatedResult = document.querySelector('.calculator-result');

let numberOrOperatorArr: string[] = ['0'];

const OperatorOrder = {
  '+': 1,
  '-': 1,
  X: 2,
  '/': 2,
};

/**
 * @description 웹페이지 접근시 이벤트 등록 및 화면을 초기화하는 함수.
 */

function init() {
  if (buttons)
    buttons.forEach((button) => {
      button.addEventListener('click', onClickButton);
    });

  rendering('0');
}

/**
 * @description 계산기 버튼을 클릭하면 발생하는 함수. 어떤 버튼을 클릭했냐에 따라 로직이 분기됨.
 */

function onClickButton(event) {
  const { textContent } = event.target;

  console.log(textContent, textContent.length);
  if (textContent.length > 10) return; // 공백 클릭했을 때는 return;
  if (isNumber(textContent)) {
    // 숫자라면
    addNumber(textContent);
    console.log(numberOrOperatorArr);
    return;
  } else if (textContent === '=') {
    calculate();
    console.log(numberOrOperatorArr);
    return;
  } else if (textContent === 'C') {
    reset();
    console.log(numberOrOperatorArr);
    return;
  } else if (textContent === '+/-') {
    changePositiveNegativeOfNumber();
    console.log(numberOrOperatorArr);
    return;
  } else if (textContent === '%') {
    div100();
    console.log(numberOrOperatorArr);
    return;
  } else if (textContent === '.') {
    addDot();
    console.log(numberOrOperatorArr);
    return;
  }

  addSubMulDiv(textContent);
  console.log(numberOrOperatorArr);
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
 * @description C 버튼을 눌렀을때 작동하는 함수. numberOrOperatorArr 초기화 하고, 0으로 랜더링한다.
 */

function reset() {
  numberOrOperatorArr = ['0'];
  rendering('0');
}

/**
 * @description numberOrOperatorArr를 후순위표기법으로 전환후 연산. -> 화면에 표시 및 numberOrOperatorArr를 연산된 값으로 초기화.
 */

function calculate() {
  const postfixArr = setPostfix(numberOrOperatorArr);
  const calcualtedResult = calculatePostfix(postfixArr);

  numberOrOperatorArr = [calcualtedResult];
  rendering(calcualtedResult);
}

/**
 * @description numberOrOperatorArr를 뒤로 돌면서 가장 마지막 숫자가 있다면 해당 숫자에 -1 곱셈 연산.
 */

function changePositiveNegativeOfNumber() {
  for (let i = numberOrOperatorArr.length; i >= 0; i--) {
    if (isNumber(numberOrOperatorArr[i])) {
      const changedNumber = String(Number(numberOrOperatorArr[i]) * -1);
      numberOrOperatorArr[i] = changedNumber;
      rendering(changedNumber);
      break;
    }
  }
}

/**
 * @description numberOrOperatorArr를 뒤로 돌면서 가장 마지막 숫자를 가지고 0이면 대체. 0이 아닌 숫자면 문자 합치기. 숫자가 아니면 numberOrOperatorArr 배열에 push
 * @todo 특정 갯수 이상 안넘어가게 제한하기?
 */

function addNumber(num: string) {
  for (let i = numberOrOperatorArr.length - 1; i >= 0; i--) {
    // 현재 연산에 있는 배열을 돌면서 가장먼저 등장한게 숫자면 숫자를 합쳐서 다시 넣어야함.
    if (isNumber(numberOrOperatorArr[i])) {
      // 0이면 그냥 대체
      if (numberOrOperatorArr[i] === '0') {
        const changedNumber = num;
        numberOrOperatorArr[i] = changedNumber;
        rendering(changedNumber);
        break;
      }
      const changedNumber = `${numberOrOperatorArr[i]}${num}`;
      numberOrOperatorArr[i] = changedNumber;
      rendering(changedNumber);
      break;
    } else {
      // 그게 아니면 그냥 넣어야함
      numberOrOperatorArr.push(num);
      rendering(num);
      break;
    }
  }

  // 무조건 0으로 배열데이터가 하나는 무조건 있을거라 여기로 오는 경우는 없음.
}

/**
 * @description 현재 cur_mode의 분기에 따라 cur_mode를 추가하거나 calculate 함수를 호출
 */

function addSubMulDiv(mode: '+' | '-' | 'X' | '/') {
  if (!isNumber(numberOrOperatorArr[numberOrOperatorArr.length - 1])) return;
  numberOrOperatorArr.push(mode);
}

/**
 * @description numberOrOperatorArr의 마지막 숫자를 100으로 나누고 rendering 함수 호출.
 */

function div100() {
  for (let i = numberOrOperatorArr.length - 1; i >= 0; i--) {
    // 현재 연산에 있는 배열을 돌면서 가장먼저 등장한게 숫자면 숫자를 합쳐서 다시 넣어야함.
    if (isNumber(numberOrOperatorArr[i])) {
      // 0이면 break;
      if (numberOrOperatorArr[i] === '0') break;

      const changedNumber = `${Number(numberOrOperatorArr[i]) / 100}`;
      numberOrOperatorArr[i] = changedNumber;
      rendering(changedNumber);
      break;
    }
  }
}

/**
 * @description 현재 표시되있는 숫자에 .표시 및 해당 배열에도 문자열 . 추가, display에 만약 표시되있다면 return
 */

function addDot() {
  if (calculatedResult && calculatedResult.textContent) {
    if (calculatedResult.textContent.includes('.')) return;

    for (let i = numberOrOperatorArr.length - 1; i >= 0; i--) {
      // 현재 연산에 있는 배열을 돌면서 가장먼저 등장한게 숫자면 숫자를 합쳐서 다시 넣어야함.
      if (isNumber(numberOrOperatorArr[i])) {
        // 0이면 그냥 대체
        const changedNumber = `${numberOrOperatorArr[i]}.`;
        numberOrOperatorArr[i] = changedNumber;
        rendering(changedNumber);
        break;
      }
    }
  }
}

/**
 * @description 입력값이 js에서 표현가능한 최대값 혹은 최소값을 넘어가는지 판별. -> 현재 안씀??
 */

function isValidNumber(value: number) {
  if (value > Number.MAX_VALUE || value < Number.MIN_VALUE) return false;
  return true;
}

/**
 * @description 정규식을 통해 숫자인지 아닌지를 판별하는 함수 true면 숫자
 */

function isNumber(value: string) {
  return /[0-9]/.test(value);
}

/**
 * @description 입력된 두개의 operator를 우선순위를 판단하는 함수. true면 첫번째 연산자가 더 높은 우선순위.
 */

function checkPriorityOperator(firstOperator: string, secondOperator: string) {
  console.log(OperatorOrder[firstOperator], OperatorOrder[secondOperator]);
  if (OperatorOrder[firstOperator] > OperatorOrder[secondOperator]) return true;
  else false;
}

/**
 * @description 입력된 중위순위 arr를 후순위 arr로 변환하여 return.
 */

function setPostfix(numberOrOperatorArr: string[]) {
  const resultArr: string[] = [];
  const operatorArr: string[] = [];

  numberOrOperatorArr.forEach((index: string) => {
    // 숫자면 숫자 resultArr에 담기
    if (isNumber(index)) {
      resultArr.push(index);
    } else {
      if (operatorArr.length === 0) {
        operatorArr.push(index);
      } else {
        // 첫번째 인자가 더 우선순위가 높으면
        if (checkPriorityOperator(operatorArr[operatorArr.length - 1], index)) {
          const popData = operatorArr.pop();
          operatorArr.push(index);
          popData && resultArr.push(popData); //  무조건 있어야함.
        } else {
          operatorArr.push(index);
        }
      }
    }
  });

  while (operatorArr.length > 0) {
    const operator = operatorArr.pop();
    operator && resultArr.push(operator);
  }
  return resultArr;
}

/**
 * @description 후순위표기법으로된 arr를 계산하는 함수.
 */

function calculatePostfix(postfixArr: string[]) {
  const numberArr: string[] = [];

  postfixArr.forEach((index) => {
    // 숫자면 담기

    if (isNumber(index)) {
      numberArr.push(index);
    } else {
      // 숫자 두개를 빼서 연산하기
      const secondNum = numberArr.pop();
      const firstNum = numberArr.pop();

      console.log('숫자랑 mode', firstNum, secondNum, index);
      if (firstNum && secondNum) {
        const calculatedNumber = calculateNumber({
          mode: index as '+' | '-' | 'X' | '/',
          firstNum: Number(firstNum),
          secondNum: Number(secondNum),
        });
        numberArr.push(String(calculatedNumber));
      }
    }
  });

  // 다 돌고 나면 하나만 남아야함.
  return numberArr[0];
}

/**
 * @description mode, firstNum, secondNum을 가지고 실제로 계산한 값을 return
 */

function calculateNumber({
  mode,
  firstNum,
  secondNum,
}: {
  mode: '+' | '-' | 'X' | '/';
  firstNum: number;
  secondNum: number;
}) {
  switch (mode) {
    case '+':
      return firstNum + secondNum;
    case '-':
      return firstNum - secondNum;
    case 'X':
      return firstNum * secondNum;
    case '/':
      return firstNum / secondNum;
  }
}

// 초기화.
init();
