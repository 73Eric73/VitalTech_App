using System.ComponentModel.DataAnnotations;
using HospitalAPI.Models;

namespace HospitalAPI.DTO
{
    public class AdministradorSistemaUpdateDTO
    {
        [DNIrestriction]
        public string DNI {get; set;} = string.Empty;
        [Required]
        public string Nom {get; set;} = string.Empty;
        [TELEFONrestriction]
        public int Telefon {get; set;}
        public int UsuariId { get; set; }
        [Required]
        public string Hobby { get; set; } = string.Empty;
    }
}