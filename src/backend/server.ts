import * as express from 'express'
import * as http from 'http'
import * as socketIo from 'socket.io'

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
      const result = {
        sinks: [
          { id: '0', description: 'Audio intern Digital Stereo (HDMI)', mute: 'no', volume: 100 }
        ],
        inputs: []
      }
      setInterval(() => {
        socket.emit('data update', result)
      }, 3000)

      socket.on('query', function(msg: any) {
        console.log('query', msg)
      })
    })

    this.server.listen(3000, () => console.log('Example app listening on port 3000!'))
  }
}
