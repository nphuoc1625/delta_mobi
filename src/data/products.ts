export type Product = {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
};

export const products: Product[] = [
    {
        id: 1,
        name: "Delta Sound Pro X1",
        category: "Headphones",
        price: 199,
        image: "/window.svg",
    },
    {
        id: 2,
        name: "Mobi Mini Speaker",
        category: "Speakers",
        price: 49,
        image: "/file.svg",
    },
    {
        id: 3,
        name: "Delta Studio Mic",
        category: "Microphones",
        price: 129,
        image: "/globe.svg",
    },
    {
        id: 4,
        name: "Mobi Bass Speaker",
        category: "Speakers",
        price: 89,
        image: "/file.svg",
    },
];

export function getProducts() {
    return products;
} 