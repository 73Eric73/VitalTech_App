using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

public class TELEFONrestriction : ValidationAttribute
{

    public TELEFONrestriction(string errorMessage = "El DNI debe contener 8 dígitos seguidos de una letra mayúscula.")
    {
        ErrorMessage = errorMessage;
    }
    public string TELEFON { get; }

    public string GetErrorMessage() => ErrorMessage;

    // Expresiones regulares de validación de teléfonos
    private readonly string[] expresions = {
    @"^\d{9}$",                       /** TEST eliminar en versio final **/
    @"^\+34\d{9}$",                   // Prefijo internacional con '+' sin espacios (Ej: +34612345678)
    @"^0034\d{9}$",                   // Prefijo internacional con '0034' sin espacios (Ej: 0034612345678)
    @"^\+34 \d{3} \d{3} \d{3}$",      // Prefijo internacional con '+' y espacios (Ej: +34 612 345 678)
    @"^0034 \d{3} \d{3} \d{3}$",      // Prefijo internacional con '0034' y espacios (Ej: 0034 612 345 678)
    @"^\d{3} \d{3} \d{3}$",           // Sin prefijo, pero con espacios (Ej: 612 345 678)
    @"^\(\+34\)\d{9}$",               // Prefijo en formato (+34) sin espacios (Ej: (+34)612345678)
    @"^\(\+34\) \d{3} \d{3} \d{3}$"   // Prefijo en formato (+34) con espacios (Ej: (+34) 612 345 678)
};

    // Retorna true si coincide alguna expresion, de lo contrario retorna false
    private bool ComprovaValidadors(string telefon)
    {

        foreach (string exspresio in expresions)
        {

            if (Regex.IsMatch(telefon, exspresio))
            {

                return true;

            }

        }

        return false;

    }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {

        if (value is string telefon)
        {

            if (!ComprovaValidadors(telefon))
            {

                return new ValidationResult("El telefon no te un format valid. Ex: (+34) 612 345 678");

            }

        }

        return ValidationResult.Success;
    }


}