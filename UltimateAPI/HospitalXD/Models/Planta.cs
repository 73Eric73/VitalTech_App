﻿namespace HospitalXD.Models
{
    public class Planta
    {

        public int Id { get; set; }

        public int NumHabs { get; set; }

        public ICollection<Habitacio> Habitacions { get; set; }

    }
}