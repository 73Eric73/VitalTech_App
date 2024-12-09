import { EpisodiMedic } from "../../../../../libs/interfaces/episodis-medics.interface";
import { PruebaDiagnostica } from './pruebas-diagnosticas.interface';

export interface Enfermero {
  dni: string;
  nom: string;
  telefon: number;
  usuariId: string;
  especialitat: string;
  pruebasDiagnosticas: PruebaDiagnostica[];
}
