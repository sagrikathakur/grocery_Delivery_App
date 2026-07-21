import React from 'react';

interface FilterPanelProps {
  categories: { slug: string; name: string }[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <aside className="w-full lg:w-64 bg-white p-5 rounded-2xl border border-zinc-200 shrink-0">
      <h2 className="text-lg font-semibold text-zinc-900 mb-4">Categories</h2>
      <div className="flex flex-col gap-1.5">
        <button
          onClick={() => onSelectCategory("all")}
          className={`w-full text-left px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            selectedCategory === "all"
              ? "bg-green-600 text-white"
              : "text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onSelectCategory(cat.slug)}
            className={`w-full text-left px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              selectedCategory === cat.slug
                ? "bg-green-600 text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default FilterPanel;
