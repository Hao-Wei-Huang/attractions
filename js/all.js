const townSelect = document.querySelector('#townSelect');
const attractionList = document.querySelector('#attractionList');
const attractionArea = document.querySelector('#attractionArea');
const hotAreas = document.querySelector('.hot-towns');
const pagination = document.querySelector('#pagination');

let app = {
  data:{
    attractions:[],
    selectedAttractions:[],
    areas:[],
    pagination:{
      perpageNumber:10,
    }
  },
  init(){
    // 下拉式選單監聽事件
    townSelect.addEventListener('change', e => {
      let area = e.target.value;
      this.data.selectedAttractions = this.data.attractions.filter(item => item.Area === area);
      this.pagination(1);
    });
    // 熱門行政區監聽事件
    hotAreas.addEventListener('click', e => {
      e.preventDefault();
      if(e.target.nodeName !== 'A'){return};
      let area = e.target.dataset.area;
      townSelect.value = area;
      this.data.selectedAttractions = this.data.attractions.filter(item => item.Area === area);
      this.pagination(1);
    });
    // 頁數監聽事件
    pagination.addEventListener('click', e => {
      e.preventDefault();
      if(e.target.nodeName !== 'A'){return};
      this.pagination(Number(e.target.dataset.page));
    });
  },
  getAttractions(){
    axios.get('https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c')
    .then(response => {
      // handle success
      this.data.attractions = response.data.data.XML_Head.Infos.Info;
      this.data.selectedAttractions = this.data.attractions;
      this.getAreas();
      this.selectRender();
      this.pagination(1);
    })
    .catch(error => {
      // handle error
      console.log(error);
    })
  },
  getAreas(){
    this.data.attractions.forEach(item => {
      let areaIndex = item.Add.indexOf('區');
      item.Area = item.Add.slice(6, areaIndex + 1);
      // 代表矩陣沒有此元素
      if(this.data.areas.indexOf(item.Area) === -1){
        this.data.areas.push(item.Area);
      } 
    });
  },
  selectRender(){
    townSelect.innerHTML = `
      <option value="" disabled selected>--請選擇行政區--</option>
      ${this.data.areas.map(item =>`
        <option value=${item}>${item}</option>
      `).join('')}
    `
  },
  attractionRender(attractions){
    if(townSelect.value !== ''){
      attractionArea.textContent = this.data.selectedAttractions[0].Area;
    }
    attractionList.innerHTML = `
      ${attractions.map(item => `
      <li class="col-md-6 mb-4">
        <div class="bg-shadow h-100 d-flex flex-column">
          <div class="bg-image-size-m bg-cover d-flex align-items-end" style="background-image: url(${item.Picture1});">
            <div class="w-100 text-white d-flex justify-content-between px-4 py-3 bg-dark-transparent">
              <h3 class="h4">${item.Name}</h3>
              <span>${item.Area}</span>
            </div>
          </div>
          <ul class="px-4 pb-3 flex-grow-1">
            <li class="mt-3">
              <a href="#" class="d-flex align-items-center">
                <div class="image-size-sm d-flex justify-content-center align-items-center flex-shrink-0 mr-2">
                  <img src="images/icons_clock.png" alt="image loading">
                </div>
                <span class="text-dark">${item.Opentime}</span>
              </a>
            </li>
            <li class="mt-3">
              <a href="#" class="d-flex align-items-center">
                <div class="image-size-sm d-flex justify-content-center align-items-center flex-shrink-0 mr-2">
                  <img src="images/icons_pin.png" alt="image loading">
                </div>
                <span class="text-dark">${item.Add}</span>
              </a>
            </li>
            <li class="mt-3 d-flex">
              <a href="tel:+${item.Tel}" class="d-flex align-items-center">
                <div class="image-size-sm d-flex justify-content-center align-items-center mr-2">
                  <img src="images/icons_phone.png" alt="image loading">
                </div>
                <span class="text-dark">${item.Tel}</span>
              </a>
              <div class="ml-auto d-flex">
                <div class="image-size-sm d-flex justify-content-center align-items-center mr-2">
                  <img src="images/icons_tag.png" alt="image loading">
                </div>
                <span class="text-dark">${item.Ticketinfo === '' ? '免費參觀':''}</span>
              </div>
            </li>
          </ul>
        </div>
      </li>
      `).join('')}
    `
  },
  pagination(currentPage){
    this.data.pagination.totalPageNumber = Math.ceil(this.data.selectedAttractions.length/this.data.pagination.perpageNumber);
    this.data.pagination.currentPage = currentPage;
    this.data.pagination.hasPage = currentPage > 1;
    this.data.pagination.hasNext = currentPage < this.data.pagination.totalPageNumber;
    let pageSelectedAttractions;
    if(this.data.pagination.currentPage < this.data.pagination.totalPageNumber){
      pageSelectedAttractions = this.data.selectedAttractions.slice((this.data.pagination.currentPage - 1) 
      * this.data.pagination.perpageNumber, this.data.pagination.currentPage * this.data.pagination.perpageNumber);
    }
    else{
      pageSelectedAttractions = this.data.selectedAttractions.slice((this.data.pagination.currentPage - 1) 
      * this.data.pagination.perpageNumber);
    }
    this.paginationRender();
    this.attractionRender(pageSelectedAttractions);
  },
  paginationRender(){
    let pageItems = '';
    for(let i = 0; i < this.data.pagination.totalPageNumber; i++){
      pageItems += `<li class="page-item ${i + 1 === this.data.pagination.currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i+1}">${i+1}</a></li>`
    }
    pagination.innerHTML = `
    <li class="page-item ${this.data.pagination.hasPage ? '' : 'disabled'}" id="previous">
      <a class="page-link" href="#" aria-label="Previous" data-page="${this.data.pagination.currentPage - 1}">
        &laquo;
      </a>
    </li>
    ${pageItems}
    <li class="page-item ${this.data.pagination.hasNext ? '' : 'disabled'}" id="next">
      <a class="page-link" href="#" aria-label="Next" data-page="${this.data.pagination.currentPage + 1}">
        &raquo;
      </a>
    </li>
    `
  },
}
app.init();
app.getAttractions();