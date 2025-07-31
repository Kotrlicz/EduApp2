import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play, Pause, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabaseClient";

interface Slide {
  id: number;
  title: string;
  content: React.ReactNode;
}

// Interactive quiz for slide 12
const Slide12Quiz: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const quizItems = [
    { sentence: "I saw ___ elephant.", answer: "an" },
    { sentence: "This is ___ best movie.", answer: "the" },
    { sentence: "Do you have ___ sugar?", answer: "any" },
    { sentence: "___ sun is bright.", answer: "The" },
    { sentence: "I have ___ friends.", answer: "some" },
  ];
  const [inputs, setInputs] = useState(Array(quizItems.length).fill(""));
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<(null | boolean)[]>(Array(quizItems.length).fill(null));

  const handleInput = (idx: number, value: string) => {
    setInputs(inputs => {
      const newInputs = [...inputs];
      newInputs[idx] = value;
      return newInputs;
    });
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setChecked(true);
    setResults(inputs.map((input, idx) => {
      return input.trim().toLowerCase() === quizItems[idx].answer.toLowerCase();
    }));
    onComplete(); // Notify parent component that quiz is completed
  };

  return (
    <form className="space-y-4" onSubmit={handleCheck}>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">Cvičení – Doplň správný člen</h2>
        <p className="text-gray-600 mb-6">Doplň správný člen nebo určovací slovo na místo "___"</p>
      </div>
      {quizItems.map((item, idx) => (
        <div
          key={idx}
          className={
            `flex flex-col md:flex-row items-center gap-2 p-4 rounded-lg ` +
            (checked
              ? results[idx]
                ? "bg-green-50"
                : "bg-red-50"
              : [
                  "bg-blue-50",
                  "bg-green-50",
                  "bg-orange-50",
                  "bg-purple-50",
                  "bg-pink-50"
                ][idx % 5])
          }
        >
          <span className="font-semibold text-lg min-w-[220px]">
            {item.sentence.split("___").map((part, i) => (
              <span key={i}>
                {part}
                {i < item.sentence.split("___").length - 1 && (
                  <input
                    className={`border rounded px-2 py-1 text-lg w-24 text-center focus:outline-none focus:ring-2 mx-1 ${
                      checked
                        ? results[idx]
                          ? "border-green-500 bg-green-100"
                          : "border-red-500 bg-red-100"
                        : "border-gray-300"
                    }`}
                    type="text"
                    value={inputs[idx]}
                    onChange={e => handleInput(idx, e.target.value)}
                    disabled={checked}
                    autoComplete="off"
                    placeholder="___"
                  />
                )}
              </span>
            ))}
          </span>
          {checked && !results[idx] && (
            <span className="ml-2 text-sm text-gray-700">Správně: <b>{item.answer}</b></span>
          )}
          {checked && results[idx] && (
            <span className="ml-2 text-green-700 font-semibold">✔️</span>
          )}
        </div>
      ))}
      {!checked && (
        <div className="flex justify-center">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 text-lg">Zkontrolovat</Button>
        </div>
      )}
      {checked && (
        <div className="flex justify-center">
          <span className="text-green-700 font-semibold">Můžeš pokračovat na další slide.</span>
        </div>
      )}
    </form>
  );
};

// Interactive quiz for slide 13
const Slide13Quiz: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const quizItems = [
    { czech: "To je moje kniha.", answer: "This is my book." },
    { czech: "Vidím psa. Ten pes je velký.", answer: "I see a dog. The dog is big." },
    { czech: "Máš nějaké jídlo?", answer: "Do you have any food?" },
    { czech: "Tato kniha je zajímavá.", answer: "This book is interesting." },
  ];
  const [inputs, setInputs] = useState(Array(quizItems.length).fill(""));
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<(null | boolean)[]>(Array(quizItems.length).fill(null));

  const handleInput = (idx: number, value: string) => {
    setInputs(inputs => {
      const newInputs = [...inputs];
      newInputs[idx] = value;
      return newInputs;
    });
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setChecked(true);
    setResults(inputs.map((input, idx) => {
      return input.trim().toLowerCase() === quizItems[idx].answer.toLowerCase();
    }));
    onComplete(); // Notify parent component that quiz is completed
  };

  return (
    <form className="space-y-4" onSubmit={handleCheck}>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">Cvičení – Překlad</h2>
        <p className="text-gray-600 mb-6">Přeložte české věty do angličtiny</p>
      </div>
      {quizItems.map((item, idx) => (
        <div
          key={idx}
          className={
            `flex flex-col gap-2 p-4 rounded-lg ` +
            (checked
              ? results[idx]
                ? "bg-green-50"
                : "bg-red-50"
              : [
                  "bg-blue-50",
                  "bg-green-50",
                  "bg-orange-50",
                  "bg-purple-50"
                ][idx % 4])
          }
        >
          <div className="font-semibold text-lg text-gray-800">
            {item.czech}
          </div>
          <input
            className={`border rounded px-3 py-2 text-lg w-full focus:outline-none focus:ring-2 ${
              checked
                ? results[idx]
                  ? "border-green-500 bg-green-100"
                  : "border-red-500 bg-red-100"
                : "border-gray-300"
            }`}
            type="text"
            value={inputs[idx]}
            onChange={e => handleInput(idx, e.target.value)}
            disabled={checked}
            autoComplete="off"
            placeholder="Napište anglický překlad..."
          />
          {checked && !results[idx] && (
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Správně:</span> <span className="text-green-600">{item.answer}</span>
            </div>
          )}
          {checked && results[idx] && (
            <div className="text-green-700 font-semibold">✔️ Správně!</div>
          )}
        </div>
      ))}
      {!checked && (
        <div className="flex justify-center">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 text-lg">Zkontrolovat</Button>
        </div>
      )}
      {checked && (
        <div className="flex justify-center">
          <span className="text-green-700 font-semibold">Můžeš pokračovat na další slide.</span>
        </div>
      )}
    </form>
  );
};

const ArticlesAndDeterminersPresentation = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const slides: Slide[] = [
    {
      id: 1,
      title: "Úvod - Articles and Determiners",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Articles and Determiners</h2>
          </div>
          <div className="space-y-4 text-lg">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Co jsou určité a neurčité členy (articles)?</h3>
              <p className="text-blue-700">Slova, která stojí před podstatnými jmény a určují, zda mluvíme o konkrétní nebo obecné věci.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Co jsou "determiners"?</h3>
              <p className="text-green-700">Slova, která stojí před podstatnými jmény a určují jejich vlastnosti (množství, vlastnictví, vzdálenost).</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">Proč jsou důležité v angličtině?</h3>
              <p className="text-orange-700">V češtině často chybí, ale v angličtině jsou nezbytné pro správné vyjádření významu.</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Cíl lekce:</h3>
              <p className="text-purple-700">Poznat a správně používat nejčastější členy a určující výrazy.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Neurčitý člen – A / An",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Neurčitý člen – A / An</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-800 text-xl mb-4">A – před souhláskami</h3>
              <div className="space-y-2">
                <p className="text-blue-700"><strong>Použití:</strong> když mluvíme o něčem poprvé nebo obecně</p>
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold">Příklady:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>a dog</li>
                    <li>a house</li>
                    <li>a teacher</li>
                    <li>a university</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold text-green-800 text-xl mb-4">An – před samohláskami</h3>
              <div className="space-y-2">
                <p className="text-green-700"><strong>Použití:</strong> když mluvíme o něčem poprvé nebo obecně</p>
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold">Příklady:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>an apple</li>
                    <li>an hour</li>
                    <li>an umbrella</li>
                    <li>an MBA</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Určitý člen – THE",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Určitý člen – THE</h2>
          </div>
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-800 text-xl mb-4">Použití:</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• Když je věc známá nebo už byla zmíněná</li>
                <li>• Když je jen jedna (the sun, the Earth)</li>
                <li>• Před superlativy: the best, the biggest</li>
              </ul>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold text-green-800 text-xl mb-4">Příklady:</h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold">I saw a dog. The dog was barking.</p>
                  <p className="text-sm text-gray-600">(Nejprve neurčitý, pak určitý člen)</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold">The moon is bright.</p>
                  <p className="text-sm text-gray-600">(Jediný měsíc)</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold">She is the best student.</p>
                  <p className="text-sm text-gray-600">(Superlativ)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Kdy se člen NEpoužívá",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Kdy se člen NEpoužívá</h2>
          </div>
          <div className="bg-red-50 p-6 rounded-lg">
            <h3 className="font-bold text-red-800 text-xl mb-4">Nepoužíváme členy:</h3>
            <ul className="space-y-3 text-red-700">
              <li>• před nepočitatelnými nebo množnými obecnými názvy (Milk is good.)</li>
              <li>• před jmény lidí (John, Mary)</li>
              <li>• ve spojeních jako: go to school, go to bed, at home</li>
            </ul>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-bold text-green-800 text-xl mb-4">Příklady:</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-semibold">I like coffee.</p>
                <p className="text-sm text-gray-600">(nepočitatelné)</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-semibold">She is at home.</p>
                <p className="text-sm text-gray-600">(ustálené spojení)</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-semibold">John is my friend.</p>
                <p className="text-sm text-gray-600">(jméno osoby)</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Ukazovací zájmena – THIS / THAT",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Ukazovací zájmena – THIS / THAT</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-800 text-xl mb-4">This – blízké věci (jednotné číslo)</h3>
              <div className="bg-white p-4 rounded">
                <p className="font-semibold mb-2">Příklady:</p>
                <ul className="space-y-1">
                  <li>This chair is comfortable.</li>
                  <li>This book is interesting.</li>
                  <li>This car is expensive.</li>
                </ul>
              </div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold text-green-800 text-xl mb-4">That – vzdálené věci (jednotné číslo)</h3>
              <div className="bg-white p-4 rounded">
                <p className="font-semibold mb-2">Příklady:</p>
                <ul className="space-y-1">
                  <li>That building is very tall.</li>
                  <li>That dog is friendly.</li>
                  <li>That tree is old.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Ukazovací zájmena – THESE / THOSE",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Ukazovací zájmena – THESE / THOSE</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-800 text-xl mb-4">These – blízké věci (množné číslo)</h3>
              <div className="bg-white p-4 rounded">
                <p className="font-semibold mb-2">Příklady:</p>
                <ul className="space-y-1">
                  <li>These books are mine.</li>
                  <li>These cars are new.</li>
                  <li>These students are smart.</li>
                </ul>
              </div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold text-green-800 text-xl mb-4">Those – vzdálené věci (množné číslo)</h3>
              <div className="bg-white p-4 rounded">
                <p className="font-semibold mb-2">Příklady:</p>
                <ul className="space-y-1">
                  <li>Those dogs are barking.</li>
                  <li>Those houses are beautiful.</li>
                  <li>Those people are waiting.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Some / Any",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Some / Any</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-800 text-xl mb-4">Some – v kladných větách</h3>
              <div className="bg-white p-4 rounded">
                <p className="font-semibold mb-2">Příklady:</p>
                <ul className="space-y-1">
                  <li>I have some water.</li>
                  <li>There are some books.</li>
                  <li>She bought some food.</li>
                </ul>
              </div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold text-green-800 text-xl mb-4">Any – v otázkách a záporu</h3>
              <div className="bg-white p-4 rounded">
                <p className="font-semibold mb-2">Příklady:</p>
                <ul className="space-y-1">
                  <li>Do you have any money?</li>
                  <li>We don't have any bread.</li>
                  <li>Is there any coffee?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "Much / Many",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Much / Many</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-800 text-xl mb-4">Much – pro nepočitatelná podst. jména</h3>
              <div className="bg-white p-4 rounded">
                <p className="font-semibold mb-2">Příklady:</p>
                <ul className="space-y-1">
                  <li>How much sugar do you need?</li>
                  <li>There isn't much time.</li>
                  <li>I don't have much money.</li>
                </ul>
              </div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold text-green-800 text-xl mb-4">Many – pro počitatelná podst. jména</h3>
              <div className="bg-white p-4 rounded">
                <p className="font-semibold mb-2">Příklady:</p>
                <ul className="space-y-1">
                  <li>There are many people here.</li>
                  <li>How many books do you have?</li>
                  <li>I don't have many friends.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: "A lot of / Lots of",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">A lot of / Lots of</h2>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-bold text-blue-800 text-xl mb-4">Použití:</h3>
            <p className="text-blue-700 mb-4">Pro velké množství, u počitatelných i nepočitatelných</p>
            <div className="bg-white p-4 rounded">
              <p className="font-semibold mb-2">Příklady:</p>
              <ul className="space-y-1">
                <li>I have a lot of friends.</li>
                <li>There is lots of noise.</li>
                <li>She has a lot of money.</li>
                <li>There are lots of cars.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 10,
      title: "My / Your / His / Her…",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Přivlastňovací zájmena</h2>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-bold text-blue-800 text-xl mb-4">Přivlastňovací zájmena:</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <p className="font-semibold">Jednotné číslo:</p>
                <ul className="space-y-1">
                  <li>my</li>
                  <li>your</li>
                  <li>his</li>
                  <li>her</li>
                  <li>its</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-semibold">Množné číslo:</p>
                <ul className="space-y-1">
                  <li>our</li>
                  <li>your</li>
                  <li>their</li>
                </ul>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="font-semibold text-green-800 mb-2">Použití: před podstatným jménem</p>
              <div className="space-y-2">
                <p>This is my bag.</p>
                <p>That is her car.</p>
                <p>Our house is big.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 11,
      title: "Shrnutí v tabulce",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Shrnutí v tabulce</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border border-gray-300 p-3 text-left font-bold">Typ výrazu</th>
                  <th className="border border-gray-300 p-3 text-left font-bold">Příklad</th>
                  <th className="border border-gray-300 p-3 text-left font-bold">Kdy použít</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">a / an</td>
                  <td className="border border-gray-300 p-3">a dog, an apple</td>
                  <td className="border border-gray-300 p-3">poprvé, neznámá věc</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">the</td>
                  <td className="border border-gray-300 p-3">the car</td>
                  <td className="border border-gray-300 p-3">známá nebo jediná věc</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">some / any</td>
                  <td className="border border-gray-300 p-3">some water / any book</td>
                  <td className="border border-gray-300 p-3">neurčité množství</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">this / that</td>
                  <td className="border border-gray-300 p-3">this book / that car</td>
                  <td className="border border-gray-300 p-3">ukazujeme 1 věc</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">these / those</td>
                  <td className="border border-gray-300 p-3">these pens / those trees</td>
                  <td className="border border-gray-300 p-3">ukazujeme víc věcí</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">my / your</td>
                  <td className="border border-gray-300 p-3">my house, your name</td>
                  <td className="border border-gray-300 p-3">přivlastnění</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 12,
      title: "Cvičení – Doplň správný člen",
      content: <Slide12Quiz onComplete={() => setQuizCompleted(true)} />
    },
    {
      id: 13,
      title: "Cvičení – Překlad",
      content: <Slide13Quiz onComplete={() => setQuizCompleted(true)} />
    },
    {
      id: 14,
      title: "Výzvy a chyby",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Výzvy a chyby</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-bold text-red-800 text-lg mb-2">Časté chyby českých mluvčích:</h3>
              <ul className="space-y-2 text-red-700">
                <li>• vynechávání článků úplně</li>
                <li>• some místo any v otázkách</li>
                <li>• much s počitatelnými slovy</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-green-800 text-lg mb-2">Oprava příkladů:</h3>
              <div className="space-y-2">
                <p><span className="text-red-600">❌</span> I have car. → <span className="text-green-600">✅</span> I have a car.</p>
                <p><span className="text-red-600">❌</span> Do you have some money? → <span className="text-green-600">✅</span> Do you have any money?</p>
                <p><span className="text-red-600">❌</span> I have much books. → <span className="text-green-600">✅</span> I have many books.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 15,
      title: "Závěr",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Závěr</h2>
          </div>
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-800 text-xl mb-4">Shrnutí hlavních bodů:</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• A/an pro neznámé věci, the pro známé</li>
                <li>• Some v kladných větách, any v otázkách a záporu</li>
                <li>• Much pro nepočitatelná, many pro počitatelná</li>
                <li>• This/that pro jednotné, these/those pro množné</li>
                <li>• Přivlastňovací zájmena před podstatnými jmény</li>
              </ul>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold text-green-800 text-xl mb-4">Doporučení pro další procvičování:</h3>
              <ul className="space-y-2 text-green-700">
                <li>• Čtěte anglické texty a všimněte si členů</li>
                <li>• Procvičujte s rodilými mluvčími</li>
                <li>• Používejte aplikace pro učení gramatiky</li>
                <li>• Pište vlastní věty s různými členy</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="mb-4 p-4 bg-green-50 rounded-lg">
                <p className="text-green-700 font-semibold">🎉 Prezentace dokončena!</p>
                <p className="text-green-600">Nyní můžete pokračovat na cvičení.</p>
              </div>
              <Button 
                onClick={async () => {
                  await markPresentationCompleted();
                  navigate("/course/grammar-fundamentals/articles-and-determiners/choose-quiz");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                Pokračovat na cvičení
              </Button>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    // Check if we're on slide 12 (index 11) or slide 13 (index 12) and quiz is not completed
    if ((currentSlide === 11 || currentSlide === 12) && !quizCompleted) {
      alert("Prosím dokončete cvičení před pokračováním.");
      return;
    }
    
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Presentation completed - mark it in the database
      markPresentationCompleted();
    }
  };

  const markPresentationCompleted = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("articles_presentation_completion")
      .upsert({
        user_id: user.id,
        presentation_name: "articles_and_determiners",
        completed_at: new Date().toISOString()
      });

    if (!error) {
      console.log("Presentation completion marked successfully");
    } else {
      console.error("Error marking presentation completion:", error);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Controls */}
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/course/grammar-fundamentals/articles-and-determiners")}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Zpět na lekci
          </Button>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? "Pauza" : "Přehrát"}
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
        </div>

        {/* Slide Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 flex-wrap justify-center">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
                  index === currentSlide
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Current Slide */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 min-h-[600px]">
            {slides[currentSlide].content}
          </div>
        </div>

        {/* Slide Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Předchozí
          </Button>
          <Button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2"
          >
            Další
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArticlesAndDeterminersPresentation; 