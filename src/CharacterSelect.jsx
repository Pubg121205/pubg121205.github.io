import { useState } from "react";

const characters = [
  { id: "vanheil", name: "Vanheil", role: "Sát thủ", image: "/images/vanheil.png" },
  { id: "alok", name: "Alok", role: "Hỗ trợ", image: "/images/alok.png" },
  { id: "toro", name: "Toro", role: "Đỡ đòn", image: "/images/toro.png" },
  { id: "florentino", name: "Florentino", role: "Đấu sĩ", image: "/images/florentino.png" },
];

export default function CharacterSelect({ onSelect }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (char) => {
    setSelected(char.id);
    onSelect(char);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Chọn nhân vật</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {characters.map((char) => (
          <div
            key={char.id}
            className={`rounded-2xl shadow-lg p-4 bg-gray-800 hover:bg-gray-700 cursor-pointer transition-all duration-200 ${
              selected === char.id ? "ring-4 ring-blue-500" : ""
            }`}
            onClick={() => handleSelect(char)}
          >
            <img src={char.image} alt={char.name} className="w-full h-48 object-cover rounded-xl mb-4" />
            <h2 className="text-xl font-semibold">{char.name}</h2>
            <p className="text-sm opacity-70">{char.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
