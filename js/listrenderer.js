export class ListRenderer {
  constructor(list, container, itemRenderer) {
    this.items = list;
    this.container = document.querySelector(container);
    this.itemRenderer = itemRenderer;
  }

  render() {
    this.container.innerHTML = "";
    for (const item of this.items) {
      const html = this.itemRenderer.render(item);
      this.container.insertAdjacentHTML("beforeend", html);
    }
  }
}
