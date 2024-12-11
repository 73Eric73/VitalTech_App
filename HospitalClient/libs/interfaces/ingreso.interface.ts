export interface Ingreso {
  id: number;
  dataEntrada: Date;
  dataSortida: Date | null;
  episodiMedicId: number;
  codiLlit: number | null;
}
