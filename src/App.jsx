import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import './App.css'



const App = () => {
  
const [input, setInput] = useState("");

const [score, setScore] = useState(0);

const [result, setResult] = useState("");

const [usedValues, setUsedValues] = useState([]);

const [point, setPoint] = useState(0);

const bonusPoint = useRef(new Audio(`${import.meta.env.BASE_URL}bonus_point.mp3`));
const malusPoint = useRef(new Audio(`${import.meta.env.BASE_URL}malus_point.wav`));
const gameOver = useRef(new Audio(`${import.meta.env.BASE_URL}game_over_score.mp3`));
const success = useRef(new Audio(`${import.meta.env.BASE_URL}success_score.mp3`));

const cleanInputString = (str) => {
  const regex = /[^a-zA-ZÀ-ÿ\s]/g;
  return str.replace(regex, "").toLowerCase().replace(/\s+/g, "");
}

const invertedString = (str) => {
  let inverted = "";
  for (let i = str.length - 1; i >= 0; i--) {
  inverted += str[i];
  }
  return inverted;
}

const strPal = (str) => {
  const string = cleanInputString(str);
  const reversed = invertedString(string);
  return string === reversed; 
}

//No special character
const noSpeChar = (str) => {
  const regex = /[^a-zA-ZÀ-ÿ\s]/;
  return regex.test(str);
}

// Vérifie si la chaîne est composée d'un seul caractère répété
const oneCharPal = (str) => {
  return /^([\w\s-])\1*$/.test(str);  
}

//No short value
const noShortChar = (str) => {
  const shortCharRegex = /\b(\w{2,3})\1{2,}\b/i;   // Vérifie si la chaîne contient un mot court répété trois fois ou plus
  const repeatCharRegex = /(\w{2})\1+/; // Vérifie si deux caractères consécutifs sont répétés
  const longCharRegex = /(.)\1{2,}/i;  // Vérifie si un caractère est répété plus de deux fois
  return shortCharRegex.test(str) || repeatCharRegex.test(str) || longCharRegex.test(str); 
}


//score and points attribution
const scoreLengthPoint = () => {

const cleanInput = cleanInputString(input);

      if (strPal(cleanInput)) {
        setResult(`${input} est un palindrome`); /* result.textContent = `${textInput.value} est un palindrome`; */
        bonusPoint.current.play();
        if (cleanInput.length >= 15){
        setScore(prev => prev + 5); /* score += 1; */
        setPoint(5);
      } else if (cleanInput.length <= 3) {
        setScore(prev => prev + 1);
        setPoint(1)
      } else {
        setScore(prev => prev + 3);
        setPoint(3)
      }

      bonusAudio.muted = false;
      playAudio(bonusAudio);
      } else {
      setResult(`${input} n'est pas un palindrome`);
      malusPoint.current.play();
      setScore(prev => prev - 10); /* score -= 10 */
      setPoint(-10)
      malusAudio.muted = false;
      playAudio(malusAudio);
  }
  
      
    }

// palindrome checker
const palCheck = () => {
  
const cleanInput = cleanInputString(input);

setInput("");  // Réinitialise le champ de saisie pour une nouvelle valeur

  if (!input){
  alert("Veuillez indiquer une valeur");
  return;
} if (noSpeChar(input)){
  alert("Veuillez n'utiliser que des lettres.");
  return;
} if (oneCharPal(cleanInput)){
  alert("La valeur ne doit pas être composée que d'un seul et même caractère. Essayez-en une autre.");
  return;
}  if (noShortChar(cleanInput)){
  alert("La valeur ne doit pas contenir de courts motifs répétitifs ou des lettres excessivement répétées. Essayez-en une autre.");
  return;
} if (cleanInput.length > 25) {
  alert("La valeur ne doit pas dépasser 25 caractères.");
  return;
} if (usedValues.includes(cleanInput)) {
  alert("Cette valeur a déjà été utilisée. Essayez-en une autre.");
  return;
}
  
  setUsedValues([...usedValues, cleanInput]); //usedValues.push(cleanInputString(input).toLowerCase()); // Ajoute la valeur au tableau usedValues
  scoreLengthPoint(); 

 };


  const restart = () => {
  window.location.reload();
};

  useEffect(() => {
    if (score <= -50) {
      document.body.style.background = "#bd2828";
      gameOver.current.play();
    }
    if (score >= 20) {
      document.body.style.background = "#ffda05";
      success.current.play();
    }
  }, [score])

  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === "Enter") {
        palCheck();
      }
    };
    
    document.addEventListener("keydown", handleEnter);

    // Nettoyage quand le composant se démonte
    return () => {
      document.removeEventListener("keydown", handleEnter)
    };
  }, [palCheck]);
  


  
// Application
 return (
  <div>
    <p id="score-end">{(score <= -50 && "Game Over") || (score >= 20 && "Success!")}</p>
    <p id="score-point" key={score} style={{
      display: point === 0 ? "none" : "block",
      color: (point === -10 && "rgb(202, 38, 71)") || (point === 3 && "rgb(250, 236, 31)") || (point === 5 && "rgb(42, 238, 42)")
    }}>{point}</p>
    <h1><img src="react.svg"></img>Palindrome Checker</h1>
    <div className="palindrome">
      <p id="question-title" style={{marginBottom: "20px"}}>Est-ce un palindrome ?</p>
      <label htmlFor="text-input">

      

      <input type="text" 
      id="text-input" 
      value={input} 
      onChange={(e) => setInput(e.target.value)} 
      name="text-input" 
      placeholder="exemple: kayak"
      style={{
        display: (score <= -50 || score >= 20) ? "none" : "block"
      }}/>
      </label>

      <button 
      required 
      id="check-btn" 
      onClick={palCheck} 
      style={{
        display: (score <= -50 || score >= 20) ? "none" : "block"
      }}>
        Check
      </button>

    

      <p id="result">{result}</p>
    </div>
    <div id="score-result" 
    style={{
      display : score ? "block" : "none",
      backgroundColor: score > 0 ? "rgb(42, 238, 42)" : "rgb(202, 38, 71)"
    }}>     
      <div>       
          {(score <= -50 || score >= 20) && (
            <p id="restart-text" onClick={restart}>Restart</p>
          )} 
          <p>SCORE: {score}</p>
      </div>
    </div>
    <div className="info" 
    style={{
        display: (score <= -50) || (score >= 20) ? "none" : "block"
      }}>
      <p>💡Un <span>palindrome</span> est un mot, une phrase ou une séquence qui se lit de la même manière dans les deux sens.</p>
    </div>
  </div>
 )
}

export default App
