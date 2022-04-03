const menuToggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav-list');
const body = document.querySelector('body');
const sliderRight = document.querySelector('#slider-button-right');
const sliderLeft = document.querySelector('#slider-button-left');
const sliderContainer = document.querySelector('.slider-container');
const sliderImgs = document.querySelectorAll('.slider-img')

///////hamburger menu///////

function menuToggleFn() {
    navList.classList.toggle("nav-list-off")
    navList.classList.toggle("nav-list-on");
}


menuToggle.addEventListener('click', menuToggleFn);

body.addEventListener('click', function (e) {
    if (e.target.parentElement.classList.contains("menu-toggle") || e.target.classList.contains("menu-toggle")) {
        return;
    }
    if (navList.classList.contains("nav-list-on") && e.isTrusted) {
        menuToggleFn();
    }
})

window.onresize = () => {
    if (document.body.clientWidth >= 625 && navList.classList.contains("nav-list-on")) {
        menuToggleFn();
    }
};


///////////////////
// carousel code //
//////////////////

let slideModifier = 0; //to calculate translateX relatively to current carousel position
const slideLength = 115; ////full image(100%) + 15% flex gap

function slide(e, newPosition) {

    if (e.isTrusted) {                                //isTrusted - user click, not auto click from code
        clearInterval(autoToggleInterval);
        autoToggleInterval = setInterval(autoToggleImg, 6000); //reset autotoggle timer on user action
    }
    const direction = e.target.id;
    const currentImg = document.querySelector('.current-img');
    let newImg;
    if (direction === 'slider-button-left') {
        if (!currentImg.previousElementSibling) {
            newImg = [...sliderImgs][sliderImgCount - 1];
            slideModifier = -slideLength * (sliderImgCount - 1);
        } else {
            newImg = currentImg.previousElementSibling;
            slideModifier += slideLength;
        }
    } else if (direction === 'slider-button-right') {
        if (!currentImg.nextElementSibling) {
            newImg = [...sliderImgs][0];
            slideModifier = 0;
        } else {
            newImg = currentImg.nextElementSibling;
            slideModifier -= slideLength;
        }
    } else {
        newImg = document.querySelectorAll('.slider-img')[newPosition]
    }

    sliderContainer.style.transform = `translate(${slideModifier}%)`
    currentImg.classList.remove("current-img");
    newImg.classList.add("current-img");
    colorIndicator();
}

sliderRight.addEventListener('click', slide)
sliderLeft.addEventListener('click', slide)

//code for current carousel pic indicator //

const sliderImgCount = document.querySelectorAll('.slider-img').length;
const indicatorsContainer = document.querySelector('.slider-indicator-container');

for (i = 0; i < sliderImgCount; i++) {
    const sliderIndicator = document.createElement('span');
    sliderIndicator.classList.add('slider-indicator');
    indicatorsContainer.appendChild(sliderIndicator);
}

const indicators = document.querySelectorAll('.slider-indicator');

function colorIndicator() {
    indicators.forEach((indicator) => {
        if (indicator.classList.contains('slider-indicator-active')) {
            indicator.classList.remove('slider-indicator-active');
        }
    })
    indicators[slideModifier / -slideLength].classList.add('slider-indicator-active');
}

indicators.forEach((indicator, i) => {
    indicator.addEventListener('click', (e) => {
        const currentPosition = [...indicators].indexOf(document.querySelector('.slider-indicator-active'));
        const newPosition = i;
        slideModifier += (currentPosition - newPosition) * slideLength;
        slide(e, newPosition);
    })
})

//autotoggle

function autoToggleImg() {
    sliderRight.click();
}

//run

colorIndicator()
let autoToggleInterval = setInterval(autoToggleImg, 6000)



let swipeStart;
let swipeEnd;

const swipeEnder = async function (e, resolve) {
    swipeEnd = e.clientX;
    console.log(resolve);
}



sliderContainer.onmousemove = swipeEnder;

sliderContainer.addEventListener('mousedown', async function (e) {
    swipeStart = e.clientX;
    await new Promise(resolve => swipeEnder(e, resolve));
    if (swipeStart > swipeEnd) {
        sliderRight.click();
    } else if (swipeStart < swipeEnd) {
        sliderLeft.click();
    }
    clearInterval(autoToggleInterval);
    autoToggleInterval = setInterval(autoToggleImg, 6000);
})

