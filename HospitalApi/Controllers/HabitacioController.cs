using AutoMapper;
using HospitalApi.Data;
using HospitalAPI.DTO;
using HospitalAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

namespace HospitalAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]

    public class HabitacioController : ControllerBase
    {

        private readonly ILogger<HabitacioController> _logger;
        private readonly ApplicationDbContext _bbdd;
        private readonly IMapper _mapper;

        public HabitacioController(ILogger<HabitacioController> logger, ApplicationDbContext bbdd, IMapper mapper)
        {
            _logger = logger;
            _bbdd = bbdd;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<HabitacioDTO>>> GetHabitacions()
        {

            _logger.LogInformation("Obtenint les habitacions");

            IEnumerable<Habitacio> habList = await _bbdd.Habitacions.Include("Planta").Include("Llits").ToListAsync();

            return Ok(_mapper.Map<IEnumerable<HabitacioDTO>>(habList));

        }


        [HttpGet("id", Name = "GetHab")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<HabitacioDTO>> GetHabitacio(int id)
        {

            if (id == 0)
            {
                _logger.LogError("Error, no existeix la hab amb el id " + id);
                return BadRequest();
            }

            var hab = await _bbdd.Habitacions.FirstOrDefaultAsync(h => h.Id == id);

            if (hab == null) return NotFound();

            return Ok(_mapper.Map<HabitacioDTO>(hab));

        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<HabitacioCreateDTO>> PostHabitacio([FromBody] HabitacioCreateDTO userHabDTO)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (userHabDTO == null) return BadRequest(userHabDTO);

            var planta = await _bbdd.Plantes.FindAsync(userHabDTO.PlantaId);

            if (planta == null) return BadRequest("El PlantaId proporcionado no existe.");


            try
            {
                SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder();

                using (SqlConnection connection = new SqlConnection(builder.ConnectionString))
                {

                    builder.DataSource = "<your_server.database.windows.net>";
                    builder.UserID = "<your_username>";
                    builder.Password = "<your_password>";
                    builder.InitialCatalog = "<your_database>";

                    connection.Open();

                    String sql = "SELECT name, collation_name FROM sys.databases";

                    using (SqlCommand command = new SqlCommand(sql, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                //Console.WriteLine("{0} {1}", reader.GetString(0), reader.GetString(1));
                            }
                        }
                    }
                }
            }
            catch (SqlException e)
            {
                Console.WriteLine(e.ToString());
            }

            //string query = "SELECT COUNT(Habitacions) FROM Planta NATURAL JOIN Habitacio WHERE PlantaId = 0";
            //var maxPlantas = await _bbdd.planta
            //.FromSql(query, id);
            //if (Habitacions > maxPlantas) return BadRequest("Error: no es poden afegir més habitacions, s'ha arribat al màxim de la planta.");

            Habitacio habitacio = _mapper.Map<Habitacio>(userHabDTO);
            habitacio.PlantaId = planta.Id;

            await _bbdd.Habitacions.AddAsync(habitacio);
            await _bbdd.SaveChangesAsync();

            return CreatedAtRoute("GetHab", _mapper.Map<HabitacioCreateDTO>(habitacio));

        }

        [HttpDelete("id")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteHabitacio(int id)
        {
            if (id == 0) return BadRequest(ModelState);

            var hab = await _bbdd.Habitacions.FirstOrDefaultAsync(h => h.Id == id);

            if (hab == null) return NotFound();

            _bbdd.Habitacions.Remove(hab);
            await _bbdd.SaveChangesAsync();

            return NoContent();

        }

        [HttpPut("id")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateHabitacio(int id, [FromBody] HabitacioDTO userHabDTO)
        {

            if (userHabDTO == null || id != userHabDTO.Id) return BadRequest();

            Habitacio habitacio = _mapper.Map<Habitacio>(userHabDTO);

            _bbdd.Habitacions.Update(habitacio);
            await _bbdd.SaveChangesAsync();


            return NoContent();

        }
    }
}
