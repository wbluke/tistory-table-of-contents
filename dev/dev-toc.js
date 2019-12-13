const CONSTANTS = (function () {
  const INDEX_OF_H1 = 1;
  const INDEX_OF_H2 = 2;
  const INDEX_OF_H3 = 3;

  const LEVEL_1 = 1;
  const LEVEL_2 = 2;
  const LEVEL_3 = 3;

  /* 최상위 태그에 따른 레벨 Map */
  const levelsByH1 = function () {
    return new Map([[INDEX_OF_H1, LEVEL_1], [INDEX_OF_H2, LEVEL_2], [INDEX_OF_H3, LEVEL_3]])
  }

  const levelsByH2 = function () {
    return new Map([[INDEX_OF_H2, LEVEL_1], [INDEX_OF_H3, LEVEL_2]])
  }

  const levelsByH3 = function () {
    return new Map([[INDEX_OF_H3, LEVEL_1]])
  }

  /* Level 별 들여쓰기 공백 개수 */
  const BLANKS_OF_LEVEL_1 = 0;
  const BLANKS_OF_LEVEL_2 = 4;
  const BLANKS_OF_LEVEL_3 = 8;

  const blanksByLevel = function () {
    return new Map([[INDEX_OF_H1, BLANKS_OF_LEVEL_1], [INDEX_OF_H2, BLANKS_OF_LEVEL_2], [INDEX_OF_H3, BLANKS_OF_LEVEL_3]]);
  }

  return {
    indexOfH1: INDEX_OF_H1,
    indexOfH2: INDEX_OF_H2,
    indexOfH3: INDEX_OF_H3,
    levelsByH1: levelsByH1(),
    levelsByH2: levelsByH2(),
    levelsByH3: levelsByH3(),
    blanksByLevel: blanksByLevel(),
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
        registerHTagsOnTocCard();
        giveIdToHTags();
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

      hTags.forEach(element => {
        const textOfHTag = element.innerText;

        let hTagItem;

        levelMap.forEach((value, key) => {
          if (element.matches(`h${key}`)) {
            hTagItem = createTagItemByLevel(value, textOfHTag);
          }
        })

        elementsCard.appendChild(hTagItem);
      });
    }

    const createTagItemByLevel = function (level = CONSTANTS.NUM_OF_H1, text = '') {
      const basicItem = createBasicItemTemplate(text);
      const blanks = generateBlanks(CONSTANTS.blanksByLevel.get(level));

      basicItem.insertAdjacentHTML('afterbegin', blanks)
      basicItem.classList.add(`toc-level${level}`);

      return basicItem;
    }

    const createBasicItemTemplate = function (text = '') {
      const basicItem = document.createElement('div');
      basicItem.innerHTML += text;
      return basicItem;
    }

    const generateBlanks = function (repeat = 1) {
      return '&nbsp;'.repeat(repeat);
    }

    const giveIdToHTags = function () {
      hTags.forEach(element => {
        element.id = generateIdOfHTag(element);
      });
    }

    const generateIdOfHTag = function (element) {
      const textOfHTag = element.innerText;
      return textOfHTag.replaceAll(' ', '-');
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