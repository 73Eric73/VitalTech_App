﻿namespace HospitalXD.Models
{
    public class Llit
    {

        public int Id { get; set; }
        public bool Ocupat { get; set; }
        
        public int IdHabitacio { get; set; }
        public Habitacio Habitacio { get; set; }

    }
}