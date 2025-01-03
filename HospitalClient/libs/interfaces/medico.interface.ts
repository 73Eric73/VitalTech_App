import { EpisodiMedic } from "./episodis-medics.interface";
import { PruebaDiagnostica } from './pruebas-diagnosticas.interface';

export interface Medico {
  dni: string;
  nom: string;
  telefon: string;
  usuariId: number;
  especialitat: string;
  episodiMedics: EpisodiMedic[];
  pruebasDiagnosticas: PruebaDiagnostica[];
}
