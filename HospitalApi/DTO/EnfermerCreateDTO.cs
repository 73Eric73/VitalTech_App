using System.ComponentModel.DataAnnotations;
using HospitalAPI.Models;

namespace HospitalAPI.DTO
{
    public class EnfermerCreateDTO
    {
        // [Required]
        [RegularExpression(@"^[0-9]{8}[A-Z]$", ErrorMessage = "Error format DNI.")]
        // [DNIrestriction]
        public string DNI { get; set; } = string.Empty;
        [Required]
        public string Nom { get; set; } = string.Empty;
        [Required]
        //[PhoneAttribute(ErrorMessage = "Error format Telefon")] 
        [RegularExpression(@"^[0-9]{9}$", ErrorMessage = "Error format Telefon")]
        public int Telefon { get; set; }
        [Required]
        public string EnfermerEspecialitat { get; set; } = string.Empty;
        public int UsuariId { get; set; }

    }
}
