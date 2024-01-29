# k6
> https://k6.io/docs/

## 부하 테스트
기존에 여러 부하 테스트 툴이 존재하지만, 세팅이 가장 쉬우면서 시나리오 작성이 비교적 쉬운 k6를 이용하여 부하 테스트를 진행합니다.

## 설치
```shell
brew install k6
```

## 실행

기본적인 실행 방법은 JS 기반의 작성된 시나리오를 실행하는 방법입니다.

```shell
k6 run script.js
```

vu(가상 사용자)와 iteration(반복 횟수)를 지정하여 실행할 수 있습니다.
```shell
k6 run --iterations=100 --vus=10  script.js
```

실행 결과를 json 형태로 저장하고 싶은 경우 아래와 같이 실행합니다.
```shell
k6 run --out json=result/test.json script.js
```

실행 과정에서 로그를 남기고 확인하고 싶은 경우 아래 옵션을 추가해줍니다.
```shell
k6 run --console-output "log/log.txt" script.js 
```

옵션에 따라 원하는 값을 출력할 수 있습니다.
> https://k6.io/docs/using-k6/k6-options/reference/#summary-trend-stats

```shell
k6 run --summary-trend-stats="med,p(95),p(99.9)" script.js
```

### 예제

```shell
k6 run --iterations=100 --vus=10 --summary-trend-stats="med,p(95),p(99.9)" --out json=result/test.json script.js
```

```shell
k6 run --config stress.json --out json=result/test.json script.js
```

### 부하 테스트 종류
> 원하는 테스트 형태에 따라 options을 설정해줍니다.
> https://k6.io/docs/test-types/

- stress: https://k6.io/docs/test-types/stress-testing/
- spike: https://k6.io/docs/test-types/spike-testing/
- breakpoint: https://k6.io/docs/test-types/breakpoint-testing/

## 시각화
> grafana, influxdb 이용

### compose
```
version: "3.7"

services:
  influxdb:
    image: bitnami/influxdb:1.8.5
    container_name: influxdb
    ports:
      - "8086:8086"
      - "8085:8088"
    environment:
      - INFLUXDB_ADMIN_USER_PASSWORD=bitnami123
      - INFLUXDB_ADMIN_USER_TOKEN=admintoken123
      - INFLUXDB_HTTP_AUTH_ENABLED=false
      - INFLUXDB_DB=wilump-db
  granafa:
    image: bitnami/grafana:latest
    ports:
      - "3000:3000"
```

#### grafana 초기 계정
- ID: admin
- PW: admin 

#### influxdb cli 설치
```
brew install influxdb-cli
```

#### influxdb 세팅 확인
```
$ influx ping
OK
```

### data source 추가
- URL: `http://influxdb:8086`
- Database: `wilump-db`

### grafana 대시보드 설정
[grafana 대시보드](./grafana/) 추가

### 실행

```shell
k6 run --out influxdb=http://localhost:8086/wilump-db  script.js
```