let client = null;           // MQTT 클라이언트 객체
let connectionFlag = false;  // 연결 상태이면 true
const CLIENT_ID = "client-" + Math.floor((1 + Math.random()) * 0x10000000000).toString(16);  // 랜덤 사용자 ID
let fireAlertDisplayed = false;  // 화재 경고 메시지 표시 여부

function connect() {
    if (connectionFlag == true) return;

    let broker = document.getElementById("broker").value;
    let port = 9001;

    client = new Paho.MQTT.Client(broker, Number(port), CLIENT_ID);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({ onSuccess: onConnect });
}

function onConnect() {
    connectionFlag = true;
    document.getElementById("messages").innerHTML += '<span>Connected</span><br/>';
}

function subscribe(topic) {
    if (connectionFlag != true) {
        alert("연결되지 않았음");
        return false;
    }
    document.getElementById("messages").innerHTML += '<span>구독신청: 토픽 ' + topic + '</span><br/>';
    client.subscribe(topic);
}

function publish(topic, msg) {
    if (connectionFlag != true) {
        alert("연결되지 않았음");
        return false;
    }
    client.send(topic, msg, 0, false);
}

function unsubscribe(topic) {
    if (connectionFlag != true) return;
    document.getElementById("messages").innerHTML += '<span>구독신청취소: 토픽 ' + topic + '</span><br/>';
    client.unsubscribe(topic, null);
}

function onConnectionLost(responseObject) {
    document.getElementById("messages").innerHTML += '<span>오류 : 접속 끊어짐</span><br/>';
    if (responseObject.errorCode !== 0) {
        document.getElementById("messages").innerHTML += '<span>오류 : ' + responseObject.errorMessage + '</span><br/>';
    }
}

function onMessageArrived(msg) {
    if (msg.destinationName == "image") {
        drawImage(msg.payloadBytes);
    }

    if (msg.destinationName == "ultrasonic") {
        addChartData(parseFloat(msg.payloadString));
    }

    if (msg.destinationName == "temperature") {
        if (!document.getElementById("temperature-info")) {
            document.getElementById("messages").innerHTML += '<span id="temperature-info">현재의 온도:</span>';
        }
        document.getElementById("temperature-info").innerText = '현재의 온도: ' + parseInt(msg.payloadString) + 'ºc';

        var temperature = parseInt(msg.payloadString);
        if (temperature > 15 && !fireAlertDisplayed) {
            document.getElementById("messages").innerHTML += '화재가 발생하였습니다.<br>';
            fireAlertDisplayed = true;
        } else if (temperature <= 28 && fireAlertDisplayed) {
            document.getElementById("messages").innerHTML += '화재 경고가 해제되었습니다.<br>';
            fireAlertDisplayed = false;
        }
    }

    if (msg.destinationName == "humidity") {
        document.getElementById("messages").innerHTML += '<span>현재의 습도는 : ' + parseInt(msg.payloadString) + '%</span><br/>';
    }
}

function disconnect() {
    if (connectionFlag == false) return;
    client.disconnect();
    document.getElementById("messages").innerHTML += '<span>Disconnected</span><br/>';
    connectionFlag = false;
    fireAlertDisplayed = false;
}
