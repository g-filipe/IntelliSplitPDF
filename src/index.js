import { green, red } from "yoctocolors";
import { colaboradores } from "./colaboradores.js";
import fs from "fs"

const filePath = "src/input/contracheques.pdf"

const fileContent = fs.readFileSync(filePath).toString()

for (const colaborador of colaboradores) {
  if (fileContent.includes(colaborador.toUpperCase())) {
    console.log(`O(a) Colaborador(a) ${colaborador} ${green('consta no arquivo de contracheques')}`)
  } else {
    console.log(`O(a) Colaborador(a) ${colaborador} ${red('não consta no arquivo de contracheques')}`)
  }
}

