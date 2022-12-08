var buttons = document.querySelectorAll('.calculator-buttons');
var calculatedResult = document.querySelector('.calculator-result');
var calculateHistory = {
    value: 0,
    cur_mode: 'none',
    temp_value: 0
};
/**
 * @description 웹페이지 접근시 이벤트 등록 및 화면을 초기화하는 함수.
 */
function init() {
    if (buttons)
        buttons.forEach(function (button) {
            button.addEventListener('click', onClickButton);
        });
    rendering(0);
}
/**
 * @description 계산기 버튼을 클릭하면 발생하는 함수. 어떤 버튼을 클릭했냐에 따라 로직이 분기됨.
 */
function onClickButton(event) {
    var textContent = event.target.textContent;
    console.log(textContent);
    // 숫자라면
    if (/[0-9]/.test(textContent)) {
        addNumber(Number(textContent));
        console.log(calculateHistory);
        return;
    }
    else if (textContent === '=') {
        if (calculateHistory.cur_mode !== 'none') {
            calculate(calculateHistory.cur_mode);
            console.log(calculateHistory);
        }
        return;
    }
    else if (textContent === 'C') {
        reset();
        console.log(calculateHistory);
        return;
    }
    else if (textContent === '+/-') {
        changePositiveNegativeOfNumber();
        console.log(calculateHistory);
        return;
    }
    else if (textContent === '%') {
        div100();
        console.log(calculateHistory);
        return;
    }
    addSubMulDiv(textContent);
    console.log(calculateHistory);
}
/**
 * @description 숫자가 입력 및 변경됐을 때 화면을 랜더링하는 함수.
 */
function rendering(value) {
    var displayNum;
    if (Number.isInteger(Number(value))) {
        displayNum = value;
    }
    else {
        // TODO : 실수 소수점의 자릿수가 커질 떄, 지수로 표현되면 안됨.
        displayNum = Number(value);
    }
    if (calculatedResult && calculatedResult.textContent)
        calculatedResult.textContent = "".concat(value);
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
function calculate(mode) {
    switch (mode) {
        case '+':
            // NOTE : temp_value를 초기화 하지 않는 이유는 calculate를 계속 눌렀을 때 동일한 피연산자로 동일한 연산을 해야하기 때문.
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
/**
 * @description 두번째 피연산자가 있으면 그 값을 -1 없다면 첫번쨰 피연산자를 -1 곱해주는 함수.
 */
function changePositiveNegativeOfNumber() {
    if (calculateHistory.temp_value) {
        calculateHistory.temp_value *= -1;
        rendering(calculateHistory.temp_value);
    }
    else {
        calculateHistory.value *= -1;
        rendering(calculateHistory.value);
    }
}
/**
 * @description cur_mode의 분기에 따라 display되는 숫자 로직 처리하는 함수.
 */
function addNumber(num) {
    if (calculatedResult && calculatedResult.textContent) {
        // 현재 사칙연산 모드가 선택된 경우
        if (calculateHistory.cur_mode !== 'none') {
            calculateHistory.temp_value = num;
            rendering(calculateHistory.temp_value);
        }
        else {
            // 아닌 경우
            var displayedNum = Number(calculatedResult.textContent);
            console.log('displayedNum: ', displayedNum);
            if (displayedNum === 0) {
                rendering(num);
            }
            else {
                rendering("".concat(calculatedResult.textContent).concat(num));
            }
            calculateHistory.value = Number(calculatedResult.textContent);
        }
    }
}
/**
 * @description 현재 cur_mode의 분기에 따라 cur_mode를 추가하거나 calculate 함수를 호출한다.
 */
function addSubMulDiv(mode) {
    if (calculateHistory.cur_mode !== 'none') {
        // 연산 해줘야함.
        calculate(mode);
        return;
    }
    calculateHistory.cur_mode = mode;
}
/**
 * @description calculateHistory.value를 100으로 나누고 rendering 함수 호출하는 함수.
 */
function div100() {
    // TODO : %를 누른 상태에서 다른 숫자를 누르면 그냥 그 숫자로 대체 되야함.
    calculateHistory.value /= 100;
    rendering(calculateHistory.value);
}
// 초기화.
init();
