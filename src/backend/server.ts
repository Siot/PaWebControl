import * as http from 'http'

import * as express from 'express'
import * as socketIo from 'socket.io'

import { Pactl } from './pactl'

export class PAServer {
  private _app: express.Application
  private server: http.Server
  private io: SocketIO.Server

  constructor() {
    this._app = express()
    this.server = http.createServer(this.app)
    this.io = socketIo(this.server)
    this.listen()
  }

  public get app() {
    return this._app
  }

  private listen(): void {
    this.app.get('/', (req: any, res: any) => res.redirect('/index.html'))
    this.app.use(express.static('dist/client'))

    this.io.on('connection', (socket: any) => {
      console.log('a user connected')

      this.sendData(socket)

      setInterval(() => {
        this.sendData(socket)
      }, 3000)

      socket.on('query', function(msg: any) {
        ;(async () => {
          let panel = new Pactl()
          await panel.ready
          if (msg.id !== undefined) {
            if (msg.volume) {
              await panel.setVolume(msg.id, msg.volume)
            }
            if (msg.mute !== undefined) {
              await panel.setMute(msg.id, msg.mute)
            }
            if (msg.sink !== undefined) {
              await panel.move(msg.id, msg.sink)
            }
            // unset($panel);
            panel = new Pactl()
            await panel.ready
          }

          socket.emit('data update', panel.getData())
        })()
      })
    })

    this.server.listen(3000, () => console.log('Example app listening on port 3000!'))
  }

  private sendData(socket: any): void {
    ;(async () => {
      let panel = new Pactl()
      await panel.ready
      socket.emit('data update', panel.getData())
    })()
  }
}
