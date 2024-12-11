export interface PruebaDiagnostica {
  id: number;
  dniMetge: string;
  dniEnfermer: string;
  episodiMedicId: number;
  dolencia: string;
  pruebas: string;
  resultados: string;
  correcta: boolean;
}
