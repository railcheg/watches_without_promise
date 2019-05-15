//подложка для классических часов
const renderClockWrap = ()=> {
    let clockWrap = document.getElementsByClassName('classic_clock')[0];
    for (i = 1; i <= 6; i++) {
        //$('.center').before('<div id="l'+i+'"></div>');
        let div = document.createElement('div');
        div.className = 'l' + i;
        clockWrap.appendChild(div);
    }
    for (i = 1; i <= 30; i++) {
        //$('.center').before('<div id="ln'+i+'"></div>');
        let div = document.createElement('div');
        div.className = 'ln' + i;
        div.style.cssText =
            "-moz-transform: rotate(" + i * 6 + "deg);" +
            "-webkit-transform : rotate(" + i * 6 + "deg);" +
            "-o-transform : rotate(" + i * 6 + "deg);" +
            "padding : 60px 1px 60px 0;" +
            "left : 60px;" +
            "position : absolute;" +
            "display : block;" +
            "content : '';"
        ;
        clockWrap.appendChild(div);
    }
}
const getCurrentTime = interval => clockTime =>
    clockTime = interval ? new Date(+new Date() + interval) : new Date()

const compose = (...fns) =>
(arg)=>
    fns.reduce(
        (composed, f) => f(composed),
        arg
    )

/*получаем дату и возвращаем массив*/
const serializeClockTime = date =>
({
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds()
})
/*12 часовой стиль*/
const civilianHours = clockTime =>
({
    ...clockTime,
    hours: (clockTime.hours > 12) ?  clockTime.hours - 12 : clockTime.hours
})
/*дата с PM/AM*/
const appendAMPM = clockTime =>
({
    ...clockTime,
    ampm: (clockTime.hours >= 12) ? 'PM' : 'AM'
})


const formatClock = format =>
    time =>
        format.replace('hh', time.hours)
            .replace('mm', time.minutes)
            .replace('ss', time.seconds)
            .replace('tt', time.ampm)

const prependZero = key => clockTime =>({
    ...clockTime,
    [key] : (clockTime[key] < 10) ?  "0" + clockTime[key] : clockTime[key]
})

const converToCivilianTime = clockTime =>
compose(
    appendAMPM,
    civilianHours
)(clockTime)

const doubleDigits = civilianTime =>
compose(
    prependZero('hours'),
    prependZero('minutes'),
    prependZero('seconds')
)(civilianTime)

const renderDigitalWatch = (time) => {
    let {hours, minutes, seconds, ampm} = time
   /* console.clear()
    console.log(hours + ':' + minutes+ ':' + seconds + ' ' + ampm)*/
    let clock = document.getElementsByClassName('digital_clock')[0];

    clock.children[0].innerHTML = hours;
    clock.children[2].innerHTML = minutes;
    clock.children[4].innerHTML = seconds;
    clock.children[5].innerHTML = ampm;
}

const showClassicClock2 = (time) => {
    showClassicClock(time, 'classic_clock2')
}

/*аналоговые часы*/
const showClassicClock = (time, node = 'classic_clock') => {
    let {hours, minutes, seconds, ampm} = time
    /* console.clear()
     console.log(hours + ':' + minutes+ ':' + seconds + ' ' + ampm)*/

    let clock = document.getElementsByClassName(node)[0];

    var secondsStartDegree = 360 / 60 * seconds,
        minutesStartDegree = 360 / 60 * minutes + 6 / 60 * seconds,
        hoursStartDegree = 360 / 12 * hours + 30 / 60 * minutes + 0.5 / 60 * seconds;
    clock.children[1].style.transform = 'rotate(' + secondsStartDegree + 'deg)';
    clock.children[2].style.transform = 'rotate(' + minutesStartDegree + 'deg)';
    clock.children[3].style.transform = 'rotate(' + hoursStartDegree + 'deg)';
}

/*электронные часы*/
const showDigitalClock = civilianTime =>
compose(
    doubleDigits,
    renderDigitalWatch
)(civilianTime)

const startTicking = (time, showClocks) =>
{
    let interval = +time - +new Date();
    setInterval(
        compose(
            getCurrentTime(interval),
            serializeClockTime,
            converToCivilianTime,
            showClocks
        ),
        1000
    )
}

renderClockWrap()

startTicking(new Date(+new Date() + (180 * 60 * 1000)), showClassicClock)
startTicking(new Date(+new Date() + (180 * 60 * 1000)), showDigitalClock)
//startTicking(new Date(+new Date() + (65 * 60 * 1000)), showClassicClock2)