using System.ComponentModel.DataAnnotations;

public class EnfermerEspecRestrict : ValidationAttribute
{

    public EnfermerEspecRestrict(string errorMessage = "El DNI debe contener 8 dígitos seguidos de una letra mayúscula.")
    {
        ErrorMessage = errorMessage;
    }
    public string ESPECIALITATenfermer { get; }

    public string GetErrorMessage() => ErrorMessage;

    // Array de especialidades de enfermería sin la palabra "Enfermería"
    private readonly string[] especialidades = {
    "Médico-Quirúrgica",
    "Pediátrica",
    "Obstétrico-Ginecológica",
    "Geriátrica",
    "Psiquiátrica y de Salud Mental",
    "Comunitaria y de Salud Pública",
    "Cuidados Intensivos",
    "Urgencias y Emergencias",
    "Oncológica",
    "Neonatal",
    "Rehabilitación",
    "Escolar",
    "Trabajo",
    "Anestesia y Recuperación",
    "Cuidados Paliativos",
    "Nefrológica y Diálisis",
    "Salud Reproductiva y Planificación Familiar",
    "Investigación Clínica",
    "Forense",
    "Gestión y Administración",
    "Educación para la Salud",
    "Salud del Viajero",
    "Medicina Interna",
    "Cardiológica",
    "Respiratoria",
    "Dermatológica",
    "Endocrinológica",
    "Neurológica",
    "Cuidados Perioperatorios",
    "Salud Ocupacional",
    "Holística",
    "Cuidados Domiciliarios"
};

    // Retorna true si coincide alguna expresion, de lo contrario retorna false
    private bool ComprovaLlista(string especialidad)
    {

        foreach (string especialidadLlista in especialidades)
        {

            if (especialidad == especialidadLlista)
            {

                return true;

            }

        }

        return false;

    }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {

        if (value is string especialitat)
        {

            if (ComprovaLlista(especialitat))
            {

                return new ValidationResult("La especialitat no existeix.");

            }
        }

        return ValidationResult.Success;

    }


}