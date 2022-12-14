import * as uuid from 'uuid';

export class Item {
    name: string;
    uId: string;
    children: Item[];
    position: number;
    url: string;
    title: string;

    constructor(options: {
        name: string,
        children?: Item[],
        position?: number,
        url: string,
        title: string
    }) {
        this.name = options.name;
        this.uId = uuid.v4();
        this.children = options.children || [];
        this.position = options.position || 1;
        this.url = options.url;
        this.title = options.title;
    }
}
