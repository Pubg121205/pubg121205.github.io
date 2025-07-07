// File: App.jsx
import { useState } from "react";
import CharacterSelect from "./CharacterSelect";
import GameScene from "./GameScene";

export default function App() {
  const [character, setCharacter] = useState(null);

  return (
    <div className="w-full h-screen overflow-hidden">
      {!character ? (
        <CharacterSelect onSelect={setCharacter} />
      ) : (
        <GameScene character={character} />
      )}
    </div>
  );
}
