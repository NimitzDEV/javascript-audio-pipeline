# AudioPipeline

AudioPipeline is a simple class that wraps basic Web Audio APIs, making connect and modify AudioNodes more easily.

## Basic Usage

```javascript
// init AudioPipeline
import AudioPipeline from './AudioPipeline';
const AP new AudioPipeline();

// pass ArrayBuffer to loadArrayBuffer to init AudioContext
await AP.loadArrayBuffer(buffer);

// then, we can build up our pipeline by using addNode
// first, we should get the source as the starting point.
AP.addNode(AP.getSourceNode());
// then we add effects that we want
AP.addNode(AP.getBiquadFilterNode('lowpass'));
// .... some more awesome effects
// and finally, we put it into the destination
AP.addNode(AP.getDestinationNode());
// after that, we connect those nodes
AP.fullConnect();
// and we play it
AP.control('start', 0);
```

## APIs

loadArrayBuffer(buffer: ArrayBuffer): Promise

> this function initialize the AudioContext with ArrayBuffer

control(action: String, params: Any)

> call methods on source object

fullConnect()

> connect all nodes added using addNode method

fullDisconnect()

> disconnect all nodes

addNode(node: AudioNode [, position: Number, reconnect: Boolean])

> add a AudioNode into pipeline, if position not set, the AudioNode will add to the last.
>
> if reconnect is set to true, will reconnect the AudioNodes between the new one, this is useful when you want to add AudioNode dynamically while playing audio.

deleteNode(position: Number [, reconnect: Boolean])

> delete specify AudioNode in the pipeline, if reconnect is set to true, will reconnect AudioNodes between the deleted one, this is useful when you want to delete AudioNode dynamically while playing audio.

getNode(position: Number): AudioNode

> get specific AudioNode reference in pipeline

clearNodes()

> empty pipeline, this method will not disconnect AudioNodes, make sure to call fullDisconnect() before clearNodes()

getBiquadFilterNode(type: String): BiquadFilterNode

> Create a new BiquadFilterNode with given type

getOscillatorNode(type: String): OscillatorNode

> Create a new OscillatorNode with given type

getGainNode(gain: Number): GainNode

> Create a new GainNode with given gain value

getDelayNode(delay: Number): DelayNode

> Create a new DelayNode with given delay time

getPannerNode(): PannerNode

> Create a new PannerNode

getPeriodicWave(real: Float32Array, imag: Float32Array, constraints; Object): OscillatorNode

> Create a new OscillatorNode with given PeriodicWave settings

getDestinationNode()

> Get the audio destination

getSourceNode()

> Get the audio source

getContext()

> Get the AudioContext

## How to build

install dependencies first

`yarn install`

run build

`yarn build`