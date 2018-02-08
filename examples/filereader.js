class FileBufferReader {
  constructor(selectorId, typeMatch) {
    if (!selectorId) throw new Error('no such element');
    this.selector = selectorId;

    this._change = this._change.bind(this);
    this.selector.addEventListener('change', this._change);

    this.callback = null;
    this.match = typeMatch;
  }

  _change(evt) {
    if (!this.callback || !evt.target.files[0]) return;

    const FILE = evt && evt.target.files && evt.target.files[0];
    if (!FILE) return;

    if (!((this.match && FILE.type.match(this.match)) || true))
      return ['File Type Not Match', null];

    const READER = new FileReader();
    READER.onload = f => {
      this.callback([null, f.target.result]);
    };
    READER.readAsArrayBuffer(FILE);
  }

  bindCallback(func) {
    this.callback = func;
  }
}
