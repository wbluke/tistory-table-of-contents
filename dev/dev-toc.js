const CONSTANTS = (function () {
  const KEY_OF_H1 = 1;
  const KEY_OF_H2 = 2;
  const KEY_OF_H3 = 3;

  const LEVEL_1 = 1;
  const LEVEL_2 = 2;
  const LEVEL_3 = 3;

  /* 최상위 태그에 따른 레벨 Map */
  const levelsByH1 = function () {
    return new Map([[KEY_OF_H1, LEVEL_1], [KEY_OF_H2, LEVEL_2], [KEY_OF_H3, LEVEL_3]])
  }

  const levelsByH2 = function () {
    return new Map([[KEY_OF_H2, LEVEL_1], [KEY_OF_H3, LEVEL_2]])
  }

  const levelsByH3 = function () {
    return new Map([[KEY_OF_H3, LEVEL_1]])
  }

  return {
    indexOfH1: KEY_OF_H1,
    indexOfH2: KEY_OF_H2,
    indexOfH3: KEY_OF_H3,
    levelsByH1: levelsByH1(),
    levelsByH2: levelsByH2(),
    levelsByH3: levelsByH3(),
  }
})();

const TOC_CARD = (function () {
  const TocCardController = function () {

    const tocCardService = new TocCardService();

    const registerHTagsOnTocCard = function () {
      const levelMap = tocCardService.getLevelsByHighestTag();

      tocCardService.registerTagsOnToc(levelMap);
    }

    const giveIdToHTags = function () {
      tocCardService.giveIdToHTags();
    }

    const init = function () {
      const existsHTags = tocCardService.checkExistenceOfHTags();
      if (existsHTags) {
        giveIdToHTags();
        registerHTagsOnTocCard();
      }
    };

    return {
      init: init,
    };
  };

  const TocCardService = function () {
    const mainContents = document.querySelector('.area_view');
    const hTags = mainContents.querySelectorAll('h1, h2, h3');

    /* h1, h2, h3 태그가 있는지 확인한다 */
    const checkExistenceOfHTags = function () {
      return (hTags.length != 0);
    }

    /** 최상위 태그에 따른 레벨 Map 받아오기
     * 
     * h1 ~ h3 태그 중 가장 높은 태그를 찾아서 그에 맞게 Level을 설정한다.
     * 예를 들어, h1 태그가 없고 h2, h3 태그만 있는 경우
     * h2가 가장 높은 태그이며, 해당 태그 h2에 LEVEL_1을 부여하고 그 다음 태그인 h3에는 LEVEL_2를 부여한다.
     * 
     * 부여된 Level에 따라 적용되는 CSS가 달라진다.
     * */
    const getLevelsByHighestTag = function () {
      const highestHTagName = findHighestHTagName();

      if ('H1'.match(highestHTagName)) {
        return CONSTANTS.levelsByH1;
      }

      if ('H2'.match(highestHTagName)) {
        return CONSTANTS.levelsByH2;
      }

      return CONSTANTS.levelsByH3;
    }

    /* 최상위 태그 판별 작업 */
    const findHighestHTagName = function () {
      const highestTag = Array.prototype.slice.call(hTags).reduce((pre, cur) => {
        const tagNumOfPre = Number(pre.tagName.slice(-1));
        const tagNumOfCur = Number(cur.tagName.slice(-1));

        return (tagNumOfPre < tagNumOfCur) ? pre : cur;
      });

      return highestTag.tagName;
    }

    /* TOC에 태그 삽입 */
    const registerTagsOnToc = function (levelMap) {
      const elementsCard = document.querySelector('#toc-elements');

      hTags.forEach((element, indexOfHTag) => {
        let hTagItem;

        levelMap.forEach((level, key) => {
          if (element.matches(`h${key}`)) {
            hTagItem = createTagItemByLevel(level, element, indexOfHTag);
          }
        })

        elementsCard.appendChild(hTagItem);
      });
    }

    const createTagItemByLevel = function (level = CONSTANTS.NUM_OF_H1, element, indexOfHTag) {
      const basicItem = createBasicItemBy(element);
      appendScrollEventsOn(basicItem, indexOfHTag);

      basicItem.classList.add(`toc-level${level}`);

      return basicItem;
    }

    const createBasicItemBy = function (element) {
      const basicItem = document.createElement('a');

      basicItem.innerHTML += element.innerText;
      basicItem.classList = 'link-to-h-tag';

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
      hTags.forEach((element, indexOfHTag) => {
        element.id = generateIdOfHTag(indexOfHTag);
      });
    }

    return {
      checkExistenceOfHTags: checkExistenceOfHTags,
      getLevelsByHighestTag: getLevelsByHighestTag,
      registerTagsOnToc: registerTagsOnToc,
      giveIdToHTags: giveIdToHTags,
    }
  };

  const tocCardController = new TocCardController();

  const init = function () {
    tocCardController.init();
  };

  return {
    init: init,
  }
})();

TOC_CARD.init();