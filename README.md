# 🏠 라즈베리파이를 이용한 홈 케어 서비스

> 라즈베리파이 + 다양한 센서 + 웹 브라우저로 구현한 스마트 홈 자동화 시스템

---

## 📌 프로젝트 소개

방 안에 설치된 카메라와 센서들을 웹 브라우저에서 실시간으로 모니터링하고 제어할 수 있는 홈 케어 시스템입니다.  
온도·습도·조도 센서 데이터를 MQTT 프로토콜로 전송하고, Flask 웹 서버와 JavaScript로 시각화합니다.

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| **언어** | Python, JavaScript, HTML/CSS |
| **하드웨어** | Raspberry Pi, HTU21D, MCP3008, USB Camera |
| **통신** | MQTT (Mosquitto), WebSocket |
| **웹 서버** | Flask |
| **시각화** | Chart.js, Canvas API |
| **라이브러리** | OpenCV, Paho MQTT, RPi.GPIO, Adafruit |

---

## ⚙️ 하드웨어 구성

| 부품 | 연결 핀 |
|------|---------|
| LED (빨간 - 화재경보) | GPIO 6 |
| LED (흰색 - 조명) | GPIO 5 |
| 초음파 센서 | GPIO 16, GPIO 20 |
| 온습도 센서 (HTU21D) | SDA1, SCL1 |
| 조도 센서 (MCP3008) | GPIO 8, 9, 10, 11 |
| 카메라 | USB |

---

## 📷 주요 기능

### 1. CCTV (실시간 카메라)
- 웹 브라우저에서 방 안의 모습을 실시간으로 확인
- 카메라 시작/중지 버튼으로 제어

### 2. 🔥 화재 경보 알림
- 온도 센서로 실시간 온도 측정
- 설정 온도 이상 → 웹에 화재 경보 알림 + 빨간 LED 점등
- 온도 하강 시 경보 자동 해제

### 3. 💡 LED 조명 제어
- 웹 라디오 버튼(ON/OFF)으로 방 조명 원격 제어

### 4. 💧 습도 모니터링
- 실시간 습도 측정 및 가습기 필요 여부 확인

### 5. ☀️ 조도 그래프
- 조도 센서 값을 실시간 라인 차트로 시각화 (Chart.js)
- Hide/Show 버튼으로 그래프 토글

---

## 🗂️ 파일 구조

```
smart-home-care/
├── camera.py           # USB 카메라 제어 (OpenCV)
├── temp.py             # 온습도 센서 제어 (HTU21D)
├── lumi.py             # 조도 센서 제어 (MCP3008)
├── cameramqtt.py       # 센서 데이터 MQTT 전송 메인 루프
├── cameraapp.py        # Flask 웹 서버
└── templates/
    └── cameraviewer.html   # 웹 페이지
    └── static/
        ├── cameramqttio.js # MQTT 클라이언트 로직
        ├── cameraimage.js  # 카메라 이미지 렌더링
        └── mychart.js      # 조도 차트
```

---

## 🚀 실행 방법

### 1. 패키지 설치
```bash
pip install flask paho-mqtt opencv-python Pillow RPi.GPIO adafruit-circuitpython-htu21d Adafruit-MCP3008
```

### 2. Mosquitto 브로커 실행
```bash
sudo systemctl start mosquitto
```

### 3. 센서 데이터 전송 실행
```bash
python cameramqtt.py
```

### 4. Flask 웹 서버 실행
```bash
python cameraapp.py
```

### 5. 웹 브라우저 접속
```
http://라즈베리파이IP:8080
```

---

## 📊 실행 결과

| 기능 | 결과 |
|------|------|
| CCTV | 웹에서 실시간 영상 확인 |
| 화재 경보 | 23°C 이상 시 경보 발생 및 LED 점등 |
| 습도 측정 | 40~41% 실시간 표시 |
| LED 제어 | 웹 버튼으로 ON/OFF 정상 동작 |
| 조도 그래프 | 약 1023 수준 실시간 차트 표시 |

---

## 🎓 개발 환경

- **과목**: 모바일&스마트시스템 (한성대학교)
- **하드웨어**: Raspberry Pi
- **OS**: Raspberry Pi OS (Linux)
- **개발 기간**: 2023년 2학기
