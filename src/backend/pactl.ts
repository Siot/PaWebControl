import * as child from 'child_process'
const { promisify } = require('util')
import { SinkInput } from './sinkInput'
import { Sink } from './sink'

const exec = promisify(child.exec)

export class Pactl {
  public static readonly CMD = 'LANG=C pactl'
  private sinks: { [key: string]: Sink }
  private inputs: { [key: string]: SinkInput }
  public ready: Promise<any>

  constructor() {
    this.inputs = {}
    this.sinks = {}
    this.ready = this.update()
  }

  private clear(): void {
    this.inputs = {}
    this.sinks = {}
  }

  private async update() {
    this.clear()
    await this.createInputSinks()
    await this.createOutputSinks()
  }

  public async setVolume(id: any, volume: any) {
    if (id.charAt(0) === 's') {
      this.sinks[id.slice(1)].setVolume(volume)
    } else {
      this.inputs[id.slice(1)].setVolume(volume)
    }
    await this.update()
  }

  public async setMute(id: any, mute: any) {
    if (id.charAt(0) === 's') {
      await this.sinks[id.slice(1)].setMute(mute)
    } else {
      await this.inputs[id.slice(1)].setMute(mute)
    }
    await this.update()
  }

  public async move(id: any, sink: any) {
    this.inputs[id.slice(1)].move(sink.slice(1))
    await this.update()
  }

  public getData(): Object {
    return {
      sinks: JSON.parse(JSON.stringify(this.sinks)),
      inputs: JSON.parse(JSON.stringify(this.inputs))
    }
  }

  private arrayChunk(filteredOutput: any, size: number) {
    let i
    let j
    let temparray = []
    for (i = 0, j = filteredOutput.length; i < j; i += size) {
      temparray.push(filteredOutput.slice(i, i + size))
    }

    return temparray
  }

  private async createInputSinks() {
    const { stdout, stderr } = await exec([Pactl.CMD, 'list', SinkInput.CMD].join(' '))
    const output = stdout.split('\n')
    let filteredOutput = output.filter(SinkInput.sink_inputs_filter)
    // output es un array key -> value???
    // $filteredOutput = array_values($filteredOutput);
    filteredOutput.forEach((current: string, index: number, array: Array<string>) => {
      array[index] = (current as any).trimStart()
    })

    filteredOutput = this.arrayChunk(filteredOutput, 5)

    filteredOutput.forEach((sinkInput: Array<string>) => {
      const id: string = sinkInput[0].substring(sinkInput[0].indexOf('#') + 1)
      this.inputs[id] = new SinkInput(sinkInput)
    })
  }

  private async createOutputSinks() {
    const { stdout, stderr } = await exec([Pactl.CMD, 'list', Sink.CMD].join(' '))
    const output = stdout.split('\n')
    let filteredOutput = output.filter(Sink.sinks_filter)
    // $filteredOutput = array_values($filteredOutput);
    filteredOutput.forEach((current: string, index: number, array: Array<string>) => {
      // array[index] = current.trimStart()
      array[index] = current.trimLeft()
    })

    filteredOutput = this.arrayChunk(filteredOutput, 4)

    filteredOutput.forEach((sink: Array<string>) => {
      const id = sink[0].substring(sink[0].indexOf('#') + 1)
      this.sinks[id] = new Sink(sink)
    })
  }
}
