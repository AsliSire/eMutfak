using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Models;
using Newtonsoft.Json.Linq;

namespace e_mutfak.Controllers
{
  [Route("api/default")]
  [ApiController]
  public class DefaultController : Controller
  {
    private readonly IConfiguration _configuration;
    private readonly IHostingEnvironment _enviroment;
    private readonly SqlConnection conn;

    public DefaultController(IConfiguration configuration, IHostingEnvironment environment)
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

    [HttpGet("products")]
    public IActionResult Product()
    {
      try
      {
          string SQL = @"SELECT PR.*, CR.cur_name FROM Product PR
                         LEFT OUTER JOIN Currency CR
                         ON CR.Id = PR.prd_currency_unit";
          try
          {
            var db_rows = conn.Query<Product>(SQL);
            return Ok(db_rows);
          }
          catch (Exception xp1)
          {
            return BadRequest(xp1.Message);
          }        
      }
      catch
      {
        return BadRequest("Veriler Görüntülenemedi. Eksik Veri Gönderildi.");
      }
    }


    [HttpGet("productdetail")]
    public IActionResult ProductDetail(int Id)
    {
      try
      {
        if (Id > 0)
        {
          string SQL = @"  SELECT PR.*, CR.cur_name FROM Product PR LEFT OUTER JOIN Currency CR ON CR.Id = PR.prd_currency_unit WHERE PR.Id = @Id";
          var prm = new { Id = Id };
          try
          {
            var db_rows = conn.Query<Product>(SQL, prm);
            return Ok(db_rows);
          }
          catch (Exception xp1)
          {
            return BadRequest(xp1.Message);
          }
        }
        else
        {
          return BadRequest("Veriler Görüntülenemedi. Eksik Veri Gönderildi.");
        }
      }
      catch
      {
        return BadRequest("Veriler Görüntülenemedi. Eksik Veri Gönderildi.");
      }
    }

    [Produces("application/json")]
    [HttpPost("saveproduct")]
    public IActionResult SaveProduct([FromBody] Product model)
    {
      try
      {
        if (model != null)
        {
          var conn = new SqlConnection(GetConnection());
          var query = @"INSERT INTO Product
         (rec_tck_no,
          rec_name_surname,
          rec_password,
          rec_password_control,
          prd_price,
          prd_currency_unit,
          prd_calculated_value
         )
    VALUES
         (
          @rec_tck_no,
          @rec_name_surname,
          @rec_password,
          @rec_password_control,
          @prd_price,
          @prd_currency_unit,
          @prd_calculated_value
         )";
          if (model.Id > 0)
          {
            query = @"UPDATE Product SET
          rec_tck_no = @rec_tck_no,
          rec_name_surname = @rec_name_surname,
          rec_password = @rec_password,
          rec_password_control = @rec_password_control,
          prd_price = @prd_price,
          prd_currency_unit = @prd_currency_unit,
          prd_calculated_value = @prd_calculated_value
    WHERE Id=@Id ";
          }
          var prm = new
          {
            rec_tck_no = model.rec_tck_no,
            rec_name_surname = model.rec_name_surname,
            rec_password = model.rec_password,
            rec_password_control = model.rec_password_control,
            prd_price = model.prd_price,
            prd_currency_unit = model.prd_currency_unit,
            prd_calculated_value = model.prd_calculated_value,
            Id = model.Id
          };
          var affectRows = conn.Execute(query, prm);
          return Ok("ok");
        }
        else
        {
          return BadRequest("Eksik veya hatalı bilgi girildi.");
        }
      }
      catch
      {
        return BadRequest("Eksik veya hatalı bilgi girildi.");
      }
    }

    [HttpPost("deleteproduct")]
    public IActionResult DeleteProduct([FromBody] int Id)
    {
      try
      {
        if (Id > 0)
        {
          string SQL = @" Delete FROM Product WHERE Id = @Id";
          var prm = new
          {
            Id = Id,
          };
          var affectRows = conn.Execute(SQL, prm);
          return Ok("Kayıt Başarıyla Silindi");
        }
        else
        {
          return BadRequest("Kayıt silinemedi. Eksik Veri Gönderildi.");
        }
      }
      catch
      {
        return BadRequest("Kayıt silinemedi. Eksik Veri Gönderildi.");
      }
    }


  }
}
