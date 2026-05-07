import io, time
import cv2
from PIL import Image, ImageFilter
import paho.mqtt.client as mqtt
import camera
import base64
import temp
import lumi

isStart = False

def on_connect(client, userdata, msg, rc):
    client.subscribe("camera")

def on_message(client, userdata, msg):
    global isStart
    if msg.payload.decode('utf-8') == 'start':
        isStart = True
        print("Start Camera")
    else:
        isStart = False

broker_ip = "localhost"
client = mqtt.Client()
client.connect(broker_ip, 1883)  # 1883 포트로 mosquitto에 접속
client.on_connect = on_connect
client.on_message = on_message

temperature_last_sent_time = 0

client.loop_start()  # 메시지 루프를 실행하는 스레드 생성
camera.init()

stream = io.BytesIO()

THRESHOLD = 22  # 화재 경보 온도 기준값
VALUE = 10      # 조도 기준값

while True:
    luminance = lumi.getLuminance()
    temperature = temp.getTemperature(temp.sensor)
    humidity = temp.getHumidity(temp.sensor)

    client.publish("temperature", temperature, qos=0)
    client.publish("ultrasonic", luminance, qos=0)
    client.publish("humidity", humidity, qos=0)

    time.sleep(5)

    # 온도를 5초에 한 번씩 보냄
    current_time = time.time()
    if isStart and current_time - temperature_last_sent_time >= 5:
        client.publish("temperature", temperature, qos=0)
        temperature_last_sent_time = current_time

    if temperature >= THRESHOLD:
        temp.led_on_off(temp.led, 1)  # 빨간 LED 켜기 (화재 경보)
    elif temperature < THRESHOLD:
        temp.led_on_off(temp.led, 0)  # 빨간 LED 끄기

    if isStart == True:
        frame = camera.take_picture()
        stream.seek(0)
        image = Image.fromarray(frame)
        image.save(stream, format='JPEG')
        client.publish("image", stream.getvalue(), qos=0)
        stream.truncate()
    else:
        print("I am idle")
        time.sleep(5)

camera.final()       # 카메라 사용 끝내기
client.loop_stop()   # 메시지 루프 스레드 종료
client.disconnect()
