import * as http from 'http';

import * as express from 'express';
import * as SocketIO from 'socket.io';

import { Pactl } from './pactl';

export class PAServer {
  public readonly app: express.Application;
  private readonly server: http.Server;
  private readonly io: SocketIO.Server;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = SocketIO(this.server);
    this.listen();
  }

  private listen(): void {
    this.app.get('/', (req: any, res: any) => res.redirect('/index.html'));
    this.app.use(express.static('dist/client'));

    this.io.on('connection', (socket: any) => {
      console.log('a user connected');

      this.sendData(socket);

      setInterval(() => {
        this.sendData(socket);
      }, 3000);

      socket.on('query', (msg: any) => {
        (async () => {
          let panel = new Pactl();
          await panel.ready;
          if (msg.id !== undefined) {
            if (msg.volume) {
              await panel.setVolume(msg.id, msg.volume);
            }
            if (msg.mute !== undefined) {
              await panel.setMute(msg.id, msg.mute);
            }
            if (msg.sink !== undefined) {
              await panel.move(msg.id, msg.sink);
            }
            // unset($panel);
            panel = new Pactl();
            await panel.ready;
          }

          socket.emit('data update', panel.getData());
        })();
      });
    });

    this.server.listen(8000, () => {
      console.log('Example app listening on port 8000!');
    });
  }

  private sendData(socket: any): void {
    (async () => {
      const panel = new Pactl();
      await panel.ready;
      socket.emit('data update', panel.getData());
    })();
  }
}
