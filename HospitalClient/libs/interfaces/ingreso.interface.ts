export interface Ingreso {
  id: number;
  //IdPaciente: number;
  //IdMedico: number;
  //Motivo: string;
  //FechaSolicitud: Date;
  dataEntrada: Date;
  //Estado: string;
  //TipoCama: string;
  dataSortida: Date | null;
  episodiMedicId: number;
  codiLlit: number | null;
}
