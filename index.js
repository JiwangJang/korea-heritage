let isMobile = false;
let imageBoxWidth = document.querySelector(".image").offsetWidth;
const scrollObjs = [
  {
    container: document.querySelector("#scroll-0"),
    height: 0,
    heightNum: 6,
    elems: {
      container: document.querySelector("#image-display-container"),
      imageRows: document.querySelectorAll(".image-row"),
      titleComment: document.querySelector("#title-comment"),
    },
    slideInfo: [-400, imageBoxWidth * 2, -200],
    animationInfo: {
      containerScale: [4, 1, { start: 0, end: 0.7 }],
      commentOpacity: [1, 0, { start: 0, end: 0.7 }],
    },
  },
  {
    container: document.querySelector("#scroll-1"),
    height: 0,
    heightNum: 3,
    elems: {
      heritageImageContainer: document.querySelector("#heritage-images"),
      heritageImages: document.querySelectorAll("#heritage-images img"),
    },
    animationInfo: {},
  },
  {
    container: document.querySelector("#scroll-2"),
    height: 0,
    heightNum: 6,
    elems: {
      mentA: document.querySelector(".ment.a"),
      mentB: document.querySelector(".ment.b"),
      mentC: document.querySelector(".ment.c"),
      mentD: document.querySelector(".ment.d"),
      mentE: document.querySelector(".ment.e"),
    },
    animationInfo: {
      // opacity
      mentA_opacity_in: [0, 1, { start: 0, end: 0.1 }],
      mentA_opacity_out: [1, 0, { start: 0.15, end: 0.2 }],
      mentB_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
      mentC_opacity_in: [0, 1, { start: 0.35, end: 0.4 }],
      mentBC_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
      mentD_opacity_in: [0, 1, { start: 0.55, end: 0.6 }],
      mentE_opacity_in: [0, 1, { start: 0.65, end: 0.7 }],
      mentDE_opacity_out: [1, 0, { start: 0.75, end: 0.8 }],
      // translateY
      mentB_translateY_in: [20, 0, { start: 0.25, end: 0.3 }],
      mentC_translateY_in: [20, 0, { start: 0.35, end: 0.4 }],
      mentBC_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
      mentD_translateY_in: [20, 0, { start: 0.55, end: 0.6 }],
      mentE_translateY_in: [20, 0, { start: 0.65, end: 0.7 }],
      mentDE_translateY_out: [0, -20, { start: 0.75, end: 0.8 }],
    },
  },
  {
    container: document.querySelector("#scroll-3"),
    height: 0,
    heightNum: 1,
    elems: {},
    slideInfo: {},
    animationInfo: {},
  },
];
const gap = 16;
let resetPexel = (imageBoxWidth + 16) * 6;
let prevScroll = 0;
let currentPart = 0;
let isSlide = false;
let targetScrollY = 0;

/**
 * 무한배너 함수
 * @param {object} elem 움직일 요소
 * @param {number} direction -1 = 오른쪽으로 흐름, 1 = 왼쪽으로 흐름
 * @param {number} count translateX 값
 * @param {number} rafId 스크롤 영역 끝나면 중지시키기 위해 설정
 * @param {number} speed 슬라이드 속도 설정
 */
function slide(elem, direction, count, speed = 1) {
  let rafId;
  count -= speed;
  if (direction < 0 && count <= 0) {
    // 오른쪽으로 흐를경우
    count = resetPexel;
  }
  if (direction > 0 && Math.abs(count) >= resetPexel) {
    // 왼쪽으로 흐를경우
    count = 0;
  }
  if (!isSlide) {
    cancelAnimationFrame(rafId);
    const index = Number(elem.getAttribute("data-order"));
    scrollObjs[0].slideInfo[index] = count;
    return;
  }

  elem.style.transform = `translateX(${direction * count}px)`;
  rafId = requestAnimationFrame(() => slide(elem, direction, count, speed));
}

function calc(values, scrollRatio) {
  let ratio =
    (scrollRatio - values[2].start) / (values[2].end - values[2].start);

  if (ratio > 1) return values[1];
  if (ratio < 0) return values[0];

  return (values[1] - values[0]) * ratio + values[0];
}

function playAnimation() {
  const { elems, slideInfo, animationInfo, height } = scrollObjs[currentPart];
  const currentScrollY = scrollY - prevScroll;
  const currentScrollRatio = currentScrollY / height;
  switch (currentPart) {
    case 0:
      const [row1, row2, row3] = slideInfo;
      elems.container.style.transform = `scale(${calc(
        animationInfo.containerScale,
        currentScrollRatio
      )})`;
      elems.titleComment.style.opacity = calc(
        animationInfo.commentOpacity,
        currentScrollRatio
      );
      if (currentScrollRatio <= 0.7) {
        if (isSlide) isSlide = false;
      }

      if (currentScrollRatio >= 0.72) {
        if (!isSlide) {
          isSlide = true;
          const [imageRows1, imageRows2, imageRows3] = elems.imageRows;
          slide(imageRows1, 1, row1, 4);
          slide(imageRows2, -1, row2, 3);
          slide(imageRows3, 1, row3, 2);
        }
      }

      if (currentScrollY >= height - innerHeight) {
        console.log(window.innerHeight);
        elems.container.style.marginTop = height - innerHeight + "px";
        elems.container.style.position = "relative";
        elems.titleComment.style.position = "relative";
      } else {
        elems.container.style.marginTop = 0;
        elems.container.style.position = "";
        elems.titleComment.style.position = "";
      }
      scrollObjs[1].elems.heritageImageContainer.classList.remove("fix");
      break;
    case 1:
      isSlide = false;

      if (currentScrollY >= innerHeight * 2) {
        elems.heritageImageContainer.classList.remove("fix");
        elems.heritageImageContainer.style.top = innerHeight * 2 + "px";
      } else {
        elems.heritageImageContainer.classList.add("fix");
        elems.heritageImageContainer.style.top = 0;
      }

      if (isMobile) break;
      if (currentScrollRatio <= 0.2) {
        elems.heritageImages[0].classList.add("active");
        elems.heritageImages[1].classList.remove("active");
      }
      if (currentScrollRatio > 0.2 && currentScrollRatio <= 0.5) {
        elems.heritageImages[0].classList.remove("active");
        elems.heritageImages[1].classList.add("active");
        elems.heritageImages[2].classList.remove("active");
      }
      if (currentScrollRatio > 0.5 && currentScrollRatio <= 0.9) {
        elems.heritageImages[1].classList.remove("active");
        elems.heritageImages[2].classList.add("active");
      }

      break;
    case 2:
      if (currentScrollRatio <= 0.1) {
        elems.mentA.style.opacity = calc(
          animationInfo.mentA_opacity_in,
          currentScrollRatio
        );
      } else {
        elems.mentA.style.opacity = calc(
          animationInfo.mentA_opacity_out,
          currentScrollRatio
        );
      }

      if (currentScrollRatio <= 0.4) {
        elems.mentB.style.opacity = calc(
          animationInfo.mentB_opacity_in,
          currentScrollRatio
        );
        elems.mentC.style.opacity = calc(
          animationInfo.mentC_opacity_in,
          currentScrollRatio
        );
        elems.mentB.style.transform = `translateY(${calc(
          animationInfo.mentB_translateY_in,
          currentScrollRatio
        )}%)`;
        elems.mentC.style.transform = `translateY(${calc(
          animationInfo.mentC_translateY_in,
          currentScrollRatio
        )}%)`;
      } else {
        elems.mentB.style.opacity = calc(
          animationInfo.mentBC_opacity_out,
          currentScrollRatio
        );
        elems.mentC.style.opacity = calc(
          animationInfo.mentBC_opacity_out,
          currentScrollRatio
        );
        elems.mentB.style.transform = `translateY(${calc(
          animationInfo.mentBC_translateY_out,
          currentScrollRatio
        )}%)`;
        elems.mentC.style.transform = `translateY(${calc(
          animationInfo.mentBC_translateY_out,
          currentScrollRatio
        )}%)`;
      }

      if (currentScrollRatio <= 0.7) {
        elems.mentD.style.opacity = calc(
          animationInfo.mentD_opacity_in,
          currentScrollRatio
        );
        elems.mentE.style.opacity = calc(
          animationInfo.mentE_opacity_in,
          currentScrollRatio
        );
        elems.mentD.style.transform = `translateY(${calc(
          animationInfo.mentD_translateY_in,
          currentScrollRatio
        )}%)`;
        elems.mentE.style.transform = `translateY(${calc(
          animationInfo.mentD_translateY_in,
          currentScrollRatio
        )}%)`;
      } else {
        elems.mentD.style.opacity = calc(
          animationInfo.mentDE_opacity_out,
          currentScrollRatio
        );
        elems.mentE.style.opacity = calc(
          animationInfo.mentDE_opacity_out,
          currentScrollRatio
        );
        elems.mentD.style.transform = `translateY(${calc(
          animationInfo.mentDE_translateY_out,
          currentScrollRatio
        )}%)`;
        elems.mentE.style.transform = `translateY(${calc(
          animationInfo.mentDE_translateY_out,
          currentScrollRatio
        )}%)`;
      }
  }
}

let scrollRafId;
function scrollRatioBar() {
  const totalScrollY = document.body.scrollHeight - innerHeight;
  targetScrollY += (scrollY - targetScrollY) * 0.1;
  document.querySelector("#scroll-progress").style.width = `${
    (targetScrollY / totalScrollY) * 100
  }%`;
  scrollRafId = requestAnimationFrame(scrollRatioBar);
  if (Math.abs(scrollY - targetScrollY) < 1) cancelAnimationFrame(scrollRafId);
}

function scrollEvent() {
  prevScroll = 0;
  for (let i = 0; i < currentPart; i++) {
    prevScroll += scrollObjs[i].height;
  }
  if (prevScroll > scrollY) {
    currentPart--;
    document.body.id = `show-${currentPart}`;
    return;
  }

  if (prevScroll + scrollObjs[currentPart].height < scrollY) {
    currentPart++;
    document.body.id = `show-${currentPart}`;
    return;
  }

  cancelAnimationFrame(scrollRafId);
  scrollRatioBar();

  playAnimation();
}

function setting() {
  scrollObjs.forEach((objs) => {
    if (!objs.heightNum) {
      objs.height = objs.container.offsetHeight;
      return;
    }
    objs.height = objs.heightNum * innerHeight;
    objs.container.style.height = `${objs.height}px`;
  });
  const { elems, slideInfo, animationInfo, height } = scrollObjs[0];
  const { container, imageRows } = elems;
  const scrollRatio = (scrollY - prevScroll) / height;
  if (scrollY <= scrollObjs[1].container.offsetTop) {
    container.style.transform = `scale(${calc(
      animationInfo.containerScale,
      scrollRatio
    )})`;
  }

  imageRows[0].style.transform = `translateX(${slideInfo[0]}px)`;
  imageRows[1].style.transform = `translateX(-${slideInfo[1]}px)`;
  imageRows[2].style.transform = `translateX(${slideInfo[2]}px)`;
}

window.addEventListener("resize", () => {
  // 슬라이드시 덜컹거림 방지를 위해 리사이즈시마다 초기화
  imageBoxWidth = document.querySelector(".image").offsetWidth;
  resetPexel = (imageBoxWidth + 16) * 6;
  setting();
});

window.addEventListener("scroll", () => {
  scrollEvent();
});

window.addEventListener("load", () => {
  isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  if (isMobile) {
    document.querySelector("#heritage-container").style.display = "none";
  }
  document.querySelector("#loading").style.display = "none";
  document.body.classList.remove("noScroll");
  setting();
  playAnimation();
  scrollEvent();
});
