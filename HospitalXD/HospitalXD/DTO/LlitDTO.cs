using System.ComponentModel.DataAnnotations;
using HospitlaXD.DTO;

namespace HospitlaXD.DTO
{

    public class Llit
    {

        [Required]
        int Id { get; set; }

        [Required]
        int NumHabitacio { get; set; }

        bool Estat { get; set; }


    }

}