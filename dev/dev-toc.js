const TOC = {
  template: `<el-card id="toc-el-card" shadow="hover" class="box-card">
              <div slot="header" class="clearfix test">
                <span>Table Of Contents</span>
              </div>
              <div v-for="o in 25" :key="o" class="text item">
                {{'List item ' + o }}
              </div>
            </el-card>`
}

const CONSTANTS = (function() {
  const NUM_OF_H1 = 1;
  const NUM_OF_H2 = 2;
  const NUM_OF_H3 = 3;

  const LEVEL_1 = 1;
  const LEVEL_2 = 2;
  const LEVEL_3 = 3;

  /* Level 별 들여쓰기 공백 개수 */
  const BLANKS_OF_LEVEL_1 = 0;
  const BLANKS_OF_LEVEL_2 = 4;
  const BLANKS_OF_LEVEL_3 = 8;

  const blanksByLevel = function() {
    return new Map([[NUM_OF_H1, BLANKS_OF_LEVEL_1], [NUM_OF_H2, BLANKS_OF_LEVEL_2], [NUM_OF_H3, BLANKS_OF_LEVEL_3]]);
  }

  /* 최상위 태그에 따른 레벨 Map */
  const levelsByH1 = function() {
    return new Map([[NUM_OF_H1, LEVEL_1], [NUM_OF_H2, LEVEL_2], [NUM_OF_H3, LEVEL_3]])
  }

  const levelsByH2 = function() {
    return new Map([[NUM_OF_H2, LEVEL_1], [NUM_OF_H3, LEVEL_2]])
  }

  const levelsByH3 = function() {
    return new Map([[NUM_OF_H3, LEVEL_1]])
  }

  return {
    numOfH1: NUM_OF_H1,
    numOfH2: NUM_OF_H2,
    numOfH3: NUM_OF_H3,
    blanksByLevel: blanksByLevel(),
    levelsByH1: levelsByH1(),
    levelsByH2: levelsByH2(),
    levelsByH3: levelsByH3(),
  }
})();

new Vue({
  el: '#app',
  data: function() {
    return { 
      visible: false,
      toc: TOC,
    }
  },
  mounted() {
    const mainContents = document.querySelector('.area_view');
    const tocTags = mainContents.querySelectorAll('h1, h2, h3');

    /* h1, h2, h3 태그가 없는 경우 */
    if (tocTags.length == 0) {
      return;
    }

    /** 최상위 태그에 따른 레벨 Map 받아오기
     * 
     * h1 ~ h3 태그 중 가장 높은 태그를 찾아서 그에 맞게 Level을 설정한다.
     * 예를 들어, h1 태그가 없고 h2, h3 태그만 있는 경우
     * h2가 가장 높은 태그이며, 해당 태그 h2에 LEVEL_1을 부여하고 그 다음 태그인 h3에는 LEVEL_2를 부여한다.
     * 
     * 부여된 Level에 따라 적용되는 CSS가 달라진다.
     *  */ 
    const getLevelsByHighestTag = function() {

      /* 최상위 태그 판별 작업 */
      const findHighestHTagName = function() {
        const ret = Array.prototype.slice.call(tocTags).reduce((pre, cur) => {
          const numOfPre = Number(pre.tagName.slice(-1));
          const numOfCur = Number(cur.tagName.slice(-1));

          return (numOfPre < numOfCur) ? pre : cur;
        })

        return ret.tagName
      }

      const highestHTagName = findHighestHTagName();

      if ('H1'.match(highestHTagName)) {
        return CONSTANTS.levelsByH1;
      }

      if ('H2'.match(highestHTagName)) {
        return CONSTANTS.levelsByH2;
      }

      return CONSTANTS.levelsByH3;
    }

    const levelMap = getLevelsByHighestTag();

    /* TOC에 태그 삽입 */ 
    const elCard = document.querySelector('#toc-elements');
    tocTags.forEach(element => {
      const text = element.innerText;

      let item;

      levelMap.forEach((value, key) => {
        if (element.matches(`h${key}`)) {
          item = this.getTagTemplateByLevel(value, text);
        }
      })

      elCard.appendChild(item);
    });
  },
  methods: {
    getTagTemplateByLevel: function(level = CONSTANTS.NUM_OF_H1, text = '') {
      const basicItem = this.getBasicItemTemplate(text);
      const blanks = this.generateBlanks(CONSTANTS.blanksByLevel.get(level)); 

      basicItem.insertAdjacentHTML('afterbegin', blanks)
      basicItem.classList.add(`toc-level${level}`);

      return basicItem;
    },
    getBasicItemTemplate: function(text = '') {
      const basicItem = document.createElement('div');
      basicItem.className = 'text item'
      basicItem.innerHTML += text;
      return basicItem;
    },
    generateBlanks: function(repeat = 1) {
      return '&nbsp;'.repeat(repeat);
    }
  }
})
