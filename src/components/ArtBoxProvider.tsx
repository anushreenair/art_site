import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { defaultOwnedMaterials } from '../lib/artBox';

type ArtBoxContextValue = { ownedMaterials: string[]; toggleMaterial: (material: string) => void };
const ArtBoxContext = createContext<ArtBoxContextValue | null>(null);

export function ArtBoxProvider({ children }: { children: ReactNode }) {
  const [ownedMaterials, setOwnedMaterials] = useState(defaultOwnedMaterials);
  const value = useMemo(() => ({ ownedMaterials, toggleMaterial: (material: string) => setOwnedMaterials((owned) => owned.includes(material) ? owned.filter((item) => item !== material) : [...owned, material]) }), [ownedMaterials]);
  return <ArtBoxContext.Provider value={value}>{children}</ArtBoxContext.Provider>;
}

export function useArtBox() {
  const value = useContext(ArtBoxContext);
  if (!value) throw new Error('useArtBox must be used inside ArtBoxProvider');
  return value;
}
