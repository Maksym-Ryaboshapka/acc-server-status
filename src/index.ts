import dbus from "dbus-next";

async function getPercentage(): Promise<number | Error> {

  const bus = dbus.systemBus();

  const obj = await bus.getProxyObject("org.freedesktop.UPower", "/org/freedesktop/UPower/devices/battery_BAT0");

  const upower = obj.getInterface("org.freedesktop.UPower.Device");
  const props = obj.getInterface("org.freedesktop.DBus.Properties");

  if (!props || !props.Get) {
    throw new Error("The D-Bus interface Properties does not contain a Get method");
  }

  const percentage = await props.Get("org.freedesktop.UPower.Device", "Percentage");

  return percentage;
}

getPercentage().then(percentage => console.log(percentage));