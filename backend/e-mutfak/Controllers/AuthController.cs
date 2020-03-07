using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Dapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Models;

namespace e_mutfak.Controllers
{
  [Route("auth")]
  [ApiController]
  public class AuthController : ControllerBase
    {
    private readonly IConfiguration _configuration;
    private readonly IHostingEnvironment _enviroment;
    private readonly SqlConnection conn;

    public AuthController(IConfiguration configuration, IHostingEnvironment environment)
    {
      this._configuration = configuration;
      this._enviroment = environment;
      conn = new SqlConnection(GetConnection());
    }

    private string GetConnection()
    {
      try
      {
        return _configuration["ConnectionStrings:eMutfakCnn"];
      }
      catch (Exception xp1)
      {
        return xp1.Message;
      }
    }

    public string CreateToken()
    {
      //security key
      string securityKey = "emutfak_jwt_security_key_2020";

      //symmetric security key
      var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKey));

      //signing credentials
      var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256Signature);

      //add claims
      var claims = new List<Claim>();
      claims.Add(new Claim(ClaimTypes.Role, "Administrator"));
      //claims.Add(new Claim(ClaimTypes.Role, "Reader")); // for multiple roles
      claims.Add(new Claim("OurCustomClaim", "OurCustomValue"));

      //create token
      var token = new JwtSecurityToken(
      issuer: "smesk.in",
      audience: "readers",
      expires: DateTime.Now.AddDays(1),
      signingCredentials: signingCredentials,
      claims: claims
  );
      //return token
      var newToken = new JwtSecurityTokenHandler().WriteToken(token);
      return newToken;
    }

    [Produces("application/json")]
    [HttpPost("login")]
    public ActionResult Login([FromBody] Employee model)
    //public ActionResult Login(string username, string password)
    {
      model = getUserKontrol(model);
      if (model != null)
      {
        model.jwt_key = CreateToken();
        return Ok(model);
      }
      else
      {
        return Unauthorized();
      }
    }
    private Employee getUserKontrol(Employee model)
    {
      string SQL = @"SELECT * FROM Employee 
                        WHERE emp_username = @login_id
                        AND emp_password =  @login_password
                        AND emp_password_control =  @login_password_control";

      var prm = new { login_id = model.emp_username, login_password = model.emp_password, login_password_control = model.emp_password_control };
      var db_rows = conn.Query<Employee>(SQL, prm);
      if (db_rows != null)
      {
        foreach (Employee item in db_rows)
        {
          return (item);
        }
        return null;
      }
      else return null;
    }



  }
}
