﻿namespace HospitalXD.Models
{
    public class Pacient
    {

        public int Id { get; set; }

        public int NumSS { get; set; }

        public string Nom { get; set; }

        public string Estat { get; set; }

        public string Sexe { get; set; }

        public ICollection<Consulta> Consultes { get; set; }

        public ICollection<EpisodiMedic> EpisodiMedic { get; set; }

    }
}