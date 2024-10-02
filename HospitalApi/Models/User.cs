using System.ComponentModel.DataAnnotations;

namespace HospitalAPI.Models
{
    public class User
    {

        [Key]        
        public int Id { get; set; }

        [Required]
        public string Username { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

    }
}
