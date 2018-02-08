new Vue({
  el: '#app',
  data: {
    pipeline: [],
    type: [
      {
        name: 'Audio Source (Input)',
        from: 'getSourceNode',
        params: [],
        style: { green: true },
      },
      {
        name: 'Audio Destination (Output)',
        from: 'getDestinationNode',
        params: [],
        style: { red: true },
      },
      {
        name: 'Lowpass filter',
        from: 'getBiquadFilterNode',
        params: ['lowpass'],
      },
      {
        name: 'Highpass filter',
        from: 'getBiquadFilterNode',
        params: ['highpass'],
      },
      {
        name: 'Bandpass filter',
        from: 'getBiquadFilterNode',
        params: ['bandpass'],
      },
      {
        name: 'Lowshelf filter',
        from: 'getBiquadFilterNode',
        params: ['lowshelf'],
        beforeUse: node => {
          node.frequency.value = 440;
          return node;
        },
      },
      {
        name: 'HighShelf filter',
        from: 'getBiquadFilterNode',
        params: ['highshelf'],
      },
      {
        name: 'Peaking filter',
        from: 'getBiquadFilterNode',
        params: ['peaking'],
      },
      { name: 'Notch filter', from: 'getBiquadFilterNode', params: ['notch'] },
      {
        name: 'Gain',
        from: 'getGainNode',
        params: [1],
      },
      {
        name: 'Delay 2s',
        from: 'getDelayNode',
        params: [200],
      },
    ],
    audioPipeline: null,
    fileReader: null,
    audioReady: false,
    audioLoading: false,
    playing: false,
  },
  template: '#app-tpl',
  mounted: function() {
    this.audioPipeline = new AudioPipeline();
    this.fileReader = new FileBufferReader(this.$refs.file, /^audio/);
    this.fileReader.bindCallback(this.loadBuffer);
  },
  methods: {
    async loadBuffer(buffer) {
      this.audioLoading = true;
      let [err, fileBuffer] = buffer;
      await this.audioPipeline.loadArrayBuffer(fileBuffer);
      this.audioReady = true;
    },
    addPipeline(index) {
      const type = this.type[index];
      this.pipeline.push(type);

      let node = this.audioPipeline[type.from].apply(
        this.audioPipeline,
        type.params
      );
      if (type.beforeUse) node = type.beforeUse(node);

      this.audioPipeline.addNode(node, this.pipeline.length, this.playing);
    },
    connect() {
      this.audioPipeline.fullConnect();
    },
    deletePipeline(index) {
      this.pipeline.splice(index, 1);
      this.audioPipeline.deleteNode(index, this.playing);
    },
    play() {
      this.audioPipeline.control('start', 0);
      this.playing = true;
    },
  },
});
