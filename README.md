# tistory-table-of-contents
티스토리 [#1] 스킨전용 TOC

이 저장소는 티스토리의 `#1`이라는 이름의 스킨을 기준으로 만들어진 TOC(Table Of Contents)입니다.  

스킨이 다른 경우는 각 스킨에 맞추어 세부 설정들을 수정해야 할 수 있습니다.  
(티스토리의 각 스킨마다 클래스 이름이나 DOM 구조가 다르기 때문에 범용적인 적용에 한계가 있습니다ㅠ.ㅠ)  

아래 블로그 글에서 적용한 모습과 구현한 방법들을 읽어보실 수 있습니다 :)

## 적용한 블로그 글 & TOC 구현기

https://wbluke.tistory.com/21

## 적용 방법

1. 해당 저장소에서 `toc.css`와 `toc.js`파일을 다운로드 받습니다.
2. `toc.js` 파일을 열어 가장 상단에 있는 `CLASS_OF_MAIN_CONTENTS`에 메인 컨텐츠가 포함된 클래스를 찾아 넣어 줍니다.
제 스킨을 기준으로 한 기본값은 `.area_view`입니다.

<p align="center">
  <img src="https://user-images.githubusercontent.com/44018338/71405005-78ed4200-2677-11ea-9279-7253e601ed53.png" alt="file upload" width="900"/>
</p>
<p align="center">
  <img src="https://user-images.githubusercontent.com/44018338/71405185-09c41d80-2678-11ea-9bd7-322d951f21da.png" alt="file upload" width="500"/>
</p>

3. 티스토리의 **스킨 편집** 메뉴로 들어가서, **파일 업로드**에 해당 파일들을 업로드 합니다.

<p align="center">
  <img src="https://user-images.githubusercontent.com/44018338/71231068-96e13c80-232f-11ea-83af-b8c622ca3b24.png" alt="file upload" width="500"/>
</p>

4. HTML 소스에서 id가 **cMain**인 태그를 찾아 바로 밑에 다음과 같이 `<div id="toc-elements"></div>`를 추가합니다.

<p align="center">
  <img src="https://user-images.githubusercontent.com/44018338/71232097-e1fd4e80-2333-11ea-9526-815a3fae69cb.png" alt="main setting" width="500"/>
</p>

5. HTML 소스 상단에 다음과 같이 css 태그를 추가합니다.

<p align="center">
  <img src="https://user-images.githubusercontent.com/44018338/71231980-774c1300-2333-11ea-803f-e61c43cc1a80.png" alt="css setting" width="500"/>
</p>

6. HTML 소스 가장 하단에 다음과 같이 js 태그를 추가합니다. 다른 `script` 태그들보다 아래에 있어야 합니다.

<p align="center">
  <img src="https://user-images.githubusercontent.com/44018338/71232347-f68e1680-2334-11ea-9e1e-fd0ea5035d0d.png" alt="js setting" width="500"/>
</p>

## 기능 명세

- 티스토리 게시글에서 h1, h2, h3, h4 태그를 추출해 TOC를 동적으로 만들어 줍니다.
- h1, h2, h3, h4 태그는 depth에 따라 Tab과 글자 크기로 구분합니다.
- h1 태그가 없으면 h2 태그가 최상위 항목, h1과 h2 태그가 없으면 h3 태그가 최상위 항목, h1, h2, h3 모두 없다면 h4로만 이루어진 TOC를 만들어 줍니다.
<br/>

- TOC 항목을 클릭하면, 해당 태그가 있는 곳으로 이동하는 스크롤 이벤트가 발생합니다.
- 사용자가 스크롤을 내리면, 현재 사용자의 위치를 TOC 항목에 CSS를 걸어 동적으로 표시해 줍니다.
<br/>

- 만약 태그가 너무 많아서 지정한 max-height를 넘어 가면, TOC에 스크롤이 생깁니다.
- TOC 스크롤이 생긴 후에는 보이지 않는 아래 쪽 항목으로 게시글 뷰가 이동하면 TOC도 같이 따라 스크롤이 내려갑니다.
<br/>

- TOC가 이동할 수 있는 범위를 게시글 범위로 제한합니다. 맨 위쪽이나 맨 아래쪽 영역까지 침범하지 않도록 합니다.
- 화면의 가로 길이에 따라 동적으로 사라져야 합니다. 브라우저의 가로 길이가 줄어 들면 게시글을 가리지 않도록 합니다.
- 티스토리 특성 상 스킨의 제약을 많이 받아서, 일단은 제 블로그 스킨인 '#1' 스킨을 기준으로 작성합니다.
- 기존 티스토리의 소스를 최대한 건드리지 않는 선에서 추가합니다. 업로드 편의를 위해서 css, js 파일도 하나씩만 작성합니다.

## 주의 사항

### 마크다운

이 플러그인은 기본적으로 마크다운 사용자들을 위한 플러그인입니다.  

`#`, `##`, `###`, `####` 으로 소제목들을 달아서 사용하시면 됩니다.  

다만 3 depth 정도로만 사용하시는 것이 TOC 가독성에 좋습니다.  

ex) `##`, `###`, `####` 으로만 소제목을 구성한다.  

### 기본모드 사용 시

`[마크다운]` 글쓰기 모드가 아닌 `[기본모드]` 글쓰기 모드 사용 시  
- 제목1 : h2 태그
- 제목2 : h3 태그
- 제목3 : h4 태그

로 매핑되어 있음을 인지해 주시기 바랍니다.  

(사용하시는 데에 지장은 없습니다!)  

기존에 h1, h2, h3 태그만 지원 대상이었다가 h4 태그까지 지원 확장한 이유입니다.  

## Release Note

- 0.1.7
  - H Tag 내용에 `<`, `>`가 포함되어 있는 경우, 태그로 인식되지 않도록 치환
  - @QQyukim 님 감사합니다!

- 0.1.6
  - mainContents 의 존재성 체크 방식 변경

- 0.1.5
  - undefined 비교 구문을 존재성 체크 방식으로 변경

- 0.1.4
  - H4 태그까지 지원 확장

- 0.1.3
  - H 태그가 없는 글에서 스크롤 시 콘솔 에러가 표시되는 현상 해결  