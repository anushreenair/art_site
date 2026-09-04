import { AppShell } from '../components/AppShell';
import { useArtBox } from '../components/ArtBoxProvider';
import { artBoxCategories, artBoxMaterials } from '../lib/artBox';

export function ArtBoxPage() {
  const { ownedMaterials, toggleMaterial } = useArtBox();
  const paintCount = artBoxMaterials.filter((item) => item.category === 'Paint Colours' && ownedMaterials.includes(item.name)).length;
  return <AppShell><section className="art-box"><header className="art-box-hero"><div><p className="eyebrow">Your material library</p><h1>My Art Box</h1><p>Keep a loose record of what is already on your shelf. We’ll use it to make practice suggestions more useful.</p></div><aside><p className="eyebrow">Active set</p><strong>My Watercolour Box</strong><span>{paintCount} paint colours ready</span></aside></header><section className="art-box-intro"><p><span>✦</span> Tick what you have. Nothing here is a shopping list.</p><small>{ownedMaterials.length} materials in your studio</small></section><div className="art-box-grid">{artBoxCategories.map((category) => <section key={category}><header><h2>{category}</h2><span>{artBoxMaterials.filter((item) => item.category === category && ownedMaterials.includes(item.name)).length} owned</span></header><div className="material-list">{artBoxMaterials.filter((item) => item.category === category).map((material) => <label key={material.name}><input type="checkbox" checked={ownedMaterials.includes(material.name)} onChange={() => toggleMaterial(material.name)} /><span>{material.name}</span></label>)}</div></section>)}</div></section></AppShell>;
}
