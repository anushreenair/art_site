import type { ArtCategory } from '../types/content';

type Props = { categories: ArtCategory[]; onSelect: (category: ArtCategory) => void };

export function CategoryPicker({ categories, onSelect }: Props) {
  const surprise = () => onSelect(categories[Math.floor(Math.random() * categories.length)]);
  return <div className="category-picker">
    <div className="category-grid">
      {categories.map((category) => <button className="category-card" key={category.id} onClick={() => onSelect(category)}>
        <img src={category.imageUrl} alt={category.alt} loading="lazy" /><span>{category.label}</span>
      </button>)}
    </div>
    <button className="surprise-button" onClick={surprise}><span>✦</span> Surprise Me</button>
  </div>;
}
