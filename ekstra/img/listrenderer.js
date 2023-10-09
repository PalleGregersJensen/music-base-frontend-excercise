export class ListRenderer (list, container, itemRenderer) {
    constructor = {
        items: list,
        container: document.querySelector(container),
        itemRenderer: itemRenderer,
        render() {
            this.container.innerHTML = "";
            for ( const item of list){
                const html = this.itemRenderer.render(item);
                this.container.insertAdjacentHTML("beforeend", html);
            }
        }
    }
    return ListRenderer;
}