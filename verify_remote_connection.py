import paho.mqtt.client as mqtt
import ssl
import time
import sys
import socket

# HiveMQ Settings
BROKER = "ebd48b34f0024d7da700e7542962d530.s1.eu.hivemq.cloud"
PORT = 8883
USER = "soufiane"
PASSWORD = "Souf0000"

print(f"🔍 DIAGNOSTIC SCRIPT FOR PYTHONANYWHERE")
print(f"----------------------------------------")
print(f"Testing connectivity to: {BROKER}:{PORT}")

# 1. Test DNS and Socket
print(f"\n[1] Testing basic TCP connection (Socket)...")
try:
    s = socket.create_connection((BROKER, PORT), timeout=5)
    print("✅ SUCCESS: Socket connected! (Host is reachable)")
    s.close()
except Exception as e:
    print(f"❌ FAILURE: Socket connection failed: {e}")
    print("👉 If this fails on PythonAnywhere Free Tier, it means the firewall is blocking port 8883.")
    sys.exit(1)

# 2. Test MQTT Connect
print(f"\n[2] Testing full MQTT + SSL handshake...")

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print("✅ SUCCESS: Connected to HiveMQ Cloud via MQTT!")
        sys.exit(0)
    else:
        print(f"❌ FAILURE: MQTT Connection refused with code {rc}")
        if rc == 5:
             print("👉 Check Credentials (Not authorized)")
        sys.exit(1)

client = mqtt.Client(client_id="PA_Test_Script", protocol=mqtt.MQTTv5)
client.on_connect = on_connect

# TLS is required for HiveMQ Cloud
# Note: On PythonAnywhere, we rely on system CAs. 
client.tls_set(tls_version=ssl.PROTOCOL_TLS)
client.username_pw_set(USER, PASSWORD)

try:
    print("🔄 Connecting...")
    client.connect(BROKER, PORT, 60)
    client.loop_start()
    time.sleep(5) # Wait for connection
    print("❌ TIMEOUT: Did not connect within 5 seconds (MQTT Handshake stuck)")
    client.loop_stop()
    sys.exit(1)
except Exception as e:
    print(f"❌ EXCEPTION: {e}")
    sys.exit(1)
