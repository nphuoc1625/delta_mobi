"use client";

import GroupCategoryManager from "./GroupCategoryManager";
import CategoryManager from "./CategoryManager";



export default function CategoriesView() {
    return (
        <section>
            <h2 className="text-2xl font-semibold mb-4">Manage Categories</h2>
            <div className="bg-gray-900 rounded-xl p-2 shadow border border-gray-800 text-gray-300 mb-8">
                <GroupCategoryManager />
            </div>
            <div className="bg-gray-900 rounded-xl p-8 shadow border border-gray-800 text-gray-300">
                <CategoryManager />
            </div>
        </section>
    );
} 