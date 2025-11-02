import dbus from "dbus-next";
import type { ClientInterface } from "dbus-next";

interface Percentage {
  percentage: number;
  props: ClientInterface;
}

export class DBusBattery {
  static readonly bus = dbus.systemBus();

  static async getPercentage(): Promise<Percentage | undefined> {
    const obj = await this.bus.getProxyObject("org.freedesktop.UPower", "/org/freedesktop/UPower/devices/battery_BAT0");

    const props = obj.getInterface("org.freedesktop.DBus.Properties");

    if (!props || !props.Get) {
      return;
    }

    const percentage = await props.Get("org.freedesktop.UPower.Device", "Percentage");

    return { percentage: percentage.value, props };
  }
}