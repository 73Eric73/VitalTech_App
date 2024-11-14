namespace HospitalAPI.DTO
{
    public class AdministratiuCreateDTO
    {
        public string dni {get; set;} = string.Empty;
        public string Nom {get; set;} = string.Empty;
        public int Telefon {get; set;}
        public int usuariId {get; set;}
        public string area {get; set;}
    }
}
