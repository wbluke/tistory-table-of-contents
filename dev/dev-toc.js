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

const LEVEL_1 = 1;
const LEVEL_2 = 2;
const LEVEL_3 = 3;

const CONSTANTS = (function() {

  const BLANKS_OF_LEVEL_1 = 0;
  const BLANKS_OF_LEVEL_2 = 4;
  const BLANKS_OF_LEVEL_3 = 8;

  const blanksByLevel = function() {
    return new Map([[LEVEL_1, BLANKS_OF_LEVEL_1], [LEVEL_2, BLANKS_OF_LEVEL_2], [LEVEL_3, BLANKS_OF_LEVEL_3]]);
  }

  return {
    blanksByLevel: blanksByLevel()
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

    // TODO : 최상위 태그 판별 작업

    // TOC에 태그 삽입
    const elCard = document.querySelector('#toc-elements');
    tocTags.forEach(element => {
      const text = element.innerText;
      let item;
      if (element.matches('h1')) {
        item = this.getTagTemplateByLevel(LEVEL_1, text);
      }
      if (element.matches('h2')) {
        item = this.getTagTemplateByLevel(LEVEL_2, text);
      }
      if (element.matches('h3')) {
        item = this.getTagTemplateByLevel(LEVEL_3, text);
      }

      elCard.appendChild(item);
    });
  },
  methods: {
    getTagTemplateByLevel: function(level = LEVEL_1, text = '') {
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
