namespace HospitalAPI.DTO
{
    public class AdministratiuUpdateDTO
    {
        public string DNI { get; set; } = string.Empty;
        public string Nom { get; set; } = string.Empty;
        public int Telefon { get; set; }
        public int UsuariId { get; set; }
    }
}