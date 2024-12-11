using HospitalAPI;
using HospitalApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDistributedMemoryCache();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy =>
        {
            policy.WithOrigins("https://localhost:4201", "https://localhost:7200", "https://localhost:4200", "https://127.0.0.1:4200", "https://127.0.0.2:4201")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddControllers().AddNewtonsoftJson();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAutoMapper(typeof(MapConfig));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.Authority = "https://login.oscarrovira.com/realms/Dream%20Team";
    options.Audience = "hospital-api";
    options.RequireHttpsMetadata = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidAudience = "hospital-api",
        ValidIssuer = "https://login.oscarrovira.com/realms/Dream%20Team",
        ValidateAudience = true,
        ValidateIssuer = true,
        RoleClaimType = ClaimTypes.Role
    };

    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = context =>
        {
            var user = context.Principal;

            // Extraer el campo `realm_access` del token.
            var realmAccess = user.FindFirst("realm_access")?.Value;
            if (!string.IsNullOrEmpty(realmAccess))
            {
                // Llamar a la función para extraer roles del campo `realm_access`.
                var roles = ExtractRolesFromRealmAccess(realmAccess);
                if (roles.Any())
                {
                    var identity = user.Identity as ClaimsIdentity;
                    foreach (var role in roles)
                    {
                        Console.WriteLine(role.ToString());
                        // Agregar los roles como claims de tipo `Role`.
                        identity?.AddClaim(new Claim(ClaimTypes.Role, role));
                    }
                }
            }

            return Task.CompletedTask;
        }
    };
    
});

static IEnumerable<string> ExtractRolesFromRealmAccess(string realmAccessJson)
{
    var roles = new List<string>();

    try
    {
        // Deserializar `realm_access` desde el token.
        var realmAccess = JsonConvert.DeserializeObject<Dictionary<string, dynamic>>(realmAccessJson);

        // Verificar si hay roles dentro de `realm_access`.
        if (realmAccess != null && realmAccess.ContainsKey("roles"))
        {
            var rolesArray = realmAccess["roles"];
            roles.AddRange(rolesArray.ToObject<List<string>>());
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al extraer roles de realm_access: {ex.Message}");
    }

    return roles;
}

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Hospital API", Version = "v1" });

    c.AddSecurityDefinition("Keycloak", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.OpenIdConnect,
        OpenIdConnectUrl = new Uri("https://login.oscarrovira.com/realms/Dream%20Team/.well-known/openid-configuration")
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Keycloak"
                }
            },
            new List<string> { "openid", "profile" }
        }
    });
});

builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(3000);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

var app = builder.Build();
app.UseHttpsRedirection();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Hospital API V1");
        c.RoutePrefix = "swagger";
        c.OAuthClientId("hospital-api");
        c.OAuthAppName("Hospital API");
        c.OAuthScopeSeparator(" ");
    });
}

app.UseSession();
app.UseRouting(); 
app.UseCors("AllowSpecificOrigin"); 
app.UseAuthentication(); 
app.UseAuthorization(); 
app.MapControllers();

app.Run();
