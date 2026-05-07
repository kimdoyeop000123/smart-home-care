import time
import RPi.GPIO as GPIO
from adafruit_htu21d import HTU21D
import busio

def led_on_off(pin, value):
    # pin에 연결된 LED에 value(0/1) 값을 출력하여 LED를 켜거나 끄는 함수
    GPIO.output(pin, value)

def getTemperature(sensor):  # 센서로부터 온도 값 수신 함수
    return float(sensor.temperature)  # HTU21D 장치로부터 온도 값 읽기

def getHumidity(sensor):  # 센서로부터 습도 값 수신 함수
    return float(sensor.relative_humidity)  # HTU21D 장치로부터 습도 값 읽기

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

led = 6    # 빨간 LED (화재 경보)
white = 5  # 흰색 LED (조명)

GPIO.setup(led, GPIO.OUT)    # GPIO6 핀을 출력으로 지정
GPIO.setup(white, GPIO.OUT)

sda = 2  # GPIO2 핀
scl = 3  # GPIO3 핀
i2c = busio.I2C(scl, sda)  # I2C 버스 통신 객체 생성
sensor = HTU21D(i2c)        # HTU21D 장치 제어 객체

if __name__ == '__main__':
    while True:
        print("현재 온도는 %4.1d" % getTemperature(sensor))
        print("현재 습도는 %4.1d %%" % getHumidity(sensor))
        time.sleep(5)
