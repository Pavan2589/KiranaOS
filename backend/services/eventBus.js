// services/eventBus.js
// Redis Pub/Sub - publisher and subscriber are separate connections (ioredis requirement)
const Redis = require('ioredis');
const EventEmitter = require('events');

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50);
    this._log = [];
    this._connected = false;

    try {
      this.pub = new Redis(process.env.REDIS_URL, { lazyConnect: true, connectTimeout: 2000 });
      this.sub = new Redis(process.env.REDIS_URL, { lazyConnect: true, connectTimeout: 2000 });

      Promise.all([this.pub.connect(), this.sub.connect()])
        .then(() => {
          this._connected = true;
          console.log('[EventBus] Redis connected ✓');
          this.sub.subscribe(
            'order:new', 'order:accepted', 'order:rejected',
            'order:delivered', 'order:noStore', 'store:status', 'order:update'
          );
          this.sub.on('message', (channel, message) => {
            try {
              const payload = JSON.parse(message);
              this.emit(channel, payload);
            } catch (e) {}
          });
        })
        .catch(() => {
          console.warn('[EventBus] Redis unavailable — falling back to in-process EventEmitter');
          this._connected = false;
        });
    } catch (e) {
      console.warn('[EventBus] Redis init failed — in-process mode');
    }
  }

  publish(channel, payload) {
    const event = { channel, payload, ts: new Date().toISOString() };
    this._log.unshift(event);
    if (this._log.length > 200) this._log.pop();

    if (this._connected) {
      this.pub.publish(channel, JSON.stringify(payload)).catch(() => {});
    }
    // Always emit locally (covers non-Redis fallback AND same-process subscribers)
    this.emit(channel, payload);
  }

  getLog() { return this._log.slice(0, 50); }
}

module.exports = new EventBus();
