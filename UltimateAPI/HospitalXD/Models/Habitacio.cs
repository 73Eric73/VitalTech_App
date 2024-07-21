﻿/*

 Aquesta classe es un model, un model es una clase que ens serveix
per carrega dades de 
 
 */

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalXD.Models
{
    public class Habitacio
    {

        [Key]        
        public int Id { get; set; }

        [Required]
        public int Num_llits { get; set; }

        public int Capacitat { get; set; }

        [ForeignKey("PlantaId")]
        public int PlantaId { get; set; }
       

        public Planta Planta { get; set; }

        public ICollection<Llit> Llits { get; set; }

    }
}
