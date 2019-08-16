import * as child from 'child_process';

import { Sink } from './sink';
import { SinkInput } from './sinkInput';

import { promisify } from 'util';

const exec = promisify(child.exec);

export class Pactl {
  public static readonly CMD = 'LANG=C pactl';
  public ready: Promise<any>;
  private sinks: { [key: string]: Sink };
  private inputs: { [key: string]: SinkInput };

  constructor() {
    this.inputs = {};
    this.sinks = {};
    this.ready = this.update();
  }

  public async setVolume(id: any, volume: any) {
    if (id.charAt(0) === 's') {
      this.sinks[id.slice(1)].setVolume(volume);
    } else {
      this.inputs[id.slice(1)].setVolume(volume);
    }
    await this.update();
  }

  public async setMute(id: any, mute: any) {
    if (id.charAt(0) === 's') {
      await this.sinks[id.slice(1)].setMute(mute);
    } else {
      await this.inputs[id.slice(1)].setMute(mute);
    }
    await this.update();
  }

  public async move(id: any, sink: any) {
    this.inputs[id.slice(1)].move(sink.slice(1));
    await this.update();
  }

  public getData(): {} {
    return {
      inputs: JSON.parse(JSON.stringify(this.inputs)),
      sinks: JSON.parse(JSON.stringify(this.sinks))
    };
  }

  private clear(): void {
    this.inputs = {};
    this.sinks = {};
  }

  private async update() {
    this.clear();
    await this.createInputSinks();
    await this.createOutputSinks();
  }

  private arrayChunk(filteredOutput: any, size: number) {
    let i;
    let j;
    const temparray = [];
    for (i = 0, j = filteredOutput.length; i < j; i += size) {
      temparray.push(filteredOutput.slice(i, i + size));
    }

    return temparray;
  }

  private async createInputSinks() {
    const { stdout, stderr } = await exec([Pactl.CMD, 'list', SinkInput.CMD].join(' '));
    const output = stdout.split('\n');
    let filteredOutput = output.filter(SinkInput.sink_inputs_filter);
    // output es un array key -> value???
    // $filteredOutput = array_values($filteredOutput);
    filteredOutput.forEach((current: string, index: number, array: string[]) => {
      array[index] = (current as any).trimStart();
    });

    filteredOutput = this.arrayChunk(filteredOutput, 5);

    filteredOutput.forEach((sinkInput: string) => {
      const id: string = sinkInput[0].substring(sinkInput[0].indexOf('#') + 1);
      this.inputs[id] = new SinkInput(sinkInput);
    });
  }

  private async createOutputSinks() {
    const { stdout, stderr } = await exec([Pactl.CMD, 'list', Sink.CMD].join(' '));
    const output = stdout.split('\n');
    let filteredOutput = output.filter(Sink.sinks_filter);
    // $filteredOutput = array_values($filteredOutput);
    filteredOutput.forEach((current: string, index: number, array: string[]) => {
      // array[index] = current.trimStart()
      array[index] = current.trimLeft();
    });

    filteredOutput = this.arrayChunk(filteredOutput, 4);

    filteredOutput.forEach((sink: string) => {
      const id = sink[0].substring(sink[0].indexOf('#') + 1);
      this.sinks[id] = new Sink(sink);
    });
  }
}
