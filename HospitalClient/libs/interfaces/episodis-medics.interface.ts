import { PruebaDiagnostica } from './pruebas-diagnosticas.interface';
import { Ingreso } from './ingreso.interface';

export interface EpisodiMedic {
  id: number;
  dataObertura: string;
  dataTancament: string;
  motivo: string;
  urgencia: string;
  recepta: string;
  estat: string;
  dniPacient: string;
  dniMetge: string;
  pruebasDiagnosticas: PruebaDiagnostica[];
  ingresos: Ingreso[];
}
