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
  created() {
    const h1s = document.querySelectorAll('h1')
    const h2s = document.querySelectorAll('h2')
    const h3s = document.querySelectorAll('h3')

    const num = 30
    const div = document.createElement('div')
    div.innerText = num
    const elCard = document.querySelector('#toc-el-card')
    elCard.appendChild(div)
  }
})
