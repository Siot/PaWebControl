import * as child from 'child_process';

import { Pactl } from './pactl';
import { StringUtils } from './stringUtils';

import { promisify } from 'util';

const exec = promisify(child.exec);

export class Sink {
  public static readonly CMD = 'sinks';

  public static sinks_filter(data: any): boolean {
    const elements = ['Sink', 'Description', 'Mute', 'Volume'];
    let contained = false;
    elements.forEach((element: any) => {
      if (data.trimStart().indexOf(element) === 0) {
        contained = true;
      }
    });
    return contained;
  }
  private readonly id: any;
  private description: any;
  private mute: any;
  private volume: any;

  public constructor(data: any) {
    // Sink input number
    this.id = data[0].slice(data[0].indexOf('#') + 1);
    // Sink description
    this.description = data[1].slice(data[1].indexOf(':') + 2);
    // Mute
    this.mute = data[2].slice(data[2].indexOf(':') + 2);
    // Volume
    const volumes = data[3].match(/([\d]+%)/g);
    volumes.forEach((current: string, index: number, array: string[]) => {
      array[index] = StringUtils.rtrim(current, '%');
    });

    this.volume =
      volumes.reduce((a: string, b: string) => {
        return parseInt(a, 10) + parseInt(b, 10);
      }) / volumes.length;
  }
  public async setVolume(value: any) {
    await exec([Pactl.CMD, 'set-sink-volume', this.id, value + '%'].join(' '));
  }
  public async setMute(value: any) {
    await exec([Pactl.CMD, 'set-sink-mute', this.id, value].join(' '));
  }

  public toJSON(): {} {
    return {
      description: this.description,
      id: this.id,
      mute: this.mute,
      volume: this.volume
    };
  }
}
