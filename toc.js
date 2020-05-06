/*
 * Tistory TOC (Table Of Contents)
 * dev by wbluke (wbluke.com)
 * last update 2020.05.06
 * version 0.1.5
 */

const CLASS_OF_MAIN_CONTENTS = '.area_view';

const CONSTANTS = (function () {
  const KEY_OF_H1 = 1;
  const KEY_OF_H2 = 2;
  const KEY_OF_H3 = 3;
  const KEY_OF_H4 = 4;

  const LEVEL_1 = 1;
  const LEVEL_2 = 2;
  const LEVEL_3 = 3;
  const LEVEL_4 = 4;

  /* 최상위 태그에 따른 레벨 Map */
  const levelsByH1 = function () {
    return new Map([[KEY_OF_H1, LEVEL_1], [KEY_OF_H2, LEVEL_2], [KEY_OF_H3, LEVEL_3], [KEY_OF_H4, LEVEL_4]])
  }

  const levelsByH2 = function () {
    return new Map([[KEY_OF_H2, LEVEL_1], [KEY_OF_H3, LEVEL_2], [KEY_OF_H4, LEVEL_3]])
  }

  const levelsByH3 = function () {
    return new Map([[KEY_OF_H3, LEVEL_1], [KEY_OF_H4, LEVEL_2]])
  }

  const levelsByH4 = function () {
    return new Map([[KEY_OF_H4, LEVEL_1]])
  }

  return {
    indexOfH1: KEY_OF_H1,
    indexOfH2: KEY_OF_H2,
    indexOfH3: KEY_OF_H3,
    indexOfH4: KEY_OF_H4,
    levelsByH1: levelsByH1(),
    levelsByH2: levelsByH2(),
    levelsByH3: levelsByH3(),
    levelsByH4: levelsByH4(),
  }
})();

const TOC_CARD = (function () {
  const TocCardController = function () {

    const tocCardService = new TocCardService();

    const initTocElementsCard = function () {
      tocCardService.initTocElementsCard();
    }

    const giveIdToHTags = function () {
      tocCardService.giveIdToHTags();
    }

    const registerHTagsOnTocCard = function () {
      const levelMap = tocCardService.getLevelsByHighestTag();

      tocCardService.registerTagsOnToc(levelMap);
    }

    const init = function () {
      const existsHTags = tocCardService.checkExistenceOfHTags();
      if (existsHTags) {
        initTocElementsCard();
        giveIdToHTags();
        registerHTagsOnTocCard();
      }
    };

    const onscroll = function () {
      const tocTag = tocCardService.findCurrentHTag();

      if (tocTag) {
        tocCardService.markCurrentHTag(tocTag);
        tocCardService.scrollToMainTocTag(tocTag);
        tocCardService.detectTocCardPosition();
      }
    }

    return {
      init,
      onscroll,
    };
  };

  const TocCardService = function () {
    const tocElementsCard = document.querySelector('#toc-elements');

    const mainContents = document.querySelector(CLASS_OF_MAIN_CONTENTS);

    const hTags = (function () {
      const foundHTags = mainContents.querySelectorAll('h1, h2, h3, h4');

      /* 글 내용 밑에 있는 [...카테고리의 다른 글] h4 제거 */
      return [...foundHTags].filter(hTag => !hTag.parentElement.classList.contains('another_category'));
    })();

    /* h1, h2, h3, h4 태그가 있는지 확인한다 */
    const checkExistenceOfHTags = function () {
      if (mainContents === undefined) {
        return false;
      }

      return hTags.length !== 0;
    }

    const initTocElementsCard = function () {
      tocElementsCard.classList.add('toc-app-common', 'items', 'toc-app-basic');
    }

    /** 최상위 태그에 따른 레벨 Map 받아오기
     * 
     * h1 ~ h4 태그 중 가장 높은 태그를 찾아서 그에 맞게 Level을 설정한다.
     * 예를 들어, h1 태그가 없고 h2, h3 태그만 있는 경우
     * h2가 가장 높은 태그이며, 해당 태그 h2에 LEVEL_1을 부여하고 그 다음 태그인 h3에는 LEVEL_2를 부여한다.
     * 
     * 부여된 Level에 따라 적용되는 CSS가 달라진다.
     * */
    const getLevelsByHighestTag = function () {
      const levelMapByHighestTag = {
        'H1': CONSTANTS.levelsByH1,
        'H2': CONSTANTS.levelsByH2,
        'H3': CONSTANTS.levelsByH3,
      };

      return levelMapByHighestTag[findHighestHTag().tagName] || CONSTANTS.levelsByH4;
    }

    /* 최상위 태그 판별 작업 */
    const findHighestHTag = function () {
      return [...hTags].reduce((pre, cur) => {
        const tagNumOfPre = parseInt(pre.tagName[1]);
        const tagNumOfCur = parseInt(cur.tagName[1]);

        return (tagNumOfPre < tagNumOfCur) ? pre : cur;
      });
    }

    /* TOC에 태그 삽입 */
    const registerTagsOnToc = function (levelMap) {
      hTags.forEach((hTag, indexOfHTag) => {
        let hTagItem;

        levelMap.forEach((level, key) => {
          if (hTag.matches(`h${key}`)) {
            hTagItem = createTagItemByLevel(level, hTag, indexOfHTag);
          }
        })

        tocElementsCard.appendChild(hTagItem);
      });
    }

    const createTagItemByLevel = function (level = CONSTANTS.NUM_OF_H1, hTag, indexOfHTag) {
      const basicItem = createBasicItemBy(hTag, indexOfHTag);
      appendScrollEventsOn(basicItem, indexOfHTag);

      basicItem.classList.add(`toc-level-${level}`);

      return basicItem;
    }

    const createBasicItemBy = function (hTag, indexOfHTag) {
      const basicItem = document.createElement('a');

      basicItem.innerHTML += hTag.innerText;
      basicItem.id = `toc-${indexOfHTag}`;
      basicItem.classList = 'toc-common';

      return basicItem;
    }

    const generateIdOfHTag = function (indexOfHTag) {
      return 'h-tag-' + indexOfHTag;
    }

    const appendScrollEventsOn = function (basicItem, indexOfHTag) {
      const target = document.querySelector('#' + generateIdOfHTag(indexOfHTag));
      basicItem.addEventListener('click', () => window.scrollTo({
        top: target.offsetTop - 10,
        behavior: 'smooth'
      }));
    }

    const giveIdToHTags = function () {
      hTags.forEach((hTag, indexOfHTag) => {
        hTag.id = generateIdOfHTag(indexOfHTag);
      });
    }

    const findCurrentHTag = function () {
      if (hTags.length == 0) {
        return undefined;
      }

      const currentHTag = findCurrentMainHTag();
      return findTocTagCorrespondingToHTag(currentHTag);
    }

    const findCurrentMainHTag = function () {
      const headArea = document.querySelector('.area_head');

      let headAreaHeight = 0;
      if (headArea) {
        headAreaHeight = headArea.offsetHeight;
      }

      const middleHeight = window.scrollY + (window.innerHeight / 2) - headAreaHeight;

      return [...hTags].reduce((pre, cur) => {
        if (middleHeight < pre.offsetTop && middleHeight < cur.offsetTop) {
          return pre;
        }

        if (pre.offsetTop < middleHeight && middleHeight <= cur.offsetTop) {
          return pre;
        }

        return cur;
      });
    }

    const findTocTagCorrespondingToHTag = function (currentHTag) {
      const indexOfHTag = parseIndexOfTag(currentHTag);

      return document.querySelector(`#toc-${indexOfHTag}`);
    }

    const parseIndexOfTag = function (hTag) {
      const tokens = hTag.id.split('-');
      return parseInt(tokens[tokens.length - 1]);
    }

    const markCurrentHTag = function (tocTag) {
      removeAllClassOnTocTags('toc-active');
      tocTag.classList.add('toc-active');
      markParentHTagOf(tocTag);
    }

    const removeAllClassOnTocTags = function (className) {
      Array.prototype.slice.call(tocElementsCard.children).forEach(child => {
        child.classList.remove(className);
      });
    }

    const markParentHTagOf = function (tocTag) {
      const indexOfTocTag = parseIndexOfTag(tocTag);
      const levelOfBaseTocTag = findLevelOfTocTag(tocTag);

      removeAllClassOnTocTags('toc-parent-active');
      compareLevelAndMark(levelOfBaseTocTag, indexOfTocTag);
    }

    /**
     * 현재 active 태그의 부모 레벨 태그를 표시 
     * 기준 태그(active 태그)애서 하나씩 위로 올라가면서 부모 태그를 탐색 (재귀)
     * */
    const compareLevelAndMark = function (levelOfBaseTocTag, indexOfCurrentTocTag) {
      if (levelOfBaseTocTag <= 1 || indexOfCurrentTocTag < 0) {
        return;
      }

      const currentTocTag = document.querySelector(`#toc-${indexOfCurrentTocTag}`);
      const levelOfCurrentTocTag = findLevelOfTocTag(currentTocTag);

      if (levelOfBaseTocTag <= levelOfCurrentTocTag) {
        return compareLevelAndMark(levelOfBaseTocTag, indexOfCurrentTocTag - 1);
      }

      currentTocTag.classList.add('toc-parent-active')
      compareLevelAndMark(levelOfBaseTocTag - 1, indexOfCurrentTocTag - 1);
    }

    const findLevelOfTocTag = function (tocTag) {
      const classes = tocTag.classList;
      if (classes.contains('toc-level-4')) {
        return 4;
      }

      if (classes.contains('toc-level-3')) {
        return 3;
      }

      if (classes.contains('toc-level-2')) {
        return 2;
      }

      return 1;
    }

    /**
     * TOC 항목이 너무 많아 TOC Card에 스크롤이 생길 경우, 
     * 스크롤 이벤트에 따라 활성화된 TOC 태그가 보이도록 TOC Card의 스크롤도 함께 이동한다.
     */
    const scrollToMainTocTag = function (tocTag) {
      tocElementsCard.scroll({
        top: tocTag.offsetTop - (tocTag.offsetParent.offsetHeight * 0.3),
        behavior: 'smooth'
      });
    }

    const detectTocCardPosition = function () {
      const currentScrollTop = document.documentElement.scrollTop;

      const footer = document.querySelector('#mEtc');

      let footerTop = Number.MAX_SAFE_INTEGER;
      if (footer) {
        footerTop = footer.offsetTop;
      }

      const elementsCardBottom = currentScrollTop + tocElementsCard.offsetHeight;

      tocElementsCard.classList.remove('toc-app-basic', 'toc-app-bottom');

      if (elementsCardBottom >= footerTop) {
        tocElementsCard.classList.add('toc-app-bottom');
        return;
      }

      tocElementsCard.classList.add('toc-app-basic');
    }

    return {
      checkExistenceOfHTags,
      initTocElementsCard,
      getLevelsByHighestTag,
      registerTagsOnToc,
      giveIdToHTags,
      findCurrentHTag,
      markCurrentHTag,
      scrollToMainTocTag,
      detectTocCardPosition
    }
  };

  const tocCardController = new TocCardController();

  const init = function () {
    tocCardController.init();
  };

  const onscroll = function () {
    tocCardController.onscroll();
  }

  return {
    init,
    onscroll,
  }
})();

TOC_CARD.init();

/**
 * scroll 시 현재 내용의 위치를 스크롤 이벤트를 통해 TOC에 표시해주기
 */
window.onscroll = function () {
  TOC_CARD.onscroll();
}
