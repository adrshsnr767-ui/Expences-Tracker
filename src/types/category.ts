export type Category = {
    _id: string;
    user: string;
    name: string;
    createdAt: string;
    updatedAt: string;
};

export type CategoriesResponse = {
    data: Category[];
};