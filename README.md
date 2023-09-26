# 프로젝트 목적

- 파일 형식 변환시 해당 서비스를 제공하는 사이트를 찾아갸아 한다는 불편함이 있었다. 차라리, 내가 원하는 기능들만 한데 모아서 구현해놓는다면 두고두고 유용하게 사용할 수 있을 것 같아 제작하게 되었다.

# 프로젝트 기능

### Excel to JSON

- 기상청 API를 이용해 데이터를 가져오면 위도와 경도 정보를 이용해 특정 위치를 알아야 날씨를 추정할 수 있다.

#### 기술스택

- FileAPI: excel 파일 읽기
- sheetjs: excel 파일 변환(위도, 경도 정보)
- 기상청 OpenAPI: 날씨 정보

# 공통 기술스택

- react.js
- tailwind: CSS
