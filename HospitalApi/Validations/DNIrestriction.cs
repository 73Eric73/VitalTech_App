using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using MySqlX.XDevAPI.Common;

public class DNIrestriction : ValidationAttribute
{

    // Taula de lletres del alfabet per validació DNI
    private static readonly char[] digitControl = { 'T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E' };

    public DNIrestriction(string errorMessage = "El DNI debe contener 8 dígitos seguidos de una letra mayúscula.")
    {
        ErrorMessage = errorMessage;
    }
    public string DNI { get; }

    public string GetErrorMessage() => ErrorMessage;

    // Devuelve true si el digito de control es correcto false si es incorrecto
    private bool valDigitControl(int num, char control)
    {

        var controlCalc = num % 23;



        if (digitControl[controlCalc - 1] != control)
        {

            return false;

        }

        return true;

    }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {

        // Restriccions
        const string format = @"^\d{8}[A-Z]$";
        const string longNum = @"^\d{8}";
        const string controlDig = @"[A-Z]";

        if (value is string dni)
        {

            // Valida el format
            if (!Regex.IsMatch(dni, format))
            {

                return new ValidationResult("El formato del DNI no es válido. Debe contener 8 dígitos seguidos de una letra.");

            }

            // Recupera numero
            var numerosDni = int.Parse(Regex.Match(dni, longNum).Value);

            // Recupero digit de control
            var digitControl = char.Parse(Regex.Match(dni, controlDig).Value);


            if (!valDigitControl(numerosDni, digitControl))
            {

                return new ValidationResult("El DNI es incorrecto.");

            }

        }

        return ValidationResult.Success;

    }

}
