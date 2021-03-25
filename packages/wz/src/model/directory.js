class Directory {
  constructor(name, parent) {
    this.node = new Node(name, parent);
    this.dirs = [];
    this.images = [];
  }
}