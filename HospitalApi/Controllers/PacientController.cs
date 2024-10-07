using AutoMapper;
using HospitalApi.Data;
using HospitalApi.DTO;
using HospitalAPI.DTO;
using HospitalAPI.Models;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalAPI.Controllers
{

    [Route("api/[controller]")]
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
        public async Task<ActionResult<IEnumerable<PacientDTO>>> GetPacients()
        {

            _logger.LogInformation("Obtenint els pacients");

            IEnumerable<Pacient> pacientList = await _bbdd.Pacients.Include("EpisodisMedics").ToListAsync();

            return Ok(_mapper.Map<IEnumerable<PacientDTO>>(pacientList));

        }


        [HttpGet("{id}", Name = "GetPacient")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<HabitacioDTO>> GetPacient(string id)
        {

            if (id.Length <= 0)
            {
                _logger.LogError("Error: dades introduïdes en format incorrecte.");
                return BadRequest("Error: dades introduïdes en format incorrecte.");
            }

            var pacient = await _bbdd.Pacients.FirstOrDefaultAsync(h => h.DNI == id);

            if (pacient == null)
            {
                _logger.LogError("Error, no existeix el pacient amb l'ID indicat.");
                return NotFound("Error, no existeix el pacient amb l'ID indicat.");
            }

            return Ok(_mapper.Map<PacientDTO>(pacient));

        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<PacientCreateDTO>> PostPacient([FromBody] PacientCreateDTO userPacientDTO)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

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

            if(CheckTS(userPacientDTO.NumSS))
            {
                _logger.LogError("Error: Num SS Invalid.");
                return BadRequest("Error: Num SS Invalid.");
            }

            if (userPacientDTO.Sexe != "F" && userPacientDTO.Sexe != "M")
            {
                _logger.LogError("Error: Sexe Invalid.");
                return BadRequest("Error: Sexe Invalid.");
            }

            Pacient pacient = _mapper.Map<Pacient>(userPacientDTO);

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
        public async Task<IActionResult> UpdatePacient(string id, [FromBody] PacientCreateDTO userPacientDTO)
        {

            if (userPacientDTO == null || id != userPacientDTO.DNI)
            {
                _logger.LogError("Error: no existeix pacient amb l'ID indicat o les dades introduïdes són incorrectes.");
                return BadRequest("Error: no existeix pacient amb l'ID indicat o les dades introduïdes són incorrectes.");
            }

            var existeixPacient = await _bbdd.Pacients.AsNoTracking().FirstOrDefaultAsync(p => p.DNI == id);

            if (existeixPacient == null){
                _logger.LogError("No existeix un pacient amb aquest DNI.");
                return NotFound("No existeix un pacient amb aquest DNI.");
            }

            Pacient pacient = _mapper.Map<Pacient>(userPacientDTO);

            _bbdd.Pacients.Update(pacient);
            await _bbdd.SaveChangesAsync();

            _logger.LogInformation("Pacient modificat exitosament.");
            return NoContent();

        }

        [HttpPatch("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateParcialPacient(string id, JsonPatchDocument<PacientCreateDTO> patchDto)
        {
            if (patchDto == null || id.Length < 9)
            {
                _logger.LogError("Error: no existeix el pacient amb l'ID indicat.");
                return BadRequest("Error: no existeix el pacient amb l'ID indicat.");
            }

            var pacient = await _bbdd.Pacients.AsNoTracking().FirstOrDefaultAsync(v => v.DNI == id);

            if (pacient == null)
            {
                _logger.LogError("Error: no existeix el pacient amb l'ID indicat.");
                return BadRequest("Error: no existeix el pacient amb l'ID indicat.");
            }

            PacientCreateDTO pacientdto = _mapper.Map<PacientCreateDTO>(pacient);

            patchDto.ApplyTo(pacientdto, ModelState);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Pacient modelo = _mapper.Map<Pacient>(pacientdto);

            _bbdd.Update(modelo);
            await _bbdd.SaveChangesAsync();

            _logger.LogInformation("Pacient actualitzat.");
            return NoContent();

        }

        public static bool CheckTS(String ts)
        {

            if (ts.Length != 14) return true;
            
            for (int i = 0; i < 14; i++)
            {
                if (i < 4 && !char.IsLetter(ts[i])) return true;
                if (i > 3 && !char.IsDigit(ts[i])) return true;
             
            }

            return false;

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

    }
}
