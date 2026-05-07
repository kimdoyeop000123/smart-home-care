// 전역 변수 선언
let canvas;
let context;
let img;

// load 이벤트 리스너 등록. 웹페이지가 로딩된 후 실행
window.addEventListener("load", function() {
    canvas = document.getElementById("myCanvas");
    context = canvas.getContext("2d");
    img = new Image();
    img.onload = function () {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
});

// 바이너리 데이터를 base64 문자 코드로 변환하는 함수
function bytes2base64(bytes) {
    let binary = '';
    bytes = new Uint8Array(bytes);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// drawImage()는 "image" 토픽이 도착하였을 때 onMessageArrived()에 의해 호출된다.
function drawImage(bytes) {
    img.src = "data:image/jpg;base64," + bytes2base64(bytes);
}

let isImageSubscribed = false;

function startCamera() {
    if (!isImageSubscribed) {
        subscribe('image');
        isImageSubscribed = true;
    }
    publish('camera', 'start');  // 카메라 촬영 후 JPEG 이미지 보내도록 지시
}

function stopCamera() {
    if (isImageSubscribed) {
        unsubscribe('image');
        isImageSubscribed = false;
    }
    publish('camera', 'stop');  // 카메라 촬영 중지
}
