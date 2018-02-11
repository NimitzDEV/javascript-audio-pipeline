/**
 * AudioPipeline
 *
 * @author NimitzDEV
 * @description Simple audio pipeline build upon Web Audio API
 * @name AudioPipeline
 * @version 0.0.1
 */

export default class AudioPipeline {
  constructor() {
    this.source = null;
    this.nodes = [];
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  /**
   * Decode ArrayBuffer to audio stream and load into audio context
   * @param {ArrayBuffer} buffer
   */
  loadArrayBuffer(buffer) {
    return new Promise((resolve, reject) => {
      this.audioCtx.decodeAudioData(buffer, audioStream => {
        this.source = this.audioCtx.createBufferSource();
        this.source.buffer = audioStream;
        resolve();
      });
    });
  }

  /**
   * Call actions on source
   * @param {String} action
   * @param {Any} params
   */
  control() {
    const args = Array.prototype.slice.call(arguments);
    const action = args[0];
    args.shift(); 
    this.source[action].apply(
      this.source,
      args
    );
  }

  /**
   * Connect all nodes
   */
  fullConnect() {
    for (let i = 0; i < this.nodes.length - 1; i++) {
      this.nodes[i].connect(this.nodes[i + 1]);
    }
  }

  /**
   * Disconnect all nodes
   */
  fullDisconnect() {
    for (let i = 0; i < this.nodes.length - 1; i++) {
      this.nodes[i].disconnect(this.nodes[i + 1]);
    }
  }

  /**
   * Add new AudioNode, if reconnect set to true,
   * will reconnect AudioNodes between the new one.
   * reconnect param is useful when you playing audio.
   * @param {AudioNode} node
   * @param {Number} position
   * @param {Boolean} reconnect
   */
  addNode(node, position, reconnect = false) {
    if (reconnect && this.nodes.length) {
      position < 0 && (position = 0);
      position > this.nodes.length && (position = this.nodes.length);

      if (position !== 0 && position < this.nodes.length) {
        this.nodes[position - 1].disconnect(this.nodes[position]);
        this.nodes[position - 1].connect(node);
        node.connect(this.nodes[position]);
      }

      if (position === 0) node.connect(this.nodes[0]);

      if (position === this.nodes.length)
        this.nodes[this.nodes.length - 1].connect(node);
    }

    if (typeof position !== 'number') position = this.nodes.length;
    return this.nodes.splice(position, 0, node);
  }

  /**
   * Delete a specific AudioNode, if reconnect set to true,
   * will reconnect AudioNodes between the deleted one.
   * reconnect param is useful when you playing audio.
   * @param {*} position
   * @param {*} reconnect
   */
  deleteNode(position, reconnect = false) {
    if (typeof position !== 'number') return false;
    if (position > this.nodes.length - 1) return false;

    if (reconnect && this.nodes.length > 1) {
      position < 0 && (position = 0);

      if (position !== 0 && position < this.nodes.length - 1) {
        this.nodes[position].disconnect(this.nodes[position + 1]);
        this.nodes[position - 1].disconnect(this.nodes[position]);
        this.nodes[position - 1].connect(this.nodes[position + 1]);
      }

      if (position === 0) this.nodes[0].disconnect(this.nodes[1]);
      if (position === this.nodes.length - 1)
        this.nodes[position - 1].disconnect(this.nodes[position]);
    }

    return this.nodes.splice(position, 1);
  }

  /**
   * Switch the position of two AudioNodes, if reconnect set to true
   * will reconnect AudioNodes between those two AudioNodes.
   * reconnect param is useful when you playing audio.
   * @param {Number} from
   * @param {Number} to
   * @param {Boolean} reconnect
   */
  switchNodes(from, to, reconnect = false) {
    if (typeof from !== 'number' || typeof to !== 'number') return false;
    if (from > this.nodes.length - 1 || to > this.nodes.length - 1)
      return false;

    from < 0 && (from = 0);
    to < 0 && (to = 0);

    const switchFromNode = this.deleteNode(from, reconnect);
    const switchToNode = this.deleteNode(to, reconnect);

    if (from > to) {
      this.addNode(switchFromNode[0], to, reconnect);
      this.addNode(switchToNode[0], from, reconnect);
    } else {
      this.addNode(switchToNode[0], from, reconnect);
      this.addNode(switchFromNode[0], to, reconnect);
    }

    return false;
  }

  /**
   * Get specific AudioNode reference in AudioNode list
   * @param {Number} position
   */
  getNode(position) {
    position = position < 0 ? 0 : position;
    return this.nodes[position];
  }

  /**
   * Clear all AudioNodes in lists
   * this function will not disconnect the AudioNode.
   */
  clearNodes() {
    this.nodes = [];
  }

  /**
   * Create a new BiquadFilterNode
   * @param {String, Number} type
   */
  getBiquadFilterNode(type) {
    const bf = this.audioCtx.createBiquadFilter();
    bf.type = type;
    return bf;
  }

  /**
   * Create a new OscillatorNode
   * @param {String} type
   */
  getOscillatorNode(type) {
    const on = this.audioCtx.createOscillator();
    on.type = type || 'sine';
    return on;
  }

  /**
   * Create a new GainNode
   * @param {Number} gain
   */
  getGainNode(gain) {
    gain = gain || 0;
    const g = this.audioCtx.createGain();
    g.gain.value = gain;
    return g;
  }

  /**
   * Create a new DelayNode
   * @param {Number} delay
   */
  getDelayNode(delay) {
    delay = delay || 0;
    const d = this.audioCtx.createDelay();
    d.delayTime.value = delay;
    return d;
  }

  /**
   * Create a new PannerNode
   */
  getPannerNode() {
    return this.audioCtx.createPanner();
  }

  /**
   * Create a new OscillatorNode with PeriodicWave
   * @param {Float32Array} real
   * @param {Float32Array} imag
   * @param {Object} constraints
   */
  getPeriodicWave(real, imag, constraints = {}) {
    const o = this.audioCtx.createOscillator();
    const wave = this.audioCtx.createPeriodicWave(real, imag, constraints);
    o.setPeriodicWave(wave);
    return o;
  }

  /**
   * Create a new WaveShaperNode
   */
  getWaveShaperNode() {
    return this.audioCtx.createWaveShaper();
  }

  /**
   * Get the DestinationNode
   */
  getDestinationNode() {
    return this.audioCtx.destination;
  }

  /**
   * Get the SourceNode
   */
  getSourceNode() {
    return this.source;
  }

  /**
   * Get the AudioContext
   */
  getContext() {
    return this.audioCtx;
  }
}
