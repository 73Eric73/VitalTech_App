﻿using HospitalAPI.Models;

namespace HospitalApi.DTO
{
    public class MetgeCreateDTO
    {

        public string DNI { get; set; } = string.Empty;

        public string Nom { get; set; } = string.Empty;

        public int Telefon { get; set; }

        public string Especialitat { get; set; } = string.Empty;

        public string UsuariId { get; set; } = string.Empty;



    }
}
