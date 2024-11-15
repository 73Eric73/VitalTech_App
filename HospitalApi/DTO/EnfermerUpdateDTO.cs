using System.ComponentModel.DataAnnotations;
using HospitalAPI.Models;

namespace HospitalAPI.DTO
{
    public class EnfermerUpdateDTO
    {
        
        //[RegularExpression(@"^[0-9]{8}[A-Z]$", ErrorMessage = "Error format DNI.")]
        [DNIrestriction]
        public string DNI { get; set; } = string.Empty;
        [Required]
        public string Nom { get; set; } = string.Empty;
        //[PhoneAttribute(ErrorMessage = "Error format Telefon")] 
        [RegularExpression(@"^[0-9]{9}$", ErrorMessage = "Error format Telefon")]
        public int Telefon { get; set; }
        public string EnfermerEspecialitat { get; set; } = string.Empty;

    }
}
