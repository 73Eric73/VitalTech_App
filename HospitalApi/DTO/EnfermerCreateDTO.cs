using System.ComponentModel.DataAnnotations;
using HospitalAPI.Models;

namespace HospitalAPI.DTO
{
    public class EnfermerCreateDTO
    {
        
        [DNIrestriction]
        public string DNI { get; set; } = string.Empty;
        [Required]
        public string Nom { get; set; } = string.Empty;
        [TELEFONrestriction]
        public int Telefon { get; set; }
        [EnfermerEspecRestrict]
        public string EnfermerEspecialitat { get; set; } = string.Empty;
        public int UsuariId { get; set; }

    }
}
