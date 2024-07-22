﻿using HospitalAPI.Models;


namespace HospitalAPI.DTO
{
    public class IngresDTO

    {
        public int Id { get; set; }

        public DateTime DataEntrada { get; set; }

        public DateTime DataSortida { get; set; }
        
        public int EpisodiMedicId { get; set; }

        public int LlitId { get; set; }
       

    }
}