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

new Vue({
  el: '#app',
  data: function() {
    return { 
      visible: false,
      toc: TOC
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
        item = this.getLevel1Template(text);
      }
      if (element.matches('h2')) {
        item = this.getLevel2Template(text);
      }
      if (element.matches('h3')) {
        item = this.getLevel3Template(text);
      }

      elCard.appendChild(item);
    });
  },
  methods: {
    getLevel1Template: function(text = '') {
      const basicItem = this.getBasicItemTemplate(text);
      basicItem.classList.add('toc-level1');
      return basicItem;
    },
    getLevel2Template: function(text = '') {
      const basicItem = this.getBasicItemTemplate(text);
      basicItem.insertAdjacentHTML('afterbegin', this.generateBlanks(4))
      basicItem.classList.add('toc-level2');
      return basicItem;
    },
    getLevel3Template: function(text = '') {
      const basicItem = this.getBasicItemTemplate(text);
      basicItem.insertAdjacentHTML('afterbegin', this.generateBlanks(8))
      basicItem.classList.add('toc-level3');
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
