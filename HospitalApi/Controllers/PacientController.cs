using System.Globalization;
using System.Text;
using AutoMapper;
using HospitalApi.Data;
using HospitalApi.DTO;
using HospitalApi.Enums;
using HospitalAPI.Models;
using Microsoft.AspNetCore.Authorization;

//using EntityFrameworkCore.MySQL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalAPI.Controllers
{

    [Route("api/[controller]")]
    [Authorize(Roles = "metge, admin")]
    [ApiController]

    public class PacientController : ControllerBase
    {

        private readonly ILogger<PacientController> _logger;
        private readonly ApplicationDbContext _bbdd;
        private readonly IMapper _mapper;

        public PacientController(ILogger<PacientController> logger, ApplicationDbContext bbdd, IMapper mapper)
        {
            _logger = logger;
            _bbdd = bbdd;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<PacientReadDTO>>> GetPacients()
        {
            _logger.LogInformation("Obtenint els pacients");
            IEnumerable<Pacient> pacientList = await _bbdd.Pacients.Include("EpisodisMedics").ToListAsync();
            return Ok(_mapper.Map<IEnumerable<PacientReadDTO>>(pacientList));
        }


        [HttpGet("{id}", Name = "GetPacient")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<HabitacioReadDTO>> GetPacient(string id)
        {

            if (id.Length <= 0)
            {
                _logger.LogError("Error: dades introduïdes en format incorrecte.");
                return BadRequest("Error: dades introduïdes en format incorrecte.");
            }

            var pacient = await _bbdd.Pacients.Include("EpisodisMedics").FirstOrDefaultAsync(p => p.DNI == id);

            if (pacient == null)
            {
                _logger.LogError("Error, no existeix el pacient amb l'ID indicat.");
                return NotFound("Error, no existeix el pacient amb l'ID indicat.");
            }

            return Ok(_mapper.Map<PacientReadDTO>(pacient));

        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<PacientCreateDTO>> PostPacient([FromBody] PacientCreateDTO userPacientDTO)
        {
            if (!ModelState.IsValid){

             return BadRequest(ModelState);

            }

            if (userPacientDTO == null)
            {
                _logger.LogError("Error: dades introduïdes incorrectes.");
                return BadRequest("Error: dades introduïdes incorrectes.");
            }

            if (!CheckDNI(userPacientDTO.DNI))
            {
                _logger.LogError("Error: DNI Invalid.");
                return BadRequest("Error: DNI Invalid.");
            }

            if(!CheckTS(userPacientDTO.NumSS, userPacientDTO.Cognom1, userPacientDTO.Cognom2, userPacientDTO.BirthDay))
            {
                _logger.LogError("Error: Num SS Invalid.");
                return BadRequest("Error: Num SS Invalid.");
            }

            if (userPacientDTO.Sexe != "F" && userPacientDTO.Sexe != "M")
            {
                _logger.LogError("Error: Sexe Invalid.");
                return BadRequest("Error: Sexe Invalid.");
            }

            if (!Enum.TryParse(typeof(Nacionalidad), userPacientDTO.Nacionalidad.Replace(" ",""), true, out _))
            {
                _logger.LogError("Nacionalidad incorrecta.");
                return BadRequest("Nacionalidad incorrecta.");
            }

            var existeixAdministratiu = await _bbdd.Administratius.FirstOrDefaultAsync(p => p.Id == userPacientDTO.AdministratiuId);
            if(existeixAdministratiu==null){
                _logger.LogError("No existeix un administratiu amb aquest ID");
                return BadRequest("No existeix un administratiu amb aquest ID");
            }


            Pacient pacient = _mapper.Map<Pacient>(userPacientDTO);

            pacient.Estado = "baja";

            await _bbdd.Pacients.AddAsync(pacient);
            await _bbdd.SaveChangesAsync();

            _logger.LogInformation("Pacient afegit exitosament.");
            return CreatedAtAction(nameof(GetPacient), new { id = userPacientDTO.DNI }, userPacientDTO);

        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeletePacient(string id)
        {

            var pacient = await _bbdd.Pacients.FirstOrDefaultAsync(h => h.DNI == id);

            if (pacient == null)
            {
                _logger.LogError("Error: no existeix pacient amb l'ID indicat.");
                return NotFound("Error: no existeix pacient amb l'ID indicat.");
            }

            _bbdd.Pacients.Remove(pacient);
            await _bbdd.SaveChangesAsync();

            _logger.LogInformation("Pacient eliminat exitosament.");
            return NoContent();

        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdatePacient(string id, [FromBody] PacientUpdateDTO userPacientDTO)
        {

            if (userPacientDTO == null)
            {
                _logger.LogError("Error: no existeix pacient amb l'ID indicat o les dades introduïdes són incorrectes.");
                return BadRequest("Error: no existeix pacient amb l'ID indicat o les dades introduïdes són incorrectes.");
            }

            if(!CheckDNI(userPacientDTO.DNI)) return BadRequest("Error: DNI no correcte.");

            if (!CheckTS(userPacientDTO.NumSS, userPacientDTO.Cognom1, userPacientDTO.Cognom2, userPacientDTO.BirthDay))
            {
                _logger.LogError("Error: Num SS Invalid.");
                return BadRequest("Error: Num SS Invalid.");
            }

            if (userPacientDTO.Sexe != "F" && userPacientDTO.Sexe != "M")
            {
                _logger.LogError("Error: Sexe Invalid.");
                return BadRequest("Error: Sexe Invalid.");
            }
            var pacient = await (from p in _bbdd.Pacients where p.DNI == id select p).FirstOrDefaultAsync();

            if (pacient == null){
                _logger.LogError("No existeix un pacient amb aquest DNI.");
                return NotFound("No existeix un pacient amb aquest DNI.");
            }

            var existeixAdministratiu = await _bbdd.Administratius.FirstOrDefaultAsync(p => p.Id == userPacientDTO.AdministratiuId);
            if(existeixAdministratiu==null){
                _logger.LogError("No existeix un administratiu amb aquest ID");
                return BadRequest("No existeix un administratiu amb aquest ID");
            }

            _mapper.Map(userPacientDTO, pacient);

            _bbdd.Pacients.Update(pacient);
            await _bbdd.SaveChangesAsync();

            _logger.LogInformation("Pacient modificat exitosament.");
            return NoContent();

        }

        public static bool CheckTS(String ts, String cognom11, String cognom22, DateTime naix)
        {

            if (ts.Length != 14) return false;

            String cognom1 = RemoveAccents(cognom11);
            String cognom2 = RemoveAccents(cognom22);

            String day = naix.ToString().Substring(0, 2);
            String month = naix.ToString().Substring(3, 2);
            String year = naix.ToString().Substring(8, 2);
            String lletres;

            if (year != ts.Substring(5, 2) || month != ts.Substring(7, 2) || day != ts.Substring(9, 2)) return false;

            if(string.IsNullOrEmpty(cognom2)) {  lletres = cognom1.Substring(0, 2) + cognom1.Substring(0, 2); }
            else {  lletres = cognom1.Substring(0, 2) + cognom2.Substring(0, 2); }
            

            if (lletres.ToUpper() != ts.Substring(0, 4)) return false;
            if ((ts.Substring(4,1) != "1" && ts.Substring(4, 1) != "0") || ts.Substring(11, 2) != "00") return false;
            
            return true;

        }

        public static bool CheckDNI(string dni)
        {

            var lettersArray = "TRWAGMYFPDXBNJZSQVHLCKE".ToCharArray();

            if (dni.Length != 9) return false;

            int dniValue = 0;
            char dniLetter = char.Parse(dni.Substring(8).ToUpper());

            if (int.TryParse(dni.Substring(0, 8), out dniValue))
            {

                Dictionary<int, char> letterToNum = new Dictionary<int, char>(23);

                for (int i = 0; i < 23; i++)
                {
                    letterToNum.Add(i, lettersArray[i]);
                }

                dniValue = dniValue % 23;

                foreach (var item in letterToNum)
                {
                    if (item.Key == dniValue && item.Value == dniLetter) return true;
                }

            }
            return false;

        }
        public static string RemoveAccents(string input)
        {
            string normalized = input.Normalize(NormalizationForm.FormD);
            StringBuilder builder = new StringBuilder();

            foreach (char c in normalized)
            {
                if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                {
                    builder.Append(c);
                }
            }

            return builder.ToString().Normalize(NormalizationForm.FormC);
        }
    }
}
